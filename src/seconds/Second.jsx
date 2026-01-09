import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout';
function Second() {
    const [count, setCount]= useState(250);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prev => {
             if (prev <= 0){
                clearInterval(interval)
                return prev
             }
             return prev - 1
            }, 10)
        })
        return () => clearInterval(interval);
    }, []);

  return (
    <Layout>
    <div>
      <h1>Count:{count}</h1>
    </div>
    </Layout>
  )
}

export default Second
