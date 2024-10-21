

function builder() {
    let calendar_list=document.getElementById('calendar-list');
    if (calendar_list != undefined) {
        get_json('cmd/source').then(function (json){
            json.forEach(element => {
                let cal_tile = document.createElement('div');
                cal_tile.classList = ['calendar'];
                let icon = document.createElement('img');
                icon.src='/static/missing.ico';
                cal_tile.appendChild(icon)
                cal_tile.appendChild(document.createElement('br'))
                cal_tile.appendChild(document.createElement('div'))
                cal_tile.lastChild.classList=['name'];
                cal_tile.lastChild.innerText=element['name'];
                calendar_list.appendChild(cal_tile);
            });
        });
    }

}

async function get_json(path) {
    return fetch(path).then(function(response){
        if (response.ok)
            return response.json();
        else
        throw new Error("could not load "+path);
    })
}

document.addEventListener("DOMContentLoaded",builder)