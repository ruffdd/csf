
let sources: JSON;
function make_url(file: string) {
    let base = window.location;
    return new URL((!file.startsWith("/") ? "/" : "") + file, base.href.replace(base.pathname, ""));
}


function setup(event: Event) {
}
document.addEventListener("DOMContentLoaded", setup);



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