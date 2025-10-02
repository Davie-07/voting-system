# Gapsight College Voting System - Architecture

```mermaid
graph TB
    A[User Interface] --> B[React Frontend]
    B --> C[Express.js Backend]
    C --> D[MongoDB Atlas]
    
    subgraph Frontend
        B
    end
    
    subgraph Backend
        C
    end
    
    subgraph Database
        D
    end
    
    C --> E[Authentication API]
    C --> F[Admin API]
    C --> G[Student API]
    C --> H[Voting API]
    
    E --> I[Register/Login]
    F --> J[Contestant Management]
    F --> K[Voting Control]
    F --> L[Results]
    G --> M[View Contestants]
    G --> N[View Positions]
    H --> O[Cast Vote]
    H --> P[Live Results]
```

## System Components

### 1. Frontend (React)
- **Admin Dashboard**
  - Voting control panel
  - Contestant management
  - Results visualization
  
- **Student Dashboard**
  - Voting interface
  - Live results
  - Profile management

### 2. Backend (Node.js/Express)
- **Authentication Service**
  - Student registration/login
  - Admin login
  - JWT token management

- **Admin Service**
  - Contestant CRUD operations
  - Voting session management
  - Results aggregation

- **Student Service**
  - Contestant listing
  - Position status tracking
  - Vote validation

- **Voting Service**
  - Vote casting
  - Real-time results
  - Vote counting

### 3. Database (MongoDB Atlas)
- **Users Collection**
  - Student information
  - Unique admission numbers

- **Admins Collection**
  - Admin credentials

- **Contestants Collection**
  - Candidate information
  - Position details
  - Manifestos
  - Vote counts

- **Voting Sessions Collection**
  - Session status
  - Schedule information

- **Votes Collection**
  - Vote records
  - Student-position mapping