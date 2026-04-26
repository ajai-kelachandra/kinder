export const getFirebaseAuthErrorMessage = (code: string): string => {
  switch (code) {
    // Login Errors
    case "auth/invalid-credential":
      return "Invalid email or password. Please try again.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later or reset your password.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact administration.";
    
    // Signup Errors
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/operation-not-allowed":
      return "Email/Password sign-in is not enabled. Please contact support.";
    
    // Configuration Errors
    case "auth/configuration-not-found":
      return "Authentication is not configured correctly in the Firebase Console.";
    
    // Default
    default:
      return "An unexpected error occurred. Please try again.";
  }
};
