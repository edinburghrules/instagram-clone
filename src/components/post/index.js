import { useRef } from "react";
import PropTypes from "prop-types";
import Header from "./header";
import Image from "./image";

export default function Post({ photoData }) {
  return (
    <div className="rounded col-span-4 border bg-white border-gray-primary mb-12">
      <Header username={photoData.username} />
      <Image imageSrc={photoData.imageSrc} caption={photoData.caption} />
    </div>
  );
}

Post.propTypes = {
  photoData: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    docId: PropTypes.string.isRequired,
    userLikedPhoto: PropTypes.bool.isRequired,
    likes: PropTypes.array.isRequired,
    comments: PropTypes.array.isRequired,
    dateCreated: PropTypes.number.isRequired,
  }),
};
