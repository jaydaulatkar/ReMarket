// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Package, Inbox, Send, User, BarChart3, Eye, MessageCircle, TrendingUp } from 'lucide-react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, listings, received, sent
  
  const [myListings, setMyListings] = useState([]);
  const [receivedInquiries, setReceivedInquiries] = useState([]);
  const [sentInquiries, setSentInquiries] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const [listingsRes, receivedRes, sentRes, dashRes] = await Promise.all([
          api.get('/api/listings/my'),
          api.get('/api/inquiries/received'),
          api.get('/api/inquiries/sent'),
          api.get('/api/listings/dashboard/seller').catch(() => null)
        ]);
        
        setMyListings(listingsRes.data.listings);
        setReceivedInquiries(receivedRes.data.inquiries);
        setSentInquiries(sentRes.data.inquiries);
        if (dashRes) setDashboardData(dashRes.data);
      } catch (error) {
        console.error('Failed to fetch profile data', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfileData();
  }, [user]);

  const handleArchive = async (listingId, isArchived) => {
    try {
      const res = await api.post(`/api/listings/${listingId}/archive`);
      setMyListings(myListings.map(l => l._id === listingId ? res.data.listing : l));
      setDashboardData(null);
    } catch (error) {
      console.error('Failed to archive listing', error);
    }
  };

  const handleRelist = async (listingId) => {
    try {
      const res = await api.post(`/api/listings/${listingId}/relist`);
      setMyListings(myListings.map(l => l._id === listingId ? res.data.listing : l));
      setDashboardData(null);
    } catch (error) {
      console.error('Failed to re-list', error);
    }
  };

  if (!user) return null;

  return (
    <div className="page-container container animate-fade-in">
      {/* Profile Header */}
      <div className="profile-header glass-panel">
        <div className="profile-avatar">
          <User size={40} className="text-accent" />
        </div>
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p className="text-secondary">{user.email}</p>
          <p className="profile-date">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="profile-layout">
        <aside className="profile-sidebar glass-panel">
          <nav className="profile-nav">
            <button 
              className={`profile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 size={18} /> Dashboard
            </button>
            <button 
              className={`profile-nav-item ${activeTab === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveTab('listings')}
            >
              <Package size={18} /> My Listings ({myListings.length})
            </button>
            <button 
              className={`profile-nav-item ${activeTab === 'received' ? 'active' : ''}`}
              onClick={() => setActiveTab('received')}
            >
              <Inbox size={18} /> Inbox ({receivedInquiries.length})
            </button>
            <button 
              className={`profile-nav-item ${activeTab === 'sent' ? 'active' : ''}`}
              onClick={() => setActiveTab('sent')}
            >
              <Send size={18} /> Sent Messages ({sentInquiries.length})
            </button>
          </nav>
        </aside>

        <main className="profile-content glass-panel">
          {loading ? (
            <div className="text-center p-4">Loading your data...</div>
          ) : (
            <>
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && dashboardData && (
                <div>
                  <h3 className="mb-6">📊 Seller Dashboard</h3>
                  
                  {/* Metrics Grid */}
                  <div className="dashboard-metrics grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="metric-card glass-panel p-4 rounded text-center">
                      <div className="metric-icon text-accent mb-2">
                        <Package size={24} className="inline" />
                      </div>
                      <div className="metric-value">{dashboardData.summary.activeListings}</div>
                      <div className="metric-label text-secondary text-sm">Active Listings</div>
                    </div>
                    
                    <div className="metric-card glass-panel p-4 rounded text-center">
                      <div className="metric-icon text-accent mb-2">
                        <Eye size={24} className="inline" />
                      </div>
                      <div className="metric-value">{dashboardData.summary.totalViews}</div>
                      <div className="metric-label text-secondary text-sm">Total Views</div>
                    </div>
                    
                    <div className="metric-card glass-panel p-4 rounded text-center">
                      <div className="metric-icon text-accent mb-2">
                        <MessageCircle size={24} className="inline" />
                      </div>
                      <div className="metric-value">{dashboardData.summary.totalInquiries}</div>
                      <div className="metric-label text-secondary text-sm">Inquiries</div>
                    </div>
                    
                    <div className="metric-card glass-panel p-4 rounded text-center">
                      <div className="metric-icon text-accent mb-2">
                        <TrendingUp size={24} className="inline" />
                      </div>
                      <div className="metric-value">{dashboardData.summary.soldListings}</div>
                      <div className="metric-label text-secondary text-sm">Sold Items</div>
                    </div>
                  </div>

                  {/* Listing Performance */}
                  <div className="listing-performance">
                    <h4 className="mb-4">📈 Your Listings Performance</h4>
                    <div className="listings-table">
                      <table className="w-full text-sm">
                        <thead className="text-secondary border-b">
                          <tr>
                            <th className="text-left p-2">Title</th>
                            <th className="text-center p-2">👁️ Views</th>
                            <th className="text-center p-2">💬 Inquiries</th>
                            <th className="text-center p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.listingMetrics.map(metric => (
                            <tr key={metric.id} className="border-b hover:bg-opacity-50">
                              <td className="text-left p-2">
                                <Link to={`/listings/${metric.id}`} className="text-accent hover:underline">
                                  {metric.title}
                                </Link>
                              </td>
                              <td className="text-center p-2">{metric.views}</td>
                              <td className="text-center p-2">{metric.inquiries}</td>
                              <td className="text-center p-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  metric.isArchived ? 'bg-gray-600 text-white' : 
                                  metric.isSold ? 'bg-blue-600 text-white' : 
                                  'bg-green-600 text-white'
                                }`}>
                                  {metric.isArchived ? 'Archived' : metric.isSold ? 'Sold' : 'Active'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* My Listings Tab */}
              {activeTab === 'listings' && (
                <div>
                  <div className="tab-header">
                    <h3>My Listings</h3>
                    <Link to="/create-listing" className="btn btn-primary btn-sm">Sell New Item</Link>
                  </div>
                  
                  {myListings.length > 0 ? (
                    <div className="browse-grid mt-4">
                      {myListings.map(listing => (
                        <div key={listing._id} className="listing-item-wrapper">
                          <ListingCard listing={listing} />
                          <div className="listing-actions mt-2 flex gap-2">
                            <button
                              onClick={() => handleArchive(listing._id, listing.isArchived)}
                              className="btn btn-outline btn-sm flex-1"
                            >
                              {listing.isArchived ? 'Unarchive' : 'Archive'}
                            </button>
                            {listing.isArchived && (
                              <button
                                onClick={() => handleRelist(listing._id)}
                                className="btn btn-primary btn-sm flex-1"
                              >
                                Re-list
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">You haven't listed any items yet.</p>
                  )}
                </div>
              )}

              {/* Inbox (Received) Tab */}
              {activeTab === 'received' && (
                <div>
                  <h3>Inbox</h3>
                  <p className="text-secondary mb-4">Messages from buyers interested in your items.</p>
                  
                  {receivedInquiries.length > 0 ? (
                    <div className="inquiries-list">
                      {receivedInquiries.map(inq => (
                        <div key={inq._id} className="inquiry-card">
                          <div className="inquiry-header">
                            <span className="inquiry-sender">{inq.buyer.username}</span>
                            <span className="inquiry-date">{new Date(inq.createdAt).toLocaleDateString()}</span>
                          </div>
                          <Link to={`/listings/${inq.listing._id}`} className="inquiry-item-link">
                            Regarding: {inq.listing.title}
                          </Link>
                          <p className="inquiry-message">"{inq.message}"</p>
                          <a href={`mailto:${inq.buyer.email}`} className="btn btn-outline btn-sm mt-3">
                            Reply via Email
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No messages received yet.</p>
                  )}
                </div>
              )}

              {/* Sent Messages Tab */}
              {activeTab === 'sent' && (
                <div>
                  <h3>Sent Messages</h3>
                  <p className="text-secondary mb-4">Inquiries you've sent to sellers.</p>
                  
                  {sentInquiries.length > 0 ? (
                    <div className="inquiries-list">
                      {sentInquiries.map(inq => (
                        <div key={inq._id} className="inquiry-card">
                          <div className="inquiry-header">
                            <span className="inquiry-sender">To: {inq.seller.username}</span>
                            <span className="inquiry-date">{new Date(inq.createdAt).toLocaleDateString()}</span>
                          </div>
                          <Link to={`/listings/${inq.listing._id}`} className="inquiry-item-link">
                            Regarding: {inq.listing.title}
                          </Link>
                          <p className="inquiry-message">"{inq.message}"</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">You haven't sent any messages yet.</p>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
