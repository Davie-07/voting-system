# Gapsight College Voting System

A comprehensive college voting system for Gapsight College with separate admin and student dashboards.

## Features

### Admin Dashboard
- **Voting Control**: Open/close voting sessions
- **Schedule Voting**: Set start and end dates for voting
- **Contestant Management**: Add, edit, and delete contestants with photos, names, courses, positions, and manifestos
- **Live Results**: View real-time voting results
- **Final Results**: See final results after voting closes

### Student Dashboard
- **Account Management**: Register and login with admission number
- **Voting**: Vote for contestants in different positions
- **One Vote Per Position**: Students can only vote once per position
- **Live Votes**: View real-time voting analytics
- **Transparency**: Admission number used as unique identifier to prevent duplicate voting

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: MongoDB Atlas
- **Frontend**: React.js
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer for contestant photos

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd VOTINGSYSTEM
   ```

2. Install backend dependencies:
   ```
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd client
   npm install
   cd ..
   ```

4. Configure environment variables:
   - Rename `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB Atlas connection string
   - Update `JWT_SECRET` with a strong secret key

5. Create uploads directory:
   ```
   mkdir uploads
   ```

### Running the Application

1. Start the backend server:
   ```
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd client
   npm start
   ```

3. For production build:
   ```
   npm run build
   ```

## Deployment

### Recommended: Render
The application is ready to deploy on Render. See `DEPLOYMENT_INSTRUCTIONS.md` for detailed steps.

### Environment Variables for Deployment
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

## Database Schema

### Users (Students)
- firstName: String
- admissionNumber: String (unique)
- course: String
- password: String (hashed)
- role: String (default: 'student')

### Admins
- systemId: String (unique)
- password: String (hashed)

### Contestants
- name: String
- course: String
- position: String
- manifesto: String
- photo: String (file path)
- votes: Number (default: 0)

### Voting Sessions
- isOpen: Boolean (default: false)
- startDate: Date
- endDate: Date

### Votes
- student: ObjectId (reference to User)
- position: String
- contestant: ObjectId (reference to Contestant)

## Security Features

- **Unique Identification**: Admission number ensures one account per student
- **Password Hashing**: bcrypt.js for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Separate permissions for admins and students
- **Vote Validation**: Prevents multiple votes per position

## API Endpoints

### Authentication
- `POST /api/auth/student/register` - Register student
- `POST /api/auth/student/login` - Login student
- `POST /api/auth/admin/login` - Login admin

### Admin
- `POST /api/admin/contestants` - Add contestant
- `GET /api/admin/contestants` - Get all contestants
- `PUT /api/admin/contestants/:id` - Update contestant
- `DELETE /api/admin/contestants/:id` - Delete contestant
- `POST /api/admin/voting/open` - Open voting
- `POST /api/admin/voting/close` - Close voting
- `POST /api/admin/voting/schedule` - Schedule voting
- `GET /api/admin/voting/session` - Get voting session
- `GET /api/admin/voting/results` - Get voting results

### Student
- `GET /api/student/contestants` - Get all contestants
- `GET /api/student/voting/session` - Get voting session status
- `GET /api/student/voting/positions` - Get positions with voting status

### Voting
- `POST /api/voting/vote` - Cast vote
- `GET /api/voting/live-results` - Get live voting results

## Troubleshooting

See `TROUBLESHOOTING.md` for common issues and solutions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.