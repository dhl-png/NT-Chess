import React, { useEffect, useState } from "react";
import Row from "./Row";
import Square from "./Square";
import StartButton from "./StartButton";
import { useSocket } from "./providers/SocketProvider";
import { useLocation,useNavigate,useParams  } from "react-router";
import { useAuth } from "./context/AuthContext";
import styled from "styled-components";


function Game(props){
    const [squares, setSquares] = useState(Array(8).fill(Array(8).fill({piece: ".", colour: 'black'})))  
    const [colour, setColour] = useState();
    const [turn, setTurn] = useState("blue");
    
    const [previewSquares, setPreviewSquares] = useState(Array(8).fill(Array(8).fill(false)))   
    const [flip, setFlip] = useState(false)
    const [startPos, setStartPos] = useState([])
    const [endPos, setEndPos] = useState([])
    const [count, setCount] = useState(0)
    const [winner, setWinner] = useState();
    

    const location = useLocation()

    const {currentUser} = useAuth();
    const socket = useSocket();
    const navigate = useNavigate();
    const { id } = useParams();

    function sendBoard(board){
        socket.emit('send-board', JSON.stringify(
            {   
                turn: turn,
                id: id,
                board: board
            }
        ));
    }

    function endGame(winner){
        console.log(`ending game ${id} winner: ${winner}`)
        fetch(`http://localhost:5186/endGame`, 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                Id:id,
                Winner: winner
            })
        });
    
    }

    useEffect(()=>{
        if(socket == null) return
        fetchGame();
        socket.emit('join-game', id);
    },[socket])

    useEffect(()=>{
        if(socket == null) return
        socket.on('game-over', (winner) =>{
            setWinner(winner)
            endGame(winner)
        })
    },[socket])

    useEffect(()=>{
        if(socket == null) return      
        socket.on('recieve-move', (res)=> {
            if(res == null) return
            const data = JSON.parse(res);
            const board = data.board;
            const turn = data.turn
            console.log(turn)
            setTurn(getNextColour(turn))
            setSquares(board)
        })
    },[socket])
    
    async function fetchGame(){
        const path = location.pathname;
        const response = await fetch("http://localhost:5186"+path)
        const data = await response.json();
        if(data.White == currentUser.uid) setColour("red") //White
        if(data.Black == currentUser.uid) {
            flipBoard();
            setColour("blue")} //Black
     }

    useEffect(()=>{
        initBoard()
    },[])
    
    useEffect(() => {
        
        if(count == 1) {
            const piece = getPiece(squares,startPos);
            // if(colour != turn) return // Your turn rule
            // if(piece.colour != colour) return resetClick(); //your piece rule
            const moves = getMoves(startPos,squares);
            const filterdMoves = filterMoves(moves);
            previewMoves(filterdMoves);
        }

        if (count == 2) {
            const [endRow,endCol] = endPos
            if(!previewSquares[endRow][endCol]) return resetClick(); //Possible move rule
            if(getPiece(squares,endPos).colour == getPiece(squares,startPos).colour) return resetClick(); //Enemy Piece rule
            if(startPos == endPos) return resetClick(); //Different square rule

            movePiece();
            return resetClick();
        }
    }, [count])


    function resetClick(){
        setPreviewSquares(Array(8).fill(Array(8).fill(false)))
        setCount(0)
    }

    function renderRow(i){
        return (<>{[...Array(8).keys()].map(j => renderSquare(i,j))}</>)
    }
    
    function renderBoard2(){
    }

    function initBoard(){
        const s = slice2D(squares);
        s[4][0] = {piece: "r", colour:'red'}
        s[5][5] = {piece: "r", colour:'red'}
        s[7][5] = {piece: "K", colour:'red'}
        s[3][5] = {piece: "Q", colour:'blue'}
        s[4][2] = {piece: "b", colour:'blue'}
        setSquares(s)
    }

    function initBoard(){
        const s = slice2D(squares);
        //Black 
        s[0][0] = {piece: "r", colour: 'red'}
        s[0][1] = {piece: "k", colour: 'red'}
        s[0][2] = {piece: "b", colour: 'red'}
        s[0][3] = {piece: "K", colour: 'red'}
        s[0][4] = {piece: "Q", colour: 'red'}
        s[0][5] = {piece: "b", colour: 'red'}
        s[0][6] = {piece: "k", colour: 'red'}
        s[0][7] = {piece: "r", colour: 'red'}
        //Pawns
        for(let i = 0; i< 8; i++){
            s[1][i] = {piece: "p", colour: 'red'}
        }

    //White
        s[7][0] = {piece: "r", colour: 'blue'}
        s[7][1] = {piece: "k", colour: 'blue'}
        s[7][2] = {piece: "b", colour: 'blue'}
        s[7][3] = {piece: "K", colour: 'blue'}
        s[7][4] = {piece: "Q", colour: 'blue'}
        s[7][5] = {piece: "b", colour: 'blue'}
        s[7][6] = {piece: "k", colour: 'blue'}
        s[7][7] = {piece: "r", colour: 'blue'}
        //Pawns
        for(let i = 0; i< 8; i++){
            s[6][i] = {piece: "p", colour: 'blue'}
        }        
        setSquares(s)
    }
    
    function handleClick(row,col){
        let pos = [row,col]
        console.log(pos)
        if (count == 0) setStartPos(pos)
        if (count == 1) setEndPos(pos)
        setCount(count+1)
    }

    function previewMoves(moves){
        if(moves == undefined) return
        const ps = slice2D(previewSquares)
        moves.forEach(move => {
            const [row,col] = move
            ps[row][col] = true
        })
        setPreviewSquares(ps)
    }

    function filterMoves(moves){
        if(moves == undefined) return
        return moves.filter(move => {
            const [row,col] = move
            return (row>=0 && row < 8 && col >= 0 && col < 8)
        })
    }

    function getPiece(s,pos){
        const [row,col] = pos
        return s[row][col]
    }

    function flipBoard(){
        setFlip(!flip)
    }
    function getNextColour(colour){
        if(colour == "red") return "blue"
        if(colour == "blue") return "red"
    }

    function checkMate(squares,colour){
        const nextColour = getNextColour(colour);

        const dangerMoves = getDangerSquares(colour, squares)
        getPiecePos(squares, nextColour).forEach(piecePos => {
            dangerMoves.push(piecePos)
        })

        const stringifiedDM = dangerMoves.map(move => {return(String(move))});
        const pieces = getPieces(colour,squares);
        const pc = pieces.filter((piece)=>{
            if(piece.piece.piece == 'K') return
            const pos = [piece.row,piece.col]
            const moves = filterMoves(getMoves(pos,squares)).map((move) => {return String(move)});

            const blockingMoves = moves.filter((move) => {
                return stringifiedDM.includes(move)
            })

            const intBlockingMoves = stringToInt(blockingMoves) 

            const m = intBlockingMoves.filter((move) =>{
                const s = slice2D(squares)

                const [startRow,startCol] = pos 
                const [endRow,endCol] = move

                const startSquare = s[startRow][startCol]
                const endSquare = s[endRow][endCol]
                const placeHolder = startSquare
                if(endSquare.colour == startSquare.colour) return false;
                
                if(endSquare.piece !== "." && endSquare.colour != colour) {
                    s[startRow][startCol] = {piece: ".", colour: 'black'}
                } else {
                    s[startRow][startCol] = endSquare
                }
                s[endRow][endCol] = placeHolder
                
                return !kingCheck(s,colour)
            })
            return (m.length > 0)
        })
        
        return(!pc.length > 0 && !filterKingMove(squares,colour).length > 0)
    }

    function getPiecePos(squares,colour) {
        let piecesPos = []
        squares.forEach((rows, row)=>{
            rows.forEach((square, col) =>{
                if(square.piece != "." && square.colour == colour) piecesPos.push([row,col])
            })
        })
        return piecesPos
    }
    
    function getPieces(colour,squares){
        let pieces = []
        squares.forEach((rows, row)=>{
            rows.forEach((square, col) =>{
                if(square.piece != "." && square.colour == colour) pieces.push({piece:square, row:row, col:col})
            })
        })
        return pieces
    }

    function movePiece(){
        const [startRow,startCol] = startPos 
        const [endRow,endCol] = endPos
        const s = slice2D(squares)
        const startSquare = s[startRow][startCol]
        const endSquare = s[endRow][endCol]
        const placeHolder = startSquare

        if(endSquare.piece !== ".") {
            s[startRow][startCol] = {piece: ".", colour: 'black'}
        } else {
            s[startRow][startCol] = endSquare
        }

        s[endRow][endCol] = placeHolder
        let nextColour;
 
        if(kingCheck(s,colour)) return
        if(kingCheck(s,getNextColour(colour))){
            console.log(getNextColour(colour), "check")
            if(checkMate(s,getNextColour(colour))){
                socket.emit('check-mate', (JSON.stringify({id: id, winner:colour})))
                console.log(getNextColour(colour), "Check Mate")
            }
        }
        sendBoard(s);
        setSquares(s)
    }
    
    function getMoves(pos,squares){
        const piece = getPiece(squares,pos)
        if (piece.piece == "K") return getKingMoves(pos);
        if (piece.piece == "r") return getRookMoves(pos,squares);
        if (piece.piece == "b") return getBishopMoves(pos,squares);
        if (piece.piece == "k") return getKnightMoves(pos,squares);
        if (piece.piece == "p") return getPawnMoves(pos, piece.colour,squares);
        if (piece.piece == "Q") return getQueenMoves(pos,squares);
        if (piece.piece == ".") setCount(0);
    }

    function kingCheck(squares,colour){
        let kingPos = getKingPos(colour, squares)
        const stringifiedDM = getDangerSquares(colour,squares).map(moves => {return String(moves)})
        const isChecked = stringifiedDM.includes(String(kingPos))
        return isChecked
    }

    function checkBlockedSquare(move, squares){
        if(move == null) return
        const [row,col] = move
        return(squares[row][col].piece != ".") 
    }

    function getKingMoves(startingPos){
        let [row,col] = startingPos

        let possibleMoves = []
        possibleMoves[0] = [row + 1 ,col]
        possibleMoves[1] = [row,col + 1]

        possibleMoves[2] = [row - 1 ,col]
        possibleMoves[3] = [row,col - 1]

        possibleMoves[4] = [row + 1 ,col+1]
        possibleMoves[5] = [row - 1 ,col - 1]

        possibleMoves[6] = [row+1,col-1]
        possibleMoves[7] = [row -1 ,col+1]
        return possibleMoves 
    }
    

    function getDangerSquares(colour,s){
        const dangerSquares = []
        s.forEach((rows, rowIdx) => { 
            rows.forEach((col, colIdx) => {
                if(col.piece != "." && col.colour != colour ) {
                    dangerSquares.push(getMoves([rowIdx,colIdx],s))}
            })
        })
        return dangerSquares.flat(1)
    }

    function filterKingMove(s,colour){
        const stringifiedDangerSquares = getDangerSquares(colour,s).map(move => {return(String(move))})
        const kingPos = getKingPos(colour,s)
        const stringifiedKingMoves = filterMoves(getKingMoves(kingPos)).map((move) => {return(String(move))})
        const safeMoves = stringifiedKingMoves.filter((move) => { return (!stringifiedDangerSquares.includes(move))})
        const intSafeMoves = stringToInt(safeMoves)
        const nonBlockedSafeMoves = intSafeMoves.filter(move => {return !checkBlockedSquare(move,s)})
        return nonBlockedSafeMoves
    }


    function stringToInt(stringArr){
        const safeSquares = []
        stringArr.forEach(move => {
            safeSquares.push(
                move.split(',').map(Number)
                )
         });
         return safeSquares
    }

    function getKingPos(colour,squares){
        let pos = []
        squares.forEach((rows, row) => {
            rows.forEach((square,col) =>{
                if(square.piece == "K" && square.colour == colour) pos =[row,col] 
            })
        })
        return pos
    }

    function getPawnMoves(startingPos,colour,squares){
        let possibleMoves = []
        const [row,col] = startingPos
        let direction = -1
        let firstMove = false

        if(colour == "red") {
            direction = 1
            if(row == 1) firstMove = true
            if(row == 7) return //ADD Promotion
        };
        
        if(colour == "blue"){
            if(row == 6) firstMove = true
            if(row == 0) return //ADD Promotion
        }

        const forward = [startingPos[0] + direction, startingPos[1]];
        const forward2 = [startingPos[0] + direction*2, startingPos[1]];
        
        let leftDiagonal
        if(col !== 7) leftDiagonal = [startingPos[0] + direction, startingPos[1] + 1]
        
        let rightDiagonal 
        if(col !== 0) rightDiagonal = [startingPos[0] + direction, startingPos[1] - 1];

        if(checkBlockedSquare(leftDiagonal, squares)) possibleMoves.push(leftDiagonal)
        if(checkBlockedSquare(rightDiagonal, squares)) possibleMoves.push(rightDiagonal)
        if(!checkBlockedSquare(forward,squares)) possibleMoves[2] = forward;
        if(firstMove && !checkBlockedSquare(forward2,squares) && !checkBlockedSquare(forward,squares)) possibleMoves[3] = forward2;
        
        return possibleMoves
    }
    
    function getBishopMoves(startingPos,squares){
        let possibleMoves = [];
        const [row, col] = startingPos

        let [rIdx, cIdx] = [row-1, col-1]
        while(rIdx >= 0 && cIdx >= 0){
            const move = [rIdx, cIdx]
            possibleMoves.push([rIdx--,cIdx--])
            if(checkBlockedSquare(move,squares)) break 
        }
        [rIdx, cIdx] = [row-1, col+1]
        while(rIdx >= 0 && cIdx < 8){
            const move = [rIdx, cIdx]
            possibleMoves.push([rIdx--,cIdx++])
            if(checkBlockedSquare(move,squares)) break 
        }

        [rIdx, cIdx] = [row+1, col+1]
        while(rIdx < 8 && cIdx < 8){
            const move = [rIdx, cIdx]
            possibleMoves.push([rIdx++,cIdx++])
            if(checkBlockedSquare(move,squares)) break 

        }

        [rIdx, cIdx] = [row+1, col-1]
        while(rIdx < 8 && cIdx >= 0){
            const move = [rIdx, cIdx]
            possibleMoves.push([rIdx++,cIdx--])
            if(checkBlockedSquare(move,squares)) break 
        }

        return possibleMoves
    }

    function getKnightMoves(startingPos){
        let posibleMoves = [];
        posibleMoves[0] = [startingPos[0] + 1, startingPos[1] +2]
        posibleMoves[1] = [startingPos[0] - 1, startingPos[1] -2]
        posibleMoves[2] = [startingPos[0] - 1, startingPos[1] +2]
        posibleMoves[3] = [startingPos[0] + 1, startingPos[1] -2]

        posibleMoves[4] = [startingPos[0] + 2, startingPos[1] +1]
        posibleMoves[5] = [startingPos[0] - 2, startingPos[1] -1]
        posibleMoves[6] = [startingPos[0] - 2, startingPos[1] +1]
        posibleMoves[7] = [startingPos[0] + 2, startingPos[1] -1]
        return posibleMoves
    }

    function getQueenMoves(startingPos,squares){
        let possibleMoves = []
        getBishopMoves(startingPos,squares).map(item => {possibleMoves.push(item)});
        getRookMoves(startingPos,squares).map(item => {possibleMoves.push(item)});
        return possibleMoves
    }

    function getRookMoves(startingPos,squares){
        let possibleMoves = [];
        const [row,col] = startingPos
        
        //Down
        for(let x = row+1; x < 8; x++){
            const move = [x,col]
            possibleMoves.push(move)
            if(checkBlockedSquare(move,squares)) break
        }

         //Up
         for(let x = row-1; x >= 0; x--){
            const move = [x,col]
            possibleMoves.push(move)
            if(checkBlockedSquare(move,squares)) break

        }
        
        //Left 
        for(let y = col-1; y >= 0; y--){
            const move = [row,y]
            possibleMoves.push(move)
            if(checkBlockedSquare(move,squares)) break

        }
        
        //Right 
        for(let y = col+1; y < 8; y++){
            const move = [row,y]
            possibleMoves.push(move)
            if(checkBlockedSquare(move,squares)) break
        }

        return possibleMoves;
    }
 
    function slice2D(array){
        return array.map((arr) => {
            return arr.slice();
        })
    }
    function renderBoard(){
        return [...Array(8).keys()].map(n=> {
            return renderRow(n)
        })
    }


    function renderReverseBoard(){
        return [...Array(8).keys()].reverse().map(n=> {
            return renderRow(n)
        })
    }

    function renderSquare(row,col){
        return(
            <Square 
            square = {squares[row][col].piece} 
            row = {row}
            col = {col}
            pieceColour = {squares[row][col].colour}
            squareColour = {previewSquares[row][col]}
            onClick = {() => handleClick(row,col)}
            />
        );
    }


    const Board = styled.div`
        display:grid;
        border: solid black 0.2em;
        position: relative;
        grid-template-columns: auto auto auto auto auto auto auto auto;
    `
    return(
        <>
        {winner && <WinnerScreen winner={winner}/>}
        <h2>{colour}</h2>

        <Board>   
            {flip ? renderBoard(): renderReverseBoard()}
        </Board>

        <h3>it is {turn}'s turn</h3>

        <br/>
          <StartButton onClick = {(()=> flipBoard())}
                        name = "Flip"/>
            <StartButton onClick = {(()=> navigate("/home"))}
                        name = "Exit"/>
             <StartButton onClick = {(()=> checkMate(squares,colour))}
                        name = "Get Pieces"/>

        </>
    )
}

export default Game