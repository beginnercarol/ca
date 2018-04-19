import React, { Component } from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';
import { Select, Button, Upload, message, Icon } from 'antd';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import iActions from '../../actions'


import { pickBy, values, uniq, reduce } from 'lodash';
import './index.css';


const Option = Select.Option;

class DriverFilter extends Component {

    constructor(props) {
        super(props);
        this.uploadFormDom = null;
        this.state = {
            tagItemType: "tag",
            selectedTag: null,
            // tagList: null,
            visiable: props.visiable,
            driverList: [],
            driverListName: null,
            uploading: false,
            fileList: []
        }
    }

    handleChangeMode(value) {
        this.setState({
            "tagItemType": value,
            fileList: [],
            driverList: [],
            selectedTag: null
        });
    }

    handleCdhangeTag(value) {
        // this.selectedTag = value;
        this.setState({
            selectedTag: value
        });
    }

    addFilter() {
        var query = {};
        switch (this.state.tagItemType) {
            case "tag":
                // let selectItem =this.props.tagList[this.selectedTag];
                // selectItem = this.selectedTag == -1 ? "全部司机" : this.props.tagList[this.selectedTag]

                // }
                query.id = this.state.selectedTag;
                query.name = this.state.selectedTag == -1 ? "全部司机" : this.props.tagList[this.state.selectedTag]
                break;
            case "upload":
                query.id = -2;
                query.name = this.state.driverListName;
                query.driverList = this.state.driverList;
                break;
        }
        this.props.onSubmit(query);
    }

    componentDidMount() {
        let { cityIds } = this.props;
        cityIds = (cityIds && cityIds.length > 0) ? uniq(cityIds).join(',') : "";
        const { actions } = this.props;
        let tagList;
        actions.fetchGetTags({ "cityIds": cityIds });
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.tagList) {
        // }
    }

    initForm(dom) {
        if (dom) {
            this.uploadFormDom = dom;
        }
    }

    render() {
        const { position, defaultSelectItem } = this.props;

        const myClass = classnames({
            "driver-filter": true,
            "isShow": this.state.visiable
        });
        const { uploading } = this.state;
        const type = 1;
        // const activityId = 69640;

        let tags;
        if (this.props.tagList) {
            tags = reduce(this.props.tagList, (result, value, key) => {
                result.push({ id: key, name: value });
                return result;
            }, [defaultSelectItem]);
        }


        // const action = `/platform/v1/express/reward/overview/${type}/${activityId}/upload`;

        // 只解析文件返回driverList
        const uploadProps = {
            action: "/platform/v1/express/reward/overview/upload",
            name: 'file',
            onRemove: (file) => {
                this.setState({
                    driverList: null
                });
            },
            onChange: (info) => {
                if (info.file.type !== 'text/plain') {
                    message.warning(`${info.file.name} 不能解析非txt文件`);
                    return;
                }
                if (info.file.status !== 'uploading') {
                    this.setState({
                        uploading: false
                    })
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 文件解析成功 `);
                    this.setState({
                        driverList: info.file.response,
                        driverListName: info.file.name
                    });
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }

                // 限制上传文件数量
                let fileList = info.fileList;

                // 1. Limit the number of uploaded files
                //    Only to show two recent uploaded files, and old ones will be replaced by the new
                // fileList = fileList.unshift(1, 1);
                if (fileList.length > 1) {
                    fileList.shift();
                }
                this.setState({ fileList });
            },
            beforeUpload: (file, fileList) => {
                // 上传之前要 清空
                this.setState({
                    driverList: null
                });
            }
        };


        return (
            <div className={myClass} style={{ top: position.top, left: position.left }}>
                <div className="triangle-left"></div>
                <div className="driver-filter-title">
                    添加分组
                    <a className="filter-close" onClick={this.props.onClose}>
                        <Icon type="close" />
                    </a>
                </div>
                <div className="driver-filter-content">
                    <form className='upload-form' ref={this.initForm.bind(this)}>
                        <label>添加方式</label>
                        <Select defaultValue="tag" style={{ width: 240, marginBottom: 10 }} onChange={this.handleChangeMode.bind(this)}>
                            <Option value="tag">标签</Option>
                            <Option value="upload">上传文件</Option>
                        </Select>


                        {this.state.tagItemType == 'tag' ?
                            (<div className="tag-select">
                                <label>选择标签</label>
                                <Select defaultValue="请选择" style={{ width: 240, marginBottom: 10 }} onChange={this.handleCdhangeTag.bind(this)}>
                                    {
                                        tags ? tags.map((value, key) => {
                                            return <Option key={key} value={value.id}>{value.name}</Option>
                                        }) : null
                                    }
                                </Select>
                            </div>) :
                            (<div className="upload-file">
                                <Upload {...uploadProps} fileList={this.state.fileList} style={{ marginBottom: 10 }}>
                                    <Button>
                                        <Icon type="upload" />选择文件
                                    </Button>
                                </Upload>
                                <p>支持扩展名：.txt </p>
                            </div>)
                        }
                    </form>
                </div>
                <div className="driver-filter-footer">
                    <Button className="pull-right driver-filter-submit" disabled={(this.state.tagItemType == 'tag' && this.state.selectedTag === null) || (this.state.tagItemType == 'upload' && this.state.fileList.length === 0)} onClick={this.addFilter.bind(this)}>确定</Button>
                    <Button className="pull-right driver-filter-cancel" onClick={this.props.onClose}>取消</Button>
                </div>
            </div >
        );
    }
}



const mapStateToProps = (state) => {
    return {
        ...state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, iActions), dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DriverFilter)
