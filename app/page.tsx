'use client'

import React, { useState, useEffect } from 'react'
import ProductCard from './components/ProductCard'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { IProduct } from '../models/Product'
import { useProducts } from './hooks/useProducts'


const categories = ['All', 'Electronics', 'Gaming', 'Office', 'Health & Fitness', 'Accessories']

export default function HomePage() {

    const{data:products, isLoading, error}=useProducts()

  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  // Update filtered products when products data loads
  useEffect(() => {
    if (products) {
      setFilteredProducts(products)
    }
  }, [products])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterProducts(term, selectedCategory, priceRange)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterProducts(searchTerm, category, priceRange)
  }

  const filterProducts = (search: string, category: string, price: { min: number, max: number }) => {
    if (!products) {
      setFilteredProducts([])
      return
    }
    let filtered = [...products]

    if (search) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category !== 'All') {
      filtered = filtered.filter(product => product.category === category)
    }

    filtered = filtered.filter(product =>
      product.price >= price.min && product.price <= price.max
    )

    setFilteredProducts(filtered)
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading products</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Amazing Products
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Shop the latest trends and find everything you need at unbeatable prices
            </p>
            <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'All' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            {/* Price Range */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                className="w-20 px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                className="w-20 px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Results count */}
          <p className="text-gray-600">
            Showing {Array.isArray(filteredProducts) ? filteredProducts.length : 0} of {products?.length || 0} products
          </p>
        </div>

        {/* Products Grid */}
        {!Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Featured Categories */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.slice(1).map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
              >
                <div className="text-3xl mb-2">
                  {category === 'Electronics' && '📱'}
                  {category === 'Gaming' && '🎮'}
                  {category === 'Office' && '💼'}
                  {category === 'Health & Fitness' && '💪'}
                  {category === 'Accessories' && '👜'}
                </div>
                <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                  {category}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
