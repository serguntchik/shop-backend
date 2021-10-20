import { All, Controller, Get, HttpStatus, Param, Req, Res } from '@nestjs/common';

import { Request, Response } from 'express';

import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('')
    healthCheck(): any {
        return {
            statusCode: HttpStatus.OK,
            message: 'OK',
        };
    }

    @All(':serviceName')
    async callService(@Param('serviceName') serviceName: string, @Req() request: Request, @Res() response: Response) {
        try {
            const result = await this.appService.callService(serviceName, request);
            response.status(result.status).json(result.data)
        } catch (error) {
            response.status(error.response.status).json(error.response.data);
        }
    }
}
