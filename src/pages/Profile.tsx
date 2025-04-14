import React from 'react';
import { User, Settings, ShoppingBag, Heart } from 'lucide-react';

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-blue-100 p-4 rounded-full">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">user@example.com</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-gray-900">John Doe</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <ShoppingBag className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
            </div>
            <p className="text-gray-600">View your recent orders and track shipments</p>
            <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
              View Orders →
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Wishlist</h2>
            </div>
            <p className="text-gray-600">Browse your saved items and wishlists</p>
            <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
              View Wishlist →
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
            </div>
            <p className="text-gray-600">Customize your shopping experience</p>
            <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
              Manage Preferences →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;