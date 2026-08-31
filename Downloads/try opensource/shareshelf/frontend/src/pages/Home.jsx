import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Home() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">📦 Welcome to ShareShelf</h1>
          <p className="text-xl text-gray-100 mb-8">
            Share tools and equipment with your neighbors. Borrow what you need, lend what you have.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to={user ? '/browse' : '/register'}
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
            <Link
              to="/browse"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition"
            >
              Browse Items
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">List Your Items</h3>
              <p className="text-gray-600">
                Add items you want to share with your community. Set a deposit amount and describe the condition.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Browse & Request</h3>
              <p className="text-gray-600">
                Find items you need near you. Send a borrow request and wait for the owner to approve.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Build Trust</h3>
              <p className="text-gray-600">
                Complete exchanges and get reviews. Your trust score helps you borrow more items.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-gray-600">Items Listed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">1000+</div>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-warning mb-2">2000+</div>
              <p className="text-gray-600">Successful Exchanges</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Share?</h2>
          <p className="text-lg text-gray-100 mb-8">
            Join our community and start sharing tools with your neighbors today.
          </p>
          {!user ? (
            <Link
              to="/register"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Sign Up Now
            </Link>
          ) : (
            <Link
              to="/add-item"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              List Your First Item
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
