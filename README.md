Thumbnail Generator
===========================

This is a service that watches a S3 bucket for new photos coming in, and creates thumbnails for those photos (and saves them in a different folder).
The WebPage allows to upload the items to S3 bucket and view all the generated thumbnails.

## Getting Started

```
1) Create account in AWS S3.
2) Create a bucket in AWS S3
3) Inside the bucket create three folders: one to upload images, one to keep the backup of uploaded iamges and other to keep the thumbnail of images.
```

### Prerequisites

create 'aws-config.json' file at root with below data
```
{
    "aws_access_key_id": YOUR_AWS_ACCESS_KEY_ID,
    "aws_secret_access_key": YOUR_AWS_SECRET_ACCESS_KEY,
    "aws_region": YOUR_REGION,
    "s3bucket": YOUR_S3_BUCKET_NAME,
    "originalFolder": YOUR_FOLDER_NAME_TO_UPLOAD_IMAGES,
    "backupFolder": YOUR_FOLDER_NAME_TO_KEEP_BACKUP_OF_UPLOADED_IMAGES,
    "displayFolder": YOUR_FOLDER_NAME_TO_KEEP_THUMBNAILS
}
```

### Installing

Cd into the repository and run the below commands to install the requisite.

```
1) brew install python
2) brew install pip
3) brew install imagemagick
4) npm install
```

### Running

After installing above modules run 'npm start' and then hit below url
http://localhost:3000/
