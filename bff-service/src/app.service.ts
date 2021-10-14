import { CACHE_MANAGER, HttpService, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { AxiosRequestConfig, Method } from 'axios';

import { Cache } from 'cache-manager';

import { Request } from 'express';

import { tap } from 'rxjs/operators';

interface CallServiceResult {
    status: number;
    data: any;
}

@Injectable()
export class AppService {
    private productsCacheKey = 'products';
    private productsCacheTtl = 2 * 60;

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly httpService: HttpService) { }

    async callService(serviceName: string, request: Request): Promise<CallServiceResult> {
        const serviceUrl = process.env[serviceName];

        if (!serviceUrl) {
            return Promise.reject({
                response: {
                    status: HttpStatus.BAD_GATEWAY,
                    data: 'Cannot process request'
                },
            });
        }

        if (AppService.requestIsCacheable(request)) {
            const products = await this.cacheManager.get(this.productsCacheKey);

            if (products) {
                return Promise.resolve({
                    status: HttpStatus.OK,
                    data: products,
                });
            }
        }

        const config: AxiosRequestConfig = {
            url: `${serviceUrl}${request.originalUrl}`,
            params: request.params,
            method: request.method as Method,
        };

        if (Object.keys(request.body).length > 0) {
            config.data = request.body;
        }

        return this.httpService.request(config).pipe(tap((resp) => {
            if (AppService.requestIsCacheable(request)) {
                this.cacheManager.set(this.productsCacheKey, resp.data, { ttl: this.productsCacheTtl });
            }
        })).toPromise();
    }

    private static requestIsCacheable(request: Request): boolean {
        return request.originalUrl === '/products' && request.method === 'GET';
    }
}
