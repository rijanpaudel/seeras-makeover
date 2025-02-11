import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";

const CustomerManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/all-users");
        setUsers(response.data);
      } catch (error) {
        setError("Failed to load users.");
      }
      finally{
        setLoading(false);
      }
    };

    fetchUsers();
  }, [])

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

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
               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Address</th>
              {/*<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Bookings</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4">{user.fullName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phoneNumber}</td>
                <td className="px-6 py-4">{user.address}</td>
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