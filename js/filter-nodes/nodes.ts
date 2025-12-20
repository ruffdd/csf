/// <reference path="base-node.ts" />

namespace FilterNodes {
    export class ExampleNode extends FilterNodes.Node {
        constructor(parent: HTMLElement, startState: string = State.SET) {
            super(parent, "Example Node", startState,ExampleNode.name);
        }
    }

    export class SubscribeNode extends Node{
        constructor(parent: HTMLElement, startState: string = State.SET) {
            super(parent, "Subscribed Calendar", startState,SubscribeNode.name);
            this.addValue(new NodeValueIcalAdress(this));
        }
    }
}