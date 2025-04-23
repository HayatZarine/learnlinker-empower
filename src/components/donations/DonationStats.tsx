
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

export const DonationStats = () => {
  const { data: stats } = useQuery({
    queryKey: ['donation-stats'],
    queryFn: async () => {
      const { data: totalData, error: totalError } = await supabase
        .from('donations')
        .select('amount')
        .eq('status', 'completed');

      if (totalError) throw totalError;

      const total = totalData.reduce((sum, d) => sum + Number(d.amount), 0);
      
      return {
        total,
        count: totalData.length
      };
    }
  });

  return (
    <div className="grid gap-4 grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">${stats?.total?.toLocaleString() ?? 0}</div>
          <div className="text-sm text-muted-foreground">Total Donated</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{stats?.count ?? 0}</div>
          <div className="text-sm text-muted-foreground">Total Donations</div>
        </CardContent>
      </Card>
    </div>
  );
};
