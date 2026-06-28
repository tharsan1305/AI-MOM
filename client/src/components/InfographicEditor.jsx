import React, { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';
import EditableText from './EditableText';
import { Calendar, Users, Target, CheckCircle2, AlertTriangle, MessageSquare, Briefcase, Zap, ClipboardList, RefreshCcw, BarChart2, Lightbulb, Globe, Settings, MapPin } from 'lucide-react';

const InfographicEditor = forwardRef(({ data, setData, theme, template }, ref) => {
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await axios.get('/api/brand');
        if (res.data.success && res.data.brandKit) {
          setBrand(res.data.brandKit);
        }
      } catch (e) {
        console.error("Failed to load brand kit");
      }
    };
    fetchBrand();
  }, []);
  if (!data) return null;

  const updateData = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = (field, index, value) => {
    setData(prev => {
      const newArray = [...(prev[field] || [])];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const updateActionItem = (index, subfield, value) => {
    setData(prev => {
      const newActions = [...(prev.actionItems || [])];
      newActions[index] = { ...newActions[index], [subfield]: value };
      return { ...prev, actionItems: newActions };
    });
  };

  // Theme Config
  const themes = {
    corporate: { bg: 'bg-white', text: 'text-slate-800', headerBg: 'bg-blue-900', headerText: 'text-white', accent: 'text-blue-600', cardBg: 'bg-slate-50', border: 'border-slate-200' },
    modern: { bg: 'bg-slate-900', text: 'text-slate-200', headerBg: 'bg-gradient-to-r from-cyan-600 to-blue-600', headerText: 'text-white', accent: 'text-cyan-400', cardBg: 'bg-slate-800', border: 'border-slate-700' },
    minimal: { bg: 'bg-[#fafafa]', text: 'text-gray-800', headerBg: 'bg-white', headerText: 'text-black border-b-4 border-black', accent: 'text-black font-bold', cardBg: 'bg-white', border: 'border-gray-200 shadow-sm' },
    dark: { bg: 'bg-black', text: 'text-gray-300', headerBg: 'bg-zinc-900', headerText: 'text-amber-500', accent: 'text-amber-500', cardBg: 'bg-zinc-900', border: 'border-zinc-800' },
    presentation: { bg: 'bg-indigo-50', text: 'text-indigo-950', headerBg: 'bg-indigo-600', headerText: 'text-white shadow-lg', accent: 'text-indigo-600', cardBg: 'bg-white', border: 'border-indigo-100 shadow-md' },
    google: { bg: 'bg-white', text: 'text-gray-800', headerBg: 'bg-white', headerText: 'text-gray-900', accent: 'text-blue-500', cardBg: 'bg-white shadow-md rounded-2xl', border: 'border-gray-100' },
    canva: { bg: 'bg-[#F3F4F6]', text: 'text-[#0E131F]', headerBg: 'bg-gradient-to-r from-purple-500 to-pink-500', headerText: 'text-white', accent: 'text-purple-600', cardBg: 'bg-white', border: 'border-transparent shadow-lg rounded-3xl' },
    apple: { bg: 'bg-[#fbfbfd]', text: 'text-[#1d1d1f]', headerBg: 'bg-[#fbfbfd]', headerText: 'text-[#1d1d1f] font-semibold', accent: 'text-[#0066cc]', cardBg: 'bg-white shadow-sm rounded-3xl', border: 'border-gray-200/50' },
    startup: { bg: 'bg-[#0f172a]', text: 'text-[#cbd5e1]', headerBg: 'bg-[#1e293b]', headerText: 'text-[#38bdf8]', accent: 'text-[#f59e0b]', cardBg: 'bg-[#1e293b] shadow-2xl rounded-2xl', border: 'border-[#334155]' }
  };

  const t = themes[theme] || themes.corporate;
  
  // Custom Brand overrides
  const customAccentStyle = brand?.primaryColor ? { color: brand.primaryColor } : {};
  const customBgStyle = brand?.primaryColor ? { backgroundColor: brand.primaryColor } : {};

  const renderTemplate = () => {
    switch(template) {
      case 'premium_visual':
        return (
          <div className="bg-[#f0f4f8] w-full min-h-full font-sans pb-24">
            {/* Header Area */}
            <div className="relative bg-[#0a192f] text-white flex justify-end items-center px-12 py-16 h-64 shadow-xl overflow-hidden">
              <div className="absolute left-0 bottom-0 z-10 w-[400px] h-[350px] flex items-end">
                <img src="/avatar.png" alt="Illustration" className="w-full h-full object-contain object-bottom scale-[1.1] transform origin-bottom-left -ml-4" />
              </div>
              <div className="w-3/5 text-right z-20">
                <EditableText value={data.title} onChange={(v) => updateData('title', v)} className="text-4xl font-black uppercase mb-3 text-cyan-300" as="h1" />
                <div className="flex items-center justify-end gap-2 text-slate-300 text-lg font-bold bg-white/10 px-4 py-2 rounded-lg inline-flex">
                  <Calendar size={20} className="text-cyan-400" /> 
                  <EditableText value={data.date} onChange={(v) => updateData('date', v)} />
                </div>
              </div>
              <div className="absolute top-8 right-8 opacity-10">
                <ClipboardList size={120} />
              </div>
            </div>

            {/* Main Content Container */}
            <div className="px-12 -mt-4 space-y-6 relative z-30">
              
              {/* Attendees Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex">
                <div className="bg-teal-500 w-24 flex items-center justify-center shrink-0">
                  <Users size={32} className="text-white" />
                </div>
                <div className="p-6 flex-1">
                  <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Attendees:</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    {(data.attendees || []).map((person, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
                          <Users size={16} className="text-teal-600" />
                        </div>
                        <EditableText value={person} onChange={(v) => updateArrayItem('attendees', idx, v)} className="text-slate-700 font-bold text-lg" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Discussion Points Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#5b4a8e] flex items-center justify-center text-white shadow-md">
                    <MessageSquare size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-[#5b4a8e] tracking-tight">Discussion Points:</h3>
                </div>
                <div className="h-px bg-purple-100 mx-6"></div>
                <div className="p-6 px-10">
                  <ul className="space-y-6">
                    {(data.discussionPoints || []).map((point, idx) => {
                      const icons = [<BarChart2/>, <Lightbulb/>, <Globe/>, <Calendar/>, <Users/>];
                      const Icon = icons[idx % icons.length];
                      return (
                        <li key={idx} className="flex items-start gap-5 border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                          <div className="mt-1 w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-[#5b4a8e] shrink-0 border border-purple-100">
                            {Icon}
                          </div>
                          <EditableText value={point} onChange={(v) => updateArrayItem('discussionPoints', idx, v)} as="textarea" className="w-full text-slate-700 text-lg resize-none outline-none font-medium leading-relaxed bg-transparent" />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Grid: Outcomes & Actions */}
              <div className="grid grid-cols-2 gap-6">
                
                {/* Key Outcomes */}
                <div className="bg-white rounded-2xl shadow-lg border border-green-50 overflow-hidden flex flex-col h-full">
                  <div className="p-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md">
                      <Target size={26} />
                    </div>
                    <h3 className="text-2xl font-black text-emerald-700 tracking-tight">Key Outcomes:</h3>
                  </div>
                  <div className="h-px bg-green-50 mx-6"></div>
                  <div className="p-6 flex-1">
                    <ul className="space-y-5">
                      {(data.keyDecisions || []).map((dec, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                            <CheckCircle2 size={18} />
                          </div>
                          <EditableText value={dec} onChange={(v) => updateArrayItem('keyDecisions', idx, v)} as="textarea" className="w-full text-slate-700 font-medium text-lg resize-none outline-none leading-snug bg-transparent" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Items */}
                <div className="bg-white rounded-2xl shadow-lg border border-blue-50 overflow-hidden flex flex-col h-full">
                  <div className="p-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-md">
                      <ClipboardList size={26} />
                    </div>
                    <h3 className="text-2xl font-black text-blue-600 tracking-tight">Action Items:</h3>
                  </div>
                  <div className="h-px bg-blue-50 mx-6"></div>
                  <div className="p-6 flex-1">
                    <ul className="space-y-5">
                      {(data.actionItems || []).map((action, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                            <Settings size={18} />
                          </div>
                          <EditableText value={action.task} onChange={(v) => updateActionItem(idx, 'task', v)} as="textarea" className="w-full text-slate-700 font-medium text-lg resize-none outline-none leading-snug bg-transparent" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Status Updates */}
              {data.statusUpdates && data.statusUpdates.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-orange-50 overflow-hidden relative">
                  <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-8 translate-y-8">
                    <ClipboardList size={180} className="text-slate-800" />
                  </div>
                  <div className="p-6 flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0 shadow-md">
                      <RefreshCcw size={26} />
                    </div>
                    <h3 className="text-2xl font-black text-orange-600 tracking-tight">Status:</h3>
                  </div>
                  <div className="h-px bg-orange-50 mx-6 relative z-10"></div>
                  <div className="p-6 px-10 relative z-10">
                    <ul className="space-y-5">
                      {(data.statusUpdates || []).map((stat, idx) => {
                        const icons = [<BarChart2/>, <MapPin/>];
                        const Icon = icons[idx % icons.length];
                        return (
                          <li key={idx} className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                              {Icon}
                            </div>
                            <EditableText value={stat} onChange={(v) => updateArrayItem('statusUpdates', idx, v)} as="textarea" className="w-full text-slate-700 font-medium text-lg resize-none outline-none leading-snug bg-transparent" />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}

            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="p-12">
            <div className={`border-l-4 ${t.border} ml-8 space-y-12`}>
              {/* Discussion Nodes */}
              {(data.discussionPoints || []).map((point, idx) => (
                <div key={`disc-${idx}`} className="relative pl-8">
                  <div className={`absolute -left-[22px] top-0 w-10 h-10 rounded-full ${t.headerBg} ${t.headerText} flex items-center justify-center border-4 ${t.bg}`}>
                    <MessageSquare size={16} />
                  </div>
                  <EditableText value={point} onChange={(v) => updateArrayItem('discussionPoints', idx, v)} className="text-lg font-medium leading-relaxed" as="p" />
                </div>
              ))}
              
              {/* Action Nodes */}
              {(data.actionItems || []).map((action, idx) => (
                <div key={`act-${idx}`} className="relative pl-8">
                  <div className={`absolute -left-[22px] top-0 w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center border-4 ${t.bg}`}>
                    <Target size={16} />
                  </div>
                  <div className={`p-6 rounded-xl ${t.cardBg} ${t.border} border`}>
                    <EditableText value={action.task} onChange={(v) => updateActionItem(idx, 'task', v)} className="text-xl font-bold mb-2" />
                    <div className="flex gap-4 text-sm opacity-80 mt-4">
                      <span className="flex items-center gap-1"><Users size={16}/> <EditableText value={action.owner} onChange={(v) => updateActionItem(idx, 'owner', v)} /></span>
                      <span className="flex items-center gap-1"><Calendar size={16}/> <EditableText value={action.deadline} onChange={(v) => updateActionItem(idx, 'deadline', v)} /></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'action_board':
        return (
          <div className="p-10">
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className={`p-8 rounded-2xl ${t.cardBg} ${t.border} border`}>
                <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${t.accent}`}><CheckCircle2 size={24}/> Decisions</h3>
                <ul className="space-y-4">
                  {(data.keyDecisions || []).map((dec, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className={`mt-1 ${t.accent}`}>•</span>
                      <EditableText value={dec} onChange={(v) => updateArrayItem('keyDecisions', idx, v)} className="leading-relaxed" as="p" />
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`p-8 rounded-2xl bg-red-50/10 border border-red-200/20`}>
                <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 text-red-500`}><AlertTriangle size={24}/> Risks</h3>
                <ul className="space-y-4">
                  {(data.risks || []).map((risk, idx) => (
                    <li key={idx} className="flex gap-3 text-red-400">
                      <span className="mt-1">•</span>
                      <EditableText value={risk} onChange={(v) => updateArrayItem('risks', idx, v)} className="leading-relaxed" as="p" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${t.accent}`}><Target size={24}/> Action Board</h3>
            <div className="grid grid-cols-3 gap-4">
              {(data.actionItems || []).map((action, idx) => (
                <div key={idx} className={`p-5 rounded-xl ${t.cardBg} ${t.border} border flex flex-col justify-between min-h-[160px]`}>
                  <EditableText value={action.task} onChange={(v) => updateActionItem(idx, 'task', v)} className="font-bold text-lg mb-4 line-clamp-3" as="p" />
                  <div>
                    <div className="flex justify-between items-center text-xs opacity-70 mb-2">
                      <EditableText value={action.owner} onChange={(v) => updateActionItem(idx, 'owner', v)} />
                      <EditableText value={action.status} onChange={(v) => updateActionItem(idx, 'status', v)} className="uppercase font-bold" />
                    </div>
                    <div className={`w-full h-1.5 rounded-full opacity-20 ${t.headerBg}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'meeting_minutes':
      default:
        return (
          <div className="p-10 flex flex-col gap-8">
            {/* Attendees & Agenda */}
            <div className="grid grid-cols-3 gap-8">
              <div className={`col-span-1 p-6 rounded-xl ${t.cardBg} ${t.border} border`}>
                <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${t.accent} flex items-center gap-2`}><Users size={16}/> Attendees</h3>
                <div className="flex flex-wrap gap-2">
                  {(data.attendees || []).map((person, idx) => (
                    <span key={idx} className={`px-3 py-1 text-sm rounded-full bg-black/5 dark:bg-white/10`}>
                      <EditableText value={person} onChange={(v) => updateArrayItem('attendees', idx, v)} />
                    </span>
                  ))}
                </div>
              </div>
              
              <div className={`col-span-2 p-6 rounded-xl ${t.cardBg} ${t.border} border`}>
                <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${t.accent} flex items-center gap-2`}><Briefcase size={16}/> Agenda</h3>
                <ul className="space-y-2">
                  {(data.agenda || []).map((item, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <span className={`font-bold opacity-50`}>{idx + 1}.</span>
                      <EditableText value={item} onChange={(v) => updateArrayItem('agenda', idx, v)} className="flex-1" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Discussions */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${t.accent}`}><MessageSquare size={20}/> Discussions</h3>
                <ul className="space-y-4">
                  {(data.discussionPoints || []).map((point, idx) => (
                    <li key={idx} className={`p-4 rounded-xl ${t.cardBg} ${t.border} border`}>
                      <EditableText value={point} onChange={(v) => updateArrayItem('discussionPoints', idx, v)} as="textarea" className="w-full text-sm leading-relaxed bg-transparent resize-none h-full outline-none" />
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${t.accent}`}><CheckCircle2 size={20}/> Decisions</h3>
                <ul className="space-y-4">
                  {(data.keyDecisions || []).map((dec, idx) => (
                    <li key={idx} className={`p-4 rounded-xl ${t.cardBg} ${t.border} border border-l-4 border-l-emerald-500`}>
                      <EditableText value={dec} onChange={(v) => updateArrayItem('keyDecisions', idx, v)} as="textarea" className="w-full text-sm leading-relaxed bg-transparent resize-none h-full outline-none" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div ref={ref} className={`w-[900px] min-h-[1200px] ${t.bg} ${t.text} font-sans relative`}>
      
      {/* Conditional Universal Header */}
      {template !== 'premium_visual' && (
        <div className={`${t.headerBg} ${t.headerText} px-12 py-16 text-center relative`} style={theme === 'corporate' ? customBgStyle : {}}>
          
          {/* Brand Logo Injection */}
          {brand?.logoUrl && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center p-2 z-10 border-4 border-white">
              <img src={brand.logoUrl} alt="Brand Logo" className="w-full h-full object-contain" />
            </div>
          )}

          <div className={`max-w-3xl mx-auto ${brand?.logoUrl ? 'mt-16' : ''}`}>
            <EditableText 
              value={data.title} 
              onChange={(v) => updateData('title', v)} 
              className="text-5xl font-black mb-6 uppercase tracking-tight leading-tight" 
              as="h1"
            />
            <div className="flex justify-center items-center gap-8 text-lg font-medium opacity-90">
              <span className="flex items-center gap-2"><Calendar size={20} /> <EditableText value={data.date} onChange={(v) => updateData('date', v)} /></span>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Content */}
      {renderTemplate()}
      
      {/* Conditional Universal Footer */}
      {template !== 'premium_visual' && (
        <div className={`absolute bottom-0 w-full p-8 text-center text-sm font-bold opacity-40 flex justify-between px-12 items-center`}>
          <span className="flex items-center gap-2"><Zap size={14}/> AI Generated Infographic</span>
          {brand?.logoUrl ? <img src={brand.logoUrl} className="h-6 opacity-60 grayscale" alt="footer logo" /> : <span>{data.date}</span>}
        </div>
      )}
      
      {/* Custom Footer for Premium Visual */}
      {template === 'premium_visual' && (
        <div className="absolute bottom-0 w-full bg-[#0a192f] text-white p-4 text-center text-sm font-medium tracking-wide flex justify-center items-center gap-4">
          <span className="flex items-center gap-2"><Users size={16} className="text-cyan-400" /> TEAMWORK. STRATEGY. SUCCESS.</span>
          <span className="opacity-50">|</span>
          <span className="text-cyan-200">Plan Well. Execute Better. Deliver Results.</span>
        </div>
      )}
    </div>
  );
});

InfographicEditor.displayName = 'InfographicEditor';
export default InfographicEditor;
