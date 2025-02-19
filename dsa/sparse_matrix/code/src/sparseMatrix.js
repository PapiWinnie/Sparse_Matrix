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

    setElement(row, col, value) {
        const key = `${row},${col}`;
        if (value !== 0) {
            this.matrix.set(key, value);
        } else {
            this.matrix.delete(key);
        }
    }

    getElement(row, col) {
        return this.matrix.get(`${row},${col}`) || 0;
    }

    add(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error("Matrix dimensions must match for addition.");
        }
        const result = new SparseMatrix();
        result.rows = this.rows;
        result.cols = this.cols;
        
        for (const [key, value] of this.matrix) {
            result.setElement(...key.split(',').map(Number), value);
        }
        for (const [key, value] of other.matrix) {
            const [row, col] = key.split(',').map(Number);
            result.setElement(row, col, result.getElement(row, col) + value);
        }
        return result;
    }
    
    subtract(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error("Matrix dimensions must match for subtraction.");
        }
        
        const result = new SparseMatrix();
        result.rows = this.rows;
        result.cols = this.cols;
        
        for (const [key, value] of this.matrix) {
            result.setElement(...key.split(',').map(Number), value);
        }
        
        for (const [key, value] of other.matrix) {
            const [row, col] = key.split(',').map(Number);
            result.setElement(row, col, result.getElement(row, col) - value);
        }
        
        return result;
    }
    
    multiply(other) {
        if (this.cols !== other.rows) {
            throw new Error("Matrix multiplication not possible: dimensions do not match");
        }
        
        const result = new SparseMatrix();
        result.rows = this.rows;
        result.cols = other.cols;
        
        for (const [key, value] of this.matrix) {
            const [row, col] = key.split(',').map(Number);
            
            for (let k = 0; k < other.cols; k++) {
                const otherValue = other.getElement(col, k);
                if (otherValue !== 0) {
                    result.setElement(row, k, result.getElement(row, k) + value * otherValue);
                }
            }
        }
        
        return result;
    }

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    readline.question('Choose operation: (1) Add, (2) Subtract, (3) Multiply: ', (operation) => {
        // Load sample files
        const sampleInputsDir = path.join(__dirname, '../../sample_inputs/');
        const txtFiles = fs.readdirSync(sampleInputsDir).filter(file => file.endsWith('.txt'));
    
        if (txtFiles.length < 2) {
            console.error("Error: Not enough .txt files in /sample_inputs/ folder.");
            process.exit(1);
        }
    
        const file1 = path.join(sampleInputsDir, txtFiles[0]);
        const file2 = path.join(sampleInputsDir, txtFiles[1]);
    
        const matrix1 = new SparseMatrix(file1);
        const matrix2 = new SparseMatrix(file2);
    
        let result;
        try {
            if (operation === '1') {
                result = matrix1.add(matrix2);
            } else if (operation === '2') {
                result = matrix1.subtract(matrix2);
            } else if (operation === '3') {
                result = matrix1.multiply(matrix2);
            } else {
                throw new Error("Invalid option selected!");
            }
            fs.writeFileSync(path.join(sampleInputsDir, 'result.txt'), result.toString(), 'utf8');
            console.log("Result saved.");
        } catch (error) {
            console.error("Error:", error.message);
        }
        readline.close();
    });
    
}