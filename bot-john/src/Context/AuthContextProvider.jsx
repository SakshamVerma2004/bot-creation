import { createContext, useState } from "react";

export let AuthContext=createContext();
let AuthContextProvider=({children})=>{
    let [isLogin,setIsLogin]=useState(false);
    let [name,setName]=useState("");
    let obj={name,setName,isLogin,setIsLogin};
    return <AuthContext.Provider value={obj}>{children}</AuthContext.Provider>
}

export default AuthContextProvider;