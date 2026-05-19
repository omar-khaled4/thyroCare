import React, { useContext, useState, useEffect } from "react";
import style from "./Profile.module.css"
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { getMe, updateProfile } from "../../services/authService";

export default function Profile(){

    let { userToken , setuserToken , user , setuser } = useContext(UserContext)
    let navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)
    const [feedback, setFeedback] = useState({ message: "", type: "" })

    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsLoading(true)
            try {
                const userData = await getMe()
                if (userData) {
                    setuser(userData)
                }
            } catch (error) {
                console.error("Failed to fetch user profile:", error)
                setFeedback({ message: "Failed to load profile", type: "error" })
            } finally {
                setIsLoading(false)
            }
        }
        if (userToken) {
            fetchUserProfile()
        } else {
            setIsLoading(false)
        }
    }, [userToken, setuser])

    function signout(){
        localStorage.removeItem("userToken");
        setuserToken(null);
        localStorage.removeItem("user");
        setuser(null);
        navigate("/")
    }

    let[update , setupdate]=useState(false)

    const handleProfileUpdate = async (values) => {
        setFeedback({ message: "", type: "" })
        try {
            const updatedUser = await updateProfile(values)
            setuser(updatedUser)
            setFeedback({ message: "Profile updated successfully!", type: "success" })
            setupdate(false)
        } catch (error) {
            console.error("Failed to update profile:", error)
            setFeedback({ 
                message: error.response?.data?.message || "Failed to update profile", 
                type: "error" 
            })
        }
    }

    let formik = useFormik({
        initialValues :{
            firstName :user?.firstName || "",
            lastName :user?.lastName || "",
            email:user?.email || "",
            phone:user?.phone || "",
            password:"",
            dateOfBirth:user?.dateOfBirth || "",
            gender:user?.gender || "",
            address:user?.address || "",
            emergencyContact:user?.emergencyContact || "",
            primaryCondition:user?.primaryCondition || "",
            diagnosisDate:user?.diagnosisDate || "",
            currentMedications:user?.currentMedications || "",
            allergies:user?.allergies || "",
            primaryEndocrinologist:user?.primaryEndocrinologist || "",
        },
        enableReinitialize: true,
        onSubmit: handleProfileUpdate
    })

    return <>

{update ? <>
            <div className="fixed top-0 right-0 left-0 bottom-0 bg-black opacity-50 z-10"></div>
            <div className="fixed top-0 left-0 z-10 h-screen p-4 pt-20 overflow-y-auto bg-gray-100 w-full sm:w-100 font-1">
                
                <p className="mb-8 text-xl color-1 text-center uppercase"><i className="fa-regular fa-pen-to-square pr-2"></i> update your info </p>
                <form onSubmit={formik.handleSubmit} className="mb-6">
                    {feedback.message && (
                        <div className={`p-3 mb-4 rounded-lg ${feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {feedback.message}
                        </div>
                    )}

                    <div className="relative mb-6">
                        <input type="text" id="firstName" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="firstName" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">First Name</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="lastName" name="lastName" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="lastName" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Last Name</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="email" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Email</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="tel" id="phone" name="phone" value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="phone" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Phone</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="date" id="dateOfBirth" name="dateOfBirth" value={formik.values.dateOfBirth} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="dateOfBirth" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Date Of Birth</label>
                    </div>
                    <div className="relative mb-6">
                        <select id="gender" name="gender" value={formik.values.gender} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" required>
                            <option value="female" className="text-black">Female</option>
                            <option value="male" className="text-black">Male</option>
                        </select>
                        <label htmlFor="gender" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Gender</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="address" name="address" value={formik.values.address} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="address" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Address</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="emergencyContact" name="emergencyContact" value={formik.values.emergencyContact} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="emergencyContact" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Emergency Contact</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="primaryCondition" name="primaryCondition" value={formik.values.primaryCondition} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="primaryCondition" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Primary Condition</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="diagnosisDate" name="diagnosisDate" value={formik.values.diagnosisDate} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="diagnosisDate" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Diagnosis Date</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="currentMedications" name="currentMedications" value={formik.values.currentMedications} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="currentMedications" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Current Medications</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="allergies" name="allergies" value={formik.values.allergies} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="allergies" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Allergies</label>
                    </div>
                    <div className="relative mb-6">
                        <input type="text" id="primaryEndocrinologist" name="primaryEndocrinologist" value={formik.values.primaryEndocrinologist} onChange={formik.handleChange} onBlur={formik.handleBlur} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#00b3a1] peer" placeholder=" " />
                        <label htmlFor="primaryEndocrinologist" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-[#00b3a1] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1">Primary Endocrinologist</label>
                    </div>
                    <button type="submit" disabled={formik.isSubmitting} className="text-white justify-center flex items-center bg-amber-500 hover:bg-amber-600 w-full  font-medium rounded-lg text-md px-5 py-2.5 mb-2 disabled:opacity-50">
                        {formik.isSubmitting ? "Updating..." : "Update"}
                    </button>   
                    
                </form>
                <button type="button" onClick={()=>setupdate(false)} className="text-white justify-center flex items-center bg-red-600 hover:bg-red-700 w-full  font-medium rounded-lg text-md px-5 py-2.5 mb-2">Cancle</button>

            </div>

        </> : null}


        <div className="bg-[url(/assets/image-3.png)] w-full h-100 bg-cover bg-position-[50%_15%]"></div>

        <div className="mx-15 md:mb-25 flex gap-x-6 flex-wrap md:flex-nowrap justify-center md:justify-between items-start">

            <div className="bg-white w-75 relative -top-25 rounded-4xl shadow-[6px_6px_25px_rgba(0,0,0,0.25)]">
                <div className="w-full h-full flex flex-wrap items-center justify-center my-7">
                    {user?.gender === "female"?
                        <img src="/assets/girl.png" className="w-35 rounded-full"/>:
                        <img src="/assets/boy.png" className="w-35 rounded-full"/>
                    }
                    <p className="w-full mt-4 font-1 text-center text-3xl">{user?.firstName} {user?.lastName}</p>
                    <p className="w-full font-1 color-1 text-center">Hypothyroidism Patient</p>
                    <div className="w-full mt-7 flex justify-center gap-5">
                        <button onClick={()=>setupdate(true)} className="bg-black text-white font-1 w-25 text-center text-lg py-1 rounded-full cursor-pointer">Edit</button>
                        <span onClick={signout} className="bg-black text-white font-1 w-25 text-center text-lg py-1 rounded-full cursor-pointer">Logout</span>
                    </div>
                </div>
            </div>

            <div className="relative -top-10 md:top-15 w-full md:w-[59%] font-1">
                <p className="text-3xl pb-4 border-b-2">Personal Information</p>
                <div className="mt-4">
                    <div className="w-[50%] inline-block">
                        <p className="text-xl">First Name</p>
                        <p className="color-1 text-lg">{user?.firstName}</p>
                    </div>
                    <div className="w-[50%] inline-block">
                        <p className="text-xl">Last Name</p>
                        <p className="color-1 text-lg">{user?.lastName}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="w-[50%] inline-block">
                        <p className="text-xl">Date of Birth</p>
                        <p className="color-1 text-lg">{user?.dateOfBirth}</p>
                    </div>
                    <div className="w-[50%] inline-block">
                        <p className="text-xl">Gender</p>
                        <p className="color-1 text-lg">{user?.gender}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-xl">Email</p>
                    <p className="color-1 text-lg">{user?.email}</p>
                </div>
                <div className="mt-4">
                    <p className="text-xl">Phone Number</p>
                    <p className="color-1 text-lg">{user?.phone}</p>
                </div>
                <div className="mt-4">
                    <p className="text-xl">Address</p>
                    <p className="color-1 text-lg">{user?.address || "-"}</p>
                </div>
                <div className="mt-4">
                    <p className="text-xl">Emergency Contact</p>
                    <p className="color-1 text-lg">{user?.emergencyContact || "-"}</p>
                </div>

                <p className="text-3xl mt-15 pb-4 border-b-2">Medical Information</p>
                <div className="mt-4">
                    <p className="text-xl">Primary Condition</p>
                    <p className="color-1 text-lg">{user?.primaryCondition || "-"}</p>
                </div>
                <div className="mt-4">
                    <p className="text-xl">Diagnosis Date</p>
                    <p className="color-1 text-lg">{user?.diagnosisDate || "-"}</p>
                </div>
                <div className="mt-4">
                    <p className="text-xl">Current Medications</p>
                    <p className="color-1 text-lg">{user?.currentMedications || "-"}</p>
                </div>
                <div className="mt-4">
                    <p className="text-xl">Allergies</p>
                    <p className="color-1 text-lg">{user?.allergies || "-"}</p>
                </div>
                <div className="mt-4">
                    <p className="text-xl">Primary Endocrinologist</p>
                    <p className="color-1 text-lg">{user?.primaryEndocrinologist || "-"}</p>
                </div>
            </div>
            
        </div>
    </>
}