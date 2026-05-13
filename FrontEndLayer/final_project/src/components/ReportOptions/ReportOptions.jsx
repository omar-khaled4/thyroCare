import React from "react";
import style from "./ReportOptions.module.css"
import { Link } from "react-router-dom";

export default function ReportOptions(){
    return <>
        <div className="background-DB flex items-center justify-center">

            <div className="flex flex-wrap w-[50%] md:w-[35%] gap-5">
                <Link to="insert_report" className="text-black text-2xl font-1 py-1 background-card rounded-full w-full text-center hover:scale-125 transition duration-400">Insert Report</Link>
                <Link to="view_report" className="text-black text-2xl font-1 py-1 background-card rounded-full w-full text-center hover:scale-125 transition duration-400">View Report</Link>
                <Link className="text-black text-2xl font-1 py-1 background-card rounded-full w-full text-center hover:scale-125 transition duration-400">Insert Photo/PDF</Link>
            </div>
        </div>
    </>
}