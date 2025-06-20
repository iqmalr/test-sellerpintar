import { AxiosError } from "axios";

export function isAxiosErrorWithMessage(
  error: unknown,
): error is AxiosError<{ message?: string }> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}

export function handleAxiosError(
  error: unknown,
  customMessages?: Record<number, string>,
): never {
  if (isAxiosErrorWithMessage(error)) {
    const status = error.response?.status;
    const message =
      (status && customMessages?.[status]) ||
      error.response?.data?.message ||
      error.message ||
      "Unknown error occurred";

    throw new Error(message);
  }

  throw error instanceof Error ? error : new Error("Unknown error occurred");
}
