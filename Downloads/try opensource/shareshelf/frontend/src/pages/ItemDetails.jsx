import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import itemService from '../services/itemService';
import requestService from '../services/requestService';
import Loader from '../components/common/Loader';
import { FiMapPin, FiUser, FiStar } from 'react-icons/fi';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const data = await itemService.getItem(id);
      setItem(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await requestService.createRequest(id, dueDate, notes);
      alert('Borrow request submitted successfully!');
      setShowRequestForm(false);
      setDueDate('');
      setNotes('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-danger bg-opacity-10 border border-danger text-danger px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-gray-500">Item not found</p>
      </div>
    );
  }

  const isOwner = user && user.id === item.ownerId._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images */}
        <div className="lg:col-span-2">
          <div className="bg-gray-200 rounded-lg overflow-hidden h-96 flex items-center justify-center mb-4">
            {item.images && item.images.length > 0 ? (
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl">📦</span>
            )}
          </div>

          {item.images && item.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {item.images.slice(1, 5).map((img, idx) => (
                <div key={idx} className="bg-gray-200 rounded-lg h-20 flex items-center justify-center cursor-pointer hover:opacity-80">
                  <img src={img} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">About this item</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20 space-y-6">
            {/* Title and Status */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
              <div className="flex gap-2">
                <span className="bg-secondary bg-opacity-20 text-secondary px-3 py-1 rounded-full text-sm font-semibold">
                  {item.category}
                </span>
                <span className={`${item.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-3 py-1 rounded-full text-sm font-semibold`}>
                  {item.availability ? '✓ Available' : '✗ Not Available'}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-3 pb-6 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Condition</p>
                <p className="text-lg font-semibold capitalize">{item.condition}</p>
              </div>
              {item.depositAmount > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Deposit Required</p>
                  <p className="text-lg font-semibold">₹{item.depositAmount}</p>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <FiMapPin size={18} />
                <span>{item.location}</span>
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-3">Listed by</p>
              <div className="flex items-center gap-3">
                {item.ownerId.avatar && (
                  <img
                    src={item.ownerId.avatar}
                    alt={item.ownerId.name}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <Link
                    to={`/profile/${item.ownerId._id}`}
                    className="font-semibold hover:text-primary transition"
                  >
                    {item.ownerId.name}
                  </Link>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <FiStar size={14} className="text-warning" />
                    <span>{item.ownerId.trustScore || 50}/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Button */}
            {!isOwner && item.availability && (
              <button
                onClick={() => setShowRequestForm(!showRequestForm)}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                {showRequestForm ? 'Cancel' : 'Request to Borrow'}
              </button>
            )}

            {isOwner && (
              <div className="bg-blue-50 border border-primary text-primary px-4 py-3 rounded-lg">
                This is your item
              </div>
            )}

            {!item.availability && (
              <div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-3 rounded-lg">
                This item is currently borrowed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Request Form */}
      {showRequestForm && !isOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4">Request to Borrow</h3>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  When will you return it? *
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or information for the owner..."
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
