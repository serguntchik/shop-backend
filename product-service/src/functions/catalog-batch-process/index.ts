import { handlerPath } from '@libs/handlerResolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            sqs: {
                batchSize: 5,
                arn: '${self:custom.catalogItemsQueue}',
            },
        },
    ],
}
