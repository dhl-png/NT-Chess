import styled from "styled-components";
import Square from "./Square";

function Row(props){
    let squares = [...Array(3).keys()].map(i => <Square onClick={props.onClick} row={props.value} col={i}/>)


    return(
        <Rank>
        </Rank>
        )
}

export default Row;