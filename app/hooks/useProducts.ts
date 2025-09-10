import { useQueries, useQuery } from "@tanstack/react-query"
import { IProduct } from "../../models/Product"

export const useProducts=()=>{
    return useQuery<IProduct[]>({
        queryKey:['products'],
        queryFn:async()=>{
            const res=await fetch('/api/products?limit=100')
            if(!res.ok){
                const error=await res.json()
                throw new Error (error.message||"Failed to fetch products")
            }
            const data = await res.json()
            return data.products || []
            }
    })
}