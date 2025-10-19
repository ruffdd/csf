export namespace FilterNodes {

    export const State = {
        MENU_ITEM: "menu-item",
        FLOATING: "floating",
        SET: "set"
    };

    export class Node {
        htmlElement: HTMLDivElement;
		titleElement: HTMLDivElement;
		contentDiv: HTMLDivElement;
		constructor(parent: HTMLElement, name: string, startState: string) {
            if (this.constructor === Node) {
                throw new Error("Cannot instantiate abstract class Node");
            }
            this.htmlElement = document.createElement('div') as HTMLDivElement;
			this.htmlElement.draggable=true;			
			this.titleElement = document.createElement('div') as HTMLDivElement;
			this.titleElement.classList.add("node-title");
            this.titleElement.innerHTML = `<h2 class="node-name">${name}</h2>`;
			
			this.contentDiv = document.createElement('div') as HTMLDivElement;
			this.contentDiv.classList.add('node-content');	
            
			this.htmlElement.classList.add('node');
			this.htmlElement.appendChild(this.titleElement);
//			this.titleElement.addEventListener onmousedown = this.mouseDown;
			this.htmlElement.appendChild(this.contentDiv);
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

		public moveBy(x:number,y:number){
			let left:number = parseFloat(this.htmlElement.style.left);
			let top:number = parseFloat(this.htmlElement.style.top);
			left+=x;
			top+=y;
			this.htmlElement.style.left=left.toString();
			this.htmlElement.style.top=left.toString();
		}

		private mouseDown(e:MouseEvent){
			this.titleElement.onmousedown=null;
			document.onmouseup=this.endDrag;
			document.onmousemove=this.dragMove;
			this.setState(State.FLOATING);
		}

		private dragMove(e:MouseEvent){
			this.moveBy(e.offsetX,e.offsetY);
		}

		private endDrag(e:Event){

		}


    }

    export class ExampleNode extends Node {
        constructor(parent: HTMLElement, startState: string = State.SET) {
            super(parent, "Example Node", startState);
        }
    }

    // const nodesTypes:Array = [ExampleNode];
}

