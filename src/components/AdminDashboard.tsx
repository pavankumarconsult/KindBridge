import React, { useEffect, useState } from 'react';
import { useAuth } from '../firebase/useAuth';
import { subscribeToAllRequests, updateRequestStatus, ServiceRequest } from '../services/requestService';

const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { currentUser, isAdmin } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    if (!isAdmin) return;

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToAllRequests((fetchedRequests) => {
        setRequests(fetchedRequests);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load requests. Please try again.');
      setLoading(false);
    }
  }, [isAdmin]);

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    setUpdating(requestId);
    try {
      await updateRequestStatus(
        requestId,
        newStatus as 'Pending' | 'In Progress' | 'Completed' | 'Rejected'
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700';
      case 'In Progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-300 dark:border-blue-700';
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-300 dark:border-green-700';
      case 'Rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-300 dark:border-red-700';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredRequests = filterStatus === 'All'
    ? requests
    : requests.filter(req => req.status === filterStatus);

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    inProgress: requests.filter(r => r.status === 'In Progress').length,
    completed: requests.filter(r => r.status === 'Completed').length,
    rejected: requests.filter(r => r.status === 'Rejected').length,
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0 4v2M6.343 3.665c.886-.887 2.318-.887 3.203 0l.001.001c.884.888.884 2.319 0 3.203L9.343 9.11a2.848 2.848 0 010 4.03l.204.205c.884.888.884 2.319 0 3.203l-.001.001c-.885.887-2.317.887-3.203 0L3.414 10.586a2.848 2.848 0 010-4.03l2.929-2.891zm11.314 0c.886-.887 2.318-.887 3.203 0l.001.001c.884.888.884 2.319 0 3.203L20.657 9.11a2.848 2.848 0 010 4.03l.204.205c.884.888.884 2.319 0 3.203l-.001.001c-.885.887-2.317.887-3.203 0l-2.929-2.891a2.848 2.848 0 010-4.03l2.929-2.891z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Access Denied
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage all service requests and update their status
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors font-medium"
          >
            Back to Home
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {!loading && (
          <div className="grid gap-4 md:grid-cols-5 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-700 dark:text-yellow-400 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-300">{stats.pending}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-blue-700 dark:text-blue-400 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">{stats.inProgress}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <p className="text-green-700 dark:text-green-400 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-800 dark:text-green-300">{stats.completed}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
              <p className="text-red-700 dark:text-red-400 text-sm font-medium">Rejected</p>
              <p className="text-3xl font-bold text-red-800 dark:text-red-300">{stats.rejected}</p>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['All', 'Pending', 'In Progress', 'Completed', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400">
              {filterStatus === 'All' ? 'No requests found' : `No ${filterStatus} requests`}
            </p>
          </div>
        ) : (
          /* Requests Table */
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Service Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {request.userName}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {request.userEmail}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">
                        {request.serviceType}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {request.description}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={request.status}
                          onChange={(e) => handleStatusChange(request.id, e.target.value)}
                          disabled={updating === request.id}
                          className={`px-3 py-1 rounded-full text-sm font-medium border cursor-pointer transition-opacity ${getStatusColor(
                            request.status
                          )} ${updating === request.id ? 'opacity-50 cursor-not-allowed' : ''} dark:bg-slate-700`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(request.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
