from google.cloud import storage
from django.conf import settings

def upload_file_to_gcs(file, bucket_name, destination_blob_name=None):
    """Uploads a file to the Google Cloud Storage bucket."""
    client = storage.Client.from_service_account_json(settings.GOOGLE_APPLICATION_CREDENTIALS)
    bucket = client.get_bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
     
    blob.upload_from_file(file)
    return blob.public_url
