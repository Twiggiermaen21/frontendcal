
'use client'
import React, { useRef, useState, useEffect } from 'react';

export default function DrawingMaskApp() {
  const combinedCanvasRef = useRef(null);
  const drawingOnlyCanvasRef = useRef(null);
  const imgRef = useRef(new Image());
  const [brushSize, setBrushSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!imageSrc) return;
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      const canvas = combinedCanvasRef.current;
      const drawCanvas = drawingOnlyCanvasRef.current;
      canvas.width = width;
      canvas.height = height;
      drawCanvas.width = width;
      drawCanvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = '#FFFFFF';

      const drawCtx = drawCanvas.getContext('2d');
      drawCtx.clearRect(0, 0, width, height);
      drawCtx.fillStyle = '#000000';
      drawCtx.fillRect(0, 0, width, height);
      drawCtx.lineCap = 'round';
      drawCtx.lineJoin = 'round';
      drawCtx.lineWidth = brushSize;
      drawCtx.strokeStyle = '#FFFFFF';
    };
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    const ctx = combinedCanvasRef.current?.getContext('2d');
    const drawCtx = drawingOnlyCanvasRef.current?.getContext('2d');
    if (ctx) ctx.lineWidth = brushSize;
    if (drawCtx) drawCtx.lineWidth = brushSize;
  }, [brushSize]);

  const startDrawing = ({ nativeEvent }) => {
    const canvas = combinedCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (nativeEvent.clientX - rect.left) * scaleX;
    const y = (nativeEvent.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    const drawCtx = drawingOnlyCanvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    drawCtx.beginPath();
    drawCtx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const canvas = combinedCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (nativeEvent.clientX - rect.left) * scaleX;
    const y = (nativeEvent.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    const drawCtx = drawingOnlyCanvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    drawCtx.lineTo(x, y);
    drawCtx.stroke();
  };

  const endDrawing = () => {
    const ctx = combinedCanvasRef.current.getContext('2d');
    const drawCtx = drawingOnlyCanvasRef.current.getContext('2d');
    ctx.closePath();
    drawCtx.closePath();
    setIsDrawing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearCanvas = () => {
    const canvas = combinedCanvasRef.current;
    const drawCanvas = drawingOnlyCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const drawCtx = drawCanvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    if (imageSrc) {
      const img = imgRef.current;
      ctx.drawImage(img, 0, 0);
      drawCtx.fillStyle = '#000000';
      drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
    }
  };

  const downloadDrawing = () => {
    const drawCanvas = drawingOnlyCanvasRef.current;
    const link = document.createElement('a');
    link.download = 'brush_strokes_on_black.png';
    link.href = drawCanvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-100 min-h-screen">
      <div className="space-y-6 col-span-1 bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Rysuj na zdjęciu</h1>
        <label className="block text-sm font-medium text-gray-700">
          Wgraj zdjęcie:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Rozmiar pędzla:</span>
          <input
            type="range"
            min="1"
            max="100"
            value={brushSize}
            onChange={e => setBrushSize(Number(e.target.value))}
            className="w-full mt-2 accent-blue-600"
          />
          <div className="text-sm text-gray-500 mt-1">Aktualnie: {brushSize}px</div>
        </label>

        <button
          onClick={clearCanvas}
          className="w-full bg-red-100 text-red-700 hover:bg-red-200 font-medium py-2 px-4 rounded-xl shadow transition"
        >
          🧹 Wyczyść rysunek
        </button>

        <button
          onClick={downloadDrawing}
          className="w-full bg-green-100 text-green-700 hover:bg-green-200 font-medium py-2 px-4 rounded-xl shadow transition"
        >
          💾 Pobierz tylko rysunek
        </button>
      </div>

      <div className="col-span-1 md:col-span-3 flex justify-center items-start">
        <div className="relative w-full max-w-4xl border border-gray-300 rounded-2xl shadow-md bg-white p-4">
          <canvas
            ref={combinedCanvasRef}
            className="w-full h-auto rounded-2xl cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
          />
          <canvas
            ref={drawingOnlyCanvasRef}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}
