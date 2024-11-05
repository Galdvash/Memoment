import React from "react";
import styleAbout from "./About.module.css";
import circleIMG from "../../images/add_circle_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 1.svg";
import sendToMobileIMG from "../../images/send_to_mobile_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 1.svg";
import securityIMG from "../../images/security_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 1.svg";
import faceIMG from "../../images/face_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 1.svg";
import checkedIMG from "../../images/checked-tick-svgrepo-com 3.svg";
import iphoneIMG from "../../images/Iphone 1.svg";
const About = () => {
  console.log("about...");

  return (
    <div className="bodyAbout ">
      <div className={`${styleAbout.bodyAbout} ${styleAbout.scrollable}`}>
        <div className={styleAbout.container}>
          <header className={styleAbout.header}>
            <div className={styleAbout.textBox}>
              <h1>
                Make your event unforgettable <br /> with advanced facial
                recognition.
              </h1>
              <p>
                Upload your event photos to a smart digital gallery, share it
                with your guests, and they can easily find their photos with
                just a quick selfie. Our technology gives each guest instant
                access to their pictures and the full album.
              </p>
            </div>

            <div className={styleAbout.flexBoxOne}>
              <div className={styleAbout.flexItem}>
                <img className={styleAbout.img} src={circleIMG} alt="" />
                <p>Create a new event in just a few minutes</p>
              </div>

              <div className={styleAbout.flexItem}>
                <img className={styleAbout.img} src={sendToMobileIMG} alt="" />
                <p>View photos after a quick and secure verification</p>
              </div>
            </div>
            <div className={styleAbout.flexBoxTwo}>
              <div className={styleAbout.flexItem}>
                <img className={styleAbout.img} src={securityIMG} alt="" />
                <p>Guests receive an invitation link to view the gallery</p>
              </div>
              <div className={styleAbout.flexItem}>
                <img className={styleAbout.img} src={faceIMG} alt="" />
                <p>
                  facial recognition process will allow the guest to receive the
                  photos in which they appear
                </p>
              </div>
            </div>
          </header>
          <section className={styleAbout.checkedList}>
            <div>
              <img src={checkedIMG} alt=""></img> 99.4% accuracy
            </div>
            <div>
              <img src={checkedIMG} alt=""></img> All the information is secure.
            </div>
            <div>
              <img src={checkedIMG} alt=""></img> Your guests will love you!
            </div>
          </section>
          <button className={styleAbout.btn}>Create New Event</button>
        </div>
        <aside className={styleAbout.iphoneRightSide}>
          <img src={iphoneIMG} alt="" />
        </aside>
      </div>
    </div>
  );
};

export default About;
