"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

import { useSendMagicLink } from "@/hooks/use-auth";

export function AuthForm() {
  const { mutate: sendMagicLink, isPending: loading } = useSendMagicLink();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    sendMagicLink(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <Field>
              <FormControl>
                <Input
                  disabled={loading}
                  size="lg"
                  placeholder="nate@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </Field>
          )}
        />
        <Button disabled={loading} className="w-full" size="lg" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
