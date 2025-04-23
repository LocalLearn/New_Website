import React from 'react';

interface PersonalInfoStepProps {
  age: string;
  gender: string;
  zipCode: string;
  onChange: (field: string, value: string) => void;
  errors: {
    age?: string;
    gender?: string;
    zipCode?: string;
  };
}

export function PersonalInfoStep({ age, gender, zipCode, onChange, errors }: PersonalInfoStepProps) {
  return (
    <>
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          Age
        </label>
        <input
          type="number"
          id="age"
          value={age}
          onChange={(e) => onChange('age', e.target.value)}
          className={`mt-1 block w-full border ${
            errors.age ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
        />
        {errors.age && (
          <p className="mt-1 text-sm text-red-600">{errors.age}</p>
        )}
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          Gender
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => onChange('gender', e.target.value)}
          className={`mt-1 block w-full border ${
            errors.gender ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
        {errors.gender && (
          <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
        )}
      </div>

      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
          ZIP Code
        </label>
        <input
          type="text"
          id="zipCode"
          value={zipCode}
          onChange={(e) => onChange('zipCode', e.target.value)}
          className={`mt-1 block w-full border ${
            errors.zipCode ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
        />
        {errors.zipCode && (
          <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
        )}
      </div>
    </>
  );
}