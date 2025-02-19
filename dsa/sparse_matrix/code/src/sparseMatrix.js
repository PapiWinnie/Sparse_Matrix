const fs = require('fs');
const path = require('path');

class SparseMatrix {
    constructor(filePath = null) {
        this.matrix = new Map();
        this.rows = 0;
        this.cols = 0;
        if (filePath) {
            this.loadFromFile(filePath);
        }
    }
}