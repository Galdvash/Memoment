import React, { useContext } from "react";
import { UserContext } from "../../../hooks/UserHooks/userContextApp";
import checkedIMG from "../../../images/checked-tick-svgrepo-com 3.svg";
import styles from "./RegularPackages.module.css";

const RegularPackages = () => {
  const { userInformation } = useContext(UserContext);

  if (userInformation?.role !== "user") {
    return <p>Access Denied. This page is for regular users only.</p>;
  }

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
              <button className={styles.btn}>Choose Package</button>
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
              <button className={styles.btn}>Choose Package</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegularPackages;
