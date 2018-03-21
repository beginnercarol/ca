import React, { Component } from "react";
import autoBind from "react-autobind";
import {Filter} from "./todoApp";
class Footer extends Component {
    handleFilter(filter,name){
        if(filter==this.props.filter){
            return name;
        }
        return (
            <a href="javascript:void(0)" 
            onClick={()=>{this.props.handleFilter(filter)}}>
            {name}
            </a>
        );
    }
    render() {
        return <div className="footer-wrapper">
            Show:
            {this.handleFilter(Filter.SHOW_ALL, "All")}
            ,
            {this.handleFilter(Filter.SHOW_COMPLETED, "Completed")}
            ,
            {this.handleFilter(Filter.SHOW_ACTIVE, "Active")}
          </div>;
    }
}

export default Footer;
