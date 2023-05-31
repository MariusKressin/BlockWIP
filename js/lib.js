function i (id)    { return document.getElementById(id); }
function $ (query) { return document.querySelector(query); }
function S (query) { return document.querySelectorAll(query); }
function _ (tag)   { return document.getElementsByTagName(tag); }
function c (claSs) { return document.getElementsByClassName(claSs); }

class TempElement extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({ mode: 'open' });
  }

  hasa(attr) {
    return this.hasAttribute(attr);
  }
  seta(attr, val) {
    return this.setAttribute(attr, val);
  }
  fseta(attr, callback) {
    return this.setAttribute(attr, callback(this.getAttribute(attr)));
  }
  a(attr) {
    return this.getAttribute(attr);
  }
}
