import type {
  CollectionsResponse,
  CollectionFilters,
  CreateCollectionInput,
  UpdateCollectionInput,
  Collection,
} from "@/types/collection";

const API_BASE = "/api";

class CollectionApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "CollectionApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new CollectionApiError(
      errorData.error || "Đã xảy ra lỗi",
      response.status,
      errorData
    );
  }
  return response.json();
}

function buildSearchParams(filters?: CollectionFilters): URLSearchParams {
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

export async function fetchCollections(
  filters?: CollectionFilters
): Promise<CollectionsResponse> {
  const params = buildSearchParams(filters);
  const url = `${API_BASE}/collections${params.toString() ? `?${params}` : ""}`;

  const response = await fetch(url);
  return handleResponse<CollectionsResponse>(response);
}

export async function fetchAllCollections(
  filters?: Omit<CollectionFilters, "page" | "pageSize">
): Promise<Collection[]> {
  const pageSize = 100;
  let page = 1;
  let totalPages = 1;
  const allCollections: Collection[] = [];

  while (page <= totalPages) {
    const response = await fetchCollections({
      ...filters,
      page,
      pageSize,
    });

    allCollections.push(...response.data);
    totalPages = response.pagination.totalPages;
    page += 1;
  }

  return allCollections;
}

export async function fetchCollection(id: string): Promise<Collection> {
  const response = await fetch(`${API_BASE}/collections/${id}`);
  return handleResponse<Collection>(response);
}

export async function createCollection(
  data: CreateCollectionInput
): Promise<Collection> {
  const response = await fetch(`${API_BASE}/collections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Collection>(response);
}

export async function updateCollection(
  id: string,
  data: UpdateCollectionInput
): Promise<Collection> {
  const response = await fetch(`${API_BASE}/collections/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Collection>(response);
}

export async function deleteCollection(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/collections/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new CollectionApiError(
      errorData.error || "Đã xảy ra lỗi",
      response.status,
      errorData
    );
  }
}
