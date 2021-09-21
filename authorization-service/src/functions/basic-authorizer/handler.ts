import { Handler } from 'aws-lambda';
import {APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent} from 'aws-lambda/trigger/api-gateway-authorizer';

const generatePolicy: (principalId: string, resource: string, effect: string) => APIGatewayAuthorizerResult = (principalId, resource, effect) => ({
    principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            },
        ],
    },
});

const basicAuthorizer: Handler<APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult> = (event, _ctx, callback) => {
    console.log('Import products file authorization event', event);

    if (event.type !== 'TOKEN') {
        callback('Unauthorized');
        return;
    }

    try {
        const authorizationToken = event.authorizationToken;
        const [, encodedCredentials] = authorizationToken.split(' ');
        const [username, password] = Buffer.from(encodedCredentials, 'base64').toString('utf-8').split(':');

        console.log(`Authorization username: ${username} and password: ${password}`);

        const storedPassword = process.env[username];
        const effect = !storedPassword || storedPassword !== password ? 'Deny' : 'Allow';
        const policy = generatePolicy(encodedCredentials, event.methodArn, effect);

        callback(null, policy);
    } catch (error) {
        callback(`Unauthorized: ${error.message}`);
    }
}

export const main = basicAuthorizer;
