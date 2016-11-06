import {
    SELECT_RESOURCES_PAGE,
    INVALIDATE_RESOURCES_PAGE,
    RESOURCES_REQUEST,
    RESOURCES_SUCCESS,
    RESOURCES_FAILURE,
    INVALIDATE_RESOURCES } from '../actions/resources';

export function selectedResourcesPage(state = 1, action) {
  switch (action.type) {
    case SELECT_RESOURCES_PAGE:
      return action.page;
    default:
      return state;
  }
}

function resources(state = {
  isFetching: false,
  didInvalidate: false,
  totalCount: 0,
  resources: [],
  error: null,
}, action) {
  switch (action.type) {
    case INVALIDATE_RESOURCES_PAGE:
      return Object.assign({}, state, {
        didInvalidate: true,
      });
    case INVALIDATE_RESOURCES:
      return Object.assign({}, state, {
        didInvalidate: true,
      });
    case RESOURCES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
      });
    case RESOURCES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        totalCount: action.totalCount,
        resources: action.resources,
        error: null,
      });
    case RESOURCES_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        error: action.error,
      });
    default:
      return state;
  }
}

export function resourcesByPage(state = { }, action) {
  switch (action.type) {
    case INVALIDATE_RESOURCES_PAGE:
    case RESOURCES_REQUEST:
    case RESOURCES_SUCCESS:
    case RESOURCES_FAILURE:
      return Object.assign({}, state, {
        [action.page]: resources(state[action.page], action)
      });
    case INVALIDATE_RESOURCES:
      for (var k in state) {
        if (state.hasOwnProperty(k)) {
          state[k].didInvalidate = true;
          state[k].isFetching = false ;
          state[k].totalCount = 0;
          state[k].resources = [];
          state[k].error = null;
         }
      }
      return state ;
    default:
      return state;
  }
}
