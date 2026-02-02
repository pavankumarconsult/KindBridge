import React, { useEffect, useState } from 'react';
import { useAuth } from '../firebase/useAuth';
import { subscribeToUserRequests, ServiceRequest } from '../services/requestService';

const MyRequests: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToUserRequests(currentUser.uid, (fetchedRequests) => {
        setRequests(fetchedRequests);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load your requests. Please try again.');
      setLoading(false);
    }
  }, [currentUser]);

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

  const getStatusDotColor = (status: string): string => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-400';
      case 'In Progress':
        return 'bg-blue-400';
      case 'Completed':
        return 'bg-green-400';
      case 'Rejected':
        return 'bg-red-400';
      default:
        return 'bg-slate-400';
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              My Requests
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Track the status of all your service requests
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

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading your requests...</p>
          </div>
        ) : requests.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-slate-400 dark:text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No Requests Yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              You haven't submitted any service requests yet. Start by submitting your first request!
            </p>
            <a
              href="#request"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Submit a Request
            </a>
          </div>
        ) : (
          /* Requests Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-slate-900/50 transition-shadow overflow-hidden"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                      request.status
                    )}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${getStatusDotColor(request.status)}`}></span>
                    {request.status}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(request.createdAt)}
                  </span>
                </div>

                {/* Service Type */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {request.serviceType}
                </h3>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                  {request.description}
                </p>

                {/* Footer */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Request ID: <span className="font-mono">{request.id.slice(0, 8)}...</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
