import React from "react";
import style from "./Layout.module.css"
import Navbar from './../Navbar/Navbar';
import Footer from './../Footer/Footer';
import { Outlet } from "react-router-dom";

export default function Layout(){
    return <>
    <div className="min-h-screen flex flex-col">
        <Navbar/>
        
        <div className="grow w-full">
            <Outlet/>
        </div>

        <Footer/>
    </div>
    </>
}