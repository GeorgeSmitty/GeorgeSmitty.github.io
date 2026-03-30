import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { supabase, type SurveyResponse } from "@/lib/supabase";

const ACCENT = "#8A3BDB";
const ACCENT_LIGHT = "#c084fc";

const GRADE_ORDER = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate Student", "Other"];
const PASSION_ORDER = ["Not interested", "Slightly interested", "Moderately interested", "Very passionate", "Extremely passionate"];
const ATTENDANCE_ORDER = ["Never", "Rarely (1–2 times per season)", "Sometimes (3–5 times per season)", "Often (6–10 times per season)", "Very often (10+ times per season)"];
const SPORTS_ORDER = ["Iowa Football", "Iowa Men's Basketball", "Iowa Women's Basketball", "Iowa Wrestling", "Iowa Baseball", "Iowa Volleyball", "I do not follow Iowa sports"];

function countBy(rows: SurveyResponse[], key: keyof SurveyResponse, order: string[]): { name: string; count: number }[] {
  const counts: Record<string, number> = {};
  order.forEach((o) => (counts[o] = 0));
  rows.forEach((row) => {
    const val = row[key];
    if (typeof val === "string" && val in counts) counts[val]++;
  });
  return order.map((name) => ({ name, count: counts[name] ?? 0 }));
}

function countSports(rows: SurveyResponse[]): { name: string; count: number }[] {
  const counts: Record<string, number> = {};
  SPORTS_ORDER.forEach((s) => (counts[s] = 0));
  rows.forEach((row) => {
    if (Array.isArray(row.sports_followed)) {
      row.sports_followed.forEach((sport) => {
        if (sport in counts) counts[sport]++;
      });
    }
  });
  return SPORTS_ORDER.map((name) => ({ name: name.replace("Iowa ", ""), count: counts[name] }));
}

const SHORT_ATTENDANCE: Record<string, string> = {
  "Never": "Never",
  "Rarely (1–2 times per season)": "Rarely",
  "Sometimes (3–5 times per season)": "Sometimes",
  "Often (6–10 times per season)": "Often",
  "Very often (10+ times per season)": "Very often",
};

const SHORT_PASSION: Record<string, string> = {
  "Not interested": "Not interested",
  "Slightly interested": "Slightly",
  "Moderately interested": "Moderately",
  "Very passionate": "Very passionate",
  "Extremely passionate": "Extremely",
};

interface ChartCardProps {
  title: string;
  data: { name: string; count: number }[];
  nameFormatter?: (name: string) => string;
}

function ChartCard({ title, data, nameFormatter }: ChartCardProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-800 mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickFormatter={nameFormatter ?? ((n) => n)}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280" }}
            allowDecimals={false}
            domain={[0, Math.ceil(maxCount * 1.2) || 1]}
          />
          <Tooltip
            formatter={(value: number) => [value, "Responses"]}
            contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={index % 2 === 0 ? ACCENT : ACCENT_LIGHT}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Results() {
  const [, navigate] = useLocation();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        const { data, error } = await supabase
          .from("survey_responses")
          .select("grade_level, gender, sports_followed, passion_level, event_attendance");

        if (error) throw error;
        setResponses((data as SurveyResponse[]) ?? []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load results.");
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, []);

  const gradeData = countBy(responses, "grade_level", GRADE_ORDER);
  const passionData = countBy(responses, "passion_level", PASSION_ORDER).map((d) => ({
    ...d,
    name: SHORT_PASSION[d.name] ?? d.name,
  }));
  const attendanceData = countBy(responses, "event_attendance", ATTENDANCE_ORDER).map((d) => ({
    ...d,
    name: SHORT_ATTENDANCE[d.name] ?? d.name,
  }));
  const sportsData = countSports(responses);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-sm font-medium hover:opacity-70 transition-opacity flex items-center gap-1"
            style={{ color: ACCENT }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Home
          </button>
          <button
            onClick={() => navigate("/survey")}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: ACCENT }}
          >
            Take Survey
          </button>
        </div>
      </header>

      <main className="flex-1 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Survey Results</h1>
            <p className="text-gray-600">University of Iowa Sports Passion Survey — Aggregated responses</p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200" style={{ borderTopColor: ACCENT }} />
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-lg border text-sm"
              style={{ backgroundColor: "#fef2f2", borderColor: "#fca5a5", color: "#dc2626" }}
            >
              <strong>Error loading results:</strong> {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Total count */}
              <div
                className="rounded-xl p-6 mb-6 text-white"
                style={{ backgroundColor: ACCENT }}
              >
                <p className="text-sm font-medium opacity-80 mb-1">Total Responses</p>
                <p className="text-5xl font-bold">{responses.length}</p>
              </div>

              {responses.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-lg font-medium">No responses yet.</p>
                  <p className="text-sm mt-1">Be the first to take the survey!</p>
                  <button
                    onClick={() => navigate("/survey")}
                    className="mt-6 px-6 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: ACCENT }}
                  >
                    Take the Survey
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChartCard title="Grade Level Distribution" data={gradeData} />
                  <ChartCard title="Passion Level" data={passionData} />
                  <ChartCard title="Iowa Sports Followed" data={sportsData} />
                  <ChartCard title="Event Attendance Frequency" data={attendanceData} />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-100 bg-white">
        Survey by George Smith, BAIS:3300 - Spring 2026
      </footer>
    </div>
  );
}
