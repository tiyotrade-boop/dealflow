<header className="bg-white border-b border-gray-200">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
    {/* Logo */}
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-80 transition"
    >
      <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
        DA
      </div>
      <span className="text-xl font-semibold tracking-tight text-gray-900">
        DealAnalytic
      </span>
    </Link>

    {/* Navigation */}
    <nav className="flex items-center gap-4 sm:gap-6">
      <Link
        href="/dashboard"
        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
      >
        Dashboard
      </Link>
      <Link
        href="/contact"
        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
      >
        Contact
      </Link>
      <Link
        href="/dashboard"
        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
      >
        Start Free Trial
      </Link>
    </nav>
  </div>
</header>