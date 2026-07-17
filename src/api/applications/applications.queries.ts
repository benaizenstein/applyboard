import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import {
  createApplication,
  deleteApplication,
  fetchApplications,
  updateApplication,
} from './applications.api'
import type { Application, ApplicationInput, ApplicationStage } from './applications.types'

export function useApplications() {
  return useQuery({
    queryKey: queryKeys.applications.all,
    queryFn: fetchApplications,
  })
}

export function useCreateApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.applications.all }),
  })
}

export function useUpdateApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<ApplicationInput> }) =>
      updateApplication(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.applications.all }),
  })
}

export function useMoveApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: ApplicationStage }) =>
      updateApplication(id, { stage }),
    onMutate: async ({ id, stage }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.applications.all })
      const previous = queryClient.getQueryData<Application[]>(queryKeys.applications.all)
      queryClient.setQueryData<Application[]>(queryKeys.applications.all, (current) =>
        current?.map((application) =>
          application.id === id ? { ...application, stage } : application,
        ),
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.applications.all, context.previous)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.applications.all }),
  })
}

export function useDeleteApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.applications.all }),
  })
}
