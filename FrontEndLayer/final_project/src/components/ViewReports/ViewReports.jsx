import React, { useState } from "react";
import style from "./ViewReports.module.css"
import { useFormik } from "formik";

export default function ViewReports(){

    const data = [
        { "id" : 1  , "date" : "2026-03-10" , "TestingFacility" : "Cairo Medical Center"         ,"TSH" : 2.4 , "FreeT4" : 1.1 , "FreeT3" : 3.0 , "TotalT4" : 8.2 , "TPOAntibodies" : 32 , "ThyroglobulinAntibodies" : 18 ,"TSHReceptorAntibodies": 1.4,"Thyroglobulin": 11,"Calcitonin": 4.2,"ReverseT3": 17,"Fatigue": 5,"WeightChanges": 4,"TemperatureSensitivity": 7,"MoodChanges": 5,"HairSkinChanges": 3},
        { "id" : 2  , "date" : "2026-02-23" , "TestingFacility" : "El Salam Hospital"            ,"TSH" : 3.8 , "FreeT4" : 0.9 , "FreeT3" : 2.7 , "TotalT4" : 7.5 , "TPOAntibodies" : 55 , "ThyroglobulinAntibodies" : 30 ,"TSHReceptorAntibodies": 1.9,"Thyroglobulin": 14,"Calcitonin": 5.0,"ReverseT3": 20,"Fatigue": 7,"WeightChanges": 6,"TemperatureSensitivity": 8,"MoodChanges": 6,"HairSkinChanges": 5},
        { "id" : 3  , "date" : "2026-02-15" , "TestingFacility" : "Ain Shams University Hospital","TSH" : 1.8 , "FreeT4" : 1.3 , "FreeT3" : 3.2 , "TotalT4" : 8.8 , "TPOAntibodies" : 22 , "ThyroglobulinAntibodies" : 12 ,"TSHReceptorAntibodies": 1.1,"Thyroglobulin": 10,"Calcitonin": 3.6,"ReverseT3": 16,"Fatigue": 4,"WeightChanges": 3,"TemperatureSensitivity": 5,"MoodChanges": 4,"HairSkinChanges": 3},
        { "id" : 4  , "date" : "2026-01-02" , "TestingFacility" : "Al Mokhtabar Lab"             ,"TSH" : 4.2 , "FreeT4" : 0.8 , "FreeT3" : 2.5 , "TotalT4" : 7.0 , "TPOAntibodies" : 70 , "ThyroglobulinAntibodies" : 40 ,"TSHReceptorAntibodies": 2.3,"Thyroglobulin": 16,"Calcitonin": 5.4,"ReverseT3": 22,"Fatigue": 9,"WeightChanges": 7,"TemperatureSensitivity": 9,"MoodChanges": 7,"HairSkinChanges": 6},
        { "id" : 5  , "date" : "2026-01-07" , "TestingFacility" : "Cleopatra Hospital"           ,"TSH" : 2.0 , "FreeT4" : 1.2 , "FreeT3" : 3.1 , "TotalT4" : 8.5 , "TPOAntibodies" : 28 , "ThyroglobulinAntibodies" : 15 ,"TSHReceptorAntibodies": 1.3,"Thyroglobulin": 12,"Calcitonin": 4.1,"ReverseT3": 18,"Fatigue": 5,"WeightChanges": 4,"TemperatureSensitivity": 6,"MoodChanges": 4,"HairSkinChanges": 4},
        { "id" : 6  , "date" : "2026-01-28" , "TestingFacility" : "Kasr Al Ainy Hospital"        ,"TSH" : 5.0 , "FreeT4" : 0.7 , "FreeT3" : 2.3 , "TotalT4" : 6.8 , "TPOAntibodies" : 90 , "ThyroglobulinAntibodies" : 50 ,"TSHReceptorAntibodies": 2.8,"Thyroglobulin": 18,"Calcitonin": 6.2,"ReverseT3": 24,"Fatigue": 1,"WeightChanges": 8,"TemperatureSensitivity": 4,"MoodChanges": 8,"HairSkinChanges": 7},
        { "id" : 7  , "date" : "2025-12-14" , "TestingFacility" : "Cairo Lab"                    ,"TSH" : 1.5 , "FreeT4" : 1.4 , "FreeT3" : 3.5 , "TotalT4" : 9.1 , "TPOAntibodies" : 18 , "ThyroglobulinAntibodies" : 9  ,"TSHReceptorAntibodies": 1.0,"Thyroglobulin": 8 ,"Calcitonin": 3.2,"ReverseT3": 15,"Fatigue": 2,"WeightChanges": 2,"TemperatureSensitivity": 3,"MoodChanges": 2,"HairSkinChanges": 2},
        { "id" : 8  , "date" : "2025-12-19" , "TestingFacility" : "El Borg Lab"                  ,"TSH" : 2.9 , "FreeT4" : 1.0 , "FreeT3" : 2.9 , "TotalT4" : 8.0 , "TPOAntibodies" : 40 , "ThyroglobulinAntibodies" : 20 ,"TSHReceptorAntibodies": 1.6,"Thyroglobulin": 13,"Calcitonin": 4.5,"ReverseT3": 19,"Fatigue": 6,"WeightChanges": 5,"TemperatureSensitivity": 6,"MoodChanges": 5,"HairSkinChanges": 4},
        { "id" : 9  , "date" : "2025-12-06" , "TestingFacility" : "International Hospital"       ,"TSH" : 3.1 , "FreeT4" : 1.1 , "FreeT3" : 3.0 , "TotalT4" : 8.3 , "TPOAntibodies" : 35 , "ThyroglobulinAntibodies" : 22 ,"TSHReceptorAntibodies": 1.5,"Thyroglobulin": 12,"Calcitonin": 4.0,"ReverseT3": 18,"Fatigue": 5,"WeightChanges": 4,"TemperatureSensitivity": 6,"MoodChanges": 5,"HairSkinChanges": 3},
        { "id" : 10 , "date" : "2025-11-30" , "TestingFacility" : "Al Shorouk Hospital"          ,"TSH" : 4.5 , "FreeT4" : 0.9 , "FreeT3" : 2.6 , "TotalT4" : 7.4 , "TPOAntibodies" : 65 , "ThyroglobulinAntibodies" : 38 ,"TSHReceptorAntibodies": 2.1,"Thyroglobulin": 15,"Calcitonin": 5.1,"ReverseT3": 21,"Fatigue": 8,"WeightChanges": 7,"TemperatureSensitivity": 8,"MoodChanges": 6,"HairSkinChanges": 6},
        { "id" : 11 , "date" : "2025-11-21" , "TestingFacility" : "Dar Al Fouad Hospital"        ,"TSH" : 2.2 , "FreeT4" : 1.2 , "FreeT3" : 3.2 , "TotalT4" : 8.7 , "TPOAntibodies" : 26 , "ThyroglobulinAntibodies" : 14 ,"TSHReceptorAntibodies": 1.2,"Thyroglobulin": 10,"Calcitonin": 3.8,"ReverseT3": 17,"Fatigue": 4,"WeightChanges": 3,"TemperatureSensitivity": 5,"MoodChanges": 4,"HairSkinChanges": 3},
        { "id" : 12 , "date" : "2025-11-14" , "TestingFacility" : "Al Hayat Lab"                 ,"TSH" : 3.6 , "FreeT4" : 1.0 , "FreeT3" : 2.8 , "TotalT4" : 7.9 , "TPOAntibodies" : 48 , "ThyroglobulinAntibodies" : 27 ,"TSHReceptorAntibodies": 1.8,"Thyroglobulin": 13,"Calcitonin": 4.6,"ReverseT3": 20,"Fatigue": 6,"WeightChanges": 5,"TemperatureSensitivity": 7,"MoodChanges": 5,"HairSkinChanges": 5},
        { "id" : 13 , "date" : "2025-10-03" , "TestingFacility" : "City Lab"                     ,"TSH" : 1.9 , "FreeT4" : 1.3 , "FreeT3" : 3.3 , "TotalT4" : 9.0 , "TPOAntibodies" : 21 , "ThyroglobulinAntibodies" : 11 ,"TSHReceptorAntibodies": 1.1,"Thyroglobulin": 9 ,"Calcitonin": 3.4,"ReverseT3": 16,"Fatigue": 3,"WeightChanges": 3,"TemperatureSensitivity": 4,"MoodChanges": 3,"HairSkinChanges": 2},
        { "id" : 14 , "date" : "2025-10-09" , "TestingFacility" : "El Galaa Hospital"            ,"TSH" : 4.0 , "FreeT4" : 0.9 , "FreeT3" : 2.6 , "TotalT4" : 7.2 , "TPOAntibodies" : 72 , "ThyroglobulinAntibodies" : 41 ,"TSHReceptorAntibodies": 2.2,"Thyroglobulin": 16,"Calcitonin": 5.5,"ReverseT3": 22,"Fatigue": 9,"WeightChanges": 7,"TemperatureSensitivity": 9,"MoodChanges": 7,"HairSkinChanges": 6},
        { "id" : 15 , "date" : "2025-10-22" , "TestingFacility" : "Green Lab"                    ,"TSH" : 2.5 , "FreeT4" : 1.1 , "FreeT3" : 3.0 , "TotalT4" : 8.1 , "TPOAntibodies" : 33 , "ThyroglobulinAntibodies" : 17 ,"TSHReceptorAntibodies": 1.4,"Thyroglobulin": 11,"Calcitonin": 4.3,"ReverseT3": 18,"Fatigue": 5,"WeightChanges": 4,"TemperatureSensitivity": 6,"MoodChanges": 4,"HairSkinChanges": 4},
        { "id" : 16 , "date" : "2025-09-26" , "TestingFacility" : "Future Lab"                   ,"TSH" : 3.3 , "FreeT4" : 1.0 , "FreeT3" : 2.9 , "TotalT4" : 7.8 , "TPOAntibodies" : 44 , "ThyroglobulinAntibodies" : 24 ,"TSHReceptorAntibodies": 1.7,"Thyroglobulin": 13,"Calcitonin": 4.8,"ReverseT3": 19,"Fatigue": 6,"WeightChanges": 5,"TemperatureSensitivity": 6,"MoodChanges": 5,"HairSkinChanges": 4},
        { "id" : 17 , "date" : "2025-09-18" , "TestingFacility" : "Al Amal Hospital"             ,"TSH" : 2.1 , "FreeT4" : 1.2 , "FreeT3" : 3.2 , "TotalT4" : 8.6 , "TPOAntibodies" : 25 , "ThyroglobulinAntibodies" : 13 ,"TSHReceptorAntibodies": 1.2,"Thyroglobulin": 10,"Calcitonin": 3.7,"ReverseT3": 17,"Fatigue": 4,"WeightChanges": 3,"TemperatureSensitivity": 5,"MoodChanges": 4,"HairSkinChanges": 3},
        { "id" : 18 , "date" : "2025-09-08" , "TestingFacility" : "Care Lab"                     ,"TSH" : 4.7 , "FreeT4" : 0.8 , "FreeT3" : 2.4 , "TotalT4" : 7.1 , "TPOAntibodies" : 80 , "ThyroglobulinAntibodies" : 45 ,"TSHReceptorAntibodies": 2.5,"Thyroglobulin": 17,"Calcitonin": 5.9,"ReverseT3": 23,"Fatigue": 9,"WeightChanges": 8,"TemperatureSensitivity": 9,"MoodChanges": 7,"HairSkinChanges": 7},
        { "id" : 19 , "date" : "2025-08-11" , "TestingFacility" : "Elite Hospital"               ,"TSH" : 1.7 , "FreeT4" : 1.3 , "FreeT3" : 3.4 , "TotalT4" : 9.2 , "TPOAntibodies" : 19 , "ThyroglobulinAntibodies" : 9  ,"TSHReceptorAntibodies": 1.0,"Thyroglobulin": 8 ,"Calcitonin": 3.3,"ReverseT3": 15,"Fatigue": 2,"WeightChanges": 2,"TemperatureSensitivity": 3,"MoodChanges": 2,"HairSkinChanges": 2},
        { "id" : 20 , "date" : "2025-08-08" , "TestingFacility" : "Royal Lab"                    ,"TSH" : 3.0 , "FreeT4" : 1.0 , "FreeT3" : 2.9 , "TotalT4" : 8.0 , "TPOAntibodies" : 38 , "ThyroglobulinAntibodies" : 21 ,"TSHReceptorAntibodies": 1.6,"Thyroglobulin": 12,"Calcitonin": 4.4,"ReverseT3": 19,"Fatigue": 5,"WeightChanges": 4,"TemperatureSensitivity": 6,"MoodChanges": 5,"HairSkinChanges": 4}
    ]

    let[Loading, setLoading] = useState(false)
    let[viewData,setviewData] = useState(data)
    let[ report , setreport ]=useState(null)

    //search
    let[inputValue , setinputValue ]=useState('')
    let change = (event) =>{
        setinputValue(event.target.value)
        search(event.target.value);
    }
    function clear() { 
        setinputValue('')
        setviewData(data)
    }

    function search(value){
        var arr = []
        if( data.length > 0 ){
            for(var x = 0 ; x < data.length ; x++ ){
                if(data[x].TestingFacility.toLocaleLowerCase().includes(value.toLocaleLowerCase()) || data[x].date.includes(value) )
                {
                    arr.push(data[x])
                }
            }
        }
        setviewData(arr)
    }

    //view
    let[_show , set_show]=useState(false)
    let show =(report)=>{
        setreport(report)
        set_show(prev => !prev)
    }

    //update
    let[_update , set_update]=useState(false)
    let update =(report)=>{
        setreport(report)
        set_update(prev => !prev)
    }

    let formik = useFormik({
            initialValues :{
                id:report?.id,
                DateOfTest:report?.date,
                TestingFacility :report?.TestingFacility,
                TSH:report?.TSH,
                FreeT4:report?.FreeT4,
                FreeT3:report?.FreeT3,
                TotalT4:report?.TotalT4,
                TPOAntibodies:report?.TPOAntibodies,
                ThyroglobulinAntibodies:report?.ThyroglobulinAntibodies,
                TSHReceptorAntibodies:report?.TSHReceptorAntibodies,
                Thyroglobulin:report?.Thyroglobulin,
                Calcitonin:report?.Calcitonin,
                ReverseT3:report?.ReverseT3,
                Fatigue:report?.Fatigue,
                WeightChanges:report?.WeightChanges,
                TemperatureSensitivity:report?.TemperatureSensitivity,
                MoodChanges:report?.MoodChanges,
                SkinChanges:report?.HairSkinChanges,
            },
            enableReinitialize: true,
        })


    return <>

        {_update?<>

            <div className="fixed top-0 right-0 left-0 bottom-0 bg-black opacity-50 z-10"></div>
            <div className="fixed top-0 left-0 z-10 h-screen p-4 pt-20 overflow-y-auto bg-gray-100 w-full sm:w-100 font-1">
                
                <p className="mb-8 text-xl color-1 text-center uppercase"><i className="fa-regular fa-pen-to-square pr-2"></i> update product </p>
                <form onSubmit={formik.handleSubmit} className="mb-6">

                    <div className="relative mb-6">
                        <input type="date" id="date" name="DateOfTest" value={formik.values.DateOfTest} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="date" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Date Of Test</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="TestingFacility" name="TestingFacility" value={formik.values.TestingFacility} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="TestingFacility" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Testing Facility</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="TSH" name="TSH" value={formik.values.TSH} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="TSH" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">TSH</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="FreeT4" name="FreeT4" value={formik.values.FreeT4} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="FreeT4" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Free T4</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="FreeT3" name="FreeT3" value={formik.values.FreeT3} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="FreeT3" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Free T3</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="TotalT4" name="TotalT4" value={formik.values.TotalT4} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="TotalT4" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Total T4</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="TPOAntibodies" name="TPOAntibodies" value={formik.values.TPOAntibodies} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="TPOAntibodies" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">TPO Antibodies</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="ThyroglobulinAntibodies" name="ThyroglobulinAntibodies" value={formik.values.ThyroglobulinAntibodies} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="ThyroglobulinAntibodies" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Thyroglobulin Antibodies</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="TSHReceptorAntibodies" name="TSHReceptorAntibodies" value={formik.values.TSHReceptorAntibodies} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="TSHReceptorAntibodies" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">TSH Receptor Antibodies</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="Thyroglobulin" name="Thyroglobulin" value={formik.values.Thyroglobulin} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="Thyroglobulin" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Thyroglobulin</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="Calcitonin" name="Calcitonin" value={formik.values.Calcitonin} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="Calcitonin" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Calcitonin</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="ReverseT3" name="ReverseT3" value={formik.values.ReverseT3} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="ReverseT3" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Reverse T3</label>
                    </div>
                    <div className="relative mb-6">
                        <label htmlFor="Fatigue" className="text-gray-500 w-full text-sm">Fatigue : {formik.values.Fatigue}</label>
                        <input type="range" id="Fatigue" name="Fatigue"  min="0" max="10" value={formik.values.Fatigue} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-1 background-1 rounded-full cursor-pointer mt-2"/>
                    </div>
                    <div className="relative mb-6">
                        <label htmlFor="WeightChanges" className="text-gray-500 w-full text-sm">Weight Changes : {formik.values.WeightChanges}</label>
                        <input type="range" id="WeightChanges" name="WeightChanges"  min="0" max="10" value={formik.values.WeightChanges} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-1 background-1 rounded-full cursor-pointer mt-2"/>
                    </div>
                    <div className="relative mb-6">
                        <label htmlFor="TemperatureSensitivity" className="text-gray-500 w-full text-sm">Temperature Sensitivity : {formik.values.TemperatureSensitivity}</label>
                        <input type="range" id="TemperatureSensitivity" name="TemperatureSensitivity"  min="0" max="10" value={formik.values.TemperatureSensitivity} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-1 background-1 rounded-full cursor-pointer mt-2"/>
                    </div>
                    <div className="relative mb-6">
                        <label htmlFor="MoodChanges" className="text-gray-500 w-full text-sm">Mood Changes : {formik.values.MoodChanges}</label>
                        <input type="range" id="MoodChanges" name="MoodChanges"  min="0" max="10" value={formik.values.MoodChanges} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-1 background-1 rounded-full cursor-pointer mt-2"/>
                    </div>
                    <div className="relative mb-6">
                        <label htmlFor="SkinChanges" className="text-gray-500 w-full text-sm">Skin Changes : {formik.values.SkinChanges}</label>
                        <input type="range" id="SkinChanges" name="SkinChanges"  min="0" max="10" value={formik.values.SkinChanges} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-1 background-1 rounded-full cursor-pointer mt-2"/>
                    </div>

                    <button type="submit" className="text-white justify-center flex items-center bg-amber-500 hover:bg-amber-600 w-full  font-medium rounded-lg text-md px-5 py-2.5 mb-2">Update</button>   
                    
                </form>
                <button type="button" onClick={()=>update(null)} className="text-white justify-center flex items-center bg-red-600 hover:bg-red-700 w-full  font-medium rounded-lg text-md px-5 py-2.5 mb-2">Cancle</button>

            </div>
        </>:null}


        {_show?<>

            <div onClick={()=>show(null)} className="fixed top-0 right-0 left-0 bottom-0 bg-black opacity-50 z-10"></div>
            <div className="fixed max-h-[calc(100vh-100px)] z-20 mt-10 top-1/2 -translate-y-1/2 bg-gray-100 justify-self-center w-11/12 md:w-3/4 p-4 rounded-xl font-1 text-2xl overflow-y-auto">
                <button onClick={()=>show(null)} type="button" className="color-1 hover:text-black! rounded-lg w-8 h-8 absolute top-4 right-4 cursor-pointer">
                    <i className="fa-solid fa-xmark text-2xl"></i>
                </button>

                <div className="grid sm:grid-cols-2 gap-2 mt-8">
                    <p>Id : <span className="color-1">{report.id}</span></p>
                    <p>Date : <span className="color-1">{report.date}</span></p>
                </div>
                <p className="mt-2 border-b pb-3">Testing Facility : <span className="color-1">{report.TestingFacility}</span></p>
                <div className="grid sm:grid-cols-2 gap-2 mt-4 border-b pb-3">
                    <p>TSH : <span className="color-1">{report.TSH} mIU/L</span></p>
                    <p>Free T3 : <span className="color-1">{report.FreeT3} pg/ml</span></p>
                    <p>Free T4 : <span className="color-1">{report.FreeT4} ng/dL</span></p>
                    <p>Total T4 : <span className="color-1">{report.TotalT4} μg/dl</span></p>
                </div>
                <p className="mt-4">TPO Antibodies : <span className="color-1">{report.TPOAntibodies} IU/mL</span></p>
                <p className="mt-2">Thyroglobulin Antibodies : <span className="color-1">{report.ThyroglobulinAntibodies} IU/mL</span></p>
                <p className="mt-2 border-b pb-3">TSH Receptor Antibodies : <span className="color-1">{report.TSHReceptorAntibodies} IU/L</span></p>
                <p className="mt-4">Thyroglobulin : <span className="color-1">{report.Thyroglobulin} ng/mL</span></p>
                <p className="mt-2">Calcitonin : <span className="color-1">{report.Calcitonin} pg/mL</span></p>
                <p className="mt-2 border-b pb-3">Reverse T3 : <span className="color-1">{report.ReverseT3} ng/dL</span></p>
                <div className="grid sm:grid-cols-2 gap-2 mt-4">
                    <p>Fatigue (1-10) : <span className="color-1">{report.Fatigue}</span></p>
                    <p>Weight Changes (1-10) : <span className="color-1">{report.WeightChanges}</span></p>
                    <p>Temperature Sensitivity (1-10) : <span className="color-1">{report.TemperatureSensitivity}</span></p>
                    <p>MoodChanges (1-10) : <span className="color-1">{report.MoodChanges}</span></p>
                    <p>Hair/Skin Changes (1-10) : <span className="color-1">{report.HairSkinChanges}</span></p>
                </div>
            </div>

        </>:null}


        <div className="background-DB">
            <div className="h-25"></div>

            <div className=" w-70 justify-self-end mx-5 relative">
                <div className="absolute inset-y-0 inset-x-0 flex items-center ps-3 pointer-events-none">
                    <i className="fa-solid fa-magnifying-glass color-1"></i>
                </div>
                <input type="search" value={inputValue} onChange={change} className="block w-full p-3 ps-10 text-sm color-1 font-1 border border-[#00b3a1] rounded-lg bg-[#00000000]" placeholder="Date , Testing Facility" required />
                {inputValue== '' ?
                    <button type="submit" className="text-black absolute inset-e-2.5 bottom-1 background-1 font-1 rounded-lg text-sm px-4 py-2 cursor-pointer">Search</button>:
                    <button type="submit" onClick={()=>clear()} className="text-black absolute inset-e-2.5 bottom-1 background-1 font-1 rounded-lg text-sm px-4 py-2 cursor-pointer">Clear</button>
                }
            </div>

            <div className="background-card relative overflow-x-auto shadow-md sm:rounded-lg mt-10 mx-5 md:mx-15 p-3">

                {!Loading?
                    viewData.length>0?
                    <>
                        {inputValue ==''?
                            <p className="font-1 text-center text-3xl my-4">your Reports : <span className="color-1">{viewData.length}</span></p>:
                            <p className="font-1 text-center text-3xl my-4">Search Result : <span className="color-1">{viewData.length}</span></p>
                        }

                        <table className="w-full font-1 text-center">
                            <thead className="uppercase text-lg md:text-xl">
                                <tr>
                                    <th scope="col" className="py-2 px-3">id</th>
                                    <th scope="col" className="py-2 px-3">date</th>
                                    <th scope="col" className="py-2 px-3">edit</th>
                                    <th scope="col" className="py-2 px-3">delete</th>
                                </tr>
                            </thead>

                            {viewData?.map((report)=>(
                                <tbody key={report.id}>
                                    <tr className="border-b border-gray-300 text-lg">
                                        <td className="p-4">{report.id}</td>
                                        <td className="p-4"><p onClick={()=>show(report)} className="inline cursor-pointer hover:text-[#00b3a1]">{report.date}</p></td>
                                        <td className="p-4"><span onClick={()=>update(report)} className="cursor-pointer text-2xl text-amber-400"><i className="fa-regular fa-pen-to-square"></i></span></td>
                                        <td className="p-4"><span onClick={()=>Delete(report)} className="cursor-pointer text-2xl text-red-600"><i className="fa-solid fa-trash-can"></i></span></td>
                                    </tr>
                                </tbody>
                            ))}

                        </table>

                    </>
                    :<div className="w-full h-100 flex items-center justify-center font-1 color-1 text-4xl sm:text-5xl"> {inputValue == ''?  <p>there is no products</p>:<p>No Result</p>} </div>
                :<div className="w-full h-100 flex items-center justify-center"><i className="fas fa-spinner fa-spin color-1 text-7xl"></i></div>}
           
            </div>

            <div className="h-15"></div>
        </div>
    </>
}