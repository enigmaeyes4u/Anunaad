import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, BookOpen, Calendar, Clock, Video, Download, Heart, ArrowRight } from 'lucide-react';
import { Order, Artist } from '../types';

interface LearnerDashboardProps {
  onNavigate: (path: string) => void;
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({ onNavigate }) => {
  const { user, token } = useAuth();
  const [data, setData] = useState<{
    bookings: any[];
    savedKeepers: Artist[];
    stats: { enrolledCount: number; totalContributedInr: number };
  } | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch('/api/learner/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Welcome banner */}
      <div className="bg-[#FAF7F0] p-6 sm:p-10 rounded-3xl border border-[#E8E2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32] block mb-1">
            The Curious Sanctuary
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1C1B19]">
            Welcome back, {user?.name || 'Fellow Seeker'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5B54] mt-1">
            Your personal space for enrolled masterclasses, intimate baithak tickets, and saved lineages.
          </p>
        </div>

        <div className="flex gap-4 sm:border-l sm:border-[#E8E2D5] sm:pl-6 text-xs font-mono">
          <div>
            <span className="text-[#8E877B] block">ENROLLED</span>
            <span className="text-xl font-bold text-[#1C1B19]">{data?.stats.enrolledCount || 1}</span>
          </div>
          <div>
            <span className="text-[#8E877B] block">CONTRIBUTED</span>
            <span className="text-xl font-bold text-[#2D4F38]">₹{(data?.stats.totalContributedInr || 1499).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Bookings / Enrolled Courses */}
      <div className="space-y-6">
        <div className="border-b border-[#E8E2D5] pb-3 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[#1C1B19] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C85A32]" />
            <span>My Active Workshops & Transmission Cohorts</span>
          </h2>
          <button
            onClick={() => onNavigate('/learn')}
            className="text-xs font-semibold text-[#C85A32] hover:underline"
          >
            Discover more masterclasses →
          </button>
        </div>

        <div className="space-y-4">
          {data?.bookings && data.bookings.length > 0 ? (
            data.bookings.map((b: any) => (
              <div
                key={b.id}
                className="bg-white p-6 rounded-2xl border border-[#E8E2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#FAF7F0] text-[#C85A32] font-mono text-[10px] uppercase">
                      {b.type.replace('_', ' ')} • Status: {b.status}
                    </span>
                    <span className="text-xs text-[#8E877B] font-mono">Ref: {b.orderId}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1C1B19]">{b.itemTitle}</h3>
                  <p className="text-xs text-[#5E5B54]">Teacher: <strong className="text-[#1C1B19]">{b.artistName}</strong> ({b.artistLocation})</p>
                  <p className="text-xs text-[#8E877B] flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#D97724]" /> {b.schedule}
                  </p>
                </div>

                <div className="sm:text-right shrink-0 space-y-2">
                  <span className="font-mono text-base font-bold text-[#1C1B19] block">₹{b.grossAmountInr.toLocaleString('en-IN')}</span>
                  {b.joinUrl ? (
                    <a
                      href={b.joinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 py-2 px-4 bg-[#2D4F38] hover:bg-[#233d2b] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Live Transmission</span>
                    </a>
                  ) : (
                    <span className="text-xs text-[#8E877B]">Awaiting session start</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-[#E8E2D5] text-center space-y-3">
              <p className="text-sm text-[#5E5B54]">You haven't enrolled in any living traditions yet.</p>
              <button
                onClick={() => onNavigate('/learn')}
                className="py-2 px-4 bg-[#C85A32] text-white text-xs rounded-xl font-semibold cursor-pointer"
              >
                Browse Masterclasses
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Saved Keepers */}
      <div className="space-y-6">
        <div className="border-b border-[#E8E2D5] pb-3">
          <h2 className="font-serif text-2xl font-bold text-[#1C1B19] flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#D97724]" />
            <span>Keepers in Your Circle</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {data?.savedKeepers.map(keeper => (
            <div key={keeper.id} className="bg-white p-5 rounded-2xl border border-[#E8E2D5] space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={keeper.portraitImage}
                  alt={keeper.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#D97724]"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1C1B19]">{keeper.name}</h4>
                  <p className="text-[11px] text-[#8E877B]">{keeper.location}</p>
                </div>
              </div>
              <p className="text-xs text-[#5E5B54] line-clamp-2 italic">«{keeper.quote}»</p>
              <button
                onClick={() => onNavigate(`/artists/${keeper.id}`)}
                className="text-xs font-semibold text-[#C85A32] hover:underline flex items-center gap-1 pt-1"
              >
                <span>View Profile</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
