import { React, useState, useEffect, useRef } from 'react'
import drawCanvas from '../drawCanvas/drawCanvas'
import { TbShoeOff, TbShoe } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router-dom'
import images from '../assets'

const Game = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [gameStart, setGameStart] = useState(false);
  const [players, setPlayers] = useState([]);
  const [scoreCard, setScoreCard] = useState([]);
  return (
    //WINDOWS FOR GAME
    <div className='h-screen bg-cover bg-center relative' style={{ backgroundImage: `url(${images.Background})`}}>
      <div className='flex flex-col h-full'>
        <img src={images.Logo} alt="Logo" className='min-w-72 h-32 mb-4 justify-start' />
      </div>
      <div className='flex flex-col'>
        <div className='flex flex-col min-w-52 max-h-[500px] overflow-scroll ml-2 border-r-4 items-center'>
          {players.map((player, index) => {
            return (
              <div key={index} className='flex items-center justify-between w-full p-2'>
                <div className='flex items-center'>
                  <img src={player.img} alt="avatar" className='w-10 h-10 rounded-full' />
                  <div className='ml-2 flex flex-col justify-center'>
                    <span>{player.username}</span>
                    <span className='text-sm text-black'>
                      {player.role === 'host' ? '(Host)' : ''}
                    </span>
                  </div>
                  <span className='ml-2'>{player.username} {player.role === 'host' ? <span>({player.role})</span> : <TbShoe className='text-2xl text-red-500' />}</span>
                </div>
                  <span>{player.score}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Game