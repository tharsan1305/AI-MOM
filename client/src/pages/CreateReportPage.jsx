import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Sparkles, FileText, Image as ImageIcon, FileDown, RotateCcw, BookmarkPlus, Check } from 'lucide-react';
import domtoimage from 'dom-to-image-more';
import jsPDF from 'jspdf';
import axios from 'axios';
import { geminiService } from '../services/geminiService';
import { TEMPLATES } from '../components/templates';
import { Camera, Upload, Loader2 } from 'lucide-react';

const CreateReportPage = () => {
  const [rawNotes, setRawNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef(null);
  
  // Results state
  const [structuredData, setStructuredData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [reportStyle, setReportStyle] = useState('quick');
  
  const templateRef = useRef(null);

  const handleAnalyze = async () => {
    setValidationError('');
    
    // Validation
    if (!rawNotes.trim()) {
      setValidationError('Please paste your meeting notes to continue.');
      return;
    }
    if (rawNotes.trim().length < 20) {
      setValidationError('Your notes are too short. Please provide at least a few sentences.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const data = await geminiService.analyzeNotes(rawNotes);
      setStructuredData(data);
      toast.success('Notes successfully analyzed and structured!');
    } catch (error) {
      toast.error(error.message || 'An error occurred during analysis.');
      setValidationError(error.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB.');
      return;
    }

    setIsExtracting(true);
    setValidationError('');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/api/ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success && res.data.text) {
        setRawNotes(prev => prev ? `${prev}\n\n${res.data.text}` : res.data.text);
        toast.success('Text extracted successfully! Please review it.');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to extract text from the image.';
      toast.error(msg);
      setValidationError(msg);
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownloadPNG = async () => {
    if (!templateRef.current) return;
    toast.loading('Capturing high-resolution PNG...', { id: 'export-png' });
    try {
      const node = templateRef.current;
      const dataUrl = await domtoimage.toPng(node, {
        bgcolor: '#ffffff',
        width: node.offsetWidth * 2,
        height: node.offsetHeight * 2,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left'
        }
      });
      const link = document.createElement('a');
      link.download = `${structuredData?.title ? structuredData.title.replace(/\\s+/g, '_') : 'Meeting_Report'}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('PNG downloaded successfully!', { id: 'export-png' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate PNG.', { id: 'export-png' });
    }
  };

  const handleDownloadPDF = async () => {
    if (!templateRef.current) return;
    toast.loading('Generating PDF document...', { id: 'export-pdf' });
    try {
      const node = templateRef.current;
      const imgData = await domtoimage.toJpeg(node, {
        bgcolor: '#ffffff',
        quality: 1.0,
        width: node.offsetWidth * 2,
        height: node.offsetHeight * 2,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left'
        }
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (node.offsetHeight * 2 * pdfWidth) / (node.offsetWidth * 2);
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${structuredData?.title ? structuredData.title.replace(/\\s+/g, '_') : 'Meeting_Report'}.pdf`);
      toast.success('PDF downloaded successfully!', { id: 'export-pdf' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate PDF.', { id: 'export-pdf' });
    }
  };

  const handleStartOver = () => {
    setStructuredData(null);
    setRawNotes('');
    setValidationError('');
    setIsSaved(false);
  };

  const handleSaveToHistory = async () => {
    setIsSaving(true);
    try {
      await axios.post('/api/infographic/save', {
        title: structuredData?.title || 'Meeting Report',
        template: reportStyle === 'quick' ? 'meeting_report' : 'illustrated_report',
        theme: 'corporate', // Default theme if needed
        data: structuredData
      });
      setIsSaved(true);
      toast.success('Report saved to your history!');
    } catch (error) {
      toast.error('Failed to save the report.');
    } finally {
      setIsSaving(false);
    }
  };

  const templateKey = reportStyle === 'quick' ? 'meeting_report' : 'illustrated_report';
  const TemplateComponent = TEMPLATES[templateKey].component;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Notes to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Visual Report</span>
          </h1>
          <p className="text-lg text-slate-600">
            Paste your messy, unstructured meeting notes below and our AI will instantly organize them into a professional infographic.
          </p>
        </div>

        {/* Dynamic Content Area */}
        {!structuredData ? (
          /* INPUT VIEW */
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <FileText size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Meeting Notes</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isExtracting || isAnalyzing}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {isExtracting ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                  {isExtracting ? 'Extracting...' : 'Scan/Upload Image'}
                </button>
              </div>
            </div>
            
            <div className="mb-6 relative">
              <textarea
                value={rawNotes}
                onChange={(e) => {
                  setRawNotes(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder="Example: Had a sync with marketing team. Sarah will review the Q3 budget by Friday..."
                className={`w-full h-64 p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y text-slate-700 text-sm md:text-base leading-relaxed placeholder-slate-400 outline-none transition-all ${isExtracting ? 'opacity-50' : ''}`}
                disabled={isAnalyzing || isExtracting}
              />
              
              {isExtracting && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl z-10">
                  <Loader2 size={32} className="animate-spin text-purple-600 mb-2" />
                  <p className="font-semibold text-slate-700">Extracting text from image...</p>
                </div>
              )}
              
              {validationError && (
                <p className="mt-3 text-sm font-semibold text-red-500 flex items-center gap-1">
                  ⚠️ {validationError}
                </p>
              )}
            </div>

            {/* Style Selector */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">Choose Report Style</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                
                {/* Option A: Quick Report */}
                <button
                  onClick={() => setReportStyle('quick')}
                  className={`flex-1 text-left relative overflow-hidden p-5 rounded-2xl border-2 transition-all duration-200 ${
                    reportStyle === 'quick' 
                      ? 'border-purple-600 bg-purple-50/50 shadow-md ring-4 ring-purple-600/10' 
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {reportStyle === 'quick' && (
                    <div className="absolute top-4 right-4 bg-purple-600 text-white rounded-full p-1 shadow-sm">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                  <div className="font-bold text-slate-900 mb-1 text-lg">Quick Report</div>
                  <div className="text-slate-600 text-sm">Clean, fast dashboard-style report.</div>
                </button>

                {/* Option B: Illustrated Report */}
                <button
                  onClick={() => setReportStyle('illustrated')}
                  className={`flex-1 text-left relative overflow-hidden p-5 rounded-2xl border-2 transition-all duration-200 ${
                    reportStyle === 'illustrated' 
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-4 ring-indigo-600/10' 
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {reportStyle === 'illustrated' && (
                    <div className="absolute top-4 right-4 bg-indigo-600 text-white rounded-full p-1 shadow-sm">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                  <div className="font-bold text-slate-900 mb-1 text-lg">Illustrated Report</div>
                  <div className="text-slate-600 text-sm">Polished, designed infographic style.</div>
                </button>

              </div>
            </div>
            
            <div className="flex justify-end border-t border-slate-100 pt-6">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Analyze & Generate
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* RESULTS VIEW */
          <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
            
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleStartOver}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <RotateCcw size={18} />
                  Analyze New Notes
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={handleDownloadPNG}
                  className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                >
                  <ImageIcon size={18} />
                  Download PNG
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-100 hover:border-purple-300 transition-colors"
                >
                  <FileDown size={18} />
                  Download PDF
                </button>
                <button 
                  onClick={handleSaveToHistory}
                  disabled={isSaving || isSaved}
                  className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BookmarkPlus size={18} />
                  {isSaved ? 'Saved!' : isSaving ? 'Saving...' : 'Save to History'}
                </button>
              </div>
            </div>

            {/* Template Render Container */}
            <div className="w-full overflow-x-auto pb-8 flex justify-center">
              <div 
                ref={templateRef} 
                className="w-full max-w-[900px] flex-shrink-0"
              >
                <TemplateComponent data={structuredData} />
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CreateReportPage;
