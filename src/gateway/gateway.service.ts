import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class GatewayService {
  constructor(private readonly httpService: HttpService) {}

  async forwardRequest(url: string, method: string, data?: any, query?: any, headers?: any) {  
    try {
      const customHeaders = { ...headers };
      delete customHeaders['content-length'];
      const response = await lastValueFrom(
        this.httpService.request({
          url,
          method,
          data,
          headers: customHeaders,
          params: query,
        }),
      );
      console.log('Response from service:', response);
      return response.data;
    } catch (error) {
      console.log('Error while forwarding request:', error); // Log error details
      throw error.response?.data || new Error('Error forwarding request');
    }
  }
  
}
