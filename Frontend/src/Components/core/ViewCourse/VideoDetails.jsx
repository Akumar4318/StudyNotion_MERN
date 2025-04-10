import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  setCourseSectionData,
  updateCompletedLectures,
} from "../../../Slice/viewCourseSlice";
import { markLectureAsComplete } from "../../../Services/operstions/courseDetailsAPI";
import ReactPlayer from "react-player";
import { IoPlayCircleOutline } from "react-icons/io5";
import IconBtn from "../../common/IconBtn";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const playerRef = useRef();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  const location = useLocation();
  const [videoData, setVideoData] = useState([]);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setVideoSpecificDetails = async () => {
      if (!setCourseSectionData.length) {
        return;
      }

      if (!courseId && !sectionId && !subSectionId) {
        navigate("/dashboard/enrolled-course");
      } else {
        const filtereData = courseSectionData.filter(
          (course) => course._id === sectionId
        );

        const filterVideoData = filtereData?.[0].subSection.filter(
          (data) => data._id === subSectionId
        );

        setVideoData(filterVideoData[0]);
        setVideoEnded(false);
      }
    };
    setVideoSpecificDetails();
  }, [courseSectionData, courseEntireData, location.pathname]);

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSectionId.findIndex((data) => data._id === subSectionId);

    if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
      return true;
    } else {
      return false;
    }
  };

  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSectionId.findIndex((data) => data._id === subSectionId);

    const noOfSubSection =
      courseSectionData[currentSectionIndex].subSection.length;

    if (
      currentSectionIndex === courseSectionData.length - 1 &&
      currentSubSectionIndex === noOfSubSection - 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSectionId.findIndex((data) => data._id === subSectionId);

    const noOfSubSection =
      courseSectionData[currentSectionIndex].subSection.length;

    if (currentSubSectionIndex !== noOfSubSection - 1) {
      // same section ki next video mai jana hai

      const nextSubSectionId =
        courseSectionData[currentSectionIndex].subSection[
          currentSectionIndex + 1
        ]._id;

      // iss video pa jaoo
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      );
    } else {
      // different section ki first video

      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const nextSubSectionId =
        courseSectionData[currentSectionIndex + 1].subsection[0]._id;

      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      );
    }
  };

  const goToPreVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSectionId.findIndex((data) => data._id === subSectionId);

    const noOfSubSection =
      courseSectionData[currentSectionIndex].subSection.length;

    if (currentSubSectionIndex != 0) {
      // same section prev video

      const preSubSectionId =
        courseSectionData[currentSectionIndex].subSection[
          currentSubSectionIndex - 1
        ];
      // is video pe cahle jaoo

      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${preSubSectionId}`
      );
    } else {
      // different section laset video

      const preSectionId = courseSectionData[currentSectionIndex - 1]._id;
      const preSubSectionLength =
        courseSectionData[currentSectionIndex - 1].subSection.length;
      const nextSubSectionId =
        courseSectionData[currentSectionIndex - 1].subsection[
          preSubSectionLength - 1
        ]._id;

      // next video pe chale jaoo

      navigate(
        `/view-course/${courseId}/section/${preSectionId}/sub-section/${nextSubSectionId}`
      );
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true);

    const res = await markLectureAsComplete(
      { courseId: courseId, subSectionId: subSectionId },
      token
    );

    /// state update

    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <div>No data found</div>
      ) : (
        <ReactPlayer
          url={videoData?.videoUrl}
          controls={true}
          pip={true}
          width="100%"
          height="auto"
          onEnded={() => setVideoEnded(true)}
          playsinline
        >
          <IoPlayCircleOutline position="center"/>

          {videoEnded && (
            <div style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter">
              {!completedLectures.includes(subSectionId) && (
                <IconBtn customClasses="text-xl max-w-max px-4 mx-auto"
                  disabled={loading}
                  onClick={() => handleLectureCompletion()}
                  text={!loading ? "Mark as completed" : "Loading"}
                />
              )}

              <Icon
                disabled={loading}
                onClick={() => {
                  if (playerRef?.current) {
                    playerRef.current?.seek(0);
                    setVideoEnded(false);
                  }
                }}
                text="Rewatch"
               customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />

              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPreVideo}
                    className="blackButton"
                  >Prev</button>
                )}

                {
                    !isLastVideo() && (
                        <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >Next</button>
                    )
                }
              </div>
            </div>
          )}

       
        </ReactPlayer>
      )}


      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>

    </div>
  );
};

export default VideoDetails;
