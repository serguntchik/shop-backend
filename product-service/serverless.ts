import type { AWS } from '@serverless/typescript';

import products from '@functions/products-list';
import getProductById from '@functions/product-item';

const serverlessConfiguration: AWS = {
    service: 'product-service',
    frameworkVersion: '2',
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true,
        },
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
    },
    functions: { getProductById, products },
};

module.exports = serverlessConfiguration;
