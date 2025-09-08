'use client';

import { useEffect, useState } from 'react';

interface Member {
  id: string;
  name: string;
  email: string;
  householdSize: number;
}

export default function Dashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch members on mount
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/members');
        if (!res.ok) throw new Error('Failed to fetch members');
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // Renew ration card
  const renewRation = async (memberId: string) => {
    try {
      const response = await fetch('/api/ration-cards/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          year: new Date().getFullYear(),
          allowance: { beans: 100, maize: 200, millet: 150 }, // Example allowance in kg
        }),
      });
      if (!response.ok) throw new Error('Failed to renew ration card');
      alert('Ration card renewed successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Sell produce
  const sellProduce = async (memberId: string) => {
    const quantity = prompt('Enter quantity to sell (kg):');
    if (!quantity || isNaN(Number(quantity))) return alert('Invalid quantity');
    
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          branchId: '66dc7b8e4f8b9a2c3d4e5f6a', // Example branch ID
          itemId: '66dc7b8e4f8b9a2c3d4e5f6b', // Example item ID (e.g., beans)
          quantity: Number(quantity),
        }),
      });
      if (!response.ok) throw new Error('Failed to record sale');
      alert('Produce sold successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Purchase consumables
  const purchaseConsumable = async (memberId: string) => {
    const quantity = prompt('Enter quantity to purchase (kg/unit):');
    const useCredit = confirm('Use credit for this purchase?');
    if (!quantity || isNaN(Number(quantity))) return alert('Invalid quantity');

    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          branchId: '66dc7b8e4f8b9a2c3d4e5f6a', // Example branch ID
          itemId: '66dc7b8e4f8b9a2c3d4e5f6c', // Example item ID (e.g., soap)
          quantity: Number(quantity),
          useCredit,
        }),
      });
      if (!response.ok) throw new Error('Failed to record purchase');
      alert('Purchase recorded successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Request credit
  const requestCredit = async (memberId: string) => {
    const amount = prompt('Enter credit amount to request:');
    if (!amount || isNaN(Number(amount))) return alert('Invalid amount');

    try {
      const response = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          amount: Number(amount),
          remaining: Number(amount), // Initial remaining = requested amount
        }),
      });
      if (!response.ok) throw new Error('Failed to request credit');
      alert('Credit requested successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Community Store Management</h1>
      {loading && <p>Loading members...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Household Size</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member.id}>
              <td className="border px-4 py-2">{member.name}</td>
              <td className="border px-4 py-2">{member.email}</td>
              <td className="border px-4 py-2">{member.householdSize}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  onClick={() => renewRation(member.id)}
                >
                  Renew Ration
                </button>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  onClick={() => sellProduce(member.id)}
                >
                  Sell Produce
                </button>
                <button
                  className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                  onClick={() => purchaseConsumable(member.id)}
                >
                  Purchase
                </button>
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  onClick={() => requestCredit(member.id)}
                >
                  Request Credit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}