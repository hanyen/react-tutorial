class Square extends React.Component {
  constructor() {
    super();
    this.state = {
      value: null,
    };
  }
  
  //Whenever this.setState is called, an update to the component is scheduled, 
  //causing React to merge in the passed state update and rerender the component 
  //along with its descendants. When the component rerenders, this.state.value 
  //will be 'X' so you'll see an X in the grid.
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

//Goal: To check if someone has won, we'll need to have the value of all 9 squares in 
//one place, rather than split up across the Square components.

//Solution: When you want to aggregate data from multiple children or to have two child 
//components communicate with each other, move the state upwards so that it 
//lives in the parent component. The parent can then pass the state back down 
//to the children via props, so that the child components are always in sync 
//with each other and with the parent.
class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: Array(9).fill(null),
    };
  }
  renderSquare(i) {
    //Now we're passing down two props from Board to Square: value and onClick. 
    //The latter is a function that Square can call.

    //Square no longer keeps its own state; it receives its value from its parent 
    //Board and informs its parent when it's clicked. We call components like this 
    //controlled components.
    return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
  }
  render() {
    const status = 'Next player: X';
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
  // when the square is clicked, it calls the onClick function that was passed 
  //by the parent. The onClick doesn't have any special meaning here, but it's 
  //popular to name handler props starting with on and their implementations with 
  //handle. Try clicking a square – you should get an error because we haven't 
  //defined handleClick yet. Add it to the Board class:
  handleClick(i) {
    //Use the .slice() operator to copy the squares array prior to making changes and to prevent mutating the existing array.
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }  
  //The biggest benefit of immutability in React comes when you build simple pure 
  //components. Since immutable data can more easily determine if changes have been 
  //made it also helps to determine when a component requires being re-rendered.
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
