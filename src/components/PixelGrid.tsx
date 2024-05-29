import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../firebase';

interface Pixel {
  x: number;
  y: number;
  color: string;
}

const PixelGrid: React.FC = () => {
  const [pixels, setPixels] = useState<{ [key: string]: Pixel }>({});
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [lastPlaced, setLastPlaced] = useState<Date | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [history, setHistory] = useState<Pixel[]>([]);

  useEffect(() => {
    const pixelsRef = ref(database, 'pixels');
    onValue(pixelsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPixels(data);
      }
    });
  }, []);

  useEffect(() => {
    if (lastPlaced) {
      const interval = setInterval(() => {
        const timePassed = Math.floor((new Date().getTime() - lastPlaced.getTime()) / 1000);
        setCooldown(Math.max(0 - timePassed, 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lastPlaced]);

  const handlePixelClick = (x: number, y: number) => {
    if (cooldown > 0) return;

    const pixelKey = `${x}_${y}`;
    const newPixel: Pixel = { x, y, color: selectedColor };
    
    set(ref(database, `pixels/${pixelKey}`), newPixel)
      .then(() => {
        setHistory((prevHistory) => [...prevHistory, newPixel]);
        console.log(`Pixel set at (${x}, ${y}) with color ${selectedColor}`);
        setLastPlaced(new Date());
      })
      .catch((error) => {
        console.error('Error setting pixel:', error);
      });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastPixel = history[history.length - 1];
    const pixelKey = `${lastPixel.x}_${lastPixel.y}`;
    set(ref(database, `pixels/${pixelKey}`), null)
      .then(() => {
        setHistory((prevHistory) => prevHistory.slice(0, -1));
        console.log(`Undo pixel at (${lastPixel.x}, ${lastPixel.y})`);
      })
      .catch((error) => {
        console.error('Error undoing pixel:', error);
      });
  };

  return (
    <div>
      <div className="grid">
        {Array.from({ length: 384 }).map((_, y) => (
          <div key={y} className="row">
            {Array.from({ length: 768 }).map((_, x) => {
              const pixelKey = `${x}_${y}`;
              const pixel = pixels[pixelKey];
              return (
                <div
                  key={x}
                  className="pixel"
                  style={{ backgroundColor: pixel ? pixel.color : '#ffffff' }}
                  onClick={() => handlePixelClick(x, y)}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p>Developed by eeaq</p>
      <div className="color-picker-container">
        <div className="color-picker">
          <label>
            Оберіть колір:ㅤ
            <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} />
          </label>
        </div>
          <div className="undo-butto">
            <button onClick={handleUndo} className="undo-button">
              <img src="https://imgur.com/s6rdAMR.png" alt="Undo" />
            </button>
          </div>
        </div> 
      </div>
  );
};

export default PixelGrid;
