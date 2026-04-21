export const getErrorMessage = (err) => {
  if (!err || typeof err !== "object") {
    return { status: 0, message: "Unknown Error" };
  }

  return {
    status: err?.status ?? 0,
    message: err?.message || "Unknown Error",
    ...(err?.errors ? { errors: err.errors } : {}),
  };
};

