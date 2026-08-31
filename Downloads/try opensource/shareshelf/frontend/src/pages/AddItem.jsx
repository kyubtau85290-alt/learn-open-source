import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/itemSlice';
import itemService from '../services/itemService';
import ItemForm from '../components/items/ItemForm';
import Loader from '../components/common/Loader';

export default function AddItem() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');

    try {
      const response = await itemService.createItem(formData);
      dispatch(addItem(response.item));
      alert('Item listed successfully!');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create item';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">List a New Item</h1>

      {error && (
        <div className="bg-danger bg-opacity-10 border border-danger text-danger px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <ItemForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
