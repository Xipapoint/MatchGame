import React, { memo } from "react"
import { useAppDispatch } from "../../hooks/redux";
import { gameSlice } from "../../store/reducers/gameSlice";
const DifficultOptions: React.FC<React.HTMLAttributes<HTMLSelectElement>> = ({...props}) => {
    console.log("Rerendered");
    
    const {setDifficultMode} = gameSlice.actions
    const dispatch = useAppDispatch()
    const handleDifficultModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setDifficultMode(e.target.value));
      };


    return(
        <select name="difficulty" id="difficulty" onChange={handleDifficultModeChange} {...props}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="impossible">Impossible</option>
      </select>
    )
}
export default memo(DifficultOptions)