"use client";

import {
  GraduationCap,
  FileCheck,
  Users,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Building2,
} from "lucide-react";

export default function AdmissionProcessing() {
  const evaluationCards = [
    {
      title: "Academic Review",
      status: "Completed",
      icon: GraduationCap,
      color: "green",
    },
    {
      title: "Eligibility Assessment",
      status: "Completed",
      icon: FileCheck,
      color: "green",
    },
    {
      title: "Committee Review",
      status: "In Progress",
      icon: Users,
      color: "orange",
    },
  ];

  const journey = [
    {
      title: "Application Submitted",
      status: "completed",
    },
    {
      title: "Document Screening",
      status: "completed",
    },
    {
      title: "Academic Assessment",
      status: "completed",
    },
    {
      title: "Committee Review",
      status: "current",
    },
    {
      title: "Admission Decision",
      status: "pending",
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* LEFT SECTION */}
      <div className="xl:col-span-8 space-y-6">
        {/* Admission Banner */}
        <div className="bg-gradient-to-r from-orange-50 via-indigo-50 to-white border border-orange-100 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-orange-600" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl md:text-xl font-bold text-slate-800">
                    Admission Processing
                  </h2>

                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                    In Progress
                  </span>
                </div>

                <p className="text-slate-500 mt-2 text-sm">
                  Your application is currently being evaluated by the
                  university admissions committee.
                </p>
              </div>
            </div>

            <div className="bg-white border rounded-xl px-5 py-4 text-center">
              <p className="text-sm text-slate-500">
                Estimated Decision
              </p>

              <h3 className="font-bold text-orange-600 text-sm mt-1">
                7 - 14 Days
              </h3>
            </div>
          </div>
        </div>

        {/* Evaluation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {evaluationCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    card.color === "green"
                      ? "bg-green-100"
                      : "bg-orange-100"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      card.color === "green"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  />
                </div>

                <h3 className="font-semibold text-slate-800">
                  {card.title}
                </h3>

                <span
                  className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                    card.color === "green"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {card.status}
                </span>
              </div>
            );
          })}
        </div>

        {/* Processing Journey */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-8">
            University Processing Journey
          </h3>

          <div className="flex flex-col md:flex-row md:justify-between gap-6">
            {journey.map((step, index) => (
              <div
                key={index}
                className="flex md:flex-col items-center md:items-center gap-4 flex-1 relative"
              >
                {index !== journey.length - 1 && (
                  <>
                    <div className="hidden md:block absolute top-5 left-[60%] w-full h-[2px] bg-slate-200" />
                    <div className="md:hidden absolute left-[10px] top-8 h-full w-[2px] bg-slate-200" />
                  </>
                )}

                <div className="z-10">
                  {step.status === "completed" && (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {step.status === "current" && (
                    <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center">
                      <Clock3 className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {step.status === "pending" && (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 bg-white" />
                  )}
                </div>

                <div className="md:text-center">
                  <p
                    className={`text-xs font-medium ${
                      step.status === "current"
                        ? "text-orange-600"
                        : "text-slate-700"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="xl:col-span-4 space-y-6">
        {/* University Remarks */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-orange-600" />

            <h3 className="font-semibold text-slate-800">
              University Remarks
            </h3>
          </div>

          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-slate-700 text-xs leading-6">
              Your academic profile has successfully passed
              the initial screening process. The admissions
              committee is currently reviewing your
              application.
            </p>
          </div>

          <p className="text-xs text-slate-500 mt-3">
            Updated: 25 May 2025, 02:15 PM
          </p>
        </div>

        {/* Expected Decision */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h3 className="font-semibold text-slate-800 mb-4">
            Expected Decision
          </h3>

          <h2 className="text-sm font-bold text-orange-600">
            80%
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Estimated in 7 - 14 Days
          </p>

          <div className="mt-5 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-[80%] bg-orange-600 rounded-full" />
          </div>
        </div>
      </div>

      {/* Bottom Notice */}
      <div className="xl:col-span-12">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />

            <div>
              <h3 className="font-semibold text-amber-800">
                Important Notice
              </h3>

              <p className="text-sm text-amber-700 mt-2">
                No action is required from your side at this
                stage. The university will contact you if any
                additional documents or information are
                required during the admission evaluation
                process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}