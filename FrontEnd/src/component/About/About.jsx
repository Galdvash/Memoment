import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../hooks/UserHooks/userContextApp";
import checkedIMG from "../../images/checked-tick-svgrepo-com 3.svg";
import iphoneIMG from "../../images/Iphone 1 (1).svg";
import securityIMG from "../../images/Shield.svg";
import faceIMG from "../../images/Face.svg";
import circleIMG from "../../images/Plus.svg";
import sendToMobileIMG from "../../images/Mobile.svg";
import gradientIMG from "../../images/Ellipse 8 (2).svg";
import LodingCamera from "../../Library/LoadingCamera";
import styleAbout from "./About.module.css";
import mediaAbout from "./Media.module.css";

const About = () => {
  const navigate = useNavigate();
  const { userInformation, loading } = useContext(UserContext);
  const handleNavigate = () => {
    if (userInformation) {
      navigate("/packages");
    } else {
      navigate("/register");
    }
  };

  if (loading) {
    return <LodingCamera />;
  }
  return (
    <div
      className={`bodyAbout ${styleAbout.bodyAbout} ${mediaAbout.bodyAbout}`}
    >
      <div className={`${styleAbout.container} ${mediaAbout.container}`}>
        <header className={`${styleAbout.header} ${mediaAbout.header}`}>
          <div className={`${styleAbout.textBox} ${mediaAbout.textBox}`}>
            <h1>
              Make your event unforgettable <br /> with advanced facial
              recognition
            </h1>
            <p>
              Upload your event photos to a smart digital gallery, share it with
              your guests, and they can easily find their photos with just a
              quick selfie. <br /> Our technology gives each guest instant
              access to their pictures and the full album.
            </p>
          </div>

          <div className={`${styleAbout.flexBoxOne} ${mediaAbout.flexBoxOne}`}>
            <div className={`${styleAbout.flexItem} ${mediaAbout.flexItem}`}>
              <span className={`${styleAbout.numbers} ${mediaAbout.numbers}`}>
                1
              </span>
              <img
                className={`${styleAbout.img} ${mediaAbout.img}`}
                src={circleIMG}
                alt=""
              />
              <p>Create a new event in just a few minutes</p>
            </div>

            <div className={`${styleAbout.flexItem} ${mediaAbout.flexItem}`}>
              <span className={`${styleAbout.numbers} ${mediaAbout.numbers}`}>
                2
              </span>
              <img
                className={`${styleAbout.img} ${mediaAbout.img}`}
                src={sendToMobileIMG}
                alt=""
              />
              <p>View photos after a quick and secure verification</p>
            </div>
          </div>
          <div className={`${styleAbout.flexBoxTwo} ${mediaAbout.flexBoxTwo}`}>
            <div className={`${styleAbout.flexItem} ${mediaAbout.flexItem}`}>
              <span className={`${styleAbout.numbers} ${mediaAbout.numbers}`}>
                3
              </span>
              <img
                className={`${styleAbout.img} ${mediaAbout.img}`}
                src={securityIMG}
                alt=""
              />
              <p>Guests receive an invitation link to view the gallery</p>
            </div>
            <div className={`${styleAbout.flexItem} ${mediaAbout.flexItem}`}>
              <span className={`${styleAbout.numbers} ${mediaAbout.numbers}`}>
                4
              </span>
              <img
                className={`${styleAbout.img} ${mediaAbout.img}`}
                src={faceIMG}
                alt=""
              />
              <p>
                Facial recognition process will allow the guest to receive the
                photos in which they appear.
              </p>
            </div>
          </div>

          <section
            className={`${styleAbout.checkedList} ${mediaAbout.checkedList}`}
          >
            <div>
              <img src={checkedIMG} alt=""></img> 99.4% Accuracy
            </div>
            <div>
              <img src={checkedIMG} alt=""></img> All the information is secure
            </div>
            <div>
              <img src={checkedIMG} alt=""></img> Your guests will love you!
            </div>
          </section>
          <button
            onClick={handleNavigate}
            className={`${styleAbout.btn} ${mediaAbout.btn}`}
          >
            Create New Event
          </button>
        </header>
      </div>
      <img
        className={`${styleAbout.gradientIMG} ${mediaAbout.gradientIMG}`}
        src={gradientIMG}
        alt="gradient"
      />
      <img
        className={`${styleAbout.iphoneIMG} ${mediaAbout.iphoneIMG}`}
        src={iphoneIMG}
        alt=""
      />
    </div>
  );
};

export default About;
