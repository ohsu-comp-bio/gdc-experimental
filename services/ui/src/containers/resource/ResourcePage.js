import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';
import Sidebar from '../../components/sidebar/Sidebar';
import './resource.css';

var ReactBsTable  = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;

var BarChart = require("react-chartjs").Bar;

import mongo_logo from './mongo-logo.png';
import elastic_logo from './elastic-logo.png';


// TODO not used, remove?
// eslint-disable-next-line
import Resource from '../../components/resource/Resource';

import { invalidateResourcesPage, selectResourcesPage,
         fetchTopResourcesIfNeeded, invalidateResources }
         from '../../actions/resources';

function cellFormatter(cell, row){
  var td =   '<td>' +
      JSON.stringify(row) +
    '</td>' ;
  return td;
}

function onRowSelect(row, isSelected){
  console.log(row);
  console.log("selected: " + isSelected)
}

function onSelectAll(isSelected){
  console.log("is select all: " + isSelected);
}

var selectRowProp = {
  mode: "checkbox",
  clickToSelect: true,
  bgColor: "rgb(238, 193, 213)",
  onSelect: onRowSelect,
  onSelectAll: onSelectAll
};

class ResourcesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {query: '' , backend: 'elastic'};
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
    this.handlePreviousPageClick = this.handlePreviousPageClick.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleFieldsChange = this.handleFieldsChange.bind(this);
    this.handleQuerySubmit = this.handleQuerySubmit.bind(this);
    this.simplifyAggregation = this.simplifyAggregation.bind(this);
    this.chartClick = this.chartClick.bind(this);
    this.isTableDataReady = this.isTableDataReady.bind(this);
    this.isAggregationDataReady = this.isAggregationDataReady.bind(this);
    this.handleClickShowFields = this.handleClickShowFields.bind(this);
    this.handleClickBackend = this.handleClickBackend.bind(this);

  }

  handleClickShowFields() {
     this.setState({ showFields: !this.state.showFields });
  }

  handleClickBackend(e) {
    this.setState({
      backend: e.currentTarget.value
      });
  }

  isTableDataReady(resources) {
    try {
      return !this.props.isFetching
             && resources.pagination.total > 0 ;
    } catch (e) {
      return false;
    }
  }

  isAggregationDataReady(resources) {
    try {
      return !this.props.isFetching
             && resources.responses[1].hits.total > 0 ;
    } catch (e) {
      return false;
    }
  }

  componentDidMount() {
    const { dispatch, page } = this.props;
    dispatch(fetchTopResourcesIfNeeded(page,
                                       this.state.query,
                                       this.state.fields,
                                       this.state.sort,
                                       this.state.backend));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.page !== this.props.page) {
      const { dispatch, page } = nextProps;
      dispatch(fetchTopResourcesIfNeeded(page,
                                        this.state.query,
                                        this.state.fields,
                                        this.state.sort,
                                        this.state.backend));
    }
  }

  handleNextPageClick(e) {
    e.preventDefault();
    const { page, resources } = this.props;
    try {
      if (resources.data.hits.length > 0) {
        // go to next page only if more resources may be available
        this.props.dispatch(selectResourcesPage(page + 1));
      }
    } catch (e) {
      // ignore no-data
    }
  }

  handlePreviousPageClick(e) {
     e.preventDefault();
    const page = this.props.page;
    if (page > 1) {
      this.props.dispatch(selectResourcesPage(page - 1));
    }
  }

  handleRefreshClick(e) {
    e.preventDefault();

    const { dispatch, page } = this.props;
    dispatch(invalidateResourcesPage(page));
    dispatch(fetchTopResourcesIfNeeded(page,
                                      this.state.query,
                                      this.state.fields,
                                      this.state.sort,
                                      this.state.backend));

  }

  handleQueryChange(e) {
    e.preventDefault();
    this.setState({query: e.target.value});
  }
  handleSortChange(e) {
    e.preventDefault();
    this.setState({sort: e.target.value});
  }
  handleFieldsChange(e) {
    e.preventDefault();
    this.setState({fields: e.target.value});
  }


  handleQuerySubmit(e) {
    e.preventDefault();
    const { dispatch, page } = this.props;
    dispatch(invalidateResources(page));
    dispatch(fetchTopResourcesIfNeeded(page,
                                        this.state.query,
                                        this.state.fields,
                                        this.state.sort,
                                        this.state.backend));


  }

  simplifyAggregation(responses, name='age_at_diagnosis') {
    try {
      const aggregation = _.filter(
                            responses,
                            'aggregations.' + name)[0]
                            .aggregations[name];
      const labels = aggregation.buckets.map(function(e) {
                                      return _.toString(e.key)
                                    } );
      const data = aggregation.buckets.map(function(e) {
                                      return e.doc_count
                                    } );
      const bar_chart_data = { 'labels':labels,
                               'datasets': [{'data':data}]
                             }
      return bar_chart_data;

    } catch (e) {
        console.log('simplifyAggregation',e);
        return {}
    }
  }

  chartClick(e) {
    e.preventDefault();
    const bars = this.refs.age_at_diagnosis.getBarsAtEvent(e);
    if (bars.length < 1)
      return;
    var a = this.state.query.split(' ')
    var key='age_at_diagnosis'
    var val=bars[0].label
    var idx = _.findIndex(
      a,
      function(s) {
        var x = key.toLowerCase() + ':'
        return _.startsWith(s.toLowerCase(),x);
      }
    );
    if (idx > -1) {
      a[idx] =  `${key}:${val}`
    } else  {
      a.push(`${key}:${val}`)
    }
    this.setState({query: a.join(' ')})
  }


  render() {
    const { page, error, resources, isFetching } = this.props;
    const prevStyles = classNames('page-item', { disabled: page <= 1 });
    const nextStyles = classNames('page-item', { disabled: resources.length === 0 });


    return (
      <div className="container-fluid">
        <div className="row">
          <Sidebar/>
          <div className="col-sm-9 ">
            <nav>

              <form >
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for..."
                    value={this.state.query}
                    onChange={this.handleQueryChange}
                    ></input>
                  <span className="input-group-btn">
                    <button
                      className="btn btn-default btn-primary"
                      type="submit"
                      onClick={this.handleQuerySubmit}
                      ><span className="fa fa-search" aria-hidden="true"></span>
                    </button>
                  </span>
                </div>


                { this.state.showFields &&
                  <button  onClick={this.handleClickShowFields}
                           className="btn btn-outline-primary pull-right"
                           style={{border:0, color:'grey', padding:4 }}>
                    <span className="fa fa-compress" aria-hidden="true"></span>
                  </button>
                }

                { !this.state.showFields &&
                  <button  onClick={this.handleClickShowFields}
                           className="btn btn-outline-primary pull-right"
                           style={{border:0, color:'grey', padding:4 }}>
                    <span className="fa fa-table " aria-hidden="true"></span>
                    &nbsp;
                    <span className="fa fa-sort " aria-hidden="true"></span>
                    &nbsp;
                    <span className="fa fa-info" aria-hidden="true"></span>
                  </button>
                }
                { this.state.showFields &&
                  <div>
                    <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Field list e.g. field1,field2,field3..."
                          value={this.state.fields}
                          onChange={this.handleFieldsChange}
                          ></input>
                        <span className="input-group-btn">
                          <button
                            className="btn btn-default"
                            type="button"
                            tabIndex="-1"
                            ><span className="fa fa-table" aria-hidden="true"></span>
                          </button>
                        </span>
                    </div>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Field to sort on e.g. field1:asc "
                        value={this.state.sort}
                        onChange={this.handleSortChange}
                        ></input>
                      <span className="input-group-btn">
                        <button
                          className="btn btn-default"
                          type="button"
                          tabIndex="-1"
                          ><span className="fa fa-sort" aria-hidden="true"></span>
                        </button>
                      </span>
                    </div>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="//TODO - search history, help..."
                        ></input>
                      <span className="input-group-btn">
                        <button
                          className="btn btn-default"
                          type="button"
                          tabIndex="-1"
                          ><span className="fa fa-history" aria-hidden="true"></span>
                        </button>
                      </span>
                    </div>
                    <div className="input-group">
                      <div className="pull-right"  >
                        <label  >
                          <input className="backend" name="backend" type="radio" value='mongo'
                            checked={this.state.backend === 'mongo'}
                            onChange={this.handleClickBackend} />Mongo
                        </label>
                        <label   >
                          <input className="backend" name="backend" type="radio"  value='elastic'
                            checked={this.state.backend === 'elastic'}
                            onChange={this.handleClickBackend} />Elastic
                        </label>
                        { this.state.backend === 'mongo' &&
                          <img className="backend" src={mongo_logo} alt='mongo'/>
                        }
                        { this.state.backend === 'elastic' &&
                          <img className="backend" src={elastic_logo} alt='elastic'/>
                        }
                      </div>
                    </div>
                  </div>
                }
                {this.isTableDataReady(resources) &&
                  <span className="pull-right total"><small className="text-muted"> Total: {resources.pagination.total}</small></span>
                }

              </form>


              {this.isTableDataReady(resources) &&
                <ul className="pagination pagination-sm">
                  <li className={prevStyles}><a className="page-link" href="#" onClick={this.handlePreviousPageClick}><span>Previous</span></a></li>
                  {!isFetching &&
                    <li className="page-item" ><a className="page-link" href="#" onClick={this.handleRefreshClick}><span>Refresh page {page}</span></a></li>
                  }
                  {isFetching &&
                    <li className="page-item"><span className="page-link"><i className="fa fa-refresh fa-spin"></i> Refreshing page {page}</span></li>
                  }
                  <li className={nextStyles}><a className="page-link" href="#" onClick={this.handleNextPageClick}><span>Next</span></a></li>
                </ul>
              }
            </nav>

            {
              error &&
              <div className="alert alert-danger">
                {error.message || 'Unknown errors.'}
              </div>
            }

            {
              resources && resources.warning &&
              <div className="alert alert-danger">
                {resources.responses[0].error.type}
              </div>
            }

            {!isFetching && !this.isTableDataReady(resources) &&
              <div className="alert alert-warning">Oops, nothing to show.</div>
            }


            {this.isAggregationDataReady(resources) &&
              <div>
                <h6>age_at_diagnosis</h6>
                <BarChart ref='age_at_diagnosis'
                  data={this.simplifyAggregation(resources.responses)}
                  onClick={this.chartClick}/>
                <br/>
                <div style={{display: 'inline-block', verticalAlign: 'top', paddingLeft: '20px'}}>
                  {this.state.dataDisplay ? this.state.dataDisplay : 'Click on a bar to show the value'}
                </div>
              </div>
            }

            {this.isTableDataReady(resources) &&
              <BootstrapTable data={resources.data.hits} striped={true} hover={true} condensed={true} selectRow={selectRowProp} >
                <TableHeaderColumn
                  columnClassName="json_td"
                  dataField="_id"
                  isKey={true}
                  dataFormat={cellFormatter}>json</TableHeaderColumn>
              </BootstrapTable>
            }


          </div>
        </div>
      </div>
    );
  }
}


ResourcesPage.propTypes = {
  page: PropTypes.number.isRequired,
  resources: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
};

function mapStateToProps(state) {
  const { selectedResourcesPage, resourcesByPage } = state;
  const page = selectedResourcesPage || 1;

  if (!resourcesByPage || !resourcesByPage[page]) {
    return {
      page,
      isFetching: false,
      didInvalidate: false,
      totalCount: 0,
      resources: [],
      error: null,
    };
  }

  return {
    page,
    error: resourcesByPage[page].error,
    isFetching: resourcesByPage[page].isFetching,
    didInvalidate: resourcesByPage[page].didInvalidate,
    totalCount: resourcesByPage[page].totalCount,
    resources: resourcesByPage[page].resources,
  };
}

export default connect(mapStateToProps)(ResourcesPage);
