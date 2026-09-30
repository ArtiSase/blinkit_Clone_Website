import React from 'react';
import ProductCard from './ProductCard';
import { PackageSearch } from 'lucide-react';

export default function ProductGrid({ products, title, emptyMessage }) {
  if (!products || products.length === 0) {
    return (
      <div className="empty-products">
        <PackageSearch size={64} className="empty-icon" />
        <h3>{emptyMessage || 'No products found'}</h3>
        <p>Try a different search or category</p>
      </div>
    );
  }

  return (
    <section className="product-grid-section">
      {title && <h2 className="section-title">{title}</h2>}
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
