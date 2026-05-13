import React from "react";
import style from "./AboutUs.module.css"

export default function AboutUs(){
    return <>
        <div className="grid gap-8 md:grid-cols-12 mx-10 mt-35">
            <p className="md:col-span-5 flex items-center justify-center font-5 text-7xl">ThyroCare</p>
            <p className="md:col-span-7 color-2 font-5 text-[16px] text-center md:text-left">We are a team of six passionate students from the Faculty of Computers and Information who came together with one clear goal: to make life easier for people living with thyroid disorders. Through our academic journey, we realized how challenging it can be for thyroid patients to continuously monitor their condition, understand medical results, and stay committed to treatment plans. That realization inspired us to create a dedicated platform that focuses on patient care, continuous follow-up, and real support—not just numbers and reports.</p>
        </div>

        <div className="mx-10 mt-7">
            <p className="font-5 text-7xl text-center">About Us</p>
            <img src="src/assets/image-1.png" className="mt-7 w-full rounded-4xl" />
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-12 mx-10 mt-10 mb-35">
            <div className="md:col-span-2">
                <p className="font-5 text-[16px] color-2">Founded In</p>
                <p className="font-5 text-2xl font-medium">2026</p>
            </div>
            <div className="md:col-span-3 md:col-start-4">
                <p className="font-5 text-[16px] color-2">Location</p>
                <p className="font-5 text-xl font-medium">Computer & Artificial Intelligence</p>
                <p className="font-5 text-xl font-medium">Helwan University</p>
            </div>
            <p className="font-5 color-2 text-[16px] text-center col-span-2 md:col-span-5 md:col-start-8 md:text-left">Our website is designed to help thyroid patients track their test results over time, understand changes in their condition, and receive personalized guidance based on their health data. By combining technology with healthcare awareness, we aim to bridge the gap between medical information and everyday life, empowering patients to feel more confident and in control of their health journey.</p>
        </div>
    </>
}