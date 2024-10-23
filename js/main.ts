
function builder(event: Event) {
    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", submit_form, false);
    });

    let calendar_list = document.getElementById('calendar-list');
    if (calendar_list != undefined) {
        get_json(new URL('cmd/source')).then(function (json) {
            json.forEach((element: any) => {
                let cal_tile = document.createElement('div');
                cal_tile.classList.add('calendar');
                let icon = document.createElement('img');
                icon.src = '/static/missing.ico';
                cal_tile.appendChild(icon);
                cal_tile.appendChild(document.createElement('br'));
                cal_tile.appendChild(document.createElement('div'));
                (cal_tile.lastChild as HTMLDivElement).classList.add('name');
                (cal_tile.lastChild as HTMLDivElement).innerText = element['name'];
                calendar_list.appendChild(cal_tile);
            });
        });
    }
}

function submit_form(event: Event) {
    event.preventDefault();
    if (event.target == null)
        throw new Error();
    let form = event.target as HTMLFormElement;
    form.classList.add("busy");
    for (let child of form.children){
        child.setAttribute("disabled","true");
    }
    let path = new URL(form.action);
    let met = form.method;
    let data = new FormData(form);
    fetch(path, { method: met, body: data }).then(async function (response) {
        let result = form.querySelector<HTMLOutputElement>('output[name="result"]');
        if (result == null) {
            result=document.createElement("output");
            result.name="result";
            form.appendChild(result);
        }
        result.textContent=await response.text();
        if ((!response.ok) != result.classList.contains('error-msg')){
            result.classList.toggle('error-msg');
        }
        form.classList.remove("busy");
        for (let child of form.children){
            child.removeAttribute("disabled");
        }
    })
}

async function get_json(path: URL) {
    return fetch(path).then(function (response) {
        if (response.ok)
            return response.json();
        else
            throw new Error("could not load " + path);
    })
}

document.addEventListener("DOMContentLoaded", builder)