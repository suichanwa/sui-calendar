export class NoticeDialog {
  constructor() {
    this.notices = JSON.parse(localStorage.getItem('calendarNotices')) || {};
    this.dialog = document.getElementById('notice-dialog');
    this.closeBtn = document.getElementById('close-dialog');
    this.saveBtn = document.getElementById('save-notice');
    this.textArea = document.getElementById('notice-text');
    this.selectedDateSpan = document.getElementById('selected-date');
    this.currentDateKey = null;
  }

  init() {
    // Listen for day clicks from Calendar
    document.addEventListener('dayClick', (e) => {
      this.currentDateKey = e.detail.dateKey;
      this.openDialog(this.currentDateKey);
    });

    // Close dialog handlers
    this.closeBtn.addEventListener('click', () => this.closeDialog());
    this.dialog.addEventListener('click', (e) => {
      if (e.target === this.dialog) this.closeDialog();
    });

    // Save notice handler
    this.saveBtn.addEventListener('click', () => {
      this.saveNotice(this.currentDateKey, this.textArea.value);
      this.closeDialog();
    });
  }

  openDialog(dateKey) {
    this.selectedDateSpan.textContent = dateKey;
    this.textArea.value = this.notices[dateKey] || '';
    this.dialog.classList.add('active');
  }

  closeDialog() {
    this.dialog.classList.remove('active');
    this.currentDateKey = null;
    this.textArea.value = '';
  }

  saveNotice(dateKey, text) {
  if (text.trim()) {
    this.notices[dateKey] = text.trim();
  } else {
    delete this.notices[dateKey];
  }
  localStorage.setItem('calendarNotices', JSON.stringify(this.notices));
  // Make sure to create the event properly
  document.dispatchEvent(new CustomEvent('noticesUpdated'));
}
}