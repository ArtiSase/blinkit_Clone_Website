import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, Zap, Shield, Tag } from 'lucide-react';
import CategoryList from '../components/CategoryList';
import ProductGrid from '../components/ProductGrid';
import ProductCard from '../components/ProductCard';
import { getProductsByCategory, searchProducts, categories } from '../data/products';

const BANNERS = [
  {
    id: 1,
    title: 'Fresh Groceries',
    subtitle: 'Delivered in 10 minutes',
    bg: 'linear-gradient(135deg, #0c831f 0%, #1daa3d 100%)',
    emoji: '🥦',
    tag: 'Up to 30% off on vegetables',
  },
  {
    id: 2,
    title: 'Dairy & Breakfast',
    subtitle: 'Start your day right',
    bg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    emoji: '🥛',
    tag: 'Fresh milk delivered daily',
  },
  {
    id: 3,
    title: 'Snacks & Drinks',
    subtitle: 'Party time essentials',
    bg: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    emoji: '🍿',
    tag: 'Flat 20% off on munchies',
  },
];

const FEATURED_SECTIONS = [
  { id: 'fruits-vegetables', label: '🥦 Fruits & Vegetables', tagline: 'Farm fresh, delivered fast' },
  { id: 'dairy-breakfast', label: '🥛 Dairy & Breakfast', tagline: 'Start your morning right' },
  { id: 'munchies', label: '🍿 Snacks & Munchies', tagline: 'Munch on the best' },
  { id: 'cold-drinks-juices', label: '🥤 Cold Drinks & Juices', tagline: 'Stay refreshed all day' },
  { id: 'instant-frozen', label: '🍜 Instant & Frozen', tagline: 'Quick meals, anytime' },
  { id: 'personal-care', label: '🧴 Personal Care', tagline: 'Look and feel your best' },
  { id: 'household-care', label: '🧹 Household Care', tagline: 'Keep home sparkling clean' },
];

export default function Home({ searchQuery }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bannerIndex, setBannerIndex] = useState(0);

  const isSearching = Boolean(searchQuery && searchQuery.trim());

  // Auto-rotate banner every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[bannerIndex];

  // Compute displayed products
  const filteredProducts = isSearching
    ? searchProducts(searchQuery)
    : getProductsByCategory(selectedCategory);

  return (
    <main className="home-page">

      {/* Hero Banner – only on 'all' view when not searching */}
      {!isSearching && selectedCategory === 'all' && (
        <section className="hero-section">
          <div className="container">
            <div className="hero-banner" style={{ background: banner.bg }}>
              <div className="hero-content">
                <span className="hero-tag">{banner.tag}</span>
                <h1 className="hero-title">{banner.title}</h1>
                <p className="hero-subtitle">{banner.subtitle}</p>
                <Link to="/" className="hero-btn" onClick={() => setSelectedCategory('fruits-vegetables')}>
                  Shop Now →
                </Link>
              </div>
              <div className="hero-emoji">{banner.emoji}</div>

              {/* Navigation dots */}
              <div className="banner-dots">
                {BANNERS.map((_, i) => (
                  <button
                    key={i}
                    className={`dot ${i === bannerIndex ? 'active' : ''}`}
                    onClick={() => setBannerIndex(i)}
                  />
                ))}
              </div>

              {/* Prev / Next arrows */}
              <button
                className="banner-arrow left"
                onClick={() => setBannerIndex((bannerIndex - 1 + BANNERS.length) % BANNERS.length)}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="banner-arrow right"
                onClick={() => setBannerIndex((bannerIndex + 1) % BANNERS.length)}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Feature strips */}
            <div className="feature-strips">
              <div className="feature-strip">
                <Zap size={20} color="#0c831f" />
                <div><strong>10 min delivery</strong><p>Express delivery</p></div>
              </div>
              <div className="feature-strip">
                <Shield size={20} color="#0c831f" />
                <div><strong>100% safe</strong><p>Quality assured</p></div>
              </div>
              <div className="feature-strip">
                <Tag size={20} color="#0c831f" />
                <div><strong>Best prices</strong><p>Daily deals</p></div>
              </div>
              <div className="feature-strip">
                <Clock size={20} color="#0c831f" />
                <div><strong>Open 24×7</strong><p>Always available</p></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category filter strip */}
      <CategoryList
        selectedCategory={isSearching ? 'all' : selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Search results view */}
      {isSearching && (
        <div className="container">
          <div className="search-results-header">
            <h2>
              Results for "<span className="highlight">{searchQuery}</span>"
            </h2>
            <span className="results-count">{filteredProducts.length} products found</span>
          </div>
          <ProductGrid
            products={filteredProducts}
            emptyMessage={`No results for "${searchQuery}"`}
          />
        </div>
      )}

      {/* Single-category filtered view */}
      {!isSearching && selectedCategory !== 'all' && (
        <div className="container">
          <div className="category-header">
            <h2>
              {categories.find((c) => c.id === selectedCategory)?.icon}{' '}
              {categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
          </div>
          <ProductGrid
            products={filteredProducts}
            emptyMessage="No products in this category"
          />
        </div>
      )}

      {/* All-categories sectioned view */}
      {!isSearching && selectedCategory === 'all' && (
        <div className="container">
          {FEATURED_SECTIONS.map((section) => {
            const sectionProducts = getProductsByCategory(section.id);
            if (sectionProducts.length === 0) return null;
            return (
              <section key={section.id} className="product-section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">{section.label}</h2>
                    <p className="section-tagline">{section.tagline}</p>
                  </div>
                  <button
                    className="see-all-btn"
                    onClick={() => setSelectedCategory(section.id)}
                  >
                    See all →
                  </button>
                </div>
                <div className="product-grid">
                  {sectionProducts.slice(0, 6).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
