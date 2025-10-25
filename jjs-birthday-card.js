// jjs-birthday-card.js

// v2.0.1

// ------------- IMPORTS -------------
import { LitElement, html, css } 
  from "https://unpkg.com/lit-element@3.0.0/lit-element.js?module";

// ===================================
//   KAART COMPONENT
// ===================================
class JJsBirthdayCard extends LitElement {
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
        padding: 4px;
        border-radius: 12px;
        box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.3);
        margin-bottom: 4px;
        border: none; 
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
    this.config = {
      show_header: config.show_header !== false,
      hide_if_empty: config.hide_if_empty === true, // ✅ hier toegevoegd
      ...config,
    };
  }
  
  

  render() {
    const lang = this.hass?.language || 'en';
  
    const translations = {
      en: { header: (d)=>`Birthdays in the next ${d} days`, noBirthdays:"No birthdays added", noneUpcoming:"No upcoming birthdays", today:"today", tomorrow:"tomorrow", year:"years" },
      nl: { header: (d)=>`Verjaardagen komende ${d} dagen`, noBirthdays:"Geen verjaardagen toegevoegd", noneUpcoming:"Geen verjaardagen", today:"vandaag", tomorrow:"morgen", year:"jaar" },
      de: { header: (d)=>`Geburtstage in den nächsten ${d} Tagen`, noBirthdays:"Keine Geburtstage hinzugefügt", noneUpcoming:"Keine bevorstehenden Geburtstage", today:"heute", tomorrow:"morgen", year:"Jahre" },
      fr: { header: (d)=>`Anniversaires dans les ${d} prochains jours`, noBirthdays:"Aucun anniversaire ajouté", noneUpcoming:"Aucun anniversaire à venir", today:"aujourd'hui", tomorrow:"demain", year:"ans" },
      es: { header: (d)=>`Cumpleaños en los próximos ${d} días`, noBirthdays:"No se han añadido cumpleaños", noneUpcoming:"No hay cumpleaños próximos", today:"hoy", tomorrow:"mañana", year:"años" }
    };
    const t = translations[lang] || translations["en"];
  
    const today = new Date();
    today.setHours(0,0,0,0);
  
    // ✅ 1. Geen verjaardagen in config?
    if (!this.config.birthdays?.length) {
      if (this.config.hide_if_empty) return html``; // Hele kaart verbergen
      return html`
        <ha-card class="card">
          <div class="header">${t.noBirthdays}</div>
        </ha-card>
      `;
    }
  
    // ✅ 2. Bereken "upcoming"
    const upcoming = this.config.birthdays
      .map(b => {
        const orig = new Date(b.date);
        let next = new Date(today.getFullYear(), orig.getMonth(), orig.getDate());
        if (next < today) next.setFullYear(next.getFullYear() + 1);
        return { ...b, date: next, originalDate: orig };
      })
      .filter(b => {
        const diff = (b.date - today) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= this.config.days_ahead;
      })
      .sort((a,b) => this.config.sort_by === "name" ? a.name.localeCompare(b.name) : a.date - b.date);
  
    // ✅ 3. Als upcoming leeg is → verberg of toon melding
    if (upcoming.length === 0) {
      if (this.config.hide_if_empty) return html``; // Hele kaart verbergen
      return html`
        <ha-card class="card">
          <div class="header">${t.header(this.config.days_ahead)}</div>
          <div class="birthday">${t.noneUpcoming}</div>
        </ha-card>
      `;
    }
  

    return html`
      <ha-card class="card">
      ${this.config.show_header !== false ? html`
        <div class="header">
          ${this.config.custom_header && this.config.custom_header.trim() !== ""
            ? this.config.custom_header
            : t.header(this.config.days_ahead)}
        </div>
      ` : ''}         
      ${upcoming.length === 0
        ? (
            this.config.hide_if_empty
              ? html``  // ✅ Hele kaart verbergen
              : html`<div class="birthday">${t.noneUpcoming}</div>`
          )      
          : upcoming.map((b, index) => {
              const isToday =
                b.date.getDate() === today.getDate() &&
                b.date.getMonth() === today.getMonth();

              const tomorrow = new Date(today);
              tomorrow.setDate(today.getDate() + 1);
              const isTomorrow =
                b.date.getDate() === tomorrow.getDate() &&
                b.date.getMonth() === tomorrow.getMonth();

              const birthDate = new Date(b.originalDate);
              const age = b.date.getFullYear() - birthDate.getFullYear();

              const icons = ["🎉", "🎂", "🎁", "🎈", "✨", "🥳", "🍰"];
              const icon = icons[index % icons.length];

              const dateText = isToday
              ? t.today
              : isTomorrow
              ? t.tomorrow
              : b.date.toLocaleDateString(lang, { 
                  day: "2-digit", 
                  month: "long" 
                });

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
                  style="display:flex;justify-content:space-between;align-items:center;
                  ${isToday ? `background-color:${bgColor}; color:${textColor};` : ''}">
                  <span>
                    ${b.name}&nbsp;${icon}
                    <span class="age" style="color:${isToday ? textColor : 'lightgrey'}">
                      (${age} ${lang === 'nl' ? 'jaar' : t.year})
                    </span>
                  </span>
                  <span>${dateText}</span>
                </div>
              `;
            })}
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
        { name: "Voorbeeld", date: new Date().toISOString().split('T')[0] },
      ],
    };
  }
}

customElements.define("jjs-birthday-card", JJsBirthdayCard);


// ===================================
//   EDITOR COMPONENT
// ===================================
const makeEmptyBirthday = () => ({ name: "", date: "" });

class JJsBirthdayCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
      _error: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
      }
      .row {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 8px;
      }
      .list {
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 8px;
        padding: 8px;
        margin-bottom: 12px;
      }
      .item {
        display: grid;
        grid-template-columns: 1fr 140px 32px;
        gap: 8px;
        align-items: center;
        padding: 6px;
      }
      label {
        font-size: 0.9rem;
        color: var(--secondary-text-color, #666);
      }
      input[type="text"], input[type="date"], input[type="number"], select {
        width: 100%;
        padding: 6px 8px;
        border-radius: 6px;
        border: 1px solid var(--divider-color, #ddd);
        box-sizing: border-box;
      }
      button.icon {
        width: 36px;
        height: 36px;
        border-radius: 6px;
        border: none;
        background-color: transparent;
        color: white;
        font-size: 1.4rem;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      button.icon.delete {
        background-color: transparent;
        color: red;
      }

      button.icon:hover {
        filter: brightness(1.1);
      }

      button.icon.delete:hover {
        filter: brightness(1.2);
      }
      .controls {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .error {
        color: var(--error-color, #b00020);
        margin-top: 8px;
      }
      .toggle-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }

      .switch {
        position: relative;
        display: inline-block;
        width: 42px;
        height: 22px;
      }

      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.3s;
        border-radius: 22px;
      }

      .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
      }

      input:checked + .slider {
        background-color: var(--primary-color, #03a9f4);
      }

      input:checked + .slider:before {
        transform: translateX(20px);
      }
    `;
  }

  constructor() {
    super();
    this._config = {};
    this._error = "";
  }

  setConfig(config) {
    const cfg = Object.assign({}, config || {});
    if (!Array.isArray(cfg.birthdays)) cfg.birthdays = [];
    cfg.birthdays = cfg.birthdays.map(b => ({ name: b.name || "", date: b.date || "" }));
    cfg.days_ahead = Number(cfg.days_ahead || 7);
    cfg.today_color = cfg.today_color || "#ffe082";

    if (cfg.days_ahead < 1) cfg.days_ahead = 1;
    if (cfg.days_ahead > 365) cfg.days_ahead = 365;

    cfg.sort_by = cfg.sort_by || "date";

    cfg.show_header = cfg.show_header !== false;

    cfg.custom_header = cfg.custom_header || "";

    cfg.hide_if_empty = config.hide_if_empty === true;

    this._config = cfg;
  }

  _fireConfigChanged() {
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    }));
  }

  _addBirthday() {
    this._config = {
      ...this._config,
      birthdays: [...this._config.birthdays, makeEmptyBirthday()],
    };
    this._fireConfigChanged();
  }

  _removeBirthday(idx) {
    const newList = this._config.birthdays.slice();
    newList.splice(idx, 1);
    this._config = { ...this._config, birthdays: newList };
    this._fireConfigChanged();
  }

  _updateBirthday(idx, field, ev) {
    const val = ev.target.value;
    const newList = this._config.birthdays.slice();
    newList[idx] = { ...newList[idx], [field]: val };
    this._config = { ...this._config, birthdays: newList };
    this._fireConfigChanged();
  }

  _updateSimpleField(field, ev) {
    let val = ev.target.type === "number" ? Number(ev.target.value) : ev.target.value;
    if (field === "days_ahead") {
      if (val < 1) val = 1;
      if (val > 365) val = 365;
    }
    this._config = { ...this._config, [field]: val };
    this._fireConfigChanged();
  }

  render() {
    const cfg = this._config || { birthdays: [], days_ahead: 7, sort_by: "date" };

    const lang = this.hass?.language || 'en';

    const translationsEditor = {
      en: {
        sortBy: "Sort by",
        daysAhead: "Days ahead",
        todayColor: "Today color",
        birthdays: "Birthdays",
        addNew: "Add new",
        noBirthdays: "No birthdays added",
        showHeader: "Show header",
        customHeader: "Custom header (optional)",
        headerPlaceholder: "E.g.: Birthdays this week",
        name: "Name",
        date: "Date",
        delete: "Delete",
        sortDate: "Date",
        sortName: "Name", 
        hide_if_empty: "Hide card when there are no upcoming birthdays"
      },
      nl: {
        sortBy: "Sorteren op",
        daysAhead: "Aantal dagen vooruit",
        todayColor: "Kleur voor verjaardag vandaag",
        birthdays: "Verjaardagen",
        addNew: "Nieuw toevoegen",
        noBirthdays: "Nog geen verjaardagen toegevoegd",
        showHeader: "Toon header",
        customHeader: "Eigen header tekst (optioneel)",
        headerPlaceholder: "Bijv: Verjaardagen deze week",
        name: "Naam",
        date: "Datum",
        delete: "Verwijderen", 
        sortDate: "Datum", 
        sortName: "Naam",
        hide_if_empty: "Verberg kaart als er geen aankomende verjaardagen zijn"
      },
      fr: {
        sortBy: "Trier par",
        daysAhead: "Jours à l'avance",
        todayColor: "Couleur pour aujourd'hui",
        birthdays: "Anniversaires",
        addNew: "Ajouter",
        noBirthdays: "Aucun anniversaire ajouté",
        showHeader: "Afficher l'en-tête",
        customHeader: "Texte d'en-tête personnalisé (optionnel)",
        headerPlaceholder: "Ex: Anniversaires cette semaine",
        name: "Nom",
        date: "Date",
        delete: "Supprimer",
        sortDate: "Date", 
        sortName: "Nom", 
        hide_if_empty: "Masquer la carte s'il n'y a pas d'anniversaires à venir" 
      },
      es: {
        sortBy: "Ordenar por",
        daysAhead: "Días por adelantado",
        todayColor: "Color para hoy",
        birthdays: "Cumpleaños",
        addNew: "Añadir nuevo",
        noBirthdays: "No se han añadido cumpleaños",
        showHeader: "Mostrar encabezado",
        customHeader: "Texto de encabezado personalizado (opcional)",
        headerPlaceholder: "Ej: Cumpleaños esta semana",
        name: "Nombre",
        date: "Fecha",
        delete: "Eliminar",
        sortDate: "Fecha", 
        sortName: "Nombre", 
        hide_if_empty: "Ocultar tarjeta si no hay cumpleaños próximos"
      },
      de: {
        sortBy: "Sortieren nach",
        daysAhead: "Tage im Voraus",
        todayColor: "Farbe für heute",
        birthdays: "Geburtstage",
        addNew: "Neu hinzufügen",
        noBirthdays: "Noch keine Geburtstage hinzugefügt",
        showHeader: "Header anzeigen",
        customHeader: "Eigener Header-Text (optional)",
        headerPlaceholder: "z.B.: Geburtstage dieser Woche",
        name: "Name",
        date: "Datum",
        delete: "Löschen",
        sortDate: "Datum", 
        sortName: "Name", 
        hide_if_empty: "Karte ausblenden, wenn keine bevorstehenden Geburtstage anstehen"
      }
    };
    
    const t_editor = translationsEditor[lang] || translationsEditor['en'];
    
    return html`
      <div>
      
        <div class="toggle-wrapper">
          <label>${t_editor.showHeader}</label>
          <label class="switch">
            <input 
              type="checkbox" 
              .checked=${cfg.show_header !== false}
              @change=${e => {
                this._config.show_header = e.target.checked;
                this._fireConfigChanged();
              }} 
            />
            <span class="slider"></span>
          </label>
        </div>
        
      ${cfg.show_header !== false ? html`
        <div style="margin: 8px 0;">
          <label>${t_editor.customHeader}</label>
          <input 
            type="text" 
            placeholder=${t_editor.headerPlaceholder} 
            .value=${cfg.custom_header || ""} 
            @input=${e => {
              this._config.custom_header = e.target.value;
              this._fireConfigChanged();
            }}
          />
        </div>
      ` : ''}

        <div class="toggle-wrapper">
          <label>${t_editor.hide_if_empty || "Verberg kaart als leeg"}</label>
          <label class="switch">
            <input
              type="checkbox"
              .checked=${cfg.hide_if_empty === true}
              @change=${e => {
                this._config.hide_if_empty = e.target.checked;
                this._fireConfigChanged();
              }}
            />
            <span class="slider"></span>
          </label>
        </div>

        <div class="row">
          <div style="flex:1">
            <label>${t_editor.sortBy}</label>
            <select .value=${cfg.sort_by} @change=${e => this._updateSimpleField('sort_by', e)}>
              <option value="date">${t_editor.sortDate}</option>
              <option value="name">${t_editor.sortName}</option>
            </select>

          </div>

          <div style="width:160px">
            <label>${t_editor.daysAhead}</label>
            <input 
              type="number" 
              min="1" 
              max="365" 
              .value=${String(cfg.days_ahead)}
              @change=${e => this._updateSimpleField('days_ahead', e)} 
            />
          </div>

          <div style="flex:1">
            <label>${t_editor.todayColor}</label>
            <input type="color" 
                  .value=${cfg.today_color || '#ffe082'} 
                  @change=${e => this._updateSimpleField('today_color', e)} />
          </div>
        </div>

        <div class="list">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div style="font-weight:600">${t_editor.birthdays}</div>
            <div class="controls">
              <button class="icon" title=${t_editor.addNew} @click=${this._addBirthday}>+</button>
            </div>
          </div>

          ${cfg.birthdays.length === 0 
            ? html`<div style="color:var(--secondary-text-color,#666)">${t_editor.noBirthdays}</div>` 
            : ''}

          ${cfg.birthdays.map((b, idx) => html`
            <div class="item">
              <input 
                type="text" 
                .value=${b.name} 
                @change=${e => this._updateBirthday(idx, 'name', e)} 
                placeholder=${t_editor.name} 
              />

              <input 
                type="date" 
                .value=${b.date} 
                @change=${e => this._updateBirthday(idx, 'date', e)} 
                aria-label=${t_editor.date}
              />

              <button 
                class="icon delete" 
                title=${t_editor.delete} 
                @click=${() => this._removeBirthday(idx)}
              >×</button>

            </div>
          `)}
        </div>

        ${this._error ? html`<div class="error">${this._error}</div>` : ''}
      </div>
    `;
  }
}

customElements.define("jjs-birthday-card-editor", JJsBirthdayCardEditor);

// ===================================
//   REGISTRATIE
// ===================================
if (!window.customCards) window.customCards = [];
window.customCards.push({
  type: "jjs-birthday-card",
  name: "JJ's Birthday Card",
  preview: true,
  description: "A simple birthday card for Home Assistant",
});
