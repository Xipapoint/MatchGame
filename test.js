var minimax = function (matches, computerMatches, humanMatches, isComputerTurn) {
    if (matches === 0) {
        var computerWins = computerMatches % 2 === 0;
        return computerWins ? 1 : -1;
    }
    var maxPick = Math.min(10, matches);
    console.log("maxPick: ",maxPick)
    if (isComputerTurn) {
        var bestScore = -Infinity;
        for (var i = 1; i <= maxPick; i++) {
            var score = minimax(matches - i, computerMatches + i, humanMatches, false);
            bestScore = Math.max(bestScore, score);
        }
        
        return bestScore;
    }
    else {
        var bestScore = Infinity;
        for (var i = 1; i <= maxPick; i++) {
            var score = minimax(matches - i, computerMatches, humanMatches + i, true);
            bestScore = Math.min(bestScore, score);
        }
        return bestScore;
    }
};
console.log(minimax(25, 0, 0, true));
