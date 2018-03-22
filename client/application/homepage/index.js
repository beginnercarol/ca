import React,{Component} from 'react';
import autoBind from 'react-autobind';

class Homepage extends Component{
    constructor(props){
        super(prosp);
        this.state={
            
        }
    }
    render(){
        const homeList = ['Home','News','Articles','Links'];
        return (
            <div class="homepage-content">
                <div className="main"></div>
                <div className="left-nav">
                    <ul className="home-nav">
                        {
                            homeList.forEach((item)=>{
                                return <li>{item}</li>  
                            })
                        }
                    </ul>
                </div>
            </div>
        ) 
    }
}

export default Homepage;