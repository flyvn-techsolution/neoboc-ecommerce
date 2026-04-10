import type {
  CategoriesResponse,
  CategoryFilters,
  CreateCategoryInput,
  UpdateCategoryInput,
  Category,
} from "@/types/category";

const API_BASE = "/api";

class CategoryApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "CategoryApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new CategoryApiError(
      errorData.error || "Đã xảy ra lỗi",
      response.status,
      errorData
    );
  }
  return response.json();
}

function buildSearchParams(filters?: CategoryFilters): URLSearchParams {
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

  return params;
}

export async function fetchCategories(
  filters?: CategoryFilters
): Promise<CategoriesResponse> {
  const params = buildSearchParams(filters);
  const url = `${API_BASE}/categories${params.toString() ? `?${params}` : ""}`;

  const response = await fetch(url);
  return handleResponse<CategoriesResponse>(response);
}

export async function fetchCategory(id: string): Promise<Category> {
  const response = await fetch(`${API_BASE}/categories/${id}`);
  return handleResponse<Category>(response);
}

export async function createCategory(
  data: CreateCategoryInput
): Promise<Category> {
  const response = await fetch(`${API_BASE}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Category>(response);
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryInput
): Promise<Category> {
  const response = await fetch(`${API_BASE}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Category>(response);
}

export async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/categories/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new CategoryApiError(
      errorData.error || "Đã xảy ra lỗi",
      response.status,
      errorData
    );
  }
}
