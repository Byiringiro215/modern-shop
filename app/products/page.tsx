'use client'

import React, { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { MagnifyingGlassIcon, FunnelIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { useProducts } from '../hooks/useProducts'
import { IProduct } from '../../models/Product'

// Extended mock product data
// const allProducts = [
//   {
//     id: '1',
//     title: 'Wireless Bluetooth Headphones',
//     description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
//     price: 199.99,
//     category: 'Electronics',
//     image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
//     stock: 50,
//     rating: 4.5
//   },
//   {
//     id: '2',
//     title: 'Smartphone Case - Premium Leather',
//     description: 'Genuine leather smartphone case with card slots and magnetic closure. Compatible with most phone models.',
//     price: 39.99,
//     category: 'Accessories',
//     image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500',
//     stock: 100,
//     rating: 4.2
//   },
//   {
//     id: '3',
//     title: 'Gaming Mechanical Keyboard',
//     description: 'RGB backlit mechanical keyboard with blue switches. Perfect for gaming and typing with tactile feedback.',
//     price: 129.99,
//     category: 'Gaming',
//     image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500',
//     stock: 25,
//     rating: 4.8
//   },
//   {
//     id: '4',
//     title: 'Fitness Tracker Watch',
//     description: 'Advanced fitness tracker with heart rate monitoring, GPS, and 7-day battery life. Track your health goals.',
//     price: 249.99,
//     category: 'Health & Fitness',
//     image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500',
//     stock: 75,
//     rating: 4.3
//   },
//   {
//     id: '5',
//     title: 'Portable Bluetooth Speaker',
//     description: 'Waterproof portable speaker with 360-degree sound and 12-hour battery. Perfect for outdoor adventures.',
//     price: 89.99,
//     category: 'Electronics',
//     image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
//     stock: 40,
//     rating: 4.6
//   },
//   {
//     id: '6',
//     title: 'Laptop Stand - Adjustable',
//     description: 'Ergonomic aluminum laptop stand with adjustable height and angle. Improve your workspace comfort.',
//     price: 59.99,
//     category: 'Office',
//     image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
//     stock: 30,
//     rating: 4.4
//   },
//   {
//     id: '7',
//     title: 'Wireless Charging Pad',
//     description: 'Fast wireless charging pad compatible with Qi-enabled devices. Sleek design with LED indicator.',
//     price: 29.99,
//     category: 'Accessories',
//     image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500',
//     stock: 60,
//     rating: 4.1
//   },
//   {
//     id: '8',
//     title: 'Gaming Mouse - RGB',
//     description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.',
//     price: 79.99,
//     category: 'Gaming',
//     image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
//     stock: 35,
//     rating: 4.7
//   },
//   {
//     id: '9',
//     title: 'USB-C Hub - 7-in-1',
//     description: 'Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging. Essential for modern laptops.',
//     price: 49.99,
//     category: 'Accessories',
//     image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500',
//     stock: 45,
//     rating: 4.3
//   },
//   {
//     id: '10',
//     title: 'Desk Organizer Set',
//     description: 'Bamboo desk organizer set with multiple compartments for pens, papers, and office supplies.',
//     price: 34.99,
//     category: 'Office',
//     image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500',
//     stock: 20,
//     rating: 4.2
//   },
//   {
//     id: '11',
//     title: 'Smart Watch Series 5',
//     description: 'Advanced smartwatch with health monitoring, GPS, and cellular connectivity. Stay connected anywhere.',
//     price: 399.99,
//     category: 'Electronics',
//     image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500',
//     stock: 15,
//     rating: 4.9
//   },
//   {
//     id: '12',
//     title: 'Ergonomic Office Chair',
//     description: 'Premium ergonomic office chair with lumbar support and adjustable height. Perfect for long work sessions.',
//     price: 299.99,
//     category: 'Office',
//     image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500',
//     stock: 12,
//     rating: 4.6
//   }
// ]

const categories = ['All', 'Electronics', 'Gaming', 'Office', 'Health & Fitness', 'Accessories']
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' }
]

export default function ProductsPage() {
  const {data:products,isLoading,error}=useProducts()
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 })
  const [showFilters, setShowFilters] = useState(false)

  // Initialize filtered products when data loads
  useEffect(() => {
    if (products) {
      filterAndSortProducts(searchTerm, selectedCategory, sortBy, priceRange)
    }
  }, [products])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterAndSortProducts(term, selectedCategory, sortBy, priceRange)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterAndSortProducts(searchTerm, category, sortBy, priceRange)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    filterAndSortProducts(searchTerm, selectedCategory, sort, priceRange)
  }

  const handlePriceRangeChange = (range: { min: number, max: number }) => {
    setPriceRange(range)
    filterAndSortProducts(searchTerm, selectedCategory, sortBy, range)
  }

  const filterAndSortProducts = (search: string, category: string, sort: string, price: { min: number, max: number }) => {
    if (!products || !Array.isArray(products)) {
      setFilteredProducts([])
      return
    }
    
    let filtered = [...products]

    // Filter by search
    if (search) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filter by category
    if (category !== 'All') {
      filtered = filtered.filter((product) => product.category === category)
    }

    // Filter by price range
    filtered = filtered.filter((product) =>
      product.price >= price.min && product.price <= price.max
    )

    // Sort products
    switch (sort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
        filtered.reverse()
        break
      default:
        // Featured - keep original order
        break
    }

    setFilteredProducts(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="mt-2 text-gray-600">Discover our complete collection of amazing products</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters Bar */}
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

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => handlePriceRangeChange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => handlePriceRangeChange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results Info */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products?.length || 0} products
            </p>
            <p className="text-sm text-gray-500">
              Sorted by {sortOptions.find(opt => opt.value === sortBy)?.label}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
