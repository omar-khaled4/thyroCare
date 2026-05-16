import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function ProtectedRoute(props) {
    const { userToken, user } = useContext(UserContext);

    if (userToken && user) {
        return props.children;
    } else {
        return <Navigate to={"/login"} />;
    }
}