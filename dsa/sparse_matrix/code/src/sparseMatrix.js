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

    loadFromFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8').trim();
            const lines = content.split('\n').map(line => line.trim());

            this.rows = parseInt(lines[0].split('=')[1]);
            this.cols = parseInt(lines[1].split('=')[1]);

            for (let i = 2; i < lines.length; i++) {
                const parts = lines[i].replace(/[()]/g, '').split(',').map(Number);
                if (parts.length !== 3) {
                    throw new Error(`Invalid entry at line ${i + 1}: ${lines[i]}`);
                }
                const [row, col, value] = parts;
                this.setElement(row, col, value);
            }
        } catch (error) {
            console.error("Error reading file:", error.message);
            process.exit(1);
        }
    }
}