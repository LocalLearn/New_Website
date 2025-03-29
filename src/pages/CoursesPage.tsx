import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

function CoursesPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Courses</h1>
          <p className="text-lg text-gray-600">
            Browse available courses or check your enrolled courses
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-purple-600 mb-3">
                Python Pilot
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Discover the power of Python in just four lessons with this fast-paced pilot course covering essential programming foundations—from syntax and control flow to loops, functions, and variable scope.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <a
                  href="https://www.meetup.com/south-bay-local-learning/events/306392354/?eventOrigin=group_featured_event"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <span className="text-sm font-medium">Learn More</span>
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
                <Link
                  to="/python-pilot"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <span className="text-sm font-medium">Start Learning</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;