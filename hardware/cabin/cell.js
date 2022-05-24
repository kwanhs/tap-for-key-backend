
class Cell {
    constructor(boardNo = 1, cellNo, serial) {
        this.cellNo = cellNo;
        this.closed = false;
        this.serial = serial;
    }

    isOpened() {
        return !this.isClosed();
    }

    isClosed() {
        return this.closed;
    }

    setClosed(closed) {
        this.closed = closed;
    }

    open() {
        this.serial.unlock(this.boardNo, this.cellNo);
    }
}

module.exports = Cell