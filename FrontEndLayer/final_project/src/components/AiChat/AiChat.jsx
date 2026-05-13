import React, { useEffect, useRef, useState } from "react";
import style from "./AiChat.module.css"

export default function AiChat(){

    // scroll button
    const chatRef = useRef(null);
    const [showScrollBtn, setShowScrollBtn] = useState(false);

    const handleScroll = () => {
        const element = chatRef.current;
        const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 100;
        setShowScrollBtn(!isNearBottom);
    };

    const scrollToBottom = () => {
        chatRef.current.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth",
        });
    };

    // scroll when open the page
    useEffect(() => {
        scrollToBottom();
    }, []);



    return <>
        <div className="background-DB flex items-center justify-center p-5 mt-0 font-1">
            <div className="background-card bg-white! w-130 h-[70vh] flex flex-col relative shadow-[6px_6px_25px_rgba(0,0,0,0.25)]!">

                <div className="z-10 sticky top-0 left-0 right-0 bg-[#f1f1f1] border-b border-gray-400 flex justify-between px-5 py-2 items-center rounded-t-[22px]">
                    <div className="flex justify-between items-center">
                        <img src="/src/assets/AI-girl.png" className="h-12 rounded-full" />
                        <div className="ml-3">
                            <p className="text-2xl">Aiva</p>
                            <p className="color-1 text-sm">Your Artificial Intelligence Virtual Assistant for thyroid health</p>
                        </div>
                    </div>
                    <span onClick={()=>Delete()} className="cursor-pointer text-2xl text-red-600"><i className="fa-solid fa-trash-can"></i></span>
                </div>

                <div ref={chatRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-3 py-4 ">

                    <div className="flex justify-start mb-3">
                        <div className="bg-[#f1f1f1] p-2 w-[75%] rounded-[15px] rounded-bl-none">
                            <p>Hello! I'm Aiva , your thyroid health assistant. How can I help you today?</p>
                        </div>
                    </div>

                    <div className="flex justify-end mb-3">
                        <div className="background-1 text-white p-2 w-[75%] rounded-[15px] rounded-br-none">
                            <p>What are normal TSH levels?</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-start mb-3">
                        <div className="bg-[#f1f1f1] p-2 w-[75%] rounded-[15px] rounded-bl-none">
                            <p>Normal TSH levels typically range between 0.4 and 4.0 mIU/L. However, optimal levels may vary depending on individual factors. For most people with treated hypothyroidism, a TSH between 0.5-2.5 mIU/L is often considered ideal.</p>
                        </div>
                    </div>












<div className="flex justify-end mb-3">
                        <div className="background-1 text-white p-2 w-[75%] rounded-[15px] rounded-br-none">
                            <p>What are normal TSH levels?</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-start mb-3">
                        <div className="bg-[#f1f1f1] p-2 w-[75%] rounded-[15px] rounded-bl-none">
                            <p>Normal TSH levels typically range between 0.4 and 4.0 mIU/L. However, optimal levels may vary depending on individual factors. For most people with treated hypothyroidism, a TSH between 0.5-2.5 mIU/L is often considered ideal.</p>
                        </div>
                    </div>
                    <div className="flex justify-end mb-3">
                        <div className="background-1 text-white p-2 w-[75%] rounded-[15px] rounded-br-none">
                            <p>What are normal TSH levels?</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-start mb-3">
                        <div className="bg-[#f1f1f1] p-2 w-[75%] rounded-[15px] rounded-bl-none">
                            <p>Normal TSH levels typically range between 0.4 and 4.0 mIU/L. However, optimal levels may vary depending on individual factors. For most people with treated hypothyroidism, a TSH between 0.5-2.5 mIU/L is often considered ideal.</p>
                        </div>
                    </div>
                    <div className="flex justify-end mb-3">
                        <div className="background-1 text-white p-2 w-[75%] rounded-[15px] rounded-br-none">
                            <p>What are normal TSH levels?</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-start mb-3">
                        <div className="bg-[#f1f1f1] p-2 w-[75%] rounded-[15px] rounded-bl-none">
                            <p>Normal TSH levels typically range between 0.4 and 4.0 mIU/L. However, optimal levels may vary depending on individual factors. For most people with treated hypothyroidism, a TSH between 0.5-2.5 mIU/L is often considered ideal.</p>
                        </div>
                    </div>
                    <div className="flex justify-end mb-3">
                        <div className="background-1 text-white p-2 w-[75%] rounded-[15px] rounded-br-none">
                            <p>What are normal TSH levels?</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-start mb-3">
                        <div className="bg-[#f1f1f1] p-2 w-[75%] rounded-[15px] rounded-bl-none">
                            <p>Normal TSH levels typically range between 0.4 and 4.0 mIU/L. However, optimal levels may vary depending on individual factors. For most people with treated hypothyroidism, a TSH between 0.5-2.5 mIU/L is often considered ideal.</p>
                        </div>
                    </div>
                    <div className="flex justify-end mb-3">
                        <div className="background-1 text-white p-2 w-[75%] rounded-[15px] rounded-br-none">
                            <p>What are normal TSH levels?</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-start mb-3">
                        <div className="bg-[#f1f1f1] p-2 w-[75%] rounded-[15px] rounded-bl-none">
                            <p>Normal TSH levels typically range between 0.4 and 4.0 mIU/L. However, optimal levels may vary depending on individual factors. For most people with treated hypothyroidism, a TSH between 0.5-2.5 mIU/L is often considered ideal.</p>
                        </div>
                    </div>
                    <div className="flex justify-end mb-3">
                        <div className="background-1 text-white p-2 w-[75%] rounded-[15px] rounded-br-none">
                            <p>What are normal TSH levels?</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-start mb-3">
                        <div className="bg-[#f1f1f1] p-2 w-[75%] rounded-[15px] rounded-bl-none">
                            <p>Normal TSH levels typically range between 0.4 and 4.0 mIU/L. However, optimal levels may vary depending on individual factors. For most people with treated hypothyroidism, a TSH between 0.5-2.5 mIU/L is often considered ideal.</p>
                        </div>
                    </div>
                    <div className="flex justify-end mb-3">
                        <div className="background-1 text-white p-2 w-[75%] rounded-[15px] rounded-br-none">
                            <p>What are normal TSH levels?</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-start mb-3">
                        <div className="bg-[#f1f1f1] p-2 w-[75%] rounded-[15px] rounded-bl-none">
                            <p>Normal TSH levels typically range between 0.4 and 4.0 mIU/L. However, optimal levels may vary depending on individual factors. For most people with treated hypothyroidism, a TSH between 0.5-2.5 mIU/L is often considered ideal.</p>
                        </div>
                    </div>


















                    {showScrollBtn && (
                        <button onClick={scrollToBottom} className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#00B3A1] text-white w-10 h-10 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition text-xl cursor-pointer">
                            <i className="fa-solid fa-arrow-down"></i>
                        </button>
                    )}

                </div>

                <div className="z-10 flex justify-between px-3 py-2">
                    <input type="text" className=" w-full p-1 text-sm border border-gray-400 rounded-[10px] h-10 bg-[#00000000] text-gray-400" placeholder="Type your question here ..." required />
                    <span className="background-1 text-white h-10 w-10 rounded-[10px] flex items-center justify-center text-xl ml-2 cursor-pointer"><i class="fa-solid fa-paper-plane"></i></span>
                </div>

            </div>
        </div>
    </>
}