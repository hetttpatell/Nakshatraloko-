// hooks/useProtectedAction.js
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useProtectedAction = () => {
  const navigate = useNavigate();

  const requireAuth = useCallback((action, options = {}) => {
    const {
      successMessage = "",
      errorMessage = "Please login to continue",
      redirectTo = "/login",
      showToast = () => {},
      onSuccess = () => {},
      onError = () => {},
      actionType = "action"
    } = options;

    const token = localStorage.getItem("authToken");
    
    if (!token) {
      const actionText = actionType === 'cart' ? 'add items to cart' : 
                        actionType === 'wishlist' ? 'manage your wishlist' : 
                        'perform this action';
      
      const finalErrorMessage = errorMessage === "Please login to continue" 
        ? `Please login to ${actionText}` 
        : errorMessage;
      
      showToast(finalErrorMessage, "error");
      setTimeout(() => {
        navigate(redirectTo, { 
          state: { 
            from: window.location.pathname,
            message: `Please login to ${actionText}`,
            actionType: actionType
          }
        });
      }, 1500);
      onError();
      return false;
    }
    
    // If authenticated, execute the action
    const result = action();
    if (successMessage) {
      showToast(successMessage, "success");
    }
    onSuccess();
    return result;
  }, [navigate]);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem("authToken");
  }, []);

  const getAuthToken = useCallback(() => {
    return localStorage.getItem("authToken");
  }, []);

  // Specific methods for common actions
  const protectedCartAction = useCallback((action, options = {}) => {
    return requireAuth(action, {
      ...options,
      actionType: 'cart',
      errorMessage: 'Please login to add items to cart'
    });
  }, [requireAuth]);

  const protectedWishlistAction = useCallback((action, options = {}) => {
    return requireAuth(action, {
      ...options,
      actionType: 'wishlist',
      errorMessage: 'Please login to manage your wishlist'
    });
  }, [requireAuth]);

  return { 
    requireAuth, 
    isAuthenticated, 
    getAuthToken,
    protectedCartAction,
    protectedWishlistAction
  };
};

export default useProtectedAction;