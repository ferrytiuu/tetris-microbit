
const SerialPort = require('serialport');
const port = new SerialPort('COM4', { baudRate: 115200 });
const ReadLine = require('@serialport/parser-readline');
const parser = port.pipe(new ReadLine({ delimiter: '\n' }));

port.on('open', () => {
    console.log('Serial port opened!');
});

port.write('5\n', (error)=>{
    if(error){
        return console.log('Error: ',error.message)
    }else{
        console.log('Not error')
    }
});

/*setInterval(() => {
    numero = Math.floor(Math.random() * 7);
    console.log(numero.toString());
    port.write(numero+'\n', (error) => {
        if (error) {
            return console.log('Error: ', error.message)
        }
    })
},5000)*/