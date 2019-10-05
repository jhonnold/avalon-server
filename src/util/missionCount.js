module.exports = (playerCount) => {
    switch (playerCount) {
        case 5: return [2, 3, 2, 3, 3];
        case 6: return [2, 3, 4, 3, 4];
        case 7: return [2, 3, 3, 4, 4];
        default: return [3, 4, 4, 5, 5];
    }
};