// src/pages/BrowsePage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import api from '../utils/api';
import ListingCard from '../components/ListingCard';
import './BrowsePage.css';

const categories = ['All', 'Electronics', 'Furniture', 'Clothing', 'Books', 'Vehicles', 'Other'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  const fetchListings = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (category !== 'All') params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sortBy) params.append('sort', sortBy);
      
      const response = await api.get(`/api/listings?${params.toString()}`);
      setListings(response.data.listings);
      
      // Update URL to match current filters
      setSearchParams(params);
    } catch (error) {
      console.error('Error fetching listings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sortBy]); // Fetch automatically when category or sort changes

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings(); // Fetch when search form is submitted
  };

  return (
    <div className="page-container container animate-fade-in browse-layout">
      {/* Sidebar Filters */}
      <aside className="filters-sidebar glass-panel">
        <div className="filter-header">
          <h3><SlidersHorizontal size={18} /> Filters</h3>
        </div>
        
        <div className="filter-section">
          <h4>Category</h4>
          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="filter-section">
          <h4>Price Range</h4>
          <div className="price-inputs">
            <input 
              type="number" 
              placeholder="Min $" 
              className="form-input form-input-sm"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span>-</span>
            <input 
              type="number" 
              placeholder="Max $" 
              className="form-input form-input-sm"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <button className="btn btn-outline btn-sm w-100 mt-2" onClick={fetchListings}>
            Apply Price
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="browse-main">
        {/* Search & Sort Bar */}
        <div className="search-sort-bar glass-panel">
          <form className="search-form" onSubmit={handleSearch}>
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
          
          <div className="sort-dropdown">
            <Filter size={18} className="text-secondary" />
            <select 
              className="form-input form-input-sm" 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="listings-container">
          {loading ? (
            <div className="loading-state">Loading items...</div>
          ) : listings.length > 0 ? (
            <div className="browse-grid">
              {listings.map(listing => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="empty-state glass-panel">
              <h3>No items found</h3>
              <p>Try adjusting your search or filters.</p>
              <button 
                className="btn btn-outline mt-3"
                onClick={() => {
                  setSearchTerm(''); setCategory('All'); setMinPrice(''); setMaxPrice('');
                  setTimeout(fetchListings, 0);
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BrowsePage;
