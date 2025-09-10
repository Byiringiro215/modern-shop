import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"

interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
}

export const useCart = () => {
    const queryClient = useQueryClient()
    const [localCart, setLocalCart] = useState<CartItem[]>([])

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('guestCart')
        console.log('Loading from localStorage:', savedCart);
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                console.log('Parsed cart from localStorage:', parsedCart);
                setLocalCart(parsedCart);
            } catch (error) {
                console.error('Error parsing cart from localStorage:', error);
                localStorage.removeItem('guestCart');
            }
        }
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (localCart.length > 0) {
            localStorage.setItem('guestCart', JSON.stringify(localCart))
            console.log('Saved to localStorage:', localCart);
        }
    }, [localCart])

    const { data: serverCart, isLoading } = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const res = await fetch('/api/cart')
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || "Failed to fetch cart")
            }
            return res.json()
        }
    })

    const addToCart = useMutation({
        mutationFn: async ({ productId, quantity = 1 }: { productId: string, quantity?: number }) => {
            console.log('useCart mutationFn called with:', { productId, quantity });
            const res = await fetch('/api/cart', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity })
            })
            console.log('API response status:', res.status);
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || "Failed to add to cart")
            }
            const data = await res.json();
            console.log('API response data:', data);
            return data;
        },
        onSuccess: (data, variables) => {
            console.log('Add to cart success:', data, variables);
            // If user is authenticated, invalidate server cart
            if (data.cart) {
                queryClient.invalidateQueries({ queryKey: ['cart'] })
            } else if (data.product) {
                // Guest mode - add to local cart
                const newItem: CartItem = {
                    id: data.product.id,
                    title: data.product.title,
                    price: data.product.price,
                    image: data.product.image,
                    quantity: variables.quantity || 1
                }
                
                console.log('Adding item to local cart:', newItem);
                
                setLocalCart(prevCart => {
                    const existingIndex = prevCart.findIndex(item => item.id === newItem.id)
                    let updatedCart;
                    if (existingIndex > -1) {
                        updatedCart = [...prevCart]
                        updatedCart[existingIndex].quantity += variables.quantity || 1
                        console.log('Updated existing item, new cart:', updatedCart);
                    } else {
                        updatedCart = [...prevCart, newItem];
                        console.log('Added new item, new cart:', updatedCart);
                    }
                    
                    // Immediately save to localStorage
                    localStorage.setItem('guestCart', JSON.stringify(updatedCart));
                    console.log('Immediately saved to localStorage:', updatedCart);
                    
                    return updatedCart;
                })
            }
        }
    })

    const updateCartItem = useMutation({
        mutationFn: async ({ productId, quantity }: { productId: string, quantity: number }) => {
            const res = await fetch(`/api/cart/${productId}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity })
            })
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || "Failed to update cart")
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
    })

    const deleteCartItem = useMutation({
        mutationFn: async (productId: string) => {
            const res = await fetch(`/api/cart/${productId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || "Failed to delete cart item")
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
    })

    // Determine which cart to use - server cart for authenticated users, local cart for guests
    const cart = serverCart?.cart?.products?.length > 0 ? serverCart.cart.products : localCart
    
    console.log('useCart - serverCart:', serverCart);
    console.log('useCart - localCart:', localCart);
    console.log('useCart - final cart:', cart);

    // Local cart functions for guest users
    const updateLocalCartQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromLocalCart(productId);
            return;
        }
        
        setLocalCart(prevCart => {
            const updatedCart = prevCart.map(item => 
                item.id === productId ? { ...item, quantity: newQuantity } : item
            );
            localStorage.setItem('guestCart', JSON.stringify(updatedCart));
            console.log('Updated local cart quantity:', updatedCart);
            return updatedCart;
        });
    };

    const removeFromLocalCart = (productId: string) => {
        setLocalCart(prevCart => {
            const updatedCart = prevCart.filter(item => item.id !== productId);
            localStorage.setItem('guestCart', JSON.stringify(updatedCart));
            console.log('Removed from local cart:', updatedCart);
            return updatedCart;
        });
    };

    return {
        cart,
        isLoading,
        addToCart,
        updateCartItem,
        deleteCartItem,
        updateLocalCartQuantity,
        removeFromLocalCart
    }
}