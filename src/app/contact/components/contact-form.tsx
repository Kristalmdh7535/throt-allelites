'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  bike: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export default function ContactForm() {
  const searchParams = useSearchParams();
  const bikeName = searchParams.get('bike');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      bike: bikeName || '',
      message: '',
    },
  });

  useEffect(() => {
    if (bikeName) {
      form.setValue('bike', bikeName);
    }
  }, [bikeName, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', values);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Message Sent!',
      description: 'Thank you for your inquiry. We will get back to you shortly.',
    });
    form.reset();
    if (bikeName) {
      form.setValue('bike', bikeName);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {bikeName && (
              <FormField
                control={form.control}
                name="bike"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interested In</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us how we can help..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
               {form.formState.isSubmitting ? 'Sending...' : <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
               </>}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
