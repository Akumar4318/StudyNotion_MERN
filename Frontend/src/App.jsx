import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import "./App.css";
import Navbar from "./Components/common/Navbar";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import OpenRoute from "./Components/core/Auth/OpenRoute";
import UpdatePassword from "./Pages/UpdatePassword";
import VerifyEmail from "./Pages/VerifyEmail";
import About from "./Pages/About";
import MyProfile from "./Components/core/Dashboard/MyProfile";
import PrivateRoute from "./Components/Auth/PrivateRoute";
import DashBoard from "./Pages/DashBoard";


const App = () => {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
     
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="catalog/:catalogName"></Route>

        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup/>
            </OpenRoute>
          }
        ></Route>

        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        ></Route>
        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        ></Route>

        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        ></Route>

        <Route
          path="/verify-email"
          element={
            <OpenRoute>
               <VerifyEmail/>
            </OpenRoute>
          }
        />

<Route
          path="/about"
          element={
            <OpenRoute>
             <About/>
            </OpenRoute>
          }
        />
      <Route
      
      element={
<PrivateRoute>
  <DashBoard/>
</PrivateRoute>
      }
      >
 <Route  path="/dashboard/my-profile" element={<MyProfile/>} />
      </Route>

       
      </Routes>
    </div>
  );
};

export default App;
