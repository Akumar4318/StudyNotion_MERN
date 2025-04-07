import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import EnrolledCourses from "./Components/core/Dashboard/EnrolledCourses";
import Cart from "./Components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useDispatch, useSelector } from "react-redux";
import AddCourse from "./Components/core/Dashboard/AddCourse";
import MyCourses from "./Components/core/Dashboard/MyCourses";
import EditCourse from "./Components/core/Dashboard/EditCourse/EditCourse";
import Catalog from "./Pages/Catalog";
import Error from "./Pages/Error";




function App() {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />}></Route>
      
        <Route path="/about-us" element={<About/>}></Route>
        <Route path="catalog/:catalogName" element={<Catalog/>} />

        <Route
          path="/signup"
          element={<OpenRoute>
            <Signup />
          </OpenRoute>}
        ></Route>

        <Route
          path="/login"
          element={<OpenRoute>
            <Login />
          </OpenRoute>}
        ></Route>
        <Route
          path="/forgot-password"
          element={<OpenRoute>
            <ForgotPassword />
          </OpenRoute>}
        ></Route>

        <Route
          path="/update-password/:id"
          element={<OpenRoute>
            <UpdatePassword />
          </OpenRoute>}
        ></Route>

        <Route
          path="/verify-email"
          element={<OpenRoute>
            <VerifyEmail />
          </OpenRoute>} />

      
        <Route

          element={<PrivateRoute>
            <DashBoard />
          </PrivateRoute>}
        >
          <Route path="/dashboard/my-profile" element={<MyProfile />} />



          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
              <Route path="dashboard/cart" element={<Cart />} />
            </>
          )}

          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>} />

            </>
          )}

        </Route>

        <Route path="*" element={<Error/>} />
      </Routes>
    </div>
  );
}

export default App;
