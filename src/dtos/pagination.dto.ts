import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

import { DefaultPagination } from '@/constants/pagination.constants'
import { SortDirection } from '@/enums/pagination.enum'

export class PaginationDto {
    @ApiProperty({ required: false, default: DefaultPagination.page })
    @IsOptional()
    @IsNumber()
    @Min(0)
    page: number = DefaultPagination.page

    @ApiProperty({ required: false, default: DefaultPagination.limit })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(50)
    limit: number = DefaultPagination.limit

    @ApiProperty({ required: false, default: SortDirection.DESC })
    @IsOptional()
    sortDirection: SortDirection = SortDirection.DESC

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    searchValue?: string
}
