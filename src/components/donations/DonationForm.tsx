
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import StellarSdk from 'stellar-sdk';

const DESTINATION_PUBLIC_KEY = 'GBWHSWL3DL5INR34TLGGKXFT4GFPFUJVMHBEY4J4PMIOZ26KBS27FFXR';

type DonationFormData = {
  amount: number;
  recipientType: 'underprivileged' | 'abuse_victim';
  donorName: string;
  donorEmail: string;
  message: string;
  anonymous: boolean;
};

export const DonationForm = () => {
  const form = useForm<DonationFormData>();
  
  const onSubmit = async (data: DonationFormData) => {
    try {
      // First create the donation record
      const { data: donation, error: donationError } = await supabase.from('donations').insert({
        amount: data.amount,
        recipient_type: data.recipientType,
        donor_name: data.anonymous ? null : data.donorName,
        donor_email: data.donorEmail,
        message: data.message,
        anonymous: data.anonymous,
        status: 'pending'
      }).select().single();

      if (donationError) throw donationError;

      // Show instructions for Stellar payment
      toast.info(
        <div className="space-y-2">
          <p>Please send {data.amount} XLM to:</p>
          <p className="font-mono text-sm break-all bg-secondary/50 p-2 rounded">{DESTINATION_PUBLIC_KEY}</p>
          <p>Once sent, your donation will be tracked on the Stellar blockchain.</p>
        </div>,
        {
          duration: 10000,
        }
      );
      
      form.reset();
      
      toast.success('Thank you for your donation!');
    } catch (error) {
      toast.error('Failed to process donation. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Make a Donation</CardTitle>
        <CardDescription>
          Your donation will be processed securely through Stellar blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="1" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipientType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="underprivileged">Underprivileged Children</option>
                      <option value="abuse_victim">Abuse Victims</option>
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="donorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="donorEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="anonymous"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Make donation anonymous</FormLabel>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Donate Now
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
