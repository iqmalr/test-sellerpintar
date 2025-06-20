"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import logo from "@/images/logoipsum.png";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/password-input";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerSchema, RegisterFormData } from "@/lib/validations/auth";
import { registerUser } from "@/lib/api/auth";
import { toast } from "sonner";

function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      console.log(data);
      toast.success("Registration successful! Please login.");
      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="flex items-center justify-center">
          <CardTitle>
            <div className="relative h-[24px] w-[135px]">
              <Image src={logo} alt="logo" fill />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Input username"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  placeholder="Input Password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("role", value as "User" | "Admin")
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
          <CardAction>
            <span>Already have an account? </span>
            <Link href="/login" className="text-primary">
              Login
            </Link>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}

export default RegisterPage;
