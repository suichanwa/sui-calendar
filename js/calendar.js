export class Calendar {
  constructor() {
    this.date = new Date();
    this.months = [
      "suiJanuary", "suiFebruary", "suiMarch", "suiApril",
      "suiMay", "suiJune", "suiJuly", "suiAugust",
      "suiSeptember", "suiOctober", "suiNovember", "suiDecember"
    ];
    this.weekdays = [
      "suiday", "suituesday", "suiwednesday", "suithursday",
      "suifriday", "suisaturday", "suisunday", "suisui"
    ];

    // Initialize sounds
    this.sounds = {
      click: new Audio('/sounds/click.mp3'),
      open: new Audio('/sounds/open.mp3'),
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

  renderCalendar() {
    this.date.setDate(1);
    const monthDays = document.querySelector(".days");

    const lastDay = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    ).getDate();

    const prevLastDay = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      0
    ).getDate();

    const firstDayIndex = this.date.getDay();
    const lastDayIndex = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    ).getDay();

    // Adjusted for 8-day week
    const nextDays = 8 - lastDayIndex - 1;

    // Update month display
    document.querySelector(".sm").innerHTML = this.months[this.date.getMonth()];
    document.querySelector(".date h1").innerHTML = "sui's calendar";
    document.querySelector(".date p").innerHTML = "すいせいは今日かわいいいい";

    let days = "";

    for (let i = 1; i <= lastDay; i++) {
      const dateKey = `${this.date.getFullYear()}-${this.date.getMonth() + 1}-${i}`;
      const notices = JSON.parse(localStorage.getItem('calendarNotices')) || {};
      const hasNotice = notices[dateKey] ? '<i class="fas fa-star text-yellow-400 ml-1"></i>' : '';
      
      if (
        i === new Date().getDate() &&
        this.date.getMonth() === new Date().getMonth()
      ) {
        days += `<div class="today" data-date="${dateKey}">${i}${hasNotice}</div>`;
      } else {
        days += `<div data-date="${dateKey}">${i}${hasNotice}</div>`;
      }
    }

    // Next month's days
    for (let j = 1; j <= nextDays; j++) {
      const dateKey = `${this.date.getFullYear()}-${this.date.getMonth() + 2}-${j}`;
      days += `<div class="next-date" data-date="${dateKey}">${j}</div>`;
    }

    monthDays.innerHTML = days;

    // Add click handlers for days
    this.addDayClickHandlers();
  }

    addDayClickHandlers() {
    const dayElements = document.querySelectorAll('.days div');
    dayElements.forEach(day => {
        day.addEventListener('click', async () => {
        const dateKey = day.dataset.date;
        if (dateKey) {
            await this.playSound('click'); // Add click sound
            await this.playSound('open');  // Keep dialog open sound
            const event = new CustomEvent('dayClick', {
            detail: { dateKey: dateKey }
            });
            document.dispatchEvent(event);
        }
        });
    });
    }

  init() {
    // Initialize weekday headers
    const weekdayContainer = document.querySelector(".weekdays");
    weekdayContainer.innerHTML = this.weekdays
      .map(day => `<div class="text-primary font-medium">${day}</div>`)
      .join('');

    // Add navigation event listeners
    document.querySelector(".prev").addEventListener("click", async () => {
      await this.playSound('click');
      this.date.setMonth(this.date.getMonth() - 1);
      this.renderCalendar();
    });

    document.querySelector(".next").addEventListener("click", async () => {
      await this.playSound('click');
      this.date.setMonth(this.date.getMonth() + 1);
      this.renderCalendar();
    });

    document.addEventListener('noticesUpdated', () => {
      this.playSound('save');
      this.renderCalendar();
    });

    // Initial render
    this.renderCalendar();
  }
}