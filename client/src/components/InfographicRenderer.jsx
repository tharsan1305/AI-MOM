import { forwardRef } from 'react';
import { Calendar, Users, FileText, Target, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

const InfographicRenderer = forwardRef(({ metadata, template }, ref) => {
  // Safe fallbacks for missing data
  const data = {
    title: metadata?.meetingTitle || 'Meeting Notes',
    date: metadata?.date || new Date().toLocaleDateString(),
    attendees: metadata?.attendees || [],
    discussions: metadata?.discussionPoints || [],
    outcomes: metadata?.keyOutcomes || [],
    actionItems: metadata?.actionItems || [],
    risks: metadata?.risks || [],
  };

  // Base styles depending on template
  const themeStyles = {
    corporate: {
      bg: 'bg-white',
      text: 'text-slate-800',
      headerBg: 'bg-blue-900',
      headerText: 'text-white',
      accent: 'text-blue-600',
      cardBg: 'bg-slate-50',
      cardBorder: 'border-slate-200',
    },
    modern_business: {
      bg: 'bg-slate-900',
      text: 'text-slate-100',
      headerBg: 'bg-gradient-to-r from-primary-600 to-accent-500',
      headerText: 'text-white',
      accent: 'text-primary-400',
      cardBg: 'bg-slate-800',
      cardBorder: 'border-slate-700',
    },
    timeline: {
      bg: 'bg-[#fafafa]',
      text: 'text-gray-800',
      headerBg: 'bg-indigo-600',
      headerText: 'text-white',
      accent: 'text-indigo-500',
      cardBg: 'bg-white',
      cardBorder: 'border-indigo-100',
    },
    linkedin: {
      bg: 'bg-white',
      text: 'text-slate-800',
      headerBg: 'bg-[#0077b5]',
      headerText: 'text-white',
      accent: 'text-[#0077b5]',
      cardBg: 'bg-slate-50',
      cardBorder: 'border-slate-200',
    },
    mind_map: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      headerBg: 'bg-emerald-800',
      headerText: 'text-white',
      accent: 'text-emerald-600',
      cardBg: 'bg-white',
      cardBorder: 'border-emerald-200',
    },
    flowchart: {
      bg: 'bg-orange-50',
      text: 'text-orange-900',
      headerBg: 'bg-orange-600',
      headerText: 'text-white',
      accent: 'text-orange-600',
      cardBg: 'bg-white',
      cardBorder: 'border-orange-200',
    }
  };

  const theme = themeStyles[template] || themeStyles.corporate;

  return (
    <div 
      ref={ref} 
      className={`w-[800px] min-h-[1200px] ${theme.bg} ${theme.text} font-sans shadow-2xl overflow-hidden relative`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div className={`${theme.headerBg} ${theme.headerText} p-12 text-center relative`}>
        <h1 className="text-4xl font-extrabold mb-4 uppercase tracking-wider">{data.title}</h1>
        <div className="flex items-center justify-center gap-6 text-sm opacity-90 font-medium">
          <span className="flex items-center gap-2"><Calendar size={18} /> {data.date}</span>
          {data.attendees.length > 0 && (
            <span className="flex items-center gap-2"><Users size={18} /> {data.attendees.length} Attendees</span>
          )}
        </div>
      </div>

      <div className="p-12 space-y-10">
        {/* Attendees Section */}
        {data.attendees.length > 0 && (
          <div className={`p-6 rounded-xl border-l-4 ${theme.cardBg} ${theme.cardBorder} border-l-current ${theme.accent}`}>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Users size={20} /> Meeting Attendees
            </h2>
            <div className={`flex flex-wrap gap-2 ${theme.text}`}>
              {data.attendees.map((person, idx) => (
                <span key={idx} className="px-3 py-1 bg-black/5 rounded-full text-sm font-medium">
                  {person}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Discussion Points & Outcomes */}
        <div className="grid grid-cols-2 gap-8">
          {data.discussions.length > 0 && (
            <div>
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.accent}`}>
                <FileText size={20} /> Key Discussions
              </h2>
              <ul className="space-y-3">
                {data.discussions.map((point, idx) => (
                  <li key={idx} className={`p-4 rounded-lg border ${theme.cardBg} ${theme.cardBorder} flex gap-3`}>
                    <ArrowRight className={`shrink-0 mt-1 ${theme.accent}`} size={16} />
                    <span className="text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.outcomes.length > 0 && (
            <div>
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.accent}`}>
                <Target size={20} /> Outcomes & Decisions
              </h2>
              <ul className="space-y-3">
                {data.outcomes.map((outcome, idx) => (
                  <li key={idx} className={`p-4 rounded-lg border ${theme.cardBg} ${theme.cardBorder} flex gap-3`}>
                    <CheckCircle2 className={`shrink-0 mt-1 text-green-500`} size={16} />
                    <span className="text-sm leading-relaxed">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Items */}
        {data.actionItems.length > 0 && (
          <div>
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${theme.accent} pb-2 border-b ${theme.cardBorder}`}>
              Action Items Timeline
            </h2>
            <div className="space-y-4">
              {data.actionItems.map((item, idx) => (
                <div key={idx} className={`flex items-stretch rounded-xl overflow-hidden border ${theme.cardBorder} shadow-sm`}>
                  <div className={`w-2 ${theme.headerBg}`}></div>
                  <div className={`flex-1 p-5 ${theme.cardBg}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg pr-4">{item.task}</h3>
                      {item.status && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/10">
                          {item.status}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-6 mt-3 text-sm opacity-80">
                      {item.assignee && (
                        <span className="flex items-center gap-1 font-medium">
                          <Users size={14} /> {item.assignee}
                        </span>
                      )}
                      {item.deadline && (
                        <span className="flex items-center gap-1 font-medium text-red-500">
                          <Calendar size={14} /> Due: {item.deadline}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risks/Blockers */}
        {data.risks.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-900 mt-8">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-red-700">
              <AlertTriangle size={20} /> Risks & Blockers
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              {data.risks.map((risk, idx) => (
                <li key={idx} className="text-sm">{risk}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className={`absolute bottom-0 w-full p-6 text-center text-sm font-bold opacity-50 flex justify-between px-12`}>
        <span>Generated by MeetGraph AI</span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
});

InfographicRenderer.displayName = 'InfographicRenderer';
export default InfographicRenderer;
