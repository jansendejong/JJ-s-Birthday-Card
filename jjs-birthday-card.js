// JJS Birthday Card - Card + Editor in één JS bestand
import { LitElement, html, css } from "https://unpkg.com/lit-element@3.0.0/lit-element.js?module";

/* ------------------------------- */
/* 🎂 1. MAIN CARD COMPONENT       */
/* ------------------------------- */
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
        font-weight: bold;
        border-radius: 8px;
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
      throw new Error("You need to define birthdays");
    }
    this.config = config;
  }

  render() {
    if (!this.config.birthdays || !this.config.birthdays.length) {
      return html`<ha-card class="card"><div class="header">Geen verjaardagen toegevoegd</div></ha-card>`;
    }

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const bgToday = this.config.today_color || "#ffe082";

    const upcoming = this.config.birthdays
      .map(b => {
        const orig = new Date(b.date);
        let next = new Date(today.getFullYear(), orig.getMonth(), orig.getDate());
        if (next < today) next.setFullYear(next.getFullYear() + 1);
        return { ...b, date: next, originalDate: orig };
      })
      .filter(b => {
        const diffDays = (b.date - today) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= this.config.days_ahead;
      })
      .sort((a, b) => this.config.sort_by === "name" ? a.name.localeCompare(b.name) : a.date - b.date);

    return html`
      <ha-card class="card">
        <div class="header">Verjaardagen komende ${this.config.days_ahead} dagen</div>
        ${upcoming.length === 0 ? html`<div class="birthday">Geen verjaardagen in deze periode</div>` : ""}
        ${upcoming.map((b, idx) => {
          const isToday = b.date.getDate() === today.getDate() && b.date.getMonth() === today.getMonth();
          const icons = ["🎉","🎂","🎁","🎈","✨","🥳","🍰"];
          const icon = icons[idx % icons.length];
          const birth = new Date(b.originalDate);
          const age = b.date.getFullYear() - birth.getFullYear();

          const textColor = (hex => {
            const c = hex.startsWith('#') ? hex.slice(1) : hex;
            const rgb = parseInt(c, 16);
            const r = (rgb >> 16) & 0xff, g = (rgb >> 8) & 0xff, bl = rgb & 0xff;
            const brightness = (r * 299 + g * 587 + bl * 114) / 1000;
            return brightness > 128 ? "black" : "white";
          })(bgToday);

          return html`
            <div class="birthday" style="
              display:flex; justify-content:space-between; align-items:center;
              ${isToday ? `background:${bgToday}; color:${textColor};` : ""}">
              <span>${b.name} ${icon} <span class="age" style="color:${isToday ? textColor : "lightgrey"}">${age} jaar</span></span>
              <span>
                ${isToday ? "vandaag" : b.date.toLocaleDateString('nl-NL',{day:'2-digit',month:'long'})}
              </span>
            </div>
          `;
        })}
      </ha-card>
    `;
  }

  static async getConfigElement() {
    return document.createElement("jjs-birthday-card-editor");
  }

  static getStubConfig() {
    return {
      days_ahead: 7,
      sort_by: "date",
      today_color: "#ffe082",
      birthdays: [{ name: "Voorbeeldpersoon", date: new Date().toISOString().split("T")[0] }]
    };
  }
}
customElements.define("jjs-birthday-card", JsSimpleBirthdayCard);

if (!window.customCards) window.customCards = [];
window.customCards.push({
  type: "jjs-birthday-card",
  name: "JJ's Birthday Card",
  preview: true,
  description: "Laat verjaardagen zien met visuele editor."
});

/* ------------------------------- */
/* 🛠️ 2. CONFIG EDITOR COMPONENT */
/* ------------------------------- */
const newBirthday = () => ({ name: "", date: "" });

class JjsBirthdayCardEditor extends LitElement {
  static get properties() {
    return { hass: {}, _config: {}, _error: {} };
  }

  static get styles() {
    return css`
      :host { display:block; padding:16px; }
      .row { display:flex; gap:8px; margin-bottom:8px; }
      .list { border:1px solid #ddd; border-radius:8px; padding:8px; }
      .item { display:grid; grid-template-columns:1fr 140px 32px; gap:8px; align-items:center; }
      button { cursor:pointer; }
      .error { color:red; margin-top:8px; }
    `;
  }

  setConfig(config) {
    this._config = {
      birthdays: config.birthdays || [],
      sort_by: config.sort_by || "date",
      days_ahead: config.days_ahead || 7,
      today_color: config.today_color || "#ffe082",
    };
  }

  _fireChange() {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }

  _update(e, field) {
    this._config = { ...this._config, [field]: e.target.value };
    this._fireChange();
  }

  render() {
    const c = this._config;
    return html`
      <div class="row">
        <label>Sorteren op:</label>
        <select .value=${c.sort_by} @change=${e => this._update(e, "sort_by")}>
          <option value="date">Datum</option>
          <option value="name">Naam</option>
        </select>
        <label>Dagen vooruit:</label>
        <input type="number" min="1" max="365" .value=${c.days_ahead} @change=${e => this._update(e, "days_ahead")} />
        <label>Kleur vandaag:</label>
        <input type="color" .value=${c.today_color} @change=${e => this._update(e, "today_color")} />
      </div>

      <div class="list">
        <div style="display:flex; justify-content:space-between;">
          <strong>Verjaardagen</strong>
          <button @click=${() => { this._config.birthdays.push(newBirthday()); this._fireChange(); }}>+ Toevoegen</button>
        </div>
        ${c.birthdays.map((b, i) => html`
          <div class="item">
            <input type="text" .value=${b.name} @input=${e => { b.name = e.target.value; this._fireChange(); }} placeholder="Naam" />
            <input type="date" .value=${b.date} @change=${e => { b.date = e.target.value; this._fireChange(); }} />
            <button @click=${() => { c.birthdays.splice(i, 1); this._fireChange(); }}>🗑</button>
          </div>
        `)}
      </div>
    `;
  }
}
customElements.define("jjs-birthday-card-editor", JjsBirthdayCardEditor);
