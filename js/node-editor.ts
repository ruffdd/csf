import * as nodes from "./nodes.js";

let nodeMenu: HTMLElement;
let nodeCanvas: HTMLElement;
let nodeEditor: HTMLElement;


function setup(event: Event) {

    nodeMenu = document.getElementById('nodes-toolbar')!;
    nodeCanvas = document.getElementById('nodes-canvas')!;
    nodeEditor = document.getElementById('node-editor')!;
    {
        new nodes.FilterNodes.ExampleNode(nodeMenu, nodes.FilterNodes.State.MENU_ITEM).htmlElement.addEventListener('click', () => {add_node_to_canvas(nodes.FilterNodes.ExampleNode);});
    }
    console.log("Node editor setup complete");
}
document.addEventListener("DOMContentLoaded", setup);

function add_node_to_canvas(node: {() : void}) {
    
}

function node_canvas_click(event: MouseEvent) {
    if (nodeToAdd) {
        nodeToAdd();
        nodeToAdd = null;
    }
}
document.getElementById('nodes-canvas')!.addEventListener('click', node_canvas_click);
