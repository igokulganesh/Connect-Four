function Board(game, board, player)
{
	this.game = game ; 
	this.b = board ; //actual board
	this.player = player ;
}

//check whether the board is full or not 
Board.prototype.isFull = function() 
{
    for (var i = 0; i < 7 ; i++) //cols 
    {
        if (this.b[0][i] === null) 
        {
            return false;
        }
    }
    return true;
}

//check whether the current situation is finished or not 
Board.prototype.isFinished = function(depth, score) 
{
	if(depth === 0 || score === this.game.score || score === -this.game.score || this.isFull()) 
    {
        return true;
    }
    return false;		
}

Board.prototype.place = function(col) 
{
    // Check if col valid
    if (this.b[0][col] === null && col >= 0 && col < 7) 
    {
        for (var i = 5 ; i >= 0; i--) 
        {
            if (this.b[i][col] === null) 
            {
                this.b[i][col] = this.player ; 
                break; 
            }
        }
        this.player = this.game.switchRound(this.player);
        return true;
    } 
    return false;
}

// Return a score for various positions either horizontal, vertical or diagonal 
Board.prototype.scorePosition = function(row, col, delta_y, delta_x) 
{
    var human_points = 0;
    var computer_points = 0;

    // Save winning positions to arrays for later usage
    this.game.winning_array_human = [];
    this.game.winning_array_cpu = [];

    // Determine score through amount of available chips
    for (var i = 0; i < 4; i++) 
    {
        if (this.b[row][col] === 0) 
        {
            this.game.winning_array_human.push([row, col]);
            human_points++; 
        } 
        else if (this.b[row][col] === 1) 
        {
            this.game.winning_array_cpu.push([row, col]);
            computer_points++; 
        }

        row += delta_y;
        col += delta_x;
    }

    // Marking winning/returning score
    if (human_points === 4) 
    {
        this.game.winning_array = this.game.winning_array_human;
        return -this.game.score;
    } 
    else if (computer_points === 4) 
    {
        this.game.winning_array = this.game.winning_array_cpu;
        return this.game.score;
    } 
    else 
        return computer_points;
}

// Returns the overall score for our board.
Board.prototype.score = function() 
{
    var vertical_points = 0;
    var horizontal_points = 0;
    var diagonal_points1 = 0;
    var diagonal_points2 = 0;

    // Board-size: 7x6 (height x width)
    // Array indices begin with 0
    // => e.g. height: 0, 1, 2, 3, 4, 5

    // Vertical points
    // Check each col for vertical score
    // 
    // Possible situations
    //  0  1  2  3  4  5  6
    // [x][ ][ ][ ][ ][ ][ ] 0
    // [x][x][ ][ ][ ][ ][ ] 1
    // [x][x][x][ ][ ][ ][ ] 2
    // [x][x][x][ ][ ][ ][ ] 3
    // [ ][x][x][ ][ ][ ][ ] 4
    // [ ][ ][x][ ][ ][ ][ ] 5
    for (var row = 0; row < 3 ; row++) 
    {
        // check for each column
        for (var col = 0; col < 7 ; col++) 
        {
            // score the column and add it to the points
            var score = this.scorePosition(row, col, 1, 0);

            if (score === this.game.score || score === -this.game.score) 
            	return score ; 
            
            vertical_points += score;
        }            
    }

    // Horizontal points
    // Check each row's score
    // 
    // Possible situations
    //  0  1  2  3  4  5  6
    // [x][x][x][x][ ][ ][ ] 0
    // [ ][x][x][x][x][ ][ ] 1
    // [ ][ ][x][x][x][x][ ] 2
    // [ ][ ][ ][x][x][x][x] 3
    // [ ][ ][ ][ ][ ][ ][ ] 4
    // [ ][ ][ ][ ][ ][ ][ ] 5
    for (var row = 0; row < 6 ; row++) 
    {
        for (var col = 0; col < 4 ; col++) 
        { 
            var score = this.scorePosition(row, col, 0, 1);   
        
            if (score === this.game.score || score === -this.game.score) 
                return score ; 

            horizontal_points += score;
        } 
    }



    // Diagonal points 1 (left-bottom)
    //
    // Possible situation
    //  0  1  2  3  4  5  6
    // [x][ ][ ][ ][ ][ ][ ] 0
    // [ ][x][ ][ ][ ][ ][ ] 1
    // [ ][ ][x][ ][ ][ ][ ] 2
    // [ ][ ][ ][x][ ][ ][ ] 3
    // [ ][ ][ ][ ][ ][ ][ ] 4
    // [ ][ ][ ][ ][ ][ ][ ] 5
    for (var row = 0; row < 3; row++) 
    {
        for (var col = 0; col < 4; col++) 
        {
            var score = this.scorePosition(row, col, 1, 1);

            if (score === this.game.score || score === -this.game.score) 
                return score ; 

            diagonal_points1 += score;
        }            
    }

    // Diagonal points 2 (right-bottom)
    //
    // Possible situation
    //  0  1  2  3  4  5  6
    // [ ][ ][ ][x][ ][ ][ ] 0
    // [ ][ ][x][ ][ ][ ][ ] 1
    // [ ][x][ ][ ][ ][ ][ ] 2
    // [x][ ][ ][ ][ ][ ][ ] 3
    // [ ][ ][ ][ ][ ][ ][ ] 4
    // [ ][ ][ ][ ][ ][ ][ ] 5
    for (var row = 3; row < 6; row++) 
    {
        for (var col = 0; col < 4 ; col++) 
        {
            var score = this.scorePosition(row, col, -1, 1);

            if (score === this.game.score || score === -this.game.score) 
                return score ; 
            
            diagonal_points2 += score;
        }
    }

    return horizontal_points + vertical_points + diagonal_points1 + diagonal_points2 ;
}

Board.prototype.copy = function() 
{
    var new_board = new Array();
    for (var i = 0; i < this.b.length; i++) 
    {
        new_board.push(this.b[i].slice());
    }
    return new Board(this.game, new_board, this.player);
}