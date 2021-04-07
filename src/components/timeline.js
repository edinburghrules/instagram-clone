import Skeleton from "react-loading-skeleton";
import usePhotos from "../hooks/use-photos";

export default function Timeline() {
  const { photos } = usePhotos();

  console.log(photos);
  return (
    <div className="container col-span-2">
      {photos?.length > 0 ? (
        photos.map((photo) => <p key={photo.docId}>{photo.imageSrc}</p>)
      ) : (
        <Skeleton className="mb-5" count={4} height={600} width={640} />
      )}
    </div>
  );
}
