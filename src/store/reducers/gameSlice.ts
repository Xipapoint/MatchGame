import { createSlice, PayloadAction} from '@reduxjs/toolkit';


export interface GameState {
  isPlayingFirst: boolean
  totalMatches: number
  matchesPerTurn: number
  difficultMode: string
}

const initialState: GameState = {
  isPlayingFirst: true,
  totalMatches: 25,
  matchesPerTurn: 3,
  difficultMode: 'Easy'
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameSettings(state, action: PayloadAction<GameState>) {
      const { isPlayingFirst, totalMatches, matchesPerTurn, difficultMode } = action.payload;
      return {
        ...state,
        isPlayingFirst,
        totalMatches,
        matchesPerTurn,
        difficultMode,
      };
    },

    setTotalMatches(state, action: PayloadAction<number>){
      const totalMatches = action.payload
      return{
        ...state,
        totalMatches
      }
    },

    setIsPlayingFirst(state, action: PayloadAction<boolean>) {
      return { ...state, isPlayingFirst: action.payload };
    },

    setMatchesPerTurn(state, action: PayloadAction<number>) {
      return { ...state, matchesPerTurn: action.payload };
    },

    setDifficultMode(state, action: PayloadAction<string>) {
      return { ...state, difficultMode: action.payload };
    },

    setInitGameSettings(state){
      return{
        ...state,
        totalMatches: 25,
        matchesPerTurn: 3,
        difficultMode: 'Easy',
        isPlayingFirst: true
      }
    }
  },
});

export default gameSlice.reducer;
