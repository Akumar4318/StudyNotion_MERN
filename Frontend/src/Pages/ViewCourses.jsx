import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
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
    },[])



    
  return (
  <>
      <div>
        <VideoDetailsSidebar setReviewModal={setReviewModal}/>
    </div>

    {
        reviewModal && <CourseReviewModal setReviewModal={setReviewModal}/>
    }
  </>
  )
}

export default ViewCourses