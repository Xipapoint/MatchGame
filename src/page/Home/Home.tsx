import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import styles from './home.module.scss'
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { gameSlice } from '../../store/reducers/gameSlice';

const Home = () => {
  const { totalMatches, matchesPerTurn, isPlayingFirst } = useAppSelector(state => state.game)
  const { setIsPlayingFirst, setMatchesPerTurn, setTotalMatches, setInitGameSettings, setDifficultMode } = gameSlice.actions
  const [isDefaultGame, setIsDefaultGame] = useState(true)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(isDefaultGame) dispatch(setInitGameSettings())
  },[dispatch, isDefaultGame, setInitGameSettings])

  const navigate = useNavigate();

  const handleDefaultGameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDefaultGame(e.target.checked)
    if (!isDefaultGame) {
      dispatch(setInitGameSettings())
    }
  }

  const handlePlayingFirstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setIsPlayingFirst(e.target.checked));
  };

  const handleNumberOfAllMatchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTotalMatches(Number(e.target.value)));
  };

  const handleNumberOfTurnMatchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMatchesPerTurn(Number(e.target.value)));
  };

  const handleDifficultModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setDifficultMode(e.target.value));
  };

  const handleStartGame = () => {
    if(totalMatches > 31 ) {
      alert("Must be less than 31")
      return
    }
    if (totalMatches < matchesPerTurn) {
      alert("Total matches have to be more than turn matches")
      return
    }
    navigate('/game')
  }

  return (
    <div className={styles.home}>
      <h1>Game of matches!</h1>
      <div className={styles.settingsContainer}>
        <div className={styles.checkboxMatches}>
          <div>
            <label htmlFor="playingFirst">I play first:</label>
            <input
              type="checkbox"
              id="playingFirst"
              checked={isPlayingFirst}
              onChange={handlePlayingFirstChange}
            />
          </div>
          <div>
            <label htmlFor="defaultGame">Default game</label>
            <input
              type="checkbox"
              id="defaultGame"
              checked={isDefaultGame}
              onChange={handleDefaultGameChange}
            />
          </div>
        </div>

        <select name="difficulty" id="difficulty" onChange={handleDifficultModeChange}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="impossible">Impossible</option>
        </select>


        {!isDefaultGame && (
          <div className={styles.inputMatches}>
            <div>
              <label htmlFor="allMatches">Number of matches (not bigger than 31)</label>
              <input
                type="text"
                name="allMatches"
                value={totalMatches}
                onChange={handleNumberOfAllMatchesChange}
              />
            </div>
            <div>
              <label htmlFor="matchesPerTurn">Number of matches per turn</label>
              <input
                type="text"
                name="matchesPerTurn"
                value={matchesPerTurn}
                onChange={handleNumberOfTurnMatchesChange}
              />
            </div>
          </div>
        )}
        <button className={styles.startButton} onClick={handleStartGame}>Start game</button>
      </div>
    </div>
  );
};

export default Home;
