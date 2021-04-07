import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  updateLoggedInUserFollowing,
  updateFollowedProfilesFollowers,
} from "../../services/firebase";

export default function SuggestedProfile({
  userId,
  profileId,
  profileUsername,
}) {
  const [followed, setFollowed] = useState(false);

  async function handleFollow() {
    // Update userId following field to either add/remove profileId
    await updateLoggedInUserFollowing(userId, profileId, followed);

    // Update profileId followers field to either add/remove userId
    await updateFollowedProfilesFollowers(profileId, userId, followed);
    setFollowed(!followed);
  }

  return !followed ? (
    <div className="flex flex-row items-center align-middle justify-between">
      <div className="flex items-center justify-between">
        <img
          className="rounded-full w-8 flex mr-3"
          src={`/images/avatars/${profileUsername}.jpg`}
          alt={`${profileUsername}`}
        />
        <Link to={`/p/${profileUsername}`}>
          <p className="font-bold text-sm">{profileUsername}</p>
        </Link>
      </div>
      <button
        className="text-xs font-bold text-blue-medium"
        type="button"
        onClick={handleFollow}
      >
        Follow
      </button>
    </div>
  ) : null;
}

SuggestedProfile.propTypes = {
  userId: PropTypes.string.isRequired,
  profileId: PropTypes.string.isRequired,
  profileUsername: PropTypes.string.isRequired,
};
