'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  poster?: string;
}

export default function VideoPlayer({ videoUrl, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.buffered.length > 0) {
        setBuffered(videoRef.current.buffered.end(videoRef.current.buffered.length - 1));
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      videoRef.current.currentTime = percent * duration;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) {
      videoRef.current.volume = v;
      setIsMuted(v === 0);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSpeedMenu(false);
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      resetHideTimer();
    } else {
      setShowControls(true);
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    }
  }, [isPlaying, resetHideTimer]);

  return (
    <div
      ref={containerRef}
      className="relative bg-black group cursor-pointer"
      onMouseMove={resetHideTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* 中间播放按钮 */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M8 4l16 10-16 10V4z" fill="white" />
            </svg>
          </div>
        </div>
      )}

      {/* 底部控制栏 */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 渐变背景 */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative px-4 pb-3 pt-10">
          {/* 进度条 */}
          <div
            className="relative h-[3px] bg-white/20 rounded-full cursor-pointer group/progress mb-2.5 hover:h-[5px] transition-all"
            onClick={handleSeek}
          >
            {/* 缓冲 */}
            <div
              className="absolute top-0 left-0 h-full bg-white/30 rounded-full"
              style={{ width: duration > 0 ? `${(buffered / duration) * 100}%` : '0%' }}
            />
            {/* 已播放 */}
            <div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                background: 'var(--brand-blue)',
              }}
            />
            {/* 拖拽点 */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{
                left: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                marginLeft: '-6px',
                background: 'var(--brand-blue)',
              }}
            />
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* 播放/暂停 */}
              <button onClick={togglePlay} className="text-white hover:text-[var(--brand-blue)] transition-colors p-0.5">
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="4" y="3" width="4" height="14" rx="1" fill="white" />
                    <rect x="12" y="3" width="4" height="14" rx="1" fill="white" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 3l12 7-12 7V3z" fill="white" />
                  </svg>
                )}
              </button>

              {/* 时间 */}
              <span className="text-white text-[12px] tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* 倍速 */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="text-white text-[12px] hover:text-[var(--brand-blue)] transition-colors px-1.5 py-0.5 rounded"
                >
                  {playbackRate}x
                </button>
                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-[#2a2a2a] rounded-lg py-1 min-w-[80px] animate-bili-fade-in">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changePlaybackRate(rate)}
                        className={`w-full text-left px-3 py-1.5 text-[12px] transition-colors ${
                          playbackRate === rate
                            ? 'text-[var(--brand-blue)] bg-white/10'
                            : 'text-white/80 hover:bg-white/10'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 音量 */}
              <div
                className="flex items-center gap-1"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <button onClick={toggleMute} className="text-white hover:text-[var(--brand-blue)] transition-colors p-0.5">
                  {isMuted || volume === 0 ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M2 6.5h2.5L9 3v12l-4.5-3.5H2a1 1 0 01-1-1v-3a1 1 0 011-1z" fill="white" />
                      <path d="M13 6l3 6M16 6l-3 6" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  ) : volume > 0.5 ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M2 6.5h2.5L9 3v12l-4.5-3.5H2a1 1 0 01-1-1v-3a1 1 0 011-1z" fill="white" />
                      <path d="M12 5.5c1.3 1.2 2 2.8 2 4.5s-.7 3.3-2 4.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M14 3.5c2 1.8 3 4.2 3 6.5s-1 4.7-3 6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M2 6.5h2.5L9 3v12l-4.5-3.5H2a1 1 0 01-1-1v-3a1 1 0 011-1z" fill="white" />
                      <path d="M12 5.5c1.3 1.2 2 2.8 2 4.5s-.7 3.3-2 4.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
                {showVolumeSlider && (
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                )}
              </div>

              {/* 弹幕开关 */}
              <button className="text-white hover:text-[var(--brand-blue)] transition-colors p-0.5" title="弹幕">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="1" y="3" width="16" height="12" rx="2" stroke="white" strokeWidth="1.2" />
                  <path d="M4 7h6M4 10h10M7 13h4" stroke="white" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </button>

              {/* 画中画 */}
              <button className="text-white hover:text-[var(--brand-blue)] transition-colors p-0.5" title="画中画">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="1" y="3" width="16" height="12" rx="2" stroke="white" strokeWidth="1.2" />
                  <rect x="9" y="9" width="6" height="4" rx="1" fill="white" />
                </svg>
              </button>

              {/* 全屏 */}
              <button onClick={toggleFullscreen} className="text-white hover:text-[var(--brand-blue)] transition-colors p-0.5" title="全屏">
                {isFullscreen ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M6 2v4H2M12 2v4h4M6 16v-4H2M12 16v-4h4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2 6V2h4M12 2h4v4M16 12v4h-4M6 16H2v-4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
