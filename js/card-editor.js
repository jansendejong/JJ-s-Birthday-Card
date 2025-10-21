// card-editor.js
import { LitElement, html, css } from "https://unpkg.com/lit-element@3.0.0/lit-element.js?module";

const makeEmptyBirthday = () => ({ name: "", date: "" });

class JjsBirthdayCardEditor extends LitElement {
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


    // ✅ Beperk waarde tussen 1 en 365
    if (cfg.days_ahead < 1) cfg.days_ahead = 1;
    if (cfg.days_ahead > 365) cfg.days_ahead = 365;

    cfg.sort_by = cfg.sort_by || "date";
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

    // ✅ Beperk direct bij invoer
    if (field === "days_ahead") {
      if (val < 1) val = 1;
      if (val > 365) val = 365;
    }

    this._config = { ...this._config, [field]: val };
    this._fireConfigChanged();
  }

  render() {
    const cfg = this._config || { birthdays: [], days_ahead: 7, sort_by: "date" };

    return html`
      <div>
        <div class="row">
          <div style="flex:1">
            <label>Sorteren op</label>
            <select .value=${cfg.sort_by} @change=${e => this._updateSimpleField('sort_by', e)}>
              <option value="date">Datum</option>
              <option value="name">Naam</option>
            </select>
          </div>

          <div style="width:160px">
            <label>Aantal dagen vooruit</label>
            <input 
              type="number" 
              min="1" 
              max="365" 
              .value=${String(cfg.days_ahead)}
              @change=${e => this._updateSimpleField('days_ahead', e)} 
            />
          </div>

          <div style="flex:1">
            <label>Kleur voor verjaardag vandaag</label>
            <input type="color" 
                  .value=${cfg.today_color || '#ffe082'} 
                  @change=${e => this._updateSimpleField('today_color', e)} />
          </div>
        </div>

        <div class="list">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div style="font-weight:600">Verjaardagen</div>
            <div class="controls">
              <button class="icon" title="Nieuw toevoegen" @click=${this._addBirthday}>+</button>
            </div>
          </div>

          ${cfg.birthdays.length === 0 
            ? html`<div style="color:var(--secondary-text-color,#666)">Nog geen verjaardagen toegevoegd</div>` 
            : ''}

          ${cfg.birthdays.map((b, idx) => html`
            <div class="item">
              <input type="text" .value=${b.name} @change=${e => this._updateBirthday(idx, 'name', e)} placeholder="Naam" />
              <input type="date" .value=${b.date} @change=${e => this._updateBirthday(idx, 'date', e)} />
              <button class="icon delete" title="Verwijderen" @click=${() => this._removeBirthday(idx)}>×</button>
            </div>
          `)}
        </div>

        ${this._error ? html`<div class="error">${this._error}</div>` : ''}
      </div>
    `;
  }
}

customElements.define("jjs-birthday-card-editor", JjsBirthdayCardEditor);
