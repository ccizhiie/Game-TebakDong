import { React, useEffect, useState, useRef } from 'react'
import { ReactSketchCanvas } from 'react-sketch-canvas';
import MdOutlineDeleteForever from 'react-icons/md'

const drawCanvas = ({
    socket,
    roomsData,
    roomCode,
    players,
    playerTurn,
    whosTurn,
    style,
    time,
}) => {
  const sketchRef = useRef(null);
  const colors = [
    "red",
    "green",
    "cyan",
    "blue",
    "pink",
    "black",
    "yellow",
    "brown",
    "orange",
    "gold",
    "purple",
    "lime",
    "silver",
  ];
  const fonts = ["2", "5", "8", "10"];
  const [selectedColor, setSelectedColor] = useState(colors[5])
  const [selectedFont, setSelectedFont] = useState("2");
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [canvasImageUrl, setCanvasImageUrl] = useState("");
  const [remainingTime, setRemainingTime] = useState(time);

  useEffect(() => {
    players.map((player) => {
        return player.id === socket.id ? setCurrentPlayer(player) : "";
    });
  }, []);

  useEffect(() => {
    socket.on("canvas picture", (imageURL) => {
        setCanvasImageUrl(imageURL);
    });
  }, []);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const onColorSelect = (color) => {
    setSelectedColor(color);
  }

  const onFontSelect = (font) => {
    setSelectedFont(font);
  }

  const onClearCanvas = () => {
    sketchRef.current.resetCanvas();
  };

  const shareCanvasImage = async () => {
    if (sketchRef.current) {
      try {
        const imageURL = await sketchRef.current.exportImage("png");
        socket.emit("share canvas", { imageURL, roomsData, roomCode });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const timeOut = () => {
    setTimeout(() => {
        shareCanvasImage();
    }, 1000);
  }

  return whosTurn !== null ? (
    whosTurn.id !== socket.id ? (
      <div className=''>
        <img src={canvasImageUrl} path="drawing.." />
      </div>
    ) : ( 
      <>
        <ReactSketchCanvas
          ref={sketchRef}
          width={style.width}
          height={style.height}
          strokeWidth={selectedFont}
          strokeColor={selectedColor}
          onChange={() => {
              timeOut();
          }}
        />
        <div className='bg-white rounded-b flex items-center justify-center h-[7%]'>
            {colors.map((color, index) => {
                return(
                  <div
                    onClick={() => {
                        onColorSelect(color);
                    }}
                    key={index}
                    className='h-5 w-5 rounded-full cursor-pointer ml-[0.10rem]'
                    style={{ backgroundColor: color }}
                  ></div>
                )
            })}
            <MdOutlineDeleteForever
              className = 'ml-4 cursor-pointer text-[22px]'
              onClick={() => {
                onClearCanvas();
              }}
            />

            <div className='flex ml-4'>
                {fonts.map((font, index) => {
                    return (
                        <span
                          key={index}
                          className={
                            selectedFont === font
                            ? 'flex justify-center items-center text-xs cursor-pointer h-5 w-5 ml-1 border border-white rounded-full bg-black text-white'
                            : 'flex justify-center items-center text-xs cursor-pointer h-5 w-5 ml-1 border border-black rounded-full'
                          }
                          onClick={() => {
                            onFontSelect(font);
                          }}
                        >
                          {font}
                        </span>
                    );
                })}
            </div>
        </div>
        <div className='w-full h-2 bg-gray-600 mt-2 rounded-full'>
          <div
            className='h-full bg-yellow-600 rounded-full'
            style={{
              width: `${(remainingTime / time) * 100}%`,
              transition: "width 1s linear",
            }}
          />
        </div>
      </>
    )
  ) : ( "" )
}

export default drawCanvas