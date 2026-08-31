import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import itemService from '../services/itemService';
import requestService from '../services/requestService';
import { fetchMyItemsSuccess } from '../redux/itemSlice';
import { fetchRequestsSuccess } from '../redux/requestSlice';
import Loader from '../components/common/Loader';
import ItemCard from '../components/items/ItemCard';
import RequestStatusBadge from '../components/requests/RequestStatusBadge';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myItems } = useSelector((state) => state.items);
  const { myRequests, incomingRequests } = useSelector((state) => state.requests);
  
  const [activeTab, setActiveTab] = useState('my-items');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [itemsRes, myReqRes, incomingReqRes] = await Promise.all([
        itemService.getUserItems(user.id),
        requestService.getRequests(null, 1, 100, 'borrower'),
        requestService.getRequests(null, 1, 100, 'owner'),
      ]);

      dispatch(fetchMyItemsSuccess(itemsRes));
      dispatch(fetchRequestsSuccess({ ...myReqRes, role: 'borrower' }));
      dispatch(fetchRequestsSuccess({ ...incomingReqRes, role: 'owner' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await itemService.deleteItem(itemId);
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      await requestService.updateRequestStatus(requestId, newStatus);
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}! 👋</p>
      </div>

      {error && (
        <div className="bg-danger bg-opacity-10 border border-danger text-danger px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        {[
          { id: 'my-items', label: '📦 My Listed Items', badge: myItems.length },
          { id: 'my-requests', label: '📋 My Borrow Requests', badge: myRequests.length },
          { id: 'incoming', label: '🔔 Requests on My Items', badge: incomingRequests.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-semibold whitespace-nowrap transition border-b-2 ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-primary'
            }`}
          >
            {tab.label} ({tab.badge})
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'my-items' && (
        <div>
          <Link
            to="/add-item"
            className="inline-block mb-6 bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            + List New Item
          </Link>

          {myItems.length === 0 ? (
            <p className="text-center text-gray-500">You haven't listed any items yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.map((item) => (
                <div key={item._id} className="relative">
                  <ItemCard item={item} />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Link
                      to={`/edit-item/${item._id}`}
                      className="bg-primary text-white p-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      <FiEdit2 size={16} />
                    </Link>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="bg-danger text-white p-2 rounded-lg hover:bg-red-600 transition"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'my-requests' && (
        <div>
          {myRequests.length === 0 ? (
            <p className="text-center text-gray-500">You haven't made any requests yet</p>
          ) : (
            <div className="space-y-4">
              {myRequests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{request.itemId?.title}</h3>
                      <p className="text-gray-600">Owner: {request.ownerId?.name}</p>
                    </div>
                    <RequestStatusBadge status={request.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500">Requested on</p>
                      <p className="font-semibold">{new Date(request.requestedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Due date</p>
                      <p className="font-semibold">{new Date(request.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {request.status === 'requested' && (
                    <button
                      onClick={() => handleUpdateStatus(request._id, 'picked_up')}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Mark as Picked Up
                    </button>
                  )}

                  {request.status === 'picked_up' && (
                    <button
                      onClick={() => handleUpdateStatus(request._id, 'returned')}
                      className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                      Mark as Returned
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'incoming' && (
        <div>
          {incomingRequests.length === 0 ? (
            <p className="text-center text-gray-500">No pending requests on your items</p>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{request.itemId?.title}</h3>
                      <p className="text-gray-600">Borrower: {request.borrowerId?.name}</p>
                    </div>
                    <RequestStatusBadge status={request.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500">Requested on</p>
                      <p className="font-semibold">{new Date(request.requestedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Due date</p>
                      <p className="font-semibold">{new Date(request.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {request.notes && (
                    <p className="text-gray-600 italic mb-4">Notes: {request.notes}</p>
                  )}

                  {request.status === 'requested' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(request._id, 'approved')}
                        className="flex-1 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(request._id, 'rejected')}
                        className="flex-1 bg-danger text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {request.status === 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(request._id, 'picked_up')}
                      className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Mark as Picked Up
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
