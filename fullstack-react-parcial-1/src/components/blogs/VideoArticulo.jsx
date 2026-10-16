function VideoArticulo({ src, poster, descripcion }) {
  return (
    <div className="blog-detail-video">
      <div className="video-card-container">
        <video
          controls
          poster={poster}
          preload="metadata"
          playsInline
          className="responsive-video"
        >
          <source src={src} type="video/mp4" />
          Tu navegador no soporta la reproducción de video HTML5.
        </video>
      </div>
      <p className="blog-video-caption">{descripcion}</p>
    </div>
  );
}

export default VideoArticulo;
