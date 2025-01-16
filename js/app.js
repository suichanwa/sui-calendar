import { Calendar } from './calendar.js';
import { NoticeDialog } from './dialog.js';

document.addEventListener('DOMContentLoaded', () => {
  const calendar = new Calendar();
  const dialog = new NoticeDialog();
  
  calendar.init();
  dialog.init();
});