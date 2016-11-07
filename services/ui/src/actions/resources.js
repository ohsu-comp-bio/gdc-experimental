import { callApi } from '../utils/apiUtils';

import _ from 'lodash';
_.isBlank = function(value) {
    return _.isEmpty(value) && (!_.isNumber(value) || _.isNaN(value));
} // TODO - where to add this mixin?

const compile = require('monquery');

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



function fetchTopResources(page, query, fields, sort, backend='elastic' ) {
  if (backend==='elastic') {
    return _elasticfetchTopResources(page, query, fields, sort);
  } else {
    return _mongofetchTopResources(page, query, fields, sort);
  }
}

function _mongofetchTopResources(page, query, fields, sort) {

  // http://python-eve.org/features.html#filtering
  // xform from google/lucene to mongo
  try {
    if (!_.isBlank(query)) {
      query = JSON.stringify(compile(query));
    }
  } catch (e) {
      e.message = "Compile error transforming to mongo filter: [" +  e.message + "]"
      return resourcesFailure(page)(e);
  }

  // http://python-eve.org/features.html#projections
  if (!_.isBlank(fields)) {
    let projection = fields.split(' ').join('');
    projection = projection.split(',');
    fields = {}
    for (var i = 0; i < projection.length; ++i)
      fields[projection[i]] = 1;
    fields = JSON.stringify(fields);
  }

  // http://python-eve.org/features.html#sorting
  // http://python-eve.org/features.html#pagination

  const url = _addParams('/v0/files-mongo', page, query, fields, sort);
  const resp = callApi(url, null, resourcesRequest(page),
                       resourcesSuccess(page), resourcesFailure(page));
  return resp;
}


function _elasticfetchTopResources(page, query, fields, sort) {

  const url = _addParams('/v0/files', page, query, fields, sort);

  const resp = callApi(url, null, resourcesRequest(page),
                       resourcesSuccess(page), resourcesFailure(page));
  return resp;
}


function _addParams(url, page, query, fields, sort) {
  let params = []
  if (!_.isBlank(query)) {
    params.push(`filters=${query}`);
  }
  if (!_.isBlank(fields)) {
    params.push(`fields=${fields}`);
  }
  if (!_.isBlank(sort)) {
    params.push(`sort=${sort}`);
  }
  if (!_.isBlank(page)) {
    params.push(`page=${page}`);
  }
  if (params.length > 0) {
    url =  url + '?' + params.join('&');
  }
  return url;
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

export function fetchTopResourcesIfNeeded(page, query, fields, sort, backend) {
  return (dispatch, getState) => {
    if (shouldFetchResources(getState(), page)) {
      return dispatch(fetchTopResources(page, query, fields, sort,backend));
    }
  };
}
