/*
const SerialPort = require('serialport');
const port = new SerialPort('COM4', {baudRate: 115200});
const ReadLine = require('@serialport/parser-readline');
const parser = port.pipe(new ReadLine({delimiter: '\n'}));

port.on('open',()=>{
    console.log('Serial port opened!');
});

let x = true;
setInterval(()=>
    port.write(`${x==true ? 0 : 1}\n`, (error)=>{
        if (error){
            return console.log('Error:',error.message);
        }else{
            if(x==true){
                console.log('1 - LED ON');
            }else{
                console.log('0 - LED OFF');
            }
        }
    }),
    x = !x
),1000
*/
