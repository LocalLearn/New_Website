import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, BookOpen, Users, Puzzle, ArrowRight } from 'lucide-react';

function CourseCard({ 
  title, 
  description, 
  meetupLink, 
  startLink, 
  icon: Icon 
}: { 
  title: string;
  description: string;
  meetupLink?: string;
  startLink: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Icon className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-semibold text-purple-600">
            {title}
          </h3>
        </div>
        <p className="text-gray-600 leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {meetupLink && (
            <a
              href={meetupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors"
            >
              <span className="text-sm font-medium">Learn More</span>
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          )}
          <Link
            to={startLink}
            className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors"
          >
            <span className="text-sm font-medium">Start Learning</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function PathSection({ title, description, children }: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-12 first:pt-0 last:pb-0">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {description}
        </p>
      </div>
      <div className="max-w-3xl mx-auto space-y-8">
        {children}
      </div>
    </section>
  );
}

function CoursesPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Courses</h1>
          <p className="text-lg text-gray-600">
            Choose your learning path and start your coding journey
          </p>
        </div>

        <div className="space-y-16">
          <PathSection
            title="Standard Path"
            description="Structured learning paths with guided tutorials and interactive lessons"
          >
            <CourseCard
              title="Python Pilot"
              description="Discover the power of Python in just four lessons with this fast-paced pilot course covering essential programming foundations—from syntax and control flow to loops, functions, and variable scope."
              meetupLink="https://www.meetup.com/south-bay-local-learning/events/306392354/?eventOrigin=group_featured_event"
              startLink="/python-pilot"
              icon={BookOpen}
            />
          </PathSection>

          <hr className="border-gray-200" />

          <PathSection
            title="Project Path"
            description="Self-directed learning through hands-on projects and collaborative development"
          >
            <CourseCard
              title="Community Project Builder"
              description="Learn the essentials of project planning and collaboration. Master the art of breaking down complex projects into manageable tasks, explore effective group dynamics, and develop real-world applications with your peers."
              startLink="/project-builder"
              icon={Users}
            />
          </PathSection>
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;