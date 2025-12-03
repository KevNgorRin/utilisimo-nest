import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly nodeEnv: string) {}

    catch(exception: unknown, host: ArgumentsHost) {
        if (!this.nodeEnv.startsWith('prod')) {
            console.log(exception) // Just for development and testing
        }

        const responseData = {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            code: 'internal_server_error',
            message: 'Internal Server Error',
            details: null,
            errors: null,
        }

        if (exception instanceof HttpException) {
            responseData.statusCode = exception.getStatus()
            responseData.message = null

            const exceptionData = exception.getResponse() as
                | string
                | {
                      message: string
                      code: string
                      details: object
                      errors: { field: string; errors: string[] }
                  }

            if (typeof exceptionData === 'object') {
                responseData.code = exceptionData.code || exceptionData.message
                responseData.details = exceptionData.details
                responseData.errors = exceptionData.errors
            } else {
                responseData.code = exceptionData
            }
        }

        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        response.status(responseData.statusCode).json(responseData)
    }
}
