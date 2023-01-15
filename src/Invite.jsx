import styled from "styled-components"

function Invite({user}) {
    const Inv = styled.div`
        display: flex;
        flex-direction: column;
        align-content: flex-end;
        align-self: flex-end;
        border: 0.2em solid black;
        margin: 5vw;
    `
    const Button = styled.button`
        justify-self:flex-end;
        cursor: pointer;
        font-weight: 600;
        border:none;
        border-top: 0.2em solid black;
        width:100%;
        background:white;
        padding:1em;
        &:nth-child(even){
            background:black;
            color:white;
        }
    `
    const Message = styled.div`
        padding: 1em;
    `

    const ButtonContainer = styled.div`
        display:flex;
        margin-top: 10%;
        justify-content:space-between;
    `
    
    return (
        <Inv> 
            
            <Message> You have been invited to play by DHL-PNG </Message>
            <ButtonContainer>
                <Button>Accept</Button>
                <Button>Decline</Button>
            </ButtonContainer> 
        </Inv>
    ) 
}

export default Invite