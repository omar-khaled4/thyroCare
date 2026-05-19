import React from "react";
import style from "./NotFound.module.css"
import { Link } from "react-router-dom";

export default function NotFound(){
    return <>
        <div className="mt-35 grid grid-cols-4 gap-4 gap-y-8 mx-10 md:grid-cols-12 items-center">
            <img src="/assets/error-photo.png" className="w-full col-start-2 col-span-2 md:col-span-3 md:col-start-2"/>
            <div className="col-span-4 md:col-end-12 md:col-span-5">
                <p className="font-1 text-center text-3xl">We are sorry , page not found</p>
                <p className="font-1 text-center text-7xl color-1 mt-4">Error 404</p>
                <Link to={"/"} className="bg-[#282828] font-1 text-2xl block w-fit mx-auto mt-14 px-8 py-1 rounded-full text-white">Home</Link>
            </div>
        </div>
    </>
}