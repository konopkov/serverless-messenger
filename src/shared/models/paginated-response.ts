import { PageInfo } from './page-info';

export interface PaginatedResponse<T> {
    data: T[];
    pageInfo: PageInfo;
}
