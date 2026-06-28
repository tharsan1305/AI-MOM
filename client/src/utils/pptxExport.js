import React from 'react';
import pptxgen from 'pptxgenjs';

export const exportToPPTX = async (data, themeName) => {
  const pptx = new pptxgen();
  
  // Theme basic colors
  const themes = {
    corporate: { bg: 'FFFFFF', title: '1E3A8A', text: '333333', accent: '3B82F6' },
    modern: { bg: '0F172A', title: '38BDF8', text: 'E2E8F0', accent: '10B981' },
    minimal: { bg: 'FAFAFA', title: '111827', text: '4B5563', accent: '000000' },
    dark: { bg: '000000', title: 'FFFFFF', text: 'A1A1AA', accent: 'F59E0B' },
    presentation: { bg: 'FFFFFF', title: '4338CA', text: '1F2937', accent: '4F46E5' },
  };
  
  const t = themes[themeName] || themes.corporate;

  // Title Slide
  const slide1 = pptx.addSlide();
  slide1.background = { fill: t.bg };
  slide1.addText(data.title || 'Meeting Summary', {
    x: 1, y: 2, w: 8, h: 1.5,
    fontSize: 44, bold: true, color: t.title, align: 'center'
  });
  slide1.addText(`Date: ${data.date || 'TBD'}`, {
    x: 1, y: 3.5, w: 8, h: 0.5,
    fontSize: 18, color: t.text, align: 'center'
  });

  // Overview Slide (Attendees & Agenda)
  if (data.attendees?.length > 0 || data.agenda?.length > 0) {
    const slide2 = pptx.addSlide();
    slide2.background = { fill: t.bg };
    slide2.addText('Meeting Overview', { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 32, bold: true, color: t.title });
    
    slide2.addText('Attendees', { x: 0.5, y: 1.5, w: 4, h: 0.5, fontSize: 20, bold: true, color: t.accent });
    if (data.attendees) {
      slide2.addText(data.attendees.join('\n'), { x: 0.5, y: 2.1, w: 4, h: 3, fontSize: 14, color: t.text, bullet: true });
    }

    slide2.addText('Agenda', { x: 5, y: 1.5, w: 4, h: 0.5, fontSize: 20, bold: true, color: t.accent });
    if (data.agenda) {
      slide2.addText(data.agenda.join('\n'), { x: 5, y: 2.1, w: 4, h: 3, fontSize: 14, color: t.text, bullet: true });
    }
  }

  // Discussion & Decisions Slide
  if (data.discussionPoints?.length > 0 || data.keyDecisions?.length > 0) {
    const slide3 = pptx.addSlide();
    slide3.background = { fill: t.bg };
    slide3.addText('Key Discussions & Decisions', { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 32, bold: true, color: t.title });
    
    let yPos = 1.5;
    if (data.discussionPoints?.length > 0) {
      slide3.addText('Discussion Points', { x: 0.5, y: yPos, w: 9, h: 0.4, fontSize: 18, bold: true, color: t.accent });
      slide3.addText(data.discussionPoints.join('\n'), { x: 0.5, y: yPos + 0.5, w: 9, h: 1.5, fontSize: 14, color: t.text, bullet: true });
      yPos += 2.2;
    }
    
    if (data.keyDecisions?.length > 0) {
      slide3.addText('Key Decisions', { x: 0.5, y: yPos, w: 9, h: 0.4, fontSize: 18, bold: true, color: t.accent });
      slide3.addText(data.keyDecisions.join('\n'), { x: 0.5, y: yPos + 0.5, w: 9, h: 1.5, fontSize: 14, color: t.text, bullet: true });
    }
  }

  // Action Items Slide
  if (data.actionItems?.length > 0) {
    const slide4 = pptx.addSlide();
    slide4.background = { fill: t.bg };
    slide4.addText('Action Items', { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 32, bold: true, color: t.title });
    
    const rows = [['Task', 'Owner', 'Deadline', 'Status']];
    data.actionItems.forEach(item => {
      rows.push([item.task || '-', item.owner || '-', item.deadline || '-', item.status || '-']);
    });
    
    slide4.addTable(rows, { 
      x: 0.5, y: 1.5, w: 9, 
      colW: [4, 2, 1.5, 1.5],
      border: { type: 'solid', pt: 1, color: 'CCCCCC' },
      fill: 'F7F7F7',
      fontSize: 12,
      color: '333333',
      rowH: 0.4,
      autoPage: true,
      valign: 'middle'
    });
  }

  await pptx.writeFile({ fileName: `${data.title.replace(/\s+/g, '_')}_Presentation.pptx` });
};
