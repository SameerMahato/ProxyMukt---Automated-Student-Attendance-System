import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Settings, Database, Shield, Server, HardDrive, Cpu } from 'lucide-react';

export default function AdminSystem() {
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
            >
              <h1 className="text-4xl font-bold text-white mb-2">System Management</h1>
              <p className="text-gray-400">Configure and monitor system settings</p>
            </motion.div>

            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Server Status</p>
                    <p className="text-2xl font-bold text-green-500">Online</p>
                  </div>
                  <Server className="text-green-500" size={32} />
                </div>
                <div className="text-xs text-gray-500">Uptime: 99.9%</div>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Database</p>
                    <p className="text-2xl font-bold text-blue-500">Healthy</p>
                  </div>
                  <Database className="text-blue-500" size={32} />
                </div>
                <div className="text-xs text-gray-500">Storage: 45% used</div>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Security</p>
                    <p className="text-2xl font-bold text-green-500">Secure</p>
                  </div>
                  <Shield className="text-green-500" size={32} />
                </div>
                <div className="text-xs text-gray-500">Last scan: 2 hours ago</div>
              </div>
            </div>

            {/* System Resources */}
            <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Cpu className="text-blue-500" size={24} />
                System Resources
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">CPU Usage</span>
                    <span className="text-white font-semibold">45%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '45%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Memory Usage</span>
                    <span className="text-white font-semibold">62%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '62%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Disk Usage</span>
                    <span className="text-white font-semibold">78%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: '78%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Network Usage</span>
                    <span className="text-white font-semibold">32%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: '32%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Settings className="text-purple-500" size={24} />
                  General Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Maintenance Mode</span>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Auto Backup</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Email Notifications</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Shield className="text-red-500" size={24} />
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Two-Factor Auth</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">IP Whitelist</span>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Audit Logging</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                Save Changes
              </button>
              <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all">
                Restart System
              </button>
              <button className="px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all">
                Run Diagnostics
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
