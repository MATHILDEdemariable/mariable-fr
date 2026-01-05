const FeaturedImage = ({ presta }) => {
  const photos = presta.prestataires_photos_preprod;
  const featured = Array.isArray(photos)
    ? photos.find((photo) => photo.is_cover) || photos.find((photo) => photo.principale) || (photos.length > 0 ? photos[0] : null)
    : null;
  return (
    <img
      src={featured?.url || "https://placehold.co/1920x1920?text=No+Image"}
      alt={presta.nom}
      className="object-cover w-full h-full "
    />
  );
};

export default FeaturedImage;