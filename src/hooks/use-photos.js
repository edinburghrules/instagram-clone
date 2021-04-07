import { useState, useEffect } from "react";
import useUser from "../hooks/use-user";
import { getPhotos } from "../services/firebase";

/*
 * usePhotos hook gets photos from firestore.
 * It gets photos (array) where the user is following the profile
 * who posted the photo. It sorts them so newest photos
 * come first. It return the sorted photos array.
 */

export default function usePhotos() {
  const [photos, setPhotos] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    async function getTimelinePhotos() {
      if (user?.following) {
        const { userFollowedPhotos } = await getPhotos(
          user.userId,
          user.following
        );

        userFollowedPhotos.sort((a, b) => {
          return b.created - a.created;
        });

        setPhotos(userFollowedPhotos);
      }
    }
    getTimelinePhotos();
  }, [user]);

  return { photos };
}
