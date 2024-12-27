import { React, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import images from '../assets';
import { FaClipboard }  from 'react-icons/fa'

const CreateRoom = ({ socket }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [maxPlayer, setMaxPlayer] = useState("8")
  const [time, setTime] = useState("30");
  const [hint, setHint] = useState("0")
  const Data = {};

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId)
    .then(() => {
      console.log('copied');
    })
  }

  const handleCreateRoom = () => {
    Data = {maxPlayer: maxPlayer, time: time, hint: hint};
    const roomData = {userData: Data, roomCode : roomId};

    socket.emit("setting room", roomData)
    socket.on("setting room", (data) => {
        navigate(`/game/${data}`)
    })
    socket.on("error", (data) => {
      console.log(data);
    })
  }

  return (
    <div className='h-screen bg-cover bg-center' style={{ backgroundImage: `url(${images.Background})` }}>
        <div className='flex flex-col items-center justify-center h-full'>
            <img src={images.Logo} alt="Logo" className='min-w-72 h-32 mb-7'/>
            <form onSubmit={handleCreateRoom} className='flex flex-col items-center justify-center'>
              <div className='flex flex-col w-[450px] h-[290px] rounded-md bg-white justify-center items-center p-2'>
                <div className='flex w-[400px] h-[45px] rounded-md bg-[#0A5EFB] mb-4 items-center justify-between px-4'>
                    <p className='text-white text-xl font-historywawa'>Pemain</p>
                    <select className='w-14' name="maxPlayer" id="maxPlayer" value={maxPlayer} onChange={(e) => setMaxPlayer(e.target.value)} required>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </select>
                </div>
                <div className='flex w-[400px] h-[45px] rounded-md bg-[#0A5EFB] mb-4 items-center justify-between px-4'>
                    <p className='text-white text-xl font-historywawa'>Waktu (detik)</p>
                    <select className='w-14' type="text" name="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} required>
                      <option value="30">30</option>
                      <option value="60">60</option>
                      <option value="90">90</option>
                    </select>
                </div>
                <div className='flex w-[400px] h-[45px] rounded-md bg-[#0A5EFB] mb-4 items-center justify-between px-4'>
                    <p className='text-white text-xl font-historywawa'>Petunjuk</p>
                    <select className='w-14' type="text" name="hint" id="hint" value={hint} onChange={(e) => setHint(e.target.value)} required>
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                </div>
                <div className='flex w-[400px] h-[45px] rounded-md bg-[#0A5EFB] mb-4 items-center justify-between px-4'>
                    <p className='text-white text-xl font-historywawa'>Kode Room</p>
                    <div className='flex items-center'>
                      <p className='text-white text-lg font-alata'>{roomId}</p>
                        <FaClipboard className='ml-2' color='#FFFFFF' onClick={copyToClipboard}/>
                    </div>
                </div>
              </div>
              <button className='bg-[#FFBF00] border-2 border-black rounded-3xl w-[200px] h-[50px] text-white mt-5 text-xl font-historywawa' type="submit">LANJUTKAN</button>
            </form>
        </div>
    </div>
  )
}

export default CreateRoom