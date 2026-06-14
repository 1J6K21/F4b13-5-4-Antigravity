import boto3
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configuration
BUCKET_NAME = 'your-bucket-name'
DOWNLOAD_DIR = './downloaded_images'
MAX_WORKERS = 50 # Adjust based on your system and network capabilities

def download_image(s3_client, bucket_name, object_key, download_dir):
    """
    Downloads a single image from S3.
    """
    try:
        # Create the local file path (you may need to replicate the S3 folder structure)
        local_file_path = os.path.join(download_dir, os.path.basename(object_key))
        
        # Download the file
        s3_client.download_file(bucket_name, object_key, local_file_path)
        return object_key, True, None
    except Exception as e:
        return object_key, False, str(e)

def download_images_in_parallel(bucket_name, prefix='', max_items=10000):
    """
    Downloads up to `max_items` images from the specified S3 bucket in parallel.
    """
    if not os.path.exists(DOWNLOAD_DIR):
        os.makedirs(DOWNLOAD_DIR)

    # Initialize the S3 client
    s3_client = boto3.client('s3')
    
    # Use paginator to efficiently get the list of objects (since it's a large number)
    paginator = s3_client.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket=bucket_name, Prefix=prefix)

    # Collect object keys up to max_items
    object_keys = []
    for page in pages:
        if 'Contents' in page:
            for obj in page['Contents']:
                # Optional: Filter for specific image extensions if needed
                # if not obj['Key'].lower().endswith(('.png', '.jpg', '.jpeg')): continue
                
                # Skip directories themselves
                if obj['Key'].endswith('/'):
                    continue
                
                object_keys.append(obj['Key'])
                if len(object_keys) >= max_items:
                    break
        if len(object_keys) >= max_items:
            break

    print(f"Found {len(object_keys)} objects. Starting parallel download...")

    success_count = 0
    failure_count = 0

    # Parallelize the downloads using ThreadPoolExecutor
    # I/O bound tasks like downloading from network benefit greatly from threads
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        # Submit all download tasks to the executor
        future_to_key = {
            executor.submit(download_image, s3_client, bucket_name, key, DOWNLOAD_DIR): key 
            for key in object_keys
        }

        # Process results as they complete
        for future in as_completed(future_to_key):
            key = future_to_key[future]
            try:
                object_key, success, error_msg = future.result()
                if success:
                    success_count += 1
                else:
                    failure_count += 1
                    print(f"Failed to download {object_key}: {error_msg}")
            except Exception as exc:
                failure_count += 1
                print(f"{key} generated an exception: {exc}")

    print(f"\nDownload Summary:")
    print(f"Successfully downloaded: {success_count} images")
    print(f"Failed downloads: {failure_count} images")

if __name__ == "__main__":
    # Ensure you have your AWS credentials configured (e.g., via `aws configure` or environment variables)
    # Replace BUCKET_NAME and adjust 'prefix' to point to your specific folder in the bucket
    download_images_in_parallel(BUCKET_NAME, prefix='', max_items=10000)
