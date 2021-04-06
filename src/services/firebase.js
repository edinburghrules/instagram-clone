import { firebase } from "../lib/firebase";

export async function doesUsernameExist(username) {
  const doc = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  return doc.docs.length > 0 ? true : false;
}

export async function getUserByUserId(userId) {
  try {
    const doc = await firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get();

    if (doc.exists) {
      const user = {
        ...doc.data(),
      };

      return user;
    } else {
      console.log("No such document");
    }
  } catch (error) {
    console.log("Error getting document: ", error);
  }
}
