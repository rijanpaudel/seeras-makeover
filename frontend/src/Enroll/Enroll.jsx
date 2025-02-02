import React, { useState } from 'react';

// Mock data for courses
const initialCourses = [
  {
    id: 1,
    title: 'Professional Makeup Course',
    duration: '6 Weeks',
    modules: [
      'Basic Skin Preparation',
      'Color Theory & Correction',
      'Day & Evening Makeup',
      'Bridal Makeup Techniques'
    ],
    description: 'Master professional makeup techniques for various occasions',
    progress: 0
  },
  {
    id: 2,
    title: 'Advanced Hair Styling',
    duration: '4 Weeks',
    modules: [
      'Hair Cutting Techniques',
      'Coloring & Highlighting',
      'Modern Styling Methods',
      'Hair Care Treatments'
    ],
    description: 'Comprehensive training in modern hair styling methods',
    progress: 0
  }
];

const Enroll = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const handleEnroll = (courseId) => {
    const courseToEnroll = courses.find(course => course.id === courseId);
    setEnrolledCourses([...enrolledCourses, { ...courseToEnroll, enrolledDate: new Date().toLocaleDateString() }]);
    setCourses(courses.filter(course => course.id !== courseId));
  };

  const updateProgress = (courseId, moduleIndex) => {
    setEnrolledCourses(prevCourses => 
      prevCourses.map(course => {
        if (course.id === courseId) {
          const updatedModules = [...course.modules];
          updatedModules[moduleIndex] = {
            ...updatedModules[moduleIndex],
            completed: !updatedModules[moduleIndex]?.completed
          };
          
          const completedCount = updatedModules.filter(module => module.completed).length;
          const progress = Math.round((completedCount / updatedModules.length) * 100);
          
          return { ...course, modules: updatedModules, progress };
        }
        return course;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Beauty Courses
        </h1>

        {/* Available Courses Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Available Courses</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-pink-600">
                    Duration: {course.duration}
                  </span>
                </div>
                <button 
                  onClick={() => handleEnroll(course.id)}
                  className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition-colors"
                >
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Enrolled Courses Section */}
        {enrolledCourses.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">My Courses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {enrolledCourses.map(course => (
                <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">
                        Enrolled on: {course.enrolledDate}
                      </p>
                    </div>
                    <span className="text-pink-600 font-semibold">
                      {course.progress}% Completed
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-pink-600 h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>

                  {/* Course Modules */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Course Modules:</h4>
                    {course.modules.map((module, index) => (
                      <label 
                        key={index} 
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={module.completed || false}
                          onChange={() => updateProgress(course.id, index)}
                          className="form-checkbox h-5 w-5 text-pink-600 rounded"
                        />
                        <span className={`text-gray-600 ${module.completed ? 'line-through text-gray-400' : ''}`}>
                          {typeof module === 'string' ? module : module.content}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Enroll;