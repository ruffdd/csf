namespace FilterNodes {
  export class NodeEditor {
    private HTMLNodeMenu: HTMLUListElement;
    private HTMLNodeCanvas: HTMLElement;
    private HTMLNodeEditor: HTMLElement;
    private nodes: Node[] = [];

    constructor() {
      console.log("start creating node editor");
      this.HTMLNodeMenu = document.getElementById('nodes-toolbar')! as HTMLUListElement;
      this.HTMLNodeCanvas = document.getElementById('nodes-canvas')!;
      this.HTMLNodeEditor = document.getElementById('node-editor')!;
      {
        let currentElement: HTMLElement;
        currentElement = document.createElement('button');
        currentElement.innerText = "Save";
        currentElement.addEventListener('click', e => { this.save(); });
        this.HTMLNodeMenu.appendChild(currentElement);
      }
      {
        let currentElement: HTMLElement;
        currentElement = document.createElement('button');
        currentElement.innerText = "Example";
        currentElement.addEventListener('click', e => { listAdd(this.nodes, new FilterNodes.ExampleNode(this.HTMLNodeCanvas)); });
        this.HTMLNodeMenu.appendChild(currentElement);
      }
      {
        let currentElement: HTMLElement;
        currentElement = document.createElement('button');
        currentElement.innerText = "Subscribe";
        currentElement.addEventListener('click', e => listAdd(this.nodes, new FilterNodes.SubscribeNode(this.HTMLNodeCanvas)));
        this.HTMLNodeMenu.appendChild(currentElement);
      }
    }


    public save() {
      let output = {
        nodes: this.nodes.map((v) => {
          return {
            values: v.values.map(v => { return v.getValueString(); })
          }
        })
      }
      fetch("/user/filter/save", {
        method: 'POST',
        body: JSON.stringify(output),
        headers: {'Content-Type':'application/json'}
      });
    }
  }

  // class Save {
  //   nodes:Save.NodeSave[]=[]; 

  //   public NodeSave=class {

  //   }
  // }
}