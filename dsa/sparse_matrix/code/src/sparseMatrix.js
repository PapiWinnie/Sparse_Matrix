const fs = require('fs');
const path = require('path');

// Class to represent a sparse matrix
class SparseMatrix {
    constructor(filePath = null) {
        this.matrix = new Map(); // Stores non-zero elements with "row,col" as key
        this.rows = 0;
        this.cols = 0;
        if (filePath) {
            this.loadFromFile(filePath);
        }
    }

    // Load matrix from a file
    loadFromFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8').trim();
            const lines = content.split('\n').map(line => line.trim());

            console.log(`Reading file: ${filePath}`);

            this.rows = parseInt(lines[0].split('=')[1]); // Extract number of rows
            this.cols = parseInt(lines[1].split('=')[1]); // Extract number of columns

            console.log(`Loaded matrix with dimensions: ${this.rows}x${this.cols}`);

            // Parse non-zero values from file
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

    // Set element value in the matrix
    setElement(row, col, value) {
        const key = `${row},${col}`;
        if (value !== 0) {
            this.matrix.set(key, value);
        } else {
            this.matrix.delete(key); // Remove zero values from storage
        }
    }

    // Get element value from the matrix
    getElement(row, col) {
        return this.matrix.get(`${row},${col}`) || 0;
    }

    // Perform matrix addition
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

    // Perform matrix subtraction
    subtract(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error("Matrix dimensions must match for subtraction.");
        }
    
        const result = new SparseMatrix(null);
        result.rows = this.rows;
        result.cols = this.cols;
    
        for (const [key, value] of this.matrix) {
            result.setElement(...key.split(',').map(Number), value);
        }
    
        for (const [key, value] of other.matrix) {
            const [row, col] = key.split(',').map(Number);
            const newValue = result.getElement(row, col) - value;
    
            if (newValue !== 0) {
                result.setElement(row, col, newValue);
            }
        }
    
        return result;
    }
    
    // Perform matrix multiplication
    multiply(other) {
        if (this.cols !== other.rows) {
            throw new Error(`Matrix multiplication not possible: ${this.rows}x${this.cols} cannot be multiplied by ${other.rows}x${other.cols}`);
        }
    
        const result = new SparseMatrix(null);
        result.rows = this.rows;
        result.cols = other.cols;
    
        for (const [key, value] of this.matrix) {
            const [row, col] = key.split(',').map(Number);
    
            for (let k = 0; k < other.cols; k++) {
                const otherValue = other.getElement(col, k);
                if (otherValue !== 0) {
                    const newValue = result.getElement(row, k) + value * otherValue;
                    result.setElement(row, k, newValue);
                }
            }
        }
    
        return result;
    }
    
    // Convert matrix to string representation for saving to file
    toString() {
        let output = `rows=${this.rows}\ncols=${this.cols}\n`;
        for (const [key, value] of this.matrix) {
            output += `(${key}, ${value})\n`;
        }
        return output;
    }
}

// Load sample input files
const sampleInputsDir = path.join(__dirname, '../../sample_inputs/');
const txtFiles = fs.readdirSync(sampleInputsDir).filter(file => file.endsWith('.txt'));

if (txtFiles.length < 2) {
    console.error("Error: Not enough .txt files in /sample_inputs/ folder.");
    process.exit(1);
}

const file1 = path.join(sampleInputsDir, txtFiles[0]);
const file2 = path.join(sampleInputsDir, txtFiles[1]);

console.log(`Using files:\n1. ${file1}\n2. ${file2}`);

const matrix1 = new SparseMatrix(file1);
const matrix2 = new SparseMatrix(file2);

// User input for matrix operation selection
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Choose operation: (1) Add, (2) Subtract, (3) Multiply: ', (operation) => {
    let result;
    try {
        if (operation === '1') {
            console.log("Performing Addition...");
            result = matrix1.add(matrix2);
        } else if (operation === '2') {
            console.log("Performing Subtraction...");
            result = matrix1.subtract(matrix2);
        } else if (operation === '3') {
            console.log("Performing Multiplication...");
            result = matrix1.multiply(matrix2);
        } else {
            throw new Error("Invalid option selected!");
        }
        const outputFilePath = path.join(sampleInputsDir, 'result.txt');
        fs.writeFileSync(outputFilePath, result.toString(), 'utf8');
        console.log(`Result saved to: ${outputFilePath}`);
    } catch (error) {
        console.error("Error:", error.message);
    }
    readline.close();
});
