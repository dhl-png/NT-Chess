import React from "react";

function StartButton(props){
    return (
        <div>
            <button value="deez" className="button" onClick={props.onClick}> {props.name} </button> 

        </div>
    )
}

export default StartButton;