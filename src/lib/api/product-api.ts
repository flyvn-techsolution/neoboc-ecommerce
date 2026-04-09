import type {
  ProductsResponse,
  ProductFilters,
  CreateProductInput,
  UpdateProductInput,
  Product,
} from "@/types/product";

const API_BASE = "/api";

class ProductApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ProductApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ProductApiError(
      errorData.error || "Đã xảy ra lỗi",
      response.status,
      errorData
    );
  }
  return response.json();
}

function buildSearchParams(filters?: ProductFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (!filters) return params;

  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  if (filters.search) params.set("search", filters.search);
  if (filters.isActive !== undefined) {
    params.set("isActive", String(filters.isActive));
  }
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.collectionId) {
    params.set("collectionId", filters.collectionId);
  }

  return params;
}

export async function fetchProducts(
  filters?: ProductFilters
): Promise<ProductsResponse> {
  const params = buildSearchParams(filters);
  const url = `${API_BASE}/products${params.toString() ? `?${params}` : ""}`;

  const response = await fetch(url);
  return handleResponse<ProductsResponse>(response);
}

export async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${id}`);
  return handleResponse<Product>(response);
}

export async function createProduct(
  data: CreateProductInput
): Promise<Product> {
  const response = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Product>(response);
}

export async function updateProduct(
  id: string,
  data: UpdateProductInput
): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Product>(response);
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ProductApiError(
      errorData.error || "Đã xảy ra lỗi",
      response.status,
      errorData
    );
  }
}
