export const minimax = (matches: number, matchesPerTurn: number, computerMatches: number, humanMatches: number, isComputerTurn: boolean, difficulty: string): number => {
  if (matches === 0) {
      const computerWins = computerMatches % 2 === 0;
      return computerWins ? 1 : -1;
  }

  const maxPick = Math.min(matchesPerTurn, matches);
  
  if (isComputerTurn) {
      if (difficulty === 'Easy') {
          const pick = Math.floor(Math.random() * maxPick) + 1;
          return minimax(matches - pick, matchesPerTurn, computerMatches + pick, humanMatches, false, difficulty);
      } else if (difficulty === 'Medium') {
          let bestScore = -Infinity;
          for (let i = 1; i <= maxPick; i++) {
              const score = minimax(matches - i, matchesPerTurn, computerMatches + i, humanMatches, false, difficulty);
              bestScore = Math.max(bestScore, score - (matches - i));
          }
          return bestScore;
      } else { 
          let bestScore = -Infinity;
          for (let i = 1; i <= maxPick; i++) {
              const score = minimax(matches - i, matchesPerTurn, computerMatches + i, humanMatches, false, difficulty);
              bestScore = Math.max(bestScore, score);
          }
          return bestScore;
      }
  } else {
      let bestScore = Infinity;
      for (let i = 1; i <= maxPick; i++) {
          const score = minimax(matches - i, matchesPerTurn, computerMatches, humanMatches + i, true, difficulty);
          bestScore = Math.min(bestScore, score);
      }
      return bestScore;
  }
};