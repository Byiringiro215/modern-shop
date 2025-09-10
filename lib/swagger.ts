import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'eCommerce API',
      version: '1.0.0',
      description: `
        # eCommerce Backend API
        
        A comprehensive, production-ready eCommerce backend API built with **Next.js 14** and **MongoDB**.
        
        ## Features
        - 🔐 **JWT Authentication** - Secure user authentication and authorization
        - 👥 **Role-based Access** - Admin and customer role management
        - 📦 **Product Management** - Full CRUD operations with search and filtering
        - 🛒 **Shopping Cart** - Add, update, and remove items from cart
        - 📋 **Order Management** - Place orders and track order history
        - 🔍 **Search & Pagination** - Advanced search with pagination support
        
        ## Authentication
        Most endpoints require authentication. Include the JWT token in the Authorization header:
        \`\`\`
        Authorization: Bearer <your-jwt-token>
        \`\`\`
        
        ## Sample Accounts
        - **Admin**: admin@ecommerce.com / admin123
        - **Customer**: john@example.com / customer123
      `,
      contact: {
        name: 'API Support',
        email: 'support@ecommerce.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://your-production-domain.com',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Products',
        description: 'Product management operations'
      },
      {
        name: 'Cart',
        description: 'Shopping cart management'
      },
      {
        name: 'Orders',
        description: 'Order processing and management'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'customer'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number', minimum: 0 },
            category: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            stock: { type: 'number', minimum: 0 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
            quantity: { type: 'number', minimum: 1 },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            products: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
            total: { type: 'number', minimum: 0 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
            title: { type: 'string' },
            price: { type: 'number', minimum: 0 },
            quantity: { type: 'number', minimum: 1 },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            products: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
            total: { type: 'number', minimum: 0 },
            status: { 
              type: 'string', 
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] 
            },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'array', items: { type: 'string' } },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            currentPage: { type: 'number' },
            totalPages: { type: 'number' },
            totalProducts: { type: 'number' },
            totalOrders: { type: 'number' },
            hasNext: { type: 'boolean' },
            hasPrev: { type: 'boolean' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            role: { type: 'string', enum: ['admin', 'customer'], default: 'customer' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            accessToken: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' }
              }
            }
          }
        },
        ProductRequest: {
          type: 'object',
          required: ['title', 'description', 'price', 'category', 'images'],
          properties: {
            title: { type: 'string', example: 'Wireless Headphones' },
            description: { type: 'string', example: 'High-quality wireless headphones' },
            price: { type: 'number', minimum: 0, example: 199.99 },
            category: { type: 'string', example: 'Electronics' },
            images: { type: 'array', items: { type: 'string' }, example: ['https://example.com/image.jpg'] },
            stock: { type: 'number', minimum: 0, example: 50 }
          }
        },
        CartRequest: {
          type: 'object',
          required: ['productId', 'quantity'],
          properties: {
            productId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            quantity: { type: 'number', minimum: 1, example: 2 }
          }
        },
        OrderRequest: {
          type: 'object',
          properties: {
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string', example: '123 Main St' },
                city: { type: 'string', example: 'New York' },
                state: { type: 'string', example: 'NY' },
                zipCode: { type: 'string', example: '10001' },
                country: { type: 'string', example: 'USA' }
              }
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Authentication required' }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Validation failed' },
                  details: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Resource not found' }
                }
              }
            }
          }
        }
      }
    },
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          description: 'Create a new user account with email and password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' }
              }
            }
          },
          responses: {
            '201': {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '409': {
              description: 'User already exists',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string', example: 'User with this email already exists' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login user',
          description: 'Authenticate user and return JWT token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' }
              }
            }
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '401': {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string', example: 'Invalid email or password' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/products': {
        get: {
          tags: ['Products'],
          summary: 'Get all products',
          description: 'Retrieve products with pagination, search, and filtering',
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Page number for pagination'
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10 },
              description: 'Number of products per page'
            },
            {
              name: 'category',
              in: 'query',
              schema: { type: 'string' },
              description: 'Filter by category'
            },
            {
              name: 'search',
              in: 'query',
              schema: { type: 'string' },
              description: 'Search in title and description'
            },
            {
              name: 'sortBy',
              in: 'query',
              schema: { type: 'string', default: 'createdAt' },
              description: 'Sort field'
            },
            {
              name: 'sortOrder',
              in: 'query',
              schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
              description: 'Sort order'
            }
          ],
          responses: {
            '200': {
              description: 'Products retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      products: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Product' }
                      },
                      pagination: { $ref: '#/components/schemas/Pagination' }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Products'],
          summary: 'Create new product',
          description: 'Create a new product (Admin only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProductRequest' }
              }
            }
          },
          responses: {
            '201': {
              description: 'Product created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      product: { $ref: '#/components/schemas/Product' }
                    }
                  }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '401': { $ref: '#/components/responses/UnauthorizedError' }
          }
        }
      },
      '/api/products/{id}': {
        get: {
          tags: ['Products'],
          summary: 'Get product by ID',
          description: 'Retrieve a single product by its ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Product ID'
            }
          ],
          responses: {
            '200': {
              description: 'Product retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      product: { $ref: '#/components/schemas/Product' }
                    }
                  }
                }
              }
            },
            '404': { $ref: '#/components/responses/NotFoundError' }
          }
        },
        put: {
          tags: ['Products'],
          summary: 'Update product',
          description: 'Update an existing product (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Product ID'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProductRequest' }
              }
            }
          },
          responses: {
            '200': {
              description: 'Product updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      product: { $ref: '#/components/schemas/Product' }
                    }
                  }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '401': { $ref: '#/components/responses/UnauthorizedError' },
            '404': { $ref: '#/components/responses/NotFoundError' }
          }
        },
        delete: {
          tags: ['Products'],
          summary: 'Delete product',
          description: 'Delete a product (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Product ID'
            }
          ],
          responses: {
            '200': {
              description: 'Product deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            '401': { $ref: '#/components/responses/UnauthorizedError' },
            '404': { $ref: '#/components/responses/NotFoundError' }
          }
        }
      },
      '/api/cart': {
        get: {
          tags: ['Cart'],
          summary: 'Get user cart',
          description: 'Retrieve the current user\'s shopping cart',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Cart retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      cart: { $ref: '#/components/schemas/Cart' }
                    }
                  }
                }
              }
            },
            '401': { $ref: '#/components/responses/UnauthorizedError' }
          }
        },
        post: {
          tags: ['Cart'],
          summary: 'Add product to cart',
          description: 'Add a product to the user\'s shopping cart',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CartRequest' }
              }
            }
          },
          responses: {
            '201': {
              description: 'Product added to cart successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      cart: { $ref: '#/components/schemas/Cart' }
                    }
                  }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '401': { $ref: '#/components/responses/UnauthorizedError' }
          }
        }
      },
      '/api/cart/{productId}': {
        put: {
          tags: ['Cart'],
          summary: 'Update cart item quantity',
          description: 'Update the quantity of a product in the cart',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'productId',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Product ID'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['quantity'],
                  properties: {
                    quantity: { type: 'number', minimum: 1 }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Cart updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      cart: { $ref: '#/components/schemas/Cart' }
                    }
                  }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '401': { $ref: '#/components/responses/UnauthorizedError' },
            '404': { $ref: '#/components/responses/NotFoundError' }
          }
        },
        delete: {
          tags: ['Cart'],
          summary: 'Remove product from cart',
          description: 'Remove a product from the user\'s cart',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'productId',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Product ID'
            }
          ],
          responses: {
            '200': {
              description: 'Product removed from cart successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      cart: { $ref: '#/components/schemas/Cart' }
                    }
                  }
                }
              }
            },
            '401': { $ref: '#/components/responses/UnauthorizedError' },
            '404': { $ref: '#/components/responses/NotFoundError' }
          }
        }
      },
      '/api/orders': {
        get: {
          tags: ['Orders'],
          summary: 'Get user orders',
          description: 'Retrieve the current user\'s order history',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Page number'
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10 },
              description: 'Orders per page'
            },
            {
              name: 'status',
              in: 'query',
              schema: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
              description: 'Filter by order status'
            }
          ],
          responses: {
            '200': {
              description: 'Orders retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      orders: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Order' }
                      },
                      pagination: { $ref: '#/components/schemas/Pagination' }
                    }
                  }
                }
              }
            },
            '401': { $ref: '#/components/responses/UnauthorizedError' }
          }
        },
        post: {
          tags: ['Orders'],
          summary: 'Place order',
          description: 'Create a new order from the user\'s cart',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderRequest' }
              }
            }
          },
          responses: {
            '201': {
              description: 'Order placed successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      order: { $ref: '#/components/schemas/Order' }
                    }
                  }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '401': { $ref: '#/components/responses/UnauthorizedError' }
          }
        }
      },
      '/api/orders/all': {
        get: {
          tags: ['Orders'],
          summary: 'Get all orders (Admin)',
          description: 'Retrieve all orders in the system (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Page number'
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10 },
              description: 'Orders per page'
            },
            {
              name: 'status',
              in: 'query',
              schema: { type: 'string' },
              description: 'Filter by status'
            },
            {
              name: 'userId',
              in: 'query',
              schema: { type: 'string' },
              description: 'Filter by user ID'
            }
          ],
          responses: {
            '200': {
              description: 'Orders retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      orders: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Order' }
                      },
                      pagination: { $ref: '#/components/schemas/Pagination' }
                    }
                  }
                }
              }
            },
            '401': { $ref: '#/components/responses/UnauthorizedError' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./app/api/**/*.ts'], // Path to the API docs
};

const specs = swaggerJSDoc(options);
export default specs;
