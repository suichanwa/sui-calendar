export class NoticeDialog {
  constructor() {
    this.notices = JSON.parse(localStorage.getItem('calendarNotices')) || {};
    this.dialog = document.getElementById('notice-dialog');
    this.closeBtn = document.getElementById('close-dialog');
    this.saveBtn = document.getElementById('save-notice');
    this.textArea = document.getElementById('notice-text');
    this.selectedDateSpan = document.getElementById('selected-date');
    this.currentDateKey = null;

    // Initialize sounds with adjusted volumes
    this.sounds = {
      close: new Audio('/sounds/click.mp3'),
      save: new Audio('/sounds/save.mp3')
    };

    // Set volume levels for better user experience
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

    // Close dialog handlers with animations
    this.closeBtn.addEventListener('click', () => this.closeDialog());
    this.dialog.addEventListener('click', async (e) => {
      if (e.target === this.dialog) {
        this.closeDialog();
      }
    });

    // Save notice handler with animations
    this.saveBtn.addEventListener('click', async () => {
      const form = this.dialog.querySelector('.notice-form');
      form.classList.add('saving');
      await this.saveNotice(this.currentDateKey, this.textArea.value);
      await this.closeDialog();
      form.classList.remove('saving');
    });

    // Add keyboard handlers
    document.addEventListener('keydown', (e) => {
      if (this.dialog.classList.contains('active')) {
        if (e.key === 'Escape') {
          this.closeDialog();
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          this.saveBtn.click();
        }
      }
    });

    // Add text area auto-resize
    this.textArea.addEventListener('input', () => {
      this.textArea.style.height = 'auto';
      this.textArea.style.height = (this.textArea.scrollHeight) + 'px';
    });
  }

  openDialog(dateKey) {
    this.selectedDateSpan.textContent = dateKey;
    this.textArea.value = this.notices[dateKey] || '';
    this.dialog.classList.add('active');
    const form = this.dialog.querySelector('.notice-form');
    form.classList.remove('animate-out');
    form.classList.add('animate-in');
    
    // Reset textarea height
    this.textArea.style.height = 'auto';
    this.textArea.style.height = (this.textArea.scrollHeight) + 'px';
    
    // Focus with slight delay for animation
    setTimeout(() => this.textArea.focus(), 300);
  }

  async closeDialog() {
    const form = this.dialog.querySelector('.notice-form');
    form.classList.remove('animate-in');
    form.classList.add('animate-out');

    await this.playSound('close');
    
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.dialog.classList.remove('active');
    this.currentDateKey = null;
    this.textArea.value = '';
    form.classList.remove('animate-out');
  }

  async saveNotice(dateKey, text) {
    if (text.trim()) {
      this.notices[dateKey] = text.trim();
    } else {
      delete this.notices[dateKey];
    }
    
    localStorage.setItem('calendarNotices', JSON.stringify(this.notices));
    await this.playSound('save');
    
    // Dispatch event after saving
    document.dispatchEvent(new CustomEvent('noticesUpdated'));
  }
}