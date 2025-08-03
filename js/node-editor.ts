import * as nodes from "./nodes.js";

let nodeToAdd: {() : void} | null = null;
let nodeMenu: HTMLElement;
let nodeCanvas: HTMLElement;

function setup(event: Event) {

    nodeMenu = document.getElementById('nodes-toolbar')!;
    nodeCanvas = document.getElementById('nodes-canvas')!;
    {
        let exampleNodeEntry: HTMLLIElement = document.createElement('li');
        exampleNodeEntry.innerText = "Example Node";
        exampleNodeEntry.addEventListener('click', (event) => {nodeToAdd = () =>{new nodes.FilterNodes.ExampleNode(nodeCanvas);}});
        nodeMenu.appendChild(exampleNodeEntry);
    }
    console.log("Node editor setup complete");
}
document.addEventListener("DOMContentLoaded", setup);


function node_canvas_click(event: MouseEvent) {
    if (nodeToAdd) {
        nodeToAdd();
        nodeToAdd = null;
    }
}
document.getElementById('nodes-canvas')!.addEventListener('click', node_canvas_click);
