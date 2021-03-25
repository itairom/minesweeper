'use strict'
console.log('game.js');

var FLAG = '🏁'
var MINE = '💣'
var EMPTY = ' '

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0
}
var gStartTime = null
var gBoard
var gGameInter

var gLevel = [{
    SIZE: 4,
    MINES: 2
}, {
    SIZE: 6,
    MINES: 3
}, {
    SIZE: 10,
    MINES: 4
}]
var SIZE = gLevel[0].SIZE
var MINES = gLevel[0].MINES


function initGame() {
    console.log('init()')
    gBoard = buildBoard()
    placeMines(MINES)
    checkForMines()
    renderBoard(gBoard)
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

function renderBoard(board) {

    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];

            if (cell.isMine === true) {
                cell = MINE
            } else {
                cell = EMPTY
            }

            var tdId = `cell-${i}-${j}`;
            strHtml += `<td id="${tdId}" onmousedown="cellMarked(this,event)" onclick="cellClicked(this)">
                            ${cell}
                        </td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}

function mineCell(i, j) {
    var elCell = document.querySelector(`#cell-${i}-${j}`);
    elCell.innerHTML = '<img src="./img/mine.png" alt="mine">'
}

function markCells(i, j) {
    var elCell = document.querySelector(`#cell-${i}-${j}`);
    elCell.classList.add('mark')
}

function removeMarkCells(i, j) {
    var elCell = document.querySelector(`#cell-${i}-${j}`);
    elCell.classList.remove('mark')
}

function minesAroundText(i, j) {
    var elCell = document.querySelector(`#cell-${i}-${j}`);
    if (gBoard[i][j].minesAroundCount === 0) {
        elCell.innerText = EMPTY
    } else
        elCell.innerText = gBoard[i][j].minesAroundCount
}

function cellClicked(elCell) {

    if (!gGame.isOn) {
        gGame.isOn = true
        gStartTime = Date.now();
        gGameInter = setInterval(setStopwatch, 100)

    }
    var i = +elCell.id[5]
    var j = +elCell.id[7]

    if (gBoard[i][j].isShown) { return }

    if (gBoard[i][j].minesAroundCount === 0) {
        markCells(i, j)
        gBoard[i][j].isShown = true
        gGame.shownCount++;
        showNengs(i, j)
        markCells(i, j)
    }

    if (gBoard[i][j].minesAroundCount > 0) {
        gBoard[i][j].isShown = true
        gGame.shownCount++;
        minesAroundText(i, j)
        markCells(i, j)
    }

    if (gBoard[i][j].isMine === true) {
        console.log('game over');
        var elCell = document.querySelector(`#cell-${i}-${j}`);
        elCell.classList.add('mark')
        gameOver()
    }
    checkVictory()
}

function checkForMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                setMinesNegsCount(i, j)
            }
        }
    }
}

function placeMines(mines) {
    console.log('place mines');
    for (var i = 0; i < mines; i++) {
        var emptyCells = getEmptyCells()
        var randNum = getRandomIntInclusive(0, emptyCells.length - 1)
        gBoard[emptyCells[randNum].i][emptyCells[randNum].j] = setMine()
    }
}

function setMine() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: true,
        isMarked: false
    }
}

function showNengs(coordI, coordJ) {
    console.log('showNengs()');

    for (var i = coordI - 1; i <= coordI + 1; i++) {
        if (i < 0 || i >= SIZE) continue;
        for (var j = coordJ - 1; j <= coordJ + 1; j++) {
            if (j < 0 || j >= SIZE) continue;
            if (i === coordI && j === coordJ) continue;
            if (gBoard[i][j].isMine) continue
            if (gBoard[i][j].isShown) continue
            if (gBoard[i][j].isMarked) continue

            gBoard[i][j].isShown = true
            markCells(i, j)
            minesAroundText(i, j)
            gGame.shownCount++
                var elTd = document.querySelector(`#cell-${i}-${j}`)
        }
    }
}

addEventListener("contextmenu", function(cellMarked) {
    cellMarked.preventDefault()

})

function cellMarked(elCell, ev) {
    if (ev.button === 2) {
        var i = +elCell.id[5]
        var j = +elCell.id[7]

        if (gBoard[i][j].isShown) { return }

        if (gBoard[i][j].isMarked === false) {
            console.log('in');
            markCells(i, j)
            elCell.innerText = FLAG
            gGame.markedCount++;
            gBoard[i][j].isMarked = true
        } else {
            removeMarkCells(i, j)
            elCell.innerText = ''
            gBoard[i][j].isMarked = false
            gGame.markedCount--;
        }
        checkVictory()
    }
}


function checkMarkMines() {
    var count = 0
    for (var i = 0; i < SIZE - 1; i++) {
        for (var j = 0; j < SIZE - 1; j++) {
            if (gBoard[i][j].isMarked === true && gBoard[i][j].isMine === true)
                count++
        }
    }
    console.log(count);
    return count
}

function checkVictory() {
    var countMarkMines = checkMarkMines()
    console.log('count marked mines', countMarkMines);
    console.log('count cells that are not mines', gGame.shownCount);

    if (countMarkMines === MINES && (SIZE ** 2) === gGame.shownCount + countMarkMines) {
        victory()
    }
}

function gameOver() {
    clearInterval(gGameInter)
    var elBtn = document.querySelector('.reset-btn')
    elBtn.innerText = '🤯'
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isShown)
                gBoard[i][j].isShown = true
            if (gBoard[i][j].isMine) {
                mineCell(i, j)
            }
            if (!gBoard[i][j].isMine) {
                minesAroundText(i, j)
            }
            markCells(i, j)

        }
    }
    //renderBoard(gBoard)

}

function victory() {
    var elBtn = document.querySelector('.reset-btn')
    elBtn.innerText = '😎'
    clearInterval(gGameInter)

    console.log('victory');

}

function resetGame() {
    var elBtn = document.querySelector('.reset-btn')
    elBtn.innerText = '🙂'
    clearInterval(gGameInter)
    console.log('reset');
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gStartTime = null
    initGame()
}

function setLevel(level) {
    SIZE = gLevel[level].SIZE
    MINES = gLevel[level].MINES
    resetGame()

}