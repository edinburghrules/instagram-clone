import { useState, useEffect, useContext } from "react";
import UserContext from "../context/user";
import { getUserByUserId } from "../services/firebase";

/*
 * useUser hook runs whenever user object from user context changes.
 * When there is a logged in user, the user uid is passed in to
 * getUserByUserId which will then return that users details object
 * from firestore. This user details object is then returned to component
 * to use user details like username, fullname, email etc.
 */

export default function useUser() {
  const [activeUser, setActiveUser] = useState({});
  const { user } = useContext(UserContext);

  useEffect(() => {
    async function getUserObjByUserId() {
      const response = await getUserByUserId(user.uid);
      setActiveUser(response);
    }

    if (user?.uid) {
      getUserObjByUserId();
    }
  }, [user]);

  return { user: activeUser };
}
