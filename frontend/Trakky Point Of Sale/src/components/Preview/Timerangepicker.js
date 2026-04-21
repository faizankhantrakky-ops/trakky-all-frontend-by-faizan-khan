import React, { useState } from 'react'

const Timerangepicker = ({start,end}) => {
    const [hidden,sethidden] = useState('flex')
    function handleClick(){
        hidden === 'flex' ? sethidden("none") : sethidden("flex") 
    }
  return (
    
<div class="w-[16rem]">
    <button onClick={handleClick} id="selectTimeToggle" data-collapse-toggle="time-range-container" type="button" class="text-blue-700 dark:text-blue-500 text-base font-medium hover:underline p-0 inline-flex items-center mb-2">
        Add timings 
    </button>
    <div id="time-range-container" class="max-w-[16rem] mx-auto grid grid-cols-2 gap-4 mb-2" style={{display:hidden}}>
        <div>
            <label for="start-time" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start time:</label>
            <div class="relative">
                <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <input onChange={(e)=>{start(e.target.value)}} type="time" id="start-time" class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            </div>
        </div>
        <div>
            <label for="end-time" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End time:</label>
            <div class="relative">
                <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <input onChange={(e)=>{end(e.target.value)}} type="time" id="end-time" class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            </div>
        </div>
    </div>
</div>

  )
}

export default Timerangepicker
