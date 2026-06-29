import React from 'react';
import { 
  Calendar, ClipboardCheck, BarChart, Lightbulb, Globe, 
  Users, Check, Edit2, RefreshCw, Pin, MessageSquare
} from 'lucide-react';

const CYCLE_ICONS = [BarChart, Lightbulb, Globe, Calendar, Users];

const IllustratedReportTemplate = ({ data }) => {
  if (!data) return null;

  const { title, date, summary, attendees, decisions, action_items, risks, next_steps } = data;

  // Safe checks for arrays
  const safeAttendees = Array.isArray(attendees) ? attendees : [];
  const safeDecisions = Array.isArray(decisions) ? decisions : [];
  const safeActionItems = Array.isArray(action_items) ? action_items : [];
  const safeRisks = Array.isArray(risks) ? risks : [];
  const safeNextSteps = Array.isArray(next_steps) ? next_steps : [];

  // Discussion Points: we map summary + risks into a list
  const discussionPoints = [];
  if (summary) discussionPoints.push(summary);
  safeRisks.forEach(risk => discussionPoints.push(`Risk: ${risk}`));

  return (
    <div className="w-full bg-white text-slate-900 rounded-2xl shadow-xl overflow-hidden break-words font-sans max-w-full">
      
      {/* 1. Header Banner */}
      <div className="bg-slate-900 px-6 sm:px-8 py-8 sm:py-10 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-t-2xl gap-6 sm:gap-4">
        <div className="relative z-10 w-full sm:max-w-[80%]">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            MOM – {title || 'Meeting Notes'}
          </h1>
          {date && (
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <Calendar size={18} />
              <span>{date}</span>
            </div>
          )}
        </div>
        
        {/* Decorative Icon Right */}
        <div className="relative z-10 shrink-0 hidden sm:block">
          <div className="w-16 h-16 rounded-full border-2 border-slate-700 flex items-center justify-center bg-slate-800/50">
            <ClipboardCheck size={32} className="text-purple-400" />
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-10">
        
        {/* Attendees Section */}
        {safeAttendees.length > 0 && (
          <section className="bg-white border-l-4 border-indigo-500 pl-4 sm:pl-6 py-2 shadow-sm rounded-r-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <Users size={20} className="text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 whitespace-nowrap">Attendees</h2>
              <div className="flex-grow border-b border-slate-200 ml-2 sm:ml-4"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {safeAttendees.map((person, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Users size={14} className="text-slate-500" />
                  </div>
                  <span className="text-slate-700 font-medium">{person}</span>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* 2. Discussion Points */}
        {discussionPoints.length > 0 && (
          <section className="bg-white border-l-4 border-purple-500 pl-4 sm:pl-6 py-2 shadow-sm rounded-r-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <MessageSquare size={20} className="text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 whitespace-nowrap">Discussion Points</h2>
              <div className="flex-grow border-b border-slate-200 ml-2 sm:ml-4"></div>
            </div>
            
            <div className="space-y-4">
              {discussionPoints.map((point, idx) => {
                const IconComponent = CYCLE_ICONS[idx % CYCLE_ICONS.length];
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      <IconComponent size={16} className="text-slate-600" />
                    </div>
                    <p className="text-slate-700 leading-relaxed sm:text-lg pt-0.5">{point}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. Two Side-by-Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Key Outcomes (Decisions) */}
          {safeDecisions.length > 0 && (
            <section className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 shadow-sm h-full">
              <h3 className="text-xl font-bold text-emerald-800 mb-5 flex items-center gap-2 border-b border-emerald-200/50 pb-3">
                Key Outcomes
              </h3>
              <ul className="space-y-3">
                {safeDecisions.map((decision, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={16} className="text-emerald-600 font-bold" />
                    </div>
                    <span className="text-emerald-900 font-medium leading-relaxed pt-1">{decision}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Action Items */}
          {safeActionItems.length > 0 && (
            <section className="bg-blue-50 rounded-2xl p-6 border border-blue-100 shadow-sm h-full">
              <h3 className="text-xl font-bold text-blue-800 mb-5 flex items-center gap-2 border-b border-blue-200/50 pb-3">
                Action Items
              </h3>
              <ul className="space-y-4">
                {safeActionItems.map((item, idx) => (
                  <li key={idx} className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Edit2 size={14} className="text-blue-600" />
                      </div>
                      <span className="text-slate-800 font-medium leading-relaxed pt-1">{item.task}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0 pt-1 sm:pt-0">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600">
                        <div className="w-4 h-4 rounded-full bg-slate-300 flex items-center justify-center text-[9px] text-white shrink-0">
                          {item.owner ? item.owner.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="whitespace-nowrap">{item.owner || 'Unassigned'}</span>
                      </div>
                      {item.deadline && (
                        <div className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap">
                          {item.deadline}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* 4. Status Section (Next Steps) */}
        {safeNextSteps.length > 0 && (
          <section className="bg-amber-50 rounded-2xl p-6 border border-amber-100 shadow-sm">
            <h3 className="text-xl font-bold text-amber-800 mb-5 flex items-center gap-2 border-b border-amber-200/50 pb-3">
              Status & Next Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {safeNextSteps.map((step, idx) => {
                const isEven = idx % 2 === 0;
                const IconComponent = isEven ? RefreshCw : Pin;
                return (
                  <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-amber-100">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                      <IconComponent size={16} className="text-amber-600" />
                    </div>
                    <span className="text-amber-900 font-medium leading-relaxed pt-1">{step}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>

      {/* 5. Footer Banner */}
      <div className="bg-slate-900 rounded-b-2xl px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-white text-sm font-semibold tracking-widest uppercase text-center">
        <span className="text-slate-300">TEAMWORK. STRATEGY. SUCCESS.</span>
        <div className="hidden sm:block h-4 border-l border-white/20"></div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shrink-0">
            <div className="w-2.5 h-2.5 bg-slate-50 rounded-sm"></div>
          </div>
          MinuteCraft AI
        </div>
      </div>

    </div>
  );
};

export default IllustratedReportTemplate;
