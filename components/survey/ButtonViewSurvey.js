"use client";

import Link from "next/link";

export default function ButtonViewSurvey({ surveyId }) {
  return (
    <Link href={`/dashboard/b/${surveyId}`} className="block w-full">
      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm py-2 rounded-lg hover:scale-105 transition-all duration-200 shadow-md hover:shadow-purple-500/50">
        View Survey
      </button>
    </Link>
  );
}
