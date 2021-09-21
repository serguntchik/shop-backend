import { All, Controller, Param, Req } from '@nestjs/common';

import { Request } from 'express';

import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @All(':serviceName')
    async callService(@Param('serviceName') serviceName: string, @Req() request: Request) {
        try {
            const result = await this.appService.callService(serviceName, request);
            return request.res.status(result.status).json(result.data)
        } catch (error) {
            return request.res.status(error.response.status).json(error.message);
        }
    }
}
