import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 w-full overflow-hidden">
      {/* Main Grid Area */}
      <div className="max-w-7xl w-full mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 w-full">
          
          {/* Column 1: Brand (Wider) */}
          <div className="sm:col-span-2 lg:col-span-2 w-full break-words pr-0 lg:pr-8">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 21H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">MinuteCraft</span>
            </Link>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Turn meeting minutes into visual intelligence.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Website" className="text-slate-500 hover:text-white transition-colors">
                <Globe size={20} />
              </a>
              <a href="#" aria-label="Contact" className="text-slate-500 hover:text-white transition-colors">
                <MessageCircle size={20} />
              </a>
              <a href="#" aria-label="Mail" className="text-slate-500 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="w-full">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link to="/#features" className="text-sm text-slate-400 hover:text-white transition-colors break-words">Features</Link></li>
              <li><Link to="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors break-words">Pricing</Link></li>
              <li><Link to="/#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors break-words">How it Works</Link></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors break-words">Integrations</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="w-full">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors break-words">About Us</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors break-words">Careers</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors break-words">Blog</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors break-words">Contact</a></li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div className="w-full">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors break-words">Documentation</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors break-words">Help Center</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors break-words">FAQ</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors break-words">API Docs</a></li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div className="w-full">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors break-words">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors break-words">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors break-words">Security</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors break-words">Cookie Policy</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl w-full mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p className="break-words text-center md:text-left">&copy; {new Date().getFullYear()} MinuteCraft. All rights reserved.</p>
          <div className="flex items-center gap-2 break-words text-center md:text-right">
            <span>Made with</span>
            <span className="text-red-500" aria-label="love">❤️</span>
            <span>by PRODIGIT ACADEMY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
