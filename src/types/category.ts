export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    products: number;
  };
  products?: CategoryProduct[];
}

export interface CategoryProduct {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface CategoriesResponse {
  data: Category[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoryFilters {
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "name";
  sortOrder?: "asc" | "desc";
  search?: string;
  isActive?: boolean;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  isActive?: boolean;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}
