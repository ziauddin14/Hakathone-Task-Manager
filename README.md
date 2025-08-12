# Task Manager App

A modern, full-featured task management application built with React, Firebase, and Tailwind CSS.

## Features

### Authentication
- ✅ User registration and login
- ✅ Email verification
- ✅ Password reset functionality
- ✅ Secure logout
- ✅ Protected routes

### Task Management
- ✅ Create new tasks with name, description, and deadline
- ✅ Edit existing tasks
- ✅ Delete tasks with confirmation
- ✅ Mark tasks as completed/pending
- ✅ Filter tasks by status (All, Pending, Completed)
- ✅ Real-time updates with Firebase Firestore
- ✅ Overdue task highlighting

### User Experience
- ✅ Responsive design with Tailwind CSS
- ✅ Form validation with Formik and Yup
- ✅ Toast notifications with SweetAlert2
- ✅ Loading states and error handling
- ✅ Persistent authentication state
- ✅ Modern UI with Lucide React icons

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Forms**: Formik + Yup validation
- **Backend**: Firebase (Authentication + Firestore)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Notifications**: SweetAlert2

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Authentication and Firestore enabled

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd task-manager-app

# Install dependencies
npm install
```

### 2. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Get your Firebase configuration

### 3. Update Firebase Config

Edit `src/firebase.js` and replace the placeholder config with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Firestore Security Rules

Set up Firestore security rules to allow authenticated users to access their own tasks:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 5. Run the Application

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── VerifyEmail.jsx
│   └── dashboard/
│       ├── Dashboard.jsx
│       ├── AddTaskForm.jsx
│       └── TaskTable.jsx
├── store/
│   ├── authStore.js
│   └── taskStore.js
├── App.jsx
├── main.jsx
├── firebase.js
└── index.css
```

## Usage

### Authentication Flow
1. **Sign Up**: Create a new account with email and password
2. **Email Verification**: Verify your email address (optional but recommended)
3. **Login**: Sign in with your credentials
4. **Password Reset**: Use "Forgot Password" link if needed

### Task Management
1. **Add Task**: Click "Add New Task" button and fill in the form
2. **Edit Task**: Click the edit icon on any task
3. **Complete Task**: Click the status button to toggle completion
4. **Delete Task**: Click the delete icon (with confirmation)
5. **Filter Tasks**: Use the dropdown to filter by status

## Key Features Explained

### State Management with Zustand
- **authStore**: Manages authentication state with persistence
- **taskStore**: Handles task CRUD operations and real-time updates

### Real-time Updates
Tasks are synchronized in real-time using Firebase Firestore's `onSnapshot` listener, ensuring all users see the latest changes immediately.

### Form Validation
All forms use Formik for form handling and Yup for validation schemas, providing a smooth user experience with clear error messages.

### Responsive Design
The application is fully responsive and works seamlessly on desktop, tablet, and mobile devices.

## Environment Variables (Optional)

For better security, you can use environment variables for Firebase configuration:

1. Create a `.env` file in the root directory
2. Add your Firebase config:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

3. Update `src/firebase.js` to use environment variables:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on the repository.
