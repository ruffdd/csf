function make_url(file: string) {
    let base = window.location;
    return new URL((!file.startsWith("/") ? "/" : "") + file, base.href.replace(base.pathname, ""));
}

document.addEventListener("DOMContentLoaded", (event) => {
    let calendar_list = document.getElementById('sources-list')!;
    get_json(make_url('/cmd/source')).then(function (json) {
        json.forEach((element: any) => {
            let cal_tile = document.createElement('div');
            cal_tile.classList.add('calendar');
            let icon = document.createElement('img');
            icon.src = '/static/missing.ico';
            cal_tile.appendChild(icon);
            cal_tile.appendChild(document.createElement('br'));
            cal_tile.appendChild(document.createElement('div'));
            (cal_tile.lastChild as HTMLDivElement).classList.add('name');
            (cal_tile.lastChild as HTMLDivElement).title=element['path'];
            (cal_tile.lastChild as HTMLDivElement).innerText = element['name'];
            calendar_list.appendChild(cal_tile);
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
