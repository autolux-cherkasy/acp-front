import { QueryClient, QueryKey } from "@tanstack/react-query";
import { showServerToast } from "@/src/shared/lib/toast";

type OptimisticMutationConfig<TVariables, TCache> = {
  queryClient: QueryClient;
  queryKey: QueryKey;
  updateCache: (old: TCache | undefined, variables: TVariables) => TCache | undefined;
  successMessage: string;
  errorMessage: string;
};

export function createOptimisticMutationHandlers<TVariables, TCache>({
  queryClient,
  queryKey,
  updateCache,
  successMessage,
  errorMessage,
}: OptimisticMutationConfig<TVariables, TCache>) {
  return {
    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<TCache>(queryKey);
      queryClient.setQueryData<TCache>(queryKey, (old) => updateCache(old, variables));
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      showServerToast({ type: "success", successMessage });
    },
    onError: (error: Error, _variables: TVariables, context?: { previous?: TCache }) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      showServerToast({ type: "error", error, errorMessage });
    },
  };
}
