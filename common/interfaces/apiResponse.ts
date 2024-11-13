interface PaginationQuery {
  page: string;
  limit: string;
  name?: string;
  powerThreshold?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  countData: {
    count: number;
    min: number;
    max: number;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export type { PaginatedResponse, PaginationQuery };
