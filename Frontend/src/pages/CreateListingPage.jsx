// src/pages/CreateListingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './AuthPages.css'; // Reusing form styling

const categories = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Vehicles', 'Other'];

const CreateListingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: categories[0],
    imageUrl: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Handle Ctrl+V / Cmd+V globally for this page
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          setImageFile(file);
          setImagePreview(URL.createObjectURL(file));
          // Clear standard imageUrl if they paste a file
          setFormData(prev => ({ ...prev, imageUrl: '' }));
          break; // only take the first image
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use FormData since we might be uploading a physical file
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', Number(formData.price));
      data.append('category', formData.category);
      if (formData.imageUrl) data.append('imageUrl', formData.imageUrl);
      
      // If a physical file was selected or pasted
      if (imageFile) {
        data.append('image', imageFile);
      }

      const response = await api.post('/api/listings', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/listings/${response.data.listing._id}`); // Go to new listing
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
      setLoading(false);
    }
  };

  return (
    <div className="page-container container">
      <div className="auth-card card animate-fade-in" style={{ margin: '0 auto', maxWidth: '600px' }}>
        <h2 className="auth-title">Sell an Item</h2>
        <p className="auth-subtitle">List your item on ReMarket. Tip: You can Ctrl+V to paste an image anywhere!</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title" name="title" 
              className="form-input" 
              value={formData.title} onChange={handleChange}
              required 
              placeholder="e.g. iPhone 13 Pro Max"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="price">Price ($)</label>
            <input 
              type="number" 
              id="price" name="price" 
              className="form-input" 
              value={formData.price} onChange={handleChange}
              required 
              min="0" step="0.01"
              placeholder="999"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="category">Category</label>
            <select 
              id="category" name="category" 
              className="form-input" 
              value={formData.category} onChange={handleChange}
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea 
              id="description" name="description" 
              className="form-input" 
              value={formData.description} onChange={handleChange}
              required 
              rows="5"
              placeholder="Describe the condition, features, and reason for selling..."
            ></textarea>
          </div>

          <div className="form-group" style={{ padding: '16px', border: '2px dashed var(--border-color)', borderRadius: '8px', marginBottom: '24px' }}>
            <label className="form-label" style={{ marginBottom: '12px' }}>Item Image</label>
            
            {imagePreview ? (
              <div style={{ marginBottom: '16px', position: 'relative' }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} />
                <button 
                  type="button" 
                  onClick={() => { setImageFile(null); setImagePreview(''); }}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>
                Click below to upload, or simply Paste (Ctrl+V) an image.
              </p>
            )}

            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginBottom: '12px', width: '100%' }}
            />

            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: '8px 0' }}>OR</div>

            <input 
              type="url" 
              id="imageUrl" name="imageUrl" 
              className="form-input" 
              value={formData.imageUrl} 
              onChange={handleChange}
              placeholder="Paste image URL (https://...)"
              disabled={!!imageFile}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;
