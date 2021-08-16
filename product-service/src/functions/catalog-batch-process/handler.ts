import 'source-map-support/register';

import { middyfy } from '@libs/lambda';

import type { Handler } from 'aws-lambda';
import { SQSEvent } from 'aws-lambda/trigger/sqs';
import AWS from 'aws-sdk';

import { Product } from '.prisma/client';

import prisma from '../../prisma/client';

const catalogBatchProcess: Handler<SQSEvent, void> = async (event) => {
    const autos = event.Records.map(( { body } ) => JSON.parse(body));
    const savedAutos: Array<Product & { stocks: { count: number } | null }> = [];
    const sns = new AWS.SNS({ region: 'eu-west-1' });

    console.log('Catalog batch process request', autos);

    try {
        for (const auto of autos) {
            savedAutos.push(await prisma.product.create({
                data: {
                    title: auto.title,
                    description: auto.description,
                    price: parseInt(auto.price),
                    stocks: {
                        create: {
                            count: parseInt(auto.count),
                        }
                    },
                },
                include: {
                    stocks: {
                        select: {
                            count: true,
                        }
                    }
                },
            }));
        }

        sns.publish({
            Subject: 'New autos have been added to the database',
            Message: JSON.stringify(savedAutos),
            TopicArn: process.env.SNS,
        }, (error) => {
            if (error) {
                console.log('Failed to publish the autos to sns', error);
            }
        });
    } catch (error) {
        console.log(error);
    } finally {
        prisma.$disconnect();
    }
}

export const main = middyfy(catalogBatchProcess );
