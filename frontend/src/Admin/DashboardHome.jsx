import React from "react";

const DashboardHome = () => {
  const stats = [
    { title: 'Total Appointments', value: '245', color: 'bg-blue-100' },
    { title: 'Active Customers', value: '1,234', color: 'bg-green-100' },
    { title: 'Staff Members', value: '15', color: 'bg-purple-100' },
    { title: 'Ongoing Courses', value: '8', color: 'bg-yellow-100' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`p-6 rounded-lg ${stat.color}`}>
            <h3 className="text-gray-500 text-sm">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;