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
