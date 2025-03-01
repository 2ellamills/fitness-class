import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CreditCard, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Book Your Next Fitness Class
            </h1>
            <p className="mt-4 text-xl max-w-3xl mx-auto">
              Join our community and transform your fitness journey with our expert-led classes.
            </p>
            {!currentUser && (
              <div className="mt-8 flex justify-center">
                <Link
                  to="/register"
                  className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:text-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="ml-4 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 md:text-lg"
                >
                  Login
                </Link>
              </div>
            )}
            {currentUser && (
              <div className="mt-8 flex justify-center">
                <Link
                  to="/classes"
                  className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:text-lg"
                >
                  Browse Classes
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our simple booking system makes it easy to find and join the perfect class for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <CreditCard className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Purchase a Pass</h3>
            <p className="text-gray-600 text-center">
              Choose from single classes, multi-class packs, or unlimited monthly passes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Calendar className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Book Your Class</h3>
            <p className="text-gray-600 text-center">
              Browse available classes and book with just a few clicks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Join the Community</h3>
            <p className="text-gray-600 text-center">
              Attend classes and connect with like-minded fitness enthusiasts.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-indigo-600 rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:p-12 text-center md:text-left">
              <div className="md:flex md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    Ready to start your fitness journey?
                  </h2>
                  <p className="mt-3 max-w-3xl text-lg text-indigo-200">
                    Join our community today and get access to expert-led classes.
                  </p>
                </div>
                <div className="mt-8 md:mt-0">
                  <Link
                    to={currentUser ? "/classes" : "/register"}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50"
                  >
                    {currentUser ? "Browse Classes" : "Sign Up Now"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;