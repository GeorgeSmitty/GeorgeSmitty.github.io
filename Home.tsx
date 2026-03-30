import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
              style={{ backgroundColor: "#f3ebff" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8A3BDB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M8 12l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              University of Iowa<br />Sports Passion Survey
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Help us understand fan engagement with Hawkeye athletics.
            </p>
            <p className="text-sm text-gray-500">
              This survey takes approximately 2 minutes to complete. All responses are anonymous.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/survey")}
              className="px-8 py-3 rounded-lg text-white font-semibold text-base transition-all duration-150 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: "#8A3BDB", boxShadow: "0 1px 3px rgba(138,59,219,0.3)", "--tw-ring-color": "#8A3BDB" } as React.CSSProperties}
            >
              Take the Survey
            </button>
            <button
              onClick={() => navigate("/results")}
              className="px-8 py-3 rounded-lg font-semibold text-base border-2 transition-all duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ borderColor: "#8A3BDB", color: "#8A3BDB", "--tw-ring-color": "#8A3BDB" } as React.CSSProperties}
            >
              View Results
            </button>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-100">
        Survey by George Smith, BAIS:3300 - Spring 2026
      </footer>
    </div>
  );
}
