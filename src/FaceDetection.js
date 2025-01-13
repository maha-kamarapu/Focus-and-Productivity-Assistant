import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { load } from '@tensorflow-models/blazeface';

const FaceDetection = ({ onDistractionChange }) => {
  const [model, setModel] = useState(null);
  const [isDistracted, setIsDistracted] = useState(false); 
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const blazeFaceModel = await load();
      setModel(blazeFaceModel);
    };
    loadModel();
  }, []);

  // Start video feed
  useEffect(() => {
    if (videoRef.current && model) {
      const startVideo = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch((err) => console.error('Video play failed:', err));
          };
        } catch (err) {
          console.error('Error accessing webcam:', err);
        }
      };
      startVideo();
    }
  }, [model]);

  // Detect faces and check for distractions
  useEffect(() => {
    if (model && videoRef.current) {
      const detectFaces = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (video.videoWidth > 0 && video.videoHeight > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Get face predictions
          const predictions = await model.estimateFaces(video, false);
          ctx.clearRect(0, 0, canvas.width, canvas.height); 
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height); 

          let faceDetected = false;

          // Draw face rectangles on canvas
          predictions.forEach((prediction) => {
            ctx.beginPath();
            ctx.rect(
              prediction.topLeft[0],
              prediction.topLeft[1],
              prediction.bottomRight[0] - prediction.topLeft[0],
              prediction.bottomRight[1] - prediction.topLeft[1]
            );
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Check if the face is in the frame
            const isFaceInFrame =
              prediction.topLeft[0] >= 0 &&
              prediction.topLeft[1] >= 0 &&
              prediction.bottomRight[0] <= canvas.width &&
              prediction.bottomRight[1] <= canvas.height;

            if (isFaceInFrame) {
              faceDetected = true;
            }
          });

          // Update distraction state
          const distractionState = !faceDetected;
          if (distractionState !== isDistracted) {
            setIsDistracted(distractionState);
            if (onDistractionChange) {
              onDistractionChange(distractionState);
            }
          }
        }

        requestAnimationFrame(detectFaces);
      };

      detectFaces();
    }
  }, [model, isDistracted, onDistractionChange]);

  return (
    <div>
      <h2>{isDistracted ? 'You are distracted!' : 'Focus detected'}</h2>
      {/* Video feed hidden */}
      <video ref={videoRef} style={{ display: 'none' }} />
      {/* Canvas displays overlay */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default FaceDetection;








