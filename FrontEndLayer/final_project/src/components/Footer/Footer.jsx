import React from "react";
import style from "./Footer.module.css"
import { Link } from "react-router-dom";

export default function Footer(){
    return <>
        
    <div className="w-full">
        <div className="flex justify-center p-1.5">
            <Link to="" className="flex items-center space-x-3">
                <img src="/assets/photo_2026-01-26_21-40-13.jpg" className="h-9 md:h-11" />
                <span className="self-center text-xl font-1"><span className="color-1">T</span>hyro<span className="color-1">C</span>are</span>
            </Link>
        </div>    
    </div>
    <Link to="chat" className="text-white fixed flex items-center justify-center right-5 bottom-5 w-15 h-15 background-1 rounded-full font-2 text-4xl">AI</Link>

    </>
}