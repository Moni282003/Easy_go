import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import "../global.css"
import { AuthContextprovider, UseAuth } from "../Context/UseAuth";


const MainLayout=()=>{
const {isAuth}=UseAuth();
const segment=useSegments();
const router=useRouter();

useEffect(()=>{
if(typeof isAuth=='undefined') return;
const inApp=segment[0]=='(app)'
if(isAuth && !inApp)
    {
        router.replace('home')
    }
    else if(isAuth==false){
         router.replace('signIn')
    }

},[isAuth])


return <Slot/>;
}

export default function RootLayout(){

    return(
        <AuthContextprovider>
            <MainLayout></MainLayout>
        </AuthContextprovider>
    )
}

 