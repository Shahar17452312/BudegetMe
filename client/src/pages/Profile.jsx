import { useEffect, useState } from "react";
import "../assets/styles/profile.css";
import HamburgerMenu from "../components/HamburgerMenu.jsx";
import axios from "axios";

function Profile() {
  const id = localStorage.getItem("user_id");
  const token = localStorage.getItem("accesstoken");

  const [keyOfData, setKeysOfData] = useState([]); // אחסון רשימת המפתחות והערכים

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:8080/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setKeysOfData(Object.entries(result.data));
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
  }, [id, token]); // הוספת תלות על id ו-token

  return (
    <div className="profile-container">
      <HamburgerMenu />
      <h1 className="profile-header">Profile Page</h1>
      <ul className="profile-list">
      {keyOfData.map(([key, value], index) => {
          if (key === "date_of_creation") {
            value = value.substring(0, 10); // חיתוך התאריך עד ל-10 תווים (YYYY-MM-DD)
          }
          return (
            <li key={index} className="profile-list-item">
              <span className="profile-list-key">{key}</span>:{" "}
              <span className="profile-list-value">{value}</span>
            </li>
          );
        })}

      </ul>
    </div>
  );
}

export default Profile;
