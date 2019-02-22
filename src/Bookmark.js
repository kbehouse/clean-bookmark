/*
  description:
    show clear all button and all bookmarks
  note:
    Bookmark = node 
*/
import React, { Component } from 'react';
import {Button} from 'react-bootstrap'

class Bookmark extends Component {
  constructor(props) {
    super(props);
    this.state = { node: props.node, path:'' };
    this.show_path(props.node);
  }

  componentWillReceiveProps(nextProps) {
    console.log('in componentWillReceiveProps');
    this.setState({ node: nextProps.node });
    this.show_path(nextProps.node);
  }

  show_path(node){
    var path_pending = this.get_path(node);
    path_pending.then((path_result) => {
        // console.log('path_pending result='+ path_result) // "Some User token"
        this.setState({ path: path_result });
    })
  }

  async get_path(node){
    var check_parent_id = async n =>{
      if(n.parentId=="0"){
        return '/' + n.title;
      }else{
        var  resolve_get = (x) =>{
          return new Promise(resolve => {
            chrome.bookmarks.get(n.parentId, parent_node=>{
              var parent_path = check_parent_id(parent_node[0]);
              resolve(parent_path);
            });
          });
        }
        var parent_path = await resolve_get(n);
        return  parent_path + '/' + n.title;
      }
    }
    var path =  await check_parent_id(node);
    // l('in show_path path='+path);
    return path;
  }

  render() {
    const path = this.state.path; 
    return path;
  }
}

export default Bookmark;
