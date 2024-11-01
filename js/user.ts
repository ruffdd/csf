let sources:JSON;

function make_url(file: string) {
    let base = window.location;
    return new URL((!file.startsWith("/") ? "/" : "") + file, base.href.replace(base.pathname, ""));
}

document.addEventListener("DOMContentLoaded", (event) => {
    let calendar_list = document.getElementById('sources-list')!;
    get_json(make_url('/cmd/source')).then(function (json) {
        sources=json;
        json.forEach((element: any) => {
            let icon_src='/static/missing.ico';
            calendar_list.innerHTML+=`
                <div class="calendar">
                    <img src="${icon_src}">
                    <br>
                    <h4 class="name" title="${element['path']}">${element['name']}</h4>
                    <menu>
                        <button onclick="preview_calendar('/cmd/source/${element['name']}/preview');">preview</button>
                    </menu>
                </div>
            `;
        });
    });
    
    let pipes_list = document.getElementById('pipes-list')!;
    get_json(make_url('/cmd/pipe')).then(function (json) {
        pipes_list.innerHTML="";
        json.forEach((element: any) => {
            pipes_list.innerHTML+=`
            <div class="pipe">
                <h3 class="name">${element["name"]}</h3>
            `;
        });
    });

});

function add_popup(content:HTMLElement){
    let popup=document.createElement("div");
    popup.className="popup";
    let close_button=document.createElement("button");
    close_button.innerText="X";
    close_button.addEventListener("click",(event)=>{
        let target=(event.target as HTMLElement)!;
        target.parentElement?.parentElement?.removeChild(target.parentElement!);
    })
    popup.appendChild(close_button);
    popup.appendChild(content);
    document.getElementsByTagName('body')[0].appendChild(popup);
}


function preview_calendar(path:URL){
    fetch(path).then(function(response){
        if(response.ok)
            return response.text()
        else
            "could not get calendar"
    }).then(function(content){
        let element=document.createElement("p");
        element.innerText=content||"";
        add_popup(element);
    });
}