class Block extends TempElement {
  img = document.createElement("img");
  modImg = document.createElement("img");
  game = {};
  sx = 600;
  sy = 500;
  rect = {};
  styles = `
    :host {
      width: 60px;
      position: fixed;
      transition: 0.1s ease;
    }

    :host * {
      transition: 0.1s ease;
    }

    .block-mod {
      position: fixed;
      width: 50px;
    }

    img {
      filter: ${this.game.time > 90 ? `grayscale(50%)`:`none`};
    }
  `;

  static get observedAttributes () {
    return ['x', 'y', 'z', 'sx', 'sy', 'type', 'src', 'active', 'current', 'modification'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    const width = 50;
    const height = 28;
    const style = document.createElement('style');
    const x = parseInt(this.a('x'));
    const y = parseInt(this.a('y'));
    this.sx = this.rect.x + this.rect.width/2 - 60;
    if (this.a('current') === 'true') {
      this.sy = this.rect.y + this.rect.height/2 + 150;
    } else {
      this.sy = this.rect.y + this.rect.height/2 + 160;
    }
    style.textContent = this.styles;
    this.img.src = this.a('src');
    this.img.classList.add('block');
    if (this.a('modification') !== 'none') {
      this.modImg.src = `images/${this.a('modification')}.svg`;
    }
    this.modImg.classList.add('block-mod');
    this.modImg.style.zIndex = parseInt(this.a('z')) + 301;
    this.modImg.style.left = `${this.sx + 5 + x * width/2 - y*width/2}px`;
    this.modImg.style.top = `${this.sy - 20 - y * height/2 - x*height/2}px`;
    this.shadowRoot.append(this.modImg);
    this.shadowRoot.append(style);
    this.shadowRoot.append(this.img);
    this.style.zIndex = this.a('z');
    this.style.left = `${this.sx + x * width/2 - y*width/2}px`;
    this.style.top = `${this.sy - y * height/2 - x*height/2}px`;
  }
  
  attributeChangedCallback(attribute, oldVal, newVal) {
    this.sx = this.rect.x + this.rect.width/2 - 60;
    if (this.a('current') == 'true') {
      this.sy = this.rect.y + this.rect.height/2 + 150;
      this.modImg.style.opacity = '0';
    } else {
      this.sy = this.rect.y + this.rect.height/2 + 160;
      this.modImg.style.opacity = '1';
    }
    const width = 50;
    const height = 28;
    const x = parseInt(this.a('x'));
    const y = parseInt(this.a('y'));
    this.style.left = `${this.sx + x * width/2 - y*width/2}px`;
    this.style.top = `${this.sy - y * height/2 - x*height/2}px`;
    if (this.a('modification') !== 'none') {
      this.modImg.src = `images/${this.a('modification')}.svg`;
      this.modImg.style.left = `${this.sx + 5 + x * width/2 - y*width/2}px`;
      this.modImg.style.top = `${this.sy - 20 - y * height/2 - x*height/2}px`;
      if (!this.wrapper) return;
      if (this.wrapper.game.time > 90) {
        this.modImg.style.filter = `brightness(${this.wrapper.game.time > 120 ? 40 : 100-(this.wrapper.game.time-90)*2}%)`;
      } else {
        this.modImg.style.filter = `none`;
      }
    } else {
      this.modImg.src = '';
    }
    if (!this.wrapper) return;
    if (this.wrapper.game.time > 90) {
      this.img.style.filter = `brightness(${this.wrapper.game.time > 120 ? 40 : 100-(this.wrapper.game.time-90)*2}%)`;
    } else {
      this.img.style.filter = `none`;
    }
  }
}

customElements.define('game-block', Block);
