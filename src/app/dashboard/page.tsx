'use client';

import { useEffect, useState, ComponentType } from 'react';
import { ArrowUp, ArrowDown, Users, ShoppingCart, CreditCard, Package, Star, TrendingUp } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  householdSize: number;
  createdAt: string;
}

interface DashboardStats {
  dailySales: number;
  monthlySales: number;
  yearlySales: number;
  totalMembers: number;
  activePurchases: number;
  pendingCredits: number;
  inventoryItems: number;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ComponentType<{ className?: string }>;
  trend: 'up' | 'down';
  trendValue: number;
  color: string;
}

interface QuickActionCardProps {
  title: number | string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
}

export default function Dashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    dailySales: 249.95,
    monthlySales: 2942.32,
    yearlySales: 8638.32,
    totalMembers: 0,
    activePurchases: 45,
    pendingCredits: 12,
    inventoryItems: 23
  });
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
        setStats(prev => ({ ...prev, totalMembers: data.length }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // Action handlers
  const renewRation = async (memberId: string) => {
    try {
      const response = await fetch('/api/ration-cards/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          year: new Date().getFullYear(),
          allowance: { beans: 100, maize: 200, millet: 150 },
        }),
      });
      if (!response.ok) throw new Error('Failed to renew ration card');
      alert('Ration card renewed successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const sellProduce = async (memberId: string) => {
    const quantity = prompt('Enter quantity to sell (kg):');
    if (!quantity || isNaN(Number(quantity))) return alert('Invalid quantity');
    
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          branchId: '66dc7b8e4f8b9a2c3d4e5f6a',
          itemId: '66dc7b8e4f8b9a2c3d4e5f6b',
          quantity: Number(quantity),
        }),
      });
      if (!response.ok) throw new Error('Failed to record sale');
      alert('Produce sold successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

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
          branchId: '66dc7b8e4f8b9a2c3d4e5f6a',
          itemId: '66dc7b8e4f8b9a2c3d4e5f6c',
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
          remaining: Number(amount),
        }),
      });
      if (!response.ok) throw new Error('Failed to request credit');
      alert('Credit requested successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: StatCardProps) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-gray-600 font-medium">{title}</h5>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-light text-gray-900 flex items-center">
          {trend === 'up' ? (
            <ArrowUp className="w-6 h-6 text-green-500 mr-2" />
          ) : (
            <ArrowDown className="w-6 h-6 text-red-500 mr-2" />
          )}
          {typeof value === 'number' && value > 1000 ? `$${value.toLocaleString()}` : value}
        </h3>
        <p className="text-sm text-gray-500">{trendValue}%</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
        <div 
          className={`h-2 rounded-full ${trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
          style={{ width: `${trendValue}%` }}
        />
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color }: QuickActionCardProps) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="text-center">
          <h6 className="text-xs text-gray-500 mb-2">Target: 35,098</h6>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '60%' }} />
          </div>
        </div>
        <div className="text-center">
          <h6 className="text-xs text-gray-500 mb-2">Duration: 350</h6>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '45%' }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            Dashboard &gt; <span className="text-gray-900 font-medium">Community Store</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Community Store Management</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Daily Sales"
            value={stats.dailySales}
            icon={TrendingUp}
            trend="up"
            trendValue={67}
            color="text-green-500"
          />
          <StatCard
            title="Monthly Sales"
            value={stats.monthlySales}
            icon={ArrowDown}
            trend="down"
            trendValue={36}
            color="text-red-500"
          />
          <StatCard
            title="Yearly Sales"
            value={stats.yearlySales}
            icon={ArrowUp}
            trend="up"
            trendValue={80}
            color="text-green-500"
          />
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <QuickActionCard
            title={stats.totalMembers}
            description="Total Members"
            icon={Users}
            color="bg-blue-500"
          />
          <QuickActionCard
            title={stats.activePurchases}
            description="Active Purchases"
            icon={ShoppingCart}
            color="bg-purple-500"
          />
          <QuickActionCard
            title={stats.pendingCredits}
            description="Pending Credits"
            icon={CreditCard}
            color="bg-yellow-500"
          />
        </div>

        {/* Community Rating Card */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h5 className="text-gray-600 font-medium mb-4">Community Rating</h5>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-light text-gray-900 flex items-center">
                4.7
                <Star className="w-4 h-4 text-yellow-500 ml-2 fill-current" />
              </h2>
              <h6 className="flex items-center text-green-500">
                0.4
                <ArrowUp className="w-5 h-5 ml-1" />
              </h6>
            </div>
            
            {[5, 4, 3, 2, 1].map((rating, index) => (
              <div key={rating} className="flex items-center justify-between gap-2 mb-3">
                <h6 className="flex items-center text-sm text-gray-600">
                  <Star className="w-3 h-3 text-yellow-500 mr-2 fill-current" />
                  {rating}
                </h6>
                <h6 className="text-sm text-gray-500">{[384, 145, 24, 1, 0][index]}</h6>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h5 className="text-gray-900 font-semibold">Recent Members</h5>
            </div>
            <div className="p-6">
              {loading && <p className="text-gray-500">Loading members...</p>}
              {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    {members.slice(0, 5).map((member, index) => (
                      <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 pr-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                            index % 3 === 0 ? 'bg-blue-500' : index % 3 === 1 ? 'bg-green-500' : 'bg-purple-500'
                          }`}>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </td>
                        <td className="py-4">
                          <h6 className="font-semibold text-gray-900 mb-1">{member.name}</h6>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </td>
                        <td className="py-4">
                          <h6 className="text-sm text-gray-500 flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-3 ${index % 2 === 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                            Household: {member.householdSize}
                          </h6>
                        </td>
                        <td className="py-4 space-x-2">
                          <button
                            onClick={() => renewRation(member.id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 transition-colors"
                          >
                            Renew Ration
                          </button>
                          <button
                            onClick={() => sellProduce(member.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600 transition-colors"
                          >
                            Sell Produce
                          </button>
                          <button
                            onClick={() => purchaseConsumable(member.id)}
                            className="bg-purple-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-purple-600 transition-colors"
                          >
                            Purchase
                          </button>
                          <button
                            onClick={() => requestCredit(member.id)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-yellow-600 transition-colors"
                          >
                            Credit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {members.length === 0 && !loading && !error && (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No members found. Start by adding some members to your community store.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Guidelines Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h5 className="text-gray-900 font-semibold mb-4">Community Store Guidelines</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <p>Members can sell minimum 50% of household ration (grains only)</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <p>Automated branches with wholesale prices for members</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <p>Annual ration cards with automated renewal</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <p>Credit facility available at market prices</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <p>No ration carry-forward at year end</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <p>Manual backup system maintained</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}