import React, { Children } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({children}) => {
    const token = useSelector(state => state.user?.access_token);

    if (token) {
        return <Navigate to='/browse' replace />;
    }
    return children;
}

export default PublicRoute