import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/IconBtn";

const VideoDetailsSidebar = ({ setReviewModal }) => {
  const [activeStatus, setActiveStatus] = useState("");
  const [videobarActive, setVideoBarActive] = useState("");
  const navigate = useNavigate();
  const { sectionId, subSectionId } = useParams();
  const location = useLocation();

  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    //     (() => {
    //       if (!courseSectionData.length) {
    //         return;
    //       }

    //       const currentSectionIndex = courseSectionData.find(
    //         (data) => data._id === sectionId
    //       );

    //       const currentSubSectionIndex = courseSectionData?.[
    //         currentSectionIndex
    //       ]?.subSection.findIndex((data) => data._id === subSectionId);

    //       const activeSubSectionId=courseSectionData(currentSectionIndex)?.subSection.[currentSubSectionIndex]?._id;
    // set current section here
    //       setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);

    // set current sub section here
    //       setVideoBarActive(activeSubSectionId)
    //     })();
    //   },[courseSectionData,courseEntireData,location.pathname]);

    const setActiveFlags = () => {
      if (!courseSectionData.length) {
        return;
      }

      const currentSectionIndex = courseSectionData.find(
        (data) => data._id === sectionId
      );

      const currentSubSectionIndex = courseSectionData?.[
        currentSectionIndex
      ]?.subSection.findIndex((data) => data._id === subSectionId);

      const activeSubSectionId =
        courseSectionData[currentSectionIndex]?.subSection?.[
          currentSubSectionIndex
        ]?._id;
      // set current section here
      setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);

      // set current sub section here
      setVideoBarActive(activeSubSectionId);
    };
    setActiveFlags();
  }, [courseSectionData, courseEntireData, location.pathname]);

  return (
    <>
      <div>
        {/* btn heading div */}
        <div>
          {/* only for buttons */}
          <div>
            <div
              onClick={() => {
                navigate("/dahoboard/enorolled-courses");
              }}
            >
              Back button
            </div>
            <div>
              <IconBtn
                text="Add Review"
                onClick={() => {
                  setReviewModal(true);
                }}
              />
            </div>
          </div>
          {/* for heading or title */}
          <div>
            <p>{courseEntireData?.courseName}</p>
            <p>
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>

        {/* for section and subSections */}

        <div>
          {courseSectionData.map((course, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveStatus(course?._id);
              }}
            >
              <div>
                <div>{course?.sectionName}</div>

                <div>{/* add arrow here */}</div>
              </div>

              {/* subSections */}
              <div>
                {activeStatus === course?._id &&
                  course?.subSection.map((topic, index) => (
                    <div
                    onClick={()=>{
                        navigate(`/view-course/${courseEntireData?._id}/section/${course._id}/sub-section/${topic?._id}`)

                        setVideoBarActive(topic?._id)
                    }}
                      key={index}
                      className={`flex gap-4 p-5 ${
                        videobarActive === topic._id
                          ? "bg-yellow-200 text-richblack-900"
                          : "bg-richblack-900 text-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id=""
                        checked={completedLectures.includes(topic?._id)}
                        onChange={() => {}}
                      />

                      <span>{topic.title}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VideoDetailsSidebar;
