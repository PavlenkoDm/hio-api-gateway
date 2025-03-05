import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  // HttpException,
  // HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const resContext = ctx.getContext();
    const resData = ctx.getData();

    const errorResponse = exception.getError();

    console.log(host);
    console.log(ctx);
    console.log(resContext);
    console.log(resData);
    console.log(errorResponse);

    // const status =
    //   exception.status || HttpStatus.INTERNAL_SERVER_ERROR;

    // // Возвращаем HTTP-ответ
    // response.status(status).json({
    //   statusCode: status,
    //   message: errorResponse?.message || 'Internal Server Error',
    // });
  }
}
