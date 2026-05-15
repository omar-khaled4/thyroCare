import React, { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export default function InsertReport(){

    let[IsLoading, setIsLoading] = useState(false)
    let[error, setError] = useState(null)

    let validationSchema = Yup.object({
        testDate: Yup.date().required('Test date is required'),
        testingFacility: Yup.string().required('Testing facility is required'),
        thyroidFunction: Yup.object({
            tsh: Yup.number().typeError('Must be a number').required('TSH is required'),
            freeT3: Yup.number().typeError('Must be a number').required('Free T3 is required'),
            freeT4: Yup.number().typeError('Must be a number').required('Free T4 is required'),
            totalT3: Yup.number().typeError('Must be a number').required('Total T3 is required'),
            totalT4: Yup.number().typeError('Must be a number').required('Total T4 is required'),
        }),
        antibodies: Yup.object({
            tpo: Yup.number().typeError('Must be a number').required('TPO is required'),
            antiTg: Yup.number().typeError('Must be a number').required('Anti Tg is required'),
            tshr: Yup.number().typeError('Must be a number').required('TSHR is required'),
        }),
        otherTests: Yup.object({
            thyroglobulin: Yup.number().typeError('Must be a number').required('Thyroglobulin is required'),
        }),
        symptoms: Yup.object({
            fatigue: Yup.number().min(0).max(10).required('Fatigue is required'),
            weightChange: Yup.number().min(0).max(10).required('Weight change is required'),
            coldIntolerance: Yup.number().min(0).max(10).required('Cold intolerance is required'),
            hairLoss: Yup.number().min(0).max(10).required('Hair loss is required'),
            palpitations: Yup.number().min(0).max(10).required('Palpitations is required'),
            anxiety: Yup.number().min(0).max(10).required('Anxiety is required'),
            insomnia: Yup.number().min(0).max(10).required('Insomnia is required'),
        }),
    })

    function handleSubmit(values)
    {
        setIsLoading(true)
        setError(null)
        
        axios.post('/reports', values)
            .then(res => {
                console.log('Report created:', res.data)
            })
            .catch(err => {
                setError(err.response?.data?.message || err.message)
                console.error('Error creating report:', err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    let formik = useFormik({
        initialValues :{
            testDate:"",
            testingFacility:"",
            thyroidFunction: {
                tsh: "",
                freeT3: "",
                freeT4: "",
                totalT3: "",
                totalT4: "",
            },
            antibodies: {
                tpo: "",
                antiTg: "",
                tshr: "",
            },
            otherTests: {
                thyroglobulin: "",
            },
            symptoms: {
                fatigue: "5",
                weightChange: "5",
                coldIntolerance: "5",
                hairLoss: "5",
                palpitations: "5",
                anxiety: "5",
                insomnia: "5",
            },
        },
        validationSchema,
        onSubmit: handleSubmit,
    })

    return <>
        <div className="background-DB flex flex-wrap items-center justify-center">
            <div className="background-card p-5 w-[90%] mt-21 mb-10">
               <p className="font-1 text-4xl text-center">Thyroid Test Report</p>
                <form onSubmit={formik.handleSubmit} >

                    <div className="grid gap-4 md:grid-cols-2">
                        <p className="md:col-span-2 font-1 text-2xl mt-5 mb-2 border-b-2 py-3">Basic Information</p>
                        <div>
                            <label htmlFor="testDate" className="font-1 w-full text-xl">Date Of Test</label>
                            <input type="date" id="testDate" name="testDate" value={formik.values.testDate} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.testDate && formik.touched.testDate ?( <p className="font-1 pt-1 text-red-800">{formik.errors.testDate}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="testingFacility" className="font-1 w-full text-xl">Testing Facility</label>
                            <input type="text" id="testingFacility" name="testingFacility" value={formik.values.testingFacility} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="hospital or clinic name" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.testingFacility && formik.touched.testingFacility ?( <p className="font-1 pt-1 text-red-800">{formik.errors.testingFacility}</p> ):null}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <p className="md:col-span-2 font-1 text-2xl mt-5 mb-2 border-b-2 py-3">Thyroid Function Tests</p>
                        <div>
                            <label htmlFor="tsh" className="font-1 w-full text-xl">TSH</label>
                            <input type="number" id="tsh" name="thyroidFunction.tsh" value={formik.values.thyroidFunction.tsh} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in mIU/L" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.thyroidFunction?.tsh && formik.touched.thyroidFunction?.tsh ?( <p className="font-1 pt-1 text-red-800">{formik.errors.thyroidFunction.tsh}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="freeT4" className="font-1 w-full text-xl">Free T4</label>
                            <input type="number" id="freeT4" name="thyroidFunction.freeT4" value={formik.values.thyroidFunction.freeT4} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in ng/dL" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.thyroidFunction?.freeT4 && formik.touched.thyroidFunction?.freeT4 ?( <p className="font-1 pt-1 text-red-800">{formik.errors.thyroidFunction.freeT4}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="freeT3" className="font-1 w-full text-xl">Free T3</label>
                            <input type="number" id="freeT3" name="thyroidFunction.freeT3" value={formik.values.thyroidFunction.freeT3} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in pg/ml" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.thyroidFunction?.freeT3 && formik.touched.thyroidFunction?.freeT3 ?( <p className="font-1 pt-1 text-red-800">{formik.errors.thyroidFunction.freeT3}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="totalT4" className="font-1 w-full text-xl">Total T4</label>
                            <input type="number" id="totalT4" name="thyroidFunction.totalT4" value={formik.values.thyroidFunction.totalT4} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in μg/dl" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.thyroidFunction?.totalT4 && formik.touched.thyroidFunction?.totalT4 ?( <p className="font-1 pt-1 text-red-800">{formik.errors.thyroidFunction.totalT4}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="totalT3" className="font-1 w-full text-xl">Total T3</label>
                            <input type="number" id="totalT3" name="thyroidFunction.totalT3" value={formik.values.thyroidFunction.totalT3} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in ng/dL" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.thyroidFunction?.totalT3 && formik.touched.thyroidFunction?.totalT3 ?( <p className="font-1 pt-1 text-red-800">{formik.errors.thyroidFunction.totalT3}</p> ):null}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <p className="md:col-span-3 font-1 text-2xl mt-5 mb-2 border-b-2 py-3">Thyroid Antibody Tests</p>
                        <div>
                            <label htmlFor="tpo" className="font-1 w-full text-xl">TPO Antibodies</label>
                            <input type="number" id="tpo" name="antibodies.tpo" value={formik.values.antibodies.tpo} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in IU/mL" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.antibodies?.tpo && formik.touched.antibodies?.tpo ?( <p className="font-1 pt-1 text-red-800">{formik.errors.antibodies.tpo}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="antiTg" className="font-1 w-full text-xl">Thyroglobulin Antibodies</label>
                            <input type="number" id="antiTg" name="antibodies.antiTg" value={formik.values.antibodies.antiTg} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in IU/mL" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.antibodies?.antiTg && formik.touched.antibodies?.antiTg ?( <p className="font-1 pt-1 text-red-800">{formik.errors.antibodies.antiTg}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="tshr" className="font-1 w-full text-xl">TSH Receptor Antibodies</label>
                            <input type="number" id="tshr" name="antibodies.tshr" value={formik.values.antibodies.tshr} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in IU/L" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.antibodies?.tshr && formik.touched.antibodies?.tshr ?( <p className="font-1 pt-1 text-red-800">{formik.errors.antibodies.tshr}</p> ):null}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <p className="md:col-span-2 font-1 text-2xl mt-5 mb-2 border-b-2 py-3">Other Relevant Tests</p>
                        <div>
                            <label htmlFor="thyroglobulin" className="font-1 w-full text-xl">Thyroglobulin</label>
                            <input type="number" id="thyroglobulin" name="otherTests.thyroglobulin" value={formik.values.otherTests.thyroglobulin} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="value in ng/mL" className="w-full font-1 bg-[#00000000] color-1 border border-black rounded-lg mt-2" required/>
                            { formik.errors.otherTests?.thyroglobulin && formik.touched.otherTests?.thyroglobulin ?( <p className="font-1 pt-1 text-red-800">{formik.errors.otherTests.thyroglobulin}</p> ):null}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <p className="md:col-span-2 font-1 text-2xl mt-5 mb-2 border-b-2 py-3">Symptoms Checklist</p>
                        <div>
                            <label htmlFor="fatigue" className="font-1 w-full text-xl">Fatigue : {formik.values.symptoms.fatigue}</label>
                            <input type="range" id="fatigue" name="symptoms.fatigue" min="0" max="10" value={formik.values.symptoms.fatigue} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-2 background-1 rounded-full cursor-pointer mt-2"/>
                            { formik.errors.symptoms?.fatigue && formik.touched.symptoms?.fatigue ?( <p className="font-1 pt-1 text-red-800">{formik.errors.symptoms.fatigue}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="weightChange" className="font-1 w-full text-xl">Weight Changes : {formik.values.symptoms.weightChange}</label>
                            <input type="range" id="weightChange" name="symptoms.weightChange" min="0" max="10" value={formik.values.symptoms.weightChange} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-2 background-1 rounded-full cursor-pointer mt-2"/>
                            { formik.errors.symptoms?.weightChange && formik.touched.symptoms?.weightChange ?( <p className="font-1 pt-1 text-red-800">{formik.errors.symptoms.weightChange}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="coldIntolerance" className="font-1 w-full text-xl">Cold Intolerance : {formik.values.symptoms.coldIntolerance}</label>
                            <input type="range" id="coldIntolerance" name="symptoms.coldIntolerance" min="0" max="10" value={formik.values.symptoms.coldIntolerance} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-2 background-1 rounded-full cursor-pointer mt-2"/>
                            { formik.errors.symptoms?.coldIntolerance && formik.touched.symptoms?.coldIntolerance ?( <p className="font-1 pt-1 text-red-800">{formik.errors.symptoms.coldIntolerance}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="hairLoss" className="font-1 w-full text-xl">Hair Loss : {formik.values.symptoms.hairLoss}</label>
                            <input type="range" id="hairLoss" name="symptoms.hairLoss" min="0" max="10" value={formik.values.symptoms.hairLoss} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-2 background-1 rounded-full cursor-pointer mt-2"/>
                            { formik.errors.symptoms?.hairLoss && formik.touched.symptoms?.hairLoss ?( <p className="font-1 pt-1 text-red-800">{formik.errors.symptoms.hairLoss}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="palpitations" className="font-1 w-full text-xl">Palpitations : {formik.values.symptoms.palpitations}</label>
                            <input type="range" id="palpitations" name="symptoms.palpitations" min="0" max="10" value={formik.values.symptoms.palpitations} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-2 background-1 rounded-full cursor-pointer mt-2"/>
                            { formik.errors.symptoms?.palpitations && formik.touched.symptoms?.palpitations ?( <p className="font-1 pt-1 text-red-800">{formik.errors.symptoms.palpitations}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="anxiety" className="font-1 w-full text-xl">Anxiety : {formik.values.symptoms.anxiety}</label>
                            <input type="range" id="anxiety" name="symptoms.anxiety" min="0" max="10" value={formik.values.symptoms.anxiety} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-2 background-1 rounded-full cursor-pointer mt-2"/>
                            { formik.errors.symptoms?.anxiety && formik.touched.symptoms?.anxiety ?( <p className="font-1 pt-1 text-red-800">{formik.errors.symptoms.anxiety}</p> ):null}
                        </div>
                        <div>
                            <label htmlFor="insomnia" className="font-1 w-full text-xl">Insomnia : {formik.values.symptoms.insomnia}</label>
                            <input type="range" id="insomnia" name="symptoms.insomnia" min="0" max="10" value={formik.values.symptoms.insomnia} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-2 background-1 rounded-full cursor-pointer mt-2"/>
                            { formik.errors.symptoms?.insomnia && formik.touched.symptoms?.insomnia ?( <p className="font-1 pt-1 text-red-800">{formik.errors.symptoms.insomnia}</p> ):null}
                        </div>
                    </div>

                    {error && (
                        <p className="font-1 pt-1 text-red-800 text-center mt-4">{error}</p>
                    )}
                    
                    {IsLoading ? 
                        <p className="bg-[#009284] font-1 text-white text-2xl w-full my-8 py-2 rounded-lg cursor-pointer text-center"><i className="fas fa-spinner fa-spin"></i></p> 
                        :<button type="submit" className="background-1 font-1 text-white text-2xl w-full my-8 py-2 rounded-lg cursor-pointer hover:bg-[#009284]! transition duration-400">Generate Report</button>
                    }

                </form>
            </div>
        </div>
    </>
}