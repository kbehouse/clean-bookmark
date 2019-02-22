import React, { Component } from 'react';
import './App.css';
import {Button, ButtonToolbar} from 'react-bootstrap'
import Bookmarks from './Bookmarks';


// l('l ok, but not global');
var l=console.log;
class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      node_ary: [],
      click_title:''
    };
    this.handle_empty_dir = this.handle_empty_dir.bind(this);
    this.handle_duplicate = this.handle_duplicate.bind(this);
    this.handleTest = this.handleTest.bind(this);
  }


  
  handle_empty_dir(e){
    l('in handle_empty_dir');
    var  resolve_get = () =>{
      return new Promise(resolve => {
        chrome.bookmarks.getTree((root_node_ary) => {
          var empty_dir_ary = [];
          var check_empty_dir = n =>{
            if('children' in n){
              if(n.children.length==0){
                // l(n.title + ' is empty dir');
                empty_dir_ary.push(n);
              }else if(n.children.length>0){
                for (let i = 0; i < n.children.length; i++) { 
                  check_empty_dir(n.children[i]);
                }
              }else{
                l('Strange array length');
              }
            }
          }
          var root_node = root_node_ary[0];
          l(root_node);
          
          check_empty_dir(root_node);
          resolve(empty_dir_ary);
          // l(empty_dir_ary);
          // l(this.show_path(empty_dir_ary[1]) );
          
        }); //getTree-end
      }); //Promise-end
    } //resove-end
    var wait_empty_dir_ary = resolve_get();
    wait_empty_dir_ary.then((empty_dir_ary) =>{
      l(empty_dir_ary);
      this.setState({'node_ary':empty_dir_ary,'click_title':'Empty Directories'});
    })
  }

  handle_duplicate(e){
    l('in handle_empty_dir');
    var  resolve_get = () =>{
      return new Promise(resolve => {
        chrome.bookmarks.getTree((root_node_ary) => {
          var empty_dir_ary = [];
          var check_empty_dir = n =>{
            if('children' in n){
              if(n.children.length==0){
                // l(n.title + ' is empty dir');
                empty_dir_ary.push(n);
              }else if(n.children.length>0){
                for (let i = 0; i < n.children.length; i++) { 
                  check_empty_dir(n.children[i]);
                }
              }else{
                l('Strange array length');
              }
            }
          }
          var root_node = root_node_ary[0];
          l(root_node);
          
          check_empty_dir(root_node);
          resolve(empty_dir_ary);
          // l(empty_dir_ary);
          // l(this.show_path(empty_dir_ary[1]) );
          
        }); //getTree-end
      }); //Promise-end
    } //resove-end
    var wait_empty_dir_ary = resolve_get();
    wait_empty_dir_ary.then((empty_dir_ary) =>{
      l(empty_dir_ary);
      this.setState({'node_ary':empty_dir_ary,'click_title':'Empty Directories'});
    })
  }


  async show_path(node){
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

  handleTest(e) {
    //this.setState({inputValue: e.target.value.toUpperCase()});
    console.log('in handleTest');
    // chrome.bookmarks.create({'parentId': 'AI',
    //     'title': 'Extension bookmarks'},
    //   function(newFolder) {
    // console.log("added folder: " + newFolder.title);
    // });
    // console.log('get ID=0');
    chrome.bookmarks.get('0',
      function(ary) {
        console.log('get ID=0  222');
        var n = ary[0];
        console.log('get ID=0, id=' + n.id + ', title=' + n.title);
    });
    // console.log('get ID=1');
    // chrome.bookmarks.get('1',
    //   function(n) {
    //     console.log('get ID=1 id=' + n.id + ', title=',n.title);
    // });

    // chrome.bookmarks.search('react-bootstrap',
    //   ary => {
    //     var n = ary[0];
    //     console.log(n);
    //     console.log('search AI id=' + n.id + ', title=',n.title);
    // });

    chrome.bookmarks.getTree(
      function(node) {
        console.log(node);
    });
    
  }

  render() {
    const node_ary = this.state.node_ary;

    // let bookmarks= (node_ary.length > 0)? <Bookmarks node_ary={node_ary} />:'';
    return (
      <div className="App">
        <h2 className="app-name">Clean Bookmark</h2>
        <hr />
        <div className="content">
          <ButtonToolbar>   
            <Button onClick={this.handle_empty_dir}>Empty Directories</Button>
            <Button onClick={this.handle_duplicate}>Duplicates Name</Button>
            <Button onClick={this.handle_duplicate}>Duplicates URL</Button>
            <Button onClick={this.handleTest}>Test</Button>
          </ButtonToolbar>
        </div>
        <Bookmarks node_ary={node_ary} title={this.state.click_title} />
      </div>
    );
  }
}

export default App;
