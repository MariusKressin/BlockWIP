class Actions extends TempElement {
  styles = `
    :host {
      display: flex;
      width: 800px;
      height: 100px;
      transition: 0.1s ease;
      padding-left: 25px;
    }
    
    @keyframes flash {
      0% {
        background: rgba(100, 100, 120, 0.7);
      }
      
      50% {
        background: rgba(50, 50, 70, 0.7);
      }

      100% {
        background: rgba(100, 100, 120, 0.7);
      }
    }

    @keyframes block-wave {
      0% {
        transform: translate(0, 0);
      }

      50% {
        transform: translate(0, -10px);
      }

      100% {
        transform: translate(0, 0);
      }
    }

    @keyframes mod-wave {
      0% {
        transform: translate(0, 50px);
      }

      50% {
        transform: translate(0, 40px);
      }

      100% {
        transform: translate(0, 50px);
      }
    }

    div.img-container {
      display: flex;
      width: 80px;
      height: 100px;
      flex-direction: column-reverse;
      align-items: center;
      justify-content: flex-start;
      transition: 0.1s ease;
    }

    img {
      transition: 0.1s ease;
      width: 90px;
      transition: ease;
    }

    img.block-img {
      animation: 2s ease-in-out 0.1s infinite block-wave;
    }

    img.mod-img {
      transform: translate(0, 50px);
      animation: 2s ease-in-out 0.1s infinite mod-wave;
    }

    div.button-container {
      display: flex;
      width: 695px;
      padding: 10px 10px 10px 30px;
      justify-content: flex-start;
      align-items: center;
    }

    div.button {
      display: flex;
      border: 3px solid white;
      border-radius: 5px;
      min-width: auto;
      height: 20px;
      color: white;
      font-family: 'Verdana', 'Helvetica', sans-serif, serif;
      font-size: 10px;
      padding: 5px;
      flex-direction: row;
      align-items: center;
      margin-right: 10px;
      transition: ease 0.1s;
      animation: 1s ease-in-out 0s infinite flash;
      user-select: none;
    }

    div.button:hover {
      background: rgba(20, 20, 70, 1);
      animation: none;
    }
  `;
  buttons = [];
  game = {};
  loading = true;
  blockImg = document.createElement('img');
  modImg = document.createElement('img');
  actions = {
    "tree": [
      {
        time: 0.5,
        condition: () => this.game.equipment.axe,
        title: "Cut down the tree",
        resource: "Wood",
        quantity: 1,
        callback: () => {
          const currentBlock = this.game.blockWrapper.currentBlock;
          currentBlock.seta('modification', 'none');
          this.game.blockWrapper.findBlock(currentBlock.a('x'), currentBlock.a('y')).modification = 'none';
          this.game.resources.wood += 1;
          this.seta('mod', 'none');
          this.seta('mod-src', '');
          this.game.updateResources();
        }
      },
      {
        time: 0.25,
        condition: () => true,
        title: "Gather sticks",
        resource: "Stick",
        quantity: 1,
        callback: () => {
          const currentBlock = this.game.blockWrapper.currentBlock;
          this.game.resources.sticks ++;
          this.game.updateResources();
        }
      },
    ],
    "grass": [
      {
        time: 0.25,
        condition: () => !this.game.equipment.scythe,
        title: "Pick some grass",
        resource: "Grass",
        quantity: 1,
        callback: () => {
          const currentBlock = this.game.blockWrapper.currentBlock;
          const gl = currentBlock.a('grass-left');
          if (gl === null || gl === undefined) currentBlock.seta('grass-left', 2);
          else currentBlock.fseta("grass-left", a => a-1);
          if (currentBlock.a('grass-left') == 0) {
            currentBlock.seta('modification', 'none');
            this.game.blockWrapper.findBlock(currentBlock.a('x'), currentBlock.a('y')).modification = 'none';
            this.seta('mod', 'none');
            this.seta('mod-src', '');
          }
          this.game.resources.grass += 1;
          this.game.updateResources();
        }
      },
      {
        time: 0.25,
        condition: () => this.game.equipment.scythe,
        title: "Cut the grass down",
        resource: "Grass",
        quantity: 3,
        callback: () => {
          const currentBlock = this.game.blockWrapper.currentBlock;
          currentBlock.seta('modification', 'none');
          this.game.blockWrapper.findBlock(currentBlock.a('x'), currentBlock.a('y')).modification = 'none';
          this.game.resources.grass += 3;
          this.seta('mod', 'none');
          this.seta('mod-src', '');
          this.game.updateResources();
        }
      },
    ],
    "cactus": [
      {
        time: 0.25,
        condition: () => this.game.equipment.axe,
        title: "Cut down the cactus",
        resource: "Cactus",
        quantity: 1,
        callback: () => {
          const currentBlock = this.game.blockWrapper.currentBlock;
          currentBlock.seta('modification', 'none');
          this.game.blockWrapper.findBlock(currentBlock.a('x'), currentBlock.a('y')).modification = 'none';
          this.game.resources.cactus ++;
          this.seta('mod', 'none');
          this.seta('mod-src', '');
          this.game.updateResources();
        }
      },
    ],
    "fish": [],
    "workshop": [
      {
        time: 0.5,
        condition: () => !this.game.equipment.shovel && this.game.resources.sticks >= 3,
        title: "Carve a spade",
        resource: "Sticks",
        quantity: -3,
        callback: () => {
          this.game.resources.sticks -= 3;
          this.game.equipment.shovel = true;
          this.game.updateResources();
        }
      },
      {
        time: 0.5,
        condition: () => !this.game.equipment.boat && this.game.resources.grass >= 5,
        title: "Make a wicker boat",
        resource: "Grass",
        quantity: -5,
        callback: () => {
          this.game.resources.grass -= 5;
          this.game.equipment.boat = true;
          this.game.updateResources();
        }
      },
      {
        time: 0.25,
        condition: () => this.game.equipment.forge && this.game.resources.ore >= 1,
        title: "Smelt some ore",
        resources: ["Ore", "Metal"],
        quantity: [-1, 1],
        callback: () => {
          this.game.resources.ore -= 1;
          this.game.resources.metal += 1;
          this.game.updateResources();
        }
      },
      {
        time: 0.5,
        condition: () => !this.game.equipment.axe && this.game.resources.metal >= 3 && this.game.resources.sticks >= 1,
        title: "Make an axe",
        resources: ['Metal', 'Stick'],
        quantity: [-3, -1],
        callback: () => {
          this.game.resources.metal -= 3;
          this.game.resources.sticks -= 1;
          this.game.equipment.axe = true;
          this.game.updateResources();
        }
      },
      {
        time: 0.5,
        condition: () => !this.game.equipment.scythe && this.game.resources.metal >= 3 && this.game.resources.sticks >= 1,
        title: "Make a scythe",
        resources: ['Metal', 'Stick'],
        quantity: [-3, -1],
        callback: () => {
          this.game.resources.metal -= 3;
          this.game.resources.sticks -= 1;
          this.game.equipment.scythe = true;
          this.game.updateResources();
        }
      },
      {
        time: 0.5,
        condition: () => !this.game.equipment.fishing && this.game.resources.grass >= 2 && this.game.resources.sticks >= 3,
        title: "Make a fishing rod",
        resources: ['Grass', 'Sticks'],
        quantity: [-2, -3],
        callback: () => {
          this.game.resources.grass -= 2;
          this.game.resources.sticks -= 3;
          this.game.equipment.fishing = true;
          this.game.updateResources();
        }
      },
      {
        time: 0.5,
        condition: () => !this.game.equipment.forge && this.game.resources.rocks >= 2 && this.game.resources.grass >= 2,
        title: "Make a forge",
        resources: ["Rocks", "Grass"],
        quantity: [-2, -2],
        callback: () => {
          this.game.resources.rocks -= 2;
          this.game.equipment.forge = true;
          this.game.updateResources();
        }
      },
      {
        time: 0.5,
        condition: () => !this.game.equipment.kiln && this.game.resources.rocks >= 3 && this.game.resources.grass >= 2,
        title: "Make a kiln",
        resources: ["Rocks", "Grass"],
        quantity: [-3, -2],
        callback: () => {
          this.game.resources.rocks -= 3;
          this.game.resources.grass -= 2;
          this.game.equipment.kiln = true;
          this.game.updateResources();
        }
      },
      {
        time: 0.25,
        condition: () => this.game.equipment.kiln && this.game.resources.clay >= 1 && this.game.resources.sand >= 1,
        title: "Mix some mortar",
        resources: ["Clay", "Sand"],
        quantity: [-1, -1],
        callback: () => {
          this.game.resources.sand --;
          this.game.resources.clay --;
          this.game.resources.mortar ++
          this.game.updateResources();
        }
      },
      {
        time: 0.5,
        condition: () => this.game.equipment.kiln && this.game.resources.clay >= 1 && this.game.resources.grass >= 1,
        title: "Bake some bricks",
        resources: ["Clay", "Grass"],
        quantity: ["?", -1],
        callback: () => {
          const options = {
            content: `
            <h4>How many bricks will you bake?</h4>
            <p>It costs 1 clay to make 1 brick, and you have ${this.game.resources.clay} clay.</p>`,
            type: 'number', 
            confirmCallback: val => {
              if (isNaN(val)) return `Please enter a number.`;
              if (Math.floor(val) != val) return `Please enter an integer.`;
              if (parseInt(val) > this.game.resources.clay) return `You don't have enough clay.`;
              if (parseInt(val) < 0) return `You can't use negative numbers.`;
              this.game.resources.grass --;
              this.game.resources.clay -= parseInt(val);
              this.game.resources.bricks += parseInt(val);
              this.game.updateResources();
            },
            placeholder: "Enter amount of bricks",
          }
          this.game.openPrompt(options);
        }
      },
    ],
    "none": [
      {
        time: 0.25,
        condition: () => this.game.equipment.shovel && this.game.blockWrapper.currentBlock.a('type') === 'plain',
        title: "Dig for some dirt",
        resource: "Clay",
        quantity: 1,
        callback: () => {
          const currentBlock = this.game.blockWrapper.currentBlock;
          currentBlock.seta('modification', 'digspot');
          this.game.blockWrapper.findBlock(currentBlock.a('x'), currentBlock.a('y')).modification = 'digspot';
          this.game.resources.clay ++;
          this.seta('mod', 'digspot');
          this.seta('mod-src', 'images/digspot.svg');
          this.game.updateResources();
        }
      },
      {
        time: 0.25,
        condition: () => this.game.equipment.shovel && this.game.blockWrapper.currentBlock.a('type') === 'sand',
        title: "Dig up some sand",
        resource: "Sand",
        quantity: 1,
        callback: () => {
          const currentBlock = this.game.blockWrapper.currentBlock;
          currentBlock.seta('modification', 'sandpit');
          this.game.blockWrapper.findBlock(currentBlock.a('x'), currentBlock.a('y')).modification = 'sandpit';
          this.game.resources.sand ++;
          this.seta('mod', 'sandpit');
          this.seta('mod-src', 'images/sandpit.svg');
          this.game.updateResources();
        }
      },
      {
        time: 1.5,
        condition: () => !this.game.buildings.workshop && this.game.blockWrapper.currentBlock.a('type') !== 'water' && this.game.resources.sticks >= 8,
        title: "Construct a workshop",
        resource: "Sticks",
        quantity: -8,
        callback: () => {
          const currentBlock = this.game.blockWrapper.currentBlock;
          currentBlock.seta('modification', 'workshop');
          this.game.blockWrapper.findBlock(currentBlock.a('x'), currentBlock.a('y')).modification = 'workshop';
          this.game.resources.sticks -= 8;
          this.game.buildings.workshop = true;
          this.seta('mod', 'workshop');
          this.seta('mod-src', 'images/workshop.svg');
          this.game.updateResources();
        }
      },
      {
        time: 2.5,
        condition: () => !this.game.buildings.house && this.game.blockWrapper.currentBlock.a('type') !== 'water' && this.game.resources.wood >= 9 && this.game.resources.mortar >= 4 && this.game.resources.bricks >= 6,
        title: "Construct a house",
        resources: ["Wood", "Mortar", "Bricks"],
        quantity: [-9, -4, -6],
        callback: () => {
          const currentBlock = this.game.blockWrapper.currentBlock;
          currentBlock.seta('modification', 'house');
          this.game.blockWrapper.findBlock(currentBlock.a('x'), currentBlock.a('y')).modification = 'house';
          this.game.resources.wood -= 9;
          this.game.resources.mortar -= 4;
          this.game.resources.bricks -= 6;
          this.game.buildings.house = true;
          this.seta('mod', 'house');
          this.seta('mod-src', 'images/house.svg');
          this.game.updateResources();
        }
      },
    ],
    "digspot": [
      {
        time: 0.5,
        condition: () => this.game.equipment.shovel,
        title: "Dig for ore",
        resources: ["Ore", "Clay"],
        quantity: [1, 3],
        callback: () => {
          const currentBlock = this.game.blockWrapper.currentBlock;
          currentBlock.seta('modification', 'deepdigspot');
          this.game.blockWrapper.findBlock(currentBlock.a('x'), currentBlock.a('y')).modification = 'deepdigspot';
          this.game.resources.ore ++;
          this.game.resources.clay += 3;
          this.seta('mod', 'deepdigspot');
          this.seta('mod-src', 'images/deepdigspot.svg');
          this.game.updateResources();
        }
      }
    ],
    "sandpit": [
      {
        time: 0.25,
        condition: () => this.game.equipment.shovel,
        title: "Dig for some big rocks",
        resource: "Rock",
        quantity: 1,
        callback: () => {
          const currentBlock = this.game.blockWrapper.currentBlock;
          currentBlock.seta('modification', 'deepsandpit');
          this.game.blockWrapper.findBlock(currentBlock.a('x'), currentBlock.a('y')).modification = 'deepsandpit';
          this.game.resources.rocks ++;
          this.seta('mod', 'deepsandpit');
          this.seta('mod-src', 'images/deepsandpit.svg');
          this.game.updateResources();
        }
      },
    ],
    "house": [
      {
        time: 0,
        condition: () => true,
        title: "Enter the house",
        resource: null,
        quantity: null,
        callback: () => {
          // Add later
          this.game.blockWrapper.remove();
          this.game.statistics.remove();
          this.game.player.remove();
          const windiv = document.createElement("div");
          windiv.innerHTML = "<h1>You Win (for now)</h1>";
          this.game.shadowRoot.append(windiv);
          this.remove();
        }
      },
    ],
  };
  
  static get observedAttributes() {
    return ['mod', 'block', 'mod-src', 'block-src'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    const style = document.createElement('style');
    style.textContent = this.styles;
    this.shadowRoot.append(style);
    
    const container = document.createElement('div');
    container.classList.add('img-container');
    this.shadowRoot.append(container);

    container.append(this.blockImg);
    container.append(this.modImg);
    this.blockImg.classList.add('block-img');
    this.modImg.classList.add('mod-img');
    this.blockImg.setAttribute('src', this.a('block-src'));
    this.loading = false;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    for (let i in this.actions) {
      for (let j in this.actions[i]) {
        const button = document.createElement('div');
        button.classList.add('button');
        const buttonText = document.createElement('div');
        if (this.actions[i][j].quantity === null) {
          buttonText.innerHTML = `${this.actions[i][j].title}`;
        } else if (this.actions[i][j].resource) {
          buttonText.innerHTML = `${this.actions[i][j].title}&nbsp;&nbsp;
            <span style="color:${this.actions[i][j].quantity < 0?`#ee0000`:`#00dd00`}">
              (${this.actions[i][j].quantity > 0?`+`:''}${this.actions[i][j].quantity} ${this.actions[i][j].resource})
            </span>`;
        } else {
          const span = document.createElement('span');
          let text = `(`;
          let sign = 0;
          for (let r = 0; r < this.actions[i][j].resources.length; r ++) {
            if (r !== 0) text += ' ';
            text += `${this.actions[i][j].quantity[r] > 0?`+`:''}${this.actions[i][j].quantity[r]} ${this.actions[i][j].resources[r]}`;
            if (this.actions[i][j].quantity[r] > 0) {
              if (sign === 0) sign = 1;
              else if (sign === -1) sign = null;
              else if (sign !== "purple") sign = 1;
            } else if (this.actions[i][j].quantity[r] < 0) {
              if (sign === 0) sign = -1;
              else if (sign === 1) sign = null;
              else if (sign !== "purple") sign = -1;
            } else if (this.actions[i][j].quantity[r] === "?") {
              sign = "purple"
            }
          }
          text += ')';
          span.textContent = text;
          span.style.color = "white";
          if (sign === 1) {
            span.style.color = "#0d0";
          }
          if (sign === -1) {
            span.style.color = "#e00";
          }
          if (sign === "purple") {
            span.style.color = "#f0f";
          }
          buttonText.innerHTML = `${this.actions[i][j].title} `;
          buttonText.append(span);
        }
        button.append(buttonText);
        button.setAttribute('type', i);
        button.condition = this.actions[i][j].condition;
        button.style.display = 'none';
        button.addEventListener("click", this.actions[i][j].callback.bind(this));
        button.addEventListener("click", (() => { this.game.incTime(this.actions[i][j].time)}).bind(this));
        this.buttons.push(button);
        buttonContainer.append(button);
      }
    }
    this.shadowRoot.append(buttonContainer);
  }

  attributeChangedCallback() {
    if (this.loading) return;
    this.blockImg.setAttribute('src', this.a('block-src'));
    this.modImg.setAttribute('src', this.a('mod-src'));
    if (this.game.time > 90) {
      this.blockImg.style.filter = `brightness(${this.game.time > 120 ? 40 : 100-(this.game.time-90)*2}%)`;
      this.modImg.style.filter = `brightness(${this.game.time > 120 ? 40 : 100-(this.game.time-90)*2}%)`;
    } else {
      this.blockImg.style.filter = `none`;
      this.modImg.style.filter = `none`;
    }
    for (let i in this.buttons) {
      if (this.buttons[i].getAttribute('type') === this.a('mod') && this.buttons[i].condition()) {
        this.buttons[i].style.display = null;
      } else {
        this.buttons[i].style.display = 'none';
      }
    }
  }
}

customElements.define('game-actions', Actions);
