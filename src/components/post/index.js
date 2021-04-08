import { useRef } from "react";
import PropTypes from "prop-types";
import Header from "./header";
import Image from "./image";
import Actions from "./actions";
import Footer from "./footer";
import Comments from "./comments";

export default function Post({ photoData }) {
  const commentInput = useRef(null);
  function handleFocus() {
    commentInput.current.focus();
  }

  return (
    <div className="rounded col-span-4 border bg-white border-gray-primary mb-12">
      <Header username={photoData.username} />
      <Image imageSrc={photoData.imageSrc} caption={photoData.caption} />
      <Actions
        docId={photoData.docId}
        userLikedPhoto={photoData.userLikedPhoto}
        totalLikes={photoData.likes.length}
        handleFocus={handleFocus}
      />
      <Footer username={photoData.username} caption={photoData.caption} />
      <Comments
        docId={photoData.docId}
        allComments={photoData.comments}
        posted={photoData.dateCreated}
        commentInput={commentInput}
      />
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
