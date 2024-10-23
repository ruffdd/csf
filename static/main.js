"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function builder(event) {
    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", submit_form, false);
    });
    let calendar_list = document.getElementById('calendar-list');
    if (calendar_list != undefined) {
        get_json(new URL('cmd/source')).then(function (json) {
            json.forEach((element) => {
                let cal_tile = document.createElement('div');
                cal_tile.classList.add('calendar');
                let icon = document.createElement('img');
                icon.src = '/static/missing.ico';
                cal_tile.appendChild(icon);
                cal_tile.appendChild(document.createElement('br'));
                cal_tile.appendChild(document.createElement('div'));
                cal_tile.lastChild.classList.add('name');
                cal_tile.lastChild.innerText = element['name'];
                calendar_list.appendChild(cal_tile);
            });
        });
    }
}
function submit_form(event) {
    event.preventDefault();
    if (event.target == null)
        throw new Error();
    let form = event.target;
    form.classList.add("busy");
    for (let child of form.children) {
        child.setAttribute("disabled", "true");
    }
    let path = new URL(form.action);
    let met = form.method;
    let data = new FormData(form);
    fetch(path, { method: met, body: data }).then(function (response) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = form.querySelector('output[name="result"]');
            if (result == null) {
                result = document.createElement("output");
                result.name = "result";
                form.appendChild(result);
            }
            result.textContent = yield response.text();
            if ((!response.ok) != result.classList.contains('error-msg')) {
                result.classList.toggle('error-msg');
            }
            form.classList.remove("busy");
            for (let child of form.children) {
                child.removeAttribute("disabled");
            }
        });
    });
}
function get_json(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return fetch(path).then(function (response) {
            if (response.ok)
                return response.json();
            else
                throw new Error("could not load " + path);
        });
    });
}
document.addEventListener("DOMContentLoaded", builder);
