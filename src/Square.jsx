import styled from "styled-components";
import king from '/src/assets/wking.png';
import bishop from './assets/wbishop.png';
import knight from './assets/wknight.png';
import rook from './assets/wrook.png';
import queen from './assets/wqueen.png'
import pawn from './assets/wpawn.png';




const Tile = styled.div`
    cursor: pointer;
    position:relative;
    text-align: center;
    width:5vw;
    height: 5vw;
    color: red;
`
const Image = styled.img`
    max-width:100%;
    max-height:100%;

`
function Square(props){
    function test(){
        console.log("test")
    }

    let color = ((props.row + props.col) % 2 == 0 ) ? "black" : "white"
    color = (props.squareColour) ? "blue" : color;
    
    function getPieceIcon(piece,color){
        const inv = (color == "blue") ? 1 : 0
        if(piece == "K") return <Image style={{filter:`invert(${inv})`}} src={king} />
        if(piece == "k") return <Image style={{filter:`invert(${inv})`}} src={knight}/>
        if(piece == "b") return <Image style={{filter:`invert(${inv})`}} src={bishop}/>
        if(piece == "p") return <Image style={{filter:`invert(${inv})`}} src={pawn}/>
        if(piece == "Q") return <Image style={{filter:`invert(${inv})`}} src={queen}/>
        if(piece == "r") return <Image style={{filter:`invert(${inv})`}} src={rook}/>
    }
    return(
        // <button style={{ color: props.pieceColour, backgroundColor: props.squareColour ? "blue" : "white" }} onClick = {props.onClick} className="square">{props.square}</button>
       <Tile style={{backgroundColor: color}} onClick={props.onClick}>{getPieceIcon(props.square,props.pieceColour)}</Tile>
    )
}

export default Square;