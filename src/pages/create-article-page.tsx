"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import RichEditor from "@/components/rich-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, UploadIcon } from "lucide-react";

import { fetchCategoriesApi } from "@/lib/api/categories";
import { createArticle } from "@/lib/api/articles";
import { Category } from "@/types/categories";

// ✅ Zod schema
const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  categoryId: z.string().min(1, "Category is required"),
});

type ArticleFormData = z.infer<typeof articleSchema>;

function CreateArticlePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
    },
  });

  const onSubmit = async (data: ArticleFormData) => {
    setLoading(true);
    try {
      await createArticle(data);
      toast.success("Artikel berhasil dibuat!");
      router.push("/admin/articles");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? "Gagal membuat artikel: " + error.message
          : "Gagal membuat artikel.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesApi(1, 100)
      .then((data) => setCategories(data.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <Card className="m-6 min-h-screen bg-gray-50">
      <div>
        <div className="mb-8 flex items-center gap-3">
          <Button variant="ghost" size="sm" className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-medium">Create Articles</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label className="mb-3 block text-sm font-medium">Thumbnails</Label>
            <Card className="cursor-pointer border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400">
              <CardContent className="flex flex-col items-center justify-center px-6 py-12">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  <UploadIcon className="h-6 w-6 text-gray-400" />
                </div>
                <p className="mb-1 text-sm text-gray-600">
                  Click to select files
                </p>
                <p className="text-xs text-gray-400">
                  Support File Type: jpg or png
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <Label htmlFor="title" className="mb-3 block text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Input title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-3 block text-sm font-medium">Category</Label>
            <Select
              onValueChange={(value) => setValue("categoryId", value)}
              value={watch("categoryId")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter(
                    (category) => category.id && category.id.trim() !== "",
                  )
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-3 block text-sm font-medium">Content</Label>
            {/* <RichEditor onChange={setContent} /> */}
            {/* <RichEditor
              onChange={(value) => setValue("content", value)}
              initialValue={watch("content")}
            /> */}
            <RichEditor onChange={(value) => setValue("content", value)} />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button variant="outline" type="button">
              Preview
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}

export default CreateArticlePage;

{
  /* <RichEditor onChange={setContent} /> */
}
