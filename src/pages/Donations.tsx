
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DonationForm } from '@/components/donations/DonationForm';
import { DonationHistory } from '@/components/donations/DonationHistory';
import { DonationStats } from '@/components/donations/DonationStats';

const Donations = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Support Those in Need</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help make education accessible to underprivileged children and abuse victims. 
            All donations are tracked transparently on the Stellar blockchain.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <DonationForm />
          </div>
          <div className="space-y-8">
            <DonationStats />
            <DonationHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donations;
