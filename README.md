# ADA Compliance Checker

A web application that checks HTML content for ADA (Americans with Disabilities Act) compliance violations. The application consists of a React frontend and a FastAPI backend that work together to analyze HTML content and identify accessibility issues.

## 🎥 Demo Video

Watch a walkthrough of the ADA Compliance Checker in action:

[![Watch the demo](https://cdn.loom.com/sessions/thumbnails/766a7ffb484043cbac67877fc4b20555-with-play.gif)](https://www.loom.com/share/766a7ffb484043cbac67877fc4b20555)

**[Click here to watch the full demo on Loom](https://www.loom.com/share/766a7ffb484043cbac67877fc4b20555)**

## Features

- **HTML Accessibility Checking**: Analyzes HTML content for ADA compliance violations
- **Real-time Validation**: Instant feedback on accessibility issues
- **Comprehensive Rules**: Checks for various accessibility standards including:
  - Color contrast ratios
  - Image alt text
  - Heading structure
  - Link text quality
  - Document language and title
  - And more...
- **Modern UI**: Built with React and Chakra UI for a clean, accessible interface
- **PDF Export**: Generate reports of accessibility violations

## Architecture

- **Frontend**: React + Vite application with Chakra UI
- **Backend**: FastAPI Python application with accessibility checking services
- **Communication**: RESTful API between frontend and backend
- **Containerization**: Docker containers for easy deployment and development

## Innovative Features

### **Backend**

#### **Universal Compatibility with Docker**
- **Cross-Platform Deployment**: Fully containerized application that runs seamlessly on Windows, macOS, and Linux systems
- **Zero Configuration**: No complex setup required - just Docker and you're ready to go
- **Consistent Environment**: Eliminates "it works on my machine" issues with identical runtime environments

#### **SOLID Principles Implementation**
- **Single Responsibility**: Each rule module handles one specific accessibility concern
- **Open/Closed**: Easy to extend with new accessibility rules without modifying existing code
- **Liskov Substitution**: Interchangeable rule implementations
- **Interface Segregation**: Clean, focused interfaces for each service
- **Dependency Inversion**: High-level modules don't depend on low-level modules

#### **Advanced File Structure**
```
backend/
├── app/
│   ├── models/          # Pydantic schemas for type safety
│   ├── rules/           # Modular accessibility checking rules
│   │   ├── color_contrast.py
│   │   ├── img_alt.py
│   │   ├── heading_order.py
│   │   └── ...          # Extensible rule system
│   └── services/        # Business logic layer
└── requirements.txt     # Minimal, optimized dependencies
```

### **Frontend**

#### **Real-Time Statistics Dashboard**
- **Instant Metrics**: Instant display of violation counts, severity levels, and compliance scores and Status

#### **Adaptive Theme System**
- **Dark/Light Mode Toggle**: Seamless switching between themes with persistent user preferences

#### **Advanced HTML Input Methods**
- **File Upload Support**: Drag-and-drop HTML file uploads (supports files up to 5MB)
- **Keyboard Shortcuts**: Ctrl/Cmd + Enter to run analysis, Ctrl/Cmd + K to clear

#### **Dynamic Violation Listing**
- **Severity Color Coding**: Color-coded violations with different severity levels

#### **Responsive & Elegant UI**
- **Chakra UI Integration**: Modern, accessible component library with 60+ components
- **Smooth Animations**: Fluid transitions and micro-interactions, including displaying a cool message for passing all checks

#### **Professional Report Generation**
- **PDF Export**: Generate comprehensive accessibility reports in professional PDF format. Customizable report template with your organization's branding. High-level compliance overview for stakeholders

#### **Performance Optimizations**
- **Efficient Rendering**: Optimized component rendering with React best practices
- **Smart State Management**: Efficient state updates and re-renders

#### **Security Features**
- **CORS Protection**: Properly configured cross-origin resource sharing
- **Input Validation**: Comprehensive input sanitization and validation
- **Rate Limiting**: Protection against abuse with intelligent throttling

## Prerequisites

**IMPORTANT**: Before running this application, you must have the following installed:

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher

### Installing Docker

#### Windows
1. Download Docker Desktop from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Install Docker Desktop
3. Start Docker Desktop
4. Verify installation by running: `docker --version`

#### macOS
1. Download Docker Desktop from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Install Docker Desktop
3. Start Docker Desktop
4. Verify installation by running: `docker --version`

## Quick Start

### Step 1: Navigate to Project Directory

**IMPORTANT**: Make sure you are in the `ada-compliance-checker` directory before running any Docker commands.

```bash
cd ada-compliance-checker
```

### Step 2: Choose Your Environment

#### Option A: Development Mode (Recommended for first-time users)
This mode includes hot reloading and is easier to debug:

```bash
# Build and start all services in development mode
docker-compose -f docker-compose.dev.yml up --build
```

#### Option B: Production Mode
This mode is optimized for production use:

```bash
# Build and start all services in production mode
docker-compose up --build
```

### Step 3: Access the Application

Once the containers are running, you can access the application:

- **Frontend**: http://localhost:5173 (Development) or http://localhost:3000 
- **Backend API**: http://localhost:8000

(or replace with your set Production URLs, you can make the desired changes for backend and frontend)

### Step 4: Stop the Application

When you're done, stop the containers:

```bash
# For development mode
docker-compose -f docker-compose.dev.yml down

# For production mode
docker-compose down
```

## Usage

1. **Open the Application**: Navigate to the frontend URL in your browser
2. **Input HTML Content**: Paste or upload HTML content you want to check
3. **Run Analysis**: Click the "Check Accessibility" button
4. **Review Results**: View the list of accessibility violations and recommendations
5. **Export Report**: Generate a PDF report of the findings (if available)


## API Endpoints

### POST /api/v1/check
Checks HTML content for accessibility violations.

**Request Body:**
```json
{
  "html": "<html>...</html>"
}
```

**Response:**
```json
{
  "violations": [
    {
      "ruleId": "img_alt",
      "message": "Image missing alt text",
      "element": "img",
      "selector": "img[src='image.jpg']",
      "codeSnippet": "<img src='image.jpg'>"
    }
  ]
}
```

## Project Structure

```
ada-compliance-checker/
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── main.py         # FastAPI application entry point
│   │   ├── models/         # Pydantic models and schemas
│   │   ├── rules/          # Accessibility checking rules
│   │   └── services/       # Business logic services
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile         # Backend container configuration
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api/           # API integration
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   ├── package.json       # Node.js dependencies
│   ├── Dockerfile         # Frontend container configuration
│   ├── Dockerfile.dev     # Development container configuration
│   └── nginx.conf         # Nginx configuration for production
├── docker-compose.yml     # Production Docker Compose configuration
├── docker-compose.dev.yml # Development Docker Compose configuration
├── .dockerignore          # Files to exclude from Docker builds
└── README.md             # This file
```

## Development

### Making Changes

1. **Code Changes**: Make your changes in the respective directories
2. **Rebuild**: Use `docker-compose -f docker-compose.dev.yml up --build` to rebuild with changes
3. **Development Mode**: Use `docker-compose -f docker-compose.dev.yml up` for hot reloading

### Local Development (without Docker)

If you prefer to run the application locally without Docker:

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy .env.example to create your .env file
# On Windows (PowerShell):
Copy-Item .env.example .env
# On Windows (CMD):
copy .env.example .env
# On macOS/Linux:
cp .env.example .env

# Edit .env file and set your CORS_ORIGINS (default: http://localhost:5173)
# For multiple origins, separate with commas: CORS_ORIGINS=http://localhost:5173,http://localhost:3000

uvicorn app.main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
