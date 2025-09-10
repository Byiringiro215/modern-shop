'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch('/api/docs')
      .then(res => res.json())
      .then(data => setSpec(data))
      .catch(err => console.error('Failed to load API spec:', err));
  }, []);

  if (!spec) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading API Documentation...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          eCommerce API Documentation
        </h1>
        <p className="text-gray-600">
          Complete API documentation for the eCommerce backend built with Next.js 14 and MongoDB.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <SwaggerUI spec={spec} />
      </div>
    </div>
  );
}
