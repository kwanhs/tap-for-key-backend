
const Serial = require('./serial');
const chalk = require('chalk');
const Cell = require('./cell');

class Cabin {
    constructor(numberOfCells, channel) {
        this.cells = new Array(numberOfCells+1);
        this.numberOfCells = numberOfCells;
        this.channel = channel;
    }

    async initialize(callback) {
        this.serial = new Serial(
            process.env['BOARD_COM'],
            +process.env['BOARD_BAUD'],
            callback
        );
        
        this.serial
            .onUpdateCell(this.setCellState.bind(this))
            .onUpdateAllCell(this.setAllCellState.bind(this))
            .setChannelForCell(this.channel);
        
        this.serial.initializeParser();

        for (let i=1; i<this.numberOfCells+1; i++) {
            this.cells[i] = new Cell(1, i, this.serial);
        }
    }

    async update() {
        this.serial.refreshAllCells();
    }

    setCellState(board, cell, state) {
        this.cells[cell].setClosed(!state);
        
        let stateVerbose = state ? 'opened' : 'closed';
        let stateInternal = this.cells[cell].isOpened() ? 'opened' : 'closed';

        console.log(chalk.yellow(`B${board} C${cell} ${stateVerbose}.`));
        // console.log(chalk.green(`Internal state: ${stateInternal}`));
    }
    
    setAllCellState(board, states) {
        let canonicalStates = states.reverse();

        let opened = [];
        let closed = [];

        for (let cell=1; cell<this.numberOfCells+1; cell++) {
            let ch = this.serial.getChannel(cell);
            
            let bitPos = (ch - 1) % 8;
            let bytePos = (ch - 1 - bitPos) / 8;

            let state = (canonicalStates[bytePos] >> bitPos) & 1;

            if (state)
                opened.push(cell);
            else
                closed.push(cell);

            this.cells[cell].setClosed(!state);
        }

        console.log('Setting to ' + chalk.yellow('opened') + ': ' + opened);
        console.log('Setting to ' + chalk.yellow('closed') + ': ' + closed);
    }
}

module.exports = Cabin;