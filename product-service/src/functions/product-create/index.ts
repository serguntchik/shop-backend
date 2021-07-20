import { handlerPath } from '@libs/handlerResolver';
import { vpcConfig } from '@libs/lambda';

import schema from './schema';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'post',
                path: 'products',
                request: {
                    schema: {
                        'application/json': schema
                    }
                },
                cors: true,
            }
        }
    ],
    vpc: vpcConfig,
}
