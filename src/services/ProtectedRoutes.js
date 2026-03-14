import React from "react";
import { useSelector } from "react-redux";
import { Navigate, replace } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const token = useSelector(state => state.user?.access_token);

    if (!token) {
        return <Navigate to='/' replace />;
    }

    return children;
};


export default ProtectedRoute;