import React from 'react';
import { Settings, Users, ShoppingBag, BarChart } from 'lucide-react';

function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Users</h3>
              <p className="text-2xl font-bold">1,234</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <ShoppingBag className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">Orders</h3>
              <p className="text-2xl font-bold">856</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <BarChart className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold">Revenue</h3>
              <p className="text-2xl font-bold">$45,678</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <Settings className="w-8 h-8 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold">Settings</h3>
              <p className="text-sm text-gray-500">System Configuration</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'New user registered', time: '5 minutes ago' },
              { action: 'Order #12345 completed', time: '1 hour ago' },
              { action: 'Product inventory updated', time: '2 hours ago' },
              { action: 'System backup completed', time: '4 hours ago' }
            ].map((activity, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                <span>{activity.action}</span>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;