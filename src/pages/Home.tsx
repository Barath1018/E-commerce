import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Download, Code, FileVideo } from 'lucide-react';
import products, { Product } from '../data/products';
import FeaturedProducts from '../components/FeaturedProducts';

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 rounded-3xl overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Digital Resources for Creators
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Discover high-quality presets, templates, and courses to elevate your creative projects.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Browse Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
          <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent" />
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Play className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Video Resources</h3>
            <p className="text-gray-600 mb-4">
              Professional presets, overlays, and effects for your video projects.
            </p>
            <Link
              to="/products?category=video"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Explore Video Resources →
            </Link>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <FileVideo className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Courses</h3>
            <p className="text-gray-600 mb-4">
              Professional presets, overlays, and effects for your video projects.
            </p>
            <Link
              to="/products?category=video"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Explore courses →
            </Link>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Code className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Development Tools</h3>
            <p className="text-gray-600 mb-4">
              Code templates, snippets, and development resources.
            </p>
            <Link
              to="/products?category=development"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              View Development Tools →
            </Link>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Download className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sound Packs</h3>
            <p className="text-gray-600 mb-4">
              High-quality sound effects and music for your projects.
            </p>
            <Link
              to="/products?category=audio"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Browse Sound Packs →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />


      {/* Call to Action */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Creating?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of creators who trust our digital resources to enhance their projects.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Get Started Now
        </button>
      </section>
    </div>
  );
}