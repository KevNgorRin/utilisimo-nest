export interface PaginationResponse<T> {
    page: number
    limit: number
    count: number
    results: T[]
}
