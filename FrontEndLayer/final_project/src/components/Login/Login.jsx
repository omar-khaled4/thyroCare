import React, { useContext, useState } from "react";
import style from "./Login.module.css"
import { useFormik } from "formik";
import * as yup from "yup"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function Login(){

    let navigate = useNavigate()
    let[IsLoading, setIsLoading] = useState(false)
    let { userToken , setuserToken , user , setuser } = useContext(UserContext)

    function handelLogin(values){
        setIsLoading(true)
        // calling API

        // -------------- wrong code --------------
            setIsLoading(false)
            localStorage.setItem("user",JSON.stringify(values))
            localStorage.setItem("userToken","bhjbfvnjeflgvnldjnbjktnlkdjgbnlkjdndlkjfnubnddlfjbndljkfgbndlfgngbkj")
            setuser(values)
            setuserToken("bhjbfvnjeflgvnldjnbjktnlkdjgbnlkjdndlkjfnubnddlfjbndljkfgbndlfgngbkj")            
            navigate("/") 
                     
        // -------------- wrong code --------------

    }

    let validationSchema = yup.object().shape({
        email: yup.string().email(" not valid email ").required(" email is required ").matches(/^[a-zA-Z]{3,}/,"email must start with 3 char at least") ,
        password: yup.string().min(6, " min lenght is 6 ").required(" password is required ") ,
    })

    let formik = useFormik({
        // same as backend object
        initialValues :{
            email:"",
            password:"",
        },
        validationSchema,
        onSubmit:handelLogin,
    })


    return <>
        <div className="background-image w-full min-h-screen">
            <div className="pt-35 mx-10 grid gap-4 md:grid-cols-12">

                <div className="md:col-span-5 fixed w-90">
                    <p className="text-white font-1 text-5xl hidden md:flex leading-15">When your body speaks , Listening is the first step toward healing</p>
                </div>

                <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
                    <div className="w-full backdrop-blur-[10px] bg-white/10 rounded-[50px] border border-white mb-4">
                        <p className="text-white font-1 text-center text-2xl py-3 border-b-2 mx-5">login</p>
                    
                        <form onSubmit={formik.handleSubmit} className="m-5 ">
                            <div className="mt-4">
                                <label htmlFor="email" className="text-white font-1 w-full text-lg">Email</label>
                                <input type="email" id="email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full font-1 bg-[#00000000] text-white rounded-lg" placeholder="name@gmail.com" required/>
                                { formik.errors.email && formik.touched.email ?( <p className="font-1 pt-1 text-red-800">{formik.errors.email}</p> ):null} 
                            </div>
                            <div className="mt-4">
                                <label htmlFor="password" className="text-white font-1 w-full text-lg">Password</label>
                                <input type="password" id="password" name="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full font-1 bg-[#00000000] text-white rounded-lg" required/>
                                { formik.errors.password && formik.touched.password ?( <p className="font-1 pt-1 text-red-800">{formik.errors.password}</p> ):null}
                            </div>
                            {IsLoading ? 
                                <p className="bg-white font-1 text-lg w-full my-8 py-2 rounded-lg cursor-pointer text-center"><i className="fas fa-spinner fa-spin text-black"></i></p> 
                                :<button type="submit" className="bg-white font-1 text-lg w-full my-8 py-2 rounded-lg cursor-pointer">Submit</button>
                            }
                        </form>

                    </div>
                </div>

            </div>
        </div>
    </>
}