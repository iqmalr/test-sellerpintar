"use client";
import { ReactNode } from "react";
import { FileText, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/images/logoipsum.png";
import Image from "next/image";
export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  return (
    <div className="flex h-full min-h-screen bg-gray-50">
      <div className="flex w-64 flex-col bg-blue-600 text-white">
        <div className="border-b border-blue-500 p-6">
          <div className="flex items-center gap-2">
            <div className="relative h-[24px] w-[135px]">
              <Image src={logo} alt="logo" fill />
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <Link href="/admin/articles">
            <Button
              variant="ghost"
              className="w-full justify-start text-blue-100 hover:bg-blue-500 hover:text-white"
            >
              <FileText className="mr-3 h-4 w-4" />
              Articles
            </Button>
          </Link>
          <Link href="/admin/category">
            <Button
              variant="ghost"
              className="w-full justify-start text-blue-100 hover:bg-blue-500 hover:text-white"
            >
              <Tag className="mr-3 h-4 w-4" />
              Category
            </Button>
          </Link>
          <LogoutButton />
        </nav>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                {loading ? (
                  <span className="text-sm text-gray-700">Loading...</span>
                ) : (
                  <span className="text-sm text-gray-700">
                    {user?.username || "Guest"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
