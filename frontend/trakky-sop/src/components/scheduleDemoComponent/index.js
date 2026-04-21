"use client"
import React, { useState } from 'react'
import Image from 'next/image'

const ScheduleDemoComponent = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    businessEmail: '',
    ownerNumber: '',
    salonNumber: '',
    phoneNumber: '',
    city: '',
    googleMapLink: '',
    requirements: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <div className="pt-32 min-h-screen  flex items-center justify-center px-2 md:px-6 py-12 max-w-[1280px] mx-auto">
      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Form */}
        <div className="flex flex-col justify-center pt-4 px-2">
         <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight border-l-4 border-[#7557D4] pl-4">
  Schedule a free demo
</h1>

          <p className="text-gray-600 text-lg mb-6">
            Get in touch with our team to clarify your queries
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-3">First name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 bg-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-3">Last name*</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 bg-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Business Name & Business Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-3">Business name*</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter business name"
                  className="w-full px-4 py-3 bg-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-3">Business email*</label>
                <input
                  type="email"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  placeholder="Enter business email"
                  className="w-full px-4 py-3 bg-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Owner Number, Salon Number, Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-3">Owner number*</label>
                <input
                  type="tel"
                  name="ownerNumber"
                  value={formData.ownerNumber}
                  onChange={handleChange}
                  placeholder="Owner's phone"
                  className="w-full px-4 py-3 bg-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-3">Salon number*</label>
                <input
                  type="tel"
                  name="salonNumber"
                  value={formData.salonNumber}
                  onChange={handleChange}
                  placeholder="Salon contact number"
                  className="w-full px-4 py-3 bg-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 placeholder-gray-500"
                  required
                />
              </div>
              
            </div>

<div>
                <label className="block text-gray-700 text-sm font-medium mb-3">Phone number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Alternative phone (optional)"
                  className="w-full px-4 py-3 bg-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 placeholder-gray-500"
                />
              </div>
            {/* City / Area & Google Map Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-3">City / Area*</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city or area"
                  className="w-full px-4 py-3 bg-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-3">Google Map Link</label>
                <input
                  type="url"
                  name="googleMapLink"
                  value={formData.googleMapLink}
                  onChange={handleChange}
                  placeholder="Paste Google Maps link (optional)"
                  className="w-full px-4 py-3 bg-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-3">Requirements</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your requirements (optional)"
                className="w-full px-4 py-3 bg-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 placeholder-gray-500 resize-none"
              />
            </div>

            {/* reCAPTCHA */}
            <div className="my-6 bg-white border-2 border-gray-300 rounded-3xl p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition">
              <input 
                type="checkbox" 
                id="recaptcha"
                className="w-6 h-6 rounded border-gray-400 accent-purple-600 cursor-pointer"
                required
              />
              <label htmlFor="recaptcha" className="cursor-pointer">
                <p className="text-sm font-semibold text-gray-800">I'm not a robot</p>
                <p className="text-xs text-gray-600">reCAPTCHA</p>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-left pt-4">
              <button
                type="submit"
                className="px-12 py-3 bg-[#7557D4] text-white font-bold rounded-full shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - Illustration */}
        <div className="relative  lg:flex items-center justify-center ml-0 md:ml-16">
          <Image
            src="https://www.truupe.com/wp-content/uploads/2024/07/Contact-Us.jpg"
            alt="Salon Booking"
            width={1033}
            height={764}
            className="object-contain"
          />
        </div>

      </div>
    </div>
  )
}

export default ScheduleDemoComponent