function submitForm(e) {
  const dialog = document.querySelector('game-container').dialog;
  const input = dialog.shadowRoot.querySelector('input') || document.createElement('input');
  const error = dialog.confirmCallback(input.value);
  if (error) dialog.shadowRoot.querySelector('div.error').innerHTML = error;
  else {
    dialog.remove();
    dialog.seta('active', 'no');
  }
  e.preventDefault();
}

window.addEventListener('resize', () => {
  const game = document.querySelector('game-container');
  const rect = game.blockWrapper.getBoundingClientRect();
  game.player.rect = rect;
  game.player.attributeChangedCallback();
  for (let i = 0; i < game.blockWrapper.blockElements.length; i ++) {
    game.blockWrapper.blockElements[i].rect = rect;
    game.blockWrapper.blockElements[i].attributeChangedCallback();
  }
});
