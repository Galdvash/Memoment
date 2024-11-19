// src/hooks/useNavBar.js
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../hooks/DarkMode/DarkModeContext";
import { UserContext } from "../../hooks/UserHooks/userContextApp";
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider";
import axios from "axios";
import { toast } from "react-toastify";

const useNavBar = (onSearch) => {
  const { isSun, handleIconClick } = useContext(ThemeContext);
  const { userInformation, setUserInformation } = useContext(UserContext);
  const navigate = useNavigate();
  const apiUrl = useApiUrl();

  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearchIconClick = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      try {
        await axios.post(
          `${apiUrl}/api/users/logout`,
          {},
          { withCredentials: true }
        );
        localStorage.removeItem("token"); // מחיקת הטוקן מה-localStorage
        setUserInformation(null); // איפוס מידע המשתמש
        navigate("/");
        toast.success("Logged out successfully");
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("Logout failed!");
      }
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return {
    isSun,
    handleIconClick,
    isExpanded,
    searchQuery,
    isMenuOpen,
    handleSearchIconClick,
    handleLogout,
    toggleMenu,
    handleSearchInputChange,
    userInformation, // החזר את userInformation כדי לשמור על השימוש הנוכחי בקומפוננטה
  };
};

export default useNavBar;
