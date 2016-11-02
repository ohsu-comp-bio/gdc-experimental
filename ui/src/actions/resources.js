import { callApi } from '../utils/apiUtils';

export const SELECT_RESOURCES_PAGE = 'SELECT_RESOURCES_PAGE';
export const INVALIDATE_RESOURCES_PAGE = 'INVALIDATE_RESOURCES_PAGE';
export const INVALIDATE_RESOURCES = 'INVALIDATE_RESOURCES';

export const RESOURCES_REQUEST = 'RESOURCES_REQUEST';
export const RESOURCES_SUCCESS = 'RESOURCES_SUCCESS';
export const RESOURCES_FAILURE = 'RESOURCES_FAILURE';


export function selectResourcesPage(page) {
  return {
    type: SELECT_RESOURCES_PAGE,
    page,
  };
}

export function invalidateResourcesPage(page) {
  return {
    type: INVALIDATE_RESOURCES_PAGE,
    page,
  };
}

export function invalidateResources() {
  return {
    type: INVALIDATE_RESOURCES,
  };
}

function resourcesRequest(page) {
  return {
    type: RESOURCES_REQUEST,
    page,
  };
}

// This is a curried function that takes page as argument,
// and expects payload as argument to be passed upon API call success.
function resourcesSuccess(page) {
  return function (payload) {
    // console.log(payload);
    return {
      type: RESOURCES_SUCCESS,
      page,
      resources: payload,
      totalCount: payload.length,
    };
  };
}

// This is a curried function that takes page as argument,
// and expects error as argument to be passed upon API call failure.
function resourcesFailure(page) {
  return function (error) {
    return {
      type: RESOURCES_FAILURE,
      page,
      error,
    };
  };
}

const API_ROOT = 'http://192.168.99.100:8000';

function fetchTopResources(page,query) {
  const url = `${API_ROOT}/v0/files?q=${query}&aggregation=true&page=${page}`;
  const resp = callApi(url, null, resourcesRequest(page),
                       resourcesSuccess(page), resourcesFailure(page));
  return resp;
}

function shouldFetchResources(state, page) {
  // Check cache first
  const resources = state.resourcesByPage[page];
  if (!resources) {
    // Not cached, should fetch
    return true;
  }

  if (resources.isFetching) {
    // Shouldn't fetch since fetching is running
    return false;
  }

  // Should fetch if cache was invalidate
  return resources.didInvalidate;
}

export function fetchTopResourcesIfNeeded(page,query) {
  return (dispatch, getState) => {
    if (shouldFetchResources(getState(), page)) {
      return dispatch(fetchTopResources(page,query));
    }
  };
}
