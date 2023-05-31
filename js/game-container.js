class GameContainer extends TempElement {
  styles = `
    :host {
      display: flex;
      width: 800px;
      height: 800px;
      background: radial-gradient(circle at 50% 90%, white 3% 7%, #ffa 10%, #0af 11% 20%, #00f 80%, #00a);
      overflow: hidden;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      /* Just to make game-dialog positioned correctly */
      position: relative;
    }
  `;
  blockWrapper = document.createElement('game-block-wrapper');
  player = document.createElement('game-player');
  actions = document.createElement('game-actions');
  statistics = document.createElement('game-statistics');
  dialog = document.createElement('game-dialog');
  buildings = {
    workshop: false,
    house: false,
  };
  equipment = {
    shovel: false,
    fishing: false,
    axe: false,
    scythe: false,
    knife: true,
    boat: false,
    forge: false,
    kiln: false,
  };
  resources = {
    wood: 0,
    sticks: 0,
    grass: 0,
    cactus: 0,
    fish: 0,
    rocks: 0,
    mortar: 0,
    sand: 0,
    clay: 0,
    ore: 0,
    metal: 0,
    bricks: 0,
  };
  time = 11;
  blockMap = [
    `ppttggtttppppppp`,
    `pttgggggttpppppp`,
    `ppppggggtppwppww`,
    `pptttgttpwwwwwwp`,
    `pttttttwwwwwwppp`,
    `pppttttgwwwwgtpp`,
    `ppppgggggtggpppt`,
    `pppsssppgggstttt`,
    `sssssssssssswttw`,
    `csssswsswwwwwwtw`,
    `ccsswwswwsssswww`,
    `sssswssssppptpss`,
    `sswwwwspppptttpp`,
    `cssswwwssspptttp`,
  ];

  constructor() {
    super();
    const style = document.createElement('style');
    style.textContent = this.styles;
    this.shadowRoot.append(style);
    this.updateBackground();
    const blocks = [];
    for (let i in this.blockMap) {
      for (let j in this.blockMap[i]) {
        let blockType = 'plain';
        let blockModification = 'none';
        switch (this.blockMap[i][j]) {
          case 'f':
            blockModification = 'fish';
          case 'w':
            blockType = 'water';
            break;
          case 'c':
            blockModification = 'cactus';
          case 's':
            blockType = 'sand';
            break;
          case 't':
            blockModification = 'tree';
            break;
          case 'g':
            blockModification = 'grass';
            break;
        }
        blocks.push({
          x: j,
          y: i,
          type: blockType,
          current: 'false',
          active: '',
          src: `images/${blockType}-block.svg`,
          modification: blockModification,
        });
      }
    }
    this.blockWrapper.blocks = blocks;
    this.player.seta('x', 15);
    this.player.seta('y', 13);
    this.player.seta('color', 'blue');
    this.actions.seta('block-src', `images/sand-block.svg`);
    this.statistics.seta('resources', JSON.stringify(this.resources));
    this.player.game = this;
    this.blockWrapper.game = this;
    this.actions.game = this;
    this.statistics.game = this;
    this.dialog.game = this;
    document.addEventListener("keydown", this.keyPress.bind(this));
  }

  connectedCallback() {
    this.shadowRoot.append(this.statistics);
    this.shadowRoot.append(this.blockWrapper);
    this.shadowRoot.append(this.player);
    this.shadowRoot.append(this.actions);
  }

  moveLeft() {
    const nextBlock = this.blockWrapper.findBlock(parseInt(this.player.a('x'))-1, this.player.a('y'));
    if (!nextBlock) return;
    if (nextBlock.a('type') === 'water' && !this.equipment.boat) return;
    this.player.fseta('x', v => parseInt(v)-1);
    this.actions.seta('block-src', nextBlock.a('src'));
    this.actions.seta('block', nextBlock.a('type'));
    if (nextBlock.a('modification') !== 'none') this.actions.seta('mod-src', `images/${nextBlock.a('modification')}.svg`);
    else this.actions.seta('mod-src', '');
    this.actions.seta('mod', nextBlock.a('modification'));
    return true;
  }
  moveUp() {
    const nextBlock = this.blockWrapper.findBlock(this.player.a('x'), parseInt(this.player.a('y'))+1);
    if (!nextBlock) return;
    if (nextBlock.a('type') === 'water' && !this.equipment.boat) return;
    this.player.fseta('y', v => parseInt(v)+1);
    this.actions.seta('block-src', nextBlock.a('src'));
    this.actions.seta('block', nextBlock.a('type'));
    if (nextBlock.a('modification') !== 'none') this.actions.seta('mod-src', `images/${nextBlock.a('modification')}.svg`);
    else this.actions.seta('mod-src', '');
    this.actions.seta('mod', nextBlock.a('modification'));
    return true;
  }
  moveDown() {
    const nextBlock = this.blockWrapper.findBlock(this.player.a('x'), parseInt(this.player.a('y'))-1);
    if (!nextBlock) return;
    if (nextBlock.a('type') === 'water' && !this.equipment.boat) return;
    this.player.fseta('y', v => parseInt(v)-1);
    this.actions.seta('block-src', nextBlock.a('src'));
    this.actions.seta('block', nextBlock.a('type'));
    if (nextBlock.a('modification') !== 'none') this.actions.seta('mod-src', `images/${nextBlock.a('modification')}.svg`);
    else this.actions.seta('mod-src', '');
    this.actions.seta('mod', nextBlock.a('modification'));
    return true;
  }
  moveRight() {
    const nextBlock = this.blockWrapper.findBlock(parseInt(this.player.a('x'))+1, this.player.a('y'));
    if (!nextBlock) return;
    if (nextBlock.a('type') === 'water' && !this.equipment.boat) return;
    this.player.fseta('x', v => parseInt(v)+1);
    this.actions.seta('block-src', nextBlock.a('src'));
    this.actions.seta('block', nextBlock.a('type'));
    if (nextBlock.a('modification') !== 'none') this.actions.seta('mod-src', `images/${nextBlock.a('modification')}.svg`);
    else this.actions.seta('mod-src', '');
    this.actions.seta('mod', nextBlock.a('modification'));
    return true;
  }

  keyPress(e) {
    if (this.dialog.a('active') === 'yes') return;
    switch (e.key) {
      case 'h':
      case 'ArrowLeft':
      case 'a':
        if (this.moveLeft()){
          this.incTime(0.25);
        }
        break;
      case 'j':
      case 'ArrowUp':
      case 'w':
        if (this.moveUp()){
          this.incTime(0.25);
        }
        break;
      case 'k':
      case 'ArrowDown':
      case 's':
        if (this.moveDown()){
          this.incTime(0.25);
        }
        break;
      case 'l':
      case 'ArrowRight':
      case 'd':
        if (this.moveRight()){
          this.incTime(0.25);
        }
        break;
    }
  }

  updateResources() {
    this.statistics.seta('resources', JSON.stringify(this.resources));
    this.actions.attributeChangedCallback();
  }

  openPrompt({content="", label="", type="", confirmCallback = ()=>{}, cancelCallback = ()=>{}, confirmText=null, cancelText=null, oneButton=false, placeholder=""}) {
    this.shadowRoot.append(this.dialog);
    if (confirmText) this.dialog.seta("confirm-text", confirmText);
    else this.dialog.seta("confirm-text", "");
    if (cancelText) this.dialog.seta("cancel-text", cancelText);
    else this.dialog.seta("cancel-text", "");
    if (oneButton) this.dialog.seta("one-button", "yes");
    else this.dialog.seta("one-button", "");
    this.dialog.seta("active", "yes");
    this.dialog.seta("placeholder", placeholder);
    this.dialog.seta("content", content);
    this.dialog.seta("label", label);
    this.dialog.seta("type", type);
    this.dialog.confirmCallback = confirmCallback;
    this.dialog.cancelCallback = cancelCallback;
  }

  openDialog({content="", confirmCallback = ()=>{}, cancelCallback = ()=>{}, confirmText="", cancelText="", oneButton=false}) {
    this.shadowRoot.append(this.dialog);
    if (confirmText) this.dialog.seta("confirm-text", confirmText);
    else this.dialog.seta("confirm-text", "");
    if (cancelText) this.dialog.seta("cancel-text", cancelText);
    else this.dialog.seta("cancel-text", "");
    if (oneButton) this.dialog.seta("one-button", "yes");
    else this.dialog.seta("one-button", "");
    this.dialog.seta("active", "yes");
    this.dialog.seta("content", content);
    this.dialog.seta("type", 'dialog');
    this.dialog.confirmCallback = confirmCallback;
    this.dialog.cancelCallback = cancelCallback;
  }

  updateBackground() {
    let background = `#07f`;
    if (this.time > 170) {
      //very late night
      background = `radial-gradient(circle at 50% 100%, rgba(255, 100, 0, ${(this.time-170)/10}), rgba(255, 20, 0, ${(this.time-170)/10}), rgba(0, 0, 255, ${(this.time-170)/10})),
        radial-gradient(circle at 50% ${200-(this.time-100)*5}%, white 2% 5%, #238 7%, #004 15%)`;
    } else if (this.time > 100) {
      //night
      background = `radial-gradient(circle at 50% ${200-(this.time-100)*5}%, white 2% 5%, #238 5.2%, #004 16%)`;
    } else if (this.time > 80) {
      // evening
      background = `radial-gradient(circle at 50% 100%, rgba(255, 100, 0, ${1-(this.time-80)/20}), rgba(255, 20, 0, ${1-(this.time-80)/20}), rgba(0, 0, 255, ${1-(this.time-80)/20})),
        radial-gradient(circle at 50% 100%, rgba(255, 255, 100, ${1-(this.time-80)/20}), rgba(255, 0, 0, ${1-(this.time-80)/20})),
        #004`;
    } else if (this.time > 40) {
      // afternoon / noon
      background = `radial-gradient(circle at 50% -200%, rgba(255, 255, 255, ${(80-this.time)/40}) 3% 7%, rgba(255, 255, 170, ${(80-this.time)/40}) 10%, rgba(0, 170, 255, ${(80-this.time)/40}) 11% 20%, rgba(0, 0, 255, ${(80-this.time)/40}) 80%, rgba(0, 0, 170, ${(80-this.time)/40})),
        radial-gradient(circle at 50% 100%, #ff6400, #ff1400, #00f)`;
    } else if (this.time > 10) {
      // morning
      background = `radial-gradient(circle at 50% ${100-(this.time-10)*10}%, white 3% 7%, #ffa 10%, #0af 11% 20%, #00f 80%, #00a)`;
    } else {
      //sunrise
      background = `radial-gradient(circle at 50% 100%, rgba(255, 100, 0, ${1-this.time/10}), rgba(255, 20, 0, ${1-this.time/10}), rgba(0, 0, 255, ${1-this.time/10})),
        radial-gradient(circle at 50% 100%, rgba(255, 255, 100, ${1-this.time/10}), rgba(255, 0, 0, ${1-this.time/10})),
        radial-gradient(circle at 50% ${100-(this.time-10)*10}%, white 3% 7%, #ffa 10%, #0af 11% 20%, #00f 80%, #00a)`;
    }
    this.styles = `
      :host {
        display: flex;
        width: 800px;
        height: 800px;
        background: ${background};
        overflow: hidden;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        /* Just to make game-dialog positioned correctly */
        position: relative;
      }
    `;
    this.shadowRoot.querySelector('style').innerText = this.styles;
  }

  incTime(amt) {
    this.time += amt;
    while (this.time > 180) {
      this.time -= 180;
    }
    this.updateBackground();
  }
}

customElements.define('game-container', GameContainer);
