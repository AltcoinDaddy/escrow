'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { CreateDeal } from '@/components/CreateDeal';
import { DealsList } from '@/components/DealsList';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Decentralized Escrow</h1>
        
        {!isConnected ? (
          <div className="text-center">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => connect({ connector: connectors[0] })}
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p>Connected: {address}</p>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => disconnect()}
              >
                Disconnect
              </button>
            </div>
            <CreateDeal />
            <DealsList />
          </>
        )}
      </div>
    </main>
  );
} 