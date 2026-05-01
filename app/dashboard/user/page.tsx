"use client"

import axiosInstance from "@/app/axiosInstance";
import { useGlobal } from "@/src/statecontext";
import React, { useCallback, useEffect, useRef, useState } from "react";

// /* ─── Static seed data ───────────────────────────────────────────────── */
// const userData = {
//   success: true,
//   data: {
//     _id: "69ec622de8226f391b368e34",
//     name: "naveen",
//     email: "naveen1@gmail.com",
//     phone: "6375554625",
//     hasAcceptedTerms: false,
//     status: "Active",
//     role: "user",
//     maritalStatus: "single",
//     otherImage: "",
//     referalBy: "BGPYF1",
//     wallet: 0,
//     dateOfBirth: "2026-04-25T06:41:49.467Z",
//     referalCode: "BGPY79",
//     lastLogin: "2026-04-25T06:43:45.982Z",
//     createdAt: "2026-04-25T06:41:49.467Z",
//     updatedAt: "2026-04-25T06:43:45.982Z",
//     assignto: "BGPYF1",
//     other: [
//       {
//         _id: "69ec624de8226f391b368e58",
//         hasGmat: false,
//         hasGre: false,
//         visaRefused: false,
//         otherCompletion: 20,
//         otherDetails: "",
//       },
//     ],
//   },
// };

/* ─── Types ──────────────────────────────────────────────────────────── */
interface ReferralUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  role: string;
  referalCode: string;
  wallet: number;
  createdAt: string;
  [key: string]: unknown;
}

/* ─── Helpers ────────────────────────────────────────────────────────── */
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function Badge({ label, value, accent = false }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 p-3 rounded-xl border ${accent ? "border-violet-200 bg-violet-50" : "border-slate-100 bg-slate-50"}`}>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</span>
      <span className={`text-sm font-semibold ${accent ? "text-violet-700" : "text-slate-700"}`}>{value}</span>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    Inactive: "bg-rose-100 text-rose-700 ring-rose-200",
    Pending: "bg-amber-100 text-amber-700 ring-amber-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${colors[status] ?? "bg-slate-100 text-slate-600 ring-slate-200"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

/* ─── Detail Modal ───────────────────────────────────────────────────── */
function DetailModal({ user, onClose }: { user: ReferralUser; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 animate-modalIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
        >
          ✕
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800 capitalize">{user.name}</p>
            <p className="text-sm text-slate-400">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Badge label="Phone" value={user.phone} />
          <Badge label="Status" value={<StatusPill status={user.status} />} />
          <Badge label="Role" value={user.role} />
          <Badge label="Referral Code" value={user.referalCode} accent />
          <Badge label="Wallet" value={`₹${user.wallet}`} accent />
          <Badge label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
        </div>

        {/* Extra raw details */}
        {Object.keys(user).filter(k => !["_id", "name", "email", "phone", "status", "role", "referalCode", "wallet", "createdAt"].includes(k)).length > 0 && (
          <details className="mt-4 group">
            <summary className="cursor-pointer text-xs font-semibold text-slate-400 hover:text-slate-600 select-none">
              More details
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(user)
                .filter(([k]) => !["_id", "name", "email", "phone", "status", "role", "referalCode", "wallet", "createdAt"].includes(k))
                .map(([k, v]) => (
                  <Badge key={k} label={k} value={String(v ?? "—")} />
                ))}
            </div>
          </details>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .animate-modalIn { animation: modalIn .2s ease both; }
      `}</style>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
const Page = () => {
  // const user = userData.data;
  // const other = user?.other[0];
  const { profile } = useGlobal();
  //   console.log(profile)

  /* Search state */
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  /* Referral list state */
  const [referralList, setReferralList] = useState<ReferralUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ReferralUser | null>(null);

  /* Debounced API call */
  const fetchReferrals = useCallback(async (code: string, id: string) => {
    if (!code) { setReferralList([]); return; }
    setLoading(true);
    try {
      console.log(`/users/code/${code}`);
      const response = await axiosInstance.get(`/users/code/${code}/${id}`);
      const data: ReferralUser[] = response.data.data ?? [];
      setReferralList(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Error fetching referrals:", err);
      setReferralList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferrals(debouncedQuery || profile?.referalCode || "", profile?._id || "");
  }, [debouncedQuery, profile?.referalCode, fetchReferrals]);

  /* ── Render ── */
  return (
    <div className="">

      <div className=" mx-auto space-y-6">


        {/* ── Referral Search + List ─────────────────── */}
        <div className="fade-up-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="heading text-2xl font-bold text-slate-800 mb-4">Student List</h2>

          {/* Search input */}
          {/* <div className="relative mb-4">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={`Search ...`}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            />
            {loading && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-violet-500 animate-pulse">
                Loading…
              </span>
            )}
          </div> */}

          {/* List */}
          {referralList.length === 0 && !loading ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              No referral users found.
            </div>
          ) : (
            <div className="divide-y divide-slate-50 rounded-xl border border-slate-100 overflow-hidden">
              {referralList.map((ru) => (
                <button
                  key={ru._id}
                  onClick={() => setSelectedUser(ru)}
                  className="row-hover w-full flex items-center gap-4 px-4 py-3 text-left cursor-pointer"
                >
                  {/* mini avatar */}
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {ru.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 capitalize truncate">{ru.name}</p>
                    <p className="text-xs text-slate-400 truncate">{ru.email}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <StatusPill status={ru.status} />
                    <span className="text-[10px] text-slate-400 font-mono">{ru.referalCode}</span>
                  </div>
                  <span className="text-slate-300 text-lg">›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <DetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default Page;