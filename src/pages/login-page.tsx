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
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { loginUser } from "@/lib/api/auth";
import { toast } from "sonner";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const setCookie = (name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await loginUser(data);

      if (response.token) {
        localStorage.setItem("token", response.token);
        setCookie("token", response.token);
      }
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      console.log("response", response);
      toast.success("Login successful!");

      router.push("/admin/articles");

      window.location.href = "/admin/articles";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
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
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <CardAction>
            <span>Don&apos;t have an account? </span>
            <Link href="/register" className="text-primary">
              Register
            </Link>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginPage;
