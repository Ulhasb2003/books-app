import React from 'react';
class SearchText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: 'javascript', //initial data
            books: [],
            showDetails: false,
        }
        this.updateState = this.updateState.bind(this);
        this.onClickSearch = this.onClickSearch.bind(this);
        this.showDescription = this.showDescription.bind(this);
    };
    showDescription(item, e) {
        // clicking book link it display book details at right side
        e.preventDefault();
        this.setState({ showDetails: true, item: item });
    }
    onClickSearch(e) {
        // To search a book in google api and store data in book state.
        let targetValue = this.state.data;
        let search = targetValue;
        if (search) {
            fetch("https://www.googleapis.com/books/v1/volumes?q=" + search)
                .then(results => {
                    return results.json();
                }).then(data => {
                    if (data) {
                        let thumbnail = "";
                        let books = data.items.map((item) => {
                            if (item.volumeInfo.imageLinks) {
                                thumbnail = item.volumeInfo.imageLinks.thumbnail
                            }
                            return (
                                <div key={item.etag}>
                                    <img width="15px" height="auto" src={thumbnail} alt="" />
                                    <a href="#" onClick={this.showDescription.bind(this, item.volumeInfo)}>{item.volumeInfo.title}</a>,
                                    by:{item.volumeInfo.authors}
                                </div>
                            )
                        });
                        this.setState({ books: books });
                        console.log("state", this.state.books);
                    }
                    else {
                        this.setState({ books: [] });
                        console.log("state", this.state.books);
                    }
                })
        }
        else {
            this.setState({ books: [] });
            console.log("state", this.state.books);
        }
    }
    updateState(e) {
        // update textbox with entered value
        this.setState({ data: e.target.value });
    }
    render() {
        let item = this.state.item;
        return (
            <div>
                <table className="center">
                    <tbody>
                        <tr>
                            <td>
                                Book Search:<input type="text" value={this.state.data}
                                    onChange={this.updateState} placeholder="search a book..." />
                                <button onClick={this.onClickSearch}>Search</button>
                                <span>(Post search click a book link to see details...)</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <col width="30%" />
                    <col width="70%" />
                    <tbody>
                        <tr>
                            <td>
                                <h4>
                                    {this.state.books}
                                </h4>
                            </td>
                            {this.state.showDetails &&
                                <td>
                                    <h2>
                                        <div>
                                            <div key={item.id}>
                                                Title:{item.title}
                                            </div>
                                            <div>
                                                <span >Subtitle:{item.subtitle}</span>
                                            </div>
                                            <div><img width="100px" height="auto" src={item.imageLinks.thumbnail} alt="" /></div>
                                            <div>Author:{item.authors} <span>Pages:{item.pageCount}</span></div>
                                            <div>Ratings:{item.averageRating}</div>
                                            <div><ReadMore description={item.description} /></div>
                                        </div>
                                    </h2>
                                </td>
                            }
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
class ReadMore extends React.Component {
    // component to add read more feature.
    constructor(props) {
        super(props);
        this.state = {
            more: false,
        };
        this.setMore = this.setMore.bind(this);
    };
    setMore(e) {
        e.preventDefault();
        this.setState((state) => ({
            more: !state.more
        }));
    }
    render() {
        let description = this.props.description;
        if (this.state.more) {
            return (
                <div>
                    Description:{description} <a href="#" onClick={this.setMore}>less...</a>
                </div>
            );
        }
        description = description?this.props.description.slice(0, 300):"";
        return (
            <div>
                Description:{description} <a href="#" onClick={this.setMore}>more...</a>
            </div>
        );
    }
}
export default SearchText;