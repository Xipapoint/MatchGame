import React, { memo } from "react"
import { SelectedHistory } from "../../interface/HistorySelect.interface"
import UserInput from "./UserInput/UserInput"
import styles from './playerPart.module.scss'
import Button from "../Button/Button"
import { useAppSelector } from "../../hooks/redux"
interface Props extends React.HTMLAttributes<HTMLDivElement> {
    humanPick: number
    handleChangeMatchInput: (e: React.ChangeEvent<HTMLInputElement>) => void
    matchesPerTurn: number
    selectedHistoryMoves: SelectedHistory | null
    handleIncrementMatch: () => void
    playerMove: () => void
    isMyMove: boolean
    renderMatches: (pick: number) => JSX.Element | JSX.Element[] 
}

const PlayerPart: React.FC<Props> = ({ 
    humanPick, handleChangeMatchInput, matchesPerTurn, selectedHistoryMoves, handleIncrementMatch, playerMove, isMyMove, renderMatches,  ...props }
) => {
    const {totalMatches} = useAppSelector(state => state.game)
  return (
    <div className={styles.playerPart} {...props}>
        <div className={styles.matchList}>
            {renderMatches(humanPick)}
        </div>
        <div>
            <UserInput
                humanPick={humanPick}
                handleChangeMatchInput={handleChangeMatchInput}
                handleIncrementMatch={handleIncrementMatch}
                matchesPerTurn={matchesPerTurn}
                selectedHistoryMoves={selectedHistoryMoves}
            />
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
  )
}

export default memo(PlayerPart)
