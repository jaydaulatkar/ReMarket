# OTP System - Architecture & Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (Frontend)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  RegisterPage.jsx              LoginPage.jsx                   │
│  ├─ Step 1: Signup Form        ├─ Email & Password Input      │
│  └─ Step 2: OTP Verification   ├─ Check if verified           │
│                                └─ Show OTP screen if needed    │
│                                                                 │
│  AuthContext.jsx (Context)                                     │
│  ├─ login()                                                     │
│  ├─ register()                                                  │
│  ├─ setAuthToken() ← NEW                                        │
│  └─ logout()                                                    │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ HTTP Requests
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API SERVER (Backend)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Auth Routes (auth.js)                                          │
│  ├─ POST /register        → generateOTP() → sendOTPEmail()     │
│  ├─ POST /verify-otp      → validate OTP → sendWelcomeEmail()  │
│  ├─ POST /resend-otp      → new OTP → sendOTPEmail()           │
│  └─ POST /login           → check isEmailVerified              │
│                                                                 │
│  Email Service (emailService.js)                                │
│  ├─ generateOTP()         [6-digit random]                     │
│  ├─ sendOTPEmail()        [via Gmail SMTP]                     │
│  └─ sendWelcomeEmail()    [after verification]                 │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ Database Queries
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE (MongoDB)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User Collection                                                │
│  {                                                              │
│    _id: ObjectId                                                │
│    username: String                                             │
│    email: String                                                │
│    password: String (hashed)                                    │
│    otp: String ← NEW                                            │
│    otpExpiry: Date ← NEW                                        │
│    isEmailVerified: Boolean ← NEW                               │
│    createdAt: Date                                              │
│    updatedAt: Date                                              │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ Email Delivery
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Gmail SMTP Server                          │
├─────────────────────────────────────────────────────────────────┤
│ Sends emails to user using nodemailer                           │
│ Credentials from Backend/.env (GMAIL_USER, GMAIL_PASSWORD)     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Registration Flow (Sequence Diagram)

```
User              Frontend         Backend          Database        Gmail
 │                   │               │                 │              │
 ├─ Fill signup ──→  │               │                 │              │
 │                   │               │                 │              │
 ├─ Click SignUp ──→  │               │                 │              │
 │                   ├─ POST /register →                │              │
 │                   │                ├─ generateOTP() →│              │
 │                   │                ├─ Create user   │              │
 │                   │                │  (unverified)  │              │
 │                   │                │                │              │
 │                   │                ├─ sendOTPEmail() ──────────→ │
 │                   │                │                │          (Send)
 │                   │  ← 201 OK ←    │                │              │
 │                   │  {userId}      │                │              │
 │                   │                │                │              │
 │  ← Show verify ←  │                │                │              │
 │    screen         │                │                │              │
 │                   │                │                │              │
 ├─ Check email ──────────────────────────────────────────────────→ │
 │                   │                │                │          (Receive)
 ├─ Copy OTP ←───────────────────────────────────────────────────── │
 │                   │                │                │              │
 ├─ Enter OTP ──→    │                │                │              │
 │                   ├─ POST /verify-otp →             │              │
 │                   │                ├─ Check OTP    │              │
 │                   │                ├─ Verify date  │              │
 │                   │                ├─ Update user  │              │
 │                   │                │  {verified=T} │              │
 │                   │                ├─ sendWelcome() ───────────→ │
 │                   │  ← 200 OK ←    │                │          (Send)
 │                   │  {token}       │                │              │
 │                   │                │                │              │
 │  ← Redirect home  │                │                │              │
 │  ← Logged in! ←   │                │                │              │
 │                   │                │                │              │
```

---

## Login Flow (Unverified Email)

```
User              Frontend         Backend          Database
 │                   │               │                 │
 ├─ Go to login ──→  │               │                 │
 │                   │               │                 │
 ├─ Enter email ──→  │               │                 │
 ├─ Enter password → │               │                 │
 │                   ├─ POST /login ──→                │
 │                   │                ├─ Check password│
 │                   │                ├─ Check if verified
 │                   │                │  (isEmailVerified=false)
 │                   │  ← 403 ←       │                │
 │                   │  {requiresVerification: true}   │
 │                   │                │                │
 │  ← Show verify ←  │                │                │
 │    screen         │                │                │
 │                   │ (Same as register verify flow)  │
 │                   │                │                │
```

---

## OTP Field Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Created                             │
│                                                                 │
│  otp: "123456"                   (6-digit code generated)      │
│  otpExpiry: 2024-06-07T21:20:00  (10 minutes from now)         │
│  isEmailVerified: false                                         │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ↓ (OTP sent via email)
                            │
                ┌───────────┴───────────┐
                │                       │
           [Email arrives]         [Email arrives]
                │                       │
    ┌──────────────────┐    ┌──────────────────┐
    │ User enters OTP  │    │ User waits >10m  │
    │ Within 10 mins   │    │ OTP expired      │
    │                  │    │                  │
    └──────────────────┘    └──────────────────┘
           │                       │
           ↓                       ↓
    ┌──────────────────┐    ┌──────────────────┐
    │ Verify success   │    │ Error: Expired   │
    │                  │    │                  │
    │ otp: null        │    │ Can still resend │
    │ otpExpiry: null  │    │                  │
    │ isEmailVerified: │    │ (new OTP sent)   │
    │   true           │    │                  │
    │                  │    │ otp: "654321"    │
    │ JWT token sent   │    │ otpExpiry: +10m  │
    │ User logged in   │    │                  │
    └──────────────────┘    └──────────────────┘
```

---

## API Response Examples

### 1. Registration (Sends OTP)
```javascript
// Request
POST /api/auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Pass123456"
}

// Response (201)
{
  "message": "Account created! Check your email for the verification code.",
  "userId": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "requiresVerification": true
}
```

### 2. Verify OTP (Success)
```javascript
// Request
POST /api/auth/verify-otp
{
  "userId": "507f1f77bcf86cd799439011",
  "otp": "123456"
}

// Response (200)
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

### 3. Login (Unverified Email)
```javascript
// Request
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "Pass123456"
}

// Response (403)
{
  "message": "Please verify your email first.",
  "requiresVerification": true,
  "userId": "507f1f77bcf86cd799439011"
}
```

### 4. Login (Verified Email)
```javascript
// Request
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "Pass123456"
}

// Response (200)
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-06-07T21:10:00.000Z"
  }
}
```

---

## State Transitions

```
                    ┌─────────────────────┐
                    │   Account Created   │
                    │  (unverified)       │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
               [OTP valid]          [OTP invalid/expired]
                    │                     │
                    ↓                     ↓
        ┌──────────────────┐   ┌──────────────────┐
        │  Email Verified  │   │   Resend OTP     │
        │  Can login now   │   │   Get new code   │
        │  Receive welcome │   │   Try again      │
        │  email           │   │                  │
        └──────────────────┘   └────────┬─────────┘
                                       │
                                [OTP valid again]
                                       │
                                       └────→ Back to verified


Before Verification:
  ├─ Cannot create listings
  ├─ Cannot message sellers
  └─ Cannot buy items

After Verification:
  ├─ Can do everything
  ├─ JWT token active (7 days)
  └─ Full marketplace access
```

---

## File Dependencies

```
emailService.js (Email Logic)
    │
    └─→ Used by: auth.js (routes)
            │
            ├─→ Uses: User.js (model)
            ├─→ Uses: jwt (token generation)
            └─→ Uses: bcrypt (password hashing)

Frontend Components:
    │
    ├─→ RegisterPage.jsx
    │       └─→ Uses: AuthContext (setAuthToken)
    │       └─→ Uses: api (HTTP calls)
    │
    ├─→ LoginPage.jsx
    │       └─→ Uses: AuthContext (setAuthToken)
    │       └─→ Uses: api (HTTP calls)
    │
    └─→ AuthContext.jsx
            ├─→ Uses: api (HTTP calls)
            └─→ Provides: setAuthToken() to components
```

---

## Security Implementation

```
┌─────────────────────────────────────────────────────┐
│             OTP Generation                          │
├─────────────────────────────────────────────────────┤
│ Random: Math.floor(100000 + Math.random()*900000)   │
│ Result: 6 digits, 1M combinations                   │
│ Sufficient entropy for email verification           │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│             OTP Expiration                          │
├─────────────────────────────────────────────────────┤
│ Expires: 10 minutes from generation                 │
│ Checked: On every verify attempt                    │
│ Cleared: After successful verification              │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│             Database Security                       │
├─────────────────────────────────────────────────────┤
│ Passwords: Hashed with bcrypt (salt 10)             │
│ OTP: Plain text (short-lived, low risk)             │
│ JWT: Signed with JWT_SECRET, 7-day expiry          │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│             Email Security                          │
├─────────────────────────────────────────────────────┤
│ Provider: Gmail SMTP (secure TLS/SSL)               │
│ Credentials: App password (not main password)       │
│ Content: Standard HTML template                     │
└─────────────────────────────────────────────────────┘
```

---

## Configuration Example

```env
# Backend/.env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-secret-key-here

# Email Configuration (NEW)
GMAIL_USER=noreply@company.com
GMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

All set! The system is fully documented and ready to use. 🎉

