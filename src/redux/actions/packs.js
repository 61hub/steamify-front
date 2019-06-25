import axios from "axios";

export const packsActionsTypes = {
  fetchPacksSuccess: 'FETCH_PACKS_SUCCESS',
};

const fetchPacksSuccess = (packs) => ({
  type: packsActionsTypes.fetchPacksSuccess,
  packs
});

export const fetchPacks = () => (
  (dispatch) => (
    axios
      .get(`http://steamify-api.61hub.com/v1/packs`)
      .then(response => dispatch(fetchPacksSuccess(response.data)))
  )
);
