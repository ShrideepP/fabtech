"use client";

import { AuthTokenResponsePassword } from "@supabase/supabase-js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { authSchema } from "@/lib/schemas/auth";
import { useRouter } from "next/navigation";
import { signin } from "@/lib/api/auth";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import Link from "next/link";

export default function Signin() {
  const { toast } = useToast();

  const router = useRouter();

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof authSchema>) {
    setIsLoading(true);
    try {
      const response: AuthTokenResponsePassword = await signin(values);

      if (response?.error) {
        return toast({
          title: response?.error?.message,
          variant: "destructive",
        });
      }

      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center gap-6 md:gap-8">
      <h2 className="text-xl sm:text-2xl lg:text-3xl text-foreground font-bold">
        Welcome back!
      </h2>
      <div className="w-full sm:w-96 h-fit p-6 md:p-8 rounded-md border bg-muted">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2.5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <Link href="/auth/forgot-password">
        <Button variant="link">Forgot password?</Button>
      </Link>
    </section>
  );
}
