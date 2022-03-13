class Game2048 {
  nodes = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  isGameover = false;
  scoreElement = document.getElementById("score");
  gameoverBtnElement = document.querySelector("button");
  constructor() {
    this.initializeNodes();
    this.initListeners(this.onArrowChange);
  }
  restart() {
    this.nodes = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.initializeNodes();
    this.scoreElement.innerText = 0;
    this.gameoverBtnElement.innerHTML = "Restart";
  }
  onArrowChange = async (key) => {
    if (this.isGameover) return;
    if (["ArrowUp", "ArrowDown"].includes(key)) {
      let a = [];
      for (let i = 0; i < 4; i++) {
        a.push([]);
        for (let j = 3; j >= 0; j--) {
          a[i][j] = this.nodes[j][i];
        }
        const updatedNodes = this.filterNodes(a[i], key == "ArrowUp");
        for (let k = 0; k < 4; k++) this.nodes[k][i] = updatedNodes[k];
      }
    } else {
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i] = this.filterNodes(this.nodes[i], key === "ArrowLeft");
      }
    }
    this.update();
    if (this.checkHasEmptyNodes()) {
      const [i, j] = this.getValidEmptyRange();
      this.nodes[i][j] = 2;
      this.update();
    } else {
      this.checkGameover();
    }
  };
  getE(i, j) {
    return document.getElementById(`node-${i}-${j}`);
  }
  setElementVal(element, value) {
    if (element) element.innerText = value;
  }
  initializeNodes() {
    const [i, j] = this.getValidEmptyRange();
    this.nodes[i][j] = 2;
    const [i1, j1] = this.getValidEmptyRange();
    this.nodes[i1][j1] = 4;
    this.update();
  }

  getValidEmptyRange() {
    let i = this.getRand(3);
    let j = this.getRand(3);
    while (this.nodes[i][j] != "0") {
      i = this.getRand(3);
      j = this.getRand(3);
    }
    return [i, j];
  }

  update() {
    this.nodes.forEach((node, i) => {
      node.forEach((n, j) => {
        this.setElementVal(this.getE(i, j), n || "");
      });
    });
  }
  sleep() {
    return new Promise((r) => setTimeout(r, 500));
  }

  checkHasEmptyNodes() {
    let c = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.nodes[i][j]) {
          c++;
        }
      }
    }
    return c < 16;
  }

  checkGameover() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const c = this.nodes[i][j];
        if (
          (this.nodes[i]?.[j - 1] && this.nodes[i][j - 1] == c) ||
          (this.nodes[i]?.[j + 1] && this.nodes[i][j + 1] == c) ||
          (this.nodes[i - 1]?.[j] && this.nodes[i - 1][j] == c) ||
          (this.nodes[i + 1]?.[j] && this.nodes[i + 1][j] == c)
        ) {
          return;
        }
      }
    }
    this.isGameover = true;
    alert("Gameover!!!");
    this.gameoverBtnElement.innerHTML = "Gameover, Restart";
  }

  getRand(range) {
    return Math.floor(Math.random() * (range + 1));
  }

  initListeners(cb) {
    document.addEventListener("keydown", ({ key }) => {
      if (["ArrowUp", "ArrowRight", "ArrowLeft", "ArrowDown"].includes(key)) {
        cb(key);
      }
    });
  }

  filterNodes(arr, isLeft) {
    const stack = [];
    let sum = false;
    if (isLeft) {
      arr = arr.reverse();
    }
    for (let i = arr.length - 1; i >= 0; i--) {
      const e = arr[i];
      if (!e) continue;
      if (stack.length === 0 || stack[stack.length - 1] != e || sum) {
        stack.push(arr[i]);
        sum = false;
      } else {
        sum = true;
        stack[stack.length - 1] += e;
        this.updateScore(stack[stack.length - 1]);
      }
    }
    const extra = Array(4 - stack.length).fill(0);
    if (isLeft) {
      return stack.concat(extra);
    }
    return extra.concat(stack.reverse());
  }
  updateScore(score) {
    this.scoreElement.innerText = score + Number(this.scoreElement.innerText);
  }
}
const game = new Game2048();
