import {
  LEAGUE_REPLAY_SUCCESS,
  LEAGUE_SUMMARY_SUCCESS,
  LEAGUE_PREVIEW_SUCCESS,
  LEAGUE_CLEAR_SUBMISSION_SUCCESS,
  LEAGUE_NEW_SUBMISSION_SUCCESS,
  LEAGUE_REFRESH_SUCCESS
} from '../actions/actionTypes.js';

const initState = {
  submission: null,
  ranktable: [],
  history: [],
  replay: {}
};


function leagueReducer(state = {}, action) {
  action = action || {};
  state = state || {};
  state = {
    ...initState,
    ...state
  };
  let ubd;
  let submission = null;
  switch (action.type) {
    case LEAGUE_CLEAR_SUBMISSION_SUCCESS:
    case LEAGUE_NEW_SUBMISSION_SUCCESS:
    case LEAGUE_SUMMARY_SUCCESS:
    case LEAGUE_REFRESH_SUCCESS:
      if(action.payload.submission && Object.keys(action.payload.submission).length > 0) {
        submission = {
          ...action.payload.submission,
          history: action.payload.submission.history.map((item) => ({
            id: item.id,
            opponent: item.players.find((p) => p.id != action.payload.submission.id),
            winner: item.players.find((p) => p.id == action.payload.submission.id).winner
          }))
        };
      }
      return {
        ...state,
        submission: submission,
        ranktable: action.payload.ranktable,
        history: action.payload.history
      };
    case LEAGUE_PREVIEW_SUCCESS:
      return {
        ...state,
        history: action.payload
      };
    case LEAGUE_REPLAY_SUCCESS:
      ubd = JSON.parse(action.payload.ubd);
      return {
        ...state,
        replay: {
          ...ubd,
          createdAt: action.payload.createdAt,
          result: action.payload.meta,
        }
      };
    default:
      return state;
  }
}

export default leagueReducer;
