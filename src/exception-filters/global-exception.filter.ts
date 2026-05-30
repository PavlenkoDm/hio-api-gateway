import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // // Временный лог для диагностики — удалим после
    // console.log('EXCEPTION TYPE:', exception?.constructor?.name);
    // console.log('EXCEPTION:', JSON.stringify(exception, null, 2));
    // console.log('IS HTTP:', exception instanceof HttpException);
    // console.log('STATUS:', exception?.status);
    // console.log('RESPONSE:', exception?.response);
    // console.log('EXCEPTION STACK:', exception?.stack);
    // // Временный лог конец
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const path = request.url;
    let message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal HIO api-gateway server error (from Global Exception Filter)';

    if (Array.isArray(exception?.response?.message)) {
      message =
        exception.message + ', ' + exception.response.message.join(', ');
    }

    const logMessage = {
      status,
      message,
      path,
      timestamp: new Date().toISOString(),
      method: request.method,
      body: this.anonimyzeReqBody(request.body),
      query: request.query,
      params: request.params,
      stack: exception.stack,
    };

    if (process.env.NODE_ENV != 'test') {
      console.error(logMessage);
    }

    response.status(status).json({
      status,
      timestamp: new Date().toISOString(),
      path,
      message,
    });
  }

  private anonimyzeReqBody(body: object): object {
    const requestBody = JSON.stringify(body).replace(
      /"password":"[^"]*"/,
      '"password":"password"',
    );

    return JSON.parse(requestBody);
  }
}
