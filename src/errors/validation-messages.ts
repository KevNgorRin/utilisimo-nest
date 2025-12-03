import { ValidationError } from '@/enums/validation-errors.enum'

export const validationMessages: Record<string, () => string> = {
    isNotEmpty: () => ValidationError.REQUIRED_FIELD,
    isString: () => ValidationError.INVALID_FIELD_TYPE,
    isNumber: () => ValidationError.INVALID_FIELD_TYPE,
    isEmail: () => ValidationError.INVALID_EMAIL,
    minLength: () => ValidationError.INVALID_LENGTH,
    maxLength: () => ValidationError.INVALID_LENGTH,
}
