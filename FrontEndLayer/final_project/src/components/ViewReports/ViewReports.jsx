import React, { useState, useEffect } from "react";
import style from "./ViewReports.module.css"
import { useFormik } from "formik";
import { getReports, deleteReport, updateReport } from "../../services/reportService";

export default function ViewReports(){

    let[Loading, setLoading] = useState(true)
    let[reports, setReports] = useState([])
    let[viewData,setviewData] = useState([])
    let[ report , setreport ]=useState(null)
    let[ updateLoading , setupdateLoading] =useState(false)

    // fetch reports on mount
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await getReports();
                setReports(data);
                setviewData(data);
            } catch (err) {
                alert(`Failed to load reports: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    //search
    let[inputValue , setinputValue ]=useState('')
    let change = (event) =>{
        setinputValue(event.target.value)
        search(event.target.value, viewData);
    }
    function clear() { 
        setinputValue('')
        setviewData(reports)
    }

    function search(value, dataList) {
        if( dataList.length > 0 ){
            return dataList.filter(r => 
                r.TestingFacility.toLocaleLowerCase().includes(value.toLocaleLowerCase()) || r.date.includes(value)
            )
        }
        return []
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

    const handleDelete = async (reportId) => {
        const confirmed = window.confirm('Are you sure you want to delete this report?');
        if (!confirmed) return;

        // Capture the report being deleted for potential rollback
        const removed = viewData.find(r => r._id === reportId);

        // Optimistic update — remove from UI immediately
        setviewData(prev => prev.filter(r => r._id !== reportId));

        try {
            await deleteReport(reportId);
        } catch (err) {
            // Rollback on error
            if (removed) {
                setviewData(prev => [...prev, removed]);
            }
            alert(`Failed to delete report: ${err.message}`);
        }
    }


    return <>

        {_update?<>

            <div className="fixed top-0 right-0 left-0 bottom-0 bg-black opacity-50 z-10"></div>
            <div className="fixed top-0 left-0 z-10 h-screen p-4 pt-20 overflow-y-auto bg-gray-100 w-full sm:w-100 font-1">
                
                <p className="mb-8 text-xl color-1 text-center uppercase"><i className="fa-regular fa-pen-to-square pr-2"></i> update report </p>
                <form onSubmit={async (e) => {
                    await formik.handleSubmit(e);
                }} className="mb-6">

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

                    <button type="submit" disabled={updateLoading} className="text-white justify-center flex items-center bg-amber-500 hover:bg-amber-600 w-full  font-medium rounded-lg text-md px-5 py-2.5 mb-2">Update</button>   
                    
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

        </>:null>


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
                                        <td className="p-4"><span onClick={()=>handleDelete(report._id)} className="cursor-pointer text-2xl text-red-600"><i className="fa-solid fa-trash-can"></i></span></td>
                                    </tr>
                                </tbody>
                            ))}

                        </table>

                    </>
                    :<div className="w-full h-100 flex items-center justify-center font-1 color-1 text-4xl sm:text-5xl"> {inputValue == ''?  <p>there are no reports</p>:<p>No Result</p>} </div>
                :<div className="w-full h-100 flex items-center justify-center"><i className="fas fa-spinner fa-spin color-1 text-7xl"></i></div>}
            
            </div>

            <div className="h-15"></div>
        </div>
    </>
}
