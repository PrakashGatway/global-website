// app/loading.tsx

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
 

      {/* ─── HERO SECTION SKELETON ─── */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="h-12 w-3/4 bg-gray-300 rounded-lg animate-pulse"></div>
              <div className="h-12 w-2/3 bg-gray-300 rounded-lg animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="h-12 w-40 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="h-12 w-40 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
            {/* Right Image */}
            <div className="h-80 w-full bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* ─── STATS SECTION SKELETON ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-10 w-20 bg-gray-300 rounded-lg animate-pulse mx-auto"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STEPS SECTION SKELETON ─── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-gray-300 rounded-lg animate-pulse mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES SECTION SKELETON ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-72 bg-gray-300 rounded-lg animate-pulse mx-auto mb-4"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-xl space-y-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-4 w-4/6 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── UNIVERSITIES SECTION SKELETON ─── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-gray-300 rounded-lg animate-pulse mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-5 rounded-xl shadow-sm space-y-3">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse"></div>
                <div className="flex gap-4">
                  <div className="h-4 w-16 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-100 rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-28 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BLOG SECTION SKELETON ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-gray-300 rounded-lg animate-pulse mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-48 w-full bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER SKELETON ─── */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-5 w-24 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-4/6 bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <div className="h-4 w-48 bg-gray-700 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}