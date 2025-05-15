# FaceTok Client V2

FaceTok is a social media application built with React and Redux.

## Project Structure

```
src/
├── core/               # Core functionality and configuration
│   ├── config/        # Configuration files (store, routes, theme)
│   ├── components/    # Core components
│   ├── hooks/         # Custom hooks
│   └── utils/         # Utility functions
├── modules/           # Feature modules
│   └── auth/          # Authentication module
│       ├── components/# Auth components
│       ├── pages/     # Auth pages
│       ├── redux/     # Auth state management
│       ├── services/  # Auth services
│       └── utils/     # Auth utilities
└── shared/            # Shared components and utilities
    ├── components/    # Reusable components
    ├── hooks/         # Shared hooks
    └── utils/         # Shared utilities
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

## Features

- Modular Architecture
- Redux for state management
- Material-UI for components
- Responsive design
- Authentication (Login, Register, Forgot Password)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
