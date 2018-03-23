import './index.scss';
import React,{Component} from 'react';
import autoBind from 'react-autobind';

class FlattenMenu extends Component{
    constructor(props){
        super(props);
        autoBind(this);
        this.state={
            status:1,
        }
    }
    handleTabChange(event,index){
        this.setState({
            status:index,
        },()=>{
            console.log(index);
        })
    }
    render(){
        let state = this.state;
        let content = null;
        switch(state.status){
            case 1:
               content = <LikeList/>
               break;
            case 2:
                content =  <ListDone />
                break;
            case 3:
                content =  <Setting />
                break;
            default:
                content = <LikeList />
        }
        return (
            <div className='flatten-menu'>
                <div className='header'>
                    <ul>
                        <li onClick={(e)=>this.handleTabChange(e,1)}>Todos</li>
                        <li onClick={(e)=>this.handleTabChange(e,2)}>Done</li>
                        <li onClick={(e)=>this.handleTabChange(e,3)}>Settings</li>
                    </ul>
                </div>
                <div className='main'>
                    {content}
                </div>
            </div>
        )
    }
}

function LikeList(props){
    return (
        <ul>
            <li>Jucy Judy</li>
            <li>Bershaka</li>
            <li>Lemon</li>
            <li>Lime</li>
            <li><a href="localhsot:8079/">Orange</a></li>
        </ul>
    )
}

function ListDone(props){
    return (
        <ul>
            <li>Charlse Keith</li>
            <li>Bershaka</li>
            <li>Cache</li>
            <li>Lime</li>
            <li><a href="localhsot:8079/">Orange</a></li>
        </ul>
    )
}
function Setting(props){
    return (
        <div>
            settings
        </div>
    )
}

export default FlattenMenu;