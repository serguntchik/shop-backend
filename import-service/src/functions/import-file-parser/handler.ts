import 'source-map-support/register';

import { middyfy } from '@libs/lambda';

import type { Handler, S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';
import csv from 'csv-parser';

const importFileParser: Handler<S3Event, void> = async (event) => {
    const bucket = process.env.S3_BUCKET;
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const sqs = new AWS.SQS();

    console.log('Parse import file request', event);

    try {
        for (const record of event.Records) {
            await new Promise<void>((resolve, reject) => {
                s3
                    .getObject({
                        Bucket: bucket,
                        Key: record.s3.object.key,
                    })
                    .createReadStream()
                    .pipe(csv())
                    .on('data', (data) => sqs.sendMessage({
                        QueueUrl: process.env.SQS,
                        MessageBody: JSON.stringify(data),
                    }, (error, data) => {
                        console.log('error', error);
                        console.log('data', data);
                    }))
                    .on('end', () => resolve())
                    .on('error', (error) => reject(error));
            });
            await s3.copyObject({
                Bucket: bucket,
                CopySource: `${bucket}/${record.s3.object.key}`,
                Key: record.s3.object.key.replace('uploaded', 'parsed'),
            }).promise();
            await s3.deleteObject({
                Bucket: bucket,
                Key: record.s3.object.key,
            }).promise();

            console.log(`Record ${record.s3.object.key} has been moved to the /parsed folder`);
        }
    } catch (error) {
        console.log(error);
    }
}

export const main = middyfy(importFileParser);
