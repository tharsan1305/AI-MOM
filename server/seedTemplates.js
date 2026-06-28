const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Template = require('./models/Template');

dotenv.config({ override: true });

const templates = [
  {
    name: 'Executive Summary',
    category: 'Executive Summary',
    description: 'A high-level overview of key meeting points, perfect for C-level reporting.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80',
    defaultTheme: 'corporate',
    isPremium: false,
    componentName: 'executive_summary',
    useCase: 'Best for board meetings and leadership updates.',
    tags: ['business', 'executive', 'summary']
  },
  {
    name: 'Project Roadmap',
    category: 'Roadmap',
    description: 'Visual timeline of project milestones and upcoming deliverables.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
    defaultTheme: 'modern',
    isPremium: true,
    componentName: 'timeline',
    useCase: 'Best for sprint planning and product launches.',
    tags: ['timeline', 'project', 'planning']
  },
  {
    name: 'Action Board',
    category: 'Project Status',
    description: 'Task-focused board highlighting owners, deadlines, and statuses.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=400&q=80',
    defaultTheme: 'minimal',
    isPremium: false,
    componentName: 'action_board',
    useCase: 'Best for weekly syncs and agile standups.',
    tags: ['tasks', 'agile', 'kanban']
  },
  {
    name: 'SWOT Analysis',
    category: 'SWOT Analysis',
    description: 'Strategic planning template for Strengths, Weaknesses, Opportunities, and Threats.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80',
    defaultTheme: 'presentation',
    isPremium: true,
    componentName: 'swot',
    useCase: 'Best for strategic planning and marketing workshops.',
    tags: ['strategy', 'marketing', 'analysis']
  },
  {
    name: 'Classic Meeting Minutes',
    category: 'Meeting Minutes',
    description: 'Traditional layout capturing attendees, agenda, and discussion points.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=400&q=80',
    defaultTheme: 'google',
    isPremium: false,
    componentName: 'meeting_minutes',
    useCase: 'Best for general staff meetings and HR syncs.',
    tags: ['general', 'notes', 'hr']
  },
  {
    name: 'Startup Pitch Snapshot',
    category: 'Startup',
    description: 'Vibrant, high-energy layout focusing on vision and rapid decisions.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&q=80',
    defaultTheme: 'startup',
    isPremium: true,
    componentName: 'action_board',
    useCase: 'Best for investor updates and founder meetings.',
    tags: ['startup', 'pitch', 'vision']
  },
  {
    name: 'Technical Flowchart',
    category: 'Flowchart',
    description: 'Dark-themed flowchart summarizing technical architecture decisions.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    defaultTheme: 'dark',
    isPremium: true,
    componentName: 'timeline',
    useCase: 'Best for engineering syncs and system design reviews.',
    tags: ['engineering', 'tech', 'architecture']
  },
  {
    name: 'Marketing Campaign Review',
    category: 'Marketing Report',
    description: 'Visual layout for marketing KPIs, campaign tasks, and creative decisions.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
    defaultTheme: 'canva',
    isPremium: false,
    componentName: 'executive_summary',
    useCase: 'Best for marketing teams and creative agencies.',
    tags: ['marketing', 'campaign', 'creative']
  },
  {
    name: 'Quarterly Business Review',
    category: 'Business Report',
    description: 'Formal document structure for QBRs and performance metrics.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=400&q=80',
    defaultTheme: 'corporate',
    isPremium: true,
    componentName: 'meeting_minutes',
    useCase: 'Best for QBRs and annual reviews.',
    tags: ['qbr', 'business', 'metrics']
  },
  {
    name: 'Research Findings',
    category: 'Research Report',
    description: 'Academic style template focusing on data points and conclusions.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=400&q=80',
    defaultTheme: 'minimal',
    isPremium: false,
    componentName: 'timeline',
    useCase: 'Best for user research and scientific findings.',
    tags: ['research', 'data', 'academic']
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
    
    await Template.deleteMany();
    console.log('Cleared existing templates...');
    
    await Template.insertMany(templates);
    console.log('Successfully seeded 10 template documents.');
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
