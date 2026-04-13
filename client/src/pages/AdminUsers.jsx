import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Users, Search, Filter, Plus, UserCheck, UserX } from 'lucide-react';

export default function AdminUsers() {
  const users = [
    { id: 1, name: 'Dr. John Smith', email: 'john@example.com', role: 'FACULTY', status: 'Active', department: 'Computer Science' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'STUDENT', status: 'Active', department: 'Computer Science' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'STUDENT', status: 'Active', department: 'Electronics' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'FACULTY', status: 'Active', department: 'Mathematics' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'STUDENT', status: 'Inactive', department: 'Computer Science' },
  ];

  const getRoleBadge = (role) => {
    const colors = {
      ADMIN: 'bg-red-500/10 text-red-500 border-red-500/20',
      FACULTY: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      STUDENT: 'bg-green-500/10 text-green-500 border-green-500/20',
    };
    return colors[role] || colors.STUDENT;
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
                <p className="text-gray-400">Manage all system users and permissions</p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                <Plus size={20} />
                Add New User
              </button>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-white">1,245</p>
                  </div>
                  <Users className="text-blue-500" size={32} />
                </div>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Active Users</p>
                    <p className="text-3xl font-bold text-green-500">1,198</p>
                  </div>
                  <UserCheck className="text-green-500" size={32} />
                </div>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Inactive Users</p>
                    <p className="text-3xl font-bold text-red-500">47</p>
                  </div>
                  <UserX className="text-red-500" size={32} />
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search users by name, email, or department..."
                  className="w-full pl-12 pr-4 py-3 bg-[#1a1f2e] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button className="px-6 py-3 bg-[#1a1f2e] border border-gray-800 rounded-xl text-white flex items-center gap-2 hover:bg-gray-800 transition-all">
                <Filter size={20} />
                Filter
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Users className="text-blue-500" size={20} />
                          </div>
                          <span className="text-white font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 border rounded-lg text-sm font-semibold ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{user.department}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          user.status === 'Active' 
                            ? 'bg-green-500/10 text-green-500' 
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
