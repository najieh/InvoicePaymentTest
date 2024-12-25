# TestApp - Invoice and User Creation

A simple web application built with Node.js, Express, and MongoDB that allows you to create users and manage their invoices.

## Installation and Setup

Before you begin, ensure you have the following installed on your system:
- Node.js (v20.11.1 or later)
- Docker Desktop
- Git

1. Clone the repository:
   ```bash
    git clone https://github.com/najieh/InvoicePaymentTest
    cd InvoicePaymentTest
   ```


2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the project root:
- For Windows (using PowerShell):
```bash
@"
PORT=3000
MONGODB_URI=mongodb://localhost:27017/invoice_app
"@ | Out-File -FilePath ".env" -Encoding UTF8
```
- For Mac/Linux (using Terminal):
```bash
echo "PORT=3000
MONGODB_URI=mongodb://localhost:27017/invoice_app" > .env
```

## Running the Application

1. Start MongoDB using Docker: `docker-compose up -d`

2. Start the application: `npm run dev`

- The application will be available at http://localhost:3000
