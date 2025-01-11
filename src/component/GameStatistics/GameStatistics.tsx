import React, { memo } from "react";
import styles from './gameStatistics.module.scss'
interface Props extends React.HTMLAttributes<HTMLDivElement> {
    totalMatches: number
    computerMatches: number
    humanMatches: number
}

const GameStatistics: React.FC<Props> = ({ totalMatches, computerMatches, humanMatches, ...props }) => {
    console.log("rerendered game statistics");
    
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
