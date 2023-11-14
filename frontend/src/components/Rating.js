function Rating(props) {
  const { rating, numReviews, caption } = props;

  const getStarClassName = (index) => {
    const roundedRating = Math.round(rating * 2) / 2;
    return index <= roundedRating
      ? 'fas fa-star'
      : index - 0.5 === roundedRating
      ? 'fas fa-star-half-alt'
      : 'far fa-star';
  };

  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((index) => (
        <span key={index}>
          <i className={getStarClassName(index)} />
        </span>
      ))}
      {caption ? (
        <span>{caption}</span>
      ) : (
        <span>{' ' + numReviews + ' reviews'}</span>
      )}
    </div>
  );
}

export default Rating;
