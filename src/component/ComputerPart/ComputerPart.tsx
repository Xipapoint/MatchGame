import React, { memo } from "react";
import styles from './computerPart.module.scss'
import GameStatistics from "../GameStatistics/GameStatistics";
interface Props extends React.HTMLAttributes<HTMLDivElement> {
    computerPick: number
    humanMatches: number
    computerMatches: number
    renderMatches: (pick: number) => JSX.Element | JSX.Element[] 
}

const ComputerPart: React.FC<Props> = ({ computerPick, renderMatches, humanMatches, computerMatches, ...props }) => {
  return (
    <div className={styles.computerPart} {...props}>
        <GameStatistics
            computerMatches={computerMatches}
            humanMatches={humanMatches}
        />
        <h1>Computer</h1>
        <div className={styles.matchList}>
            {renderMatches(computerPick)}
        </div>
  </div>
  );
};

export default memo(ComputerPart);
