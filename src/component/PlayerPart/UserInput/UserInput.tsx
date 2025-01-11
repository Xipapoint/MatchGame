import React, { memo } from "react"
import { SelectedHistory } from "../../../interface/HistorySelect.interface"
import MatchesInput from "../../MatchesInput/MatchesInput"
import Button from "../../Button/Button"
import styles from './userInput.module.scss'
import { useAppSelector } from "../../../hooks/redux"
interface Props {
    humanPick: number
    handleChangeMatchInput: (e: React.ChangeEvent<HTMLInputElement>) => void
    matchesPerTurn: number
    selectedHistoryMoves: SelectedHistory | null
    handleIncrementMatch: () => void
  }
  
  const UserInput: React.FC<Props> = ({ 
      humanPick, handleChangeMatchInput, matchesPerTurn, selectedHistoryMoves, handleIncrementMatch, ...props 
  }) => {
    const {totalMatches} = useAppSelector(state => state.game)
    return (
      <div className={styles.userInput} {...props}>
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
    )
  }
  
  export default memo(UserInput)
  