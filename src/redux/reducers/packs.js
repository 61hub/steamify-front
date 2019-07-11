import { packsActionsTypes } from "../actions/packs";

export const packsReducer = (state = [], action) => {
  switch (action.type) {
    case packsActionsTypes.fetchPacksSuccess:
      return action.packs;

    case 'packsToStore':
      return [...state, ...action.packs];

    default:
      return state
  }
};
