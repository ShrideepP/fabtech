"use client";

import {
  productMeasurementsSchema as formSchema,
  defaultValues,
} from "@/lib/schemas/product-measurements";
import { ProductMeasurementsContext } from "../context/product-measurement-context";
import { addMeasurement, updateMeasurement } from "@/lib/api/measurements";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FLOW_SEARCH_PARAMS, DESIGN_VARIANTS } from "@/lib/constants";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useState, useContext, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { capitalize } from "@/lib/utils";
import { toast } from "../ui/use-toast";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DimensionBox from "../dimension-box";
import { Icons } from "../icons";

interface ProductMeasurementsProps {
  id?: string;
  mode: "read" | "createOrUpdate";
  preDefinedValues?: z.infer<typeof formSchema>;
}

export default function ProductMeasurements({
  id,
  mode,
  preDefinedValues,
}: ProductMeasurementsProps) {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const [designVariants, setDesignVariants] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(ProductMeasurementsContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: preDefinedValues ?? defaultValues,
  });

  const designSelection = form.watch("design_selection");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (context?.view) return;
    setIsLoading(true);

    try {
      let response: PostgrestSingleResponse<any[]>;

      if (context?.edit) {
        response = await updateMeasurement(context.edit.id, values);
        context.setEdit(null);
      } else {
        response = await addMeasurement({ ...values, customer_id: id });
      }

      const { error } = response;

      if (error) {
        return toast({ title: error?.message, variant: "destructive" });
      }

      form.reset(defaultValues);
    } finally {
      setIsLoading(false);
    }
  }

  function onSkipAndContinue() {
    const sp = new URLSearchParams(searchParams);
    sp.set("step", FLOW_SEARCH_PARAMS.step3);
    router.push(`${pathname}?${sp.toString()}`);
  }

  useEffect(() => {
    if (designSelection) {
      setDesignVariants((DESIGN_VARIANTS as any)[designSelection]);
    }
  }, [designSelection]);

  useEffect(() => {
    if (context?.view) form.reset(context.view);
    else if (context?.edit) form.reset(context.edit);
    else form.reset(preDefinedValues ?? defaultValues);
  }, [context?.view, context?.edit]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="design_selection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Design selection</FormLabel>
                    <Select
                      disabled={mode === "read" || context?.view ? true : false}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a design" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(DESIGN_VARIANTS).map((design) => (
                          <SelectItem key={design} value={design.toString()}>
                            {capitalize(design)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        min={1}
                        type="number"
                        defaultValue={1}
                        readOnly={
                          mode === "read" || context?.view ? true : false
                        }
                        placeholder="Enter quantity"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="design_ref"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Design ref</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue(
                          "design_rate",
                          (designVariants as any)[value]
                        );
                      }}
                      value={field.value}
                      disabled={
                        !designSelection || mode === "read" || context?.view
                          ? true
                          : false
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a variant" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(designVariants)?.map((variant) => (
                          <SelectItem key={variant} value={variant.toString()}>
                            {variant.split("-").join(" ")[0].toUpperCase() +
                              variant.split("-").join(" ").slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="design_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Design rate</FormLabel>
                    <FormControl>
                      <Input
                        readOnly
                        type="number"
                        defaultValue={0}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Window / door location</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        readOnly={
                          mode === "read" || context?.view ? true : false
                        }
                        placeholder="Enter window / door location"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="floor_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        readOnly={
                          mode === "read" || context?.view ? true : false
                        }
                        placeholder="Enter floor number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="granite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Granite</FormLabel>
                    <Select
                      disabled={mode === "read" || context?.view ? true : false}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a value" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colour</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        readOnly={
                          mode === "read" || context?.view ? true : false
                        }
                        placeholder="Enter colour"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lock</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        readOnly={
                          mode === "read" || context?.view ? true : false
                        }
                        placeholder="Lock"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mosquito_window"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mosquito window</FormLabel>
                    <Select
                      disabled={mode === "read" || context?.view ? true : false}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a value" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="one-side">One side</SelectItem>
                        <SelectItem value="both-side">Both side</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="glass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Glass</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      readOnly={mode === "read" || context?.view ? true : false}
                      placeholder="Glass"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea
                      readOnly={mode === "read" || context?.view ? true : false}
                      placeholder="Enter a note"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid place-items-center">
            <div className="flex flex-col items-start gap-8">
              <div className="flex items-center gap-8">
                <DimensionBox />

                <div className="w-fit h-fit flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="w1"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            readOnly={
                              mode === "read" || context?.view ? true : false
                            }
                            placeholder="w1"
                            className="w-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="w2"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            readOnly={
                              mode === "read" || context?.view ? true : false
                            }
                            placeholder="w2"
                            className="w-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="w3"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            readOnly={
                              mode === "read" || context?.view ? true : false
                            }
                            placeholder="w3"
                            className="w-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="w-60 h-fit flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="h1"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          readOnly={
                            mode === "read" || context?.view ? true : false
                          }
                          placeholder="h1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="h2"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          readOnly={
                            mode === "read" || context?.view ? true : false
                          }
                          placeholder="h2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="h3"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          readOnly={
                            mode === "read" || context?.view ? true : false
                          }
                          placeholder="h3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {mode !== "read" && (
          <div className="flex items-center gap-2.5">
            {context?.view ? (
              <></>
            ) : context?.edit ? (
              <Button size="lg" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icons.loader className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Save Changes"
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
                  "Add Measurement"
                )}
              </Button>
            )}

            {context?.view || context?.edit ? (
              <Button
                size="lg"
                type="button"
                variant="secondary"
                onClick={() => {
                  context.setView(null), context.setEdit(null);
                }}
              >
                Cancel
              </Button>
            ) : (
              <Button
                size="lg"
                type="button"
                variant="outline"
                onClick={onSkipAndContinue}
              >
                Skip & Continue
              </Button>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
