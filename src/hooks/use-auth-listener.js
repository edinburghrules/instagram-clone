import { useState, useEffect, useContext } from "react";
import FirebaseContext from "../context/firebase";

/*
 * useAuthListener hook runs whenever firebase
 * changes. If there is a user it returns that user.
 * If there is no user then is return null.
 */

export default function useAuthListener() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("authUser"))
  );
  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        localStorage.setItem("authUser", JSON.stringify(authUser));
        setUser(authUser);
      } else {
        localStorage.removeItem("authUser");
        setUser(null);
      }
    });
  }, [firebase]);

  return { user };
}
