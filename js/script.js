var player1Color = 'rgb(237, 9, 9)';
var player2Color = 'rgb(229, 255, 0)';

var player1 = "Red" ; 
var player2 = "Yellow" ; 

var game_on = true;
var table = $('table tr');
var winning_array = [] ; 
var audio ; 

// Change the color of a button
function changeColor(row, col, color) 
{
    audio.play();
    return table.eq(row).find('td').eq(col).find('button').css('background-color', color);
}

// Report Back to current color of a button
function returnColor(row, col) 
{
    return table.eq(row).find('td').eq(col).find('button').css('background-color');
}

// Take in column index, returns the bottom row that is still gray
function checkBottom(col) 
{
    var color ;
    for (var row = 5; row > -1; row--) 
    {
        color = returnColor(row, col);
        if (color === 'rgb(255, 255, 255)') 
        {
            return row ; 
        }
    }
    return -1 ; 
}

// Check to see if 4 inputs are the same color
function colorMatchCheck(one, two, three, four)
{
    return (one===two && one===three && one===four && one !== 'rgb(255, 255, 255)' && one !== undefined);
}

// Check for Horizontal Wins
function horizontalWinCheck() 
{
    for (var row = 0; row < 6; row++) 
    {
        for (var col = 0; col < 4; col++) 
        {
            if (colorMatchCheck(returnColor(row,col), returnColor(row,col+1) ,returnColor(row,col+2), returnColor(row,col+3))) 
            {
                winning_array.push([row, col]);
                winning_array.push([row, col+1]);
                winning_array.push([row, col+2]);
                winning_array.push([row, col+3]);
                return true;
            }
        }
    }
    return false ;
}

// Check for Vertical Wins
function verticalWinCheck() 
{
    for (var col = 0; col < 7; col++) 
    {
        for (var row = 0; row < 3; row++) 
        {
            if(colorMatchCheck(returnColor(row,col), returnColor(row+1,col) ,returnColor(row+2,col), returnColor(row+3,col))) 
            {
                winning_array.push([row, col]);
                winning_array.push([row+1, col]);
                winning_array.push([row+2, col]);
                winning_array.push([row+3, col]);
                return true;
            }
        }
    }
    return false ;
}

// Check for Diagonal Wins
function diagonalWinCheck() 
{

    //left - bottom 
    for (var row = 0; row < 3; row++) 
    {
        for (var col = 0; col < 4; col++) 
        {
            if (colorMatchCheck(returnColor(row,col), returnColor(row+1,col+1) ,returnColor(row+2,col+2), returnColor(row+3,col+3))) 
            {
                winning_array.push([row, col]);
                winning_array.push([row+1, col+1]);
                winning_array.push([row+2, col+2]);
                winning_array.push([row+3, col+3]);
                return true;
            }
        }            
    }

    // right - bottom 
    for (var row = 3; row < 6; row++) 
    {
        for (var col = 0; col < 4 ; col++) 
        {
            if (colorMatchCheck(returnColor(row,col), returnColor(row-1,col+1) ,returnColor(row-2,col+2), returnColor(row-3,col+3))) 
            {
                winning_array.push([row, col]);
                winning_array.push([row-1, col+1]);
                winning_array.push([row-2, col+2]);
                winning_array.push([row-3, col+3]);
                return true;
            }
        }

    }

    return false ; 
}

function isTie()
{
    for(var col = 0 ; col < 7 ; col++)
    {
        if(returnColor(0, col) === 'rgb(255, 255, 255)')
            return false ; 
    }
    return true ; 
}

// Game End
function gameEnd(winningPlayer) 
{
    var row, col ; 
    for (var i = 0; i < winning_array.length; i++) 
    {
        row = winning_array[i][0] ; 
        col = winning_array[i][1] ; 
        table.eq(row).find('td').eq(col).find('button').addClass("win");  
    }

    $('.board button').unbind();
    $('#myModal').modal('show'); 
    $('#whoWins').text(winningPlayer);
    $('#whoPlay').text(winningPlayer);
    $("#retext").show();
}

// Start with Player One
var currentPlayer = 1;
var currentName = player1;
var currentColor = player1Color;
$("#retext").hide();

function changePlayer()
{
    // If no win or tie, continue to next player
    currentPlayer = currentPlayer * -1 ;

    // Re-Check who the current Player is.
    if (currentPlayer === 1) 
    {
        currentName = player1;
        $('#whoPlay').text(currentName + " player's Turn");
        currentColor = player1Color;
    }
    else 
    {
        currentName = player2
        $('#whoPlay').text(currentName + " player's Turn");
        currentColor = player2Color;
    }
}

// Start with Player One
$('#whoPlay').text(currentName + " player's Turn");
function move() 
{

    // Recognize what column was chosen
    var col = $(this).closest("td").index();

    // Get back bottom available row to change
    var bottomAvail = checkBottom(col);

    if(bottomAvail !== -1)
        changeColor(bottomAvail, col, currentColor);

    // Check for a win or a tie.
    if(horizontalWinCheck() || verticalWinCheck() || diagonalWinCheck()) 
    {
        gameEnd(currentName+ ' has won!');
        return true ; 
    }

    if(bottomAvail !== -1)
        changePlayer();
    

    if(isTie())
    {
        game.winning_array = [] ; 
        gameEnd("Game Tied!");
        return true ; 
    }
}

$('.board button').on('click', move )

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
    audio = new sound("Assert/dot.mpeg");
};