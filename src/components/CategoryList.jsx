import React, { useRef } from 'react';
import { categories } from '../data/products';

export default function CategoryList({ selectedCategory, onSelectCategory }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };

  return (
    <section className="category-section">
      <div className="container">
        <div className="category-scroll-wrapper">
          <div className="category-list" ref={scrollRef}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
