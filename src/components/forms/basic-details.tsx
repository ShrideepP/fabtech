"use client";

import { basicDetailsSchema as formSchema } from "@/lib/schemas/basic-details";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { zodResolver } from "@hookform/resolvers/zod";
import { FLOW_SEARCH_PARAMS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { toast } from "../ui/use-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "../icons";

interface BasicDetailsProps {
  id?: string;
  tableName: string;
  dashboardURL: string;
  mode: "create" | "read" | "update";
  defaultValues?: z.infer<typeof formSchema>;
}

export default function BasicDetails({
  id,
  tableName,
  dashboardURL,
  mode,
  defaultValues,
}: BasicDetailsProps) {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {},
  });

  const [isLoading, setIsLoading] = useState(false);

  const [isLoadingNext, setIsLoadingNext] = useState(false);

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();
    let response: PostgrestSingleResponse<any[]>;

    if (mode === "create") {
      response = await supabase.from(tableName).insert(values).select();
    } else {
      response = await supabase
        .from(tableName)
        .update(values)
        .eq("id", id)
        .select();
    }

    const { data, error } = response;

    if (error) {
      return toast({ title: error?.message, variant: "destructive" });
    }

    return data[0];
  }

  async function onSubmitOrSave() {
    if (mode === "read") return;
    setIsLoading(true);

    try {
      await form.trigger();

      if (Object.keys(form.formState.errors).length === 0) {
        const data = await handleSubmit(form.getValues());
        if (data?.id) {
          router.push(dashboardURL);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmitAndContinue() {
    if (mode === "read") return;
    setIsLoadingNext(true);

    try {
      await form.trigger();

      if (Object.keys(form.formState.errors).length === 0) {
        const data = await handleSubmit(form.getValues());
        if (data?.id) {
          const sp = new URLSearchParams(searchParams);
          sp.set("step", FLOW_SEARCH_PARAMS.step2);
          if (mode === "create") sp.set("id", data?.id);
          router.push(`${pathname}?${sp.toString()}`);
        }
      }
    } finally {
      setIsLoadingNext(false);
    }
  }

  function copyToClipboard() {
    if (navigator.clipboard && form.getValues().gmap) {
      navigator.clipboard
        .writeText(form.getValues().gmap)
        .then(() => toast({ title: "Copied" }))
        .catch(() =>
          toast({
            title: "Oops! something went wrong",
            variant: "destructive",
          })
        );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="party_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Party name</FormLabel>
                <FormControl>
                  <Input
                    readOnly={mode === "read"}
                    placeholder="Enter party name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobile_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    readOnly={mode === "read"}
                    placeholder="Enter mobile number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address 1</FormLabel>
                <FormControl>
                  <Input
                    readOnly={mode === "read"}
                    placeholder="Enter address 1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address 2</FormLabel>
                <FormControl>
                  <Input
                    readOnly={mode === "read"}
                    placeholder="Enter address 2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status_of_site"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status of site</FormLabel>
                <Select
                  disabled={mode === "read"}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select current status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="15-days">15 days</SelectItem>
                    <SelectItem value="1-to-2-months">1 to 2 months</SelectItem>
                    <SelectItem value="5-to-6-months">5 to 6 months</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="legal_billing_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal / billing name</FormLabel>
                <FormControl>
                  <Input
                    readOnly={mode === "read"}
                    placeholder="Enter legal / billing name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="party_gst_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Party GST number</FormLabel>
                <FormControl>
                  <Input
                    readOnly={mode === "read"}
                    placeholder="Enter party GST number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  disabled={mode === "read"}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="architecture">Architecture</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="measurement_taken_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Measurement taken by</FormLabel>
                <FormControl>
                  <Input
                    readOnly={mode === "read"}
                    placeholder="Enter measurement taken by"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gmap"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google maps location</FormLabel>
                <FormControl>
                  <div className="w-full flex items-end gap-2">
                    <Input
                      readOnly={mode === "read"}
                      placeholder="Enter google maps location"
                      {...field}
                      className="flex-1"
                    />
                    {mode === "read" && form.getValues().gmap && (
                      <>
                        <a href={form.getValues().gmap} target="_blank">
                          <Button size="icon" type="button" variant="secondary">
                            <Icons.externalLink className="w-4 h-4" />
                          </Button>
                        </a>
                        <Button
                          size="icon"
                          type="button"
                          onClick={copyToClipboard}
                        >
                          <Icons.copy className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {mode !== "read" && (
          <div className="flex items-center gap-2.5">
            {mode === "create" ? (
              <Button
                size="lg"
                type="button"
                disabled={isLoading}
                onClick={onSubmitOrSave}
              >
                {isLoading ? (
                  <>
                    <Icons.loader className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Submit & Dashboard"
                )}
              </Button>
            ) : (
              <Button
                size="lg"
                type="button"
                disabled={isLoading}
                onClick={onSubmitOrSave}
              >
                {isLoading ? (
                  <>
                    <Icons.loader className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Save & Dashboard"
                )}
              </Button>
            )}

            <Button
              size="lg"
              type="button"
              variant="outline"
              disabled={isLoadingNext}
              onClick={onSubmitAndContinue}
            >
              {isLoadingNext ? (
                <>
                  <Icons.loader className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Submit & Continue"
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
