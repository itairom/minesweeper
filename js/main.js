'use strict'
console.log('game.js');

var FLAG = '🏁'
var MINE = '💣'
var EMPTY = ''
var gStartTime = null
var gBoard
var gGameInter
var gHintInter
var gSafeInterval
var isShownHint = false
var isShownSafeCell = false
var countMarkMines
var gHint = 3
var gSafeCell = 3
var gLives = 3
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0
}

var gLevel = [{
    SIZE: 4,
    MINES: 2
}, {
    SIZE: 6,
    MINES: 3
}, {
    SIZE: 10,
    MINES: 7
}]
var SIZE = gLevel[0].SIZE
var MINES = gLevel[0].MINES


function initGame() {
    countMarkMines = 0
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

            cell = EMPTY

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

function markCell(i, j) {
    var elCell = document.querySelector(`#cell-${i}-${j}`);
    elCell.classList.add('mark')
}

function removeMarkCell(i, j) {
    var elCell = document.querySelector(`#cell-${i}-${j}`);
    elCell.classList.remove('mark')
}

function minesAroundTextCell(i, j) {
    var elCell = document.querySelector(`#cell-${i}-${j}`);
    if (gBoard[i][j].minesAroundCount === 0) {
        elCell.innerText = EMPTY
    } else
        elCell.innerText = gBoard[i][j].minesAroundCount
}

function cellClicked(elCell) {
    console.log(elCell);

    if (!gGame.isOn) {
        gGame.isOn = true
        gStartTime = Date.now();
        gGameInter = setInterval(setStopwatch, 100)

    }
    var i = +elCell.id[5]
    var j = +elCell.id[7]

    console.log(gBoard[i, j]);


    if (gBoard[i][j].isShown) { return }

    if (isShownHint === true) {
        var negsHint = showNengsHint(i, j)

        if (gBoard[i][j].isMine === true) {
            console.log('is mine');
            mineCell(i, j)
        }

        markCell(i, j)
        gHintInter = setInterval(getHint, 2000, i, j, negsHint)
        return
    }

    if (gBoard[i][j].minesAroundCount === 0) {
        markCell(i, j)
        gBoard[i][j].isShown = true
        gGame.shownCount++;
        showNengs(i, j)
        markCell(i, j)
    }

    if (gBoard[i][j].minesAroundCount > 0) {
        gBoard[i][j].isShown = true
        gGame.shownCount++;
        minesAroundTextCell(i, j)
        markCell(i, j)
    }

    if (gBoard[i][j].isMine === true) {
        var elLives = document.querySelector('.lives')
        console.log('is mine');
        gLives--
        elLives.innerText = gLives
        if (gLives > 0) {
            removeMarkCell(i, j)
            gBoard[i][j].isShown = false

        } else {
            console.log('game over');
            var elCell = document.querySelector(`#cell-${i}-${j}`);
            elCell.classList.add('mark')
            gameOver()
        }

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
    for (var i = 0; i < mines; i++) {
        var emptyCells = getEmptyCells()
        var randNum = getRandomIntInclusive(0, emptyCells.length - 1)
        gBoard[emptyCells[randNum].i][emptyCells[randNum].j] = setMine()
    }
}

function setMine() {
    return {
        isShown: false,
        isMine: true,
        isMarked: false
    }
}

function showNengs(coordI, coordJ) {
    for (var i = coordI - 1; i <= coordI + 1; i++) {
        if (i < 0 || i >= SIZE) continue;
        for (var j = coordJ - 1; j <= coordJ + 1; j++) {
            if (j < 0 || j >= SIZE) continue;
            if (i === coordI && j === coordJ) continue;
            if (gBoard[i][j].isMine) continue
            if (gBoard[i][j].isShown) continue
            if (gBoard[i][j].isMarked) continue
            gBoard[i][j].isShown = true
            markCell(i, j)
            minesAroundTextCell(i, j)
            gGame.shownCount++;
            showNengs(coordI - 1, coordJ - 1)
        }
    }
}

function cellMarked(elCell, ev) {
    var elScore = document.querySelector('.score')
    if (ev.button === 2) {
        var i = +elCell.id[5]
        var j = +elCell.id[7]

        if (gBoard[i][j].isShown) { return }

        if (gBoard[i][j].isMarked === false) {

            if (gBoard[i][j].isMine === true) {
                countMarkMines++
            }
            markCell(i, j)
            elCell.innerText = FLAG
            gGame.markedCount++;
            elScore.innerText = gGame.markedCount
            gBoard[i][j].isMarked = true
        } else {
            if (gBoard[i][j].isMine === true) {
                countMarkMines--
            }
            removeMarkCell(i, j)
            elCell.innerText = EMPTY
            gBoard[i][j].isMarked = false
            gGame.markedCount--;
            elScore.innerText = gGame.markedCount
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
                minesAroundTextCell(i, j)
            }
            markCell(i, j)
        }
    }
}

function victory() {
    var elBtn = document.querySelector('.reset-btn')
    elBtn.innerText = '😎'
    console.log(gGameInter)
    var currBestTime = (Date.now() - gStartTime) / 1000
    if (currBestTime < localStorage.getItem("score")) {
        localStorage.setItem("score", (Date.now() - gStartTime) / 1000);
        var elBest = document.querySelector('.best-time')
        elBest.innerText = localStorage.getItem("score")
    }
    clearInterval(gGameInter)
}

function resetGame() {
    var elBtn = document.querySelector('.reset-btn')
    elBtn.innerText = '🙂'

    var elSafe = document.querySelector('.safe-count')
    var elBulb = document.querySelectorAll('.bulb')
    var htmlStr = 'img/bulb-off.png'
    elBulb[0].src = htmlStr
    elBulb[1].src = htmlStr
    elBulb[2].src = htmlStr

    elSafe.innerText = 3
    clearInterval(gGameInter)
    console.log('reset');
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gStartTime = null
    gLives = 3
    gHint = 3
    gSafeCell = 3
    isShownHint = false
    isShownSafeCell = false
    initGame()
}

function setLevel(level) {
    SIZE = gLevel[level].SIZE
    MINES = gLevel[level].MINES
    resetGame()
}

function showNengsHint(coordI, coordJ) {
    var hintCells = []
    for (var i = coordI - 1; i <= coordI + 1; i++) {
        if (i < 0 || i >= SIZE) continue;
        for (var j = coordJ - 1; j <= coordJ + 1; j++) {
            if (j < 0 || j >= SIZE) continue;
            if (i === coordI && j === coordJ) continue;
            if (gBoard[i][j].isMine) continue
            if (gBoard[i][j].isShown) continue
            if (gBoard[i][j].isMarked) continue
            gBoard[i][j].isShown = true
            markCell(i, j)
            minesAroundTextCell(i, j)
                // gGame.shownCount++;
            hintCells.push({ i, j })
        }
    }
    return hintCells
}

function getHint(i, j, negsHint) {
    var elCell = document.querySelector(`#cell-${i}-${j}`);
    for (var k = 0; k < negsHint.length; k++) {
        var currI = negsHint[k].i
        var currJ = negsHint[k].j
        gBoard[currI][currJ].isShown = false
        var elCellsHint = document.querySelector(`#cell-${currI}-${currJ}`);
        removeMarkCell(currI, currJ)
        elCellsHint.innerText = EMPTY
    }
    clearInterval(gHintInter)
    removeMarkCell(i, j)
    isShownHint = false
    elCell.innerText = EMPTY
}


function getSafeCell(i, j) {
    var elCell = document.querySelector(`#cell-${i}-${j}`);
    removeMarkCell(i, j)
    elCell.innerText = EMPTY
    clearInterval(gSafeInterval)
}

function setGlobalHint(elBulb) {
    var htmlStr = 'img/bulb-on.png'
    elBulb.src = htmlStr
    gHint--
    if (gHint >= 0) isShownHint = true
}

function setGlobalSafe() {

    console.log('setGlobalSafe()');
    gSafeCell--
    if (gSafeCell >= 0) {
        isShownSafeCell = true
        var elBtn = document.querySelector('.safe-count')
        elBtn.innerText = gSafeCell

        if (isShownSafeCell === true) {
            var safeCells = getEmptyCells()
            var randNum = getRandomIntInclusive(0, safeCells.length - 1)
            var randCell = safeCells[randNum]

            var i = randCell.i
            var j = randCell.j

            minesAroundTextCell(i, j)
            markCell(i, j)
            gSafeInterval = setInterval(getSafeCell, 2000, i, j)
        }
    }
}