const FeaturedImage = ({ presta }) => {
  const photos = presta.prestataires_photos_preprod;
  const featured = Array.isArray(photos)
    ? photos.find((photo) => photo.principale)
    : null;

  return (
    <img
      src={featured?.url || "https://placehold.co/150x150?text=No+Image"}
      alt={presta.nom}
      className="w-16 h-16 object-cover"
    />
  );
};

export default FeaturedImage;