import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Upload, FileText, Sparkles, Download, Copy, Image as ImageIcon, Presentation, FileDown, Type, Palette, LayoutTemplate } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { exportToPPTX } from '../utils/pptxExport';
import InfographicEditor from '../components/InfographicEditor';

const CreatePage = () => {
  const [rawNotes, setRawNotes] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  
  // Structured Data State
  const [meetingData, setMeetingData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  const [activeTheme, setActiveTheme] = useState('corporate');
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const canvasRef = useRef(null);

  const handleGenerate = async () => {
    if (!rawNotes.trim() || rawNotes.length < 20) {
      toast.error('Please enter detailed meeting notes (min 20 characters).');
      return;
    }

    setIsParsing(true);
    try {
      const res = await axios.post('/api/infographic/parse', { rawNotes });
      if (res.data.success) {
        setMeetingData(res.data.parsedData.data);
        setRecommendations(res.data.parsedData.top3Templates || ['meeting_minutes', 'timeline', 'action_board']);
        toast.success('Notes parsed successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to analyze meeting notes.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleExportPNG = async () => {
    if (!canvasRef.current) return;
    toast.loading('Generating high-res PNG...', { id: 'export' });
    try {
      const canvas = await html2canvas(canvasRef.current, { scale: 3, useCORS: true });
      const link = document.createElement('a');
      link.download = `${meetingData.title.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Downloaded PNG!', { id: 'export' });
    } catch (e) {
      toast.error('Export failed', { id: 'export' });
    }
  };

  const handleExportPDF = async () => {
    if (!canvasRef.current) return;
    toast.loading('Generating PDF...', { id: 'export' });
    try {
      const canvas = await html2canvas(canvasRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${meetingData.title.replace(/\s+/g, '_')}.pdf`);
      toast.success('Downloaded PDF!', { id: 'export' });
    } catch (e) {
      toast.error('Export failed', { id: 'export' });
    }
  };

  const handleExportPPTX = async () => {
    toast.loading('Building Presentation...', { id: 'export' });
    try {
      await exportToPPTX(meetingData, activeTheme);
      toast.success('Downloaded PPTX!', { id: 'export' });
    } catch (e) {
      toast.error('Export failed', { id: 'export' });
    }
  };

  const handleSaveToHistory = async () => {
    setIsSaving(true);
    try {
      await axios.post('/api/infographic/save', {
        title: meetingData.title,
        meetingType: 'Auto-Detected',
        template: activeTemplate,
        theme: activeTheme,
        data: meetingData
      });
      toast.success('Saved to History!');
    } catch (error) {
      toast.error('Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step 1: Input Notes */}
        <AnimatePresence mode="wait">
          {!meetingData ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">MeetGraph AI Engine</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">Paste your raw meeting notes and watch AI instantly structure and design a presentation-ready infographic.</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="text-primary-500" size={24} />
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Meeting Notes</h2>
                </div>
                <textarea
                  value={rawNotes}
                  onChange={(e) => setRawNotes(e.target.value)}
                  placeholder="Paste Zoom transcripts, Slack threads, or rough bullet points here..."
                  className="w-full h-64 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm text-slate-800 dark:text-slate-200"
                ></textarea>
                
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={handleGenerate}
                    disabled={isParsing}
                    className="btn-primary py-3 px-8 flex items-center gap-2 text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    {isParsing ? (
                      <><span className="animate-pulse">Analyzing with AI...</span></>
                    ) : (
                      <><Sparkles size={20} /> Generate Infographic</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            
            /* Step 1.5: Template Selection */
            !activeTemplate ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">AI Recommended Templates</h2>
                <p className="text-slate-500 mb-8">Based on your meeting notes, here are the best ways to visualize this data.</p>
                <div className="grid grid-cols-3 gap-6">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow border hover:border-primary-500 cursor-pointer" onClick={() => setActiveTemplate(rec.toLowerCase().replace(/\s+/g, '_'))}>
                      <h3 className="font-bold text-xl capitalize mb-2">{rec.replace(/_/g, ' ')}</h3>
                      <button className="mt-4 w-full btn-primary py-2">Select Template</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (

            /* Step 2: Editor Workspace */
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-8"
            >
              {/* Left Sidebar: Controls */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Palette size={18}/> Design Theme</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['corporate', 'modern', 'minimal', 'dark', 'presentation', 'google', 'canva', 'apple', 'startup'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setActiveTheme(t)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium capitalize border-2 transition-all ${activeTheme === t ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><LayoutTemplate size={18}/> Layout</h3>
                  <div className="space-y-2">
                    {['premium_visual', 'meeting_minutes', 'timeline', 'action_board'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setActiveTemplate(t)}
                        className={`w-full text-left py-3 px-4 rounded-xl text-sm font-medium capitalize border-2 transition-all ${activeTemplate === t ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                      >
                        {t.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Download size={18}/> Export</h3>
                  <div className="space-y-3">
                    <button onClick={handleExportPNG} className="w-full btn-secondary py-2 flex justify-center items-center gap-2"><ImageIcon size={16}/> PNG Image</button>
                    <button onClick={handleExportPDF} className="w-full btn-secondary py-2 flex justify-center items-center gap-2"><FileDown size={16}/> PDF Document</button>
                    <button onClick={handleExportPPTX} className="w-full btn-secondary py-2 flex justify-center items-center gap-2 bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 hover:border-orange-300"><Presentation size={16}/> PowerPoint</button>
                  </div>
                </div>
              </div>

              {/* Main Canvas */}
              <div className="lg:col-span-3 flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold border border-emerald-200">
                    <CheckCircle2 size={16} /> Data Structured
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setMeetingData(null)} className="btn-secondary py-2 px-4">Start Over</button>
                    <button onClick={handleSaveToHistory} disabled={isSaving} className="btn-primary py-2 px-6 shadow-md">{isSaving ? 'Saving...' : 'Save to History'}</button>
                  </div>
                </div>

                {/* Editable Canva-style Workspace Wrapper */}
                <div className="w-full max-w-4xl bg-slate-200 dark:bg-slate-900 p-8 rounded-3xl shadow-inner overflow-x-auto flex justify-center items-start min-h-[800px] border border-slate-300 dark:border-slate-700">
                  <div className="shadow-2xl transition-all duration-500 origin-top">
                    <InfographicEditor 
                      ref={canvasRef}
                      data={meetingData} 
                      setData={setMeetingData}
                      theme={activeTheme}
                      template={activeTemplate}
                    />
                  </div>
                </div>
              </div>

            </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreatePage;
