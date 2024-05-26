// src/components/PixelGrid.tsx
import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../firebase';

interface Pixel {
  x: number;
  y: number;
  color: string;
}

const PixelGrid: React.FC = () => {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [lastPlaced, setLastPlaced] = useState<Date | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);

  useEffect(() => {
    const pixelsRef = ref(database, 'pixels');
    onValue(pixelsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const pixelArray = Object.keys(data).map(key => data[key]);
        setPixels(pixelArray);
      }
    });
  }, []);

  useEffect(() => {
    if (lastPlaced) {
      const interval = setInterval(() => {
        const timePassed = Math.floor((new Date().getTime() - lastPlaced.getTime()) / 1000);
        setCooldown(Math.max(60 - timePassed, 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lastPlaced]);

  const handlePixelClick = (x: number, y: number) => {
    if (cooldown > 0) return;

    const pixelIndex = pixels.findIndex(p => p.x === x && p.y === y);
    if (pixelIndex !== -1) {
      alert(`Ваш піксель у позиції (${x}, ${y}) був змінений`);
    }

    const newPixel = { x, y, color: selectedColor };
    set(ref(database, `pixels/${x}_${y}`), newPixel);

    setPixels(prevPixels => {
      const updatedPixels = prevPixels.filter(p => !(p.x === x && p.y === y));
      updatedPixels.push(newPixel);
      return updatedPixels;
    });

    setLastPlaced(new Date());
  };

  return (
    <div>
      <div>
        <label>
          Оберіть колір:
          <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} />
        </label>
        <p>Час до наступного пікселя: {cooldown > 0 ? `${cooldown} секунд` : 'можна ставити'}</p>
      </div>
      <div className="grid">
        {Array.from({ length: 20 }).map((_, y) => (
          <div key={y} className="row">
            {Array.from({ length: 20 }).map((_, x) => {
              const pixel = pixels.find(p => p.x === x && p.y === y);
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
    </div>
  );
};

export default PixelGrid;
