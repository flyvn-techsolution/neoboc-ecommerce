export interface Collection {
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
  products?: CollectionProduct[];
}

export interface CollectionProduct {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface CollectionsResponse {
  data: Collection[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CollectionFilters {
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "name";
  sortOrder?: "asc" | "desc";
  search?: string;
  isActive?: boolean;
}

export interface CreateCollectionInput {
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  isActive?: boolean;
}

export interface UpdateCollectionInput extends Partial<CreateCollectionInput> {}
