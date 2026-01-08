import type { Server } from 'bun';

// User interface
interface User {
  id: number;
  name: string;
}

// API response interface
interface ApiResponse {
  message: string;
  method: string;
  route: string;
  data?: User | User[];
}

// Sample user data
const usersList: User[] = [
  { id: 1, name: 'Rahul Sharma' },
  { id: 2, name: 'Raj Kumar' },
  { id: 3, name: 'Sangam Das' },
  { id: 4, name: 'Amit Verma' },
  { id: 5, name: 'Ankit Singh' },
];

// Create Bun server
const apiServer: Server<any> = Bun.serve({
  port: 3000,
  fetch(request: Request): Response {
    const requestUrl = new URL(request.url);
    const requestMethod = request.method;

    // Default API response
    const apiResponse: ApiResponse = {
      message: 'Hello from Bun server',
      method: requestMethod,
      route: requestUrl.pathname,
    };

    // Root route
    if (requestUrl.pathname === '/') {
      if (requestMethod === 'GET') {
        apiResponse.message = 'Welcome to Bun API!';
      } else {
        apiResponse.message = '❌ Method not allowed for this route';
      }
    }
    // /users route
    else if (requestUrl.pathname === '/users') {
      switch (requestMethod) {
        case 'GET':
          apiResponse.message = '📋 Fetching all users';
          apiResponse.data = usersList;
          break;

        case 'POST':
          apiResponse.message = '➕ Creating a new user';
          break;

        default:
          apiResponse.message = '❌ Method not allowed for this route';
          break;
      }
    }

    return Response.json(apiResponse);
  },
});

console.log(`✅ Bun server is running on http://localhost:${apiServer.port}`);
