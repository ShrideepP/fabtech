"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { sendResetEmail } from "@/lib/api/auth";
import { AuthError } from "@supabase/supabase-js";
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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
});

export default function ForgotPassword() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response:
        | {
            data: {};
            error: null;
          }
        | {
            data: null;
            error: AuthError;
          } = await sendResetEmail(values.email);

      if (response?.error) {
        return toast({
          title: response?.error?.message,
          variant: "destructive",
        });
      }

      setIsEmailSent(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center gap-6 md:gap-8">
      {isEmailSent ? (
        <>
          <h2 className="text-xl sm:text-2xl lg:text-3xl text-foreground font-bold">
            Reset link sent
          </h2>
          <div className="w-full sm:w-96 h-fit p-6 md:p-8 flex flex-col gap-6 rounded-md border bg-muted">
            <p className="text-sm text-foreground font-medium">
              Check your inbox (and spam folder!) for a password reset email and
              follow the instructions to reset your password.
            </p>
            <Separator />
            <Link href="/auth/signin">
              <Button className="w-full">Back to sign in</Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl sm:text-2xl lg:text-3xl text-foreground font-bold">
            Forgot password?
          </h2>
          <div className="w-full sm:w-96 h-fit p-6 md:p-8 rounded-md border bg-muted">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Send reset email"
                  )}
                </Button>
              </form>
            </Form>
          </div>
          <Link href="/auth/signin">
            <Button variant="link">Back to sign in</Button>
          </Link>
        </>
      )}
    </section>
  );
}
