document.addEventListener('DOMContentLoaded', () => {
const grid = document.querySelector('.grid');
let squares =Array.from(document.querySelectorAll('.grid div'));
const ScoreDisplay  = document.querySelector('#score');
const StartBtn = document.querySelector('#btn-start');
const PauseBtn = document.querySelector("#btn-pause");
const ResetBtn = document.querySelector("#btn-reset");
var musicPlayer;
let nextRandom = 0
let score = 0
let timerId;
const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ]

const width = 10;

const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = 0

  let random = Math.floor(Math.random()*theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]


  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
      
    })
  }


  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''


    })
  }

  function control(e) {
    if (timerId){
      if(e.keyCode === 37) {
        moveLeft()
      } else if (e.keyCode === 38) {
        rotate()
      } else if (e.keyCode === 39) {
        moveRight()
      } else if (e.keyCode === 40) {
        moveDown()
    }
  }

  }
  document.addEventListener('keydown', control)

  function moveDown() {
    undraw()
    const checkColision = current.some(index => squares[currentPosition + index + width].classList.contains('taken'))
    if (!checkColision){
      currentPosition += width
    }
    draw()
    freeze()
  }

  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
  }

  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }
    draw()
  }

  function rotate() {
    undraw();
    currentRotation ++
    if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation];
    const checkColision = current.some(index => squares[currentPosition + index].classList.contains('taken'))
    if (((isAtLeft() && isAtRight()) || checkColision)){
      currentRotation = currentRotation - 1 > -1 ? currentRotation - 1 : current.length - 1;
      current = theTetrominoes[random][currentRotation]
    }
    draw();
  }
  function isAtRight() {
    return current.some(index => (currentPosition + index) % width === width -1) 
  }
  
  function isAtLeft() {
    return current.some(index => (currentPosition + index) % width === 0)
  }

  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new tetromino falling
      genTetromino();
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  function genTetromino(){
    random = nextRandom
    nextRandom = Math.floor(Math.random() * theTetrominoes.length)
    current = theTetrominoes[random][currentRotation]
    currentPosition = 4
  }


    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0
  

    const upNextTetrominoes = [
      [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
      [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
      [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
      [0, 1, displayWidth, displayWidth+1], //oTetromino
      [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    function displayShape() {
        //remove any trace of a tetromino form the entire grid
        displaySquares.forEach(square => {
          square.classList.remove('tetromino')
          square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach( index => {
          displaySquares[displayIndex + index].classList.add('tetromino')
          displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
      }

      StartBtn.addEventListener('click', () => {
        pauseGame();  
        startGame();
        StartBtn.innerHTML = "Restart";
        StartBtn.style.width = "60px";
        StartBtn.style.fontSize = "14px";
        PauseBtn.style.fontSize = "14px";
        PauseBtn.innerHTML = "Pause";
        PauseBtn.removeAttribute("hidden");


        }
      )

      function startGame(){
        squares.forEach((square, index) => {
          square.classList.remove("tetromino");
          squares[index].style.background = "";
          if (index < squares.length - width) {
            square.classList.remove("taken");
          }
        });
          score = 0;
          ScoreDisplay.innerHTML = score;
          genTetromino();
          draw();
          displayShape();
          resumeGame();
          if(musicPlayer){
            musicPlayer.stop();
          }
          musicPlayer = new sound("music/tetris-st.mp4");
          musicPlayer.play();

          
      }

      PauseBtn.addEventListener('click', () => {
        if (timerId) {
          pauseGame();
          PauseBtn.innerHTML = "Resume";
        } else {
          resumeGame();
          PauseBtn.innerHTML = "Pause";
          musicPlayer.play();
        }
      });

      function pauseGame(){
        if (timerId) {
          clearInterval(timerId)
          timerId = null
          musicPlayer.stop();
        } 
      }
      function addScore() {
        for (let i = 0; i < 199; i +=width) {
          const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
    
          if(row.every(index => squares[index].classList.contains('taken'))) {
            console.log(score);
            score +=10
            ScoreDisplay.innerHTML = score
            row.forEach(index => {
              squares[index].classList.remove('taken')
              squares[index].classList.remove('tetromino')
              squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
          }
        }
      }
    
      function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
           ScoreDisplay.innerHTML = `${score}<br />Game Over!<br />`;
           pauseGame()
        }
      }
    
      function resumeGame() {
        timerId = setInterval(moveDown, 1000);
      }

      function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.loop = true;
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
          this.sound.play();
        }
        this.stop = function(){
          this.sound.pause();
        }
      }




})