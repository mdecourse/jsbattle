import profileService from '../services/profileService.js';

import {
  SET_SIM_QUALITY_REQUEST,
  SET_SIM_QUALITY_SUCCESS,
  SET_SIM_SPEED_REQUEST,
  SET_SIM_SPEED_SUCCESS,
  SETTINGS_REQUEST,
  SETTINGS_SUCCESS
} from './actionTypes.js';

export const clearError = (type) => ({
  type: type + "_CLEAR_ERROR"
});


export const setSimQuality = (quality) => {
  return async (dispatch) => {
    dispatch({
      type: SET_SIM_QUALITY_REQUEST,
      payload: quality
    });
    await profileService.setSimQuality(quality);
    console.log("Quality changed to " + quality);
    dispatch({
      type: SET_SIM_QUALITY_SUCCESS,
      payload: quality
    });
  };
};

export const setSimSpeed = (speed) => {
  return async (dispatch) => {
    dispatch({
      type: SET_SIM_SPEED_REQUEST,
      payload: speed
    });
    await profileService.setSimSpeed(speed);
    console.log("Speed changed to " + speed);
    dispatch({
      type: SET_SIM_SPEED_SUCCESS,
      payload: speed
    });
  };
};

export const getSettings = () => {
  return async (dispatch) => {
    dispatch({type: SETTINGS_REQUEST});

    let settings = await profileService.getSettings();

    let result = await fetch("tanks/index.json");
    let bundledTanks = await result.json();
    settings.bundledTanks = bundledTanks;

    dispatch({type: SETTINGS_SUCCESS, payload: settings});
  };
};
