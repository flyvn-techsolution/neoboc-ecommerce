import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  fetchCollections,
  fetchCollection,
  createCollection,
  updateCollection,
  deleteCollection,
} from "@/lib/api/collection-api";
import type {
  CollectionsResponse,
  CollectionFilters,
  Collection,
  CreateCollectionInput,
  UpdateCollectionInput,
} from "@/types/collection";

export const collectionKeys = {
  all: ["collections"] as const,
  lists: () => [...collectionKeys.all, "list"] as const,
  list: (filters?: CollectionFilters) =>
    [...collectionKeys.lists(), filters] as const,
  details: () => [...collectionKeys.all, "detail"] as const,
  detail: (id: string) => [...collectionKeys.details(), id] as const,
};

export function useCollections(
  filters?: CollectionFilters,
  options?: Partial<UseQueryOptions<CollectionsResponse>>
) {
  return useQuery({
    queryKey: collectionKeys.list(filters),
    queryFn: () => fetchCollections(filters),
    ...options,
  });
}

export function useCollection(
  id: string,
  options?: Partial<UseQueryOptions<Collection>>
) {
  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: () => fetchCollection(id),
    enabled: !!id,
    ...options,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollectionInput) => createCollection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
}

export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCollectionInput }) =>
      updateCollection(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: collectionKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
}
