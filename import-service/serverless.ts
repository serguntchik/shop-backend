import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/import-products-file';
import importFileParser from '@functions/import-file-parser';

const serverlessConfiguration: AWS = {
    service: 'import-service',
    frameworkVersion: '2',
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true,
        },
        s3Bucket: 'product-service-dev-csv',
    },
    plugins: ['serverless-webpack'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        region: "eu-west-1",
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        },
        lambdaHashingVersion: '20201221',
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: 's3:ListBucket',
                Resource: 'arn:aws:s3:::${self:custom.s3Bucket}',
            },
            {
                Effect: 'Allow',
                Action: 's3:GetObject',
                Resource: 'arn:aws:s3:::${self:custom.s3Bucket}/*',
            },
            {
                Effect: 'Allow',
                Action: 's3:PutObject',
                Resource: 'arn:aws:s3:::${self:custom.s3Bucket}/*',
            },
            {
                Effect: 'Allow',
                Action: 's3:DeleteObject',
                Resource: 'arn:aws:s3:::${self:custom.s3Bucket}/*',
            },
        ],
    },
    functions: { importFileParser, importProductsFile },
};

module.exports = serverlessConfiguration;
