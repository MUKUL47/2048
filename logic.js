class Logic {
  #nodes = [
    [
      { value: 0, posY: 0, posX: 0 },
      { value: 0, posY: 0, posX: 1 },
      { value: 0, posY: 0, posX: 2 },
      { value: 0, posY: 0, posX: 3 },
    ],
    [
      { value: 0, posY: 1, posX: 0 },
      { value: 0, posY: 1, posX: 1 },
      { value: 0, posY: 1, posX: 2 },
      { value: 0, posY: 1, posX: 3 },
    ],
    [
      { value: 0, posY: 2, posX: 0 },
      { value: 0, posY: 2, posX: 1 },
      { value: 0, posY: 2, posX: 2 },
      { value: 0, posY: 2, posX: 3 },
    ],
    [
      { value: 0, posY: 3, posX: 0 },
      { value: 0, posY: 3, posX: 1 },
      { value: 0, posY: 3, posX: 2 },
      { value: 0, posY: 3, posX: 3 },
    ],
  ];
  #isGameover = false;
  #dom;
  #animate;
  #isAnimating = false;
  constructor(dom, animate) {
    this.#dom = dom;
    this.#animate = animate;
    this.initializeNodes();
    document.addEventListener("keydown", ({ key }) => {
      if (["ArrowUp", "ArrowRight", "ArrowLeft", "ArrowDown"].includes(key))
        this.#onArrowChange(key);
    });
  }

  initializeNodes() {
    const [i, j] = this.#getValidEmptyRange();
    this.#updateNode(i, j, 2);
    this.#dom.updateNodeById(i, j, this.#nodes[i][j]);
    const [i1, j1] = this.#getValidEmptyRange();
    this.#updateNode(i1, j1, 2);
    this.#dom.updateNodeById(i1, j1, this.#nodes[i1][j1]);
  }

  #updateNode(x, y, value) {
    this.#nodes[x][y] = { ...this.#nodes[x][y], value, posX: y, posY: x };
  }

  #onArrowChange = async (key) => {
    if (this.#isGameover || this.#isAnimating) return;
    this.#isAnimating = true;
    if (["ArrowUp", "ArrowDown"].includes(key)) {
      let a = [];
      for (let i = 0; i < 4; i++) {
        a.push([]);
        for (let j = 3; j >= 0; j--) {
          a[i][j] = this.#nodes[j][i];
        }
        const updatedNodes = this.filterNodes(a[i], key == "ArrowUp");
        for (let k = 0; k < 4; k++) this.#nodes[k][i] = updatedNodes[k];
      }
      this.#animate.animateYAxisNodes(this.#nodes, key === "ArrowUp");
      await this.#sleep(this.#animate.getAnimationTime());
    } else {
      for (let i = 0; i < this.#nodes.length; i++) {
        const newNodes = this.filterNodes(
          this.#nodes[i],
          key === "ArrowLeft",
          i
        );
        this.#nodes[i] = newNodes;
      }
      this.#animate.animateXAxisNodes(this.#nodes, key === "ArrowLeft");
      await this.#sleep(this.#animate.getAnimationTime());
    }
    if (this.#checkHasEmptyNodes()) {
      const [i, j] = this.#getValidEmptyRange();
      this.#updateNode(i, j, 4);
      this.#dom.updateNodes(this.#nodes);
    } else {
      this.#checkGameover();
    }
    this.#isAnimating = false;
  };

  filterNodes(arr, isLeft, i) {
    const stack = [];
    let sum = false;
    if (isLeft) {
      arr = arr.reverse();
    }
    for (let i = arr.length - 1; i >= 0; i--) {
      const e = arr[i];
      if (!e.value) continue;
      if (
        stack.length === 0 ||
        stack[stack.length - 1].value != e.value ||
        sum
      ) {
        arr[i]["animate"] = true;
        stack.push(arr[i]);
        sum = false;
      } else {
        sum = true;
        const lastNode = stack[stack.length - 1];
        arr[i]["animate"] = true;
        lastNode.value += e.value;
        if (e.hasOwnProperty("posX")) {
          lastNode["posX"] = e["posX"];
          lastNode["posY"] = e["posY"];
          lastNode["updatedValue"] = lastNode.value;
        }
        this.#dom.updateScore(stack[stack.length - 1].value);
      }
    }
    const extra = Array(4 - stack.length).fill({ value: 0 });
    if (isLeft) return stack.concat(extra);
    return extra.concat(stack.reverse());
  }

  #getRand(range) {
    return Math.floor(Math.random() * (range + 1));
  }
  #sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  #getValidEmptyRange() {
    let i = this.#getRand(3);
    let j = this.#getRand(3);
    while (`${this.#nodes[i][j]?.value}` != "0") {
      i = this.#getRand(3);
      j = this.#getRand(3);
    }
    return [i, j];
  }

  #checkHasEmptyNodes() {
    let c = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.#nodes[i][j].value) {
          c++;
        }
      }
    }
    return c < 16;
  }

  #checkGameover() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const { value } = this.#nodes[i][j];
        if (
          (this.#nodes[i]?.[j - 1] && this.#nodes[i][j - 1]?.value == value) ||
          (this.#nodes[i]?.[j + 1] && this.#nodes[i][j + 1]?.value == value) ||
          (this.#nodes[i - 1]?.[j] && this.#nodes[i - 1][j]?.value == value) ||
          (this.#nodes[i + 1]?.[j] && this.#nodes[i + 1][j]?.value == value)
        ) {
          return;
        }
      }
    }
    this.isGameover = true;
    alert("Gameover!!!");
    this.#dom.updateGameOver(true);
  }
}
