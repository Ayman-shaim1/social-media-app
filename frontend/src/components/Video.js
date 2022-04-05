import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";
const Video = ({ src }) => {
  // states:
  const [isPlay, setIsPlay] = useState(false);
  const [volumeStatus, setVolumeStatus] = useState("on");
  const [progress, setProgress] = useState(0);
  const [timestamp, setTimestamp] = useState("00:00");
  // ref's :
  const videoRef = useRef();
  const toggleVideoStatusHandler = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlay(true);
    } else {
      videoRef.current.pause();
      setIsPlay(false);
    }
  };

  const toggeVolumeStatusHandler = () => {
    if (volumeStatus === "on") {
      videoRef.current.volume = 0;
      setVolumeStatus("off");
    } else {
      videoRef.current.volume = 1;
      setVolumeStatus("on");
    }
  };

  const updateProgressHandler = () => {
    setProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100
    );
    // Get minutes :
    let mins = Math.floor(videoRef.current.currentTime / 60);
    if (mins < 10) {
      mins = "0" + String(mins);
    }
    // Get seconds :
    let secs = Math.floor(videoRef.current.currentTime % 60);
    if (secs < 10) {
      secs = "0" + String(secs);
    }

    setTimestamp(`${mins}:${secs}`);

    if (
      Math.ceil(videoRef.current.currentTime) ===
      Math.ceil(videoRef.current.duration)
    ) {
      setIsPlay(false);
    }
  };

  const setVideoProgressHandler = (e) => {
    setProgress(e.target.value);
    videoRef.current.currentTime =
      (+progress * videoRef.current.duration) / 100;
  };

  return (
    <div className="post-video-container">
      <video
        src={src}
        alt="post-video"
        className="post-video"
        ref={videoRef}
        onTimeUpdate={updateProgressHandler}></video>
      <button
        className="post-video-play-btn"
        onClick={toggleVideoStatusHandler}>
        {isPlay ? (
          <i className="fas fa-pause "></i>
        ) : (
          <i className="fas fa-play"></i>
        )}
      </button>
      <div className="controls">
        <div className="ifc-controls">
          <span className="timestamp" id="timestamp">
            {timestamp}
          </span>
          <span className="volume-btn" onClick={toggeVolumeStatusHandler}>
            {volumeStatus === "on" ? (
              <i className="fas fa-volume-high"></i>
            ) : (
              <i className="fas fa-volume-xmark"></i>
            )}
          </span>
        </div>
        <Form.Range
          value={progress}
          min={0}
          max={100}
          step={0.1}
          onChange={setVideoProgressHandler}
        />
      </div>
    </div>
  );
};

export default Video;
