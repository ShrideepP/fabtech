"use client";

import { COMPANY_NAME, PAGE_LINKS } from "@/lib/constants";
import { usePathname, useRouter } from "next/navigation";
import { AuthError, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "./ui/use-toast";
import { signout } from "@/lib/api/auth";
import { isActive } from "@/lib/utils";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "./ui/separator";
import ToggleTheme from "./toggle-theme";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import Link from "next/link";

export default function NavigationMenu() {
  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState<User>();

  const pathname = usePathname();

  const router = useRouter();

  const { toast } = useToast();

  async function handleSignout() {
    setIsLoading(true);
    try {
      const response: {
        error: AuthError | null;
      } = JSON.parse(await signout());

      if (response?.error) {
        return toast({
          title: response?.error?.message,
          variant: "destructive",
        });
      }

      router.push("/auth/signin");
    } finally {
      setIsLoading(false);
    }
  }

  async function getUser() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return toast({
        title: error?.message,
        variant: "destructive",
      });
    }

    setUser(data?.user);
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <nav className="w-full h-20 lg:hidden py-6 px-4 sm:px-8 md:px-12 sticky top-0 z-50 flex items-center justify-between border-b bg-background">
      <span className="text-lg sm:text-xl md:text-2xl text-foreground font-bold">
        {COMPANY_NAME}
      </span>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Icons.menu className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col justify-between">
          <SheetHeader className="flex flex-col gap-4">
            <SheetTitle>Fabtech</SheetTitle>
            <Separator />
            <div className="flex flex-col gap-2.5">
              {PAGE_LINKS.map(({ id, name, pageURL, icon: Icon }) => (
                <SheetClose key={id} asChild>
                  <Link href={pageURL}>
                    <Button
                      variant={
                        isActive(pathname, pageURL) ? "secondary" : "ghost"
                      }
                      className="w-full flex items-center justify-start gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {name}
                    </Button>
                  </Link>
                </SheetClose>
              ))}
            </div>
          </SheetHeader>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <ToggleTheme />
              <Button
                variant="ghost"
                disabled={isLoading}
                onClick={handleSignout}
                className="w-full flex items-center justify-start gap-2.5"
              >
                {isLoading ? (
                  <>
                    <Icons.loader className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Icons.logOut className="w-4 h-4" />
                    Sign out
                  </>
                )}
              </Button>
            </div>
            <Separator />
            <div className="flex items-center gap-2.5">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>
                  {user?.email ? user?.email[0] : "F"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-foreground font-medium truncate">
                  {user?.email}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  User Role
                </span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
