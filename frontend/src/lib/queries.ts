import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { ApiError, api } from './api'
import { PAGE_SIZE } from './limits'
import type { StoryInput } from './types'

export const keys = {
  list: ['stories'] as const,
  detail: (id: number) => ['story', id] as const,
}

export function useStories() {
  return useInfiniteQuery({
    queryKey: keys.list,
    queryFn: ({ pageParam }) => api.list(pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (last, all) =>
      last.length < PAGE_SIZE ? undefined : all.length * PAGE_SIZE,
  })
}

export function useStory(id: number) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => api.get(id),
    // 404 tidak perlu dicoba ulang.
    retry: (count, error) => !(error instanceof ApiError && error.status === 404) && count < 1,
  })
}

export function useCreateStory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: StoryInput) => api.create(data),
    onSuccess: (story) => {
      qc.setQueryData(keys.detail(story.id), story)
      return qc.invalidateQueries({ queryKey: keys.list })
    },
  })
}

export function useUpdateStory(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: StoryInput) => api.update(id, data),
    onSuccess: (story) => {
      qc.setQueryData(keys.detail(id), story)
      return qc.invalidateQueries({ queryKey: keys.list })
    },
  })
}

export function useDeleteStory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.remove(id),
    onSuccess: (_, id) => {
      qc.removeQueries({ queryKey: keys.detail(id) })
      return qc.invalidateQueries({ queryKey: keys.list })
    },
  })
}
