# New Features - Seller Dashboard & Listing Expiry System

## Feature 1: Seller Dashboard with Metrics

### Endpoint
**GET** `/api/listings/dashboard/seller` (Protected - Auth Required)

### Description
Returns comprehensive metrics for a seller including views, inquiries, sold listings, and response time.

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
      "id": "listing_id_123",
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

### Key Metrics
- **totalListings**: Total number of listings created by seller
- **activeListings**: Listings that are not sold and not archived
- **soldListings**: Listings marked as sold
- **archivedListings**: Auto-archived or manually archived listings
- **totalViews**: Total views across all listings
- **totalInquiries**: Total inquiries received by seller
- **avgResponseTimeHours**: Average response time to buyer inquiries (in hours)

---

## Feature 2: View Tracking

### How It Works
- Views are tracked automatically when a listing is viewed
- Each time `GET /api/listings/:id` is called, the view count increments by 1
- View count is included in listing details

### Benefits
- Sellers can see which listings are popular
- Dashboard shows total views as a key metric
- Helps sellers understand buyer interest

---

## Feature 3: Automatic Listing Expiry (30 Days)

### How It Works
1. Listings created more than **30 days ago** are automatically archived
2. Only active (non-sold) listings are archived
3. Archived listings **do not appear** in browse/search results
4. Sellers can **re-list** archived listings to bring them back

### Timeline
- **Day 0-29**: Listing is active and visible
- **Day 30+**: Listing is automatically archived (if not sold)
- **After Archive**: Seller can re-list to refresh

---

## Feature 4: Manual Archive/Re-list

### Archive Listing
**POST** `/api/listings/:id/archive` (Protected - Owner Only)

Manually archive a listing before 30 days or unarchive it.

**Response:**
```json
{
  "message": "Listing archived successfully!",
  "listing": { ... }
}
```

---

### Re-list Archived Listing
**POST** `/api/listings/:id/relist` (Protected - Owner Only)

Bring back an archived listing with fresh view count.

**Response:**
```json
{
  "message": "Listing re-listed successfully! It will appear fresh on the marketplace.",
  "listing": { ... }
}
```

**What happens on re-list:**
- `isArchived` is set to `false`
- `views` count is reset to `0`
- `updatedAt` timestamp is refreshed (appears newer in browse)

---

## Updated Fields in Listing Model

```javascript
{
  views: Number,           // View count (increments on GET)
  isArchived: Boolean,     // Archival status (default: false)
  // ... existing fields ...
}
```

---

## API Summary - Quick Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/api/listings/dashboard/seller` | Get seller dashboard metrics | ✅ |
| GET | `/api/listings/:id` | Get listing (increments views) | ❌ |
| POST | `/api/listings/:id/archive` | Archive/unarchive listing | ✅ |
| POST | `/api/listings/:id/relist` | Re-list archived listing | ✅ |

---

## UI Suggestions for Frontend

### Seller Dashboard Component
- Display summary cards for: Active Listings, Total Views, Total Inquiries, Sold Listings
- Show detailed list with listing performance (views, inquiries)
- Add badges: "⚠️ Old (30+ days)" on listings approaching expiry
- "Archived" badge on archived listings

### Listing Cards
- Show view count badge (e.g., "👁️ 45 views")
- Show inquiry count (e.g., "💬 3 inquiries")
- Show status badge (Active/Sold/Archived)

### Seller Actions
- "📊 View Dashboard" link in user menu
- "Archive" button on seller's own listings
- "Re-list" button on archived listings
- Days-old indicator: "Posted 28 days ago"

---

## Product Value

✅ **Seller Retention**: Dashboard helps sellers track performance and stay engaged
✅ **Fresh Marketplace**: Auto-expiry keeps marketplace current
✅ **Easy Re-list**: One-click re-list reduces friction for resellers
✅ **Data-Driven**: Sellers can see which listings perform best
✅ **Professional Feel**: Metrics-driven experience shows polish
