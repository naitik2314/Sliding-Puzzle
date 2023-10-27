// SET PUZZLE SIZE ----------------------
// Note: Must match values in style.css
const rows    = 4;
const columns = 4;
// --------------------------------------

let puzzle = {
  createPuzzleGrid: function(rows, columns) {
    const self = this;
    let puzzle = document.getElementById('puzzle-grid');
    let shuffledLabels = self.shuffle(self.createLabels(rows, columns));

    for (let row = 1; row <= rows; row++) {
      for (let column = 1; column <= columns; column++) {
        let currentLabel = shuffledLabels.pop();
        if (currentLabel === '0') {
          puzzle.innerHTML += `
            <div
              id='blank'
              class='cell'
              data-row='${row}'
              data-column='${column}'
            >
            </div>`;
        } else {
          puzzle.innerHTML += `
            <div
              class='cell'
              data-row='${row}'
              data-column='${column}'
            >
              ${currentLabel}
            </div>`;
        }
      }
    }

    self.makeClickable(rows, columns);
    self.listenForKeypress();
  },


  createLabels: function(rows, columns) {
    const totalLabels = (rows * columns);
    let currentLabel = 0; // the all-important blank cell!
    let labels = [];

    while (currentLabel < totalLabels) {
      labels.push(currentLabel.toString());
      currentLabel++;
    }

    return labels;
  },


  // The Fisher-Yates algorithm makes our puzzle random without bias.
  // https://blog.codinghorror.com/the-danger-of-naivete/
  shuffle: function(array) {
    let currentIndex = array.length, randomIndex, temporaryValue;

    // While there are still items to shuffle...
    while (currentIndex !== 0) {
      // Pick a random item...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current item.
      temporaryValue      = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex]  = temporaryValue;
    }

    return array;
  },

  listenForKeypress: function(){
    const self = this;

    document.onkeydown = function(event) {
      if (event.keyCode === 37) {
        self.checkKeypressMove('left')
      } else if (event.keyCode === 39) {
        self.checkKeypressMove('right')
      } else if (event.keyCode === 38) {
        self.checkKeypressMove('up')
      } else if (event.keyCode === 40) {
        self.checkKeypressMove('down')
      }
    }
  },

  checkKeypressMove: function(direction){
    const self = this;
    let cellsToMove = [];

    const blankCell = document.getElementById('blank');
    const blankRow = parseInt(blankCell.dataset.row);
    const blankColumn = parseInt(blankCell.dataset.column);

    if (direction === 'left') {
      if (blankColumn === columns) {
        self.updateReaction('sad')
      } else {
        for (let i = columns; i > blankColumn; i--) {
          let cellToMove = document.querySelector(`[data-row='${blankRow}'][data-column='${i}']`)
          cellsToMove.push(cellToMove);
        }
      }
    } else if (direction === 'right') {
      if (blankColumn === 1) {
        self.updateReaction('sad')
      } else {
        for (let i = 1; i < blankColumn; i++) {
          let cellToMove = document.querySelector(`[data-row='${blankRow}'][data-column='${i}']`)
          cellsToMove.push(cellToMove);
        }
      }
    } else if (direction === 'up') {
      if (blankRow === rows) {
        self.updateReaction('sad')
      } else {
        for (let i = rows; i > blankRow; i--) {
          let cellToMove = document.querySelector(`[data-row='${i}'][data-column='${blankColumn}']`)
          cellsToMove.push(cellToMove);
        }
      }
    } else if (direction === 'down') {
      if (blankRow === 1) {
        self.updateReaction('sad')
      } else {
        for (let i = 1; i < blankRow; i++) {
          let cellToMove = document.querySelector(`[data-row='${i}'][data-column='${blankColumn}']`)
          cellsToMove.push(cellToMove);
        }
      }
    }

    if (cellsToMove.length) {
      self.moveCells(cellsToMove, direction)
    }

    // Don't forget to move the blank cell to the correct position
    if (direction === 'left') {
      blankCell.dataset.column = columns
    } else if (direction === 'right') {
      blankCell.dataset.column = 1
    } else if (direction === 'up') {
      blankCell.dataset.row = rows
    } else if (direction === 'down') {
      blankCell.dataset.row = 1
    }
  },


  makeClickable: function(rows, columns){
    const self = this;
    const cells = document.getElementsByClassName('cell');

    if (document.addEventListener) {
      for ( let i = 0; i < cells.length; i++ ) {
        cells[i].addEventListener('click', function(e) {
          const row = parseInt(cells[i].dataset.row)
          const column = parseInt(cells[i].dataset.column)
          self.checkMove(row, column);
        })
      }
    }
  },

  checkMove: function(row, column) {
    let cellsToMove = [];
    const blankCell = document.getElementById('blank');
    const blankRow = parseInt(blankCell.dataset.row);
    const blankColumn = parseInt(blankCell.dataset.column);

    if (row === blankRow && column !== blankColumn) {
      // RIGHT ➡ ➡ ➡ ➡ ➡ ➡ ➡ ➡ ➡ ➡ ➡ ➡ ➡ ➡ ➡ ➡ ➡ ➡ ➡ ➡ ➡ ➡
      if (column < blankColumn) {
        // Like a physical puzzle, you can push an entire row / column.
        for (let i = column; i < blankColumn; i++) {
          let cellToMove = document.querySelector(`[data-row='${row}'][data-column='${i}']`)
          cellsToMove.push(cellToMove);
        }
        this.moveCells(cellsToMove, 'right')
        // Don't forget to move the blank cell to the clicked position
        blankCell.dataset.column = column

      // LEFT ⬅ ⬅ ⬅ ⬅ ⬅ ⬅ ⬅ ⬅ ⬅ ⬅ ⬅ ⬅ ⬅ ⬅ ⬅ ⬅ ⬅ ⬅ ⬅ ⬅
      } else if (column > blankColumn) {
        for (let i = column; i > blankColumn; i--) {
          let cellToMove = document.querySelector(`[data-row='${row}'][data-column='${i}']`)
          cellsToMove.push(cellToMove);
        }
        this.moveCells(cellsToMove, 'left')
        blankCell.dataset.column = column
      }

    } else if (column === blankColumn && row !== blankRow) {
      // DOWN ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇
      if (row < blankRow) {
        for (let i = row; i < blankRow; i++) {
          let cellToMove = document.querySelector(`[data-row='${i}'][data-column='${column}']`)
          cellsToMove.push(cellToMove);
        }
        this.moveCells(cellsToMove, 'down')
        blankCell.dataset.row = row

      // UP ⬆ ⬆ ⬆ ⬆ ⬆ ⬆ ⬆ ⬆ ⬆ ⬆ ⬆ ⬆ ⬆ ⬆ ⬆ ⬆ ⬆ ⬆ ⬆ ⬆ ⬆
      } else if (row > blankRow) {
        for (let i = row; i > blankRow; i--) {
          let cellToMove = document.querySelector(`[data-row='${i}'][data-column='${column}']`)
          cellsToMove.push(cellToMove);
        }
        this.moveCells(cellsToMove, 'up')
        blankCell.dataset.row = row
      }
    } else if (column !== blankColumn && row !== blankRow) {
      this.updateReaction('sad')
    } else if (column === blankColumn && row === blankRow) {
      this.updateReaction('wtf')
    }
  },

  moveCells: function(cellsToMove, direction) {
    for (let i = 0; i < cellsToMove.length; i++) {
      if (direction === 'right') {
        cellsToMove[i].dataset.column++
      } else if (direction === 'left') {
        cellsToMove[i].dataset.column--
      } else if (direction === 'down') {
        cellsToMove[i].dataset.row++
      } else if (direction === 'up') {
        cellsToMove[i].dataset.row--
      }
    }

    this.updateReaction('happy')
  },

  updateReaction: function (emotion) {
    let reactionEmoji = document.getElementById('reaction');

    if (emotion === 'happy') {
      reactionEmoji.innerHTML = '😊'
    } else if (emotion === 'sad') {
      reactionEmoji.innerHTML = '😦'
    } else if (emotion === 'wtf') {
      reactionEmoji.innerHTML = '😑'
    }
  }
}


puzzle.createPuzzleGrid(rows, columns);