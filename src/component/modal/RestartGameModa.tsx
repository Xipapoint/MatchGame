import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './restartGameModal.module.scss'
interface RestartGameModalProps{
    handleCloseModal: () => void
    winner: string | null
    restartGame: () => void
}
const RestartGameModa: React.FC<RestartGameModalProps> = ({handleCloseModal, winner, restartGame}) => {
    const navigate = useNavigate()
    const handleNavigateHome = () => {
        handleCloseModal()
        restartGame()
        navigate('/home')
    }
  return (
    <div className={styles.overlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {winner ? 
                <h2>Winner: {winner}</h2> 
                :
                <h2>Draw</h2>
        }

        <div>
          <button onClick={restartGame}>Restart game with same settings</button>
          <button onClick={handleNavigateHome}>Start with new settings</button>
        </div>
      </div>
    </div>
  )
}

export default RestartGameModa
