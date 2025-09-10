import { useMutation } from "@tanstack/react-query"
import { InputProps } from "../lib/fetchers"



export const useLogin = () => {
    return useMutation({
        mutationFn: async (data: InputProps) => {
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'aplication/json', },
                    body: JSON.stringify(data)
                })
                if (!res.ok) {
                    const error = await res.json()
                    throw new Error(error.message || "login failed")
                }

                return res.json()
            } catch (error) {
                console.log(error)
            }
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token)
        }
    })
}