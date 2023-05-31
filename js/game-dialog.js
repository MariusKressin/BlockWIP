class Dialog extends TempElement {
  styles = `
    :host {
      background: rgba(0, 0, 50, 0.7);
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 800px;
      height: 800px;
      z-index: 400;
    }

    .dialog-box {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      min-width: 300px;
      min-height: 150px;
      background: #eef;
      color: #007;
      border: 2px solid blue;
      padding: 10px 20px;
      text-align: center;
      font-family: 'Geremond', 'Georgia', serif;
    }

    .dialog-box > * {
      margin: 0;
    }

    div.buttons {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }

    div.button {
      min-width: auto;
      padding: 3px 6px;
      border-radius: 2px;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      margin-right: 10px;
    }
    div.button:last-child {
      margin-right: 0;
    }

    div.error {
      text-align: center;
      color: red;
    }

    form {
      display: block;
    }
  `;
  game = {};
  loading = true;
  confirmCallback = ()=>{};
  cancelCallback = ()=>{};
  box = document.createElement('div');

  static get observedAttributes() {
    return ['content', 'type', 'active'];
  }

  constructor() {
    super();
    this.box.classList.add('dialog-box');
  }

  renderBox() {
    this.box.innerHTML = `
      ${this.a('content') || ''}
      <div class="error"></div>
      ${this.a('type') !== 'dialog'?`
        <form action="/" id="form" onsubmit="submitForm(event)">
          ${this.a('label')?`
            <label for="input">${this.a('label')}</label>
          `:''}
          <input ${this.a('placeholder')?`placeholder="${this.a('placeholder')}"`:''} id="input" type="${this.a('type')}"/>
        </form>
      `:``}
      <div class="buttons">
          ${!this.a('one-button')?`<div class="button" id="cancel">${this.a('cancel-text') || 'Cancel'}</div>`:''}
          <div class="button" id="confirm">${this.a('confirm-text') || 'OK'}</div>
      </div>
      `;
  }

  connectedCallback() {
    const style = document.createElement('style');
    style.textContent = this.styles;

    this.renderBox();
    this.shadowRoot.append(style);
    this.shadowRoot.append(this.box);

    this.loading = false;
  }

  attributeChangedCallback() {
    if (this.loading) return;
    this.renderBox();
    const confirmBtn = this.shadowRoot.getElementById('confirm');
    const cancelBtn = this.shadowRoot.getElementById('cancel');
    confirmBtn.onclick = () => {
      const input = this.shadowRoot.querySelector('input') || document.createElement('input');
      const error = this.confirmCallback(input.value);
      if (error) this.shadowRoot.querySelector('div.error').innerHTML = error;
      else {
        this.remove();
        this.seta('active', 'no');
      }
    };
    if (!cancelBtn) return;
    cancelBtn.onclick = () => {
      const input = this.shadowRoot.querySelector('input') || document.createElement('input');
      const error = this.cancelCallback(input.value);
      if (error) this.shadowRoot.querySelector('div.error').innerHTML = error;
      else {
        this.remove();
        this.seta('active', 'no');
      }
    };
  }
}

customElements.define('game-dialog', Dialog);
