import PropTypes from "prop-types";

export default function Image({ imageSrc, caption }) {
  return <img src={imageSrc} alt={caption} />;
}

Image.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
};
