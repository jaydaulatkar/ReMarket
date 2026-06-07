# Quick Start: New Features

## Feature 1: Seller Dashboard 📊

### Access the Dashboard
1. Log in as a seller
2. Go to your Profile page
3. Click the "Dashboard" tab (it's the default)
4. See your metrics!

### What You'll See
- **4 Metric Cards**: Active Listings | Total Views | Inquiries | Sold Items
- **Performance Table**: All your listings with views, inquiries, and status

### API Endpoint
```bash
GET /api/listings/dashboard/seller
Authorization: Bearer <your-token>
```

### Response Example
```json
{
  "summary": {
    "totalListings": 5,
    "activeListings": 3,
    "soldListings": 1,
    "archivedListings": 1,
    "totalViews": 245,
    "totalInquiries": 8,
    "avgResponseTimeHours": 2.5
  },
  "listingMetrics": [
    {
      "id": "listing_id",
      "title": "iPhone 12",
      "views": 45,
      "inquiries": 3,
      "isSold": false,
      "isArchived": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Feature 2: Auto-Archive & Re-list ⏰

### Timeline
- **Days 0-29**: Your listing is active and visible
- **Day 30+**: Automatically archived (hidden from browse)
- **Any Time**: You can manually archive or re-list

### How to Archive a Listing
1. Go to your Profile → My Listings tab
2. Click the "Archive" button on any listing
3. Listing is now hidden from public browse

### How to Re-list
1. Go to your Profile → My Listings tab
2. Filter for archived listings (status shows "Archived")
3. Click "Re-list" button
4. Listing appears fresh on marketplace with 0 views

### Archive Button Behavior
```
If listing is ACTIVE:     Shows "Archive" button
If listing is ARCHIVED:   Shows "Unarchive" + "Re-list" buttons
If listing is SOLD:       No archive buttons (permanent sale)
```

### What Happens on Re-list?
- ✅ Status changes from Archived → Active
- ✅ View count resets to 0 (fresh start)
- ✅ Updated timestamp (appears newer)
- ✅ Back in search results

---

## Feature 3: View Tracking 👁️

### View Count
- Increments automatically when someone views your listing
- Shows on listing detail page: "👁️ 45 views"
- Appears in your Dashboard metrics
- Helps you understand interest

### Where Views Appear
1. **Dashboard**: Total views across all listings
2. **Listing Detail Page**: Individual view count badge
3. **Performance Table**: Views per listing

---

## How to Test These Features

### Test 1: Create a Listing
1. Log in
2. Click "Sell New Item"
3. Fill in details and create listing

### Test 2: View Your Dashboard
1. Go to Profile → Dashboard tab
2. See your metrics in real-time
3. Check performance table

### Test 3: View Count
1. Log out (or use different browser)
2. Browse and click on your listing
3. Check view count increases

### Test 4: Archive a Listing
1. Profile → My Listings
2. Click "Archive" on a listing
3. Status changes to "Archived"

### Test 5: Re-list
1. Profile → My Listings (see archived listing)
2. Click "Re-list"
3. Listing is active again, views reset to 0

---

## API Endpoints Reference

### New Endpoints

```bash
# GET DASHBOARD METRICS
GET /api/listings/dashboard/seller
Headers: Authorization: Bearer <token>

# ARCHIVE/UNARCHIVE LISTING
POST /api/listings/:id/archive
Headers: Authorization: Bearer <token>
Body: {} (empty)

# RE-LIST ARCHIVED LISTING
POST /api/listings/:id/relist
Headers: Authorization: Bearer <token>
Body: {} (empty)
```

### Modified Endpoints

```bash
# GET LISTING (now tracks views)
GET /api/listings/:id
Response includes: views count (auto-incremented)

# BROWSE LISTINGS (now excludes archived)
GET /api/listings?category=Electronics&minPrice=10
# Only shows non-archived listings
```

---

## UI Components Updated

### ProfilePage.jsx
- New "Dashboard" tab with metrics
- Archive/Re-list buttons on listings
- Status badges (Active/Sold/Archived)
- Performance table with listing metrics

### ListingDetailPage.jsx
- View count badge showing "👁️ X views"
- Added to listing metadata section

---

## Product Benefits

### For Sellers
✅ Track listing performance
✅ See what's popular
✅ Understand buyer interest
✅ Easy way to refresh old listings
✅ Professional dashboard experience

### For Marketplace
✅ Keeps listings fresh (30-day cycle)
✅ Reduces clutter (auto-archive)
✅ Encourages seller engagement
✅ Shows professionalism & polish
✅ Data-driven seller tools

---

## Common Questions

**Q: Will my listing be deleted after 30 days?**
A: No! It's just archived (hidden). You can re-list it anytime with one click.

**Q: Do I have to manually archive listings?**
A: No, it happens automatically after 30 days. But you can manually archive earlier if you want.

**Q: Will my view count reset if I don't re-list?**
A: Only if you re-list. Archived listings keep their metrics, but views reset when you re-list.

**Q: Can buyers see archived listings?**
A: No, they're hidden from browse/search results. Only the seller can see them in My Listings.

**Q: How is "Response Time" calculated?**
A: It's the average time between inquiries from the same buyer. Helps show seller responsiveness.

---

## Next Steps

1. **Test all features** using the test cases above
2. **Try the Dashboard** - see your real metrics
3. **Archive an old listing** - see it disappear from browse
4. **Re-list it** - watch it reappear fresh
5. **Check view count** - understand buyer interest

Enjoy your new seller tools! 🚀
