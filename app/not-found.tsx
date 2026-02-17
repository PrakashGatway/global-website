export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      
      <h1 className="text-6xl font-bold text-orange-600">404</h1>

      <h2 className="text-2xl font-semibold mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-500 mt-2">
        Sorry, the page you are looking for doesn't exist.
      </p>

      <a
        href="/"
        className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
      >
        Go Home
      </a>

    </div>
  );
}
