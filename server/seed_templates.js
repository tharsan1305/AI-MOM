require('dotenv').config();
const mongoose = require('mongoose');
const Template = require('./models/Template');

const seedTemplates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/meetgraph');
    
    // Check if templates already exist
    const count = await Template.countDocuments();
    if (count > 0) {
      console.log('Templates already exist. Clearing...');
      await Template.deleteMany({});
    }

    const templates = [
      {
        name: 'Executive Summary',
        description: 'A clean, high-level overview of the most critical decisions and outcomes from your meeting. Perfect for sharing with stakeholders.',
        category: 'Business Report',
        isPremium: false,
        thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        layoutConfig: { style: 'executive' },
        componentName: 'MeetingReportTemplate'
      },
      {
        name: 'Product Roadmap',
        description: 'Visualize your upcoming milestones, phases, and key deliverables in a beautiful timeline format.',
        category: 'Roadmap',
        isPremium: true,
        thumbnailUrl: 'https://images.unsplash.com/photo-1512758117926-0e8638ee3269?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        layoutConfig: { style: 'timeline' },
        componentName: 'MeetingReportTemplate'
      },
      {
        name: 'SWOT Analysis',
        description: 'Transform your strategy notes into a professional 4-quadrant SWOT matrix with custom icons.',
        category: 'SWOT Analysis',
        isPremium: true,
        thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        layoutConfig: { style: 'grid' },
        componentName: 'MeetingReportTemplate'
      },
      {
        name: 'Sprint Retrospective',
        description: 'What went well? What didn\'t? Automatically structure your agile retrospectives into actionable items.',
        category: 'Project Status',
        isPremium: false,
        thumbnailUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        layoutConfig: { style: 'agile' },
        componentName: 'MeetingReportTemplate'
      },
      {
        name: 'Marketing Campaign',
        description: 'Track KPIs, audience segments, and campaign launch schedules in a vibrant, visual layout.',
        category: 'Marketing Report',
        isPremium: true,
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        layoutConfig: { style: 'marketing' },
        componentName: 'MeetingReportTemplate'
      },
      {
        name: 'Standard Meeting Minutes',
        description: 'The classic format: Attendees, Agenda, Discussion points, and Action Items.',
        category: 'Meeting Minutes',
        isPremium: false,
        thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        layoutConfig: { style: 'standard' },
        componentName: 'MeetingReportTemplate'
      }
    ];

    await Template.insertMany(templates);
    console.log('Successfully seeded templates');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedTemplates();
