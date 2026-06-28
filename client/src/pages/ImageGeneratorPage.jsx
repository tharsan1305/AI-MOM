import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Download, Copy, Sparkles, Image as ImageIcon, Loader2, AlertCircle, ChevronDown, History, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const samplePrompts = [
  'A futuristic city with flying cars at sunset, cyberpunk style',
  'A serene Japanese garden with cherry blossoms and a koi pond',
  'An astronaut riding a horse on Mars, digital art',
  'A cozy cabin in a snowy forest with warm light from windows',
  'A steampunk mechanical owl perched on ancient books',
  'Abstract art with vibrant colors representing human emotions',
];

const sizes = [
  { value: '1024x1024', label: 'Square (1024×1024)', icon: '⬜' },
  { value: '1024x1792', label: 'Portrait (1024×1792)', icon: '📱' },
  { value: '1792x1024', label: 'Landscape (1792×1024)', icon: '🖥️' },
];

const ImageGeneratorPage = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState('');
  const [showSizeDD, setShowSizeDD] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.trim().length < 3) {
      toast.error('Please enter a prompt (at least 3 chars)');
      return;
    }
    setIsGenerating(true);
    setError('');
    setGeneratedImage(null);
    try {
      const res = await axios.post('/api/generate-image', { prompt: prompt.trim() });
      if (res.data.success) {
        setGeneratedImage(res.data.image);
        toast.success('Image generated successfully!');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to generate image.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage?.imageUrl) return;
    try {
      const r = await fetch(generatedImage.imageUrl);
      const blob = await r.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI_Image_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded!');
    } catch {
      window.open(generatedImage.imageUrl, '_blank');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copied!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-4">
          <Sparkles size={16} /> Powered by DALL·E 3
        </motion.div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">AI Image Generator</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">Transform your ideas into stunning images with AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div className="space-y-6">
          <div className="card p-8">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="text-primary-500" size={22} />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Prompt</h2>
            </div>
            <textarea value={prompt} onChange={(e) => { setPrompt(e.target.value); setError(''); }}
              placeholder="Describe the image you want to create..."
              className="input-field min-h-[160px] resize-y text-base" maxLength={4000}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleGenerate(); }} />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-slate-400">{prompt.length}/4000</span>
              <span className="text-xs text-slate-400">Ctrl+Enter to generate</span>
            </div>

            {/* Size Selector */}
            <div className="mt-5 relative">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">Image Size</label>
              <button onClick={() => setShowSizeDD(!showSizeDD)}
                className="input-field flex items-center justify-between cursor-pointer">
                <span>{sizes.find(s => s.value === size)?.icon} {sizes.find(s => s.value === size)?.label}</span>
                <ChevronDown size={16} className={`transition-transform ${showSizeDD ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showSizeDD && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
                    {sizes.map((s) => (
                      <button key={s.value} onClick={() => { setSize(s.value); setShowSizeDD(false); }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${size === s.value ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium' : 'text-slate-700 dark:text-slate-300'}`}>
                        <span>{s.icon}</span><span>{s.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {isGenerating ? <><Loader2 size={20} className="animate-spin" /> Generating...</> : <><Sparkles size={20} /> Generate Image</>}
              </button>
              {prompt && <button onClick={handleCopy} className="btn-secondary flex items-center gap-2 px-4" title="Copy prompt"><Copy size={18} /></button>}
            </div>
          </div>

          {/* Sample Prompts */}
          <div className="card p-6">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">✨ Try these prompts</h3>
            <div className="grid grid-cols-1 gap-2">
              {samplePrompts.map((s, i) => (
                <button key={i} onClick={() => { setPrompt(s); setError(''); }}
                  className="text-left text-sm px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-slate-600 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-300">
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Link to="/image-history" className="card p-5 flex items-center justify-between group hover:border-primary-300 dark:hover:border-primary-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center"><History size={20} /></div>
              <div><h4 className="font-bold text-slate-900 dark:text-white">View History</h4><p className="text-sm text-slate-500">See all your generated images</p></div>
            </div>
            <ArrowRight size={20} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
          </Link>
        </div>

        {/* Right: Preview */}
        <div className="space-y-6">
          <div className="card p-8 min-h-[500px] flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="text-primary-500" size={22} />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Preview</h2>
            </div>
            <AnimatePresence mode="wait">
              {isGenerating && (
                <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="relative mb-6"><div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 animate-pulse" /><Loader2 size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-spin" /></div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Creating your image...</h3>
                  <p className="text-slate-500 text-sm">This usually takes 10–30 seconds</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              {!isGenerating && error && (
                <motion.div key="err" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4"><AlertCircle size={32} className="text-red-500" /></div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Generation Failed</h3>
                  <p className="text-slate-500 text-sm max-w-sm">{error}</p>
                  <button onClick={handleGenerate} className="btn-primary mt-6 text-sm py-2 px-6" disabled={!prompt.trim()}>Try Again</button>
                </motion.div>
              )}
              {!isGenerating && !error && generatedImage && (
                <motion.div key="img" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                  <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex-1 group">
                    <img src={generatedImage.imageUrl} alt={generatedImage.prompt} className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                      <button onClick={handleDownload} className="bg-white/90 backdrop-blur-sm text-slate-900 px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:bg-white transition-colors shadow-lg"><Download size={18} /> Download</button>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <p className="text-sm text-slate-600 dark:text-slate-300 italic line-clamp-2">"{generatedImage.prompt}"</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-slate-400">{new Date(generatedImage.createdAt).toLocaleString()}</span>
                      <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full font-medium">{generatedImage.size}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleDownload} className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5"><Download size={18} /> Download</button>
                    <button onClick={handleCopy} className="btn-secondary flex items-center gap-2 px-4 py-2.5"><Copy size={18} /> Copy Prompt</button>
                  </div>
                </motion.div>
              )}
              {!isGenerating && !error && !generatedImage && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-6"><ImageIcon size={40} className="text-slate-300 dark:text-slate-500" /></div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Your image will appear here</h3>
                  <p className="text-slate-500 text-sm max-w-sm">Enter a descriptive prompt and click "Generate Image" to create AI artwork.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGeneratorPage;
