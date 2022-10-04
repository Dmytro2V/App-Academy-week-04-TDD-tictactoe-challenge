class ComputerPlayer {
  
  static makeMove(grid, move, symbol) {
    grid[move.row][move.col] = symbol;
    //return grid
  };

  static getValidMoves(grid) {
    // Your code here
    let validMoves =[];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col <3; col++ ) {
        if (grid[row][col] === ' ') {
          validMoves.push({row, col})
        }
      }
    }
    return  validMoves;
     
  }

  static randomMove(grid) {    
    // Your code here
    let validMoves = ComputerPlayer.getValidMoves(grid);
    let numMoves = validMoves.length;
    let rnd = Math.floor(Math.random() * numMoves)
    return validMoves[rnd]
  }
  static getCenterMove(grid, symbol) {    
    if (grid[1][1] === ' ') return {row: 1, col: 1} 
    else return false;
  };
  static getCornerMoves(grid, symbol) {
    let validMoves = ComputerPlayer.getValidMoves(grid);
    let cornerMoves = []
    let possibleCorners = ['00', '02', '20', '22']
    for (let i = 0; i < validMoves.length; i++) {
      let move = validMoves[i]
      let validMoveStr = String(move.row) + String(move.col);
      if (possibleCorners.includes(validMoveStr)) cornerMoves.push(move);
    }
    if (cornerMoves.length === 0) return false

    return cornerMoves; 
  }
static getGoodCornerMoves(grid, symbol) {
  // let check nontrapping answers on test grid on all checkmoves:
  let cornerMoves = this.getCornerMoves(grid, symbol);
  let goodCornerMoves = []  
  let testGrid = grid.slice();
  let oSymbol = symbol === 'X' ? 'O': 'X'  
    for(let i = 0; i < cornerMoves.length; i++) {
      let testCornerMove = cornerMoves[i]
      this.makeMove(testGrid, testCornerMove, symbol) // testing move
      // now checking if there are not opposite traps after cornermove?
      
      if (!this.getTrapMoves(testGrid, oSymbol)) goodCornerMoves.push(testCornerMove)
  
        this.makeMove(testGrid, testCornerMove, ' '); // removing test moves           
      }
      return goodCornerMoves;
  }

  static getGoodRandomCornerMove(grid, symbol) {
    let cornerMoves = this.getGoodCornerMoves(grid, symbol);
    if (cornerMoves.length === 0) return false;

    let numCornerMoves = cornerMoves.length;    
    let rnd = Math.floor(Math.random() * numCornerMoves);
    return cornerMoves[rnd];
  }

  static getCheckMoves(grid, symbol) {
    // Your code here
    let validMoves = ComputerPlayer.getValidMoves(grid);
    let testGrid = grid.slice();
    let checkMoves = []
    for (let i = 0; i < validMoves.length; i++) {
      let testMove = validMoves[i]
      this.makeMove(testGrid, testMove, symbol)      
      if (this.isCheck(testGrid, symbol)) checkMoves.push(testMove);
      this.makeMove(testGrid, testMove, ' '); // removing test move   
    }
    //if (checkMoves.length === 0) return false

    return checkMoves; 
  }
  static getGoodCheckMoves(grid, symbol) {//'good non lead to trapped   
    // let check nontrapping answers on test grid on all checkmoves:
    let checkMoves = this.getCheckMoves(grid, symbol);
    let goodCheckMoves = []  
    let testGrid = grid.slice();
    let oSymbol = symbol === 'X' ? 'O': 'X'  
    for(let i = 0; i < checkMoves.length; i++) {
      let testCheckMove = checkMoves[i]
      this.makeMove(testGrid, testCheckMove, symbol) // testing move
      // now checking answer :
      // answer move is reversed block ie put there, where our want
      let checkBlockTestMove = this.getWinningMove(testGrid, symbol)      
      // trying is not a trap after reversedblock?
      this.makeMove(testGrid, checkBlockTestMove, oSymbol) // making blocking move     

      if (!this.isTrap(testGrid, oSymbol)) goodCheckMoves.push(testCheckMove)

      this.makeMove(testGrid, testCheckMove, ' '); // removing test moves   
      this.makeMove(testGrid, checkBlockTestMove, ' '); // removing test moves   
    }
    return goodCheckMoves;
  }
  static getGoodRandomCheckMove(grid, symbol) {//'good non lead to trapped       
    let goodCheckMoves = this.getGoodCheckMoves(grid, symbol);
        
    if (goodCheckMoves.length === 0) return false;    

    let numGoodCheckMoves = goodCheckMoves.length;    
    let rnd = Math.floor(Math.random() * numGoodCheckMoves);
    return goodCheckMoves[rnd];
  };

  static getWinningMove(grid, symbol) {
    // Your code here    
    let testGrid = grid.slice() //copy
    let validMoves = ComputerPlayer.getValidMoves(testGrid);
    for (let i = 0; i < validMoves.length; i++)
     {
      let move = validMoves[i];
      this.makeMove(testGrid, move, symbol)
      
      if (this.checkWin(testGrid) === symbol) return move;
      else this.makeMove(testGrid, move, ' '); // removing test move      
    }    
    return false;
  };  

  static isTrap(grid, symbol) {
    let row2 = this.row2(grid, symbol);
    let col2 = this.col2(grid, symbol);
    let diag2 = this.diag2(grid, symbol);
    if (row2 + col2 + diag2 > 1) return true // 2 directions = trap
    else return false;
  }
  static isCheck(grid, symbol) {
    return (this.row2(grid, symbol) 
         || this.col2(grid, symbol)
         || this.diag2(grid, symbol));
  }

  static row2(grid, symbol) { // ["s"," ","s"]
    for (const row of grid) {
      if (this.is2of3(row,symbol)) return true
    }
    return false;
  }
  static is2of3 (arr, symbol) {
    if ( arr.includes(' ') 
    && arr.includes(symbol) 
    && arr.indexOf(symbol) !== arr.lastIndexOf(symbol))
    return true;
    else return false;
  }

  static col2(grid, symbol) { // ["s"," ","s"] vertical
    for (let i = 0; i <= 2; i++) {
      let col = [grid[0][i], grid[1][i], grid[2][i]];
      if (this.is2of3(col, symbol)) return true;
    }
    return false;
  }
  static diag2(grid, symbol) { // ["s"," ","s"] diag
    let diag1 = [grid[0][0], grid[1][1], grid[2][2]];
    let diag2 = [grid[0][2], grid[1][1], grid[2][0]];
    
    if (this.is2of3(diag1, symbol) 
      || this.is2of3(diag2, symbol) ) 
      return true;

    else return false;
  };

  static getTrapMoves(grid, symbol) {
    // Your code here    
    let testGrid = grid.slice() //copy
    let validMoves = ComputerPlayer.getValidMoves(testGrid);
    let trapMoves =[];
  
    for (let i = 0; i < validMoves.length; i++)
     {
      let move = validMoves[i];
      this.makeMove(testGrid, move, symbol)
      
      if (this.isTrap(testGrid, symbol)) trapMoves.push(move);
      
      this.makeMove(testGrid, move, ' '); // removing test move      
    } 
    if (trapMoves.length === 0) return false;
    return trapMoves;
  }

  static getSmartMove(grid, symbol) {
    // Your code here    
    
    // move on win condition
    let winMove = this.getWinningMove(grid, symbol)
    if (winMove) return winMove;
    // block enemy win
    let oSymbol = symbol === 'X'? 'O':'X'    
    let oWinMove = this.getWinningMove(grid, oSymbol);
    if (oWinMove) return oWinMove;
    // if can set trap, set trap - not really helps, so skip
    //let getTrapMoves = this.getTrapMoves(grid, oSymbol);
    //if (getTrapMoves > 0) return getTrapMoves[0];
    
    // if exist good check (without meeting trap) do random check
    let checkMove = this.getGoodRandomCheckMove(grid, symbol)
    if (checkMove) return checkMove      
    
    // if nothing was better and center is free, take center
    let centerMove = this.getCenterMove(grid, symbol);
    if (centerMove) return centerMove;

    // if nothing was better and center is free, take corner 'good'
    let cornerMove = this.getGoodRandomCornerMove(grid, symbol);
    if (cornerMove) return cornerMove;

    return this.randomMove(grid,symbol) 

  }

  static checkWin(grid){
    // Return 'X' if player X wins
    if (this.horizontalIncludes(grid, ['X', 'X', 'X'])) return 'X';
    if (this.verticalIncludes(grid, ['X', 'X', 'X'])) return 'X';
    if (this.diagonalIncludes(grid, ['X', 'X', 'X'])) return 'X';
    // Return 'O' if player O wins
    if (this.horizontalIncludes(grid, ['O', 'O', 'O'])) return 'O';
    if (this.verticalIncludes(grid,['O', 'O', 'O'])) return 'O';
    if (this.diagonalIncludes(grid,['O', 'O', 'O'])) return 'O';
    // Return 'T' if the game is a tie
    if (this.gridFull(grid)) return 'T';

    // Return false if the game has not ended
      return false;    
  }
  static horizontalIncludes(grid, arr3) {
    const symbol = arr3[0] // X or Y 
    if (grid.filter((row) => row.join() === arr3.join()).length > 0)
      return true;    
  }

  static verticalIncludes(grid, arr3) {
    const symbol = arr3[0] // X or Y 
    for (let col = 0; col < 3; col++) { // on every horisontal pos

      let probably = true; // checking column

      for (let row = 0; row < 3; row++) { 
        if (grid[row][col] !== symbol) probably = false;
      }
      if (probably === true) return true; // here it is vert line
    }
  
  };

  static diagonalIncludes(grid, arr3) {
    const symbol = arr3[0] // X or Y 
    if (grid[0][0] + grid[1][1] + grid[2][2]  === symbol.repeat(3) ||
      grid[0][2] + grid[1][1] + grid[2][0]  === symbol.repeat(3)) 
      return true;    
  };

  static gridFull(grid) {
    if (grid.filter((row) => row.includes(' ')).length === 0)
      return true;    
  }

}


module.exports = ComputerPlayer;
/*
grid1 = [['X','X',' '],
        ['O',' ',' '],
        ['O',' ',' ']]

grid2 = [['X',' ',' '],
        ['X',' ',' '],
        ['O','O',' ']]

grid3 = [['O',' ',' '],
        ['O',' ',' '],
        ['X','X',' ']]

let smartMove = ComputerPlayer.getSmartMove(grid, 'X');
console.log(smartMove);

grid = [[' ',' ',' '],
        [' ',' ',' '],
        [' ',' ',' ']]
//console.log(grid);
//console.log(ComputerPlayer.getTrapMoves(grid, 'O'));
//console.log(ComputerPlayer.getCornerMoves(grid, 'X'));
//console.log(ComputerPlayer.getGoodCornerMoves(grid, 'X'));
//console.log(ComputerPlayer.getGoodRandomCornerMove(grid, 'X'));
console.log(ComputerPlayer.getSmartMove(grid, 'X'));
*/