import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { useInterestStore } from '../store/useInterestStore';

interface InterestsSelectionProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
}

const MAX_INTERESTS = 10;
const MAX_INTEREST_LENGTH = 30;

export function InterestsSelection({ selectedInterests, onInterestsChange }: InterestsSelectionProps) {
  const { 
    interests, 
    loading, 
    error, 
    fetchInterests, 
    createInterest, 
    addUserInterest,
    removeUserInterest 
  } = useInterestStore();
  
  const [newInterest, setNewInterest] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    fetchInterests();
  }, [fetchInterests]);

  // Get popular interests (sorted by frequency)
  const popularInterests = [...interests].sort((a, b) => {
    const aCount = interests.filter(i => i.id === a.id).length;
    const bCount = interests.filter(i => i.id === b.id).length;
    return bCount - aCount;
  });

  const handleInterestSelect = async (interestId: string) => {
    try {
      setValidationError(null);
      
      if (selectedInterests.length >= MAX_INTERESTS && !selectedInterests.includes(interestId)) {
        setValidationError(`You can only select up to ${MAX_INTERESTS} interests`);
        return;
      }

      if (selectedInterests.includes(interestId)) {
        await removeUserInterest(interestId);
        onInterestsChange(selectedInterests.filter(id => id !== interestId));
      } else {
        await addUserInterest(interestId);
        onInterestsChange([...selectedInterests, interestId]);
      }
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Failed to update interest');
    }
  };

  const handleNewInterestSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const trimmedInterest = newInterest.trim();
    
    if (!trimmedInterest) return;
    
    if (trimmedInterest.length > MAX_INTEREST_LENGTH) {
      setValidationError(`Interest name cannot exceed ${MAX_INTEREST_LENGTH} characters`);
      return;
    }

    try {
      setIsAdding(true);
      setValidationError(null);
      
      // Create new interest
      const interest = await createInterest(trimmedInterest);
      
      // Add to user's interests if not already selected
      if (!selectedInterests.includes(interest.id)) {
        await addUserInterest(interest.id);
        onInterestsChange([...selectedInterests, interest.id]);
      }
      
      setNewInterest('');
      await fetchInterests(); // Refresh the interests list
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Failed to add interest');
    } finally {
      setIsAdding(false);
    }
  };

  const remainingInterests = MAX_INTERESTS - selectedInterests.length;

  return (
    <div className="space-y-4">
      {/* Selected Interests Tags */}
      <div className="flex flex-wrap gap-2">
        {interests
          .filter(interest => selectedInterests.includes(interest.id))
          .map(interest => (
            <span
              key={interest.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
            >
              {interest.name}
              <button
                type="button"
                onClick={() => handleInterestSelect(interest.id)}
                className="p-0.5 hover:bg-purple-200 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
      </div>

      {/* Interests Counter */}
      <div className="text-sm text-gray-600">
        {remainingInterests} interest{remainingInterests !== 1 ? 's' : ''} remaining
      </div>

      {/* Add New Interest Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          placeholder="Enter your interests (e.g., Python, React, C++)"
          maxLength={MAX_INTEREST_LENGTH}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
          disabled={isAdding || selectedInterests.length >= MAX_INTERESTS}
        />
        <button
          type="button"
          onClick={handleNewInterestSubmit}
          disabled={isAdding || !newInterest.trim() || selectedInterests.length >= MAX_INTERESTS}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Error Messages */}
      {(error || validationError) && (
        <p className="text-sm text-red-600">
          {error || validationError}
        </p>
      )}

      {/* Popular Interests */}
      {!loading && popularInterests.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Interests</h4>
          <div className="flex flex-wrap gap-2">
            {popularInterests.map(interest => (
              <button
                type="button"
                key={interest.id}
                onClick={() => handleInterestSelect(interest.id)}
                disabled={selectedInterests.length >= MAX_INTERESTS && !selectedInterests.includes(interest.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedInterests.includes(interest.id)
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {interest.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        </div>
      )}
    </div>
  );
}