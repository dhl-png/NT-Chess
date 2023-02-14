import { async } from "@firebase/util";
import { useEffect, useState } from "react"
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

function Friends(){
    const [friends, setFriends] = useState();
    const location = useLocation().pathname;

    useEffect(() => {
        async function fetchFriends(){
            const uri = "http://nt-chess-db-production.up.railway.app:80"+location
            const res = await fetch(uri);
            const data = res.json()
            setFriends(await data);
        }
        fetchFriends();
    },[])

    const friendsList = () =>{
        if(friends == null) return 
        return friends.map(friend => {
            return (
                <div>
                <Link to={"/user/"+friend.Id}>{friend.Username}</Link>
                </div>
            )
        })
    }

    return(
        <>
            <h1>Friends</h1>
            <ul>
                {friendsList()}
            </ul>
        </>
    )
}

export default Friends