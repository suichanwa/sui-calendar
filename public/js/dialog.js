export class NoticeDialog {
  constructor() {
    this.notices = JSON.parse(localStorage.getItem('calendarNotices')) || {};
    this.dialog = document.getElementById('notice-dialog');
    this.closeBtn = document.getElementById('close-dialog');
    this.saveBtn = document.getElementById('save-notice');
    this.textArea = document.getElementById('notice-text');
    this.selectedDateSpan = document.getElementById('selected-date');
    this.currentDateKey = null;

    // Initialize sounds
    this.sounds = {
      close: new Audio('/sounds/click.mp3'),
      save: new Audio('/sounds/save.mp3')
    };

    // Set volume levels
    Object.values(this.sounds).forEach(sound => {
      sound.volume = 0.3;
    });
  }

  async playSound(soundName) {
    try {
      if (this.sounds[soundName]) {
        this.sounds[soundName].currentTime = 0;
        await this.sounds[soundName].play();
      }
    } catch (error) {
      console.log('Sound playback failed:', error);
    }
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
      if (e.target === this.dialog) {
        this.closeDialog();
      }
    });

    // Save notice handler
    this.saveBtn.addEventListener('click', async () => {
      await this.saveNotice(this.currentDateKey, this.textArea.value);
      await this.closeDialog();
    });

    // Add keyboard handlers
    document.addEventListener('keydown', (e) => {
      if (this.dialog.classList.contains('active')) {
        if (e.key === 'Escape') {
          this.closeDialog();
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          this.saveNotice(this.currentDateKey, this.textArea.value);
          this.closeDialog();
        }
      }
    });
  }

  openDialog(dateKey) {
    this.selectedDateSpan.textContent = dateKey;
    this.textArea.value = this.notices[dateKey] || '';
    this.dialog.classList.add('active');
    this.textArea.focus();
  }

  async closeDialog() {
    await this.playSound('close');
    this.dialog.classList.remove('active');
    this.currentDateKey = null;
    this.textArea.value = '';
  }

  async saveNotice(dateKey, text) {
    if (text.trim()) {
      this.notices[dateKey] = text.trim();
    } else {
      delete this.notices[dateKey];
    }
    
    localStorage.setItem('calendarNotices', JSON.stringify(this.notices));
    await this.playSound('save');
    document.dispatchEvent(new CustomEvent('noticesUpdated'));
  }
}