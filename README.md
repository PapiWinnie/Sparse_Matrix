Project Overview

This project implements a Sparse Matrix class in JavaScript that efficiently handles large, sparse matrices using a Map data structure. It supports basic matrix operations such as:

Addition

Subtraction

Multiplication

File Structure

/dsa/sparse_matrix/
│── code/
│   ├── src/
│   │   ├── sparseMatrix.js  <--  main Node.js code
│── sample_inputs/
│   ├── matrix1.txt   <-- First sparse matrix file
│   ├── matrix2.txt   <-- Second sparse matrix file / copy of first file

Installation & Setup

Ensure you have Node.js installed.
Clone this repository.
Navigate to the project directory.
Run npm install (if additional dependencies are added later).

Usage

Run the program using:

node index.js

The program will prompt you to select an operation:

(1) Add Matrices

(2) Subtract Matrices

(3) Multiply Matrices

It will then load two matrices from /sample_inputs/ and perform the selected operation, saving the result to result.txt.

Input File Format

Each matrix input file follows this format:

rows=8433
cols=3180
(0, 381, -694)
(0, 128, -838)
(0, 639, 857)

The first two lines specify matrix dimensions.

The remaining lines contain non-zero elements in (row, column, value) format.

Error Handling

Invalid file format throws std::invalid_argument("Input file has wrong format").

Matrix operations check dimension compatibility.

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

            console.log(`Reading file: ${filePath}`);

            this.rows = parseInt(lines[0].split('=')[1]);
            this.cols = parseInt(lines[1].split('=')[1]);

            console.log(`Loaded matrix with dimensions: ${this.rows}x${this.cols}`);

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
    

    toString() {
        let output = `rows=${this.rows}\ncols=${this.cols}\n`;
        for (const [key, value] of this.matrix) {
            output += `(${key}, ${value})\n`;
        }
        return output;
    }
}

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

