import React, { useState } from "react";
import style from "./InsertReport.module.css"
import { useFormik } from 'formik';

export default function InsertReport(){

    let[IsLoading, setIsLoading] = useState(false)

    function handelGenerate(values)
    {
        console.log(values);
    }

    let formik = useFormik({
        initialValues :{
            DateOfTest:"",
            TestingFacility :"",
            TSH:"",
            FreeT4:"",
            FreeT3:"",
            TotalT4:"",
            TPOAntibodies:"",
            ThyroglobulinAntibodies:"",
            TSHReceptorAntibodies:"",
            Thyroglobulin:"",
            Calcitonin:"",
            ReverseT3:"",
            Fatigue:"5",
            WeightChanges:"5",
            TemperatureSensitivity:"5",
            MoodChanges:"5",
            SkinChanges:"5",
        },
        onSubmit:handelGenerate,
    })

    return <>
        <div className="background-DB flex flex-wrap items-center justify-center">
            <div className="background-card p-5 w-[90%] mt-21 mb-10">
               <p className="font-1 text-4xl text-center">Thyroid Test Report</p>
                <form onSubmit={formik.handleSubmit} >

                    <div className="grid gap-4 md:grid-cols-2">
                        <p className="md:col-span-2 font-1 text-2xl mt-5 mb-2 border-b-2 py-3">Basic Information</p>
                        <div>
                            <label htmlFor="date" className="font-1 w-full text-xl">Date Of Test</label>
                            <input type="date" id="date" name="DateOfTest" value={formik.values.DateOfTest} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.DateOfTest && formik.touched.DateOfTest ?( <p className="font-1 pt-1 text-red-800">{formik.errors.DateOfTest}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="TestingFacility" className="font-1 w-full text-xl">Testing Facility</label>
                            <input type="text" id="TestingFacility" name="TestingFacility" value={formik.values.TestingFacility} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="hospital or clinic name" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.TestingFacility && formik.touched.TestingFacility ?( <p className="font-1 pt-1 text-red-800">{formik.errors.TestingFacility}</p> ):null}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <p className="md:col-span-2 font-1 text-2xl mt-5 mb-2 border-b-2 py-3">Thyroid Function Tests</p>
                        <div>
                            <label htmlFor="TSH" className="font-1 w-full text-xl">TSH</label>
                            <input type="text" id="TSH" name="TSH" value={formik.values.TSH} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in mIU/L" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.TSH && formik.touched.TSH ?( <p className="font-1 pt-1 text-red-800">{formik.errors.TSH}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="FreeT4" className="font-1 w-full text-xl">Free T4</label>
                            <input type="text" id="FreeT4" name="FreeT4" value={formik.values.FreeT4} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in ng/dL" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.FreeT4 && formik.touched.FreeT4 ?( <p className="font-1 pt-1 text-red-800">{formik.errors.FreeT4}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="FreeT3" className="font-1 w-full text-xl">Free T3</label>
                            <input type="text" id="FreeT3" name="FreeT3" value={formik.values.FreeT3} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in pg/ml" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.FreeT3 && formik.touched.FreeT3 ?( <p className="font-1 pt-1 text-red-800">{formik.errors.FreeT3}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="TotalT4" className="font-1 w-full text-xl">Total T4</label>
                            <input type="text" id="TotalT4" name="TotalT4" value={formik.values.TotalT4} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in μg/dl" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.TotalT4 && formik.touched.TotalT4 ?( <p className="font-1 pt-1 text-red-800">{formik.errors.TotalT4}</p> ):null}
                        </div> 
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <p className="md:col-span-3 font-1 text-2xl mt-5 mb-2 border-b-2 py-3">Thyroid Antibody Tests</p>
                        <div>
                            <label htmlFor="TPOAntibodies" className="font-1 w-full text-xl">TPO Antibodies</label>
                            <input type="text" id="TPOAntibodies" name="TPOAntibodies" value={formik.values.TPOAntibodies} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in IU/mL" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.TPOAntibodies && formik.touched.TPOAntibodies ?( <p className="font-1 pt-1 text-red-800">{formik.errors.TPOAntibodies}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="ThyroglobulinAntibodies" className="font-1 w-full text-xl">Thyroglobulin Antibodies</label>
                            <input type="text" id="ThyroglobulinAntibodies" name="ThyroglobulinAntibodies" value={formik.values.ThyroglobulinAntibodies} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in IU/mL" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.ThyroglobulinAntibodies && formik.touched.ThyroglobulinAntibodies ?( <p className="font-1 pt-1 text-red-800">{formik.errors.ThyroglobulinAntibodies}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="TSHReceptorAntibodies" className="font-1 w-full text-xl">TSH Receptor Antibodies</label>
                            <input type="text" id="TSHReceptorAntibodies" name="TSHReceptorAntibodies" value={formik.values.TSHReceptorAntibodies} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in IU/L" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.TSHReceptorAntibodies && formik.touched.TSHReceptorAntibodies ?( <p className="font-1 pt-1 text-red-800">{formik.errors.TSHReceptorAntibodies}</p> ):null}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <p className="md:col-span-3 font-1 text-2xl mt-5 mb-2 border-b-2 py-3">Other Relevant Tests</p>
                        <div>
                            <label htmlFor="Thyroglobulin" className="font-1 w-full text-xl">Thyroglobulin</label>
                            <input type="text" id="Thyroglobulin" name="Thyroglobulin" value={formik.values.Thyroglobulin} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in ng/mL" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.Thyroglobulin && formik.touched.Thyroglobulin ?( <p className="font-1 pt-1 text-red-800">{formik.errors.Thyroglobulin}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="Calcitonin" className="font-1 w-full text-xl">Calcitonin</label>
                            <input type="text" id="Calcitonin" name="Calcitonin" value={formik.values.Calcitonin} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in pg/mL" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.Calcitonin && formik.touched.Calcitonin ?( <p className="font-1 pt-1 text-red-800">{formik.errors.Calcitonin}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="ReverseT3" className="font-1 w-full text-xl">Reverse T3</label>
                            <input type="text" id="ReverseT3" name="ReverseT3" value={formik.values.ReverseT3} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in ng/dL" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.ReverseT3 && formik.touched.ReverseT3 ?( <p className="font-1 pt-1 text-red-800">{formik.errors.ReverseT3}</p> ):null}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <p className="md:col-span-2 font-1 text-2xl mt-5 mb-2 border-b-2 py-3">Symptoms Checklist</p>
                        <div>
                            <label htmlFor="Fatigue" className="font-1 w-full text-xl">Fatigue : {formik.values.Fatigue}</label>
                            <input type="range" id="Fatigue" name="Fatigue"  min="0" max="10" value={formik.values.Fatigue} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-2 background-1 rounded-full cursor-pointer mt-2"/>
                        </div>
                        <div>
                            <label htmlFor="WeightChanges" className="font-1 w-full text-xl">Weight Changes : {formik.values.WeightChanges}</label>
                            <input type="range" id="WeightChanges" name="WeightChanges"  min="0" max="10" value={formik.values.WeightChanges} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-2 background-1 rounded-full cursor-pointer mt-2"/>
                        </div>
                        <div>
                            <label htmlFor="TemperatureSensitivity" className="font-1 w-full text-xl">Temperature Sensitivity : {formik.values.TemperatureSensitivity}</label>
                            <input type="range" id="TemperatureSensitivity" name="TemperatureSensitivity"  min="0" max="10" value={formik.values.TemperatureSensitivity} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-2 background-1 rounded-full cursor-pointer mt-2"/>
                        </div>
                        <div>
                            <label htmlFor="MoodChanges" className="font-1 w-full text-xl">Mood Changes : {formik.values.MoodChanges}</label>
                            <input type="range" id="MoodChanges" name="MoodChanges"  min="0" max="10" value={formik.values.MoodChanges} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-2 background-1 rounded-full cursor-pointer mt-2"/>
                        </div>
                        <div>
                            <label htmlFor="SkinChanges" className="font-1 w-full text-xl">Hair/Skin Changes : {formik.values.SkinChanges}</label>
                            <input type="range" id="SkinChanges" name="SkinChanges"  min="0" max="10" value={formik.values.SkinChanges} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-2 background-1 rounded-full cursor-pointer mt-2"/>
                        </div>
                    </div>

                    {IsLoading ? 
                        <p className="bg-[#009284] font-1 text-white text-2xl w-full my-8 py-2 rounded-lg cursor-pointer text-center"><i className="fas fa-spinner fa-spin"></i></p> 
                        :<button type="submit" className="background-1 font-1 text-white text-2xl w-full my-8 py-2 rounded-lg cursor-pointer hover:bg-[#009284]! transition duration-400">Generate Report</button>
                    }

                </form>
            </div>
        </div>
    </>
}