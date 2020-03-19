import {toComboDie} from './dice.js';

let board;
let boardSize = 0;
let validWords;
let dict;

function getBoard(boardStr) {
    board = [];
    for (var row = 0; row < boardSize; row++) {
        board[row] = [];
        for (var col = 0; col < boardSize; col++) {
            var c = boardStr.charAt(rc2i(row, col));
            board[row][col] = toComboDie(c).toLowerCase();
        }
    }
    return board;
}

export function solve(_dict, size, boardStr) {
    dict = _dict;
    boardSize = size;
    if (boardStr.length !== (boardSize * boardSize)) {
        console.error(`Board string is the wrong length!\n${boardSize}x${boardSize} - ${boardStr}`);
        return null;
    }
    getBoard(boardStr);

    // console.log(board);
    console.log("-- SOLVING BOARD");
    console.time("-- SOLVING BOARD");
    validWords = [];

    var memo = [];
    var row, col;
    for (row = 0; row < boardSize; row++) {
        memo[row] = [];
    }
    for (row = 0; row < boardSize; row++) {
        for (col = 0; col < boardSize; col++) {
            solveRecurse("", row, col, memo);
        }
    }
    console.timeEnd("-- SOLVING BOARD");

    validWords = removeDup(validWords);
    return validWords;
}

function solveRecurse(word, row, col, memo) {
    if (memo[row][col]) return;

    word += board[row][col];
    memo[row][col] = true;
    if (word.length >= 2) {
        if (dict.canBeWord(word)) {
            if (word.length >= dict.minCharLimit) {
                if (dict.isWord(word)) {
                    validWords.push(word);
                }
            }
        }
        else {
            memo[row][col] = false;
            return;
        }
    }
    if (word.length < dict.maxCharLimit) {
        for (var r = (-1); r < 2; r++) {
            for (var c = (-1); c < 2; c++) {
                if (row + r >= 0 && row + r < boardSize &&
                    col + c >= 0 && col + c < boardSize &&
                    !(r === 0 && c === 0)
                ) {
                    solveRecurse(word, row + r, col + c, memo);
                }
            }
        }
    }
    memo[row][col] = false;
}

function rc2i(r, c) {
    if (r >= boardSize || c >= boardSize) {
        return 0;
    }
    return (r * boardSize) + c;
}

// eslint-disable-next-line
function i2rc(i) {
    i = i % (boardSize * boardSize);
    var r, c;
    c = i % boardSize
    r = Math.floor(i / boardSize);
    return { row: r, col: c };
}

function removeDup (list)
{
    var prev = undefined;
    list.sort();
    return list.filter(function (x) {
        if( x !== prev ) {
            prev = x;
            return true;
        }
        return false;
    });
}