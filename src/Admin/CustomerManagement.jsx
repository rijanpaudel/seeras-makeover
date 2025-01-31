import React from "react";
import { useState } from "react";

const CustomerManagement = () => {
  const [customers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '9876543210', bookings: 5 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '9876543211', bookings: 3 }
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
        <div className="flex gap-4">
          <input type="text" placeholder="Search customers..." className="border rounded px-4 py-2" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Customer</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Bookings</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map(customer => (
              <tr key={customer.id}>
                <td className="px-6 py-4">{customer.name}</td>
                <td className="px-6 py-4">{customer.email}</td>
                <td className="px-6 py-4">{customer.phone}</td>
                <td className="px-6 py-4">{customer.bookings}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerManagement;