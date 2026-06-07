// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import api from '../utils/api';
import ListingCard from '../components/ListingCard';
import './HomePage.css';

const HomePage = () => {
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentListings = async () => {
      try {
        const response = await api.get('/api/listings?limit=4');
        setRecentListings(response.data.listings);
      } catch (error) {
        console.error('Failed to fetch listings', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentListings();
  }, []);

  const categories = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Vehicles', 'Other'];

  return (
    <div className="page-container animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content text-center">
            <h1 className="hero-title">
              Discover <span className="text-accent">Amazing Items</span><br />
              In Your Community
            </h1>
            <p className="hero-subtitle">
              ReMarket is the premium marketplace to buy and sell second-hand goods securely and easily.
            </p>
            <div className="hero-cta">
              <Link to="/browse" className="btn btn-primary btn-lg">
                Start Browsing <ArrowRight size={18} />
              </Link>
              <Link to="/create-listing" className="btn btn-outline btn-lg">
                Sell an Item
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section container">
        <h2 className="section-title">Popular Categories</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link key={category} to={`/browse?category=${category}`} className="category-card glass-panel">
              <h3>{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Listings Section */}
      <section className="recent-section container">
        <div className="section-header">
          <h2 className="section-title">Fresh Finds</h2>
          <Link to="/browse" className="view-all-link">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        {loading ? (
          <p>Loading fresh finds...</p>
        ) : recentListings.length > 0 ? (
          <div className="listings-grid">
            {recentListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="empty-state glass-panel">No listings found. Be the first to sell something!</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;
