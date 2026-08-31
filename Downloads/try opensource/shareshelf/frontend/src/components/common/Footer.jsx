export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-2">📦 ShareShelf</h3>
            <p className="text-gray-400">
              Hyperlocal tool and equipment lending platform.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/browse" className="hover:text-white transition">Browse Items</a></li>
              <li><a href="/dashboard" className="hover:text-white transition">Dashboard</a></li>
              <li><a href="/profile" className="hover:text-white transition">Profile</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">
              Email: support@shareshelf.com<br/>
              Made with ❤️ for communities
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ShareShelf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
