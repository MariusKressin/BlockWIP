class Statistics extends TempElement {
  styles = `
    :host {
      display: grid;
      padding: 20px 40px 40px 20px;
      grid-template-columns: repeat(6, 100px);
      grid-template-rows: repeat(2, 30px);
      column-gap: 32px;
      width: 800px;
      height: 100px;
      background: radial-gradient(circle farthest-corner, #222244, #16162f);
      border-bottom: 2px solid blue;
      box-sizing: border-box;
      font-family: 'Verdana', 'Helvetica', sans-serif, serif;
      color: white;
    }

    * {
      background: none;
    }

    .flex.outside {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  `;
  game = {};
  loading = true;
  resources = {};

  static get observedAttributes() {
    return ['resources'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    const style = document.createElement('style');
    style.textContent = this.styles;

    this.resources = JSON.parse(this.a('resources'));
    this.shadowRoot.append(style);

    for (let i in this.resources) {
      const r = this.resources[i];
      this.shadowRoot.innerHTML += `
        <div class="flex outside">
          <span>${this.capitalize(i)}:</span>
          <span>${r}</span>
        </div>
      `;
    }

    this.loading = false;
  }

  attributeChangedCallback() {
    if (this.loading) return;
    const style = document.createElement('style');
    style.textContent = this.styles;

    this.resources = JSON.parse(this.a('resources'));
    this.shadowRoot.innerHTML = ``;
    this.shadowRoot.append(style);
    for (let i in this.resources) {
      const r = this.resources[i];
      this.shadowRoot.innerHTML += `
        <div class="flex outside">
          <span>${this.capitalize(i)}:</span>
          <span>${r}</span>
        </div>
      `;
    }
  }

  capitalize(str) {
    const leadingChar = str[0].toUpperCase();
    const restOfString = str.slice(1);
    return leadingChar+restOfString;
  }
}

customElements.define('game-statistics', Statistics);
