import { Link } from "react-router-dom"; // lucide-react emas, React Router Link

const NotFound = () => {
  return (
    <main className="grid min-h-full h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-3xl font-semibold from-emerald-900 to-green-400 bg-gradient-to-r bg-clip-text text-transparent">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/">
            <button className="btn-gradient rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Go back home
            </button>
          </Link>
          <Link to="">
            <button className="text-sm font-semibold text-gray-900">
              Contact support <span aria-hidden="true">&rarr;</span>
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
