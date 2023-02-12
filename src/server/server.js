
class Queue {
    constructor() {
      this.elements = {};
      this.head = 0;
      this.tail = 0;
    }
    enqueue(element) {
      this.elements[this.tail] = element;
      this.tail++;
    }
    dequeue() {
      if(this.length == 0) return
      const item = this.elements[this.head];
      delete this.elements[this.head];
      this.head++;
      return item;
    }
    peek() {
      return this.elements[this.head];
    }
    get length() {
      return this.tail - this.head;
    }
    get isEmpty() {
      return this.length === 0;
    }
  }

  const http = require('http').createServer();
  
  const io = require('socket.io')(http,
    {cors: {origin: "*"}
  });
  
const playersInQueue = new Object();
const boards = [];

  let brackets = new Array(40).fill().map(u => new Queue())
  
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.id;
    socket.join(userId)

    socket.on('join-queue', (data)=>{
      const player = JSON.parse(data);
      console.log(player)
      if (playersInQueue[String(player.id)]) return console.log(player.id + " already in queue");
      playersInQueue[String(player.id)] = true;
      const elo = 800
      const id = player.id
      const bracket = Math.round(elo/100);
      console.log(bracket)
      brackets[bracket].enqueue(id);
      if(brackets[bracket].length > 1) {

        const p1 = brackets[bracket].dequeue()
        const p2 = brackets[bracket].dequeue()
        delete playersInQueue[String(p1)];
        delete playersInQueue[String(p2)];

        const game = {
          white: p1,
          black: p2
        }

          newGame(game).then((id)=> {
            const game = {
              white: p1,
              black: p2,
              id: id
            }
            console.log("going")
            io.to(String(game.white)).emit('start-game',game);
            io.to(String(game.black)).emit('start-game',game);
          }) 
        }});

    socket.on('end-game', (gameID) => {
      io.to(String(gameID)).emit('exit-game');
      
      delete boards[gameID]
    })

    socket.on('send-board', (res)=> {
      const data = JSON.parse(res)
      const board = data.board;
      const id = data.id;
      const turn = data.turn;
      boards[id] = {board: board, turn:turn}

      io.to(String(id)).emit('recieve-move', JSON.stringify({board: board, turn: turn}));

    })
    
    socket.on('check-mate', (res) =>{
      console.log("game over")
      const data = JSON.parse(res)
      const gameId = data.id;
      const winner = data.winner;
      const eloChange = endGame(gameId,winner);
      eloChange.then((elo) => {
        console.log("e", elo)
        io.to(String(gameId)).emit('game-over', JSON.stringify(
          {
            elo:elo,
            winner:winner}
          ))
      })

      delete boards[gameId];
    })


    socket.on('rematch', (game) => {
      console.log(game)
      socket.broadcast.emit('recieve-invite', {player:userId})
    });

    socket.on('accept-invite', (player) =>{

      let user = io.in(player).fetchSockets();
      console.log(player)
      let players = [player, userId];
      if(Math.random() > 0.5) players.reverse();
      const game = {
        white: players[0],
        black: players[1]
      }

      newGame(game).then((gameId) => {
        console.log(gameId)
        user.then((u)=> {
          const game = {
            Id: gameId,
            white: players[0],
            black: players[1]
          }
          socket.join(gameId)
          u[0].join(gameId)
          io.to(gameId).emit('start-game', (JSON.stringify(game)));
        })
      })
    })

   async function endGame(id, winner){
    const res = await fetch("http://localhost:5186/endGame", 
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;'},
        body: JSON.stringify({
            Id:id,
            Winner:winner
        })
    });

    return await res.json();
   }

    async function newGame(game){
      const resp = await fetch("http://localhost:5186/newGame",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;'
        },
        body: JSON.stringify(game)
      })
      const data = await resp.text()
      boards[data.Id] = []
      return data
    }

    socket.on('join-game', (gameId) => {
      console.log("joining game" + gameId)
      socket.join(gameId)
      socket.emit('start-game')
      const board = boards[gameId];
      io.to(String(gameId)).emit('recieve-move', JSON.stringify(board));
    })

    socket.on('send-invite', (player) => {
      io.to(player).emit('recieve-invite', {player:userId})
    })
  })
  
  http.listen(8080);
  