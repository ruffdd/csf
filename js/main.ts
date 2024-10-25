
function builder(event: Event) {
    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", submit_form, false);
    });
}

function submit_form(event: Event) {
    event.preventDefault();
    if (event.target == null)
        throw new Error();
    let form = event.target as HTMLFormElement;
    let data:FormData = new FormData(form);
    form.classList.add("busy");
    for (let child of form.children){
        child.setAttribute("disabled","true");
    }
    let path = new URL(form.action);
    let met = form.method;
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