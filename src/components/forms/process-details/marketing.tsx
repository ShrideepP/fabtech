"use client";

import { marketingSchema as formSchema } from "@/lib/schemas/process-details";
import { TABLE_NAMES, FOLDER_NAMES } from "@/lib/constants";
import { getFiles, uploadFiles } from "@/lib/api/files";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
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
import { Icons } from "@/components/icons";
import Link from "next/link";

interface ProcessDetailsProps {
  id?: string;
  mode: "create" | "read" | "update";
  defaultValues?: z.infer<typeof formSchema>;
}

export default function ProcessDetails({
  id,
  mode,
  defaultValues,
}: ProcessDetailsProps) {
  const router = useRouter();

  const [quotation, setQuotation] = useState<any[]>([]);
  const [finalisedQuotation, setFinalisedQuotation] = useState<any[]>([]);

  const [isQuotationLoading, setIsQuotationLoading] = useState(false);
  const [isFinalisedQuotationLoading, setIsFinalisedQuotationLoading] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();
    if (mode === "read") return;
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from(TABLE_NAMES.marketing)
        .update(values)
        .eq("id", id)
        .select();

      if (error) {
        return toast({ title: error?.message, variant: "destructive" });
      }

      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }

  async function getQuotationFiles() {
    setIsQuotationLoading(true);
    try {
      const { data, error } = await getFiles(
        id as string,
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
        id as string,
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
      const { error } = await uploadFiles(id as string, path, file);

      if (error) {
        return toast({ title: error?.message, variant: "destructive" });
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
                        variant={"outline"}
                        disabled={mode === "read"}
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
                        <Icons.calendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
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
                        variant={"outline"}
                        disabled={mode === "read"}
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
                        <Icons.calendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
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
            mode={mode === "read" ? "read" : "createOrUpdate"}
            onChange={handleQuotationChange}
          />

          <FileUpload
            path={FOLDER_NAMES.finalisedQuotation}
            files={finalisedQuotation}
            isLoading={isFinalisedQuotationLoading}
            refetchFiles={getFinalisedQuotationFiles}
            mode={mode === "read" ? "read" : "createOrUpdate"}
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
                        variant={"outline"}
                        disabled={mode === "read"}
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
                        <Icons.calendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
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
                        variant={"outline"}
                        disabled={mode === "read"}
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
                        <Icons.calendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
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
                        variant={"outline"}
                        disabled={mode === "read"}
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
                        <Icons.calendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
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
                        variant={"outline"}
                        disabled={mode === "read"}
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
                        <Icons.calendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
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
                        variant={"outline"}
                        disabled={mode === "read"}
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
                        <Icons.calendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
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
                    readOnly={mode === "read"}
                    placeholder="Enter worker name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {mode !== "read" && (
          <div className="flex items-center gap-2.5">
            <Button size="lg" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.loader className="w-4 h-4 mr-2 animate-spin" />{" "}
                  Loading...
                </>
              ) : mode === "create" ? (
                "Submit & Dashboard"
              ) : (
                "Save & Dashboard"
              )}
            </Button>
            <Link href="/">
              <Button size="lg" type="button" variant="outline">
                Skip & Dashboard
              </Button>
            </Link>
          </div>
        )}
      </form>
    </Form>
  );
}
