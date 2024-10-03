import React,{useContext} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../hooks/UserHooks/userContextApp";
import styleFooter from "./Footer.module.css"
import  "./Footer.css"

const Footer = () => {
  const { userInformation } = useContext(UserContext);

  return (
 <footer className="bodyFooter">
    <div className={styleFooter.footerContainer}>
      {  userInformation?.isBusiness && (
  <li>
  <Link className="link" to={"/favCards"}>
      Favorit Cards
  </Link>
</li>
      )}
      {userInformation && !userInformation?.isBusiness && (
          <li>
          <Link className="link" to={"/favCards"}>
              Favorit Cards
          </Link>
        </li>
      )}
    
    </div>
  </footer>
     
   
  );
};

export default Footer;
