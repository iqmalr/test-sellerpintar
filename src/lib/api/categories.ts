import { apiClient } from "./api-client";
import { CategoryResponse } from "@/types/categories";
import { handleAxiosError } from "./error-handler";

export async function fetchCategoriesApi(
  page: number,
  limit: number,
  search = "",
): Promise<CategoryResponse> {
  try {
    const response = await apiClient.get<CategoryResponse>("/categories", {
      params: {
        page,
        limit,
        ...(search.trim() && { search: search.trim() }),
      },
    });

    return response.data;
  } catch (error) {
    handleAxiosError(error, {
      401: "Unauthorized - please login again",
      404: "Category endpoint not found",
    });
  }
}
