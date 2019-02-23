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

    this.state = { node_ary: props.node_ary, title: props.title, child_render_max:0};

    this.handle_remove_all = this.handle_remove_all.bind(this);
    this.handle_remove_one = this.handle_remove_one.bind(this);
    this.handle_reserve_first_title_item = this.handle_reserve_first_title_item.bind(this);
    this.handle_load_next_pace = this.handle_load_next_pace.bind(this);

    this.child_path_ready = this.child_path_ready.bind(this);
    this.child_path_ready_id = 0;

    this.child_render_pace = 500;

  }

  componentWillReceiveProps(nextProps) {
    
    this.child_path_ready_id = 0;

    var child_render_max = nextProps.node_ary.length < this.child_render_pace ?  nextProps.node_ary.length : this.child_render_pace; 
  
    this.setState({ node_ary: nextProps.node_ary, title: nextProps.title,child_render_max: child_render_max });
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

  handle_reserve_first_title_item(){
    var processing_title = '';
    // var tmp_ary = [];
    var now_node_ary = this.state.node_ary;
    // this.state.node_ary.map( (node) => { 
    for(var i = 0;i < now_node_ary.length;i++){
      var n = now_node_ary[i];
      if(processing_title!=n.title){
        processing_title = n.title;
      }else{
        now_node_ary.splice(i,1);
        i--;
      }
    // });
    }
    this.setState({ node_ary: now_node_ary});
  }

  child_path_ready(){
    this.child_path_ready_id++;

    //if
    if (this.child_path_ready_id>= this.state.child_render_max*0.9){
      // l('child_path_ready() this.child_path_ready_id = ' + this.child_path_ready_id);
      var child_render_max = this.state.child_render_max+ this.child_render_pace;
      
      setTimeout(()=>{
        this.setState({child_render_max:child_render_max});
      },1000);
    }

    // l('this.child_path_ready_id = ' + this.child_path_ready_id);
  }
  
  render_bookmark_list() {
    // l(this.state.child_render_max);
    var show_ary= this.state.node_ary.slice(0,this.state.child_render_max);
    //var show_load_next_btn = (this.state.child_render_max) < this.state.node_ary.length? (): '';
    // l(show_ary);
    return (
      show_ary.map((node,index) =>
        <div key={index}  className="bookmark-container">
          <span 
            className="bookmark-x-icon"
            onClick={() => this.handle_remove_one(node)} />
          <span className="bookmark-content"><Bookmark index={index} node={node} is_render={true} child_path_ready={this.child_path_ready} /></span>
      </div>
    
    ));
  }
  
  handle_load_next_pace(){
    var child_render_max = this.state.child_render_max+ this.child_render_pace;
    this.setState({child_render_max:child_render_max});
  }

  render() {    
    const bookmarkListStyle = { marginTop: '20px', marginLeft: '20px' };
    const item_num_str = this.state.title!='' ? 'Find ' + this.state.node_ary.length +' items' : '';
    var btn_title = '';
    var btn_handle = null;
    if(this.state.title=='Empty Directories'){
      btn_title = 'Clear All Bookmarks';
      btn_handle = this.handle_remove_all;
    }else if(this.state.title=='Duplicate Name' || this.state.title=='Duplicate URL' ){
      btn_title = 'Only reserve first item';
      btn_handle = this.handle_reserve_first_title_item;
    }
    // l('in Bookmars render');
    return (
      <div style={bookmarkListStyle}>
        <div>
          <span className="bookmark-title">{this.state.title}</span> <span className="bookmark-subtitle">{item_num_str}</span>
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
              <Button variant="danger" onClick={btn_handle}>
                {btn_title}
              </Button>
           :''}
        </div>

        {this.render_bookmark_list()}
        
        {this.state.node_ary.length>this.state.child_render_max ?
        <div>
          <Button variant="info" onClick={this.handle_load_next_pace}>
            Load Next {this.child_render_pace} Bookmarks ({this.state.child_render_max +"/"+this.state.node_ary.length})
          </Button>
        </div>
        :''}
          
      </div>
    );
  }
}

export default Bookmarks;
