import React from 'react';
import { BookOpen, Users, Map, Sprout } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xl font-bold">
          <span role="img" aria-label="book">📖</span>
          <span>Local Learn</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#" className="text-gray-700 hover:text-purple-600">Login</a>
          <a href="#" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Sign Up
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold leading-tight">
              <span className="text-gray-900">Learn Together,</span>
              <br />
              <span className="text-purple-600">Grow Together</span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Join our AI-driven collaborative learning platform where technology meets human connection. 
              Experience personalized learning paths and meaningful group interactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#" className="bg-purple-600 text-white px-8 py-3 rounded-lg text-center hover:bg-purple-700 transition-colors">
                Get Started
              </a>
              <a href="#" className="bg-purple-100 text-purple-600 px-8 py-3 rounded-lg text-center hover:bg-purple-200 transition-colors">
                Browse Courses
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
              alt="Students learning together"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-purple-600 font-semibold tracking-wide uppercase mb-4">Features</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">A better way to learn</h2>
            <p className="text-gray-600 text-lg">
              Our platform combines AI-powered personalization with human connection to create an optimal learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: 'AI-Driven Learning',
                description: 'Personalized learning paths adapted to your unique style and pace.'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Collaborative Sessions',
                description: 'Learn together in small groups of 4–8 students at convenient locations.'
              },
              {
                icon: <Map className="w-8 h-8" />,
                title: 'Flexible Locations',
                description: 'Meet at coffee shops, libraries, or any public space that works for your group.'
              },
              {
                icon: <Sprout className="w-8 h-8" />,
                title: 'Smart Course Creation',
                description: 'Courses automatically form when enough students share your interests.'
              }
            ].map((feature, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;