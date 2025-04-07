import React, { useEffect, useState } from "react";
import Footer from "../Components/common/Footer";
import { useParams } from "react-router-dom";
import { apiConnector } from "../Services/apiconnector";
import { categories } from "../Services/api";
import { getCatalogPageData } from "../Services/operstions/pageAndComponentData";
import Course_Card from "../Components/core/Catalog/Course_Card";
import CourseSlider from "../Components/core/Catalog/CourseSlider";




const Catalog = () => {

    const {catalogName}=useParams();
    const [catalogPageData,setCataLogPageData]=useState(null);
    const[categoryId,setCategoryId]=useState('')
    const [active, setActive] = useState(1)
    // fetch all categories

    useEffect(()=>{

        const getCategoryDetails=async()=>{
            const res=await apiConnector('GET',categories.CATEGORIES_API);
            const category_id = 
            res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            setCategoryId(category_id)
        }
        getCategoryDetails()
    },[catalogName])

    useEffect(()=>{
        const getCategoryDetails=async()=>{
            try{
                const res=await getCatalogPageData(categoryId);
                setCataLogPageData(res)
            }
            catch(error){
                console.log(error)
            }
        }

        getCategoryDetails()
    },[categoryId])

  return (
    <div className=" box-content bg-richblack-800 px-4">
      {/* toplevel section */}
      <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
        <p className="text-sm text-richblack-300">{`Home/catalog/`}
            <span className="text-yellow-25">
                {catalogPageData?.data?.selectedCategory?.name}
            </span>
        </p>
        <p className="text-3xl text-richblack-5">  {catalogPageData?.data?.selectedCategory?.name}</p>
        <p className="max-w-[870px] text-richblack-200">  {catalogPageData?.data?.selectedCategory?.description}</p>
      </div>

      <div >
        {/* section1 */}\
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading" >Courses to get you started</div>
          <div clclassName="my-4 flex border-b border-b-richblack-600 text-sm">
            <p className={`px-4 py-2 ${
                  active === 1
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(1)}>Most Popular</p>
            <p  className={`px-4 py-2 ${
                  active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(2)}>New </p>
          </div>
          <div>
          <CourseSlider  Courses={catalogPageData?.data?.selectedCategory?.courses}/>
          </div>

     
        </div>
        <div>
            {/* section 2 */}

            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">Top Course 
                    in {catalogPageData?.data?.selectedCategory?.name}
                </div>
                <div className="py-8"><CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses}/></div>
            </div>
        </div>

        {/* section3 */}

        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Frequently Bought </div>
            <div className="py-8">

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {
                        catalogPageData?.data?.mostSellingCourses?.slice(0,4).map((course,index)=>(
                            <Course_Card course={course} key={index}   Height={"h-[400px]"} />
                        ))
                    }
                </div>

            </div>


        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default Catalog;
