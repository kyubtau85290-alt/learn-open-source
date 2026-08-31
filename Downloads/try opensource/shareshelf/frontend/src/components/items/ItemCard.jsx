import { Link } from 'react-router-dom';
import { FiMapPin, FiUser } from 'react-icons/fi';

export default function ItemCard({ item }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
            📦
          </div>
        )}
        <div className="absolute top-2 right-2 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
          {item.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate mb-2">
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Condition and Deposit */}
        <div className="flex justify-between items-center mb-3 text-sm">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {item.condition}
          </span>
          {item.depositAmount > 0 && (
            <span className="bg-warning bg-opacity-20 text-warning px-2 py-1 rounded">
              ₹{item.depositAmount} deposit
            </span>
          )}
        </div>

        {/* Location and Owner */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FiMapPin size={16} />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiUser size={16} />
            <span>{item.ownerId?.name}</span>
            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
              Score: {item.ownerId?.trustScore || 50}
            </span>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/item/${item._id}`}
          className="block w-full bg-primary text-white text-center py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
