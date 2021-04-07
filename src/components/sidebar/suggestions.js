import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import SuggestedProfile from "./suggested-profile";
import { getSuggestedProfiles } from "../../services/firebase";

export default function Suggestions({ userId, userFollowing }) {
  const [profiles, setProfiles] = useState(null);

  // Get suggested profiles from firestore.
  useEffect(() => {
    async function suggestedProfiles() {
      const response = await getSuggestedProfiles(userId, userFollowing);
      setProfiles(response);
    }

    if (userId && userFollowing) {
      suggestedProfiles();
    }
  }, [userId, userFollowing]);

  return !profiles ? (
    <Skeleton count={1} height={150} />
  ) : profiles.length > 0 ? (
    <div className="rounded flex flex-col">
      <div className="text-sm flex items-center align-middle justify-between mb-2">
        <p className="font-bold text-gray-base">Suggested for you</p>
      </div>
      <div className="mt-4 grid gap-5">
        {profiles.map((profile) => (
          <SuggestedProfile
            userId={userId}
            key={profile.userId}
            profileId={profile.userId}
            profileUsername={profile.username}
            userFollowing={userFollowing}
          />
        ))}
      </div>
    </div>
  ) : null;
}

Suggestions.propTypes = {
  userId: PropTypes.string,
  following: PropTypes.array,
};
