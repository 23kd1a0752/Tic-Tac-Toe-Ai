const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

const xWinsText = document.getElementById("xWins");
const oWinsText = document.getElementById("oWins");
const drawsText = document.getElementById("draws");

const restartBtn = document.getElementById("restartBtn");
const themeBtn = document.getElementById("themeBtn");

const clickSound = document.getElementById("clickSound");

let board = ["","","","","","","","",""];
let gameActive = true;

let scores = JSON.parse(localStorage.getItem("tttScores")) || {
x:0,
o:0,
draw:0
};

updateScoreBoard();

const winPatterns = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
];

cells.forEach(cell=>{
cell.addEventListener("click",playerMove);
});

restartBtn.addEventListener("click",resetGame);

themeBtn.addEventListener("click",()=>{
document.body.classList.toggle("dark");
});

function playerMove(){
let index = this.dataset.index;

if(board[index]!=="" || !gameActive) return;

clickSound.play();

board[index]="X";
this.textContent="X";

if(checkWinner("X")){
scores.x++;
saveScores();
statusText.textContent="You Win!";
gameActive=false;
return;
}

if(isDraw()){
scores.draw++;
saveScores();
statusText.textContent="Draw!";
gameActive=false;
return;
}

statusText.textContent="Computer Thinking...";

setTimeout(aiMove,500);
}

function aiMove(){

let empty = board
.map((v,i)=>v===""?i:null)
.filter(v=>v!==null);

let move = empty[Math.floor(Math.random()*empty.length)];

board[move]="O";
cells[move].textContent="O";

if(checkWinner("O")){
scores.o++;
saveScores();
statusText.textContent="Computer Wins!";
gameActive=false;
return;
}

if(isDraw()){
scores.draw++;
saveScores();
statusText.textContent="Draw!";
gameActive=false;
return;
}

statusText.textContent="Your Turn (X)";
}

function checkWinner(player){

for(let pattern of winPatterns){

let [a,b,c]=pattern;

if(
board[a]===player &&
board[b]===player &&
board[c]===player
){
cells[a].classList.add("win");
cells[b].classList.add("win");
cells[c].classList.add("win");
return true;
}
}

return false;
}

function isDraw(){
return !board.includes("");
}

function resetGame(){

board=["","","","","","","","",""];
gameActive=true;

cells.forEach(cell=>{
cell.textContent="";
cell.classList.remove("win");
});

statusText.textContent="Your Turn (X)";
}

function saveScores(){

localStorage.setItem(
"tttScores",
JSON.stringify(scores)
);

updateScoreBoard();
}

function updateScoreBoard(){

xWinsText.textContent=scores.x;
oWinsText.textContent=scores.o;
drawsText.textContent=scores.draw;
}