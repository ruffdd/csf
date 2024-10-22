
function builder(event:Event) {
    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit",submit_form,false);
    });

    let calendar_list=document.getElementById('calendar-list');
    if (calendar_list != undefined) {
        get_json(new URL('cmd/source')).then(function (json){
            json.forEach((element:any) => {
                let cal_tile = document.createElement('div');
                cal_tile.classList.add('calendar');
                let icon = document.createElement('img');
                icon.src='/static/missing.ico';
                cal_tile.appendChild(icon);
                cal_tile.appendChild(document.createElement('br'));
                cal_tile.appendChild(document.createElement('div'));
                (cal_tile.lastChild as HTMLDivElement).classList.add('name');
                (cal_tile.lastChild as HTMLDivElement).innerText=element['name'];
                calendar_list.appendChild(cal_tile);
            });
        });
    }
}

function submit_form(event:Event){
    event.preventDefault();
    if (event.target == null)
        throw new Error();
    let form= event.target as HTMLFormElement;
    let path=new URL(form.action);
    let met=form.method;
    let data=new FormData(form);
    fetch(path,{method:met,body:JSON.stringify({FormData:data})}).then(function(response){
        if (response.ok)
            return response.text();
        else
            throw new Error("Error while reaching "+path.toString());
    }).then(text=>{

    })

}

async function get_json(path:URL) {
    return fetch(path).then(function(response){
        if (response.ok)
            return response.json();
        else
        throw new Error("could not load "+path);
    })
}

document.addEventListener("DOMContentLoaded",builder)