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
		state=State.FLOATING;
		constructor(parent: HTMLElement, name: string, startState: string) {
            if (this.constructor === Node) {
                throw new Error("Cannot instantiate abstract class Node");
            }
            this.htmlElement = document.createElement('div') as HTMLDivElement;
			this.titleElement = document.createElement('div') as HTMLDivElement;
			this.titleElement.classList.add("node-title");
            this.titleElement.innerHTML = `<h2 class="node-name">${name}</h2>`;
			this.setState('set')

			this.contentDiv = document.createElement('div') as HTMLDivElement;
			this.contentDiv.classList.add('node-content');	
            
			this.htmlElement.classList.add('node');
			this.htmlElement.appendChild(this.titleElement);
			this.titleElement.addEventListener('mousedown', ()=>{this.mouseDown(this);});
			this.titleElement.addEventListener('mouseup', ()=>{this.endDrag(this);});
			this.titleElement.addEventListener('mousemove',e=>this.dragMove(e,this);
			this.htmlElement.appendChild(this.contentDiv);
            parent.appendChild(this.htmlElement);

		}

        public setState(state: string) {
			this.state=state;
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

		public moveBy(x:number,y:number,node:Node){
			let left:number = parseInt(node.htmlElement.style.left.replace('px',''));
			let top:number = parseInt(node.htmlElement.style.top.replace('px',''));
			if(isNaN(left))
				left=0;
			if(isNaN(top))
				top=0;
			left+=x;

			top+=y;
			node.htmlElement.style.left=left.toString()+"px";
			node.htmlElement.style.top=top.toString()+"px";
		}

		private mouseDown(node:Node){
			this.setState('floating')
		}

		private dragMove(e:MouseEvent:node:Node){
			if(node.state == State.FLOATING)
				this.moveBy(e.offsetX,e.offsetY,node);
		}

		private endDrag(e:Event){
			this.setState('set')
		}


    }

    export class ExampleNode extends Node {
        constructor(parent: HTMLElement, startState: string = State.SET) {
            super(parent, "Example Node", startState);
        }
    }

    // const nodesTypes:Array = [ExampleNode];
}

