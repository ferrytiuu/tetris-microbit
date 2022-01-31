const { fstat } = require("fs");
var http = require("http");
var url = require("url");
var fs = require("fs");

const SerialPort = require('serialport');
const port = new SerialPort('COM4', {baudRate: 115200});
const ReadLine = require('@serialport/parser-readline');
const parser = port.pipe(new ReadLine({delimiter: '\n'}));


var botons = [];


function iniciar() {
    
    port.on('open',()=>{
        console.log('Serial port opened!');
    });
    parser.on('data', (data)=>{
        console.log(data);
        botons.push(data);
    });

    function onRequest(req, res) {
        const baseURL = req.protocol + '://' + req.headers.host + '/';
        const reqUrl = new URL(req.url, baseURL);
        console.log(reqUrl);
        console.log("Petició per a  " + reqUrl.pathname + " rebuda.");

        if(reqUrl.pathname == '/inici'){
            fs.readFile('prova.html', function(err, data) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
              });
        }
        /*else if(reqUrl.pathname == 'js/main.js'){
            function main() {
                let content = fs.readFileSync('./main.js', {encoding: 'utf8'});
                if(content == null){
                    return "h1";
                }
                console.log("Datos: "+content);
                return [content,{ "Content-Type": "text/javascript; charset=utf-8" }];
            }
        }*/
        else{
            let botonsPila = botons.shift();
            if(botonsPila==undefined){
                botonsPila="0";
            }
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8"});
            res.write(botonsPila);
            console.log(botonsPila);
            return res.end();
            
        }

    }


    

    http.createServer(onRequest).listen(8888);
    console.log("Servidor iniciat.");
}

exports.iniciar = iniciar;