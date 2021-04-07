import { firebase, FieldValue } from "../lib/firebase";

export async function doesUsernameExist(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  return result.docs.length > 0 ? true : false;
}

export async function getUserByUserId(userId) {
  try {
    const result = await firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get();

    if (result.exists) {
      const user = {
        ...result.data(),
      };

      return user;
    } else {
      console.log("No such document");
    }
  } catch (error) {
    console.log("Error getting document: ", error);
  }
}

// Gets all user profile documents from users collection not including the signed in users.
// Filters them to not include profiles that are being followed by signed in user.
export async function getSuggestedProfiles(userId) {
  try {
    const allProfiles = [];

    const querySnapshot = await firebase
      .firestore()
      .collection("users")
      .where("userId", "!=", userId)
      .get();

    querySnapshot.forEach((doc) => allProfiles.push(doc.data()));

    const suggestedProfiles = allProfiles.filter(
      (profile) => !profile.followers.includes(userId)
    );

    return suggestedProfiles;
  } catch (error) {
    console.log(error);
  }
}

// If user not following profile, add profileId to users following array.
// If user is following profile, remove profileId from users following array.
export async function updateLoggedInUserFollowing(
  userId,
  profileId,
  isFollowingProfile
) {
  console.log(userId, profileId, isFollowingProfile);
  try {
    await firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .update({
        following: isFollowingProfile
          ? FieldValue.arrayRemove(profileId)
          : FieldValue.arrayUnion(profileId),
      });
  } catch (error) {
    console.log("Error updating document: ", error);
  }
}

// If profile is not followed by user, add userId to profiles followers array.
// If profile is followed by user, remove userId to profiles followers array.
export async function updateFollowedProfilesFollowers(
  profileId,
  userId,
  isFollowedByUser
) {
  console.log(profileId, userId, isFollowedByUser);
  try {
    await firebase
      .firestore()
      .collection("users")
      .doc(profileId)
      .update({
        followers: isFollowedByUser
          ? FieldValue.arrayRemove(userId)
          : FieldValue.arrayUnion(userId),
      });
    console.log("Successfully updated document: ", profileId);
  } catch (error) {
    console.log("There has been an error updating document: ", error);
  }
}

// Get users timeline photos
export async function getPhotos(userId, userFollowing) {
  try {
    let userFollowedPhotos = [];

    const result = await firebase
      .firestore()
      .collection("photos")
      .where("userId", "in", userFollowing)
      .get();

    result.forEach((doc) =>
      userFollowedPhotos.push({ ...doc.data(), docId: doc.id })
    );

    userFollowedPhotos = userFollowedPhotos.map((photo) => {
      if (photo.likes.includes(userId)) {
        return {
          ...photo,
          liked: true,
        };
      } else {
        return {
          ...photo,
          liked: false,
        };
      }
    });

    return { userFollowedPhotos };
  } catch (error) {
    console.log("Error getting photos: ", error);
  }
}
