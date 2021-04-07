import Skeleton from "react-loading-skeleton";
import usePhotos from "../hooks/use-photos";
import Post from "./post/index";

export default function Timeline() {
  const { photos } = usePhotos();

  return (
    <div className="container col-span-2">
      {photos?.length > 0 ? (
        photos.map((photoData) => (
          <Post key={photoData.docId} photoData={photoData} />
        ))
      ) : (
        <Skeleton className="mb-5" count={4} height={600} width={640} />
      )}
    </div>
  );
}
