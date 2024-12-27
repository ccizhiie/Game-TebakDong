import React, { useState } from 'react';
import images from '../assets/index.jsx';
import { Socket } from 'socket.io-client';

const characters = [
  images.Character1,  
  images.Character2, 
  images.Character3,  
  images.Character4   
];

const JoinRoom = ({ socket }) => {
  const { namePlayer, currentIndex } = useParams();
  const [roomId, setRoomId] = useState('');
  const character = characters[currentIndex];
  const navigate = useNavigate();
  const Data = {};

  const handleJoinRoom = () => {
    Data = {namePlayer: namePlayer, img: character};
    const roomData = {roomCode : roomId, userData: Data};

    socket.emit('join room', roomData);
    socket.on('join room', (data) => {
        navigate(`/game/${data}`)
    });
    socket.on("error", (data) => {
      console.log(data);
    })
  }

  return (
    <div className="h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${images.BgWhite})` }}>
      <div className="flex flex-col items-center h-full">
        <img src={images.LogoWhite} alt="Logo" className="min-w-72 h-32 mt-9" />
        
        <h1 className="text-4xl mt-6 mb-5 font-historywawa">Masukkan Kodemu Disini</h1>

        <div className="relative w-full max-w-xl">

          <div className="flex items-center justify-center">
            <img src={character} alt="Karakter" className="w-48 h-48 " />
          </div>
        </div>

        <img src={images.Ribbon} alt="Pita" className="absolute bottom-[197px] h-20 " />
        
        <h1 className='z-10 bg-transparent font-historywawa absolute bottom-[225px] text-white text-2xl w-48 text-center'>{namePlayer}</h1>
        
        <input
        type='text'
        maxLength={4}
        placeholder='masukkan kode'
        name='kode'
        id='kode'
        className='z-10 mt-20 placeholder-black font-alata text-black text-2xl w-52 h-[50px] text-center rounded-lg border-2  border-gray-500'
        onChange={(e) => (setRoomId(e.target.value))}>
        </input>
        <button className="mt-4  bg-[#FFBF00] border-2 border-black rounded-3xl w-56 h-[50px] text-white text-2xl font-historywawa" onClick={handleJoinRoom}>
          Lanjutkan
        </button>
      </div>
    </div>
  );
}

export default JoinRoom;
