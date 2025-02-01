import React from "react";
import { useState } from "react";

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    { id: 1, title: 'Professional Makeup', duration: '6 Weeks', students: 15 },
    { id: 2, title: 'Advanced Hair Styling', duration: '4 Weeks', students: 8 }
  ]);
  const [newCourse, setNewCourse] = useState({ title: '', duration: '', description: '' });

  const handleAddCourse = (e) => {
    e.preventDefault();
    setCourses([...courses, { ...newCourse, id: courses.length + 1, students: 0 }]);
    setNewCourse({ title: '', duration: '', description: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Course</h2>
        <form onSubmit={handleAddCourse} className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Course Title"
            className="border rounded px-4 py-2"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Duration"
            className="border rounded px-4 py-2"
            value={newCourse.duration}
            onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Course
          </button>
        </form>
      </div>

      <div className="grid gap-4">
        {courses.map(course => (
          <div key={course.id} className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-gray-600">{course.duration} • {course.students} students enrolled</p>
            </div>
            <div className="space-x-2">
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
              <button className="text-red-600 hover:text-red-800">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseManagement;