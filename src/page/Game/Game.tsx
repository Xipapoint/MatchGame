import React, { useEffect, useRef, useState } from 'react'
import { minimax } from '../../alghorithm/minimax'
import styles from './game.module.scss'
import HistoryList from '../../component/HistoryList/HistoryList'
import { MoveInterface } from '../../interface/Move.interface';
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import {gameSlice, GameState} from '../../store/reducers/gameSlice'
import RestartGameModa from '../../component/modal/RestartGameModa';
import { SelectedHistory } from '../../interface/HistorySelect.interface';

const Game = () => {
  const {totalMatches, matchesPerTurn, isPlayingFirst, difficultMode} = useAppSelector(state => state.game)
  const {setTotalMatches, setGameSettings} = gameSlice.actions
  const dispatch = useAppDispatch()
  const [isMyMove, setIsMyMove] = useState(isPlayingFirst)
  const [computerMatches, setComputerMatches] = useState(() => {
    const storedComputerMatches = localStorage.getItem('computerMatches')
    return storedComputerMatches ? parseInt(storedComputerMatches, 10) : 0
  })
  const [humanMatches, setHumanMatches] = useState(() => {
    const storedHumanMatches = localStorage.getItem('humanMatches')
    return storedHumanMatches ? parseInt(storedHumanMatches, 10) : 0
  })
  const [humanPick, setHumanPick] = useState<number>(0)
  const [computerPick, setComputerPick] = useState<number>(0)
  const historyItemsRef = useRef<MoveInterface[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [waitingQueue, setWaitingQueue] = useState<MoveInterface[]>([])
  const [showModal, setShowModal] = useState(false)
  const [winner, setWinner] = useState<null | 'You' | 'Computer'>(null)
  const [initialSettings,] = useState<GameState>({totalMatches, matchesPerTurn, isPlayingFirst, difficultMode})
  const [clearHistory, setClearHistory] = useState(false)
  const [isHistoryVisible, setHistoryVisible] = useState(true)
  const [selectedHistoryMoves, setSelectedHistoryMoves] = useState<SelectedHistory | null>(null)
  
  useEffect(() => {
    if(waitingQueue.length === 2){
      historyItemsRef.current = waitingQueue
      setWaitingQueue([])
    }

  }, [waitingQueue])

  useEffect(() => {
    localStorage.setItem('humanMatches', humanMatches.toString());
  }, [humanMatches])

  useEffect(() => {
    localStorage.setItem('computerMatches', computerMatches.toString());
  }, [computerMatches])

  const handleChangeMatchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setHumanPick(value)
    
  }

  const handleIncrementMatch = () => {
    if (humanPick < totalMatches && humanPick < matchesPerTurn) {
      setHumanPick(prev => {
        const value = prev + 1
        return value
      })

    }
  }

  const handleClearHistoryList = (): boolean => {
    return clearHistory
  }

  const handleHistoryClick = (moves: SelectedHistory) => {
    setSelectedHistoryMoves(moves)
  };

  const findBestMove = (matches: number, computerMatches: number, humanMatches: number): number => {
    let bestScore = -Infinity
    let bestMove = -1
    const maxPick = Math.min(3, matches)
    for (let i = 1; i <= maxPick; i++) {
      const score = minimax(matches - i, matchesPerTurn, computerMatches + i, humanMatches, false, difficultMode)
      if (score > bestScore) {
        bestScore = score
        bestMove = i
      }
    }
    return bestMove
  }

  const endGame = () => {
    const hmatches = (Number(localStorage.getItem('humanMatches'))) + 1
    const computerWins = computerMatches % 2 === 0
    const humanWins = hmatches % 2 === 0
    

    if (computerWins && humanWins) {
      setWinner(null)
    } else if (computerWins) {
      setWinner('Computer')
    } else {
      setWinner('You')
    }
    setGameOver(true)
    setShowModal(true)
  }

  const playerMove = () => {
    if (totalMatches === 0 || gameOver || humanPick > matchesPerTurn) return
    else if(humanPick > totalMatches) return
    else if(humanPick <= 0) return
    const newMatches = totalMatches - humanPick
    dispatch(setTotalMatches(newMatches))
    setHumanMatches(prev => {
      const value = prev + humanPick
      return value
    })
    const movePlayer: MoveInterface = {
      type: 'human',
      message: `Player: ${humanPick} matches.`,
      numberOfMatches: humanPick
    }
    setWaitingQueue(prevQueue => [...prevQueue, movePlayer])
    
    

    if (newMatches === 0) {
      endGame()
    } else {
      setIsMyMove(false)
      setTimeout(() => {
        computerMove(newMatches)
      }, 1000) 
    }
  }

  const computerMove = (newMatches: number) => {
    const computerPick = findBestMove(newMatches, computerMatches, (humanMatches))
    
    const updatedMatches = newMatches - computerPick
    dispatch(setTotalMatches(updatedMatches))
    setComputerMatches(computerMatches + computerPick)
    setComputerPick(computerPick)
    const moveComputer: MoveInterface = {
      type: 'computer',
      message: `Computer: ${computerPick} matches.`,
      numberOfMatches: computerPick
    }
    setWaitingQueue(prevQueue => [...prevQueue, moveComputer])

    if (updatedMatches === 0) {
      endGame()
    } else {
      setIsMyMove(true)
    }
  }

  const renderMatches = () => {
    if (window.matchMedia("(max-width: 480px)").matches) {
      if(selectedHistoryMoves){
        return <span>{selectedHistoryMoves.player.numberOfMatches}</span>
      }
      return <span>{humanPick} matches</span>
    } else {
      const matchImages = []
      if(selectedHistoryMoves){
        for(let i = 0; i < selectedHistoryMoves.player.numberOfMatches; i++){
          matchImages.push(<img key={i} src="/match 64.png" alt="Match" />)
        }
        return matchImages
      }
      for (let i = 0; i < humanPick; i++) {
        matchImages.push(<img key={i} src="/match 64.png" alt="Match" />)
      }
      return matchImages
    }
  };
  
  const renderComputerMatches = () => {
    if (window.matchMedia("(max-width: 480px)").matches) {
      if(selectedHistoryMoves){
        return <span>{selectedHistoryMoves.computer.numberOfMatches}</span>
      }
      return <span>{computerPick} matches</span>
    } else {
      const matchImages = []
      if(selectedHistoryMoves){
        for(let i = 0; i < selectedHistoryMoves.computer.numberOfMatches; i++){
          matchImages.push(<img key={i} src="/match 64.png" alt="Match" />)
        }
        return matchImages
      }
      for (let i = 0; i < computerPick; i++) {
        matchImages.push(<img key={i} src="/match 64.png" alt="Match" />)
      }
      return matchImages
    }
  };

  const restartGame = () => {
    console.log("init sett: ", initialSettings)
    
    dispatch(setGameSettings(initialSettings))
    setComputerMatches(0)
    setHumanMatches(0)
    setHumanPick(0)
    setComputerPick(0)
    setGameOver(false)
    setShowModal(false)
    setClearHistory(true)
    setSelectedHistoryMoves(null)
    localStorage.removeItem('humanMatches')
    localStorage.removeItem('computerMatches')
  }

  return (
    <div className={styles.gameContainer}>
      <div className={styles.computerPart}>
        <div className={styles.info}>
          <span>Left matches: {totalMatches}</span>
          <span>Max matches per turn: 3</span>
          <span>Computer matches: {computerMatches}</span>
          <span>Your matches: {humanMatches}</span>
        </div>

        <h1>Computer</h1>
        <div className={styles.matchList}>
          {renderComputerMatches()}
        </div>
      </div>
      <div className={styles.playerPart}>
        <div className={styles.matchList}>
          {renderMatches()}
        </div>
        <div>
          <div className={styles.userInput}>
            <input
              className={styles.matchInput}
              type="number"
              value={humanPick}
              onChange={handleChangeMatchInput}
              max={matchesPerTurn}
              disabled={!!selectedHistoryMoves}
            />
            <button
              onClick={handleIncrementMatch}
              className={styles.incrementButton}
              disabled={humanPick >= matchesPerTurn || humanPick > totalMatches  || !!selectedHistoryMoves }
            >
              +1
            </button>
          </div>
          <button
            onClick={playerMove}
            className={styles.startButton}
            disabled={!isMyMove || humanPick > matchesPerTurn || humanPick > totalMatches || humanPick <= 0  || !!selectedHistoryMoves }
          >
            My move
          </button>
        </div>
      </div>
        <button onClick={() => setHistoryVisible(!isHistoryVisible)} className={`${styles.toggleHistoryButton} ${isHistoryVisible ? styles.toggleOpen : ''}`}>
          
        </button>
          {isHistoryVisible && (
            <HistoryList 
            setClearHistoryList={handleClearHistoryList} 
            historyItems={historyItemsRef.current} 
            onClickHistoryItem={handleHistoryClick}
            />
          )}
          {showModal && (
            <RestartGameModa handleCloseModal={() => setShowModal(false)} winner={winner} restartGame={restartGame}/>
          )}
    </div>
  )
}

export default Game
