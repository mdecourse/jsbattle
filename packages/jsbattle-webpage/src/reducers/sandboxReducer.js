import {
  SETTINGS_SUCCESS,
  AI_SCRIPT_REQUEST,
  AI_SCRIPT_SUCCESS,
  AI_SCRIPT_CHANGED_REQUEST,
  AI_SCRIPT_RENAME_SUCCESS,
  SANDBOX_OPPONENT_CHANGE,
  SANDBOX_RNG_LOCK,
  SANDBOX_RNG_UNLOCK,
  SANDBOX_OPPONENT_TEAM_MODE,
  SANDBOX_OPPONENT_DUEL_MODE,
} from '../actions/actionTypes.js';

const initState = {
  list: [],
  code: '',
  name: '',
  opponent: {
    type: 'bundled',
    name: 'dummy',
    code: ''
  },
  lockRng: false,
  mode: 'duel'
};


function sanboxReducer(state = {}, action) {
  state = state || {};
  state = {
    ...initState,
    ...state
  };
  switch (action.type) {
    case SETTINGS_SUCCESS:
      return {
        ...state,
        tankList: action.payload.bundledTanks
      };
      case AI_SCRIPT_REQUEST:
        return {
          ...state,
          code: '',
          name: '',
        };
    case AI_SCRIPT_SUCCESS:
      return {
        ...state,
        code: action.payload.code,
        name: action.payload.name,
      };
    case AI_SCRIPT_CHANGED_REQUEST:
      return {
        ...state,
        code: action.payload.code
      };
    case AI_SCRIPT_RENAME_SUCCESS:
      return {
        ...state,
        name: action.payload.newName
      };
    case SANDBOX_OPPONENT_CHANGE:
      return {
        ...state,
        opponent: {
          ...state.opponent,
          type: action.payload.type,
          name: action.payload.name,
          code: action.payload.code || '',
        }
      };
    case SANDBOX_RNG_LOCK:
      return {
        ...state,
        lockRng: true
      };
    case SANDBOX_RNG_UNLOCK:
      return {
        ...state,
        lockRng: false
      };
    case SANDBOX_OPPONENT_TEAM_MODE:
      return {
        ...state,
        mode: 'team'
      };
    case SANDBOX_OPPONENT_DUEL_MODE:
      return {
        ...state,
        mode: 'duel'
      };
    default:
      return state;
  }
}

export default sanboxReducer;
