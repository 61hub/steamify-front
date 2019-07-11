import { packsActionsTypes } from "../actions/packs";

export const packsReducer = (state = [], action) => {
  switch (action.type) {
    case packsActionsTypes.fetchPacksSuccess:
      return action.packs;

    default:
      return state
  }
};
