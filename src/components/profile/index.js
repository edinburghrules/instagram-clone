import { useReducer, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import Header from "./header";
import { getProfilePhotosByUserId } from "../../services/firebase";
// import Photos from "./photos";

// Uses the userProfile recieved as props to get all the photos belonging to that userProfile.
// Photos are them stored in the reducer, along with the user profile, and the total followers
// that profile has.
// These are passed down as props, along with a dispatch function (setFollowerCount). This will
// be used in the Header component to update the number of followers when a button is clicked
// to either follow/ unfollow that profile.
export default function UserProfile({ userProfile }) {
  const initialState = {
    profile: {},
    photosCollection: [],
    followerCount: 0,
  };

  function reducer(state, newState) {
    return {
      ...state,
      ...newState,
    };
  }

  const [{ profile, photosCollection, followerCount }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function getProfileInfoAndPhotos() {
      const photos = await getProfilePhotosByUserId(userProfile.userId);
      dispatch({
        profile: userProfile,
        photosCollection: photos,
        followerCount: userProfile.followers.length,
      });
    }
    if (userProfile) {
      getProfileInfoAndPhotos();
    }
  }, [userProfile]);

  return (
    <Fragment>
      <Header
        profile={profile}
        photosCount={photosCollection.length > 0 ? photosCollection.length : 0}
        followerCount={followerCount}
        setFollowerCount={dispatch}
      />
      {/* <Photos photos={photosCollection} /> */}
    </Fragment>
  );
}

UserProfile.propTypes = {
  user: PropTypes.shape({
    dateCreated: PropTypes.number,
    emailAddress: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array,
    fullName: PropTypes.string,
    userId: PropTypes.string,
    username: PropTypes.string,
  }),
};
