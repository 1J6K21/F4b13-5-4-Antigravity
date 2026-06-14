import os
import boto3
from concurrent.futures import ThreadPoolExecutor, as_completed
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants
BUCKET_NAME = 'your-s3-bucket-name'
PREFIX = 'path/to/images/' # Prefix if images are in a folder
DOWNLOAD_DIR = './downloaded_images'
MAX_WORKERS = 50 # Adjust based on your network and CPU
MAX_IMAGES_TO_DOWNLOAD = 10000

def download_image(bucket_name, object_key, download_path):
    """Downloads a single object from S3."""
    # It's important to create the s3 client inside the thread
    # as boto3 clients are not thread-safe in all scenarios.
    s3_client = boto3.client('s3')
    try:
        s3_client.download_file(bucket_name, object_key, download_path)
        return True, object_key
    except Exception as e:
        logger.error(f"Error downloading {object_key}: {e}")
        return False, object_key

def main():
    if not os.path.exists(DOWNLOAD_DIR):
        os.makedirs(DOWNLOAD_DIR)

    # Initialize client for pagination
    s3_client = boto3.client('s3')
    
    # 1. Collect up to MAX_IMAGES_TO_DOWNLOAD object keys
    object_keys = []
    logger.info(f"Listing objects in bucket '{BUCKET_NAME}' with prefix '{PREFIX}'...")
    
    # Using paginator to handle buckets with many objects
    paginator = s3_client.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket=BUCKET_NAME, Prefix=PREFIX)
    
    for page in pages:
        if 'Contents' in page:
            for obj in page['Contents']:
                # Skip directories (if prefix ends with /)
                if obj['Key'].endswith('/'):
                    continue
                object_keys.append(obj['Key'])
                
                if len(object_keys) >= MAX_IMAGES_TO_DOWNLOAD:
                    break
        if len(object_keys) >= MAX_IMAGES_TO_DOWNLOAD:
            break
            
    logger.info(f"Found {len(object_keys)} objects to download.")

    # 2. Download in parallel using ThreadPoolExecutor
    success_count = 0
    failure_count = 0
    
    logger.info(f"Starting download using {MAX_WORKERS} workers...")
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        # Submit all download tasks
        futures = {}
        for key in object_keys:
            # Create a local file path
            local_filename = os.path.basename(key)
            if not local_filename:
                # Fallback if no basename can be extracted
                local_filename = key.replace('/', '_')
            local_path = os.path.join(DOWNLOAD_DIR, local_filename)
            
            future = executor.submit(download_image, BUCKET_NAME, key, local_path)
            futures[future] = key

        # Process results as they complete
        for future in as_completed(futures):
            success, key = future.result()
            if success:
                success_count += 1
            else:
                failure_count += 1
                
            # Optional: print progress every 1000 images
            if (success_count + failure_count) % 1000 == 0:
                logger.info(f"Progress: {success_count + failure_count}/{len(object_keys)} downloaded.")

    logger.info(f"Download complete! Successfully downloaded: {success_count}, Failed: {failure_count}")

if __name__ == '__main__':
    main()
