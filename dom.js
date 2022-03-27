class Dom {
  #scoreBoard = document.getElementById("score");
  #gameOverbtn = document.querySelector("button");
  #nodes = {};
  constructor(cb) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.#nodes[`${i},${j}`] = document.getElementById(`node-${i}-${j}`);
      }
    }
  }

  getNodeById(i, j) {
    return this.#nodes[`${i},${j}`];
  }

  updateNodeById(i, j, { value }, newNode) {
    const ele = this.getNodeById(i, j);
    ele.innerHTML = `<p class="${(value || "") > 0 ? `block-2048` : ""}">${
      value || ""
    }<p>`;
  }

  updateNodes(nodes) {
    nodes.forEach((node, i) => {
      node.forEach((value, j) => {
        this.updateNodeById(i, j, value || "");
      });
    });
  }

  getScoreBoard() {
    return this.#scoreBoard;
  }

  getGameOverBtn() {
    return this.#gameOverbtn;
  }

  updateScore(score) {
    this.#scoreBoard.innerText = score + Number(this.#scoreBoard.innerText);
  }

  updateGameOver(flag) {
    this.#gameOverbtn.innerHTML = `Gameover${(flag && ", Restart") || ""}`;
  }
}
