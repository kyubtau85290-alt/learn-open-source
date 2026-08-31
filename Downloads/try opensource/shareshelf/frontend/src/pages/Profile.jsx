import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/authSlice';
import authService from '../services/authService';
import requestService from '../services/requestService';
import Loader from '../components/common/Loader';
import { FiStar, FiEdit2 } from 'react-icons/fi';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await requestService.getUserReviews(user.id);
      setReviews(data.reviews);
    } catch (err) {
      console.error('Failed to fetch reviews');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.updateProfile(user.id, formData);
      dispatch(updateUser(response.user));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              <FiEdit2 size={18} /> Edit Profile
            </button>
          )}
        </div>

        {/* Trust Score */}
        <div className="bg-gradient-to-r from-primary to-secondary bg-opacity-10 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FiStar className="text-warning" size={24} />
            <span className="text-3xl font-bold text-primary">{user.trustScore || 50}</span>
            <span className="text-gray-600">/100</span>
          </div>
          <p className="text-gray-600">
            Completed Swaps: {user.completedSwaps || 0} | Overdue Returns: {user.overdueCount || 0}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Location</p>
            <p className="text-lg font-semibold">{user.location}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Phone</p>
            <p className="text-lg font-semibold">{user.phone || 'Not added'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Member Since</p>
            <p className="text-lg font-semibold">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="mb-6">
            <p className="text-gray-600">{user.bio}</p>
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location/Pincode
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tell others about yourself..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-l-4 border-warning pl-4 py-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{review.reviewerId?.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <FiStar
                          key={i}
                          size={18}
                          className={i < review.rating ? 'fill-warning text-warning' : 'text-gray-300'}
                        />
                      ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
