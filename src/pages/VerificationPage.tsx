import React from 'react';
import { Mail } from 'lucide-react';

function VerificationPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div 
          className="mx-auto h-24 w-24 bg-purple-100 rounded-full flex items-center justify-center animate-fade-in"
        >
          <Mail className="h-12 w-12 text-purple-600" />
        </div>
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Check your inbox!
          </h1>
          
          <div className="space-y-4 text-gray-600">
            <p className="text-lg">
              We just sent you a confirmation email.
            </p>
            <p>
              Click the link inside to verify your account, and you'll be automatically redirected back here to log in with your email and password.
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
}

export default VerificationPage;