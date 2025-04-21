# IKnow Quiz App

IKnow is an interactive quiz application that allows users to create, manage, and play quizzes for fun or educational purposes. The application features user authentication, quiz creation and management, and quiz playing functionality.

## Features

- **User Authentication**: Register, login, and manage your profile
- **Quiz Creation**: Create custom quizzes with multiple-choice questions
- **Quiz Management**: Edit, delete, and manage your created quizzes
- **Quiz Playing**: Play quizzes created by you or other users
- **Results Tracking**: View your quiz results and performance
- **Explore**: Discover public quizzes created by other users

## Technology Stack

### Frontend
- React
- TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- shadcn/ui (UI components)
- React Router (Routing)
- React Query (Data fetching)

### Backend
- Node.js
- Express.js
- MySQL (Database)
- JWT (Authentication)
- bcrypt (Password hashing)

## Getting Started

### Prerequisites

- Node.js and npm installed
- MySQL installed and running

### Installation

1. Clone the repository
   ```sh
   git clone <repository-url>
   cd iknow-quiz-app
   ```

2. Install dependencies
   ```sh
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

   Alternatively, you can use the provided batch script:
   ```sh
   # Windows
   install-dependencies.bat
   ```

3. Configure the database
   - Create a MySQL database named `quiz_app`
   - Update the database configuration in `server/.env` if needed

4. Start the application
   ```sh
   # Start both frontend and backend
   # In the root directory
   npm run dev

   # In another terminal
   cd server
   npm run dev
   ```

   Alternatively, you can use the provided batch script:
   ```sh
   # Windows
   start-app.bat
   ```

5. Access the application
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000

## Development

### Project Structure

```
├── public/             # Static assets
├── server/             # Backend server
│   ├── config/         # Server configuration
│   ├── controllers/    # API controllers
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   └── server.js       # Server entry point
├── src/                # Frontend source code
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Application entry point
└── package.json        # Project dependencies and scripts
```

### Available Scripts

#### Frontend
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build

#### Backend
- `npm run dev` - Start the development server with nodemon
- `npm start` - Start the server

## Deployment

To deploy the application:

1. Build the frontend
   ```sh
   npm run build
   ```

2. Set the environment variable `NODE_ENV=production` in the server

3. Start the server
   ```sh
   cd server
   npm start
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
