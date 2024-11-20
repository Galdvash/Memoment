import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../hooks/UserHooks/userContextApp";
import axios from "axios";
import { useApiUrl } from "../../../hooks/ApiUrl/ApiProvider";
import checkedIMG from "../../../images/checked-tick-svgrepo-com 3.svg";
import styles from "./RegularPackages.module.css";

const RegularPackages = () => {
  const { userInformation } = useContext(UserContext);
  const navigate = useNavigate();
  const apiUrl = useApiUrl();
  const [hasAlbum, setHasAlbum] = useState(false);

  useEffect(() => {
    const checkUserAlbums = async () => {
      if (userInformation?.role === "user") {
        try {
          const response = await axios.get(`${apiUrl}/api/albums`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          // אם יש לפחות אלבום אחד, עדכן את המצב
          if (response.data.length > 0) {
            setHasAlbum(true);
          }
        } catch (error) {
          console.error("Error checking albums:", error);
        }
      }
    };

    checkUserAlbums();
  }, [userInformation, apiUrl]);

  // ניתוב למשתמשים רגילים שלא מורשים
  if (userInformation?.role !== "user") {
    return <p>Access Denied. This page is for regular users only.</p>;
  }

  // אם למשתמש כבר יש אלבום
  const handleNavigate = () => {
    if (hasAlbum) {
      navigate("/all-albums");
    } else {
      navigate("/CreateAlbum");
    }
  };

  return (
    <div className={styles.bodyPackages}>
      <section className={styles.sectionContainer}>
        <div className={styles.packagesIntro}>
          <h3>Regular User Packages</h3>
          <p>
            Choose from our basic packages tailored for regular users. Enjoy
            exclusive features and benefits!
          </p>
        </div>
        <div className={styles.cardsContainer}>
          {/* Package 1 */}
          <div className={styles.cardPackage}>
            <div className={styles.titleCard}>
              <p>Basic</p>
            </div>
            <div className={styles.centerText}>
              <h2>200 Pictures</h2>
              <div className={styles.item}>
                <img src={checkedIMG} alt="checked" className={styles.icon} />
                <span>Free image distribution</span>
              </div>
              <p>Allow guests free access to event photos.</p>
              <div className={styles.item}>
                <img src={checkedIMG} alt="checked" className={styles.icon} />
                <span>Unlimited guests</span>
              </div>
              <p>Include all your guests without limits.</p>
              <button className={styles.btn} onClick={handleNavigate}>
                Choose Package
              </button>
            </div>
          </div>

          {/* Package 2 */}
          <div className={styles.cardPackage}>
            <div className={styles.titleCard}>
              <p>Premium</p>
            </div>
            <div className={styles.centerText}>
              <h2>500 Pictures</h2>
              <div className={styles.item}>
                <img src={checkedIMG} alt="checked" className={styles.icon} />
                <span>Free image distribution</span>
              </div>
              <p>Allow guests free access to event photos.</p>
              <div className={styles.item}>
                <img src={checkedIMG} alt="checked" className={styles.icon} />
                <span>One year storage</span>
              </div>
              <p>Keep all your event memories safely stored for a year.</p>
              <button className={styles.btn} onClick={handleNavigate}>
                Choose Package
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegularPackages;
