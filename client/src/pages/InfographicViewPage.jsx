import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import pptxgen from 'pptxgenjs';
import { toast } from 'react-hot-toast';
import { Download, Share2, ArrowLeft, Image as ImageIcon, FileText, Presentation, RefreshCw } from 'lucide-react';
import InfographicRenderer from '../components/InfographicRenderer';

const InfographicViewPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const infographicRef = useRef(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/infographic/${id}`);
        if (res.data.success) {
          setProject(res.data.project);
        }
      } catch (error) {
        toast.error('Failed to load infographic');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleExportPNG = async () => {
    if (!infographicRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(infographicRef.current, { scale: 2, useCORS: true });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${project.title.replace(/\s+/g, '_')}_Infographic.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Downloaded PNG successfully');
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!infographicRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(infographicRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${project.title.replace(/\s+/g, '_')}_Infographic.pdf`);
      toast.success('Downloaded PDF successfully');
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPPT = () => {
    if (!project) return;
    setIsExporting(true);
    try {
      const pptx = new pptxgen();
      const slide = pptx.addSlide();
      
      // Basic PPT Generation from JSON data
      slide.addText(project.metadata.meetingTitle || 'Meeting Notes', { x: 1, y: 1, w: 8, fontSize: 32, bold: true, color: '363636' });
      slide.addText(`Date: ${project.metadata.date || ''}`, { x: 1, y: 1.8, w: 8, fontSize: 14, color: '666666' });
      
      let currentY = 2.5;
      if (project.metadata.actionItems && project.metadata.actionItems.length > 0) {
        slide.addText('Action Items', { x: 1, y: currentY, w: 8, fontSize: 20, bold: true, color: '003366' });
        currentY += 0.5;
        project.metadata.actionItems.forEach(item => {
          slide.addText(`• ${item.task} (Assigned to: ${item.assignee || 'Unassigned'})`, { x: 1.5, y: currentY, w: 7, fontSize: 14 });
          currentY += 0.4;
        });
      }

      pptx.writeFile({ fileName: `${project.title.replace(/\s+/g, '_')}.pptx` });
      toast.success('Downloaded PPT successfully');
    } catch (error) {
      toast.error('PPT Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      const res = await axios.post(`/api/infographic/${id}/share`);
      if (res.data.success) {
        navigator.clipboard.writeText(res.data.shareUrl);
        toast.success('Share link copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to generate share link');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin text-primary-500" size={40} /></div>;
  }

  if (!project) {
    return <div className="text-center py-20"><h2 className="text-2xl font-bold">Project not found</h2></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">{project.title}</h1>
            <p className="text-xs text-slate-500">Template: {project.template.replace('_', ' ').toUpperCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleShare} className="btn-secondary py-2 flex items-center gap-2 text-sm">
            <Share2 size={16} /> Share Link
          </button>
          
          <div className="relative group">
            <button disabled={isExporting} className="btn-primary py-2 flex items-center gap-2 text-sm disabled:opacity-50">
              <Download size={16} /> Export As
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden hidden group-hover:block z-50">
              <button onClick={handleExportPNG} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-sm font-medium">
                <ImageIcon size={16} className="text-blue-500" /> Image (PNG)
              </button>
              <button onClick={handleExportPDF} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-sm font-medium">
                <FileText size={16} className="text-red-500" /> Document (PDF)
              </button>
              <button onClick={handleExportPPT} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-sm font-medium">
                <Presentation size={16} className="text-orange-500" /> Presentation (PPT)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="bg-slate-100 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 overflow-x-auto flex justify-center custom-scrollbar">
        {/* Render Engine Component */}
        <div className="transform scale-[0.8] origin-top md:scale-100 transition-transform">
          <InfographicRenderer 
            ref={infographicRef} 
            metadata={project.metadata} 
            template={project.template} 
          />
        </div>
      </div>
    </div>
  );
};

export default InfographicViewPage;
