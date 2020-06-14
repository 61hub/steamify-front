import firebase from "firebase";

export const gamesActionsTypes = {
  fetchGamesSuccess: 'FETCH_GAMES_SUCCESS',
  gameUpdate: 'gameUpdate',
};

const fetchGamesSuccess = (games) => ({
  type: gamesActionsTypes.fetchGamesSuccess,
  games
});

export const fetchGames = () => (
  async (dispatch) => {
    const db = firebase.firestore();

    const gamesSnapshots = await db.collection('games').get();

    const games = []

    gamesSnapshots.forEach(doc => {
      games.push(doc.data())
    });

    dispatch(fetchGamesSuccess(games));
  }
);

export const gameUpdate = (game) => ({
  type: gamesActionsTypes.gameUpdate,
  game
});

