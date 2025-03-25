import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa6";
import HighlightText from '../Components/core/HomePage/HighlightText';
import CTAButton from '../Components/core/HomePage/Button';
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../Components/core/HomePage/CodeBlocks';


const Home = () => {
  return (
    <div>

        {/*  - Section1 */}

            <div className='relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white '>
                <Link to={"/signup"}>
                
                <div className=' group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none'>
                     <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>Become an Instructor </p>
                        <FaArrowRight/>
                     </div>
                </div>
                </Link>
                
                {/* Heading */}

                <div className='text-center text-4xl font-semibold mt-4'>
                    Empower Your Future with 
                     <HighlightText text={" Coding Skills"}/>
                </div>

                {/* Sub-Heading */}
                
                <div className="-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
            </div>

        {/* create 2 button  CTA BUTTON CALL TO ACTION*/}

        <div className="mt-8 flex flex-row gap-7">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        {/* Show the video */}

        {/* Video */}
        <div className="mx-4 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video
            className="shadow-[20px_20px_rgba(255,255,255)]"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>


        {/* Code-Section -01 */}

        <div>
            
                                <CodeBlocks position={"lg:flex-row"} heading={

                        <div className='text-4xl font-semibold'>
                            Unlock Your 
                            <HighlightText text={"Coding Potential"}/>
                        </div>

                        }
                        subheading={
                        "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                        }
                        ctabtn1={{
                        btnText:"try it yourself",
                        linkto:"/signup",
                        active:true
                        }}

                        ctabtn2={{
                        btnText:"Learn your self",
                        linkto:"/login",
                        active:false
                        }}

                        codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                        backgroundGradient={<div className="w-72 h-72 rounded-full bg-[radial-gradient(circle_at_20%_10%,#F1C27D_30%,#8B4513_20%,transparent_100%)] blur-2xl absolute mix-blend-overlay"></div>}
                        codeColor={"text-yellow-25"}

                        />
        </div>

                {/* Code-Section -02 */}

                <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                Start
                <HighlightText text={" coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-white"}
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={<div className="w-72 h-72 rounded-full bg-[radial-gradient(circle_at_20%_10%,#B3E0F2_10%,#118AB2_30%,transparent_100%)] blur-2xl absolute mix-blend-overlay"></div>}
          />
        </div>


            </div>





         {/* - Section-2 */}


         {/* - Section-3 */}



      {/* - Footer */}


    </div>
  )
}

export default Home