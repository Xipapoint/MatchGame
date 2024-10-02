import React, { useEffect, useState } from 'react'
import styles from './historyList.module.scss'
import { MoveInterface } from '../../interface/Move.interface'
import { SelectedHistory } from '../../interface/HistorySelect.interface'
interface IHistoryListProps{
  historyItems: MoveInterface[],
  setClearHistoryList: () => boolean,
  onClickHistoryItem: (move: SelectedHistory) => void
}
const HistoryList: React.FC<IHistoryListProps> = ({historyItems, setClearHistoryList, onClickHistoryItem}) => {
  const [playerHistory, setPlayerHistory] = useState<MoveInterface[]>(() => {
    const savedPlayerHistory = localStorage.getItem('playerHistory')
    return savedPlayerHistory ? JSON.parse(savedPlayerHistory) : []
  });
  
  const [computerHistory, setComputerHistory] = useState<MoveInterface[]>(() => {
    const savedComputerHistory = localStorage.getItem('computerHistory')
    return savedComputerHistory ? JSON.parse(savedComputerHistory) : []
  });
  const [clickedIndex, setClickedIndex] = useState<number | null>(null)


  useEffect(() => {
    const newPlayerMove = historyItems.find(item => item.type === 'human')
    const newComputerMove = historyItems.find(item => item.type === 'computer')

    if (newPlayerMove) {
      const updatedPlayerHistory = [...playerHistory, newPlayerMove]
      setPlayerHistory(updatedPlayerHistory)
      localStorage.setItem('playerHistory', JSON.stringify(updatedPlayerHistory))
    }

    if (newComputerMove) {
      const updatedComputerHistory = [...computerHistory, newComputerMove]
      setComputerHistory(updatedComputerHistory)
      localStorage.setItem('computerHistory', JSON.stringify(updatedComputerHistory))
    }
  }, [historyItems])

  useEffect(() => {
    const isClear = setClearHistoryList()
    if(isClear) {
      setComputerHistory([])
      setPlayerHistory([])
      localStorage.removeItem('playerHistory')
      localStorage.removeItem('computerHistory')
    }
  },[setClearHistoryList])

  const maxLength = Math.max(playerHistory.length, computerHistory.length)

  return (
    <div className={styles.list}>
     {Array.from({ length: maxLength }).map((_, index) => (
        <div
          className={`${styles.item} ${clickedIndex === index ? styles.item_clicked : ''}`}
          key={index}
          onClick={() => {
            const moves: SelectedHistory = {player: playerHistory[index], computer: computerHistory[index]}
            setClickedIndex(index)
            onClickHistoryItem(moves)
          }}
        >
          <span className={styles.player}>{playerHistory[index].message || '-'}</span> |
          <span className={styles.computer}>{computerHistory[index].message || '-'}</span>
        </div>
      ))}
    </div>
  )
}

export default HistoryList
