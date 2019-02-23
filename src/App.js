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
    this.handle_duplicate_title = this.handle_duplicate_title.bind(this);
    this.handle_duplicate_url = this.handle_duplicate_url.bind(this);
    // this.handleTest = this.handleTest.bind(this);
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


  //duplicate_title same as duplicate_name (chrome API use title)
  handle_duplicate_title(e){
    this.find_same_property('title', 'Duplicate Name');  //title is API property
  }

  handle_duplicate_url(e){
    this.find_same_property('url', 'Duplicate URL');  //url is API property
  }


  resolve_one_ary (){
    return new Promise(resolve => {
      chrome.bookmarks.getTree((root_node_ary) => {
        var one_ary = [];
        var check_node = n =>{
          one_ary.push(n);
          if('children' in n){
            if(n.children.length>0){
              for (let i = 0; i < n.children.length; i++) { 
                check_node(n.children[i]);
              }
            }
          }
        }
        var root_node = root_node_ary[0];
        check_node(root_node);
        resolve(one_ary);       
      }); //getTree-end
    }); //Promise-end
  } //resove-end
  find_same_property(chk_property="title",click_title='Duplicate Name'){
    // l('in handle_duplicate_title');
    var wait_ary = this.resolve_one_ary();
    wait_ary.then((one_dim_ary) =>{
      // l(one_dim_ary);
      var same_title_ary = []
      for(let i = 0;i < one_dim_ary.length;i++){
        var check_title = one_dim_ary[i][chk_property];
        if(check_title=='' || check_title==undefined){
          continue;
        }
        var same_count=0;
        // l('check property -> ' + check_title);
        for(let j = 0;j < one_dim_ary.length;j++){
          if(check_title==one_dim_ary[j][chk_property]){
            // l('\tsame property = ' + check_title);
            same_count++;
            same_title_ary.push(one_dim_ary[j]);
            one_dim_ary.splice(j, 1); 
          }
        }
        if(same_count<2){       //find same node
          same_title_ary.pop();   //pop last
        }
      }
      l('same_title_ary -> ');l(same_title_ary);
      this.setState({'node_ary':same_title_ary,'click_title':click_title});
    });
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
            <Button onClick={this.handle_duplicate_title}>Duplicate Name</Button>
            <Button onClick={this.handle_duplicate_url}>Duplicate URL</Button>
          </ButtonToolbar>
        </div>
        <Bookmarks node_ary={node_ary} title={this.state.click_title} />
      </div>
    );
  }
}

export default App;
