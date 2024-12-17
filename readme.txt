step 1:

npm init -y 

step 2:

install 
npm install express swagger-jsdoc swagger-ui-express



Key Features Added:
CRUD Endpoints:

GET /api/v1/users: Fetch all users.
POST /api/v1/users: Add a new user.
PUT /api/v1/users/:id: Update a specific user.
DELETE /api/v1/users/:id: Delete a user by ID.
Authentication:

A simple token-based middleware:
You need to send a token in the Authorization header:
Authorization: Bearer mysecrettoken.
Swagger Documentation:

Swagger comments describe each route, request body, and response.