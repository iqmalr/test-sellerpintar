import { apiClient } from "./api-client";
import { ArticlesParams, ArticlesResponse, Article } from "@/types/articles";
import { handleAxiosError } from "./error-handler";

export async function getArticles(
  params: ArticlesParams = {},
): Promise<ArticlesResponse> {
  try {
    const response = await apiClient.get<ArticlesResponse>("/articles", {
      params,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, {
      401: "Unauthorized - please login again",
      404: "Articles endpoint not found",
    });
  }
}

export async function getArticleById(id: string): Promise<Article> {
  try {
    const response = await apiClient.get<Article>(`/articles/${id}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error, {
      401: "Unauthorized - please login again",
      404: "Article not found",
    });
  }
}

export async function createArticle(articleData: {
  title: string;
  content: string;
  categoryId: string;
}): Promise<Article> {
  try {
    const response = await apiClient.post<Article>("/articles", articleData);
    return response.data;
  } catch (error) {
    handleAxiosError(error, {
      401: "Unauthorized - please login again",
    });
  }
}

export async function updateArticle(
  id: string,
  articleData: {
    title?: string;
    content?: string;
    categoryId?: string;
  },
): Promise<Article> {
  try {
    const response = await apiClient.put<Article>(
      `/articles/${id}`,
      articleData,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, {
      401: "Unauthorized - please login again",
      404: "Article not found",
    });
  }
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    await apiClient.delete(`/articles/${id}`);
  } catch (error) {
    handleAxiosError(error, {
      401: "Unauthorized - please login again",
      404: "Article not found",
    });
  }
}
