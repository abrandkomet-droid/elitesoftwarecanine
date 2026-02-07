import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateDogRequest, type UpdateDogRequest } from "@shared/routes";

export function useDogs(params?: { search?: string; limit?: number }) {
  return useQuery({
    queryKey: [api.dogs.list.path, params],
    queryFn: async () => {
      const url = buildUrl(api.dogs.list.path);
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append("search", params.search);
      if (params?.limit) queryParams.append("limit", String(params.limit));
      
      const res = await fetch(`${url}?${queryParams.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dogs");
      return api.dogs.list.responses[200].parse(await res.json());
    },
  });
}

export function useDog(id: number) {
  return useQuery({
    queryKey: [api.dogs.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.dogs.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch dog");
      return api.dogs.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useDogPedigree(id: number) {
  return useQuery({
    queryKey: [api.dogs.getPedigree.path, id],
    queryFn: async () => {
      const url = buildUrl(api.dogs.getPedigree.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch pedigree");
      return api.dogs.getPedigree.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateDog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateDogRequest) => {
      const res = await fetch(api.dogs.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create dog");
      }
      return api.dogs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.dogs.list.path] }),
  });
}

export function useUpdateDog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateDogRequest) => {
      const url = buildUrl(api.dogs.update.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update dog");
      return api.dogs.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.dogs.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.dogs.get.path, data.id] });
    },
  });
}

export function useBreeds() {
  return useQuery({
    queryKey: [api.breeds.list.path],
    queryFn: async () => {
      const res = await fetch(api.breeds.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch breeds");
      return api.breeds.list.responses[200].parse(await res.json());
    },
  });
}
