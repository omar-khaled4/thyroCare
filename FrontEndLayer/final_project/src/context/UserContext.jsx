import { createContext, useEffect, useState } from "react";

export let UserContext = createContext();

export default function UserContextProvider(props){

    const [userToken , setuserToken] = useState(null)
    const [user , setuser] = useState(null)

    useEffect(()=>{
        if(localStorage.getItem("userToken")){
            setuserToken(localStorage.getItem("userToken") )
            setuser(JSON.parse(localStorage.getItem("user")) )
        }
    },[])

    return <UserContext.Provider value={ { userToken , setuserToken ,user , setuser } }>
        {props.children}
    </UserContext.Provider>
} 