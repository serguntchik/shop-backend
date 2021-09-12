import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/import-products-file';
import importFileParser from '@functions/import-file-parser';

const serverlessConfiguration: AWS = {
    service: 'import-service',
    frameworkVersion: '2',
    custom: {
        importProductsAuthorizerLambda: {
            'Fn::ImportValue': 'authorization-service-${sls:stage}-ImportProductsAuthorizerLambda',
        },
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true,
        }
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
            S3_BUCKET: 'product-service-dev-csv',
            SQS: {
                Ref: 'SQSQueue',
            },
        },
        lambdaHashingVersion: '20201221',
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: 's3:ListBucket',
                Resource: 'arn:aws:s3:::${self:provider.environment.S3_BUCKET}',
            },
            {
                Effect: 'Allow',
                Action: 's3:GetObject',
                Resource: 'arn:aws:s3:::${self:provider.environment.S3_BUCKET}/*',
            },
            {
                Effect: 'Allow',
                Action: 's3:PutObject',
                Resource: 'arn:aws:s3:::${self:provider.environment.S3_BUCKET}/*',
            },
            {
                Effect: 'Allow',
                Action: 's3:DeleteObject',
                Resource: 'arn:aws:s3:::${self:provider.environment.S3_BUCKET}/*',
            },
            {
                Effect: 'Allow',
                Action: 'sqs:SendMessage',
                Resource: {
                    'Fn::GetAtt': [
                        'SQSQueue',
                        'Arn',
                    ],
                },
            },
        ],
    },
    resources: {
        Resources: {
            ApiGatewayUnauthorizedResponse: {
                Type: 'AWS::ApiGateway::GatewayResponse',
                Properties: {
                    ResponseParameters: {
                        'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
                        'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
                    },
                    ResponseType: 'UNAUTHORIZED',
                    RestApiId: {
                        Ref: 'ApiGatewayRestApi',
                    },
                    StatusCode: '401',
                },
            },
            ApiGatewayForbiddenResponse: {
                Type: 'AWS::ApiGateway::GatewayResponse',
                Properties: {
                    ResponseParameters: {
                        'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
                        'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
                    },
                    ResponseType: 'ACCESS_DENIED',
                    RestApiId: {
                        Ref: 'ApiGatewayRestApi',
                    },
                    StatusCode: '403',
                },
            },
            SQSQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'catalog-items-queue',
                },
            },
        },
        Outputs: {
            CatalogItemsQueueQualifiedArn: {
                Description: 'A queue that emits products to be created in the database',
                Value: {
                    'Fn::GetAtt': [
                        'SQSQueue',
                        'Arn',
                    ],
                },
                Export: {
                    Name: {
                        'Fn::Sub': '${AWS::StackName}-CatalogItemsQueue',
                    },
                },
            },
        },
    },
    functions: { importFileParser, importProductsFile },
};

module.exports = serverlessConfiguration;
