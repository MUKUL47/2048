class Animations {
  #dom;
  #animationTime = 200;
  constructor(dom) {
    this.#dom = dom;
  }
  getAnimationTime() {
    return this.#animationTime;
  }
  animateXAxisNodes(nodes, isLeft) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          !nodes[i][j].value ||
          (!nodes[i][j].hasOwnProperty("posX") &&
            !nodes[i][j].hasOwnProperty("posY"))
        )
          continue;
        const element = this.#dom.getNodeById(
          nodes[i][j].posY,
          nodes[i][j].posX
        );
        if (!nodes[i][j]["animate"]) continue;
        const absoluteXAxis = Math.abs(nodes[i][j].posX - j);
        const direction = !isLeft
          ? absoluteXAxis * 100 + absoluteXAxis * 5
          : -absoluteXAxis * 100 - absoluteXAxis * 5;
        element.children[0]
          .animate(
            [
              { transform: "translateX(0px)" },
              {
                transform: `translateX(${direction}px)`,
              },
            ],
            {
              duration: this.#animationTime,
              fill: "forwards",
            }
          )
          .finished.then(() => {
            if (element.children[0].className !== "block-2048") return;
            element.children[0].innerText =
              nodes[i][j].updatedValue || element.children[0].innerText;
            element.children[0].style.zIndex = 10;
            delete nodes[i][j]["animate"];
            nodes[i][j] = { value: nodes[i][j].value, posX: j, posY: i };
          });
      }
    }
  }
  animateYAxisNodes(nodes, isLeft) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          !nodes[i][j].value ||
          (!nodes[i][j].hasOwnProperty("posX") &&
            !nodes[i][j].hasOwnProperty("posY"))
        )
          continue;
        const element = this.#dom.getNodeById(
          nodes[i][j].posY,
          nodes[i][j].posX
        );
        if (!nodes[i][j]["animate"]) continue;
        const absoluteYAxis = Math.abs(nodes[i][j].posY - i);
        const direction = !isLeft
          ? absoluteYAxis * 100 + absoluteYAxis * 5
          : -absoluteYAxis * 100 - absoluteYAxis * 5;
        element.children[0]
          .animate(
            [
              { transform: "translateY(0px)" },
              {
                transform: `translateY(${direction}px)`,
              },
            ],
            {
              duration: this.#animationTime,
              fill: "forwards",
            }
          )
          .finished.then(() => {
            if (element.children[0].className !== "block-2048") return;
            element.children[0].innerText =
              nodes[i][j].updatedValue || element.children[0]?.innerText;
            element.children[0].style.zIndex = 10;
            delete nodes[i][j]["animate"];
            nodes[i][j] = { value: nodes[i][j].value, posX: j, posY: i };
          });
      }
    }
  }
}
