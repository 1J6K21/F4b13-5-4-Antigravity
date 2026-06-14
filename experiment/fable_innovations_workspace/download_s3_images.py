import boto3
import os
import concurrent.futures
from botocore.exceptions import ClientError

def download_image(bucket_name, object_key, download_dir):
    """Downloads a single image from S3."""
    s3 = boto3.client('s3')
    local_file_path = os.path.join(download_dir, os.path.basename(object_key))
    try:
        s3.download_file(bucket_name, object_key, local_file_path)
        return object_key, True, None
    except ClientError as e:
        return object_key, False, str(e)

def download_images_parallel(bucket_name, object_keys, download_dir, max_workers=50):
    """Downloads a list of images in parallel using ThreadPoolExecutor."""
    os.makedirs(download_dir, exist_ok=True)
    
    results = []
    # Using ThreadPoolExecutor because S3 downloads are I/O bound
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(download_image, bucket_name, key, download_dir): key for key in object_keys}
        
        for future in concurrent.futures.as_completed(futures):
            key, success, err = future.result()
            if success:
                print(f"Downloaded: {key}")
            else:
                print(f"Failed: {key} - {err}")
            results.append((key, success, err))
    
    return results

if __name__ == "__main__":
    BUCKET = "your-s3-bucket-name"
    DOWNLOAD_DIR = "./downloaded_images"
    
    # 1. Fetch up to 10,000 image keys from the bucket
    s3_client = boto3.client('s3')
    paginator = s3_client.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket=BUCKET)
    
    object_keys = []
    for page in pages:
        if 'Contents' in page:
            for obj in page['Contents']:
                # Filter for image extensions (adjust as needed)
                if obj['Key'].lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif')):
                    object_keys.append(obj['Key'])
                if len(object_keys) >= 10000:
                    break
        if len(object_keys) >= 10000:
            break
            
    print(f"Found {len(object_keys)} images. Starting parallel download with 50 workers...")
    
    # 2. Download them in parallel
    download_images_parallel(BUCKET, object_keys, DOWNLOAD_DIR, max_workers=50)
