import React from 'react'
import "./Loading.css"
const Loding = () => {
  return (
    <div className='bodyLoading' style={{height:"100vh"}}>  
      <div className='container-spinner'>
        <div className="dot-spinner">
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
        </div>
    </div>
  </div>

  )
}

export default Loding
