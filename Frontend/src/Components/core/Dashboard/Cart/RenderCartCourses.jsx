import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { FaStar } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeFromCart } from "../../../../Slice/cartSlice";


const RenderCartCourses = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch=useDispatch()

  return (
    <div  className="flex flex-1 flex-col">
      {cart.map((course, indx) => (
        <div key={course._id}
        className={`flex w-full flex-wrap items-start justify-between gap-6 ${
          indx !== cart.length - 1 && "border-b border-b-richblack-400 pb-6"
        } ${indx !== 0 && "mt-6"} `}>
          <div  className="flex flex-1 flex-col gap-4 xl:flex-row">
            <img src={course.thumbnail} alt={course.courseName}  className="h-[148px] w-[220px] rounded-lg object-cover"/>
            <div  className="flex flex-col space-y-1">
              <p  className="text-lg font-medium text-richblack-5">{course.courseName}</p>
              <p className="text-sm text-richblack-300">{course?.category?.name}</p>

              <div  className="flex items-center gap-2">
                <span  className="text-yellow-5">4.8</span>
                <ReactStars
                  count={5}
                  
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<FaStar />}
                  fullIcon={<FaStar />}
                />

                <span className="text-richblack-400">{course?.ratingAndreviews?.length} Rating</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <button className="flex flex-col items-end space-y-2" onClick={()=>dispatch(removeFromCart(course._id))}>
            <RiDeleteBin6Line />
            <span>Remove</span>
            </button>
            <p  className="mb-6 text-3xl font-medium text-yellow-100">
              ₹ {course?.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderCartCourses;
