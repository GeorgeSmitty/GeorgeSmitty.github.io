import { useState } from "react";
import { useLocation } from "wouter";
import { supabase, type SurveyResponse } from "@/lib/supabase";

const GRADE_LEVELS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate Student", "Other"];
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];
const SPORTS = [
  "Iowa Football",
  "Iowa Men's Basketball",
  "Iowa Women's Basketball",
  "Iowa Wrestling",
  "Iowa Baseball",
  "Iowa Volleyball",
  "I do not follow Iowa sports",
];
const PASSION_LEVELS = [
  "Not interested",
  "Slightly interested",
  "Moderately interested",
  "Very passionate",
  "Extremely passionate",
];
const ATTENDANCE_OPTIONS = [
  "Never",
  "Rarely (1–2 times per season)",
  "Sometimes (3–5 times per season)",
  "Often (6–10 times per season)",
  "Very often (10+ times per season)",
];

interface FormData {
  grade_level: string;
  gender: string;
  sports_followed: string[];
  passion_level: string;
  event_attendance: string;
}

interface FormErrors {
  grade_level?: string;
  gender?: string;
  sports_followed?: string;
  passion_level?: string;
  event_attendance?: string;
}

export default function Survey() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<FormData>({
    grade_level: "",
    gender: "",
    sports_followed: [],
    passion_level: "",
    event_attendance: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.grade_level) newErrors.grade_level = "Please select your grade level.";
    if (!form.gender) newErrors.gender = "Please select your gender.";
    if (form.sports_followed.length === 0) newErrors.sports_followed = "Please select at least one option.";
    if (!form.passion_level) newErrors.passion_level = "Please select your passion level.";
    if (!form.event_attendance) newErrors.event_attendance = "Please select your attendance frequency.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSportToggle = (sport: string) => {
    setForm((prev) => {
      const isSelected = prev.sports_followed.includes(sport);
      let updated: string[];

      if (sport === "I do not follow Iowa sports") {
        updated = isSelected ? [] : [sport];
      } else {
        const withoutNone = prev.sports_followed.filter((s) => s !== "I do not follow Iowa sports");
        updated = isSelected
          ? withoutNone.filter((s) => s !== sport)
          : [...withoutNone, sport];
      }

      return { ...prev, sports_followed: updated };
    });
    if (errors.sports_followed) setErrors((e) => ({ ...e, sports_followed: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload: SurveyResponse = { ...form };
      const { error } = await supabase.from("survey_responses").insert([payload]);
      if (error) throw error;
      sessionStorage.setItem("survey_submission", JSON.stringify(form));
      navigate("/confirmation");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const accent = "#8A3BDB";
  const accentLight = "#f3ebff";
  const errorColor = "#dc2626";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-100 py-4 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-sm font-medium hover:opacity-70 transition-opacity flex items-center gap-1"
            style={{ color: accent }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Home
          </button>
          <button
            onClick={() => navigate("/results")}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: accent }}
          >
            View Results
          </button>
        </div>
      </header>

      <main className="flex-1 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sports Passion Survey</h1>
            <p className="text-gray-600">University of Iowa — All fields are required.</p>
          </div>

          {submitError && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-lg border text-sm"
              style={{ backgroundColor: "#fef2f2", borderColor: "#fca5a5", color: errorColor }}
            >
              <strong>Submission failed:</strong> {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            {/* Q1 — Grade Level */}
            <fieldset>
              <legend className="block text-base font-semibold text-gray-900 mb-1">
                1. What is your current grade level?
                <span className="text-sm font-normal text-gray-500 ml-2">(Required)</span>
              </legend>
              <select
                id="grade_level"
                value={form.grade_level}
                onChange={(e) => {
                  setForm((f) => ({ ...f, grade_level: e.target.value }));
                  if (errors.grade_level) setErrors((er) => ({ ...er, grade_level: undefined }));
                }}
                aria-required="true"
                aria-describedby={errors.grade_level ? "grade-error" : undefined}
                aria-invalid={!!errors.grade_level}
                className="mt-2 block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 transition-colors"
                style={{
                  borderColor: errors.grade_level ? errorColor : "#d1d5db",
                  "--tw-ring-color": accent,
                } as React.CSSProperties}
              >
                <option value="">Select grade level...</option>
                {GRADE_LEVELS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errors.grade_level && (
                <p id="grade-error" role="alert" className="mt-1 text-xs" style={{ color: errorColor }}>
                  {errors.grade_level}
                </p>
              )}
            </fieldset>

            {/* Q2 — Gender */}
            <fieldset>
              <legend className="block text-base font-semibold text-gray-900 mb-1">
                2. What is your gender?
                <span className="text-sm font-normal text-gray-500 ml-2">(Required)</span>
              </legend>
              {errors.gender && (
                <p id="gender-error" role="alert" className="mt-1 mb-2 text-xs" style={{ color: errorColor }}>
                  {errors.gender}
                </p>
              )}
              <div className="mt-2 space-y-2" role="group" aria-labelledby="gender-legend" aria-describedby={errors.gender ? "gender-error" : undefined}>
                {GENDERS.map((g) => (
                  <label
                    key={g}
                    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50"
                    style={{
                      borderColor: form.gender === g ? accent : "#e5e7eb",
                      backgroundColor: form.gender === g ? accentLight : undefined,
                    }}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={() => {
                        setForm((f) => ({ ...f, gender: g }));
                        if (errors.gender) setErrors((er) => ({ ...er, gender: undefined }));
                      }}
                      className="sr-only"
                    />
                    <span
                      className="flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: form.gender === g ? accent : "#9ca3af" }}
                    >
                      {form.gender === g && (
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                      )}
                    </span>
                    <span className="text-sm text-gray-900">{g}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Q3 — Sports Followed */}
            <fieldset>
              <legend className="block text-base font-semibold text-gray-900 mb-1">
                3. Which University of Iowa sports do you follow the most?
                <span className="text-sm font-normal text-gray-500 ml-2">(Select all that apply)</span>
              </legend>
              {errors.sports_followed && (
                <p id="sports-error" role="alert" className="mt-1 mb-2 text-xs" style={{ color: errorColor }}>
                  {errors.sports_followed}
                </p>
              )}
              <div className="mt-2 space-y-2" role="group" aria-describedby={errors.sports_followed ? "sports-error" : undefined}>
                {SPORTS.map((sport) => {
                  const checked = form.sports_followed.includes(sport);
                  return (
                    <label
                      key={sport}
                      className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50"
                      style={{
                        borderColor: checked ? accent : "#e5e7eb",
                        backgroundColor: checked ? accentLight : undefined,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleSportToggle(sport)}
                        className="sr-only"
                      />
                      <span
                        className="flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center"
                        style={{ borderColor: checked ? accent : "#9ca3af", backgroundColor: checked ? accent : "white" }}
                      >
                        {checked && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <span className="text-sm text-gray-900">{sport}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Q4 — Passion Level */}
            <fieldset>
              <legend className="block text-base font-semibold text-gray-900 mb-1">
                4. How passionate are you about University of Iowa sports?
                <span className="text-sm font-normal text-gray-500 ml-2">(Required)</span>
              </legend>
              {errors.passion_level && (
                <p id="passion-error" role="alert" className="mt-1 mb-2 text-xs" style={{ color: errorColor }}>
                  {errors.passion_level}
                </p>
              )}
              <div className="mt-2 space-y-2" role="group" aria-describedby={errors.passion_level ? "passion-error" : undefined}>
                {PASSION_LEVELS.map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50"
                    style={{
                      borderColor: form.passion_level === level ? accent : "#e5e7eb",
                      backgroundColor: form.passion_level === level ? accentLight : undefined,
                    }}
                  >
                    <input
                      type="radio"
                      name="passion_level"
                      value={level}
                      checked={form.passion_level === level}
                      onChange={() => {
                        setForm((f) => ({ ...f, passion_level: level }));
                        if (errors.passion_level) setErrors((er) => ({ ...er, passion_level: undefined }));
                      }}
                      className="sr-only"
                    />
                    <span
                      className="flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: form.passion_level === level ? accent : "#9ca3af" }}
                    >
                      {form.passion_level === level && (
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                      )}
                    </span>
                    <span className="text-sm text-gray-900">{level}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Q5 — Event Attendance */}
            <fieldset>
              <legend className="block text-base font-semibold text-gray-900 mb-1">
                5. How often do you watch or attend University of Iowa sporting events?
                <span className="text-sm font-normal text-gray-500 ml-2">(Required)</span>
              </legend>
              <select
                id="event_attendance"
                value={form.event_attendance}
                onChange={(e) => {
                  setForm((f) => ({ ...f, event_attendance: e.target.value }));
                  if (errors.event_attendance) setErrors((er) => ({ ...er, event_attendance: undefined }));
                }}
                aria-required="true"
                aria-describedby={errors.event_attendance ? "attendance-error" : undefined}
                aria-invalid={!!errors.event_attendance}
                className="mt-2 block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 transition-colors"
                style={{
                  borderColor: errors.event_attendance ? errorColor : "#d1d5db",
                  "--tw-ring-color": accent,
                } as React.CSSProperties}
              >
                <option value="">Select frequency...</option>
                {ATTENDANCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.event_attendance && (
                <p id="attendance-error" role="alert" className="mt-1 text-xs" style={{ color: errorColor }}>
                  {errors.event_attendance}
                </p>
              )}
            </fieldset>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 px-6 rounded-lg text-white font-semibold text-base transition-all duration-150 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: accent, "--tw-ring-color": accent } as React.CSSProperties}
              >
                {submitting ? "Submitting..." : "Submit Survey"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/results")}
                className="py-3 px-6 rounded-lg font-semibold text-base border-2 transition-all duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ borderColor: accent, color: accent, "--tw-ring-color": accent } as React.CSSProperties}
              >
                View Results
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-100">
        Survey by George Smith, BAIS:3300 - Spring 2026
      </footer>
    </div>
  );
}
