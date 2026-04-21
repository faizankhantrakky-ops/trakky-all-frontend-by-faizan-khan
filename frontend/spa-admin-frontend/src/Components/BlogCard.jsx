import React from 'react'
import '../input.css'
import { HiOutlineShare } from "react-icons/hi2";

const BlogCard = () => {
    return (
        // <div className="w-[100%] h-[100%] flex justify-center items-center bg-gray-300 " >
            <div className=" w-[23rem] h-[24rem]  shadow-3xl  bg-white box-border ">
                <div className=" h-[50%]  bg-black w-[100%]  "></div>
                <div className=" h-[10%]  w-[100%] flex justify-between text-gray-500  px-2 items-start py-1   ">
                    <div>June 20,2023</div>
                    <div className='px-1 py-1 rounded-full ring-1 ring-black '><HiOutlineShare/></div>
                </div>
                <div className=" h-[25%] pt-1  w-[100%]  tracking-tighter font-bold text-gray-600 px-2 flex justify-center items-center  ">
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi, similique! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Exercitationem, quibusdam.
                    </p>
                </div>
                <div className=" h-[15%]  w-[100%]  pl-2 flex justify-start items-center gap-4   font-light text-sm ">
                    <button className=" rounded-2xl   bg-gray-200 font-medium w-fit px-3 h-[1.5rem]  ">
                        #style tips
                    </button>
                    <button className=" rounded-2xl   bg-gray-200 font-medium w-fit px-3 h-[1.5rem]  ">
                        #style tips
                    </button>
                </div>
            </div>
        // </div>
    )
}

export default BlogCard