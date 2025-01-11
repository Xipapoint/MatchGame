import React, { memo, useEffect, useState, useCallback} from 'react'
import styles from './historyList.module.scss'
import { MoveInterface } from '../../interface/Move.interface'
import { SelectedHistory } from '../../interface/HistorySelect.interface'
interface IHistoryListProps{
  historyItems: MoveInterface[],
  setClearHistoryList: () => boolean,
  onClickHistoryItem: (move: SelectedHistory | null) => void
}
const HistoryList: React.FC<IHistoryListProps> = ({historyItems, setClearHistoryList, onClickHistoryItem}) => {
  const [playerHistory, setPlayerHistory] = useState<MoveInterface[]>(() =>
    JSON.parse(localStorage.getItem('playerHistory') || '[]')
  );
  const [computerHistory, setComputerHistory] = useState<MoveInterface[]>(() =>
    JSON.parse(localStorage.getItem('computerHistory') || '[]')
  );
  const [clickedIndex, setClickedIndex] = useState<number | null>(null)

  const updateHistory = useCallback((type: 'human' | 'computer', newMove: MoveInterface) => {
    const updateFn = type === 'human' ? setPlayerHistory : setComputerHistory
    const storageKey = type === 'human' ? 'playerHistory' : 'computerHistory'

    updateFn((prevHistory) => {
      const updatedHistory = [...prevHistory, newMove]
      localStorage.setItem(storageKey, JSON.stringify(updatedHistory))
      return updatedHistory
    })
  }, [])

  useEffect(() => {
    const newPlayerMove = historyItems.find(item => item.type === 'human')
    const newComputerMove = historyItems.find(item => item.type === 'computer')

    if (newPlayerMove)
      updateHistory("human", newPlayerMove)

    if (newComputerMove) 
      updateHistory("computer", newComputerMove)
  }, [historyItems, updateHistory])

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

  const handleClick = useCallback(
    (index: number) => {
      if(index === clickedIndex){
        setClickedIndex(null)
        onClickHistoryItem(null)
        return
      }
      const moves: SelectedHistory = {
        player: playerHistory[index] || null,
        computer: computerHistory[index] || null,
      }
      setClickedIndex(index)
      onClickHistoryItem(moves)
    },
    [playerHistory, computerHistory, onClickHistoryItem, clickedIndex]
  )

  return (
    <div className={styles.list}>
      {Array.from({ length: maxLength }).map((_, index) => (
        <div
          key={index}
          className={`${styles.item} ${clickedIndex === index ? styles.item_clicked : ''}`}
          onClick={() => handleClick(index)}
        >
          <span className={styles.player}>{playerHistory[index].message || '-'}</span> |
          <span className={styles.computer}>{computerHistory[index].message || '-'}</span>
        </div>
      ))}
    </div>
  )
}

export default memo(HistoryList)
