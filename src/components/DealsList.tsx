'use client';

import { useState, useEffect } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ESCROW_ABI } from '@/constants/abi';
import { ESCROW_ADDRESS } from '@/constants/addresses';
import { getContract } from 'viem';

interface Deal {
  id: number;
  buyer: string;
  seller: string;
  amount: string;
  deadline: Date;
  isCompleted: boolean;
  isRefunded: boolean;
}

export function DealsList() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    if (!publicClient) return;

    try {
      const contract = getContract({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        client: { public: publicClient },
      });

      const dealCount = await contract.read.dealCount();
      const loadedDeals: Deal[] = [];

      for (let i = 0; i < dealCount; i++) {
        const deal = await contract.read.getDeal([BigInt(i)]);
        loadedDeals.push({
          id: i,
          buyer: deal.buyer,
          seller: deal.seller,
          amount: formatEther(deal.amount),
          deadline: new Date(Number(deal.deadline) * 1000),
          isCompleted: deal.isCompleted,
          isRefunded: deal.isRefunded,
        });
      }

      setDeals(loadedDeals);
    } catch (error) {
      console.error('Error loading deals:', error);
    }
  };

  const completeDeal = async (dealId: number) => {
    if (!walletClient || !publicClient) return;

    try {
      const contract = getContract({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        client: { public: publicClient, wallet: walletClient },
      });

      const hash = await contract.write.completeDeal([BigInt(dealId)]);
      await publicClient.waitForTransactionReceipt({ hash });
      await loadDeals();
    } catch (error) {
      console.error('Error completing deal:', error);
    }
  };

  const refundDeal = async (dealId: number) => {
    if (!walletClient || !publicClient) return;

    try {
      const contract = getContract({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        client: { public: publicClient, wallet: walletClient },
      });

      const hash = await contract.write.refundDeal([BigInt(dealId)]);
      await publicClient.waitForTransactionReceipt({ hash });
      await loadDeals();
    } catch (error) {
      console.error('Error refunding deal:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Active Deals</h2>
      <div className="space-y-4">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="border p-4 rounded-lg"
          >
            <div className="grid grid-cols-2 gap-2">
              <p><strong>Buyer:</strong> {deal.buyer}</p>
              <p><strong>Seller:</strong> {deal.seller}</p>
              <p><strong>Amount:</strong> {deal.amount} AVAX</p>
              <p><strong>Deadline:</strong> {deal.deadline.toLocaleString()}</p>
            </div>
            {!deal.isCompleted && !deal.isRefunded && (
              <div className="mt-4 space-x-4">
                <button
                  onClick={() => completeDeal(deal.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Complete Deal
                </button>
                <button
                  onClick={() => refundDeal(deal.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Refund Deal
                </button>
              </div>
            )}
            {deal.isCompleted && (
              <p className="mt-2 text-green-500">Deal Completed</p>
            )}
            {deal.isRefunded && (
              <p className="mt-2 text-red-500">Deal Refunded</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 