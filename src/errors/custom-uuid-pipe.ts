import { BadRequestException, Injectable, ParseUUIDPipe } from '@nestjs/common'

import { ValidationError } from '@/enums/validation-errors.enum'

@Injectable()
export class CustomUUIDPipe extends ParseUUIDPipe {
    constructor() {
        super({
            exceptionFactory: () => {
                return new BadRequestException({
                    code: ValidationError.INVALID_UUID,
                })
            },
        })
    }
}
