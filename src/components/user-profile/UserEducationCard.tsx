"use client";
import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function UserEducationCard() {
  const { user } = useAuth();

  return (
    <div className="p-5 border bg-blue-50 dark:bg-gray-600 border-gray-200 rounded-2xl shadow-xl mb-6 dark:border-gray-800 lg:p-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
        Education & Skills
      </h4>

      {/* Formal Education */}
      <div className="mb-8">
        <h5 className="text-md font-semibold text-gray-700 dark:text-white/80 mb-4">
          Formal Education
        </h5>
        {user?.formalEducations && user.formalEducations.length > 0 ? (
          <div className="space-y-4">
            {user.formalEducations.map((education, index) => (
              <div key={education.id || index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h6 className="font-semibold text-gray-800 dark:text-white/90">
                      {education.level}
                    </h6>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {education.schoolName}
                    </p>
                    {education.major && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Major: {education.major}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 lg:mt-0 lg:text-right">
                    {education.yearGraduate && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Graduated: {education.yearGraduate}
                      </p>
                    )}
                    {education.gpa && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        GPA: {education.gpa}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No formal education data</p>
        )}
      </div>

      {/* Non-Formal Education */}
      <div className="mb-8">
        <h5 className="text-md font-semibold text-gray-700 dark:text-white/80 mb-4">
          Non-Formal Education & Certifications
        </h5>
        {user?.nonFormalEducations && user.nonFormalEducations.length > 0 ? (
          <div className="space-y-4">
            {user.nonFormalEducations.map((education, index) => (
              <div key={education.id || index} className="border-l-4 border-green-500 pl-4 py-2">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h6 className="font-semibold text-gray-800 dark:text-white/90">
                      {education.name}
                    </h6>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {education.institution}
                    </p>
                    {education.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {education.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 lg:mt-0">
                    {education.year && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {education.year}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No non-formal education data</p>
        )}
      </div>

      {/* Skills */}
      <div className="mb-8">
        <h5 className="text-md font-semibold text-gray-700 dark:text-white/80 mb-4">
          Skills
        </h5>
        {user?.skills && user.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No skills data</p>
        )}
      </div>

      {/* Languages */}
      <div className="mb-8">
        <h5 className="text-md font-semibold text-gray-700 dark:text-white/80 mb-4">
          Languages
        </h5>
        {user?.languages && user.languages.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.languages.map((language, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm"
              >
                {language}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No languages data</p>
        )}
      </div>

      {/* Interests */}
      <div>
        <h5 className="text-md font-semibold text-gray-700 dark:text-white/80 mb-4">
          Interests
        </h5>
        {user?.interests && user.interests.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No interests data</p>
        )}
      </div>
    </div>
  );
}
