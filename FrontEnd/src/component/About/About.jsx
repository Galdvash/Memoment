import React from "react";
import styleAbout from "./About.module.css";
import circleIMG from "../../images/add_circle_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 1.svg";
import sendToMobileIMG from "../../images/send_to_mobile_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 1.svg";
import securityIMG from "../../images/security_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 1.svg";
import faceIMG from "../../images/face_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 1.svg";
import checkedIMG from "../../images/checked-tick-svgrepo-com 3.svg";

const About = () => {
  return (
    <div className={styleAbout.body}>
      <header className={styleAbout.header}>
        <h1 className={styleAbout.title}>
          Share your photos from your event using facial recognition{" "}
        </h1>
        <p>
          With quick facial recognition, your event guests won’t need to search
          through thousands of photos. They will receive their personal photos
          in seconds
        </p>
      </header>

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
    </div>
  );
};

export default About;
