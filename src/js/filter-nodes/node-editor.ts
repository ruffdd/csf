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
      this.load();
    }


    public save() {
      let output = {
        nodes: this.nodes.map((v:Node) => {
          return {
            id:v.id,
            values: Array.from(v.values.entries()).map(p => { return [p[0], p[1].getValueString()]; }),
            position: v.getPositon(),
            type:v.type
          }
        })
      }
      fetch("/user/filter/save", {
        method: 'POST',
        body: JSON.stringify(output),
        headers: { 'Content-Type': 'application/json' }
      });
    }

    public load() {
      fetch("/user/filter/load", {

      }).then((response: Response) => {
        response.json().then(value => { 
          value['nodes'].forEach((node:any) => {
            let newNode:Node=this.addNode(node['type'],node['id']);
            newNode.setPosition(node['position']);
            let values:Map<string,string>= node['values'];
            values.forEach(v=>{newNode.values.get(v[0])!.set(v[1]);} );
          });
        });
      }).catch((response: Response) => {
        console.error(response);
      })
    }

    public addNode(type: String,id:number|undefined=undefined): FilterNodes.Node {
      let newNode: Node | undefined
      switch (type) {
        case ExampleNode.name:
          newNode = new ExampleNode(this.HTMLNodeCanvas,undefined,id);
          break;
        case SubscribeNode.name:
          newNode = new SubscribeNode(this.HTMLNodeCanvas,undefined,id=id);
          break;
        default:
          throw new TypeError(`${type} is not a known Node type`);
          break;
      }
      this.nodes.push(newNode);
      return newNode;
    }
  }

  // class Save {
  //   nodes:Save.NodeSave[]=[]; 

  //   public NodeSave=class {

  //   }
  // }
}