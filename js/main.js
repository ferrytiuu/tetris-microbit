var COLS = 10, ROWS = 20;
var board = [];
var lose;
var interval;
var intervalRender;
var current;
var currentX, currentY;
var freezed;
let puntuacio = 0;
var nom;

// Crea els arrays amb les diferents fitxes possibles
var shapes = [
    [1, 1, 1, 1],
    [1, 1, 1, 0,
        1],
    [1, 1, 1, 0,
        0, 0, 1],
    [1, 1, 0, 0,
        1, 1],
    [1, 1, 0, 0,
        0, 1, 1],
    [0, 1, 1, 0,
        1, 1],
    [0, 1, 0, 0,
        1, 1, 1]
];

var colors = [
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];

// Crea una nova forma aleatòria de l'array 4x4 en la variable global 'current'
// Envia l'ID de la forma al servidor Node per mostrar els LEDs
function newShape() {
    var id = Math.floor(Math.random() * shapes.length);
    var shape = shapes[id];

    document.getElementById('pecaActual').innerHTML = id;

    let formData = new FormData();
    formData.append('id', id);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/leds', true);
    xhr.responseType = 'json';

    xhr.onload = function (e) {
        if (this.status == 200) {
        }
    };

    xhr.send(formData);


    current = [];
    for (var y = 0; y < 4; ++y) {
        current[y] = [];
        for (var x = 0; x < 4; ++x) {
            var i = 4 * y + x;
            if (typeof shape[i] != 'undefined' && shape[i]) {
                current[y][x] = id + 1;
            }
            else {
                current[y][x] = 0;
            }
        }
    }

    freezed = false;
    currentX = 5;
    currentY = 0;

}

// Neteja el canvas
function init() {
    for (var y = 0; y < ROWS; ++y) {
        board[y] = [];
        for (var x = 0; x < COLS; ++x) {
            board[y][x] = 0;
        }
    }
}

// Mou l'element cap abaix, creant noves peces i netejant les línies
function tick() {
    if (valid(0, 1)) {
        ++currentY;
    }
    // if the element settled
    else {
        freeze();
        valid(0, 1);
        clearLines();
        if (lose) {
            clearAllIntervals();
            return false;
        }
        newShape();
    }
}

// Deixa fixa la forma al final de la línia
function freeze() {
    for (var y = 0; y < 4; ++y) {
        for (var x = 0; x < 4; ++x) {
            if (current[y][x]) {
                board[y + currentY][x + currentX] = current[y][x];
            }
        }
    }
    freezed = true;
    puntuacio += 50;
    console.log(puntuacio);
    document.getElementById('puntuacioPartida').innerHTML = puntuacio;
}

// Retorna la peça actual (current) rotada
function rotate(current) {
    var newCurrent = [];
    for (var y = 0; y < 4; ++y) {
        newCurrent[y] = [];
        for (var x = 0; x < 4; ++x) {
            newCurrent[y][x] = current[3 - x][y];
        }
    }

    return newCurrent;
}

// Comprova si les línies són plenes i les neteja
function clearLines() {
    for (var y = ROWS - 1; y >= 0; --y) {
        var rowFilled = true;
        for (var x = 0; x < COLS; ++x) {
            if (board[y][x] == 0) {
                rowFilled = false;
                break;
            }
        }
        if (rowFilled) {
            for (var yy = y; yy > 0; --yy) {
                for (var x = 0; x < COLS; ++x) {
                    board[yy][x] = board[yy - 1][x];
                }
            }
            ++y;
        }
    }
}


// Mou les peces segons la tecla que arribi
function keyPress(key) {
    console.log("teclaPulsada: "+ key);
    switch (key) {
        case 'left':
            if (valid(-1)) {
                --currentX;
            }
            break;
        case 'right':
            if (valid(1)) {
                ++currentX;
                console.log('valid');
            }
            break;
        case 'down':
            if (valid(0, 1)) {
                ++currentY;
            }
            break;
        case 'rotate':
            var rotated = rotate(current);
            if (valid(0, 0, rotated)) {
                current = rotated;
            }
            break;
        case 'drop':
            while (valid(0, 1)) {
                ++currentY;
            }
            tick();
            break;
        default:
            console.log('validDefault');
            break;
    }
}

// Comprova si la posició de la peça actual és possible
function valid(offsetX, offsetY, newCurrent) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;

    for (var y = 0; y < 4; ++y) {
        for (var x = 0; x < 4; ++x) {
            if (newCurrent[y][x]) {
                if (typeof board[y + offsetY] == 'undefined'
                    || typeof board[y + offsetY][x + offsetX] == 'undefined'
                    || board[y + offsetY][x + offsetX]
                    || x + offsetX < 0
                    || y + offsetY >= ROWS
                    || x + offsetX >= COLS) {
                    if (offsetY == 1 && freezed) {
                        lose = true; // lose if the current shape is settled at the top most row
                        enregistra_resultats();
                        document.getElementById('playbutton').disabled = false;
                    }
                    return false;
                }
            }
        }
    }
    return true;
}

// Comença la partida al clickar
let playButtonClicked = new Function("newGame();document.getElementById('playbutton').disabled = true;");


// Comença la nova partida
function newGame() {
    puntuacio = 0;
    document.getElementById('puntuacioPartida').innerHTML = puntuacio;
    clearAllIntervals();
    intervalRender = setInterval(render, 30);
    init();
    newShape();
    lose = false;
    interval = setInterval(tick, 400);
}

// Neteja el canvas
let clearAllIntervals = new Function('clearInterval(interval);clearInterval(intervalRender);');

// A l'apretar les tecles, crea un objecte, i assigna els valors numèrics de les tecles als noms dels moviments
// Envia els moviments a la funció keyPress perquè faci els moviments.
document.body.onkeydown = function (e) {
    var keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        38: 'rotate',
        32: 'drop'
    };
    if (typeof keys[e.keyCode] != 'undefined') {
        keyPress(keys[e.keyCode]);
        render();
    }
};

// Crea el canvas
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');
var W = 300, H = 600;
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;

// Crea els blocs
let drawBlock = (x, y) => {
    ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
    ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
}

// Dibuixa la taula i les figures que es mouen
function render() {
    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = 'black';
    for (var x = 0; x < COLS; ++x) {
        for (var y = 0; y < ROWS; ++y) {
            if (board[y][x]) {
                ctx.fillStyle = colors[board[y][x] - 1];
                drawBlock(x, y);
            }
        }
    }

    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black';
    for (var y = 0; y < 4; ++y) {
        for (var x = 0; x < 4; ++x) {
            if (current[y][x]) {
                ctx.fillStyle = colors[current[y][x] - 1];
                drawBlock(currentX + x, currentY + y);
            }
        }
    }
}

// Crea un interval de 0,3 secs on rep el botó enviat
setInterval(function () {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let teclaPresionada = this.responseText;
            document.getElementById("teclaPresionada").innerHTML = teclaPresionada;
            keyPress(teclaPresionada);
            render();
        }
    };
    xhttp.open("GET", "http://localhost:8888/botons");
    xhttp.send();
}, 2000);

// Crea un interval d'1 sec on envia l'estat de la partida
setInterval(function () {
    let formData = new FormData();
    formData.append('estado', lose);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/estatPartida', true);
    xhr.responseType = 'json';

    xhr.onload = function (e) {
        if (this.status == 200) {
        }
    };

    xhr.send(formData);
}, 1000);

// Crea la classe Emmagatzemador per guardar les puntuacions mitjançant WebStorage

class Emmagatzemador {
    constructor() {
        this.taula = document.getElementById("taula");
    }
    desar(nomDesar) {
        localStorage.setItem(nomDesar, puntuacio);
        this.esborrarTaula();
        this.mostrar();
    }
    mostrar() {
        for (var i = 0; i < localStorage.length; i++) {
            var fila = this.taula.insertRow(0);
            fila.insertCell(0).innerHTML = localStorage.key(i);
            fila.insertCell(1).innerHTML = localStorage.getItem(localStorage.key(i));
        };
    }
    esborrarTaula() {
        while (this.taula.rows.length > 0) {
            this.taula.deleteRow(0);
        }
    } 
}

var emmagatzematge = new Emmagatzemador();

let enregistra_resultats = () => {
    var nom = prompt('Introdueix el teu nom: ');
    emmagatzematge.desar(nom);
}

window.onload = () => emmagatzematge.mostrar();

/*
-localStorage.clear(); per borrar el ranking

Coses a fer:
-Us tecnologia:
	-musica
	-botons
	-led amb forma
-Emmagatzematge de dades:
	-ordenar ranking webstorage (no dona nota)
    -s'ha d'impedir registrar valors null, undefined i espais en blanc al ranking (no dona nota)
	-utilitzar indexedDB
-HTML5 APIs:
	-fer servir una tercera api
-POO:
    -afegirlis herencia i poliformisme
	-crear moduls
-Arrays:
	-fer piles i cues
	-utilitzar metodes: sort, slice, foreach, map, reduce i filter
	-utilitzar estructures for-in i for-of
*/
