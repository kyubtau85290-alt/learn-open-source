import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 text-lg mb-8">Sorry, we couldn't find the page you're looking for.</p>
        <Link
          to="/"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
