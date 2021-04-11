import Skeleton from "react-loading-skeleton";
import usePhotos from "../hooks/use-photos";
import Post from "./post/index";

export default function Timeline() {
  const { photos } = usePhotos();
  return (
    <div className="container col-span-2">
      {!photos ? (
        <Skeleton count={4} width={640} height={500} className="mb-5" />
      ) : photos.length > 0 ? (
        photos.map((photoData) => (
          <Post key={photoData.docId} photoData={photoData} />
        ))
      ) : null}
      {!photos ||
        (photos.length === 0 && (
          <p className="text-center text-2xl">Follow Someone To See Posts</p>
        ))}
    </div>
  );
}
