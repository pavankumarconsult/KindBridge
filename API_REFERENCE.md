# API Reference - Service Requests Module

## Overview
Complete API documentation for the User Requests & Admin Status Management system.

---

## requestService.ts API

### Interfaces

#### ServiceRequest
```typescript
interface ServiceRequest {
  id: string;                                    // Firestore document ID
  userId: string;                                // Firebase UID
  userEmail: string;                             // User's email
  userName: string;                              // User's name
  serviceType: string;                           // Type of service
  description: string;                           // Request description
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected';
  createdAt: Timestamp;                          // Server timestamp
}
```

#### ServiceRequestInput
```typescript
type ServiceRequestInput = Omit<ServiceRequest, 'id' | 'createdAt'>;
```

---

## Functions

### submitServiceRequest()

**Purpose**: Submit a new service request to Firestore

**Signature**:
```typescript
submitServiceRequest(
  userId: string,
  userEmail: string,
  userName: string,
  serviceType: string,
  description: string
): Promise<string>
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | Firebase UID of the user |
| userEmail | string | Yes | Email of the user |
| userName | string | Yes | Display name of the user |
| serviceType | string | Yes | Type of service (e.g., "Web Development") |
| description | string | Yes | Detailed description of the request |

**Returns**: 
- `Promise<string>` - Document ID of the created request

**Throws**: 
- Firebase Error if Firestore write fails

**Example**:
```typescript
const requestId = await submitServiceRequest(
  'user123',
  'user@example.com',
  'John Doe',
  'Web Development',
  'Build a React app with Tailwind'
);
console.log('Request created:', requestId);
```

---

### getUserRequests()

**Purpose**: Fetch all requests for a specific user (one-time fetch)

**Signature**:
```typescript
getUserRequests(userId: string): Promise<ServiceRequest[]>
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | Firebase UID of the user |

**Returns**: 
- `Promise<ServiceRequest[]>` - Array of user's requests, sorted by date (newest first)

**Throws**: 
- Firebase Error if query fails

**Example**:
```typescript
const requests = await getUserRequests('user123');
requests.forEach(req => {
  console.log(`${req.serviceType}: ${req.status}`);
});
```

---

### getAllRequests()

**Purpose**: Fetch all requests from the database (Admin only)

**Signature**:
```typescript
getAllRequests(): Promise<ServiceRequest[]>
```

**Parameters**: None

**Returns**: 
- `Promise<ServiceRequest[]>` - Array of all requests, sorted by date (newest first)

**Throws**: 
- Firebase Error if query fails

**Security Note**: Firestore rules prevent non-admins from reading this data

**Example**:
```typescript
const allRequests = await getAllRequests();
console.log(`Total requests: ${allRequests.length}`);
```

---

### updateRequestStatus()

**Purpose**: Update the status of a service request (Admin only)

**Signature**:
```typescript
updateRequestStatus(
  requestId: string,
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected'
): Promise<void>
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| requestId | string | Yes | Firestore document ID |
| status | enum | Yes | New status value |

**Returns**: 
- `Promise<void>` - Resolves when update is complete

**Throws**: 
- Firebase Error if update fails or user lacks permissions

**Security Note**: Firestore rules prevent non-admins from updating status

**Example**:
```typescript
try {
  await updateRequestStatus('req123', 'In Progress');
  console.log('Status updated successfully');
} catch (error) {
  console.error('Failed to update status:', error);
}
```

---

### subscribeToUserRequests()

**Purpose**: Subscribe to real-time updates of a user's requests

**Signature**:
```typescript
subscribeToUserRequests(
  userId: string,
  callback: (requests: ServiceRequest[]) => void
): () => void
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | Firebase UID of the user |
| callback | function | Yes | Function called with updated requests |

**Returns**: 
- `() => void` - Unsubscribe function to stop listening

**Callback Parameters**:
- `requests: ServiceRequest[]` - Current array of user's requests

**Example**:
```typescript
const unsubscribe = subscribeToUserRequests('user123', (requests) => {
  console.log('Updated requests:', requests);
  setRequests(requests);  // Update component state
});

// Later, unsubscribe when component unmounts
useEffect(() => {
  return () => unsubscribe();
}, []);
```

---

### subscribeToAllRequests()

**Purpose**: Subscribe to real-time updates of all requests (Admin only)

**Signature**:
```typescript
subscribeToAllRequests(
  callback: (requests: ServiceRequest[]) => void
): () => void
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | function | Yes | Function called with updated requests |

**Returns**: 
- `() => void` - Unsubscribe function to stop listening

**Callback Parameters**:
- `requests: ServiceRequest[]` - Current array of all requests

**Example**:
```typescript
const unsubscribe = subscribeToAllRequests((requests) => {
  console.log(`Admin view: ${requests.length} requests`);
  setAllRequests(requests);
});

useEffect(() => {
  return () => unsubscribe();
}, []);
```

---

## AuthContext API

### useAuth() Hook

**Purpose**: Access authentication and admin status

**Signature**:
```typescript
const {
  currentUser,         // Firebase User object
  loading,            // Boolean: is auth still loading?
  userProfile,        // User profile object
  showProfileModal,   // Boolean: show profile completion modal?
  setShowProfileModal, // Function: set modal visibility
  refreshProfile,     // Function: refresh profile from Firestore
  isAdmin             // Boolean: is user an admin?
} = useAuth();
```

**Properties**:
| Property | Type | Description |
|----------|------|-------------|
| currentUser | User \| null | Firebase User object or null if not logged in |
| loading | boolean | True while checking auth status |
| userProfile | UserProfile \| null | User's profile data |
| showProfileModal | boolean | Show profile completion dialog |
| setShowProfileModal | function | Update modal visibility |
| refreshProfile | function | Refresh profile data from Firestore |
| isAdmin | boolean | True if email === 'thekindbridge@gmail.com' |

**Example**:
```typescript
const { currentUser, isAdmin, userProfile } = useAuth();

if (!currentUser) {
  return <LoginPage />;
}

if (isAdmin) {
  return <AdminDashboard />;
} else {
  return <UserPage />;
}
```

---

## Component Props

### MyRequests Component

**Props**:
```typescript
interface MyRequestsProps {
  onBack: () => void;  // Callback to navigate back to home
}
```

**Usage**:
```typescript
<MyRequests onBack={() => navigate('/')} />
```

**Features**:
- Displays user's requests in card grid
- Real-time status updates
- Color-coded status badges
- Responsive design
- Empty state handling

---

### AdminDashboard Component

**Props**:
```typescript
interface AdminDashboardProps {
  onBack: () => void;  // Callback to navigate back to home
}
```

**Usage**:
```typescript
<AdminDashboard onBack={() => navigate('/')} />
```

**Features**:
- Admin-only access control
- Statistics dashboard
- Request table with sorting
- Status filter buttons
- Dropdown status updates
- Real-time synchronization

---

## Error Handling

### Common Errors

#### Firebase Errors
```typescript
try {
  await submitServiceRequest(...);
} catch (error: any) {
  if (error.code === 'permission-denied') {
    console.error('Not authorized');
  } else if (error.code === 'not-found') {
    console.error('Service not available');
  } else {
    console.error('Unknown error:', error.message);
  }
}
```

#### Firestore Rules Errors
```
Error: Missing or insufficient permissions
// User trying to access data they're not allowed to
```

---

## Type Definitions

### Full Types

```typescript
// Firestore Timestamp
type Timestamp = {
  seconds: number;
  nanoseconds: number;
  toDate(): Date;
  toMillis(): number;
};

// User object
type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  // ... other Firebase User properties
};

// Status enum
type RequestStatus = 'Pending' | 'In Progress' | 'Completed' | 'Rejected';
```

---

## Firestore Queries

### Behind the Scenes

#### Get User Requests
```javascript
query(
  collection(db, 'serviceRequests'),
  where('userId', '==', currentUserId)
)
```

#### Get All Requests
```javascript
collection(db, 'serviceRequests')
// Admins only via security rules
```

#### Real-time Listener
```javascript
onSnapshot(query, (snapshot) => {
  const requests = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
});
```

---

## Security Considerations

### What Users Can Do
✅ Create own requests
✅ Read own requests
✅ Cannot read other users' requests
✅ Cannot update their own requests

### What Admins Can Do
✅ Read all requests
✅ Update request status
✅ Delete requests
✅ Cannot bypass security rules

### What Firestore Prevents
❌ Users reading other users' requests
❌ Users updating request status
❌ Users deleting requests
❌ Non-authenticated requests

---

## Performance Considerations

### Data Fetching
- **One-time fetch**: `getUserRequests()` - Good for initial load
- **Real-time updates**: `subscribeToUserRequests()` - Good for live dashboards
- **Unsubscribe**: Always call cleanup function to prevent memory leaks

### Indexing
No custom indexes required for these queries.

### Costs
- Write: 1 operation per request submission
- Read: 1 operation per query/listener setup
- Update: 1 operation per status change

---

## Code Examples

### Complete User Flow

```typescript
import { useAuth } from './src/firebase/useAuth';
import { subscribeToUserRequests } from './src/services/requestService';

function MyRequests() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to real-time updates
    const unsubscribe = subscribeToUserRequests(
      currentUser.uid,
      (updatedRequests) => {
        setRequests(updatedRequests);
      }
    );

    // Cleanup on unmount
    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div>
      {requests.map(req => (
        <div key={req.id}>
          <h3>{req.serviceType}</h3>
          <p>Status: {req.status}</p>
        </div>
      ))}
    </div>
  );
}
```

### Admin Status Update

```typescript
import { updateRequestStatus } from './src/services/requestService';

async function handleStatusChange(requestId: string, newStatus: string) {
  try {
    await updateRequestStatus(
      requestId,
      newStatus as 'Pending' | 'In Progress' | 'Completed' | 'Rejected'
    );
    console.log('Status updated');
  } catch (error) {
    console.error('Update failed:', error);
  }
}
```

---

**API Version**: 1.0.0
**Last Updated**: February 2, 2026
