import MeetingReportTemplate from './MeetingReportTemplate';
import IllustratedReportTemplate from './IllustratedReportTemplate';

export const TEMPLATES = {
  meeting_report: {
    id: 'meeting_report',
    name: 'Executive Meeting Report',
    component: MeetingReportTemplate
  },
  illustrated_report: {
    id: 'illustrated_report',
    name: 'Illustrated Meeting Report',
    component: IllustratedReportTemplate
  }
};
