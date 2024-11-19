import * as faceapi from "@vladmandic/face-api";
import "@tensorflow/tfjs"; // ייבוא TensorFlow.js רגיל
import canvas from "canvas";
import path from "path";

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const modelPath = path.join(process.cwd(), "models");

// פונקציה לטעינת המודלים
export async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
  console.log("Models loaded");
}

// פונקציה לקבלת descriptor של פנים
export async function getFaceDescriptor(imagePath) {
  const img = await canvas.loadImage(imagePath);
  const detections = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!detections) {
    return null;
  }
  return detections.descriptor;
}
