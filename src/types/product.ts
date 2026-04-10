export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface ProductCollection {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  variantName: string;
  optionValue: string;
  sku: string | null;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  salePrice: number | null;
  stock: number;
  images: string[];
  featuredImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  categories: ProductCategory[];
  collections: ProductCollection[];
  variants: ProductVariant[];
  _count?: {
    orderItems: number;
  };
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "name" | "price" | "stock";
  sortOrder?: "asc" | "desc";
  search?: string;
  isActive?: boolean;
  categoryId?: string;
  collectionId?: string;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  stock?: number;
  images?: string[];
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  isActive?: boolean;
  categoryIds?: string[];
  collectionIds?: string[];
  variants?: Omit<ProductVariant, "id" | "productId" | "createdAt" | "updatedAt">[];
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}
