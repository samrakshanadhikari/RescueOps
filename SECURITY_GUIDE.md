# 🔐 Security Guide - ResQueAid

## How Your User Data is Protected

### 1. Password Security

**Hashing with Bcrypt**
- Passwords are NEVER stored in plain text
- Bcrypt automatically adds salt (random data) to each password
- Salt rounds: 10 (good balance of security and performance)
- Even if database is compromised, passwords cannot be reversed

**Example Flow:**
```
User enters: "mypassword123"
↓
Bcrypt hashes: "$2a$10$N9qo8uLOickgx2ZMRZoMye/IVI8BFlBhSWM4qK8/"
↓
Stored in MongoDB: "$2a$10$N9qo8uLOickgx2ZMRZoMye/IVI8BFlBhSWM4qK8/"
```

**Code Implementation:**
```javascript
// In User.js model
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

### 2. JWT (JSON Web Token) Authentication

**What is JWT?**
- Secure token-based authentication
- Token contains user ID (encrypted)
- Token expires after 30 days
- Cannot be tampered with (signed with secret key)

**JWT Structure:**
```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQifQ.signature
```

**Security Features:**
- Tokens are signed with JWT_SECRET (change in production!)
- Tokens include expiration time
- Invalid or expired tokens are rejected
- Sent in Authorization header (not in URL)

### 3. Input Validation

**Server-Side Validation:**
- Email format validation
- Password length requirements (min 6 characters)
- Required field validation
- SQL injection prevention (Mongoose ODM)

**Code Example:**
```javascript
body('email').isEmail().withMessage('Please provide a valid email'),
body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
```

### 4. MongoDB Security

**Mongoose Benefits:**
- Protection against NoSQL injection
- Schema validation
- Type casting
- Query sanitization

**Best Practices Implemented:**
```javascript
- Unique email addresses
- Indexed fields for performance
- Data validation at schema level
- Password field excluded from JSON responses
```

### 5. CORS (Cross-Origin Resource Sharing)

**Protection Against:**
- Cross-site request forgery
- Unauthorized API access
- XSS attacks

**Configuration:**
```javascript
app.use(cors()); // Allows frontend to communicate with backend
```

## 🔒 Security Best Practices for Production

### 1. Environment Variables

**NEVER commit these to Git:**
```bash
JWT_SECRET=your_super_secret_key_here  # Use long random string
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

**Generate secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. MongoDB Production Setup

**Use MongoDB Atlas (Cloud):**
- Free tier available
- Automatic backups
- SSL/TLS encryption
- IP whitelisting
- Database user authentication

**Security Settings:**
```
✅ Enable authentication
✅ Use strong passwords
✅ Whitelist specific IP addresses
✅ Enable encryption at rest
✅ Regular backups
```

### 3. HTTPS in Production

**Always use HTTPS:**
- Encrypts data in transit
- Prevents man-in-the-middle attacks
- Required for secure cookies

**Deploy with:**
- Heroku (free SSL)
- Vercel (automatic HTTPS)
- AWS with SSL certificate
- Nginx with Let's Encrypt

### 4. Additional Security Measures

**Rate Limiting (Recommended):**
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

**Helmet.js (Security Headers):**
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

**Express Validator (Already Implemented):**
- Sanitizes user input
- Prevents injection attacks
- Validates data types

### 5. Token Storage

**Current Implementation:**
- Tokens stored in localStorage
- Sent in Authorization header

**Production Considerations:**
- Consider httpOnly cookies for extra security
- Implement refresh tokens for better security
- Add token blacklist for logout

## 🚨 Security Checklist Before Deployment

- [ ] Change JWT_SECRET to secure random string
- [ ] Use MongoDB Atlas or secure MongoDB instance
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Add helmet.js for security headers
- [ ] Enable CORS for specific origins only
- [ ] Implement password reset with email verification
- [ ] Add 2FA (Two-Factor Authentication) for admin accounts
- [ ] Set up error logging (don't expose stack traces)
- [ ] Regular security audits
- [ ] Keep dependencies updated

## 📊 How Login Works (Security Flow)

### Registration:
```
1. User submits form
   ↓
2. Server validates input (email, password length)
   ↓
3. Check if email already exists
   ↓
4. Hash password with bcrypt (salt + hash)
   ↓
5. Save user to MongoDB (password is hashed)
   ↓
6. Generate JWT token (signed with secret)
   ↓
7. Send token to client
   ↓
8. Client stores token in localStorage
```

### Login:
```
1. User enters email + password
   ↓
2. Server finds user by email
   ↓
3. Compare entered password with hashed password (bcrypt.compare)
   ↓
4. If match: Generate JWT token
   ↓
5. Send token to client
   ↓
6. Client stores token, redirects to dashboard
```

### Protected Routes:
```
1. Client sends request with Authorization header
   ↓
2. Server extracts JWT token
   ↓
3. Verify token signature and expiration
   ↓
4. Decode user ID from token
   ↓
5. Fetch user from database
   ↓
6. Allow access to protected resource
```

## 🛡️ Common Security Threats Prevented

| Threat | How We Prevent It |
|--------|-------------------|
| Password Theft | Bcrypt hashing, passwords never stored in plain text |
| SQL Injection | Mongoose ODM, parameterized queries |
| XSS Attacks | Input validation, React escapes output automatically |
| CSRF | JWT tokens (not cookies), CORS configuration |
| Brute Force | Password requirements, rate limiting (recommended) |
| Token Theft | HTTPS (in production), short token expiration |
| NoSQL Injection | Mongoose schema validation, input sanitization |

## 📖 Learn More

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://jwt.io/introduction)
- [Bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)

---

**Remember:** Security is an ongoing process. Stay updated with security best practices and regularly audit your application!

