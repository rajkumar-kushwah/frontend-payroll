import React from 'react'
import { useEffect, useState } from 'react'

function Clock() {
    const [time, setTime] =useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()),1000);
        return () => clearInterval(timer);
    }, []);

  return (
    <div className='text-gray-700 font-medium mb-2'>
      Current Time: {time.toLocaleTimeString()}
    </div>
  )
}

export default Clock
