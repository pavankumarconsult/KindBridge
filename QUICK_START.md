# Quick Start Guide - User Requests & Admin Management

## What's New?

A complete request management system has been added to KindBridge with:
- User request submission and tracking
- Real-time status updates
- Admin dashboard for request management
- Role-based access control (admin vs user)

---

## 📁 New Files Created

### Components
- **`src/components/MyRequests.tsx`** - User's request tracking page
- **`src/components/AdminDashboard.tsx`** - Admin management dashboard

### Services
- **`src/services/requestService.ts`** - Firestore CRUD operations

### Configuration
- **`firestore.rules`** - Security rules for Firestore

### Documentation
- **`IMPLEMENTATION_GUIDE.md`** - Complete technical documentation

---

## 🔧 Updated Files

1. **`src/firebase/AuthContext.tsx`**
   - Added `isAdmin` flag to detect admin users
   - Admin email: `thekindbridge@gmail.com`

2. **`components/Navbar.tsx`**
   - Added "My Requests" button (visible when logged in)
   - Added "Admin Dashboard" button (visible for admins only)
   - Added `onNavigate` callback prop

3. **`components/RequestForm.tsx`**
   - Now uses authenticated user data
   - Saves requests with userId, userEmail, userName
   - Improved success message with tracking info

4. **`App.tsx`**
   - Added page routing system (home, my-requests, admin-dashboard)
   - Navigation state management
   - Conditional rendering for different pages

---

## 🚀 Quick Setup

### 1. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 2. Test as Regular User
- Login with any Google account (except admin email)
- Fill in your profile
- Submit a service request
- Click "My Requests" in navbar
- See your request with "Pending" status

### 3. Test as Admin
- Login with: `thekindbridge@gmail.com`
- Click "Admin Dashboard"
- See all requests
- Change status using dropdown
- See changes reflected in user's "My Requests"

---

## 📊 Database Schema

### Collection: `serviceRequests`

Each document contains:
```json
{
  "userId": "firebase_uid",
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "serviceType": "Web Development",
  "description": "Build a React app",
  "status": "Pending",
  "createdAt": "2026-02-02T10:30:00Z"
}
```

**Status Values**: `Pending` | `In Progress` | `Completed` | `Rejected`

---

## 🎨 Status Color Coding

| Status | Color | Background |
|--------|-------|------------|
| Pending | Yellow | #FEF08A |
| In Progress | Blue | #DBEAFE |
| Completed | Green | #DCFCE7 |
| Rejected | Red | #FEE2E2 |

---

## 🔐 Security Rules

**Simple Rules Summary**:
- ✅ Users see only their own requests
- ✅ Only admin can see all requests
- ✅ Only admin can update status
- ✅ Users must be logged in to submit

**View Full Rules**: See `firestore.rules` file

---

## 🎯 Key Functions

### In `requestService.ts`

```typescript
// Submit a request
await submitServiceRequest(userId, userEmail, userName, serviceType, description)

// Get user's requests (real-time)
const unsubscribe = subscribeToUserRequests(userId, (requests) => {
  // Update UI with requests
})

// Get all requests for admin (real-time)
const unsubscribe = subscribeToAllRequests((requests) => {
  // Update admin UI
})

// Update status
await updateRequestStatus(requestId, 'In Progress')
```

---

## 🧭 Navigation Structure

```
Home (Landing Page)
├── My Requests (user page)
├── Admin Dashboard (admin only)
└── Request Form (embedded)
```

Navbar buttons:
- "My Requests" → Navigate to user requests
- "Admin Dashboard" → Navigate to admin dashboard (admins only)
- "Back to Home" → Return to main page

---

## ✅ Checklist for Testing

### User Features
- [ ] Can login with Google
- [ ] Can complete profile
- [ ] Can submit service request
- [ ] Can see own requests in "My Requests"
- [ ] Can see real-time status updates
- [ ] Cannot see other users' requests

### Admin Features
- [ ] Can login with `thekindbridge@gmail.com`
- [ ] Can access "Admin Dashboard"
- [ ] Can see all requests
- [ ] Can change status via dropdown
- [ ] Can filter by status
- [ ] Can see statistics

### Security
- [ ] Non-admin cannot access admin dashboard
- [ ] Non-admin cannot update status
- [ ] Non-authenticated users cannot submit requests
- [ ] Firestore rules prevent unauthorized access

---

## 🐛 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| My Requests not loading | Check if logged in, verify userId exists |
| Admin Dashboard 404 | Ensure using admin email: `thekindbridge@gmail.com` |
| Status not updating | Refresh page or check internet connection |
| Form won't submit | Verify you're logged in and profile is complete |
| Firestore errors | Check rules are deployed: `firebase deploy --only firestore:rules` |

---

## 📚 Component API

### MyRequests Props
```typescript
interface MyRequests {
  onBack: () => void;  // Navigate back to home
}
```

### AdminDashboard Props
```typescript
interface AdminDashboard {
  onBack: () => void;  // Navigate back to home
}
```

### Navbar Props
```typescript
interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onNavigate: (page: string) => void;  // NEW
}
```

---

## 🔄 Real-time Updates

Both components use Firestore's `onSnapshot` listener:

```typescript
const unsubscribe = subscribeToUserRequests(userId, (requests) => {
  setRequests(requests);  // Automatic re-render on any change
});

// Cleanup listener when component unmounts
useEffect(() => {
  return () => unsubscribe();
}, []);
```

---

## 📱 Responsive Design

- **Mobile**: Single column, stacked layout
- **Tablet**: 2 columns
- **Desktop**: 3 columns (requests), full table width (admin)

---

## 🎓 Learning Resources

- **requestService.ts** - Study for Firestore query patterns
- **MyRequests.tsx** - Study for real-time UI updates
- **AdminDashboard.tsx** - Study for admin features
- **firestore.rules** - Study for security best practices

---

## 📝 Next Steps

1. Deploy firestore rules: `firebase deploy --only firestore:rules`
2. Test with your Google account
3. Test with admin account
4. Monitor Firestore for data quality
5. Collect feedback from users
6. Plan future enhancements

---

**Happy coding! 🎉**

For detailed technical information, see `IMPLEMENTATION_GUIDE.md`
