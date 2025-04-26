# FaceTok Utility Functions

## Toast Utility

The toast utility (`toast.js`) provides standardized toast notification functions for consistent messaging throughout the application.

### Usage

Import the desired toast function in your component:

```javascript
import { showSuccess, showError, showInfo, showWarning } from '../utils/toast';

// Or import everything as a single object:
import toast from '../utils/toast';
```

### Available Functions

- `showSuccess(message, options)`: Display a success toast (green)
- `showError(message, options)`: Display an error toast (red)
- `showInfo(message, options)`: Display an information toast (blue)
- `showWarning(message, options)`: Display a warning toast (yellow)

### Examples

```javascript
// Success notification
showSuccess("User profile updated successfully!");

// Error notification
showError("Failed to update profile. Please try again later.");

// Info notification
showInfo("Your account will be verified within 24 hours.");

// Warning notification
showWarning("You're about to delete your account. This action cannot be undone.");

// With custom options
showSuccess("Login successful!", { autoClose: 2000 });
```

### Default Configuration

All toast notifications share these default settings unless overridden:

```javascript
{
  position: "top-right",
  autoClose: 3000, // Close after 3 seconds
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark"
}
```

You can override any of these settings by passing an options object as the second parameter to any toast function.

### Toast Container

The `<ToastContainer>` component is included in the `App.jsx` file, so you don't need to add it to your components. 