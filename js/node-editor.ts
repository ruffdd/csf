import * as nodes from "./nodes.js";

let nodeMenu: HTMLUListElement;
let nodeCanvas: HTMLElement;
let nodeEditor: HTMLElement;


function setup(event: Event) {

    nodeMenu = document.getElementById('nodes-toolbar')! as HTMLUListElement;
    nodeCanvas = document.getElementById('nodes-canvas')!;
    nodeEditor = document.getElementById('node-editor')!;
    {
		let currentElement : HTMLElement;
		currentElement=	document.createElement('li');
		currentElement.innerText="Example";
		currentElement.addEventListener('click', (e) => {new nodes.FilterNodes.ExampleNode(nodeCanvas);}); 
		nodeMenu.appendChild(currentElement);
    }
    console.log("Node editor setup complete");
}
document.addEventListener("DOMContentLoaded", setup);

function add_node_to_canvas(node: {() : void}) {
    
}

function node_canvas_click(event: MouseEvent) {
/*    if (nodeToAdd) {
        nodeToAdd();
        nodeToAdd = null;
    }*/
}
document.getElementById('nodes-canvas')!.addEventListener('click', node_canvas_click);
