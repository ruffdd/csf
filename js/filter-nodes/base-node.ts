
namespace FilterNodes {
	export const State = {
		MENU_ITEM: "menu-item",
		FLOATING: "floating",
		SET: "set"
	};


	export class Node {
		protected htmlElement: HTMLDivElement;
		protected titleElement: HTMLDivElement;
		protected contentDiv: HTMLDivElement;
		protected state = State.FLOATING;
		protected startMouse: [number, number];
		protected startPosition:[number,number];
		public values: NodeValue[]=[];

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
			this.titleElement.addEventListener('mousedown', e => this.dragStart(e));
			this.titleElement.addEventListener('mouseup', e => { this.endDrag(e, this); });
			// this.titleElement.addEventListener('mouseleave', e=>{this.endDrag(e,this);});
			// this.titleElement.addEventListener('mouseenter', e=>{this.endDrag(e,this);});
			document.addEventListener('mousemove', e => this.dragMove(e, this));
			this.htmlElement.appendChild(this.contentDiv);
			parent.appendChild(this.htmlElement);
			this.startMouse = [0, 0];
			this.startPosition=this.getPositon();
		}

		protected addValue(value:NodeValue){
			this.values.push(value);
			this.contentDiv.append(value.uiElement);
		}

		public setState(state: string) {
			this.state = state;
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


		private dragStart(this: Node, e: MouseEvent) {
			if (this.state == State.SET) {
				this.setState('floating')
				this.startMouse= [e.x,e.y];
				this.startPosition=this.getPositon();
			}
		}

		private dragMove(e: MouseEvent, node: Node) {
			if (node.state == State.FLOATING) {
				let move= sub([e.x,e.y],this.startMouse);
				let next = add(this.startPosition,move);
				node.setPosition(next);
			} else {
			}
		}

		private endDrag(e: Event, node: Node) {
			if (node.state == State.FLOATING) {
				node.setState('set')
			}
		}

		public getPositon(): [number, number] {
			let left: number = parseInt(this.htmlElement.style.left.replace('px', ''));
			let top: number = parseInt(this.htmlElement.style.top.replace('px', ''));
			if (isNaN(left))
				left = 0;
			if (isNaN(top))
				top = 0;
			return [left, top]
		}

		public getPositonViewport(): [number, number] {
			let rect = this.htmlElement.getBoundingClientRect()
			return [rect.left, rect.top]
		}

		public setPosition(pos: [number, number]) {
			this.htmlElement.style.left = pos[0].toString() + "px";
			this.htmlElement.style.top = pos[1].toString() + "px";
		}
	}


	// const nodesTypes:Array = [ExampleNode];
}

