import './index.scss'
import cn from 'classnames';
import moment from 'moment';
import React , { Component } from 'react';
import autoBind from 'react-autobind';
import { Form,Input,InputNumber,Button,
    Checkbox,message,Radio,Collapse,
    Select,Col, 
    Row ,Tooltip,Icon} from 'antd';
// import _ from 'lodash';
// import { httpFetch } from '@didi/nsky-http';
// import NskyMetricSelect from '../nsky-overview/'

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const Panel = Collapse.Panel;
const InputGroup = Input.Group;

const formItemLayout = {
    labelCol: {
      sm: { span: 6 },
    },
    wrapperCol: {
      sm: { span: 12 },
    },
};

class FormConfig extends Component{
    constructor(props){
        super(props);
        autoBind(this);
        this.state={
            buLines : [],
            allMeasures:['htm','dirver','lay','hhhh'],
            defaultMetrics:['htw','driver'],
            status:0,
        }
    }
    componentDidMount(){
        this.getAllBuLines().then((buLines)=>{
            this.setState({
                buLines,
            })
        });
        this.getAllIndex().then((index)=>{
            this.setState({
                allMeasures:index
            })
        })
    }
    async getAllIndex(){
        let index = await fetch('/platform/getallcubes');
        console.log("index=>",index);
        return index.data;
    }
    async getAllBuLines(){
        let buLines = await fetch('/platform/nsky-query/v1/olap/alterdashboardmetadata');
        console.log("buLines=>",buLines);
        return buLines.data;
    }
    async getAllActivities(){

    }
    handleSubmit(event){
        event.preventDefault();
        let value = this.props.form.getFieldsValue();
        let params = {

        }
    }
    addItems(){
        this.setState({
            status:1
        },()=>{
            console.log('this.state=>',this.state);
        })
    }
    render(){
        const {form} = this.props;
        const {getFieldDecorator,resetFields} = form;
        const state = this.state;
        const ModifyItem = cn({
            "form-config-collapse":true,
            "form-config-collapse-hidden":!!(this.state.status!=1)
        })
        let buLines = [];
        state.buLines.length>0?state.buLines.forEach((bu,index)=>
            buLines.push(<Option key={index} value={index}>{bu}</Option>)):null;
        return (
            <div className="from-config">
                <h3 className="conditions">筛选条件</h3>
                <Form>
                    <FormItem label={(
                            <span>业务线</span>
                        )} {...formItemLayout}>
                        {getFieldDecorator('buLine')(
                            <Select name='bu-line'
                                mode="multiple">
                                {buLines}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label={(
                            <span>分类编码</span>
                        )} {...formItemLayout}>
                        {getFieldDecorator('catCode',{
                            initialValue:null,
                        })(
                            <Input placeholder="输入分类编码" />
                        )}
                    </FormItem>
                    <FormItem label={(<span>分类名称</span>)} 
                        {...formItemLayout}>
                        {getFieldDecorator('catName',{
                            initialValue:0,
                        })(
                            <Input placeholder="输入分类名称"/>
                        )}
                    </FormItem>
                    <FormItem label={<span>创建时间</span>}
                        {...formItemLayout}>
                        {getFieldDecorator('createTime',{
                            initialValue:0,
                        })(
                            <Input placeholder="输入分类名称"/>
                        )}
                    </FormItem>
                    <FormItem label={<span>修改时间</span>}
                        {...formItemLayout}>
                        {getFieldDecorator('modifyTime',{
                            initialValue:0,
                        })(
                            <Input placeholder="输入分类名称"/>
                        )}
                    </FormItem>
                    <Button onClick={this.handleSubmit}>查询</Button>
                    <Button onClick={()=>{resetFields()}}>重置</Button>
                    <Button onClick={this.addNewItems}>新增</Button>
                    <div className={ModifyItem}>
                        modify
                    </div>
                </Form>
                <div className="form-index">
                    <h3>符合条件</h3>
                    <div className="change-index">
                    {/* <Popover
                        
                        title="Title"
                        trigger="click"
                        visible={this.state.visible}
                        onVisibleChange={this.handleVisibleChange}
                    >
                        <div className="popover-wrapper">
                            修改指标
                        </div>
                        <Button type="primary">Click me</Button>
                    </Popover> */}
                    </div>
                    <div className="act-items">
                        {/* <ActivityItems /> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default Form.create()(FormConfig);