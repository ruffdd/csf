export namespace FilterNodes {

    export const State = {
        MENU_ITEM: "menu-item",
        FLOATING: "floating",
        SET: "set"
    };

    export class Node {
        htmlElement: HTMLDivElement;
        constructor(parent: HTMLElement, name: string, startState: string) {
            if (this.constructor === Node) {
                throw new Error("Cannot instantiate abstract class Node");
            }
            this.htmlElement = document.createElement('div') as HTMLDivElement;
            this.htmlElement.innerHTML = `<div class="node-title"><h2 class="node-name">${name}</h2></div>`;
			let contentDiv:HTMLDivElement = document.createElement('div') as HTMLDivElement;
			contentDiv.classList.add('node-content');	
            this.htmlElement.classList.add('node');
			this.htmlElement.appendChild(contentDiv);
            parent.appendChild(this.htmlElement);
        }

        public setState(state: string) {
            this.htmlElement.classList.remove('menu-item', 'floating', 'set');
            switch (state) {
                case State.MENU_ITEM:
                    this.htmlElement.classList.add('menu-item');
                    break;
                case State.FLOATING:
                    this.htmlElement.classList.add('floating');
                    break;
                case State.SET:
                    this.htmlElement.classList.add('set');
                    break;
            }
        }

    }

    export class ExampleNode extends Node {
        constructor(parent: HTMLElement, startState: string = State.SET) {
            super(parent, "Example Node", startState);
        }
    }

    // const nodesTypes:Array = [ExampleNode];
}

