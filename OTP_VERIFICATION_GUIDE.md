# OTP Email Verification System

## Overview
A secure OTP (One-Time Password) email verification system has been implemented to authenticate user emails during account creation. This prevents fake/disposable email registrations and ensures legitimate users.

---

## ✨ Features

### 1. **OTP Generation & Delivery**
- Generate random 6-digit OTP on signup
- Send via Gmail SMTP
- OTP expires in 10 minutes
- User-friendly HTML email template

### 2. **Two-Step Registration Flow**
1. **Step 1**: User creates account (username, email, password)
2. **Step 2**: User verifies email with OTP code

### 3. **Login Email Verification**
- Prevent login if email not verified
- Show verification screen for unverified emails
- Allow resending OTP during login

### 4. **Resend OTP**
- One-click resend with 60-second cooldown
- Generates new OTP (old one invalidated)

---

## 🔧 Setup Instructions

### Step 1: Gmail App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" if not already enabled
3. Go to "App passwords" section
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password

### Step 2: Update .env File
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

**Important**: Use App Password, NOT your regular Gmail password!

### Step 3: Install Dependencies
```bash
cd Backend
npm install
# or if already installed
npm update
```

The `nodemailer` package is already added to `package.json`.

---

## 📋 API Endpoints

### 1. Register (Send OTP)
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (201):**
```json
{
  "message": "Account created! Check your email for the verification code.",
  "userId": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "requiresVerification": true
}
```

**Possible Errors:**
- 400: Email already exists
- 400: Username already taken
- 500: Failed to send verification email

---

### 2. Verify OTP
**POST** `/api/auth/verify-otp`

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "message": "Email verified successfully! You can now login.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-06-07T21:10:00.000Z"
  }
}
```

**Possible Errors:**
- 400: Invalid OTP
- 400: OTP expired
- 404: User not found
- 400: Email already verified

---

### 3. Resend OTP
**POST** `/api/auth/resend-otp`

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011"
}
```

**Response (200):**
```json
{
  "message": "Verification code sent to your email.",
  "email": "john@example.com"
}
```

---

### 4. Login (Updated)
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response if email verified (200):**
```json
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

**Response if email NOT verified (403):**
```json
{
  "message": "Please verify your email first.",
  "requiresVerification": true,
  "userId": "507f1f77bcf86cd799439011"
}
```

---

## 🗄️ Database Changes

### User Model Updates
Added three new fields to `Listing.js`:

```javascript
{
  otp: {
    type: String,
    default: null
  },
  otpExpiry: {
    type: Date,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  }
}
```

**Fields:**
- `otp`: Stores the current 6-digit OTP code (null after verification)
- `otpExpiry`: Timestamp when OTP expires (10 minutes after generation)
- `isEmailVerified`: Boolean flag indicating email verification status

---

## 🎨 Frontend Changes

### RegisterPage.jsx (Complete Rewrite)
- **Step 1**: Initial signup form (username, email, password)
- **Step 2**: OTP verification screen
- Features:
  - Auto-format OTP input (numbers only, max 6 digits)
  - Resend button with 60-second cooldown
  - Timer countdown display
  - "Back to signup" button
  - Masked OTP input display (large, spaced digits)

### LoginPage.jsx (Updated)
- Detects unverified emails (403 response)
- Shows OTP verification screen automatically
- Same verification flow as register
- Can resend OTP from login verification screen

### AuthContext.jsx (Updated)
- New method: `setAuthToken(token)`
- Sets token in localStorage
- Fetches user profile
- Used after OTP verification

---

## 📧 Email Templates

### Verification Email
- Beautiful HTML template with brand colors
- Shows 6-digit OTP prominently
- Clear expiration message (10 minutes)
- Professional styling with gradient header

### Welcome Email (Sent after verification)
- Congratulations message
- List of features user can now access
- Professional footer

---

## 🧪 Testing the OTP System

### Test 1: Complete Registration Flow
```bash
1. Navigate to /register
2. Fill signup form
3. Submit
4. Should see "Check your email" message
5. Check Gmail inbox for OTP
6. Enter 6-digit code
7. Should redirect to home page
```

### Test 2: Resend OTP
```bash
1. On verification screen, wait 5 seconds
2. Click "Resend verification code"
3. Should receive new OTP email
4. Old OTP becomes invalid
5. Enter new code
```

### Test 3: Login with Unverified Email
```bash
1. Create account but don't verify
2. Go to /login
3. Enter email and password
4. Should see "Please verify email" error
5. Verification screen should appear
6. Enter OTP to complete verification
```

### Test 4: Expired OTP
```bash
1. Register for account
2. Wait 10+ minutes
3. Try to verify with old OTP
4. Should get "OTP has expired" error
5. Click resend to get new OTP
```

---

## 🔒 Security Considerations

### 1. OTP Expiration
- OTPs expire after 10 minutes
- User can request new OTP via resend button
- Old OTP is cleared on resend

### 2. OTP Format
- 6-digit numeric code (1,000,000 combinations)
- Randomly generated using `Math.random()`
- Sufficient entropy for email verification

### 3. Email Not Sent Failures
- If OTP email fails, user account is deleted
- User must try registration again
- Prevents orphaned unverified accounts

### 4. Password Hashing
- Passwords hashed with bcrypt (10 salt rounds)
- OTP stored as plain text (acceptable - short lived, low value)
- Consider: Could hash OTP for extra security

### 5. Token Generation
- JWT tokens signed with `JWT_SECRET`
- 7-day expiration
- Only issued after email verification

---

## 🚀 Deployment Checklist

- [ ] Update Gmail credentials in production `.env`
- [ ] Test email sending with production Gmail account
- [ ] Verify OTP email template displays correctly
- [ ] Test complete signup flow in production
- [ ] Test login with unverified email
- [ ] Monitor email delivery rates
- [ ] Set up error logging for failed email sends

---

## 📝 Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `GMAIL_USER` | Sender email address | `noreply@remarket.com` |
| `GMAIL_PASSWORD` | App-specific password | `xxxx-xxxx-xxxx-xxxx` |
| `JWT_SECRET` | Token signing key | `your-secret-key` |
| `MONGO_URI` | MongoDB connection | `mongodb+srv://...` |
| `PORT` | Server port | `5000` |

---

## 🔗 Related Documentation

- User Model: `Backend/models/User.js`
- Auth Routes: `Backend/routes/auth.js`
- Email Service: `Backend/utils/emailService.js`
- Register Page: `Frontend/src/pages/RegisterPage.jsx`
- Login Page: `Frontend/src/pages/LoginPage.jsx`
- Auth Context: `Frontend/src/context/AuthContext.jsx`

---

## ❓ FAQ

**Q: Why use OTP instead of email link?**
A: OTP is simpler, faster, and doesn't require email link click-through. Better UX.

**Q: Can I customize the OTP length?**
A: Yes, modify `generateOTP()` in `Backend/utils/emailService.js`

**Q: What if user's email is already verified?**
A: Can't re-verify. Login works normally. API prevents double verification.

**Q: How often can users resend OTP?**
A: Unlimited times, but cooldown of 60 seconds between resends.

**Q: Can I use a different email provider?**
A: Yes! Nodemailer supports many providers. Update transporter config in `emailService.js`

---

## 📞 Support

For issues with:
- **Email not sending**: Check Gmail credentials and "Less secure apps" settings
- **OTP not validating**: Ensure user hasn't waited >10 minutes
- **Token issues**: Check JWT_SECRET matches in .env
- **Database errors**: Verify MongoDB connection

