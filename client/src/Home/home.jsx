import React, { useState } from 'react';
import images from '../assets/index.jsx';
import { useNavigate } from 'react-router-dom';
import { GoTriangleLeft, GoTriangleRight } from 'react-icons/go';
const characters = [
  images.Character1,  
  images.Character2, 
  images.Character3,  
  images.Character4   
];

const Home = ({ socket }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [namePlayer, setNamePlayer] = useState('')
  let Data = {};

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? characters.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === characters.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const buatRoom = () => {
    const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomId = '';
    for (let i = 0; i < 4; i++) {
      roomId += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
    }
    // Data.push({namePlayer: namePlayer, img: characters[currentIndex]})
    Data = {namePlayer: namePlayer, img: characters[currentIndex] };

    const roomData = {userData: Data, roomCode : roomId};
    
    socket.emit('create room', roomData);
    socket.on('create room', (data) => {
      navigate(`/create-room/${data}`)
    });
    socket.on('error', (data) => {
      console.log(data);
    });

    console.log(roomData);
  }

  const gabungRoom = () => {
    navigate(`/join-room/${namePlayer}/${characters[currentIndex]}`)
  }

  return (
    <div className="h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${images.BgWhite})` }}>
      <div className="flex flex-col items-center h-full">
        <img src={images.LogoWhite} alt="Logo" className="min-w-72 h-32 mt-10" />
        
        <h1 className="text-4xl mt-6 mb-6 font-historywawa">Buat Karakter Kamu</h1>

        <div className="relative w-full max-w-xl mt-6">

          <div className="flex items-center justify-center">
            <img src={characters[currentIndex]} alt="Karakter" className="w-48 h-48 " />
          </div>

          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 text-2xl bg-[#FFBF00] p-2 rounded-full shadow-lg"
          >
            <GoTriangleLeft color='#ffffff' />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 text-2xl bg-[#FFBF00] p-2 rounded-full shadow-lg"
          >
            <GoTriangleRight color='#ffffff' />
          </button>
        </div>

        <img src={images.Ribbon} alt="Pita" className="absolute bottom-[165px] h-20 " />
        <input
        type='text'
        name='name'
        id='name'
        placeholder=' Masukkan Nama '
        className='z-10 bg-transparent font-historywawa absolute bottom-[194px] placeholder:text-white text-white text-xl w-48 text-center focus:outline-none'>
        
        </input>

       
        <button className="absolute bottom-24 left-80 bg-[#FFBF00] border-2 border-black rounded-3xl w-[200px] h-[50px] text-white text-2xl font-historywawa" onClick={gabungRoom}>
          Gabung Room
        </button>

        <button className="absolute bottom-24 right-80 bg-[#FFBF00] border-2 border-black rounded-3xl w-[200px] h-[50px] text-white text-2xl font-historywawa" onClick={buatRoom}>
          Buat Room
        </button>
        
      </div>
    </div>
  );
}

export default Home;
