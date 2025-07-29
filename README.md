# Second-Hand Marketplace

A modern second-hand marketplace application built with Spring Boot (backend) and React (frontend), featuring role-based authentication for buyers and sellers.

## Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (ROLE_BUYER, ROLE_SELLER)
- **Automatic role assignment** during registration
- **Protected routes** with method-level security

### 🛍️ Buyer Features
- Browse all available products
- Search products by keywords
- Filter products by category
- View product details and seller information
- Contact sellers (placeholder functionality)

### 🏪 Seller Features
- Create and manage product listings
- Edit product details
- Delete products
- View dashboard with statistics
- Track active listings

### 🎨 User Interface
- **Modern, responsive design** with gradient backgrounds
- **Beautiful landing page** with animated elements
- **Role-specific dashboards** with intuitive navigation
- **Mobile-friendly** layout

## Technology Stack

### Backend
- **Spring Boot 3.x** - Main framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **MySQL** - Database
- **JWT** - Token-based authentication
- **Maven** - Dependency management

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **CSS3** - Styling with modern features
- **Fetch API** - HTTP requests

## Database Schema

### Users Table
- `id` (Primary Key)
- `name` - Full name
- `username` - Unique username
- `email` - Unique email
- `password` - Encrypted password
- `phone` - Phone number
- `address` - User address

### Roles Table
- `roleId` (Primary Key)
- `name` - Role name (ROLE_BUYER, ROLE_SELLER)

### Products Table
- `id` (Primary Key)
- `title` - Product title
- `description` - Product description
- `price` - Product price
- `category` - Product category
- `condition` - Product condition (NEW, LIKE_NEW, GOOD, FAIR, POOR)
- `imageUrl` - Product image URL
- `createdAt` - Creation timestamp
- `isAvailable` - Availability status
- `seller_id` (Foreign Key) - Reference to Users table

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SHM/backend
   ```

2. **Configure Database**
   - Create a MySQL database named `secondhand_marketplace`
   - Update database credentials in `src/main/resources/application.properties`

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/validate` - Validate JWT token

### Products (Public)
- `GET /api/products` - Get all available products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/search?query={term}` - Search products
- `GET /api/products/category/{category}` - Get products by category

### Products (Seller Only)
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/my-products` - Get seller's products

## Usage Guide

### For Buyers
1. **Register/Login** - Create an account or sign in
2. **Browse Products** - View all available items
3. **Search & Filter** - Use search bar and category filters
4. **Contact Sellers** - Use the contact button on product cards

### For Sellers
1. **Register as Seller** - Choose "Sell items" during registration
2. **Add Products** - Click "Add New Product" button
3. **Manage Listings** - Edit or delete your products
4. **Track Performance** - View dashboard statistics

## Security Features

- **Password Encryption** - BCrypt password hashing
- **JWT Tokens** - Secure token-based authentication
- **Role-based Access** - Method-level security with @PreAuthorize
- **CORS Configuration** - Proper cross-origin resource sharing
- **Input Validation** - Server-side validation for all inputs

## File Structure

```
SHM/
├── backend/
│   ├── src/main/java/com/example/springbootfirst/
│   │   ├── config/          # Security configuration
│   │   ├── controllers/     # REST controllers
│   │   ├── jwt/            # JWT utilities
│   │   ├── models/         # Entity models
│   │   ├── repository/     # Data access layer
│   │   └── services/       # Business logic
│   └── src/main/resources/
│       └── application.properties
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── styles/         # CSS files
    │   └── App.js          # Main app component
    └── public/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 