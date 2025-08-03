export namespace FilterNodes {
    
    export class Node {
        htmlElement: HTMLDivElement;
        constructor(parent: HTMLElement,name: string) {
            if (this.constructor === Node) {
                throw new Error("Cannot instantiate abstract class Node");
            }
            this.htmlElement = document.createElement('div') as HTMLDivElement;
            this.htmlElement.innerHTML = `<h2>${name}</h2>`;
            parent.appendChild(this.htmlElement);
        }
    }
    
    export class ExampleNode extends Node {
        constructor(parent:HTMLElement ) {
            super(parent, "Example Node");
        }
    }
    
    // const nodesTypes:Array = [ExampleNode];
}

