"use strict";
class Brain {
  #dom = new Dom();
  #animate = new Animations(this.#dom);
  #logic = new Logic(this.#dom, this.#animate);
}
let brain = new Brain();
function restart() {
  window.location.reload();
}
