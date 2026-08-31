import ItemCard from './ItemCard';
import Loader from '../common/Loader';

export default function ItemList({ items, loading, error, pagination, onPageChange }) {
  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="bg-danger bg-opacity-10 border border-danger text-danger px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-2xl text-gray-500">📦 No items found</p>
        <p className="text-gray-400 mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                page === pagination.current
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
