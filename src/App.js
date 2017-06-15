import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import $ from 'jquery';

class Header extends React.Component {
  render() {
    return (
      <div className="jumbotron">
        <h1>FreeCodeCamp Tic-Tac-Toe-Challenge</h1>
        <p>Written by <a target="_blank" rel="noopener noreferrer" href="https://github.com/pbrn46/">Boris Wong</a>, 2017-06-13</p>
      </div>
    );
  }
}

class GameBox extends React.Component {
  render() {
    let winClass = this.props.winner ? "gameBoxWinner" : "";
    return (
      <div className="col-4 gameBox p-1">
        <button className={"btn btn-primary btn-block h-100 " + winClass} onClick={this.props.onBoxClick}>
          {this.props.mark ? this.props.mark : (<span>&nbsp;</span>)}
        </button>
      </div>
    );
  }
}

class GameBoard extends React.Component {
  renderBox(i) {
    let winner = false;
    if (this.props.winMarks) {
      winner = this.props.winMarks.indexOf(i) !== -1
    }
    return (
      <GameBox
        id={i}
        onBoxClick={() => this.props.onBoxClick(i)}
        mark={this.props.marks[i]} winner={winner}/>
    );
  }
  render() {
    if (!this.props.gameStarted) {
      return null;
    }
    return (
      <div className="gameBoard rounded p-2 mx-auto">
        <div className="row h-100 no-gutters">
          {this.renderBox(0)}{this.renderBox(1)}{this.renderBox(2)}
          {this.renderBox(3)}{this.renderBox(4)}{this.renderBox(5)}
          {this.renderBox(6)}{this.renderBox(7)}{this.renderBox(8)}
        </div>
      </div>
    );
  }
}

class GameStatus extends React.Component {
  render() {
    return (
      <div className="card mb-4 mx-auto gameStatus">
        <div className="card-block">
          <div className="container-fluid" >
          <div className="row form-inline">
            <span className="col-12 col-md-4 col-form-label-lg text-center">Status</span>
            <span className="col-12 col-md-8 col-form-label text-center">{this.props.statusText}</span>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

class GameUtilities extends React.Component {
  render() {
    let readyToStart = false;
    if (!this.props.gameStarted && this.props.playVs === "player") readyToStart = true;
    if (!this.props.gameStarted && this.props.playVs === "computer" && this.props.playAs !== "") readyToStart = true;
    return (
      <div className="card mb-4 mx-auto gameUtilities">
        <div className="card-block">

          {!this.props.gameStarted &&
           <div className="container-fluid">
             <div className="row mb-0 form-inline" data-toggle="buttons">
               <label className="col-12 col-md-4 text-center col-form-label-lg">Play vs.</label>
               <label className="col-12 col-md-4 btn btn-primary gameUtilButton" onClick={() => this.props.onPlayVsClick("player")}>
                 <input type="radio" name="playVs" id="pvp" autoComplete="off" />Player
               </label>
               <label className="col-12 col-md-4 btn btn-primary gameUtilButton" onClick={() => this.props.onPlayVsClick("computer")}>
                 <input type="radio" name="playVs" id="pvc" autoComplete="off" />Computer
               </label>
             </div>
             {this.props.playVs === "computer" &&
             <div className="row mb-0 form-inline" data-toggle="buttons">
               <label className="col-12 col-md-4 text-center col-form-label-lg">Play as</label>
               <label className="col-12 col-md-4 btn btn-primary gameUtilButton" onClick={() => this.props.onPlayAsClick("X")}>
                 <input type="radio" name="playAs" autoComplete="off" />X
               </label>
               <label className="col-12 col-md-4 btn btn-primary gameUtilButton" onClick={() => this.props.onPlayAsClick("O")}>
                 <input type="radio" name="playAs" autoComplete="off" />O
               </label>
             </div>
             }
           </div>
          }
          <div className="">
            {readyToStart &&
             <div>
             <hr />
             <button className="btn btn-success btn-block gameUtilButton" onClick={this.props.onBtnStartClick}>Start Game!</button>
             </div>
            }
            {this.props.gameStarted &&
             <button className="btn btn-danger btn-block gameUtilButton" onClick={this.props.onBtnResetClick}>Reset Game</button>
            }
          </div>

        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.newStartState = () => {
      return {
        gameStarted: false,
        marks: Array(9),
        playVs: "",
        playAs: "",
        nextPlayer: "X",
        gameEnded: false
      }
    }
    this.state = this.newStartState();
    this.onBtnStartClick = this.onBtnStartClick.bind(this);
    this.onBtnResetClick = this.onBtnResetClick.bind(this);
    this.onBoxClick = this.onBoxClick.bind(this);
    this.onPlayVsClick = this.onPlayVsClick.bind(this);
    this.onPlayAsClick = this.onPlayAsClick.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.gameStarted !== this.state.gameStarted && this.state.gameStarted) {
      $('html, body').animate({
        scrollTop: $(".gameBoard").offset().top
      }, 1000);
    }
  }
  resetGame() {
    this.setState(this.newStartState());
  }
  getStatus() {
    let winner = findWinner(this.state.marks)[0];
    if (this.state.playVs === "") {
      return "Select an opponent.";
    }
    if (this.state.gameStarted === false) {
      return "Click 'Start Game!' to begin.";
    }
    if (winner === "X" || winner === "O") {
      return winner + " has won!";
    }
    if (winner === "D") {
      return "Game draw. Everybody loses. Life's unfair.";
    }
    return this.state.nextPlayer + " is next.";
  }
  setMark(i) {
    this.setState((prevState, props) => {
      if (prevState.gameEnded) return;
      let marks = prevState.marks.slice();
      let nextPlayer = prevState.nextPlayer
      let gameEnded = false;
      let index = i;
      if (index === "C") {  // "C" to generate computer index
        if (prevState.playVs !== "computer") return;  // If we're not playing the computer, what are we doing here??
        if (nextPlayer !== otherPlayer(prevState.playAs)) return;  // If it's not computer's turn, ignore
        index = getNextComputerMove(marks, nextPlayer);
      }
      if (marks[index] === undefined) { // If mark hasn't been set yet
        marks[index] = nextPlayer;
        nextPlayer = otherPlayer(nextPlayer);
        if (findWinner(marks)[0] !== "I") { // Check if game is over
          gameEnded = true;
        }
      }
      return {
        marks,
        nextPlayer,
        gameEnded
      };
    });
  }
  onBtnStartClick() {
    this.setState((prevState, props) => {
      return {
        gameStarted: true
      };
    });
    this.setMark("C");
  }
  onBtnResetClick() {
    this.resetGame();
  }
  onBoxClick(i) {
    this.setMark(i);
    this.setMark("C");
  }
  onPlayVsClick(playVs) {
    this.setState({
      playVs: playVs,
      playAs: ""
    });
  }
  onPlayAsClick(playAs) {
    this.setState({
      playAs: playAs
    });
  }
  render() {
    let winMarks = findWinner(this.state.marks)[1];
    return (
      <div className="card">
        <div className="card-block">
          <GameStatus statusText={this.getStatus()} />
          <GameUtilities
            onBtnStartClick={this.onBtnStartClick}
            onBtnResetClick={this.onBtnResetClick}
            onPlayVsClick={this.onPlayVsClick}
            onPlayAsClick={this.onPlayAsClick}
            gameStarted={this.state.gameStarted}
            playVs={this.state.playVs}
            playAs={this.state.playAs}
          />
          <GameBoard gameStarted={this.state.gameStarted} marks={this.state.marks} winMarks={winMarks} onBoxClick={(i) => this.onBoxClick(i)} />
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Header />
        <Game />
      </div>
    );
  }
}


/* Returns an array with [condition, [winA, winB, winC]], where winX are indexes of the win condition. */
function findWinner(marks) {
  var condition = 'D';  // 'D' = draw.
  var winMarks = [];
  var winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < marks.length; i++) {
    if (marks[i] === undefined) {
      // Incomplete game
      condition = "I";
    }
  }
  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (marks[a] && marks[a] === marks[b] && marks[a] === marks[c]) {
      condition = marks[a];
      winMarks = winMarks.concat([a, b, c]);
    }
  }
  return [condition, winMarks];
}

/* Returns an array with indexes of empty boxes. */
function getEmptyMarks(marks) {
  var emptyMarks = [];
  for (let i = 0; i < marks.length; i++) {
    if (marks[i] === undefined) {
      emptyMarks.push(i);
    }
  }
  return emptyMarks;
}

function getWinningMove(marks, markChar) {
  var emptyMarks = getEmptyMarks(marks);
  for (let i = 0; i < emptyMarks.length; i++) {
    let testMarks = marks.slice();
    testMarks[emptyMarks[i]] = markChar;
    if (findWinner(testMarks)[0] === markChar) {
      return emptyMarks[i];
    }
  }
  return -1;
}

function getNextComputerMove(marks, computerMarkChar) {
  var winningMove = getWinningMove(marks, computerMarkChar);
  var losingMove = getWinningMove(marks, otherPlayer(computerMarkChar));  // Lose if player makes this move
  var emptyMarks = getEmptyMarks(marks);
  if (winningMove !== -1) return winningMove;  // Win the game, computer!
  else if (losingMove !== -1) return losingMove;  // Block the player from making this move
  else return emptyMarks[Math.floor(Math.random() * emptyMarks.length)];
}

function otherPlayer(markChar) {
  return markChar === "X" ? "O" : "X";
}

ReactDOM.render(<App />, document.getElementById('root'));
