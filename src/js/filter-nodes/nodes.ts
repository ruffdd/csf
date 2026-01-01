/// <reference path="base-node.ts" />

namespace FilterNodes {
    export class ExampleNode extends FilterNodes.Node {
        constructor(parent: HTMLElement, startState: string = State.SET,id:number|undefined=undefined) {
            super(parent, "Example Node", startState,ExampleNode.name);
        }
    }

    export class SubscribeNode extends Node{
        constructor(parent: HTMLElement, startState: string = State.SET,id:number|undefined=undefined) {
            super(parent, "Subscribed Calendar", startState,SubscribeNode.name,id);
            this.addValue('src_adress', new NodeValueIcalAdress(this));
        }
    }
}