namespace FilterNodes {

  let nodeMenu: HTMLUListElement;
  let nodeCanvas: HTMLElement;
  let nodeEditor: HTMLElement;


  function setup(event: Event) {

    nodeMenu = document.getElementById('nodes-toolbar')! as HTMLUListElement;
    nodeCanvas = document.getElementById('nodes-canvas')!;
    nodeEditor = document.getElementById('node-editor')!;
    {
      let currentElement: HTMLElement;
      currentElement = document.createElement('li');
      currentElement.innerText = "Example";
      currentElement.addEventListener('click', (e) => { new FilterNodes.ExampleNode(nodeCanvas); });
      nodeMenu.appendChild(currentElement);
    }
    console.log("Node editor setup complete");
  }
  document.addEventListener("DOMContentLoaded", setup);
}