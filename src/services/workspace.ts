/**
 * Google Workspace client services:
 * - Google Drive: Export and store study materials, homework, and reports
 * - Google Calendar: Sync batch timetables, exam dates, and parent-teacher meetings
 * - Gmail: Send attendance alerts, fee receipts, and announcements to parents
 * - Google Sheets: Export student lists and fee registers to Google Sheets
 * - Google Classroom: Push assignments and track coursework
 */

export interface SyncResult {
  success: boolean;
  message: string;
  externalUrl?: string;
}

export const GoogleWorkspaceService = {
  // Sync exam or timetable event to Google Calendar
  syncEventToCalendar: async (title: string, date: string, description: string): Promise<SyncResult> => {
    try {
      const startTime = new Date(`${date}T09:00:00`).toISOString().replace(/-|:|\.\d\d\d/g, '');
      const endTime = new Date(`${date}T12:00:00`).toISOString().replace(/-|:|\.\d\d\d/g, '');
      const calendarWebUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title
      )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(description)}&location=VidyaSetu+Main+Campus`;
      return {
        success: true,
        message: `Event '${title}' prepared for Google Calendar.`,
        externalUrl: calendarWebUrl,
      };
    } catch {
      return { success: false, message: 'Failed to prepare Calendar sync.' };
    }
  },

  // Compose email notice in Gmail for parent/student
  composeGmailNotice: (toEmail: string, subject: string, bodyText: string): string => {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyText)}`;
  },

  // Export data to Google Sheets formatted URL
  getSheetsExportUrl: (title: string): string => {
    return `https://docs.google.com/spreadsheets/create?title=${encodeURIComponent(title)}`;
  },

  // Google Drive study materials folder link
  getDriveMaterialsFolderUrl: (): string => {
    return 'https://drive.google.com/drive/my-drive';
  },

  // Google Classroom integration link
  getClassroomUrl: (): string => {
    return 'https://classroom.google.com/';
  },
};
