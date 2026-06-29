import React from 'react';
import { CheckCircle2, AlertTriangle, Calendar, Users, Target, ArrowRight } from 'lucide-react';

const MeetingReportTemplate = ({ data }) => {
  if (!data) return null;

  const { title, date, summary, attendees, decisions, action_items, risks, next_steps } = data;

  // Safe checks for arrays
  const safeAttendees = Array.isArray(attendees) ? attendees : [];
  const safeDecisions = Array.isArray(decisions) ? decisions : [];
  const safeActionItems = Array.isArray(action_items) ? action_items : [];
  const safeRisks = Array.isArray(risks) ? risks : [];
  const safeNextSteps = Array.isArray(next_steps) ? next_steps : [];

  return (
    <div className="w-full bg-white text-slate-900 rounded-3xl shadow-xl overflow-hidden break-words font-sans">
      
      {/* Header */}
      <div className="bg-slate-900 px-8 py-10 relative overflow-hidden">
        {/* Subtle background glow - Replaced blur() with radial-gradient to fix html2canvas crash */}
        <div 
          className="absolute top-0 right-0 w-[500px] h-[500px] -translate-y-1/2 translate-x-1/3"
          style={{ background: 'radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, rgba(147, 51, 234, 0) 70%)' }}
        ></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 text-purple-400 font-semibold uppercase tracking-wider text-sm">
            <Target size={18} /> Meeting Report
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{title || 'Meeting Notes'}</h1>
          
          {date && (
            <div className="flex items-center gap-2 text-slate-400 mb-6 font-medium">
              <Calendar size={18} />
              <span>{date}</span>
            </div>
          )}
          
          {summary && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-slate-300 text-lg leading-relaxed shadow-inner">
              {summary}
            </div>
          )}
        </div>
      </div>

      {/* Stat Strip */}
      <div className="bg-slate-50 border-b border-slate-200 px-8 py-4 flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <span>{safeActionItems.length} Action Items</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          <Users size={16} className="text-blue-500" />
          <span>{safeDecisions.length} Decisions</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          <AlertTriangle size={16} className={safeRisks.length > 0 ? "text-orange-500" : "text-slate-400"} />
          <span>{safeRisks.length} Risks</span>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Attendees Section */}
        {safeAttendees.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-8 h-8 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                <Users size={16} />
              </span>
              Attendees
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 border border-slate-200 p-5 rounded-xl">
              {safeAttendees.map((person, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                  {person}
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Decisions Section */}
        {safeDecisions.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm">💡</span>
              Key Decisions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeDecisions.map((decision, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm text-slate-700 leading-relaxed font-medium">
                  {decision}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Action Items Section */}
        {safeActionItems.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">⚡</span>
              Action Items
            </h2>
            <div className="space-y-3">
              {safeActionItems.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-1 text-slate-800 font-medium">{item.task}</div>
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Owner Badge */}
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 border border-slate-200">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-[10px]">
                        {item.owner ? item.owner.charAt(0).toUpperCase() : '?'}
                      </div>
                      {item.owner || 'Unassigned'}
                    </div>
                    {/* Deadline Badge */}
                    {item.deadline && (
                      <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold border border-red-100">
                        {item.deadline}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Risks Section */}
        {safeRisks.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-orange-200 pb-2">
              <span className="w-8 h-8 rounded bg-orange-100 text-orange-600 flex items-center justify-center text-sm">⚠️</span>
              Identified Risks
            </h2>
            <div className="bg-orange-50/50 border border-orange-200 rounded-xl overflow-hidden">
              <ul className="divide-y divide-orange-100">
                {safeRisks.map((risk, idx) => (
                  <li key={idx} className="px-5 py-4 text-orange-800 font-medium flex items-start gap-3">
                    <AlertTriangle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Next Steps Section */}
        {safeNextSteps.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-8 h-8 rounded bg-purple-100 text-purple-600 flex items-center justify-center text-sm">🚀</span>
              Next Steps
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 font-medium pl-2">
              {safeNextSteps.map((step, idx) => (
                <li key={idx} className="pl-2">
                  <span className="text-slate-800">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border-t border-slate-200 px-8 py-5 flex items-center justify-center gap-2 text-slate-400 text-sm font-semibold">
        <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-slate-50 rounded-sm"></div>
        </div>
        Generated by MinuteCraft AI
      </div>

    </div>
  );
};

export default MeetingReportTemplate;
