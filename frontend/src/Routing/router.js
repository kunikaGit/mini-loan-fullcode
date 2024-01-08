import React from "react";
import { BrowserRouter,Route, Routes} from "react-router-dom";
import config from "../config/config";
import Login from "../components/Login";
import AdminLogin from "../components/adminLogin";
import LoanRequest from "../components/LoanRequest"
import UserList from "../components/UserList";

const RouterComponent = () => {
    return(
     <BrowserRouter>
     <Routes>
        <Route path={`${config.baseUrl}`} element={<Login/>}></Route>
        <Route path={`${config.baseUrl}admin-login`} element={<AdminLogin/>}></Route>
        <Route path={`${config.baseUrl}user-list`} element={<UserList/>}></Route>
        <Route path={`${config.baseUrl}loan-request`} element={<LoanRequest/>}></Route>
     </Routes>
     </BrowserRouter>   
    )
}
export default RouterComponent