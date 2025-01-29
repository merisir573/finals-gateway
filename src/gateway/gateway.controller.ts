import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { GatewayService } from './gateway.service';

@Controller('api/v1')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @All('*')
  async forward(@Req() req: Request, @Res() res: Response) {
    console.log('Received request path:', req.path); // Log the path for debugging

    const targetServiceUrl = this.mapRouteToService(req.path);
    const method = req.method;
    const data = req.body;
    const query = req.query; // Capture query parameters
    const headers = req.headers

    console.log('Target service URL:', targetServiceUrl);

    try {
      const response = await this.gatewayService.forwardRequest(targetServiceUrl, method, data, query, headers);
      res.status(200).json(response);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  private mapRouteToService(path: string): string {
    const normalizedPath = path.replace(/^\/api\/v1/, ''); // Removes '/api/v1' from the start of the path

  if (normalizedPath.startsWith('/doctor')) {
    return `https://doctor-service.onrender.com${normalizedPath}`;
  } else if (normalizedPath.startsWith('/pharmacy')) {
    return `https://pharmacy-service.onrender.com${normalizedPath}`;
  } else if (normalizedPath.startsWith('/medicine')) {
    return `https://finals-medicine.onrender.com${normalizedPath}`;
  } else if (normalizedPath.startsWith('/auth')) {
    return `https://auth-service.onrender.com${normalizedPath}`;
  }

    throw new Error('Route not found');
  }
}
