# OTP System - Quick Setup & Testing Guide

## ⚡ Quick Start (5 minutes)

### 1. Configure Gmail Credentials
```bash
# In Backend/.env, add:
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

⚠️ **IMPORTANT**: Use Gmail App Password, not regular password:
- Go to: https://myaccount.google.com/apppasswords
- Select "Mail" and "Windows Computer"
- Copy the 16-character password

### 2. Restart Backend Server
```bash
cd Backend
npm install  # Already done, but ensures nodemailer is there
npm start
```

### 3. Test Registration Flow

#### Scenario 1: Register → Verify → Login
```
1. Open http://localhost:5173/register
2. Fill form:
   - Username: testuser123
   - Email: your-real-email@gmail.com (use YOUR email to receive OTP!)
   - Password: Test@123456
3. Click "Sign Up"
4. See "Check your inbox" message
5. Check email inbox for OTP
6. Copy 6-digit code
7. Paste into verification screen
8. Click "Verify Email"
9. Should redirect to home page
10. You're logged in! ✅
```

#### Scenario 2: Resend OTP
```
1. During verification, wait 5+ seconds
2. Click "Resend verification code"
3. Check email for NEW OTP
4. Try old OTP first → should fail
5. Try new OTP → should succeed ✅
```

#### Scenario 3: Login with Unverified Email
```
1. Don't verify email from registration
2. Go to /login
3. Enter unverified email and password
4. See error: "Please verify your email first"
5. Verification screen appears automatically
6. Enter OTP from email
7. Verify → now logged in ✅
```

---

## 🧪 Full Test Suite

### Test Case 1: Complete Registration
- ✅ Signup with valid credentials
- ✅ Receive OTP email within 30 seconds
- ✅ Enter OTP correctly → account created
- ✅ Redirected to home and logged in

### Test Case 2: Invalid OTP
- ✅ Enter wrong 6-digit code
- ✅ Error message: "Invalid OTP"
- ✅ Can try again

### Test Case 3: Expired OTP
- ✅ Wait 11+ minutes
- ✅ Try to verify with old OTP
- ✅ Error message: "OTP has expired"
- ✅ Resend OTP button works

### Test Case 4: Duplicate Email
- ✅ Register with email A
- ✅ Try to register same email again
- ✅ Error: "Email already exists"

### Test Case 5: Duplicate Username
- ✅ Register with username "john"
- ✅ Try to register same username with different email
- ✅ Error: "Username already taken"

### Test Case 6: Login Before Verification
- ✅ Register, don't verify
- ✅ Try to login with credentials
- ✅ Auto-shows verification screen
- ✅ Verify with OTP → login works

### Test Case 7: Resend Cooldown
- ✅ Click resend
- ✅ Button shows "Resend in 60s"
- ✅ Can't click until timer finishes
- ✅ After 60s, button is clickable again

---

## 📊 Implementation Checklist

### Backend
- ✅ User model updated with OTP fields (otp, otpExpiry, isEmailVerified)
- ✅ Email service created (emailService.js)
- ✅ Auth routes updated:
  - ✅ POST /api/auth/register (sends OTP)
  - ✅ POST /api/auth/verify-otp (verifies OTP)
  - ✅ POST /api/auth/resend-otp (resend OTP)
  - ✅ POST /api/auth/login (checks isEmailVerified)
  - ✅ GET /api/auth/me (returns isEmailVerified)
- ✅ nodemailer package installed

### Frontend
- ✅ RegisterPage.jsx rewritten (2-step flow)
- ✅ LoginPage.jsx updated (handles unverified emails)
- ✅ AuthContext.jsx updated (setAuthToken method)
- ✅ OTP input styling (large digits, spaced)
- ✅ Resend timer with countdown

### Configuration
- ✅ .env file updated with email config
- ✅ Email templates created (verification + welcome)

---

## 🔍 Debugging Tips

### Issue: "Failed to send verification email"

**Solution 1: Check Gmail credentials**
```
- Verify GMAIL_USER is correct email
- Verify GMAIL_PASSWORD is APP PASSWORD (not regular password)
- Test credentials in Gmail settings
```

**Solution 2: Enable "Less secure apps"**
```
- Go to https://myaccount.google.com/security
- Turn ON "Less secure app access"
(This might not work - app passwords are recommended)
```

**Solution 3: Check Internet Connection**
```
- Verify backend can reach Gmail SMTP
- Check firewall/proxy settings
```

---

### Issue: "OTP expires too quickly"

**Solution: Adjust expiry time**
```javascript
// In Backend/routes/auth.js, change this line:
const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

// To:
const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
```

---

### Issue: "Want longer OTP codes"

**Solution: Change OTP length**
```javascript
// In Backend/utils/emailService.js, change:
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// To 8 digits:
const generateOTP = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};
```

---

## 📈 Monitoring

### Check OTP Emails Are Sending
```bash
# Look in Backend console for:
✓ OTP email sent to user@example.com
```

### Check OTP Verification
```bash
# In browser console, look for successful verify response:
{
  message: "Email verified successfully! You can now login.",
  token: "...",
  user: {...}
}
```

### Check Database
```javascript
// In MongoDB, check User collection:
// isEmailVerified should be true after verification
// otp should be null (cleared after verification)
```

---

## 🚀 Production Deployment

### Before Going Live

1. **Update Email Credentials**
   ```
   GMAIL_USER=production-email@company.com
   GMAIL_PASSWORD=production-app-password
   ```

2. **Test with Real Users**
   - Have someone register from different location
   - Verify email works correctly
   - Verify OTP emails are not marked as spam

3. **Set Up Email Monitoring**
   - Track delivery rates
   - Monitor bounce rates
   - Set up alerts for failures

4. **Consider Email Rate Limits**
   - Gmail has sending limits
   - May need to upgrade or use email service (SendGrid, Mailgun)

---

## 📞 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Email not received | Wrong credentials | Check GMAIL_USER & GMAIL_PASSWORD |
| OTP expired | User waited >10 min | Resend OTP |
| Can't login verified user | Token expired | Let user logout and login again |
| Verification screen won't disappear | Frontend bug | Clear browser cache, restart |
| Multiple OTPs working | Old OTP not cleared | Ensure resend clears old OTP |

---

## 🎯 Next Steps (Optional Enhancements)

- [ ] Add SMS OTP option
- [ ] Add email not received help section
- [ ] Add rate limiting on resend button
- [ ] Add brute force protection
- [ ] Add email provider (SendGrid) for reliability
- [ ] Add OTP via authenticator app (Google Authenticator)

---

## 📞 Support

If you need to test and don't have Gmail:
1. Use a free Gmail account
2. Enable "Less secure apps" or use App Password
3. Forward real emails to this Gmail for testing

For production, consider professional email services like SendGrid or Mailgun.

