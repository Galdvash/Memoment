// AllUsersComponent.js
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../hooks/UserHooks/userContextApp";
import useGetAllUsers from "../../hooks/UserHooks/useGetAllUsers";
import Loading from "../Loading/Loading";
import axios from "axios";
import styles from "./SandBox.module.css";

function SandBox() {
  const { userInformation } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const allUsers = useGetAllUsers(token);
  const [users, setUsers] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    setUsers(allUsers);
  }, [allUsers]);

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${userId}`, {
        headers: { "x-auth-token": token },
      });
      console.log('Delete response:', response);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    setShowConfirmation(false);
    setUserIdToDelete(null);
  };

  const confirmDeleteUser = (userId) => {
    setShowConfirmation(true);
    setUserIdToDelete(userId);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setUserIdToDelete(null);
  };

  if (users.length === 0) {
    return <Loading />;
  }

  return (
    <div className="sandBoxContainer"> 
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <h2>All Users:</h2>
          {userInformation && userInformation?.isAdmin && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name.first}</td>
                      <td>{user.email}</td>
                      <td>{user.role || (user.isAdmin ? "Admin" : user.isBusiness ? "Business" : "User")}</td>
                      <td>
                        <button className={styles.button} onClick={() => confirmDeleteUser(user._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {showConfirmation && (
          <div className={styles.confirmation}>
            <div className={styles.confirmationBox}>
              <p  className={styles.pBox}>Are you sure you want to delete this user?</p>
              <button className={styles.buttonBox} onClick={() => handleDeleteUser(userIdToDelete)}>Yes</button>
              <button className={styles.buttonBox} onClick={cancelDelete}>No</button>
            </div>
          </div>
        )}
      </div>
    </div> 
  );
}

export default SandBox;
