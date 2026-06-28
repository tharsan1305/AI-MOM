import React, { forwardRef, useMemo } from 'react';
import { Calendar, Users, Target, CheckCircle2, AlertCircle, Clock, LayoutList } from 'lucide-react';

const parseMeetingNotes = (text) => {
  const data = {
    title: 'Not provided',
    date: 'Not provided',
    attendees: [],
    discussion: [],
    outcomes: [],
    actions: [],
    deadlines: [],
    status: 'Not provided',
    footer: []
  };

  if (!text) return data;

  const lines = text.split('\n');
  let currentSection = null;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Detect sections using regex or simple match
    if (trimmed.match(/^Meeting Title:/i)) {
      data.title = trimmed.replace(/^Meeting Title:/i, '').trim() || 'Not provided';
      currentSection = null;
    } else if (trimmed.match(/^MOM\s*[-–]\s*/i)) {
      data.title = trimmed.replace(/^MOM\s*[-–]\s*/i, '').trim() || 'Not provided';
      currentSection = null;
    } else if (trimmed.match(/^Date:/i)) {
      data.date = trimmed.replace(/^Date:/i, '').trim() || 'Not provided';
      currentSection = null;
    } else if (trimmed.match(/^Attendees:/i)) {
      currentSection = 'attendees';
      const inlineData = trimmed.replace(/^Attendees:/i, '').trim();
      if (inlineData) data.attendees = inlineData.split(',').map(s => s.trim());
    } else if (trimmed.match(/^Status:/i)) {
      currentSection = 'status';
      const inlineData = trimmed.replace(/^Status:/i, '').trim();
      if (inlineData) data.status = inlineData;
      else data.status = ''; // Clear default to append bullets later
    } else if (trimmed.match(/^Discussion Points:/i)) {
      currentSection = 'discussion';
      const inlineData = trimmed.replace(/^Discussion Points:/i, '').trim();
      if (inlineData) data.discussion = inlineData.split(',').map(s => s.trim());
    } else if (trimmed.match(/^Key Outcomes:/i)) {
      currentSection = 'outcomes';
      const inlineData = trimmed.replace(/^Key Outcomes:/i, '').trim();
      if (inlineData) data.outcomes = inlineData.split(',').map(s => s.trim());
    } else if (trimmed.match(/^Action Items:/i)) {
      currentSection = 'actions';
      const inlineData = trimmed.replace(/^Action Items:/i, '').trim();
      if (inlineData) data.actions = inlineData.split(',').map(s => s.trim());
    } else if (trimmed.match(/^Deadlines:/i)) {
      currentSection = 'deadlines';
      const inlineData = trimmed.replace(/^Deadlines:/i, '').trim();
      if (inlineData) data.deadlines = inlineData.split(',').map(s => s.trim());
    } else if (currentSection) {
      if (trimmed.match(/^[-*•]/)) {
        const item = trimmed.replace(/^[-*•]\s*/, '').trim();
        if (currentSection === 'status') {
           data.status = data.status ? `${data.status} | ${item}` : item;
        } else {
           data[currentSection].push(item);
        }
      } else {
        // If it doesn't start with a bullet, and we are in 'status' section (which is the last one),
        // it is likely the footer!
        if (currentSection === 'status') {
           data.footer.push(trimmed);
        } else {
           // Multi-line bullet fallback
           if (data[currentSection].length > 0) {
              data[currentSection][data[currentSection].length - 1] += ' ' + trimmed;
           } else {
              data[currentSection].push(trimmed);
           }
        }
      }
    }
  });

  if (data.status === '') data.status = 'Not provided';
  return data;
};

const InfographicPreview = forwardRef(({ text, template }, ref) => {
  const data = useMemo(() => parseMeetingNotes(text), [text]);

  const renderTemplate = () => {
    switch (template) {
      case 'professional_report':
        return (
          <div className="bg-white p-10 h-full flex flex-col relative text-slate-800 border-t-8 border-slate-800">
            <div className="text-center mb-8 border-b-2 border-slate-200 pb-6">
              <h1 className="text-3xl font-black uppercase tracking-wide text-slate-900 mb-2">{data.title}</h1>
              <div className="w-16 h-1 bg-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">Date: {data.date}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-8 flex-grow">
              <div className="col-span-1 border-r border-slate-200 pr-8">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Users size={18} className="text-blue-500"/> Attendees</h3>
                  {data.attendees.length > 0 ? (
                    <ul className="space-y-2 text-sm text-slate-600">
                      {data.attendees.map((item, i) => <li key={i} className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> {item}</li>)}
                    </ul>
                  ) : <span className="text-sm text-slate-400 italic">Not provided</span>}
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><AlertCircle size={18} className="text-blue-500"/> Status</h3>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-700">
                    {data.status}
                  </div>
                </div>
              </div>
              
              <div className="col-span-2 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><LayoutList size={18} className="text-blue-500"/> Discussion Points</h3>
                  {data.discussion.length > 0 ? (
                    <ul className="space-y-3 text-slate-700">
                      {data.discussion.map((item, i) => <li key={i} className="flex items-start gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-1"/> <span>{item}</span></li>)}
                    </ul>
                  ) : <span className="text-sm text-slate-400 italic">Not provided</span>}
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Target size={18} className="text-blue-500"/> Action Items & Outcomes</h3>
                  {data.actions.length > 0 || data.outcomes.length > 0 ? (
                    <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                      {data.outcomes.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-bold text-blue-900 mb-2 uppercase tracking-wider">Outcomes</h4>
                          <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                            {data.outcomes.map((item, i) => <li key={i}>{item}</li>)}
                          </ul>
                        </div>
                      )}
                      {data.actions.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-blue-900 mb-2 uppercase tracking-wider">Next Steps</h4>
                          <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                            {data.actions.map((item, i) => <li key={i}>{item}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : <span className="text-sm text-slate-400 italic">Not provided</span>}
                </div>
              </div>
            </div>
            
            {data.footer && data.footer.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                {data.footer.map((line, i) => (
                  <p key={i} className={`text-slate-500 ${i === 0 ? 'font-bold uppercase tracking-widest text-xs text-slate-800' : 'italic text-sm mt-1'}`}>{line}</p>
                ))}
              </div>
            )}
          </div>
        );

      case 'timeline':
        return (
          <div className="bg-slate-50 p-8 h-full">
            <div className="bg-indigo-600 text-white p-6 rounded-2xl mb-8 shadow-lg">
              <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
              <div className="flex gap-4 text-indigo-100 text-sm">
                <span className="flex items-center gap-1"><Calendar size={16}/> {data.date}</span>
                <span className="flex items-center gap-1"><Users size={16}/> {data.attendees.length} Attendees</span>
              </div>
            </div>
            
            <div className="relative border-l-4 border-indigo-200 ml-6 space-y-8 pb-8">
              {data.discussion.length > 0 && (
                <div className="relative pl-8">
                  <div className="absolute w-8 h-8 bg-indigo-500 rounded-full -left-[18px] top-0 border-4 border-white flex items-center justify-center text-white"><LayoutList size={14}/></div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Discussion Points</h3>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <ul className="list-disc list-inside space-y-2 text-slate-600">
                      {data.discussion.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              )}
              
              {data.outcomes.length > 0 && (
                <div className="relative pl-8">
                  <div className="absolute w-8 h-8 bg-emerald-500 rounded-full -left-[18px] top-0 border-4 border-white flex items-center justify-center text-white"><CheckCircle2 size={14}/></div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Key Outcomes</h3>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <ul className="list-disc list-inside space-y-2 text-slate-600">
                      {data.outcomes.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              )}
              
              {data.actions.length > 0 && (
                <div className="relative pl-8">
                  <div className="absolute w-8 h-8 bg-orange-500 rounded-full -left-[18px] top-0 border-4 border-white flex items-center justify-center text-white"><Target size={14}/></div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Action Items & Deadlines</h3>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2 border-b pb-1">Tasks</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                        {data.actions.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2 border-b pb-1">Deadlines</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                        {data.deadlines.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'modern_business':
        return (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 h-full">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-3">{data.title}</h1>
              <div className="flex justify-center gap-6 text-slate-400">
                <span className="flex items-center gap-2"><Calendar size={18}/> {data.date}</span>
                <span className="flex items-center gap-2"><AlertCircle size={18}/> {data.status}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400"><LayoutList size={20}/> Discussion</h3>
                <ul className="space-y-3">
                  {data.discussion.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-400"><CheckCircle2 size={20}/> Outcomes</h3>
                <ul className="space-y-3">
                  {data.outcomes.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Target size={20}/> Action Plan</h3>
              <div className="grid grid-cols-2 gap-4">
                {data.actions.map((item, i) => (
                  <div key={i} className="bg-black/20 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-sm font-medium">{item}</span>
                    {data.deadlines[i] && <span className="text-xs bg-white/20 px-2 py-1 rounded text-blue-100 flex items-center gap-1"><Clock size={12}/>{data.deadlines[i]}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'linkedin':
        return (
          <div className="bg-white p-8 h-full border-t-8 border-blue-600">
            <div className="flex justify-between items-start mb-8 border-b pb-6">
              <div>
                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Meeting Summary</span>
                <h1 className="text-3xl font-black text-slate-900">{data.title}</h1>
              </div>
              <div className="text-right">
                <div className="text-slate-500 font-medium">{data.date}</div>
                <div className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full mt-2 inline-block">{data.status}</div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3 mb-4">Key Takeaways</h3>
              <div className="grid grid-cols-2 gap-4">
                {data.outcomes.map((item, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex gap-3 items-start">
                    <CheckCircle2 size={20} className="text-blue-600 shrink-0 mt-0.5"/>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-slate-800 border-l-4 border-orange-500 pl-3 mb-4">Next Steps</h3>
              <div className="space-y-3">
                {data.actions.map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0">
                    <span className="text-slate-700 flex items-center gap-2"><Target size={16} className="text-orange-500"/> {item}</span>
                    {data.deadlines[i] && <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-md">{data.deadlines[i]}</span>}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t flex items-center gap-2 text-slate-400 text-sm">
              <Users size={16}/> Attendees: {data.attendees.join(' • ')}
            </div>
          </div>
        );

      case 'mind_map':
        return (
          <div className="bg-emerald-50 p-8 h-full flex flex-col items-center justify-center relative overflow-hidden">
            {/* Mind map central node */}
            <div className="bg-emerald-600 text-white rounded-2xl p-6 text-center shadow-xl w-64 z-10 relative mb-12 border-4 border-emerald-200">
              <h1 className="text-2xl font-black mb-2">{data.title}</h1>
              <p className="text-emerald-100 text-sm">{data.date}</p>
            </div>
            
            {/* Connector lines (visual only) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] border-2 border-emerald-200 rounded-full opacity-50"></div>
            
            <div className="grid grid-cols-2 gap-x-32 gap-y-12 w-full max-w-3xl z-10 relative">
              <div className="bg-white p-5 rounded-xl shadow-md border-t-4 border-blue-500">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><LayoutList size={18} className="text-blue-500"/> Discussion</h3>
                <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                  {data.discussion.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-md border-t-4 border-green-500">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><CheckCircle2 size={18} className="text-green-500"/> Outcomes</h3>
                <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                  {data.outcomes.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-md border-t-4 border-orange-500">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Target size={18} className="text-orange-500"/> Actions</h3>
                <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                  {data.actions.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-md border-t-4 border-purple-500">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Clock size={18} className="text-purple-500"/> Deadlines</h3>
                <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                  {data.deadlines.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        );

      case 'corporate':
      default:
        return (
          <div className="bg-white p-8 h-full border border-slate-200">
            <div className="bg-slate-900 text-white p-8 -mx-8 -mt-8 mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
                <div className="flex gap-4 text-slate-400">
                  <span className="flex items-center gap-1"><Calendar size={16}/> {data.date}</span>
                  <span className="flex items-center gap-1"><AlertCircle size={16}/> {data.status}</span>
                </div>
              </div>
              <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold">
                MOM REPORT
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="col-span-2">
                <h3 className="text-lg font-bold text-slate-800 mb-3 border-b-2 border-slate-100 pb-2 flex items-center gap-2"><LayoutList size={20} className="text-blue-600"/> Discussion Points</h3>
                <ul className="space-y-2">
                  {data.discussion.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-600">
                      <span className="text-blue-500 font-bold shrink-0">{i+1}.</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-2"><Users size={16}/> Attendees</h3>
                <ul className="space-y-1 text-sm text-slate-600">
                  {data.attendees.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2"><CheckCircle2 size={20}/> Key Outcomes</h3>
                <ul className="list-disc list-inside space-y-2 text-blue-800">
                  {data.outcomes.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                <h3 className="text-lg font-bold text-orange-900 mb-3 flex items-center gap-2"><Target size={20}/> Action Items</h3>
                <ul className="space-y-3">
                  {data.actions.map((item, i) => (
                    <li key={i} className="flex justify-between items-start text-orange-800 border-b border-orange-200/50 pb-2 last:border-0">
                      <span className="font-medium pr-2">{item}</span>
                      {data.deadlines[i] && <span className="text-xs bg-orange-200 px-2 py-1 rounded whitespace-nowrap">{data.deadlines[i]}</span>}
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
    <div className="w-[800px] min-h-[600px] mx-auto bg-white shadow-2xl overflow-hidden font-sans">
      <div ref={ref} className="w-[800px] min-h-[600px] h-full">
        {renderTemplate()}
      </div>
    </div>
  );
});

InfographicPreview.displayName = 'InfographicPreview';

export default InfographicPreview;
