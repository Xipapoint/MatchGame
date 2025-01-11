import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import styles from './home.module.scss'
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { gameSlice } from '../../store/reducers/gameSlice';
import DifficultOptions from '../../component/DifficultOptions/DifficultOptions';
import CheckGameType from '../../component/CheckGameType/CheckGameType';

const Home = () => {
  const { totalMatches, matchesPerTurn, isPlayingFirst } = useAppSelector(state => state.game)
  const { setIsPlayingFirst, setMatchesPerTurn, setTotalMatches, setInitGameSettings } = gameSlice.actions
  const [isDefaultGame, setIsDefaultGame] = useState(true)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(isDefaultGame) dispatch(setInitGameSettings())
  },[dispatch, isDefaultGame, setInitGameSettings])

  const navigate = useNavigate();

  const handleDefaultGameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Rerendered checkbox");
    
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
          <CheckGameType
            type="checkbox"
            id="playingFirst"
            checked={isPlayingFirst}
            onChangeInput={handlePlayingFirstChange}
            htmlFor="playingFirst"
            labelText='I play first:'
          />
          <CheckGameType
            type="checkbox"
            id="defaultGame"
            checked={isDefaultGame}
            onChangeInput={handleDefaultGameChange}
            htmlFor="defaultGame"
            labelText='Default game'
          />
        </div>

        <DifficultOptions/>
        {!isDefaultGame && (
          <div className={styles.inputMatches}>
          <CheckGameType
            type="text"
            name="allMatches"
            value={totalMatches}
            onChangeInput={handleNumberOfAllMatchesChange}
            htmlFor="allMatches"
            labelText='Number of matches (not bigger than 31)'
          />
          <CheckGameType
            type="text"
            name="matchesPerTurn"
            value={matchesPerTurn}
            onChangeInput={handleNumberOfTurnMatchesChange}
            htmlFor="matchesPerTurn"
            labelText='Number of matches per turn'
          />
        </div>
        )}
        <button className={styles.startButton} onClick={handleStartGame}>Start game</button>
      </div>
    </div>
  );
};

export default Home;
