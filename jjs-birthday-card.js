// jjs-birthday-card.js
import { LitElement, html, css } from "https://unpkg.com/lit-element@3.0.0/lit-element.js?module";

class JsSimpleBirthdayCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  static get styles() {
    return css`
      .card {
        padding: 16px;
        border-radius: 12px;
        background: var(--ha-card-background, #fff);
        color: var(--primary-text-color, #000);
        box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
      }
      .birthday {
        padding: 8px;
        border-bottom: 1px solid #ddd;
      }
      .today {
        background-color: #ffe082;
        font-weight: bold;
        border-radius: 8px;
        padding: 10px;
      }
      .header {
        font-size: 1.2em;
        font-weight: bold;
        margin-bottom: 8px;
      }
      .age {
        color: lightgrey;
      }
    `;
  }

  constructor() {
    super();
    this.config = {};
  }

  setConfig(config) {
    if (!config.birthdays) {
      throw new Error('You need to define birthdays');
    }
    // Gebruik de originele config van Home Assistant zodat live preview werkt
    this.config = config;
  }
  

  render() {
    if (!this.config.birthdays || !this.config.birthdays.length) {
      return html`<ha-card class="card"><div class="header">Geen verjaardagen toegevoegd</div></ha-card>`;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zorg dat vandaag begint op 00:00
    
    const upcoming = this.config.birthdays
    .map(b => {
      const orig = new Date(b.date); // originele geboortedatum
  
      // Verjaardag dit jaar
      let nextBirthday = new Date(today.getFullYear(), orig.getMonth(), orig.getDate());
  
      // Als verjaardag dit jaar al geweest is → pak volgend jaar
      if (nextBirthday < today) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
      }
  
      return { ...b, date: nextBirthday, originalDate: orig };
    })
    .filter(b => {
      const diffDays = (b.date - today) / (1000 * 60 * 60  * 24);
      return diffDays >= 0 && diffDays <= this.config.days_ahead;
    })
    .sort((a, b) => {
      if (this.config.sort_by === "name") {
        return a.name.localeCompare(b.name);   // alfabetisch sorteren
      }
      return a.date - b.date;                  // op datum sorteren
    });
    

    return html`
    <ha-card class="card">
      <div class="header">Verjaardagen komende ${this.config.days_ahead} dagen</div>
      ${upcoming.length === 0 
        ? html`<div class="birthday">Geen verjaardagen in de komende ${this.config.days_ahead} dagen</div>`
        : upcoming.map((b, index) => {
          const isToday = b.date.getDate() === today.getDate() && b.date.getMonth() === today.getMonth();
      
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          const isTomorrow = b.date.getDate() === tomorrow.getDate() && b.date.getMonth() === tomorrow.getMonth();
      
          const birthDate = new Date(b.originalDate);
          const age = b.date.getFullYear() - birthDate.getFullYear();
      
          // 🎉 Verschillende iconen per regel (cyclisch)
          const icons = ["🎉", "🎂", "🎁", "🎈", "✨", "🥳", "🍰"];
          const icon = icons[index % icons.length];
      
          const dateText = isToday
            ? "vandaag"
            : isTomorrow
            ? "morgen"
            : b.date.toLocaleDateString('nl-NL', { day: '2-digit', month: 'long' });
      
          // ✅ Automatische tekstkleur t.o.v. today_color
          const bgColor = this.config.today_color || "#ffe082";
          const getTextColor = (hex) => {
            const c = hex.startsWith('#') ? hex.slice(1) : hex;
            const rgb = parseInt(c, 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >> 8) & 0xff;
            const b = rgb & 0xff;
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128 ? 'black' : 'white';
          };
          const textColor = getTextColor(bgColor);
      
          return html`
            <div class="birthday"
                 style="
                   display:flex;
                   justify-content:space-between;
                   align-items:center;
                   ${isToday ? `background-color:${bgColor}; color:${textColor};` : ''}">
              <span>
                ${b.name}&nbsp;&nbsp;${icon}&nbsp;&nbsp;<span class="age" style="color:${isToday ? textColor : 'lightgrey'}">${age} jaar</span>
              </span>
              <span>${dateText}</span>
            </div>
          `;
      })      
      }
    </ha-card>
  `;
} 

  getCardSize() {
    return 3;
  }

  static async getConfigElement() {
    return document.createElement('jjs-birthday-card-editor');
  }
  
  static getStubConfig() {
    return { 
      days_ahead: 7, 
      sort_by: 'date', 
      birthdays: [
        { name: "Voorbeeld", date: new Date().toISOString().split('T')[0] }
      ] 
    };
  }
}

customElements.define("jjs-birthday-card", JsSimpleBirthdayCard);

// Register in window customCards
if (!window.customCards) window.customCards = [];
window.customCards.push({
  type: "jjs-birthday-card",
  name: "J's Simple Birthday Card",
  preview: true,
  description: "Een eenvoudige verjaardagskaart voor Home Assistant"
});
