import React from 'react'
import BlogCard from './BlogCard'

const BlogList = () => {
  return (
    <div className="w-[100%] h-[100%] flex justify-center items-center flex-wrap gap-10">
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
    </div>
  )
}

export default BlogList