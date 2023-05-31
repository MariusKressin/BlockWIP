class BlockWrapper extends TempElement {
  styles = `
    :host {
      display: block;
      width: 800px;
      height: 600px;
      overflow: hidden;
    }

  `;
  blocks = [];
  blockElements = [];
  game = {};
  /**
    * Syntax: {
    *   x: number
    *   y: number
    *   type: string
    *   modification: string
    *   src: string
    *   active: string
    *   current: boolean
    * }
  **/

  constructor() {
    super();
  }

  connectedCallback() {
    const style = document.createElement('style');
    style.textContent = this.styles;
    this.shadowRoot.append(style);

    const blockAttributes = ['x', 'y', 'type', 'modification', 'src', 'active', 'current'];
    this.blocks.sort((a, b) => parseInt(a.x) < parseInt(b.x) || parseInt(a.y) < parseInt(b.y));

    for (let i in this.blocks) {
      const block = document.createElement("game-block");
      for (let j in blockAttributes) {
        let a = blockAttributes[j];
        block.seta(a, this.blocks[i][a] || '');
      }
      block.seta('z', parseInt(i)+1);
      block['rect'] = this.getBoundingClientRect();
      this.blockElements.push(block);
    }

    for (let i in this.blockElements) {
      this.blockElements[i].wrapper = this;
      this.shadowRoot.append(this.blockElements[i]);
    }
    
    this.currentBlock = this.findBlock(15, 13);
  }

  findBlock(x, y) {
    let block = null;
    for (let i in this.blockElements) {
      const b = this.blockElements[i];
      if (b.a('x') == (x||0) && b.a('y') == (y||0)) block = b;
    }
    return block;
  }
  
  get currentBlock() {
    const player = this.game.player;
    const x = player.a('x');
    const y = player.a('y');
    return this.findBlock(x, y);
  }

  set currentBlock(block) {
    const x = block.a('x');
    const y = block.a('y');
    for (let i in this.blockElements) {
      this.blockElements[i].seta('current', 'false');
    }
    this.findBlock(x, y).seta('current', 'true');
  }
}

customElements.define('game-block-wrapper', BlockWrapper);
