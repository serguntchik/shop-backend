import { handlerPath } from '@libs/handlerResolver';
import { vpcConfig } from '@libs/lambda';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'products',
                cors: true,
            }
        }
    ],
    vpc: vpcConfig,
}
