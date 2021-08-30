import type { AWS } from '@serverless/typescript';

import catalogBatchProcess from '@functions/catalog-batch-process';
import products from '@functions/products-list';
import getProductById from '@functions/product-item';
import createProduct from '@functions/product-create';

const serverlessConfiguration: AWS = {
    service: 'product-service',
    frameworkVersion: '2',
    custom: {
        catalogItemsQueue: {
            'Fn::ImportValue': 'import-service-${sls:stage}-CatalogItemsQueue',
        },
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true,
        },
    },
    plugins: ['serverless-dotenv-plugin', 'serverless-webpack'],
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
            SNS: {
                Ref: 'SNSTopic',
            },
        },
        lambdaHashingVersion: '20201221',
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: 'sns:Publish',
                Resource: {
                    Ref: 'SNSTopic',
                },
            },
        ],
    },
    resources: {
        Resources: {
            SNSTopic: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    TopicName: 'create-product-topic',
                },
            },
            SNSSubscriptionForExpensiveAutos: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Endpoint: 'fizteh.volkov@gmail.com',
                    Protocol: 'email',
                    TopicArn: {
                        Ref: 'SNSTopic',
                    },
                    FilterPolicy: {
                        batchPrice: ['high']
                    },
                },
            },
            SNSSubscriptionForCheapAutos: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Endpoint: 'volkov.s@n-t.io',
                    Protocol: 'email',
                    TopicArn: {
                        Ref: 'SNSTopic',
                    },
                    FilterPolicy: {
                        batchPrice: ['low']
                    },
                },
            },
        },
    },
    functions: { catalogBatchProcess, createProduct, getProductById, products },
};

module.exports = serverlessConfiguration;
