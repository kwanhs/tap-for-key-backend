const SerialPort = require('serialport');
const InterByteTimeout = require('@serialport/parser-inter-byte-timeout')


function concatCommand(arr) {
    var checkSum = recursiveXor(arr);
    arr.push(checkSum);
    return Buffer.from(arr);
}

function recursiveXor(arr) {
    return arr.reduce(function(total,next) {
        return total ^ next;
    });
}

class Serial {
    constructor(comPort, baudRate = 9600, callback) {
        this.board = new SerialPort(comPort, {
            baudRate:   baudRate,
            dataBits:   8,
            parity:     'none',
            stopBits:   1,
            rtscts:     false,
            xon:        false,
            xoff:       false,
            xany:       false
        
        }, callback);
        
        return this;
    }

    getChannel(cellNo) {
        return this.channel[cellNo-1];
    }
    
    getCellNo(chNo) {
        return this.channel.findIndex(ch => ch===chNo)+1;
    }

    async initializeParser() {
        const parser = await this.board.pipe(new InterByteTimeout({interval: 30}));
        await parser.on('data', this.parse.bind(this));
        this.board.write(Buffer.from([0x80, 0x01, 0x00, 0x33, 0xb2]));
        return this;
    }

    unlock(boardNo = 1, cellNo) {
        this.board.write(concatCommand([0x8A, boardNo, this.getChannel(cellNo), 0x11]));
        return this;
    }

    refreshAllCells(boardNo = 1) {
        this.board.write(Buffer.from([0x80, boardNo, 0x00, 0x33, 0xb2]));
        return this;
    }

    parse(bytes) {
        let arr = [...bytes];
        let command = arr[0];
        let content = arr.slice(1);
        let checksum = content.pop();

        let board, ch, state;

        if (recursiveXor([command, ...content]) !== checksum) return;

        // console.log(bytes);

        switch (command) {
            case 0x82: // spontaneous, unrelated to action by board
            case 0x8a: // self-check after unlock command is issued
                [board, ch, state] = content;
                let cell = this.getCellNo(ch);
                this.updateCallBack(board, cell, state);
                break;

            case 0x80:
                board = content[0];
                let meaninglessThirtyThree = content.pop();
                let states = content.slice(1);
                this.updateAllCallBack(board, states);
                break;
        }
    }

    setChannelForCell(channel) {
        this.channel = channel;
        return this; 
    }

    onUpdateCell(callback) {
        this.updateCallBack = callback;
        return this;
    }

    onUpdateAllCell(callback) {
        this.updateAllCallBack = callback;
        return this;
    }
}

module.exports = Serial;