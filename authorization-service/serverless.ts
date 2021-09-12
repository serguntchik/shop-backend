import type { AWS } from '@serverless/typescript';

import basicAuthorizer from '@functions/basic-authorizer';

const serverlessConfiguration: AWS = {
    service: 'authorization-service',
    frameworkVersion: '2',
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true,
        }
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
        lambdaHashingVersion: '20201221',
    },
    resources: {
        Outputs: {
            ImportProductsAuthorizerLambda: {
                Description: 'An authorization lambda function that authorizes importing products file requests',
                Value: {
                    'Fn::GetAtt': [
                        'BasicAuthorizerLambdaFunction',
                        'Arn',
                    ],
                },
                Export: {
                    Name: {
                        'Fn::Sub': '${AWS::StackName}-ImportProductsAuthorizerLambda',
                    },
                },
            },
        },
    },
    functions: { basicAuthorizer },
};

module.exports = serverlessConfiguration;
