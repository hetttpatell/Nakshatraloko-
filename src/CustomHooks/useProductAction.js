import { useCallback } from "react";
import { useAuthModal } from "../Context/AuthContext";

export const useProtectedAction = () => {
  const { openLoginModal } = useAuthModal();

  const requireAuth = useCallback((action, options = {}) => {
    const {
      successMessage = "",
      errorMessage = "Please login to continue",
      showToast = () => {},
      onSuccess = () => {},
      onError = () => {},
      actionType = "action"
    } = options;

    const token = localStorage.getItem("authToken");

    if (!token) {
      const actionText =
        actionType === "cart"
          ? "add items to cart"
          : actionType === "wishlist"
          ? "manage your wishlist"
          : "perform this action";

      const finalMessage =
        errorMessage === "Please login to continue"
          ? `Please login to ${actionText}`
          : errorMessage;

      showToast(finalMessage, "error");

      // ✅ OPEN MODAL INSTEAD OF REDIRECT
      openLoginModal();

      onError();
      return false;
    }

    const result = action();

    if (successMessage) {
      showToast(successMessage, "success");
    }

    onSuccess();
    return result;
  }, [openLoginModal]);

  const protectedCartAction = useCallback((action, options = {}) => {
    return requireAuth(action, {
      ...options,
      actionType: "cart"
    });
  }, [requireAuth]);

  const protectedWishlistAction = useCallback((action, options = {}) => {
    return requireAuth(action, {
      ...options,
      actionType: "wishlist"
    });
  }, [requireAuth]);

  return {
    protectedCartAction,
    protectedWishlistAction
  };
};