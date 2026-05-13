import React, { useContext } from "react";
import style from "./Home.module.css"
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function Home(){

    let { userToken , setuserToken , user , setuser } = useContext(UserContext)

    return <>

        <div className=" bg-[url(assets/home-background.png)] h-screen bg-cover bg-position-[79%_40%]">
            <div className="relative top-25 px-4 w-full md:w-140 md:mx-10 md:px-0 md:top-40">
                <p className="font-3 color-2 text-2xl line-1">INSPIRING BETTER THYROID HEALTH</p>
                <p className="color-1 font-4 font-extrabold! mt-7 text-4xl md:text-6xl">Healthy thyroid,</p>
                <p className="color-3 font-4 mt-4 text-4xl md:text-6xl">healthy life</p>
                <p className="color-2 font-3 font-light! text-xl mt-4 md:w-110">Empowering thyroid care through trusted medical insights and smart digital solutions. Continuously supporting awareness, early detection, and effective management through integrated healthcare services.</p>
                { userToken == null && user == null ?
                    <div className="flex space-x-3 mt-4">
                        <Link to="login" className="text-white text-lg  px-7 py-1 background-1 rounded-full">Log in</Link>
                        <Link to="signup" className="text-white text-lg px-7 py-1 background-2 rounded-full">Sign up</Link>
                    </div>:null
                }
            </div>
        </div>

        <div className="bg-white mx-10">
            <p className="font-1 text-6xl text-center text-black line-2 mt-13">Features</p>

            <div className="my-15 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

                <div className="bg-gray-100 border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="relative">
                        <img src="src/assets/shutterstock_159016388-640x480.jpg" alt="Feature Image" className="w-full h-full object-contain"/>
                        <div className="absolute hov left-4 -bottom-6 w-12 h-12 flex items-center justify-center rounded-full shadow-md ">
                            <i className="fa-solid fa-plus text-2xl "></i>
                        </div>
                    </div>
                    <div className="px-3 py-8 text-center">
                        <h3 className="font-1 text-2xl color-2"> Continuous Follow-Up </h3>
                        <p className="mt-3 font-4 color-2 text-sm leading-6"> The platform provides ongoing monitoring of the patient's condition by tracking symptoms, test results, and health changes over time. This helps in early detection of issues and ensures long-term stability. </p>
                    </div>
                </div>

                <div className="bg-gray-100 border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="relative">
                        <img src="src/assets/shutterstock_157746134-640x480.jpg" alt="Feature Image" className="w-full h-full object-contain"/>
                        <div className="absolute hov left-4 -bottom-6 w-12 h-12 flex items-center justify-center rounded-full shadow-md ">
                            <i className="fa-solid fa-plus text-2xl "></i>
                        </div>
                    </div>
                    <div className="px-3 py-8 text-center">
                        <h3 className="font-1 text-2xl color-2"> Medication Schedule Management </h3>
                        <p className="mt-3 font-4 color-2 text-sm leading-6"> The website helps patients stay consistent with their medication through clear dosing schedules and smart reminders. This improves treatment effectiveness and reduces missed or incorrect doses. </p>
                    </div>
                </div>

                <div className="bg-gray-100 border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="relative">
                        <img src="src/assets/photo_2026-01-26_22-30-21.jpg" alt="Feature Image" className="w-full h-full object-contain"/>
                        <div className="absolute hov left-4 -bottom-6 w-12 h-12 flex items-center justify-center rounded-full shadow-md ">
                            <i className="fa-solid fa-plus text-2xl "></i>
                        </div>
                    </div>
                    <div className="px-3 py-8 text-center">
                        <h3 className="font-1 text-2xl color-2"> Patient-Centered Care </h3>
                        <p className="mt-3 font-4 color-2 text-sm leading-6"> The platform is designed with the patient as the priority, offering clear medical information, continuous support, and an easy-to-use experience that builds trust and improves overall quality of life. </p>
                    </div>
                </div>

            </div>
        </div>

        <div className="relative bg-[url(src/assets/bgn-team-members.jpg)] h-screen bg-cover bg-right md:bg-left text-center md:text-left">
            <div className="absolute px-10 w-full top-20 md:w-[60%] md:top-40 md:right-0">
                <p className="font-3 color-2 text-2xl line-1">INTRODUCING OUR TEAM</p>
                <p className="color-1 font-4 font-extrabold! mt-7 text-4xl md:text-6xl">Great passion</p>
                <p className="color-3 font-4 mt-4 text-4xl md:text-6xl">for healing</p>
                <p className="color-2 font-3 font-light! text-xl mt-4">Some up and coming trends are healthcare consolidation for independent healthcare centers that see a cut in unforeseen payouts. High deductible health plans are also expected to transpire along with a growth of independent practices.</p>
                <div className="flex space-x-3 mt-10 absolute right-0 mr-10 items-center">
                    <div className="mr-5">
                        <p className="color-1 font-4 text-xl! font-bold!">CHASE FRANKLIN</p>
                        <p className=" font-4 text-[15px] text-right">Fonder & CEO</p>
                    </div>
                    <img src="src/assets/img-cardiology-signature.png" className="w-20 h-20 object-contain"/>
                </div>
            </div>
        </div>

        <div className="bg-white mx-10">
            <p className="font-1 text-6xl text-center text-black line-2 mt-13">Services At One Glance</p>
            <div className="my-15 grid gap-7 md:grid-cols-12">
                <div className="md:col-span-7">
                    <p className="font-4 font-light! color-3 text-5xl ">How can we</p>
                    <p className="font-4 font-extrabold! color-1 text-5xl mt-4">Help you?</p>
                    <p className="font-1 text-md leading-7 font-light! mt-4">Our platform helps you easily track and monitor your thyroid test results over time, giving you a clear view of your health progress. Based on your condition and results, we provide personalized guidance to support better thyroid management. In addition, our built-in chatbot is always available to answer your questions, explain your condition, and help you understand your treatment anytime you need.</p>
                </div>
                <div className="flex items-center md:col-span-5">
                    <img src="src/assets/premium_photo-1661779717978-d7937fa08250.avif" className="w-full rounded-[60px] object-contain"/>
                </div>                
            </div>
        </div>

        <div className="bg-[#f4fcff] py-15">
            <div className="mx-10 grid gap-4 md:grid-cols-12 md:grid-rows-2">
                <div className="relative md:row-span-2 md:col-span-8">
                    <img src="src/assets/photo_3_2026-01-26_21-57-15.jpg" className="rounded-[50px] w-full"/>
                    <div className="absolute top-0">
                        <p className="font-1 text-2xl sm:text-5xl bg-[#f4fcff] rounded-r-[50px] pb-2 pr-5">Data analysis at the</p>
                        <p className="font-1 text-2xl sm:text-5xl bg-[#f4fcff] rounded-r-[50px] pb-2 pr-5 inline">highest level</p>
                    </div>
                </div>
                <div className="relative md:col-span-4">
                    <img src="src/assets/photo_2026-01-26_22-08-52.jpg" className="rounded-[50px] w-full"/>
                    <div className="absolute top-1/2 -translate-y-1/2 left-3">
                        <p className="font-1 color-2 text-4xl pb-2">The best</p>
                        <p className="font-1 color-2 text-4xl">Team</p>
                    </div>
                </div>
                <div className="relative md:col-span-4">
                    <img src="src/assets/photo_2_2026-01-26_21-57-15.jpg" className="rounded-[50px] w-full"/>
                    <div className="absolute top-1/2 -translate-y-1/2 right-3">
                        <p className="font-1 text-white text-4xl pb-2 text-center">99.98%</p>
                        <p className="font-1 text-white text-4xl">Accuracy</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white mx-10">
            <p className="font-1 text-6xl text-center text-black line-2 mt-13">Our Team</p>

            <div className="my-15 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                <div className="bg-gray-100 border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="relative">
                        <img src="src/assets/img-team-member-01.jpg" alt="Feature Image" className="w-full h-full object-contain"/>
                        <div className="absolute hov left-1/2 -translate-x-1/2 -bottom-6 w-12 h-12 flex items-center justify-center rounded-full shadow-md ">
                            <i className="fa-solid fa-plus text-2xl "></i>
                        </div>
                    </div>
                    <div className="px-3 py-8 text-center">
                        <p className="font-3 color-2 text-[16px] my-3 line-2">FOUNDER / CHIEF SURGEON</p>
                        <h3 className="font-4 text-xl color-3 mt-7"> Chase Franklin </h3>
                        <p className="mt-3 mb-10 font-3 color-2 text-md md:h-25"> Podcasting operational change management inside of workflows to establish a framework.</p>
                        <p className="bg-white font-4 text-[15px] inline px-4 py-2 rounded-full border-2 border-gray-200 cursor-pointer">FIND OUT MORE</p>
                    </div>
                </div>

                <div className="bg-gray-100 border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="relative">
                        <img src="src/assets/img-team-member-02.jpg" alt="Feature Image" className="w-full h-full object-contain"/>
                        <div className="absolute hov left-1/2 -translate-x-1/2 -bottom-6 w-12 h-12 flex items-center justify-center rounded-full shadow-md ">
                            <i className="fa-solid fa-plus text-2xl "></i>
                        </div>
                    </div>
                    <div className="px-3 py-8 text-center">
                        <p className="font-3 color-2 text-[16px] my-3 line-2">ASSISTANT SURGEON</p>
                        <h3 className="font-4 text-xl color-3 mt-7">Anna Wilson</h3>
                        <p className="mt-3 mb-10 font-3 color-2 text-md md:h-25">Quickly disseminate superior deliverables whereas web-enabled applications. Quickly drive clicks-and-mortar catalysts.</p>
                        <p className="bg-white font-4 text-[15px] inline px-4 py-2 rounded-full border-2 border-gray-200 cursor-pointer">FIND OUT MORE</p>
                    </div>
                </div>

                <div className="bg-gray-100 border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="relative">
                        <img src="src/assets/img-team-member-03.jpg" alt="Feature Image" className="w-full h-full object-contain"/>
                        <div className="absolute hov left-1/2 -translate-x-1/2 -bottom-6 w-12 h-12 flex items-center justify-center rounded-full shadow-md ">
                            <i className="fa-solid fa-plus text-2xl "></i>
                        </div>
                    </div>
                    <div className="px-3 py-8 text-center">
                        <p className="font-3 color-2 text-[16px] my-3 line-2">LEAD NURSE</p>
                        <h3 className="font-4 text-xl color-3 mt-7"> Peggie Cannon </h3>
                        <p className="mt-3 mb-10 font-3 color-2 text-md md:h-25"> Seamlessly visualize quality intellectual capital without superior collaboration and installed base portals.</p>
                        <p className="bg-white font-4 text-[15px] inline px-4 py-2 rounded-full border-2 border-gray-200 cursor-pointer">FIND OUT MORE</p>
                    </div>
                </div>

                <div className="bg-gray-100 border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="relative">
                        <img src="src/assets/img-team-member-04.jpg" alt="Feature Image" className="w-full h-full object-contain"/>
                        <div className="absolute hov left-1/2 -translate-x-1/2 -bottom-6 w-12 h-12 flex items-center justify-center rounded-full shadow-md ">
                            <i className="fa-solid fa-plus text-2xl "></i>
                        </div>
                    </div>
                    <div className="px-3 py-8 text-center">
                        <p className="font-3 color-2 text-[16px] my-3 line-2">NURSE</p>
                        <h3 className="font-4 text-xl color-3 mt-7"> Hubert Jackson</h3>
                        <p className="mt-3 mb-10 font-3 color-2 text-md md:h-25"> Energistically scale future-proof core competencies vis-a-vis impactful experiences with optimal networks.</p>
                        <p className="bg-white font-4 text-[15px] inline px-4 py-2 rounded-full border-2 border-gray-200 cursor-pointer">FIND OUT MORE</p>
                    </div>
                </div>

            </div>
        </div>

        <div className="relative bg-[url(src/assets/bgn-newsletter-subscribe.jpg)] h-screen bg-cover bg-right text-center md:text-left">
            <div className="md:hidden absolute inset-0 bg-[#000000]/60"></div>
            <div className="absolute px-10 w-full md:w-[60%] top-40 md:left-0">
                <p className="font-3 text-white md:text-[#444444] text-2xl line-1">GET THE NOTIFICATION</p>
                <p className="text-white md:text-[#222222] font-4 mt-7 text-4xl md:text-6xl">We have some</p>                
                <p className="color-1 font-4 font-extrabold! mt-4 text-4xl md:text-6xl">Good news</p>
                <p className="text-white md:text-[#444444] font-3 font-light! text-xl mt-4">Sign up for Medicare newsletter to receive all the new offers and discounts from Medicare clinic. Discounts are only valid four our newsletter subscribers.</p>
                <p className="mt-8 font-3 tracking-[5%] text-[15px] inline-block bg-gray-100  border-2 border-gray-200 px-15 py-3 rounded-full">Type in your email address</p>
                <p className="mt-3 font-3 text-[15px] font-semibold! text-white background-1 tracking-[5%] px-5 py-3 rounded-full inline-block ml-2">SUBSCRIBE</p>
            </div>
        </div>

    </>
}