import { useMutation } from "@tanstack/react-query"


export interface signupProps{
    name:string,
    email:string,
    password:string,
    role:"customer"|"admin"
}

export const useSignup=()=>{
    return useMutation({
        mutationFn:async(data:signupProps)=>{
const res=await fetch('/api/auth/register',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(data)
})
if(!res.ok){
    const error= await res.json()
    throw new Error(error.message||'Failed to register')
}
return res.json()
        }
    })
}