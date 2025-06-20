"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Plus, Loader2 } from "lucide-react";
import { fetchCategoriesApi } from "@/lib/api/categories";
import { Category } from "@/types/categories";

function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit] = useState(10);

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) return;
    setCurrentPage(1);
    fetchCategories(1, debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    fetchCategories(currentPage, debouncedSearchQuery);
  }, [currentPage]);

  const fetchCategories = async (page: number, search: string = "") => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchCategoriesApi(page, limit, search);

      setCategories(data.data);
      setTotalData(data.totalData);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories",
      );
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit category:", id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      fetchCategories(currentPage, debouncedSearchQuery);
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category");
    }
  };

  const handleAddCategory = () => {
    console.log("Add new category");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      const showLeftEllipsis = currentPage > 3;
      const showRightEllipsis = currentPage < totalPages - 2;

      if (showLeftEllipsis) {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(1);
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>,
        );

        if (currentPage > 4) {
          items.push(
            <PaginationItem key="left-ellipsis">
              <PaginationEllipsis />
            </PaginationItem>,
          );
        }
      }

      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(totalPages, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      if (showRightEllipsis) {
        if (currentPage < totalPages - 3) {
          items.push(
            <PaginationItem key="right-ellipsis">
              <PaginationEllipsis />
            </PaginationItem>,
          );
        }

        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(totalPages);
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    }

    return items;
  };

  return (
    <div className="container mx-auto min-h-screen bg-gray-50 p-6">
      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-sm text-gray-600">
              Total Category: {loading ? "..." : totalData}
            </h1>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search Category"
                className="border-gray-200 pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={handleAddCategory}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
              Error: {error}
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() =>
                  fetchCategories(currentPage, debouncedSearchQuery)
                }
              >
                Retry
              </Button>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="font-medium text-gray-900">
                  Category
                </TableHead>
                <TableHead className="font-medium text-gray-900">
                  Created at
                </TableHead>
                <TableHead className="font-medium text-gray-900">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    <p className="mt-2 text-gray-500">Loading categories...</p>
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-32 text-center text-gray-500"
                  >
                    {searchQuery
                      ? "No categories found matching your search."
                      : "No categories found."}
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id} className="border-gray-100">
                    <TableCell className="text-gray-700">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {formatDate(category.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleEdit(category.id)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-sm font-medium text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-gray-200 p-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={
                      currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        handlePageChange(currentPage + 1);
                    }}
                    className={
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
