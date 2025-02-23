import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      title: "Task Organization",
      description: "Create, organize, and prioritize tasks with our intuitive interface"
    },
    {
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time updates and comments"
    },
    {
      title: "Progress Tracking",
      description: "Monitor project progress with visual boards and status updates"
    },
    {
      title: "Deadline Management",
      description: "Stay on top of deadlines with reminders and calendar integration"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Manage Your Tasks{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Efficiently
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Streamline your workflow, collaborate with team members, and track progress
              all in one powerful platform.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need to manage tasks effectively
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <CheckCircle2 className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-300 mb-8">
              Join thousands of teams already using our platform
            </p>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-blue-600 font-bold hover:bg-white hover:text-gray-900">
                Start for Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;