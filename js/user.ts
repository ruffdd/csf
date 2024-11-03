let sources: JSON;

function make_url(file: string) {
    let base = window.location;
    return new URL((!file.startsWith("/") ? "/" : "") + file, base.href.replace(base.pathname, ""));
}

document.addEventListener("DOMContentLoaded", (event) => {
    let calendar_list = document.getElementById('sources-list')!;
    get_json(make_url('/cmd/source')).then(function (json) {
        sources = json;
        json.forEach((element: any) => {
            let icon_src = '/static/missing.ico';
            calendar_list.innerHTML += `
                <div class="calendar" onclick="set_pipe_list(${element['id']})">
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


});

function set_pipe_list(source_id: number) {
    let pipes_list = document.getElementById('pipes-list')!;
    pipes_list.innerHTML = "";
    let addForm = document.getElementById("add-pipe-form") as HTMLFormElement;
    addForm.source_id.value = source_id;

    get_json(make_url('/cmd/pipe?source_id=' + String(source_id))).then(function (json) {
        pipes_list.innerHTML = "";
        json.forEach((element: any) => {
            let pipe_id=element['id'];
            let pipe_element = document.createElement('div');
            pipe_element.className = 'pipe';
            pipe_element.innerHTML = `<h3 class="name">${element["name"]}</h3>`;
            let sink = document.createElement('div');
            sink.className = "sink";
            pipe_element.appendChild(sink)

            get_json(make_url("cmd/sink?name=" + element['name'])).then(function (json) {
                if (json.length > 0) {
                    json.forEach((element: any) => {
                        sink.innerText += element["name"];
                    })
                } else {
                    sink.innerHTML = `
                        <form action="cmd/sink/add" method="post" name="add-sink" id="add-sink-form">
                            <h4>add sink</h4>
                            <input type="text" name="nam">
                            <input type="hidden" name="pipe_id" value="${pipe_id}">
                            <button>+</button>
                        </form>`
                }
            });
            pipes_list.appendChild(pipe_element);
        });
    });
}

function add_popup(content: HTMLElement) {
    let popup = document.createElement("div");
    popup.className = "popup";
    let close_button = document.createElement("button");
    close_button.innerText = "X";
    close_button.addEventListener("click", (event) => {
        let target = (event.target as HTMLElement)!;
        target.parentElement?.parentElement?.removeChild(target.parentElement!);
    })
    popup.appendChild(close_button);
    popup.appendChild(content);
    document.getElementsByTagName('body')[0].appendChild(popup);
}


function preview_calendar(path: URL) {
    fetch(path).then(function (response) {
        if (response.ok)
            return response.text()
        else
            "could not get calendar"
    }).then(function (content) {
        let element = document.createElement("p");
        element.innerText = content || "";
        add_popup(element);
    });
}