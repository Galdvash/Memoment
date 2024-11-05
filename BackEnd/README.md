Node.js Project - User and Card Management
Project Description

This project is a user and card management system built with Node.js, Express, and MongoDB. The system allows users to register, log in, update their profiles, and create cards (for business users). Additionally, there are special permissions for admins and business users.
Technologies and Languages

    Node.js
    Express
    MongoDB with Mongoose
    JWT for user authentication
    bcryptjs for password encryption
    dotenv for environment variable management
    cors and morgan for request handling and logging

Installation and Running

1. Clone the repository:

git clone https://github.com/Galdvash/ProjectNode/tree/main/BackEnd
cd BackEnd

2. Install dependencies:

npm install

3. Set environment variables:
   Create a .env file with the following content:

JWT_SECRET=YourJWTSecretKey
MONGO_URI=mongodb://localhost:27017/NodeDataBase
PORT=5000

4.Run the server:
nodemon app

Project Structure

    app.js - The main entry point of the application.
    routes/ - Contains all the route files.
        userRoutes.js - User routes.
        cardRoutes.js - Card routes.
        authRoutes.js - Authentication routes.
    controllers/ - Contains all the controller files.
        authController.js - Controller for registration and login.
        userController.js - Controller for user management.
        cardController.js - Controller for card management.
    models/ - Contains all the database models.
        userModel.js - User model.
        cardModel.js - Card model.
    middleware/ - Contains authentication and authorization middleware.
        authMiddleware.js - Middleware for JWT token authentication.
        adminMiddleware.js - Middleware to check if the user is an admin.
        businessMiddleware.js - Middleware to check if the user is a business user.

Main Features
Registration and Login

    Registration (/users/register): Users can register with personal details. Upon registration, the isAdmin field is automatically set to false to prevent users from becoming admins.
    Login (/users/login): Users can log in and receive a JWT token for authentication.

User Management

    Update Personal Profile (/users/profile): Users can update their profiles, except for sensitive fields like isAdmin and isBusiness.
    User Management (Admin Only):
        Get all users (/users/): Admins can retrieve a list of all users.
        Update and delete users (/users/:id): Admins can update or delete any user.

Card Management

    Create a new card (/cards/): Business users can create new cards.
    Get all cards (/cards/): Public route to retrieve all cards.
    Update and delete cards (/cards/:id): Only the card creator or an admin can update or delete a card.

Security Measures

    Authentication using JWT: All protected routes require a valid JWT token.
    Password encryption with bcryptjs: User passwords are encrypted and stored securely.
    Authentication and Authorization Middleware:
        authMiddleware - Ensures the user is authenticated.
        adminMiddleware - Ensures the user is an admin.
        businessMiddleware - Ensures the user is a business user.

Testing and Manual Checks

You can test the API using Postman or a similar tool:

    Registration and Login:
        Make a POST request to /users/register with the required details.
        Log in using POST to /users/login to receive a token.

    Testing Protected Routes:
        Add the header x-auth-token with the token you received.
        Test routes like /users/profile, /cards/, etc.

    Testing Permissions:
        Try accessing admin-protected routes with a regular user and ensure access is denied.

Important Notes

    Security: We have implemented security measures to prevent users from becoming admins or changing their status.
    Order of Routes in Express: We ensured that specific routes are defined before parameterized routes to avoid conflicts.
