import React, { useEffect, useState } from 'react'
import {Outlet, useParams} from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../Slice/viewCourseSlice'
import { getFullDetailsOfCourse } from '../Services/operstions/courseDetailsAPI'
import CourseReviewModal from '../Components/core/ViewCourse/CourseReviewModal'
import VideoDetailsSidebar from '../Components/core/ViewCourse/VideoDetailsSidebar'



const ViewCourses = () => {

    const[reviewModal,setReviewModal]=useState(false)
    const {courseId}=useParams()
    const {token}=useSelector((state)=>state.auth);
    const dispatch=useDispatch();
      
    useEffect(()=>{

        const setCourseSpecifictDetails=async()=>{

            const courseData=await getFullDetailsOfCourse(courseId,token);
          
            dispatch(setCourseSectionData(courseData?.courseDetails.courseContent));
            dispatch(setEntireCourseData(courseData.courseDetails));
            dispatch(setCompletedLectures(courseData.completedVideos));

            let lectures=0;
            courseData?.courseDetails?.courseContent.forEach((sec)=>{
                lectures+=sec.subSection.length
            })

            dispatch(setTotalNoOfLectures(lectures));

        }

        setCourseSpecifictDetails()
    },[])



    
  return (
  <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        <VideoDetailsSidebar setReviewModal={setReviewModal}/>
        <div  className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
            <div className="mx-6">
<Outlet/>
            </div>

        </div>
    </div>

    {
        reviewModal && <CourseReviewModal setReviewModal={setReviewModal}/>
    }
  </>
  )
}

export default ViewCourses