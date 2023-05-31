class Player extends TempElement {
  colors = ['blue', 'green', 'white', 'yellow', 'orange', 'red', 'black'];
  ci = 0;
  img = document.createElement('img');
  game = {};
  loading = true;
  rect = {};
  styles = `
    :host {
      width: 40px;
      position: fixed;
      z-index: 300;
      transition: 0.1s ease;
    }

    :host * {
      transition: 0.1s ease;
    }
  `;

  static get observedAttributes() {
    return ['action', 'time-left', 'x', 'y'];
  }

  constructor() {
    super();
    this.img.classList.add('player');
  }

  connectedCallback() {
    this.rect = this.game.blockWrapper.getBoundingClientRect();
    const width = 50;
    const height = 28;
    const sx = this.rect.x + this.rect.width/2 - 50;
    const sy = this.rect.y + this.rect.height/2 + 134;
    const style = document.createElement('style');
    const x = parseInt(this.a('x'));
    const y = parseInt(this.a('y'));
    style.textContent = this.styles;
    this.shadowRoot.append(style);
    this.shadowRoot.append(this.img);
    this.style.left = `${sx + x * width/2 - y*width/2}px`;
    this.style.top = `${sy - y * height/2 - x*height/2}px`;
    this.img.src = `images/${this.a('color')}-player.svg`;
    this.addEventListener("click", this.click.bind(this));
    this.loading = false;
  }

  attributeChangedCallback() {
    if (this.loading) return;
    const width = 50;
    const height = 28;
    const sx = this.rect.x + this.rect.width/2 - 50;
    const sy = this.rect.y + this.rect.height/2 + 134;
    const style = document.createElement('style');
    const x = this.a('x');
    const y = this.a('y');
    this.style.left = `${sx + x * width/2 - y*width/2}px`;
    this.style.top = `${sy - y * height/2 - x*height/2}px`;
    this.game.blockWrapper.currentBlock = this.game.blockWrapper.findBlock(x, y);
    this.img.src = `images/${this.a('color')}-player.svg`;
    if (this.game.time > 90) {
      this.img.style.filter = `brightness(${this.game.time > 120 ? 40 : 100-(this.game.time-90)*2}%)`;
    } else {
      this.img.style.filter = `none`;
    }
  }

  click() {
    this.ci ++;
    if (!this.colors[this.ci]) this.ci = 0;
    this.seta('color', this.colors[this.ci]);
    this.img.src = `images/${this.a('color')}-player.svg`;
  }
}

customElements.define('game-player', Player);
