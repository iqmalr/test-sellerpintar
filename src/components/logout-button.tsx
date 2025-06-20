"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/api/auth";
import { toast } from "sonner";

interface LogoutButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function LogoutButton({
  variant = "ghost",
  className = "hover:bg-destructive hover:text-white",
  showIcon = true,
  children,
}: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = () => {
    try {
      logoutUser();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <Button variant={variant} className={className} onClick={handleLogout}>
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children || "Logout"}
    </Button>
  );
}
