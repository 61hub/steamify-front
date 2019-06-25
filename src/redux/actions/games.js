import axios from "axios";

export const gamesActionsTypes = {
  fetchGamesSuccess: 'FETCH_GAMES_SUCCESS',
};

const fetchGamesSuccess = (games) => ({
  type: gamesActionsTypes.fetchGamesSuccess,
  games
});

export const fetchGames = () => (
  (dispatch) => (
    axios
      .get(`http://steamify-api.61hub.com/v1/games`)
      .then(response => dispatch(fetchGamesSuccess(response.data)))
  )
);
