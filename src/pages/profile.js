import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getUserProfileByUsername } from "../services/firebase";
import * as ROUTES from "../constants/routes";
import Header from "../components/header";
import UserProfile from "../components/profile/index";

// Get user profile object from firestore, and once recieved,
// send down as props to UserProfile component.
export default function Profile() {
  const { username } = useParams();
  const history = useHistory();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    async function checkUserExists() {
      const user = await getUserProfileByUsername(username);
      if (user) {
        setUserProfile(user);
      } else {
        history.push(ROUTES.NOT_FOUND);
      }
    }
    checkUserExists();
  }, [username, history]);

  return userProfile ? (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg">
        <UserProfile userProfile={userProfile} />
      </div>
    </div>
  ) : null;
}
