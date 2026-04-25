

import boto3
from new_backend import settings
from botocore.exceptions import NoCredentialsError

def test(self, file, content_type='image/jpeg'):
        s3 = boto3.client('s3',
                            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                            region_name=settings.AWS_S3_REGION_NAME,
                            endpoint_url=settings.AWS_S3_ENDPOINT_URL
                        )
        try:
            # Generate a unique filename or use existing logic
            filename = 'generated_filename.jpg'

            # Upload the file to the S3 bucket
            s3.upload_fileobj(file, settings.AWS_STORAGE_BUCKET_NAME, filename,
                            content_type=content_type)

            # Generate the URL for the uploaded file
            file_url = f"{settings.AWS_S3_ENDPOINT_URL}/{settings.AWS_STORAGE_BUCKET_NAME}/{filename}"
            print(file_url)
            return file_url

        except NoCredentialsError:
            # Handle S3 credential errors
            raise