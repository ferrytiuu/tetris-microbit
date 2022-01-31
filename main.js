
/*document.getElementById('estat').addEventListener('click', canviaEstat, true);
let estatPartida = true;

setInterval(function () {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("teclaPresionada").innerHTML =
                this.responseText;
        }
    };
    xhttp.open("GET", "http://localhost:8888/servidor");
    xhttp.send();
}, 100);

function canviaEstat(){
    estatPartida = !estatPartida;
    console.log(estatPartida);
}*/