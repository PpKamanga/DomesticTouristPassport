# Domestic Tourist Passport

**Author:** Priscilla Kamanga  
Master’s Student in Software Engineering  
University of Maryland Baltimore County (UMBC)

---

## Project Description

The Domestic Tourist Passport is a web-based application designed to enhance local tourism engagement by allowing users to explore destinations, record visits, and earn reward points known as “Footprints.” 
The system provides tourists with an interactive way to track their travel experiences while enabling administrators to analyze tourism patterns through collected data.

The application supports role-based access, where tourists can browse attractions, scan QR codes to check in, and view their visit history, while administrators can monitor analytics such as total visits, ratings, and engagement trends. 
By combining tourism tracking with data insights, the system aims to support smarter tourism planning and improve visitor experiences.

---

## Features

- User authentication with role-based access (Tourist and Admin)
- Browse and view tourist destinations
- Destination details with images and descriptions
- Record visits with ratings and comments
- QR code check-in functionality
- Footprints reward system based on activity
- “My Visits” page with visit history tracking
- Admin dashboard with analytics (total visits, ratings, footprints)

---

## System Architecture and Technology Stack

The system follows a client-server architecture.

**Backend:**
- Node.js
- Express.js
- TypeScript

**Frontend:**
- HTML
- CSS
- JavaScript

**Database:**
- PostgreSQL (managed using pgAdmin)
---

## Deployment

The application is deployed and accessible at:

https://domestictouristpassport.onrender.com/

Users can test the system by creating an account, logging in as a Tourist or Admin and interacting with the features such as recording visits, QR check-in, and viewing analytics.

---

## How to Run the Application (Local Setup)

1. Clone the repository:
   ```bash
   git clone https://github.com/PpKamanga/DomesticTouristPassport.git

2.Navigate into the project directory:

cd DomesticTouristPassport

3.Install dependencies:

npm install

4.Compile the TypeScript code:

npm run build

5.Start the server:

npm start

6.Open your browser and go to:

http://localhost:3000

---


## AI Use Disclosure and Prompt Citations

AI tools (ChatGPT by OpenAI) were used as a support tool for brainstorming, debugging guidance, UI improvements, and structuring code logic. All implementation, testing, integration, and final decisions were completed by the author.

The commit history in this repository reflects iterative development. Multiple commits were often made after a single prompt to refine functionality, fix bugs, or improve the user interface.

### Prompt Groups and Related Development Work

### 1. Project Setup and Backend API Development
Prompt: “Help me build a Node.js and Express backend for a tourism tracking application with endpoints for destinations, visits, and user login.”

This prompt supported:
- Initial server setup
- API routes (`/api/destinations`, `/api/visits`, `/api/login`)
- JSON handling and request validation
- In-memory data structures and later database considerations

(Associated with early commits involving server setup, routing, and API testing)

---

### 2. Login System and Role-Based Navigation
Prompt: “Help me implement a login system with user roles (admin and tourist) and redirect users to the correct dashboard after login.”

This prompt supported:
- Login page logic (`login.html`, `login.js`)
- Role validation
- LocalStorage session handling
- Redirects to admin and tourist dashboards

(Associated with commits modifying authentication logic and navigation flow)

---

### 3. Tourist Dashboard and Home Page UI
Prompt: “Help me design and improve the tourist dashboard UI, including membership ID display, badges, and user-friendly layout.”

This prompt supported:
- Home/dashboard redesign
- Membership card and badge logic
- Layout structuring and styling improvements

(Associated with multiple UI commits refining layout and design)

---

### 4. Navigation and User Flow
Prompt: “Help me implement consistent navigation across pages, including Back, Home, Logout, and feature navigation buttons.”

This prompt supported:
- Back button logic
- Home navigation
- Logout handling
- Cross-page navigation consistency

(Associated with commits updating multiple HTML and JS files for navigation)

---

### 5. Destination Listings and Details Pages
Prompt: “Help me create a destination listing page and a detailed destination view with images, descriptions, and actions.”

This prompt supported:
- Destination cards
- Destination detail pages
- Image handling and dynamic loading
- UI structure for attraction information

(Associated with commits fixing image issues and improving destination UI)

---

### 6. Visit Tracking and Footprints System
Prompt: “Help me implement a system where users can record visits, assign ratings, and earn points (footprints).”

This prompt supported:
- POST `/api/visits`
- Rating system
- Footprint calculation logic
- Visit storage and retrieval

(Associated with commits related to visit recording and data handling)

---

### 7. My Visits Page and Data Visualization
Prompt: “Help me design a My Visits page that groups visits by destination and displays ratings, comments, and visit history.”

This prompt supported:
- My Visits page layout
- Grouping visits by destination
- Displaying visit history
- Linking to destination details

(Associated with commits redesigning and improving the My Visits feature)

---

### 8. QR Code Check-In Feature
Prompt: “Help me implement a QR code check-in system where users can scan a code to record a visit.”

This prompt supported:
- QR check-in page
- QR scanning logic
- Integration with visit recording API

(Associated with commits implementing QR functionality)

---

### 9. Admin Dashboard and Analytics
Prompt: “Help me build an admin dashboard that displays analytics such as total visits, total footprints, and average ratings.”

This prompt supported:
- Admin dashboard UI
- Summary statistics
- Data aggregation logic

(Associated with commits improving admin features and analytics)

---

### 10. UI/UX Improvements and Responsive Design
Prompt: “Help me improve styling, fix layout issues, and make the application responsive across different screen sizes.”

This prompt supported:
- CSS fixes
- Background image handling
- Layout consistency
- Mobile responsiveness

(Associated with multiple commits refining styling and fixing UI bugs)

---

### 11. Deployment and Repository Cleanup
Prompt: “Help me prepare my application for deployment and submission, including cleaning up the repository and ensuring it runs correctly on Render.”

This prompt supported:
- Removing unnecessary files (e.g., node_modules)
- Deployment configuration
- Public application access

(Associated with final commits related to deployment and cleanup)

---

## AI Citation

OpenAI. (2026). *ChatGPT* [Large language model]. https://chat.openai.com/

## Development Evidence

The full development process, including incremental changes, debugging, UI improvements, and feature implementation, is documented in the commit history of this repository:
https://github.com/PpKamanga/DomesticTouristPassport/commits
