// src/components/ListingCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import './ListingCard.css';

const ListingCard = ({ listing }) => {
  return (
    <Link to={`/listings/${listing._id}`} className="listing-card glass-panel animate-fade-in">
      <div className="card-image-wrapper">
        <img 
          src={listing.imageUrl || 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800'} 
          alt={listing.title} 
          className="card-image"
        />
        {listing.isSold && (
          <div className="sold-badge">SOLD</div>
        )}
        <div className="category-badge">
          <Tag size={12} /> {listing.category}
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{listing.title}</h3>
        <p className="card-price">${listing.price.toLocaleString()}</p>
        {listing.seller && (
          <p className="card-seller">by {listing.seller.username}</p>
        )}
      </div>
    </Link>
  );
};

export default ListingCard;
