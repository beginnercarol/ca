import './index.scss';
import react,{Component} from 'react';


class Slider extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    render(){
        return (
            <div className="slider-wrapper">
                <SliderImg imgSrc={this.props.srcset}/>
                <SliderControl />
            </div>
        )
    }
}

function SliderImg(props){
    const imgSrc = props.imgSrc;
    let urlSet = imgSrc.map((val)=>{
        return ;
    })
    return (
        <div className="slider-img">

        </div>
    )
}

