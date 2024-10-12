import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import checkedIMG from "../../images/checked-tick-svgrepo-com 3.svg";
import stylePackages from "./Packages.module.css";
import "./packages.css";
const Packages = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/register");
  };
  useEffect(() => {
    // הוספת המחלקה noScroll ל-body
    document.body.classList.add("noscroll");

    // הסרת המחלקה noScroll כאשר הקומפוננטה מתנתקת
    return () => {
      document.body.classList.remove("noscroll");
    };
  }, []);
  return (
    <div className="bodyPackage noScroll">
      <div className={stylePackages.bodyPackages}>
        <section className={stylePackages.sectionContainer}>
          <div className={stylePackages.packagesIntro}>
            <h3>Memento's Packages</h3>
            <p>
              Below is a list of our packages. Choose the one that suits you
              best and let’s create unforgettable experiences!
            </p>
          </div>
          <div className={stylePackages.cardsContainer}>
            <div className={stylePackages.cardPackage}>
              <div className={stylePackages.titleCard}>
                <p className={stylePackages.s}>The Best Seller</p>
              </div>
              <div className={stylePackages.centerText}>
                <h2>500 Pictures</h2>
                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>Free image distribution</span>
                </div>
                <p>Allow your guests free access to the images</p>
                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>Image sales</span>
                </div>
                <p>Sell event photos to your guests</p>
                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>10% sales commission</span>
                </div>
                <p>You receive 90% of the revenue from photo sales</p>
                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>Personal branding</span>
                </div>
                <p>Promote your brand</p>
                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>Unlimited guests</span>
                </div>
                <p>No limit on the number of guests</p>
                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>A full year</span>
                </div>
                <p>Of image storage and management access</p>
                <button className={stylePackages.btn} onClick={handleClick}>
                  Create Event Now
                </button>{" "}
              </div>
            </div>
            <div className={stylePackages.cardPackage}>
              <div className={stylePackages.titleCard}>
                <p className={stylePackages.s}>The Best Seller</p>
              </div>
              <div className={stylePackages.centerText}>
                <h2>500 Pictures</h2>
                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>Free image distribution</span>
                </div>
                <p>Allow your guests free access to the images</p>
                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>Image sales</span>
                </div>
                <p>Sell event photos to your guests</p>
                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>10% sales commission</span>
                </div>
                <p>You receive 90% of the revenue from photo sales</p>
                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>Personal branding</span>
                </div>
                <p>Promote your brand</p>
                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>Unlimited guests</span>
                </div>
                <p>No limit on the number of guests</p>
                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>A full year</span>
                </div>
                <p>Of image storage and management access</p>
                <button className={stylePackages.btn} onClick={handleClick}>
                  Create Event Now
                </button>{" "}
              </div>
            </div>
            <div className={stylePackages.cardPackage}>
              <div className={stylePackages.titleCard}>
                <p className={stylePackages.s}>The Best Seller</p>
              </div>
              <div className={stylePackages.centerText}>
                <h2>500 Pictures</h2>

                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>Free image distribution</span>
                </div>
                <p>Allow your guests free access to the images</p>

                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>Image sales</span>
                </div>
                <p>Sell event photos to your guests</p>

                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>10% sales commission</span>
                </div>
                <p>You receive 90% of the revenue from photo sales</p>

                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>Personal branding</span>
                </div>
                <p>Promote your brand</p>

                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>Unlimited guests</span>
                </div>
                <p>No limit on the number of guests</p>

                <div className={stylePackages.item}>
                  <img
                    src={checkedIMG}
                    alt="checked"
                    className={stylePackages.icon}
                  />
                  <span>A full year</span>
                </div>
                <p>Of image storage and management access</p>
                <button className={stylePackages.btn} onClick={handleClick}>
                  Create Event Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Packages;
