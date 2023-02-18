import React, { useEffect, useRef, useState } from "react";
import Row from "./Row";
import Square from "./Square";
import StartButton from "./StartButton";
import { useSocket } from "./providers/SocketProvider";
import { useLocation,useNavigate,useParams  } from "react-router";
import { useAuth } from "./context/AuthContext";
import styled from "styled-components";
import WinScreen from "./WinScreen";

function Game({id}){
    const [squares, setSquares] = useState(Array(8).fill(Array(8).fill({piece: ".", colour: 'red'})))  
    const [colour, setColour] = useState();
    const [turn, setTurn] = useState("white");
    
    const [previewSquares, setPreviewSquares] = useState(Array(8).fill(Array(8).fill(false)))   
    const [flip, setFlip] = useState(false)
    const [startPos, setStartPos] = useState([])
    const [endPos, setEndPos] = useState([])
    const [count, setCount] = useState(0)
    const [winner, setWinner] = useState(null);
    const [eloChange, setEloChange] = useState();
    const location = useLocation()
    const isMounted = useRef(false);
    const {currentUser} = useAuth();
    const socket = useSocket();
    const navigate = useNavigate();
    // const { id } = useParams();

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
    
    }

    useEffect(()=> {
        console.log("colour chnaged")
    },[colour])

    useEffect(() => {
        console.log("fetching game")
        fetchGame();
    }, [])

    useEffect(()=>{
        if(socket == null) return
        socket.emit('join-game', id);
    },[socket])

    useEffect(()=>{
        if(socket == null || colour == null ) return
        if(eloChange != null) return 
        socket.on('game-over', (data) =>{
            const res = JSON.parse(data)
            const elo = res.elo
            const winner = res.winner
            setEloChange(elo[colour])
            setWinner(winner)
        })
    },[socket,colour])

    useEffect(()=>{
        if(socket == null) return      
        socket.on('recieve-move', (res)=> {
            if(res == null) return
            const data = JSON.parse(res);
            const board = data.board;
            const turn = data.turn
            setTurn(getNextColour(turn))
            setSquares(board)
        })
    },[socket])

 

    async function fetchGame(){
        const path = location.pathname;
        const response = await fetch("https://nt-chess2.up.railway.app"+path)
        const data = await response.json();
        console.log("data", await data.White)
        if(data.White == currentUser.uid) setColour("white") //White
        if(data.Black == currentUser.uid) {
            flipBoard();
            setColour("black")} //Black
     }

    useEffect(() => {
        if(!isMounted.current) isMounted.current = true
        if(isMounted.current) console.log("wow")
    }, [location])

    useEffect(()=>{
        console.log('getting board')
        initBoard()
    },[])
    
    useEffect(() => {
        
        if(count == 1) {
            const piece = getPiece(squares,startPos);
            console.log(piece)
            if(colour != turn) return // Your turn rule
            if(piece.colour != colour) return resetClick(); //your piece rule
            const moves = getMoves(startPos,squares);
            const filterdMoves = filterMoves(moves);
            previewMoves(filterdMoves);
        }

        if (count == 2) {
            const [endRow,endCol] = endPos
            if(!previewSquares[endRow][endCol]) return resetClick(); //Possible move rule
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
    
    function initBoard(){
        const s = slice2D(Array(8).fill(Array(8).fill({piece: ".", colour: 'red'})));
        //Black 
        s[0][0] = {piece: "r", colour: 'white'}
        s[0][1] = {piece: "k", colour: 'white'}
        s[0][2] = {piece: "b", colour: 'white'}
        s[0][3] = {piece: "K", colour: 'white'}
        s[0][4] = {piece: "Q", colour: 'white'}
        s[0][5] = {piece: "b", colour: 'white'}
        s[0][6] = {piece: "k", colour: 'white'}
        s[0][7] = {piece: "r", colour: 'white'}
        //Pawns
        for(let i = 0; i< 8; i++){
            s[1][i] = {piece: "p", colour: 'white', enPessant: false}
        }

    //White
        s[7][0] = {piece: "r", colour: 'black', hasMoved: false}
        s[7][1] = {piece: "k", colour: 'black'}
        s[7][2] = {piece: "b", colour: 'black'}
        s[7][3] = {piece: "K", colour: 'black', hasMoved: false}
        s[7][4] = {piece: "Q", colour: 'black'}
        s[7][5] = {piece: "b", colour: 'black'}
        s[7][6] = {piece: "k", colour: 'black'}
        s[7][7] = {piece: "r", colour: 'black', hasMoved: false}
        //Pawns
        for(let i = 0; i< 8; i++){
            s[6][i] = {piece: "p", colour: 'black', enPessant: false}
        }        
        setSquares(s)
    }
    
    function handleClick(row,col){
        let pos = [row,col]
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


    function castle(startPos,endPos){
        const [startRow, startCol] = startPos
        const [endRow, endCol] = endPos
        if(startCol < endCol) return castleLong(endRow)
        if(startCol > endCol) return castleShort(endRow)
    }

    function castleLong(row){
        const s = slice2D(squares);
        //Move King
        const placeHolderK = s[row][5]
        s[row][5] = s[row][3]
        s[row][5].hasMoved = true
        s[row][3] = placeHolderK
        //Move Rook
        const placeHolderR = s[row][4]
        s[row][4] = s[row][7]
        s[row][7] = placeHolderR
        console.log(s)
        return s
    }

    function castleShort(row){
        const s = slice2D(squares);

        //Move King
        const placeHolderK = s[row][1]
        s[row][1] = s[row][3]
        s[row][1].hasMoved = true
        s[row][3] = placeHolderK
        //Move Rook
        const placeHolderR = s[row][2]
        s[row][2] = s[row][0]
        s[row][0] = placeHolderR
        return s
    }
    
    
    function canCastle(kingPos,colour){
        if (getPiece(squares, kingPos).hasMoved) return false
        const shortCastle = canCastleShort(kingPos,colour);
        const longCastle = canCastleLong(kingPos,colour);   
        return({shortCastle: shortCastle, longCastle:longCastle })
    }

    function canCastleShort(kingPos, colour){
        if(shortRookHasMoved(colour)) return false
        let [kingRow,kingCol] = kingPos;
        while(kingCol > 1) {
            kingCol--
            if(checkBlockedSquare([kingRow,kingCol], squares)) return false
        }
        return true;
    }

    function canCastleLong(kingPos, colour){
        if(longRookHasMoved(colour)) return false
        let [kingRow,kingCol] = kingPos;
        while(kingCol < 6) {
            kingCol++
            if(checkBlockedSquare([kingRow,kingCol], squares)) return false
        }
        return true;
    }

    function shortRookHasMoved(colour){
        console.log(colour)
        if (colour == "white") return squares[0][0].hasMoved 
        if (colour == "black") return squares[7][0].hasMoved 
    }

    function longRookHasMoved(colour){
        if (colour == "white") return squares[0][7].hasMoved 
        if (colour == "black") return squares[7][7].hasMoved 
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
        if(colour == "white") return "black"
        if(colour == "black") return "white"
    }

    function setEnPessant(pos,colour,s){
        const [row,col] = pos;
        console.log(s[row][col+1].colour)
        console.log(colour)
   
        if(s[row][col+1].colour != colour && s[row][col+1].piece == "p") s[row][col+1].enPessant = true;
        if(s[row][col-1].colour != colour && s[row][col-1].piece == "p") s[row][col-1].enPessant = true;
    
        return s
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
        let s = slice2D(squares)
        const startSquare = s[startRow][startCol]
        const endSquare = s[endRow][endCol]
        const placeHolder = startSquare

        if(startSquare.colour == endSquare.colour){
            if(startSquare.hasMoved) return
            if(startSquare.piece == "K" && endSquare.piece === "r") {
                const castledMove = castle(startPos,endPos)
                setSquares(castledMove)
                sendBoard(castledMove)
            }
            return
        } 
        
        if(endSquare.piece !== ".") {
            s[startRow][startCol] = {piece: ".", colour: 'black'}
        } else {
            s[startRow][startCol] = endSquare
        }

        s[endRow][endCol] = placeHolder
        
        if(kingCheck(s,colour)) return
        if(kingCheck(s,getNextColour(colour))){
            console.log(getNextColour(colour), "check")
            if(checkMate(s,getNextColour(colour))){
                socket.emit('check-mate', (JSON.stringify({id: id, winner:colour})))
                console.log(getNextColour(colour), "Check Mate")        
            }
        }
        if(startSquare.piece == 'p' && isDoubleMove(startRow,endRow)) s = setEnPessant(endPos,colour,s)
        if(startSquare.piece == 'K') startSquare.hasMoved = true 
        if(startSquare.piece == 'r') startSquare.hasMoved = true 

        console.log(startSquare)
        sendBoard(s);
        setSquares(s)
    }
    
    function isDoubleMove(startRow, endRow){
        if(Math.abs(startRow - endRow) == 2) return true
        return false
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
        const colour = squares[row][col].colour
        let possibleMoves = []
        possibleMoves[0] = [row + 1 ,col]
        possibleMoves[1] = [row,col + 1]

        possibleMoves[2] = [row - 1 ,col]
        possibleMoves[3] = [row,col - 1]

        possibleMoves[4] = [row + 1 ,col+1]
        possibleMoves[5] = [row - 1 ,col - 1]

        possibleMoves[6] = [row+1,col-1]
        possibleMoves[7] = [row -1 ,col+1]
        let castleMoves
        if(count == 1){
            castleMoves = canCastle(startingPos,colour)
            console.log(castleMoves)
        }
        if(castleMoves){
            if(castleMoves.shortCastle) possibleMoves.push([row, 0])
            if(castleMoves.longCastle) possibleMoves.push([row, 7])
        }
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

        if(colour == "white") {
            direction = 1
            if(row == 1) firstMove = true
            if(row == 7) return //ADD Promotion
        };
        
        if(colour == "black"){
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

    function forceCheckMate(){
        console.log("colour", colour)
        socket.emit('check-mate', (JSON.stringify({id: id, winner:colour})))
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

    return(
        <>
        {winner}
        {winner && <WinScreen id={currentUser.uid} location={location} winner={winner} eloChange={eloChange} colour={colour}/> }
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
             <StartButton onClick = {(()=> forceCheckMate())}
                        name = "Check Mate"/>

        </>
    )
}

const Board = styled.div`
display:grid;
border: solid black 0.2em;
position: relative;
grid-template-columns: auto auto auto auto auto auto auto auto;
`

export default Game