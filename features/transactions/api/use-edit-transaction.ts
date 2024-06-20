import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"]

export const useEditTransaction = (id?: string) => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType>({
            mutationFn: async (json) => {
                const response = await client.api.transactions[":id"]["$patch"]({ param: { id }, json })
                return await response.json()
            },
            onSuccess: () => {
                toast.success("Transaction Updated")
                queryClient.invalidateQueries({ queryKey: ["Transaction", { id }] })
                queryClient.invalidateQueries({ queryKey: ["Transactions"] })
                //TODO: add the summery
            },
            onError: () => {
                toast.error("Failed to edit transaction")
            },
        })
    return mutation
}