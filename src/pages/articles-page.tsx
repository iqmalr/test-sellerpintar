"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAuthToken } from "@/lib/api/auth";
import { getArticles, deleteArticle } from "@/lib/api/articles";
import { Article, ArticlesParams } from "@/types/articles";
import Link from "next/link";
import { fetchCategoriesApi } from "@/lib/api/categories";
import { Category } from "@/types/categories";

export default function ArticlesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalArticles, setTotalArticles] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadCategories = async () => {
    try {
      const data = await fetchCategoriesApi(1, 100);
      setCategories(data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const loadArticles = async () => {
    setLoading(true);
    setError(null);

    const token = getAuthToken();
    console.log("Loading articles with filters...");
    console.log("Current token:", token);

    try {
      const params: ArticlesParams = {
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        sortOrder,
      };

      if (debouncedSearchTerm.trim()) {
        params.title = debouncedSearchTerm.trim();
      }

      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }

      if (selectedUser !== "all") {
        params.userId = selectedUser;
      }

      if (dateRangeStart) {
        params.createdAtStart = dateRangeStart;
      }

      if (dateRangeEnd) {
        params.createdAtEnd = dateRangeEnd;
      }

      console.log("API params:", params);

      const response = await getArticles(params);

      setArticles(response.data);
      setTotalArticles(response.total);
      setTotalPages(Math.ceil(response.total / response.limit));

      console.log("Articles loaded:", response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch articles");
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadArticles();
  }, [
    currentPage,
    debouncedSearchTerm,
    selectedCategory,
    selectedUser,
    sortBy,
    sortOrder,
    dateRangeStart,
    dateRangeEnd,
    itemsPerPage,
  ]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [
    debouncedSearchTerm,
    selectedCategory,
    selectedUser,
    dateRangeStart,
    dateRangeEnd,
  ]);

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      await deleteArticle(articleId);
      await loadArticles();
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article. Please try again.");
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedUser("all");
    setDateRangeStart("");
    setDateRangeEnd("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const hasActiveFilters = () => {
    return (
      searchTerm ||
      selectedCategory !== "all" ||
      selectedUser !== "all" ||
      dateRangeStart ||
      dateRangeEnd ||
      sortBy !== "createdAt" ||
      sortOrder !== "desc"
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">Error: {error}</p>
          <Button onClick={loadArticles}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
            <p className="text-sm text-gray-600">
              Total Articles: {totalArticles}
            </p>
          </div>
          <Link href="/admin/articles/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Article
            </Button>
          </Link>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories
                .filter((category) => category.id && category.id.trim() !== "")
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {hasActiveFilters() && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="gap-2 text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading articles...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-20">Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-32">Category</TableHead>
                  <TableHead className="w-32">Author</TableHead>
                  <TableHead className="w-48">Created At</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-gray-500"
                    >
                      {hasActiveFilters()
                        ? "No articles found matching your filters"
                        : "No articles found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  articles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src="/placeholder.svg"
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="line-clamp-2 font-medium text-gray-900">
                          {article.title}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700"
                        >
                          {article.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {article.user.username}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {formatDate(article.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <span>Preview</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                          >
                            <div>Edit</div>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteArticle(article.id)}
                          >
                            <span>Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {!loading && articles.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Items per page:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        currentPage === pageNumber ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={
                        currentPage === pageNumber
                          ? "bg-blue-600 hover:bg-blue-700"
                          : ""
                      }
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalArticles)} of{" "}
              {totalArticles} results
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
