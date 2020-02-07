// import { ADD, MINUS } from "../constants/counter";
const INITIAL_STATE = {
  meauDisplay: false
};

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SHOW':
      return {
        ...state,
        meauDisplay: true
      };
    case 'HIDE':
      return {
        ...state,
        meauDisplay: false
      };
    default:
      return state;
  }
}
