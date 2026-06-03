export default function VideoCardSkeleton() {
  return (
    <div className="bili-video-card__skeleton">
      {/* 封面骨架 */}
      <div className="bili-video-card__skeleton--cover skeleton" />

      {/* 信息区骨架 */}
      <div className="bili-video-card__skeleton--info">
        <div className="bili-video-card__skeleton--right">
          <div className="bili-video-card__skeleton--text skeleton" />
          <div className="bili-video-card__skeleton--text skeleton" />
          <div className="bili-video-card__skeleton--light skeleton" />
        </div>
      </div>
    </div>
  );
}
