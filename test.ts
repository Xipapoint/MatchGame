const minimax = (matches: number, computerMatches: number, humanMatches: number, isComputerTurn: boolean): number => {
    if (matches === 0) {
      const computerWins = computerMatches % 2 === 0;
      return computerWins ? 1 : -1;
    }

    const maxPick = Math.min(3, matches);
    if (isComputerTurn) {
      let bestScore = -Infinity;
      for (let i = 1; i <= maxPick; i++) {
        const score = minimax(matches - i, computerMatches + i, humanMatches, false);
        bestScore = Math.max(bestScore, score);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 1; i <= maxPick; i++) {
        const score = minimax(matches - i, computerMatches, humanMatches + i, true);
        bestScore = Math.min(bestScore, score);
      }
      return bestScore;
    }
};

console.log(minimax(50, 0, 0, true))