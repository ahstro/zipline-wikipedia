let SearchBar = React.createClass({
  handleSubmit: function (e) {
    e.preventDefault()
    let query = this.refs.query.value.trim()
    this.props.fetchDataFromWiki(query)
  },
  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input ref='query' type='text' placeholder='Search..' />
      </form>
    )
  }
})

let SearchResults = React.createClass({
  render: function () {
    let results = this.props.searchResults.map((article) => {
      let url = `${this.props.apiUrl}wiki/${article.title}`
      console.log(article.snippet)
      return (
        <a href={url} target='_blank'>
          <div className='article'>
            <h1>{article.title}</h1>
            <p dangerouslySetInnerHTML={{__html: article.snippet + '...'}} />
          </div>
        </a>
      )
    })
    return <div>{results}</div>
  }
})

let MediaWikiViewer = React.createClass({
  getInitialState: function () {
    return {results: []}
  },
  componentDidMount: function () {
    // TODO: Get query directly from url?query=foo
  },
  fetchDataFromWiki: function (query) {
    // TODO: Figure out CORS without jQuery

    $.ajax({
      url: `${this.props.apiUrl}w/api.php`,
      data: {
        action: 'query',
        list: 'search',
        format: 'json',
        srsearch: query,
        srinfo: null,
        srprop: 'snippet'
      },
      dataType: 'jsonp',
      success: function (x) {
        this.setState({results: x.query.search})
      }.bind(this)
    })
  },
  render: function () {
    return (
      <div>
        <SearchBar fetchDataFromWiki={this.fetchDataFromWiki} />
        <SearchResults searchResults={this.state.results} apiUrl={this.props.apiUrl} />
      </div>
    )
  }
})

ReactDOM.render(
  <MediaWikiViewer apiUrl='https://en.wikipedia.org/' />,
  document.getElementById('main')
)
