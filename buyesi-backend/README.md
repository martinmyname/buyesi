# Buyesi Youth Initiative API

Backend API for the Buyesi Youth Initiative website, built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Cause/project management
- Team member profiles
- Blog functionality
- Event management
- Gallery management
- Contact form submissions
- Donation processing
- Volunteer application system

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd buyesi-backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/buyesi
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   ```

4. Create uploads directory:

   ```
   mkdir uploads
   ```

5. Run the server:

   ```
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgotpassword` - Request password reset
- `PUT /api/auth/resetpassword/:resettoken` - Reset password
- `PUT /api/auth/updatepassword` - Update password

### Causes/Projects

- `GET /api/causes` - Get all causes
- `GET /api/causes/:id` - Get single cause
- `POST /api/causes` - Create new cause
- `PUT /api/causes/:id` - Update cause
- `DELETE /api/causes/:id` - Delete cause
- `PUT /api/causes/:id/image` - Upload cause image

### Team

- `GET /api/team` - Get all team members
- `GET /api/team/:id` - Get single team member
- `POST /api/team` - Create new team member
- `PUT /api/team/:id` - Update team member
- `DELETE /api/team/:id` - Delete team member
- `PUT /api/team/:id/image` - Upload team member image

### Blog

- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:id` - Get single blog post
- `POST /api/blog` - Create new blog post
- `PUT /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post
- `PUT /api/blog/:id/image` - Upload blog post image
- `POST /api/blog/:id/comments` - Add comment to blog post

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `PUT /api/events/:id/image` - Upload event image
- `POST /api/events/:id/register` - Register for event

### Gallery

- `GET /api/gallery` - Get all gallery items
- `GET /api/gallery/:id` - Get single gallery item
- `POST /api/gallery` - Create new gallery item
- `PUT /api/gallery/:id` - Update gallery item
- `DELETE /api/gallery/:id` - Delete gallery item

### Contact

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions
- `GET /api/contact/:id` - Get single contact submission
- `PUT /api/contact/:id` - Update contact submission
- `DELETE /api/contact/:id` - Delete contact submission

### Donations

- `POST /api/donations` - Process donation
- `GET /api/donations` - Get all donations
- `GET /api/donations/:id` - Get single donation

### Volunteers

- `POST /api/volunteers` - Submit volunteer application
- `GET /api/volunteers` - Get all volunteer applications
- `GET /api/volunteers/:id` - Get single volunteer application
- `PUT /api/volunteers/:id` - Update volunteer application
- `DELETE /api/volunteers/:id` - Delete volunteer application

## License

This project is licensed under the MIT License.
