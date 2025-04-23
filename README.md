# Buyesi Youth Initiative - Frontend

This is the frontend for the Buyesi Youth Initiative website. The frontend has been integrated with the backend API to display dynamic content.

## Integration Features

The frontend now fetches data from the backend API for the following sections:

- **Causes**: Displays causes with dynamic data including title, description, progress, and donation amounts.
- **Team**: Shows team members with their roles, images, and bios from the database.
- **Events**: Lists upcoming events with details such as date, time, location, and descriptions.
- **Blog**: Shows blog posts with featured images, author info, and content from the database.
- **Gallery**: Displays images from the gallery database.
- **Contact Form**: Allows users to send messages that are stored in the database.
- **Volunteer Registration**: Submits volunteer information to the backend.
- **Donation Form**: Processes donations through the API.

## Single Page Views

The following single page views have been implemented:

- **cause-single.html**: Displays detailed information about a specific cause.
- **event-single.html**: Shows detailed information about a specific event with registration capability.
- **blog-single.html**: Displays full blog posts with commenting functionality.

## Technical Implementation

- **API Integration**: The frontend uses the API module in `js/api.js` to communicate with the backend.
- **Responsive UI**: All pages maintain responsive design for different screen sizes.
- **Form Validation**: Forms include client-side validation before submission.
- **Error Handling**: Proper error handling and user feedback for API interactions.
- **Loading States**: Visual indicators when content is being loaded.

## Files Structure

- **HTML Files**: Static page templates
- **JS Files**:
  - `api.js`: Contains all API endpoint definitions
  - `home.js`: Handles data loading for the home page
  - `causes.js`: Loads and displays cause data
  - `team.js`: Loads and displays team data
  - `events.js`: Handles event listing and display
  - `blogs.js`: Manages blog content
  - `gallery.js`: Loads gallery images
  - `contact.js`: Handles contact form submissions
  - Plus single page handlers: `cause-single.js`, `event-single.js`, `blog-single.js`

## Setup and Usage

1. Ensure the backend server is running at the URL specified in `js/api.js` (default: http://localhost:5000/api)
2. Open the HTML files in your web browser or serve them using a local web server

## Dependencies

- jQuery
- Bootstrap
- Font Awesome
- Other libraries included in the original template

## Note

This frontend is designed to work with the Buyesi Youth Initiative backend API. Make sure the backend server is running and accessible for the dynamic content to load properly.
