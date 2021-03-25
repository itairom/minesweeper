'use strict'
console.log('utils');

function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = `cell cell${i}-${j}`
            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function renderCell(location, value) {
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getEmptyCells() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine === false) {
                emptyCells.push({ i, j })
            }
        }
    }
    return emptyCells
}

function setMinesNegsCount(coordI, coordJ) {

    for (var i = coordI - 1; i <= coordI + 1; i++) {
        if (i < 0 || i >= SIZE) continue;
        for (var j = coordJ - 1; j <= coordJ + 1; j++) {
            if (j < 0 || j >= SIZE) continue;
            if (i === coordI && j === coordJ) continue;
            gBoard[i][j].minesAroundCount++
        }
    }
}

function setStopwatch() {
    var elTimer = document.querySelector(".timer")
    var currTime = Date.now();
    var timer = `Time: ${(currTime - gStartTime) / 1000}`;
    elTimer.innerHTML = timer;
}