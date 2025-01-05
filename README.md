# To-Do Task

A user can create, read, update and delete to-do task once they register and login, only authenticated users can perform the CRUD operations

## Prerequisites

Before you start, ensure you have the following installed on your machine:

- Node.js (version >= 14.x)
- npm (Node package manager)

1. In the root directory of the project, create a .env file. This file contains environment variables used to configure your application.
   
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/to-do?retryWrites=true&w=majority&appName=Cluster0
ACCESS_TOKEN_SECRET=<your-access-token-secret>
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
REFRESH_TOKEN_EXPIRY=10d
PORT=3000

2. Install dependencies:
Run the following command to install all the required dependencies for the project:
npm install

3.Build the application:
After installing the dependencies, you need to build the application:
npm run build

4.Start the application:
Once the build process is complete, start the application:
npm start

The application should now be running locally. You can access it at http://localhost:3000 (or the port specified in your environment settings).



