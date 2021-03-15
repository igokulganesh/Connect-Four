var player1Color = 'rgb(237, 9, 9)';
var player2Color = 'rgb(229, 255, 0)';

var table = $('table tr');
var audio ; 

function Game() 
{
    this.depth = 5; // Search depth
    this.score = 100000; // Win/loss score
    this.turn = 0; // 0: Human, 1: Computer
    this.winning_array = []; // Winning (chips) array
    
    game = this ;

    game.init();
}

Game.prototype.move = function() 
{
    // Recognize what column was chosen
    var col = $(this).closest("td").index();

    if(game.turn === 0)
        game.ManMove(col);   
    

    if(game.turn === 1 ) // computer's turn
    {
        /*$('#whoPlay').text("Computer's Turn");*/
        $(".board button").off("click", game.move);
        game.AiMove()
        $('.board button').on('click', game.move);
        /*$('#whoPlay').text("Your Turn");*/
    }
};

// Report Back to current color of a button
Game.prototype.returnColor = function(row, col) 
{
    return table.eq(row).find('td').eq(col).find('button').css('background-color');
};

// Change the color of a button
Game.prototype.changeColor = function(row, col, Player) 
{
    var color = player1Color ; 
    if(Player === 1)
    {
        color = player2Color ;
        audio.play();
    }
    table.eq(row).find('td').eq(col).find('button').css('background-color', color);
}

Game.prototype.gameEnd = function(winningPlayer) 
{
    var row, col ; 
    for (var i = 0; i < game.winning_array.length; i++) 
    {
        row = game.winning_array[i][0] ; 
        col = game.winning_array[i][1] ; 
        table.eq(row).find('td').eq(col).find('button').addClass("win");  
    }


    $('.board button').unbind();
    $('#myModal').modal('show'); 
    $('#whoWins').text(winningPlayer);
    $('#whoPlay').text(winningPlayer);
    $("#retext").text("Restart the Game to Play Again!");
};


Game.prototype.init = function() 
{
    // Generate 'real' board (2d array)
    var game_board = new Array(6);
    for (var i = 0; i < 6; i++) 
    {
        game_board[i] = new Array(7);
        for (var j = 0; j < 7; j++) 
        {
            game_board[i][j] = null;
        }
    }

    // Create from board object by board.js
    this.board = new Board(this, game_board, 0);
    //add event listener 
    $('.board button').on('click', game.move );
}


Game.prototype.ManMove = function(col) 
{
    // If not finished
    if (game.board.score() != game.score && game.board.score() != -game.score && !game.board.isFull()) 
    {
        for (var row = 5 ; row >= 0 ; row--) 
        {
            color = game.returnColor(row, col);
            if (color === 'rgb(255, 255, 255)') 
            {
                game.changeColor(row, col, game.turn);
                break ; 
            }
        }

        if (!game.board.place(col)) // make move and check invalid move 
            return null ;

        game.turn = game.switchRound(game.turn);
        game.updateStatus();
    }
}

Game.prototype.switchRound = function(turn) 
{
    // 0 Human, 1 Computer
    if (turn === 0) 
        return 1;
    else 
        return 0;
}

Game.prototype.updateStatus = function() 
{
    // Human won
    if (game.board.score() == -game.score) 
        game.gameEnd("You won!");

    // Computer won
    else if (game.board.score() == game.score) 
        game.gameEnd("Computer Won!");

    // Tie
    else if (game.board.isFull()) 
        game.gameEnd("Game Tied!");
    else 
        return false ; 
    return true ; 
}


Game.prototype.AiMove = function() 
{
    if(game.board.score() != game.score && game.board.score() != -game.score && !game.board.isFull()) 
    {
        var ai_move = game.maximizePlay(game.board, game.depth, -game.score, game.score);
        game.ManMove(ai_move[0]);
    }
}

Game.prototype.maximizePlay = function(board, depth, alpha, beta) 
{
    // Call score of our board
    var score = board.score();

    // Break
    if (board.isFinished(depth, score)) 
        return [null, score];

    // col, Score
    var max = [null, -game.score];

    // For all possible moves
    for (var col = 0; col < 7; col++) 
    {
        var new_board = board.copy();

        if (new_board.place(col)) 
        {
            var next_move = game.minimizePlay(new_board, depth - 1, alpha, beta); 

            // Evaluate new move
            if (max[0] == null || next_move[1] > max[1]) 
            {
                max[0] = col;
                max[1] = next_move[1];
                alpha = next_move[1];
            }

            if (alpha >= beta) 
                return max;
        }
    }
    return max;
}

Game.prototype.minimizePlay = function(board, depth, alpha, beta) 
{
    var score = board.score();

    if (board.isFinished(depth, score)) 
        return [null, score];

    // col, score
    var min = [null, game.score];

    for (var col = 0; col < 7; col++) 
    {
        var new_board = board.copy();

        if (new_board.place(col)) 
        {
            var next_move = game.maximizePlay(new_board, depth - 1, alpha, beta);

            if (min[0] == null || next_move[1] < min[1]) 
            {
                min[0] = col;
                min[1] = next_move[1];
                beta = next_move[1]; 
            }

            if( alpha >= beta )
                return min ; 
        }
    }
    return min;
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}


window.onload = function() 
{
    //$("#retext").hide(); // Restart Game text initially hide when game over it will show

    // Start with Human
    $('#whoPlay').text("Your Turn");

    audio = new sound("Assert/dot.mpeg");

    window.Game = new Game();

};
