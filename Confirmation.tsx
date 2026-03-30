import { useLocation } from "wouter";

const LABELS: Record<string, string> = {
  grade_level: "Grade Level",
  gender: "Gender",
  sports_followed: "Iowa Sports Followed",
  passion_level: "Passion Level",
  event_attendance: "Event Attendance",
};

export default function Confirmation() {
  const [, navigate] = useLocation();

  const stored = sessionStorage.getItem("survey_submission");
  const answers: Record<string, string | string[]> | null = stored ? JSON.parse(stored) : null;

  const accent = "#8A3BDB";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: "#f3ebff" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke={accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
            <p className="text-gray-600">Your response has been recorded successfully.</p>
          </div>

          {answers && (
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 mb-8">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Your Answers</h2>
              <dl className="space-y-4">
                {Object.entries(LABELS).map(([key, label]) => {
                  const val = answers[key];
                  if (!val) return null;
                  const display = Array.isArray(val) ? val.join(", ") : val;
                  return (
                    <div key={key} className="flex flex-col sm:flex-row sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500 sm:w-48 flex-shrink-0">{label}</dt>
                      <dd className="text-sm text-gray-900 mt-0.5 sm:mt-0">{display}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/results")}
              className="px-8 py-3 rounded-lg text-white font-semibold text-base transition-all duration-150 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: accent }}
            >
              View Results
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 rounded-lg font-semibold text-base border-2 transition-all duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ borderColor: accent, color: accent }}
            >
              Home
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
