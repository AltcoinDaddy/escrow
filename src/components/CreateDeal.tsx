'use client';

import { useState } from 'react';
import { useWalletClient, usePublicClient } from 'wagmi';
import { parseEther } from 'viem';
import { ESCROW_ADDRESS } from '@/constants/addresses';
import { getContract, type WalletClient } from 'viem';
import { ESCROW_ABI } from '@/constants/abi';

export function CreateDeal() {
  const [sellerAddress, setSellerAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletClient || !publicClient) return;

    try {
      const contract = getContract({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        client: { public: publicClient, wallet: walletClient },
      }) as unknown as {
        write: {
          createDeal(
            args: [string, bigint],
            options: { value: bigint }
          ): Promise<`0x${string}`>;
        };
      };

      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);
      const hash = await contract.write.createDeal(
        [sellerAddress, BigInt(deadlineTimestamp)],
        { value: parseEther(amount) }
      );
      
      await publicClient.waitForTransactionReceipt({ hash });
      setSellerAddress('');
      setAmount('');
      setDeadline('');
    } catch (error) {
      console.error('Error creating deal:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-4">Create New Deal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Seller Address</label>
          <input
            type="text"
            value={sellerAddress}
            onChange={(e) => setSellerAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0x..."
          />
        </div>
        <div>
          <label className="block mb-2">Amount (AVAX)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            step="0.01"
          />
        </div>
        <div>
          <label className="block mb-2">Deadline</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Create Deal
        </button>
      </form>
    </div>
  );
} 