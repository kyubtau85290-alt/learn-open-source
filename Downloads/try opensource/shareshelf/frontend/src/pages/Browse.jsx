import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import itemService from '../services/itemService';
import { fetchItemsStart, fetchItemsSuccess, fetchItemsFailure } from '../redux/itemSlice';
import ItemList from '../components/items/ItemList';

export default function Browse() {
  const dispatch = useDispatch();
  const { items, loading, error, pagination } = useSelector((state) => state.items);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    search: '',
    page: 1,
  });

  const fetchItems = async (filterData) => {
    dispatch(fetchItemsStart());
    try {
      const response = await itemService.getItems(
        filterData.category,
        filterData.location,
        filterData.page,
        12,
        filterData.search
      );
      dispatch(fetchItemsSuccess(response));
    } catch (err) {
      dispatch(fetchItemsFailure(err.response?.data?.message || 'Failed to load items'));
    }
  };

  useEffect(() => {
    fetchItems(filters);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value, page: 1 };
    setFilters(newFilters);
    fetchItems(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(filters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-12">
        <h2 className="text-2xl font-bold mb-6">Find Items</h2>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search items..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                <option value="tools">Tools</option>
                <option value="electronics">Electronics</option>
                <option value="sports">Sports</option>
                <option value="furniture">Furniture</option>
                <option value="kitchen">Kitchen</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location/Pincode
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="e.g., 560001"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Items List */}
      <ItemList
        items={items}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={(page) => {
          const newFilters = { ...filters, page };
          setFilters(newFilters);
          fetchItems(newFilters);
        }}
      />
    </div>
  );
}
