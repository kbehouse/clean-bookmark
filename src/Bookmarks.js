/*
  description:
    show clear all button and all bookmarks
  note:
    Bookmark = node 
*/
import React, { Component } from 'react';
import {Button,Alert} from 'react-bootstrap'
import Bookmark from './Bookmark';


var l = console.log;
class Bookmarks extends Component {
  constructor(props) {
    super(props);

    this.state = { node_ary: props.node_ary, title: props.title};

    this.handle_remove_all = this.handle_remove_all.bind(this);
    this.handle_remove_one = this.handle_remove_one.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ node_ary: nextProps.node_ary, title: nextProps.title });
  }

  handle_remove_one(node) {
    chrome.bookmarks.remove(node.id);
    var node_ary = this.state.node_ary;
    node_ary.splice( node_ary.indexOf(node), 1 );
    this.setState({ node_ary: node_ary});
  }

  handle_remove_all() {
    this.state.node_ary.map( (node) => { 
      chrome.bookmarks.remove(node.id);
    });
    this.setState({ node_ary: []});
  }

  render() {    
    const bookmarkListStyle = { marginTop: '20px', marginLeft: '20px' };

    return (
      <div style={bookmarkListStyle}>
        <div>
          <h3>{this.state.title}</h3>
        </div>
        <div>
        {this.state.node_ary.length>0 ?
      <Alert variant="warning">
       <strong> Warning!</strong> Following actions will delete bookmarks or directories!
      </Alert>
      :''}
        </div>
        <div>
          {this.state.node_ary.length>0 ?
              <Button variant="danger" onClick={this.handle_remove_all}>
                Clear All Bookmarks
              </Button>
           :''}
        </div>

        {this.state.node_ary.map((node) =>
          <div className="bookmark-container">
            <span
              className="bookmark-x-icon"
              onClick={() => this.handle_remove_one(node)} />
            <span className="bookmark-content"><Bookmark node={node} /></span>
          </div>
        )}
      </div>
    );
  }
}

export default Bookmarks;
