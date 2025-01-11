import React, { memo } from "react";
import styles from './gameStatistics.module.scss'
import { useAppSelector } from "../../hooks/redux";
interface Props extends React.HTMLAttributes<HTMLDivElement> {
    computerMatches: number
    humanMatches: number
}

const GameStatistics: React.FC<Props> = ({ computerMatches, humanMatches, ...props }) => {
    const {totalMatches} = useAppSelector(state => state.game)    
  return (
    <div className={styles.info} {...props}>
        <span>Left matches: {totalMatches}</span>
        <span>Max matches per turn: 3</span>
        <span>Computer matches: {computerMatches}</span>
        <span>Your matches: {humanMatches}</span>
  </div>
  );
};

export default memo(GameStatistics);
