"use client";

import { marketingSchema as formSchema } from "@/lib/schemas/process-details";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getFiles, uploadFiles } from "@/lib/api/files";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { FOLDER_NAMES } from "@/lib/constants";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Icons } from "@/components/icons";

interface ProcessDetailsProps {
  defaultValues?: z.infer<typeof formSchema>;
  mode?: "edit" | "view";
  dashboardURL: string;
  tableName: string;
}

export default function ProcessDetails({
  defaultValues,
  mode,
  dashboardURL,
  tableName,
}: ProcessDetailsProps) {
  const router = useRouter();

  const params = useParams();

  const searchParams = useSearchParams();

  const { toast } = useToast();

  const [quotation, setQuotation] = useState<any[]>([]);
  const [finalisedQuotation, setFinalisedQuotation] = useState<any[]>([]);

  const [isQuotationLoading, setIsQuotationLoading] = useState(false);
  const [isFinalisedQuotationLoading, setIsFinalisedQuotationLoading] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();
    setIsLoading(true);

    try {
      let response: PostgrestSingleResponse<null>;

      if (mode === "edit") {
        response = await supabase
          .from(tableName)
          .update(values)
          .eq("id", params.customerId);
      } else {
        response = await supabase
          .from(tableName)
          .update(values)
          .eq("id", searchParams.get("id"));
      }

      if (response?.error)
        return toast({
          title: response.error?.message,
          variant: "destructive",
        });
    } finally {
      setIsLoading(false);
      router.push(dashboardURL);
    }
  }

  async function getQuotationFiles() {
    setIsQuotationLoading(true);
    try {
      const { data, error } = await getFiles(
        searchParams.get("id") as string,
        FOLDER_NAMES.quotation
      );

      if (error) {
        return toast({ title: error?.message, variant: "destructive" });
      }

      setQuotation(data);
    } finally {
      setIsQuotationLoading(false);
    }
  }

  async function getFinalisedQuotationFiles() {
    setIsFinalisedQuotationLoading(true);
    try {
      const { data, error } = await getFiles(
        searchParams.get("id") as string,
        FOLDER_NAMES.finalisedQuotation
      );

      if (error) {
        return toast({ title: error?.message, variant: "destructive" });
      }

      setFinalisedQuotation(data);
    } finally {
      setIsFinalisedQuotationLoading(false);
    }
  }

  async function handleUpload(path: string, file: File) {
    if (file) {
      const { data, error } = await uploadFiles(
        searchParams.get("id") as string,
        path,
        file
      );

      if (error) {
        return toast({
          title: error?.message,
          variant: "destructive",
        });
      }
    }
  }

  async function handleQuotationChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (event.target.files) {
      try {
        await handleUpload(FOLDER_NAMES.quotation, event.target.files[0]);
      } finally {
        getQuotationFiles();
      }
    }
  }

  async function handleFinalisedQuotationChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (event.target.files) {
      try {
        await handleUpload(
          FOLDER_NAMES.finalisedQuotation,
          event.target.files[0]
        );
      } finally {
        getFinalisedQuotationFiles();
      }
    }
  }

  useEffect(() => {
    getQuotationFiles();
    getFinalisedQuotationFiles();
  }, []);

  useEffect(() => {
    if (mode === "edit" || mode === "view") form.reset(defaultValues);
  }, [defaultValues]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="visiting_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visiting date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={mode === "view"}
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visiting_done_of_site"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visiting done of site</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={mode === "view"}
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FileUpload
            path={FOLDER_NAMES.quotation}
            files={quotation}
            isLoading={isQuotationLoading}
            refetchFiles={getQuotationFiles}
            onChange={handleQuotationChange}
          />

          <FileUpload
            path={FOLDER_NAMES.finalisedQuotation}
            files={finalisedQuotation}
            isLoading={isFinalisedQuotationLoading}
            refetchFiles={getFinalisedQuotationFiles}
            onChange={handleFinalisedQuotationChange}
          />

          <FormField
            control={form.control}
            name="customer_office_visit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer office visit</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={mode === "view"}
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="follow_up_after_quotation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Follow up after quotation</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={mode === "view"}
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="advance_payment_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Advance payment date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={mode === "view"}
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="installation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Installation</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={mode === "view"}
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="finishing_visit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing visit</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={mode === "view"}
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quality_check_done_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quality check done by</FormLabel>
                <FormControl>
                  <Input
                    readOnly={mode === "view"}
                    placeholder="Quality check done by"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {mode !== "view" && (
          <div className="flex items-center gap-2.5">
            {mode === "edit" ? (
              <Button size="lg" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icons.loader className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Save & Dashboard"
                )}
              </Button>
            ) : (
              <Button size="lg" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icons.loader className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Submit & Dashboard"
                )}
              </Button>
            )}

            <Button
              size="lg"
              type="button"
              variant="outline"
              onClick={() => router.push(dashboardURL)}
            >
              Skip & Dashboard
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
