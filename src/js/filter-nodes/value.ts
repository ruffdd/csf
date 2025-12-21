namespace FilterNodes{
    export abstract class NodeValue{
        protected parent:Node;
        uiElement:HTMLInputElement;
        constructor(parentNode:Node,uiElement:HTMLInputElement){
            this.parent=parentNode;
            this.uiElement=uiElement;
        }

        public getValueString():string{
            return this.uiElement.value;
        }

        public set(value:string){
            this.uiElement.value=value;
        }
    }

    export class NodeValueIcalAdress extends NodeValue{
        constructor(parentNode:Node){
            super(parentNode,document.createElement('input') as HTMLInputElement);
            this.parent=parentNode;

            this.uiElement.type='url';
        }

        public getValue():URL{
            return new URL(this.getValueString());
        }

    }
}