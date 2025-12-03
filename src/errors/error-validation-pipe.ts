import {
    BadRequestException,
    ValidationPipe,
    ValidationPipeOptions,
} from '@nestjs/common'

import { ValidationError } from '@/enums/validation-errors.enum'
import { validationMessages } from '@/errors/validation-messages'

export class ErrorValidationPipe extends ValidationPipe {
    constructor(options?: ValidationPipeOptions) {
        super({
            transform: true,
            whitelist: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            forbidNonWhitelisted: true,
            stopAtFirstError: true,
            exceptionFactory: (errors) => {
                const formattedErrors = errors.map((error) => {
                    const constraints = Object.entries(
                        error.constraints || {},
                    ).map(([key, originalMessage]) => {
                        return validationMessages[key]?.() || originalMessage
                    })

                    return {
                        field: error.property,
                        errors: constraints,
                    }
                })

                return new BadRequestException({
                    code: ValidationError.INVALID_FORM,
                    errors: formattedErrors,
                })
            },
            ...options,
        })
    }
}
