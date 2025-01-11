import React, { useCallback, useEffect, useRef, useState } from 'react'
import { minimax } from '../../alghorithm/minimax'
import styles from './game.module.scss'
import HistoryList from '../../component/HistoryList/HistoryList'
import { MoveInterface } from '../../interface/Move.interface';
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import {gameSlice} from '../../store/reducers/gameSlice'
import RestartGameModa from '../../component/modal/RestartGameModa';
import { SelectedHistory } from '../../interface/HistorySelect.interface';
import GameStatistics from '../../component/GameStatistics/GameStatistics';
import MatchesInput from '../../component/MatchesInput/MatchesInput';
import Button from '../../component/Button/Button';

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

  const initialSettings = useRef({totalMatches, matchesPerTurn, isPlayingFirst, difficultMode})

  const handleChangeMatchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setHumanPick(value)
  }, [])

  const handleIncrementMatch = useCallback(() => {
    if (humanPick < totalMatches && humanPick < matchesPerTurn) {
      setHumanPick(prev => prev + 1)
    }
  }, [humanPick, totalMatches, matchesPerTurn])

  const handleClearHistoryList = (): boolean => {
    return clearHistory
  }

  const handleHistoryClick = useCallback((moves: SelectedHistory | null) => {
    setSelectedHistoryMoves(moves)
  }, [])
  
  const findBestMove = useCallback((matches: number, computerMatches: number, humanMatches: number): number => {
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
  }, [difficultMode, matchesPerTurn])

  const endGame = useCallback(() => {
    const hmatches = (Number(localStorage.getItem('humanMatches')))
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
  }, [computerMatches])

  const computerMove = useCallback((newMatches: number) => {
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
  }, [computerMatches, dispatch, endGame, findBestMove, humanMatches, setTotalMatches])

  const playerMove = useCallback(() => {
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
  }, [dispatch, endGame, gameOver, humanPick, matchesPerTurn, totalMatches, setTotalMatches, computerMove])

  const renderMatches = useCallback((pick: number) => {
    if (window.matchMedia("(max-width: 480px)").matches) {
      if(selectedHistoryMoves){
        return <span>{selectedHistoryMoves.player.numberOfMatches}</span>
      }
      return <span>{pick} matches</span>
    } else {
      const matchImages = []
      if(selectedHistoryMoves){
        for(let i = 0; i < selectedHistoryMoves.player.numberOfMatches; i++){
          matchImages.push(<img key={i} src="/match 64.png" alt="Match" />)
        }
        return matchImages
      }
      for (let i = 0; i < pick; i++) {
        matchImages.push(<img key={i} src="/match 64.png" alt="Match" />)
      }
      return matchImages
    }
  }, [selectedHistoryMoves])

  const restartGame = useCallback(() => {
    console.log("init sett: ", initialSettings)
    
    dispatch(setGameSettings(initialSettings.current))
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
  }, [dispatch, initialSettings, setGameSettings])

  return (
    <div className={styles.gameContainer}>
      <div className={styles.computerPart}>
        <GameStatistics
          totalMatches={totalMatches}
          computerMatches={computerMatches}
          humanMatches={humanMatches}
        />
        <h1>Computer</h1>
        <div className={styles.matchList}>
          {renderMatches(computerPick)}
        </div>
      </div>
      <div className={styles.playerPart}>
        <div className={styles.matchList}>
          {renderMatches(humanPick)}
        </div>
        <div>
          <div className={styles.userInput}>
            <MatchesInput
              type="number"
              value={humanPick}
              onChangeInput={handleChangeMatchInput}
              max={matchesPerTurn}
              disabled={!!selectedHistoryMoves}
            />
            <Button
              onClick={handleIncrementMatch}
              disabled={humanPick >= matchesPerTurn || humanPick > totalMatches  || !!selectedHistoryMoves }
              isStart={false}
            >
              +1
            </Button>
          </div>
          <Button
            onClick={playerMove}
            style={{ marginBottom: 10 }}
            disabled={!isMyMove || humanPick > matchesPerTurn || humanPick > totalMatches || humanPick <= 0  || !!selectedHistoryMoves }
            isStart
          >
            My move
          </Button>
        </div>
      </div>
        <button 
          onClick={() => setHistoryVisible(!isHistoryVisible)} 
          className={`${styles.toggleHistoryButton} ${isHistoryVisible ? styles.toggleOpen : ''}`}>
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
