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
                    <li onclick="preview_calendar('${element['path']}');">preview</li>
                    </menu>
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
        document.removeChild((event.target as HTMLElement)!.parentElement!);
    })
    popup.appendChild(content);
}


function preview_calendar(path:URL){
    fetch(path).then((response)=>{
        if(response.ok)
            return response.text()
        else
            "could not get calendar"
    }).then((content)=>{
        let element=document.createElement("p");
        element.innerText=content||"";
        add_popup(element);
    });
}