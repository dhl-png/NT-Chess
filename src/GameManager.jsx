import { useParams } from "react-router";
import Game from "./Game";

export default function GameManager(){
    const {id} = useParams()
    return(
        <Game key={id} id = {id}/>
    )
}
