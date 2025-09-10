'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCartIcon, StarIcon, HeartIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { IProduct } from '../../models/Product'
import { useCart } from '../hooks/useCart'

interface ProductCardProps {
  product: IProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const renderStars = (rating: number = 0) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <StarIcon key="half" className="h-4 w-4 text-yellow-400" />
      )
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      )
    }

    return stars
  }

const {addToCart}=useCart()

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={product.image || product.images?.[0] || '/placeholder-image.jpg'}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Out of Stock
          </div>
        )}
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
          {product.category}
        </div>
        <button className="absolute top-2 right-12 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100">
          <HeartIcon className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {renderStars(product.rating || 0)}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.rating || 0})</span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          <button
            disabled={product.stock === 0}
            onClick={()=>{
              console.log('Product object:', product);
              console.log('Adding to cart:', { productId: product._id || product.id, quantity: 1 });
              addToCart.mutate({
                productId: product._id || product.id,
                quantity: 1
              }, {
                onSuccess: (data) => {
                  console.log('Successfully added to cart:', data);
                },
                onError: (error) => {
                  console.error('Failed to add to cart:', error);
                }
              });
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <ShoppingCartIcon className="h-4 w-4" />
            <span className="hidden sm:block">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  )
}
