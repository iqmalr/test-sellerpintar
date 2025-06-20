export interface Article {
  id: string;
  title: string;
  content: string;
  userId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    id: string;
    username: string;
    role: "User" | "Admin";
  };
}

export interface ArticlesResponse {
  data: Article[];
  total: number;
  page: number;
  limit: number;
}

export interface ArticlesParams {
  articleId?: string;
  userId?: string;
  title?: string;
  category?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
