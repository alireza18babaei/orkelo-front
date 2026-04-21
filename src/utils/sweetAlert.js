import Swal from "sweetalert2";

// Base for normal dialogs (modal)
const baseDialog = {
  confirmButtonText: "OK",
  cancelButtonText: "Cancel",
  heightAuto: false,
};

// Base for toasts
const baseToast = {
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timerProgressBar: true,
  customClass: {
    container: "swal-toast-container",
    popup: "swal-toast-popup",
  },
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
};

export const alertSuccess = (title = "Success", text = "") =>
  Swal.fire({
    ...baseDialog,
    icon: "success",
    title,
    text,
  });

export const alertError = (title = "Error", text = "Something went wrong") =>
  Swal.fire({
    ...baseDialog,
    icon: "error",
    title,
    text,
  });

export const alertInfo = (title = "Info", text = "") =>
  Swal.fire({
    ...baseDialog,
    icon: "info",
    title,
    text,
  });

export const alertConfirm = ({
  title = "Are you sure?",
  text = "This action cannot be undone.",
  confirmText = "Yes",
  cancelText = "Cancel",
} = {}) =>
  Swal.fire({
    ...baseDialog,
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  });

export const alertTextConfirm = ({
  title = "Are you sure?",
  text = "This action cannot be undone.",
  confirmText = "Yes",
  cancelText = "Cancel",
  inputLabel = "",
  inputPlaceholder = "",
  expectedValue = "",
  requiredMessage = "This field is required.",
  mismatchMessage = "Entered value does not match.",
} = {}) =>
  Swal.fire({
    ...baseDialog,
    icon: "warning",
    title,
    text,
    input: "text",
    inputLabel,
    inputPlaceholder,
    inputAttributes: {
      autocapitalize: "off",
      autocomplete: "off",
      autocorrect: "off",
      spellcheck: "false",
    },
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    preConfirm: (value) => {
      const normalizedValue = String(value ?? "").trim();
      const normalizedExpectedValue = String(expectedValue ?? "").trim();

      if (!normalizedValue) {
        Swal.showValidationMessage(requiredMessage);
        return false;
      }

      if (
        normalizedExpectedValue &&
        normalizedValue !== normalizedExpectedValue
      ) {
        Swal.showValidationMessage(mismatchMessage);
        return false;
      }

      return normalizedValue;
    },
  });

// Toasts
export const toastSuccess = (title = "Done", timer = 2500) =>
  Swal.fire({
    ...baseToast,
    icon: "success",
    title,
    timer,
  });

export const toastError = (title = "Error", timer = 3000) =>
  Swal.fire({
    ...baseToast,
    icon: "error",
    title,
    timer,
  });

export const toastInfo = (title = "Info", timer = 2500) =>
  Swal.fire({
    ...baseToast,
    icon: "info",
    title,
    timer,
  });
