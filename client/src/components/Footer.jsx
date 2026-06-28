import { Link } from 'react-router-dom';
import { MessageCircle, Briefcase, Code, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 21H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display font-bold text-xl tracking-tight">MeetGraph AI</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Transform your meeting notes into professional, actionable infographics in seconds.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><MessageCircle size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><Briefcase size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><Code size={20} /></a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-3 text-slate-500 dark:text-slate-400">
              <li><Link to="/#features" className="hover:text-primary-500 transition-colors">Features</Link></li>
              <li><Link to="/#templates" className="hover:text-primary-500 transition-colors">Templates</Link></li>
              <li><Link to="/#pricing" className="hover:text-primary-500 transition-colors">Pricing</Link></li>
              <li><Link to="/#showcase" className="hover:text-primary-500 transition-colors">Showcase</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary-500 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">API Reference</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 dark:text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} MeetGraph AI. All rights reserved.</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>by Tharsan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
