import React, {Component} from 'react';
import {
    Layout,
    Skeleton,
    Breadcrumb,
    Descriptions,
    Divider,
    notification,
    List,
    Tag,
    Avatar,
    Row,
    Col,
    Statistic,
    Button,
    Modal,
    ConfigProvider,
    Radio,
    Input,
    Rate,
    message, Form, InputNumber
} from "antd";

import { WaterWave,Pie } from 'ant-design-pro/lib/Charts';
import 'ant-design-pro/dist/ant-design-pro.css';
import SelectAccount from "./component/SelectAccount"
import Axios from "./server";
import BigNumber from "bignumber.js"
import "./App.css"
import copy from "copy-text-to-clipboard";
import QRCode from "qrcode";
import logo from "./logo.png"
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import Language from "./Lang"
import identicon from "identicon.js"
import Contract from "./component/contract"

let contract = new Contract();
let Lang = new Language();
const {Header, Content, Footer} = Layout;

let ajax = new Axios();
let contractAddress = contract.address;
let ABI = contract.abi;

let decimal = new BigNumber(10).pow(18);
const { Countdown } = Statistic;
const { TextArea } = Input;

const openNotificationWithIcon = (type,message,desc) => {
    notification[type]({
        message: message,
        description: <p style={{wordBreak:'normal',whiteSpace:'pre-wrap',wordWrap:'break-word'}}>{desc}</p>,
        duration:null,
    });
};

const BuyAsnowForm = Form.create({ name: 'form_in_modal1' })(
    // eslint-disable-next-line
    class extends React.Component {

        state={
            asnow:0,
            confirmLoading:false,
        }

        inputSero=(v,rate)=>{
            let value = new BigNumber(v).dividedBy(rate).toFixed(2);
            this.setState({
                asnow:value
            })
        }

        render() {
            const { visible,rate, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            let that = this;
            return (
                <Modal
                    visible={visible}
                    title={Lang[that.props.lang].account.modal.buyAsnow.title}
                    onCancel={onCancel}
                    onOk={()=>{
                        this.setState({
                            confirmLoading:true
                        });
                        onCreate(function (res) {
                            that.setState({
                                confirmLoading:res
                            });
                        });
                    }}
                    confirmLoading={this.state.confirmLoading}
                >
                    <Form layout="vertical">
                        <Form.Item label={Lang[that.props.lang].account.modal.buyAsnow.amount}>
                            {getFieldDecorator('Amount', {
                                rules: [{ required: true, message: `Please Input Amount` }],
                            })(<InputNumber min={0} step={100} style={{width:'100%'}}  allowClear onChange={(v)=>this.inputSero(v,rate)} placeholder={Lang[that.props.lang].account.modal.buyAsnow.amountPlace} autoComplete="off"/>)}
                        </Form.Item>
                        <p>Rate: {<span style={{color:'#1DA57A'}}>1 ASNOW = {rate} SERO</span>} , Exchange: {<strong style={{color:'rgb(216, 0, 38)'}}>{new BigNumber(this.state.asnow).toFixed(6)}</strong>} ASNOW</p>
                        <Form.Item label={Lang[that.props.lang].account.modal.buyAsnow.password}>
                            {getFieldDecorator('Password', {
                                rules: [{ required: true, message: `Please Input Password!` }],
                            })(<Input.Password allowClear placeholder={Lang[that.props.lang].account.modal.buyAsnow.passwordPlace} autoComplete="new-password"/>)}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    },
);

const InvestForm = Form.create({ name: 'form_in_modal2' })(
    class extends React.Component {

        state={
            confirmLoading:false,
            estimateReturn:0,
            estimateLevel:0,
            ticket:0.000000,
            amount:0.000000,
            total:0.000000,
            ticketSero:0.000000,
            ticketAsnow:0.000000,
        }

        staticTotal(){
            let that = this;
            setTimeout(function () {
                let rate = that.props.rate;
                let times = that.props.times;
                let ticket = new BigNumber(that.state.ticketSero) ;
                let total = new BigNumber(that.state.amount);
                let ticketAsnow = new BigNumber(that.state.amount).dividedBy(10).dividedBy(rate);

                let estimateLevel = 3;
                if(times>0){
                    estimateLevel = times;
                }else{
                    if (parseFloat(that.state.amount)>0 && parseFloat(that.state.amount)<1000){
                        estimateLevel = 3
                    }else if (parseFloat(that.state.amount)>=1000 && parseFloat(that.state.amount)<5000){
                        estimateLevel = 4
                    }else if (parseFloat(that.state.amount)>=5000 ){
                        estimateLevel = 5
                    }
                }

                that.setState({
                    ticket:ticket.toFixed(6),
                    total:total.toFixed(6),
                    ticketAsnow:ticketAsnow.toFixed(6),
                    estimateLevel:estimateLevel
                })
            },10)
        }

        render() {
            const { visible,asnow,rate,sero, onCancel, onCreate, form ,referId} = this.props;
            const { getFieldDecorator,setFieldsValue } = form;

            setTimeout(function () {
                if(referId && referId!==0){
                    setFieldsValue({"ReferId":referId});
                }
            },100)

            let that = this;
            return (
                <Modal
                    visible={visible}
                    title={Lang[that.props.lang].account.modal.invest.title}
                    onCancel={onCancel}
                    onOk={()=>{
                        this.setState({
                            confirmLoading:true
                        });
                        onCreate(function (res) {
                            that.setState({
                                confirmLoading:res
                            });
                        });
                    }}
                    confirmLoading={this.state.confirmLoading}
                >
                    <Form layout="vertical">
                        <Form.Item label={Lang[that.props.lang].account.modal.invest.referId}>
                            {getFieldDecorator(`ReferId`, {
                                rules: [{ required: true, message: `Please Input Refer Id` }],
                            })(<Input style={{width:'30%'}} disabled={!(!referId||referId===0)} placeholder={referId?referId:""} autoComplete="off"/>)}
                        </Form.Item>
                        <Form.Item label={`${Lang[that.props.lang].account.modal.invest.amount} (Available Balance: ${sero} SERO)`}>
                            {getFieldDecorator('AmountSero', {
                                rules: [{ required: true, message: `Please Input Amount! ` }],
                            })(<InputNumber min={0} precision={6} max={parseFloat(sero)} step={100} style={{width:'30%'}} onChange={(v)=>{
                                let ticketSero= new BigNumber(v).dividedBy(10).toFixed(6);
                                setFieldsValue({'TicketSero':ticketSero});
                                that.setState({ amount:v,ticketSero:ticketSero});
                                that.staticTotal();
                            }} allowClear placeholder="0.000000" autoComplete="off"/>)} SERO ({Lang[that.props.lang].account.modal.invest.amountTips})
                        </Form.Item>
                        <Form.Item label={`${Lang[that.props.lang].account.modal.invest.ticket} (Amount x 10%)`}>
                            {getFieldDecorator('TicketSero', {
                                rules: [{ required: true, message: 'Please input SERO value!' }],
                            })(<InputNumber precision={6} disabled={true} min={0} max={parseFloat(sero)} step={100} style={{width:'30%'}} onChange={(v)=>{
                                that.setState({ ticketSero:v });
                                that.staticTotal();
                            }} allowClear placeholder="0.000000" autoComplete="off"/>)} SERO (1 ASNOW = {rate} SERO)<br/>
                            {Lang[that.props.lang].account.modal.invest.availableAsnow}: {<span style={{color:'#1DA57A'}}>{asnow?asnow:"0"}</span>}
                        </Form.Item>
                        <p>{Lang[that.props.lang].account.modal.invest.estimate}: <span style={{color:'#1DA57A'}}>{that.state.amount}</span> (SERO) x <span style={{color:'#1DA57A'}}>{that.state.estimateLevel} </span>(Times) = <strong style={{color:'rgb(216, 0, 38)'}}>{new BigNumber(that.state.amount).multipliedBy(that.state.estimateLevel).toFixed(6)} </strong>SERO</p>

                        <p>{Lang[that.props.lang].account.modal.invest.total} : <strong style={{color:'rgb(216, 0, 38)'}}>{this.state.total}</strong> SERO, <strong style={{color:'rgb(216, 0, 38)'}}>{this.state.ticketAsnow}</strong> ASNOW</p>
                        <Form.Item label={Lang[that.props.lang].account.modal.invest.password}>
                            {getFieldDecorator('Password', {
                                rules: [{ required: true, message: `Please input Password!` }],
                            })(<Input.Password allowClear placeholder={Lang[that.props.lang].account.modal.invest.passwordPlace} autoComplete="new-password"/>)}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    },
);

const BuyTicketForm = Form.create({ name: 'form_in_modal5' })(
    // eslint-disable-next-line
    class extends React.Component {

        state={
            asnow:0,
            confirmLoading:false,
        }

        render() {
            const { visible,asnow, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            let that = this;
            return (
                <Modal
                    visible={visible}
                    title={Lang[that.props.lang].account.modal.buyTicket.title}
                    onCancel={onCancel}
                    onOk={()=>{
                        this.setState({
                            confirmLoading:true
                        });
                        onCreate(function (res) {
                            that.setState({
                                confirmLoading:res
                            });
                        });
                    }}
                    confirmLoading={this.state.confirmLoading}
                >
                    <Form layout="vertical">
                        <Form.Item label={`${Lang[that.props.lang].account.modal.buyTicket.amount}(${Lang[that.props.lang].account.modal.buyTicket.availableAsnow}:${asnow})`}>
                            {getFieldDecorator('Amount', {
                                rules: [{ required: true, message: `Please Input Amount` }],
                            })(<InputNumber min={0} max={parseFloat(asnow)} step={100} precision={5} style={{width:'100%'}}  allowClear placeholder={Lang[that.props.lang].account.modal.buyTicket.amountPlace} autoComplete="off"/>)}
                        </Form.Item>
                        <Form.Item label={Lang[that.props.lang].account.modal.buyTicket.password}>
                            {getFieldDecorator('Password', {
                                rules: [{ required: true, message: `Please Input Password!` }],
                            })(<Input.Password allowClear placeholder={Lang[that.props.lang].account.modal.buyTicket.passwordPlace} autoComplete="new-password"/>)}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    },
);


const ShareProfitForm = Form.create({ name: 'form_in_modal0' })(
    // eslint-disable-next-line
    class extends React.Component {

        state={
            confirmLoading:false,
        }

        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            let that = this;
            return (
                <Modal
                    visible={visible}
                    title={Lang[that.props.lang].account.button.trigger}
                    onCancel={onCancel}
                    onOk={()=>{
                        this.setState({
                            confirmLoading:true
                        });
                        onCreate(function (res) {
                            that.setState({
                                confirmLoading:res
                            });
                        });
                    }}
                    confirmLoading={this.state.confirmLoading}
                >
                    <Form layout="vertical">
                        <Form.Item label={Lang[that.props.lang].account.modal.trigger.password}>
                            {getFieldDecorator('Password', {
                                rules: [{ required: true, message: `Please Input Password` }],
                            })(<Input.Password allowClear placeholder={Lang[that.props.lang].account.modal.trigger.passwordPlace} autoComplete="new-password"/>)}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    },
);


const WithdrawForm = Form.create({ name: 'form_in_modal4' })(
    // eslint-disable-next-line
    class extends React.Component {

        state={
            confirmLoading:false,
        }

        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            let that = this;
            return (
                <Modal
                    visible={visible}
                    title={Lang[that.props.lang].account.button.withdraw}
                    onCancel={onCancel}
                    onOk={()=>{
                        this.setState({
                            confirmLoading:true
                        });
                        onCreate(function (res) {
                            that.setState({
                                confirmLoading:res
                            });
                        });
                    }}
                    confirmLoading={this.state.confirmLoading}
                >
                    <Form layout="vertical">
                        <Form.Item label={Lang[that.props.lang].account.modal.withdraw.password}>
                            {getFieldDecorator('Password', {
                                rules: [{ required: true, message: `Please Input Password!` }],
                            })(<Input.Password allowClear placeholder={Lang[that.props.lang].account.modal.withdraw.passwordPlace} autoComplete="new-password"/>)}
                        </Form.Item>
                        {Lang[that.props.lang].account.modal.withdraw.tips}
                    </Form>
                </Modal>
            );
        }
    },
);

class ContentPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            showAccountSelect: false,
            showDeposit:false,
            showBuyAsnow:false,
            showBuyTicket:false,
            showInvest:false,
            showShareProfit:false,
            showWithdraw:false,

            modal1Visible:false,

            currentAccount: {},
            balanceSero:0,
            balanceAsnow:0,
            ct_balance_sero: 0,
            ct_balanceOfSero:0,

            ct_balance_asnow: 0,
            ct_rate: 0,
            ct_id: 0,
            ct_details: {},

            lang:"zh_CN",
        }
    }

    componentWillMount() {
        let lang = localStorage.getItem("lang");
        if (!lang) {
            lang="zh_CN";
            localStorage.setItem("lang","zh_CN");
        }
        this.setState({
            lang:lang,
        })
    }

    componentDidMount() {
        let that = this;
        setTimeout(function () {
            that.showSelectAccount();
        },300);
        if (!this.state.showAccountSelect) {
            setTimeout(function () {
                that.getDetail();
                // that.getAsnowBalances();
                that.getRate();
                that.getContractBalance();
                that.getContractSeroBalance();

            }, 310)
        }

        setInterval(function () {
            that.getDetail();
            // that.getAsnowBalances();
            that.getRate();
            that.getContractBalance();
            that.getContractSeroBalance();
            if(that.state.currentAccount.PK){
                that.getAccount(that.state.currentAccount.PK)
            }
        },30000)
    }

    showSelectAccount() {

        if (!this.state.currentAccount.PK) {
            let pk = localStorage.getItem("accountPk");
            if (pk) {
                this.getAccount(pk)
                this.setState({
                    loading:false
                })
            } else {
                this.setState({
                    showAccountSelect: true
                })
            }
        }
    }

    showDeposit(){

        this.setState({
            showDeposit:true
        })

        let canvas = document.getElementById('qrImg')
        QRCode.toCanvas(canvas, this.state.currentAccount.MainPKr, function (error) {
            if (error) console.error(error)
            console.log('success!');
        })
    }

    selectAccount = ac => {
        this.setState({
            currentAccount: ac,
            showAccountSelect: false,
            loading:false
        });
        localStorage.setItem("accountPk", ac.PK);
        // this.getAccount(ac.PK)
        // this.getDetail();
        // this.getRate();
        // this.getContractBalance();

        window.location.reload();

    }

    hiddenAccount = () => {
        this.setState({
            showAccountSelect: false,
        });
    }

    onChange = checked => {
        this.setState({loading: !checked});
    };

    getContractBalance(){
        let that = this;
        ajax.postSeroRpc("sero_getBalance",[contractAddress,"latest"],function (res) {
            let sero=new BigNumber(res.result.tkn.SERO?res.result.tkn.SERO:"0",16).dividedBy(decimal).toFixed(6);
            let asnow=new BigNumber(res.result.tkn.ASNOW?res.result.tkn.ASNOW:"0",16).dividedBy(decimal).toFixed(6);
            that.setState({
                ct_balance_sero:sero,
                ct_balance_asnow:asnow,
            })
        })
    }

    getContractSeroBalance(){
        let that = this;
        that.callMethod("balanceOfSero",[],function (res) {
            if(res.result){
                that.setState({
                    ct_balanceOfSero:new BigNumber(res.result,10).dividedBy(decimal).toFixed(6),
                })
            }
        })

    }



    //pullup
    getAccount(pk){
        let that= this;
        ajax.post("account/detail",{PK:pk},{},function (res) {
            if(res.base.code==='SUCCESS'){
                let currentAccount = res.biz;
                let strMap = new Map();
                let balanceSero = 0;
                let balanceAsnow = 0;
                let balanceObj = currentAccount.Balance;
                for (var currency of Object.keys(balanceObj)) {
                    strMap.set(currency, balanceObj[currency]);
                    if(currency === 'SERO'){
                        balanceSero = new BigNumber(balanceObj[currency]).dividedBy(decimal).toFixed(6);
                    }else if(currency === 'ASNOW'){
                        balanceAsnow = new BigNumber(balanceObj[currency]).dividedBy(decimal).toFixed(6);
                    }
                }
                let data = new identicon(pk, 200).toString();
                currentAccount["avatar"]= "data:image/png;base64,"+data;
                that.setState({
                    currentAccount: currentAccount,
                    balanceSero:balanceSero,
                    balanceAsnow:balanceAsnow
                });
            }
        })
    }


    //=== contract

    getDetail() {
        let that = this;
        that.callMethod("details", [], function (res) {
            if(res.result){
                let data = res.result;
                let detail = {
                    referId: data[0]==='JFVVW2ITNSJHF'?"":data[0],
                    largeAreaId: data[1]==='JFVVW2ITNSJHF'?"":data[1],
                    largeAreaTotal:new BigNumber(data[2]).dividedBy(decimal).toFixed(6),
                    amount: new BigNumber(data[3]).dividedBy(decimal).toFixed(6),
                    returnAmount: new BigNumber(data[4]).dividedBy(decimal).toFixed(6),
                    achievement: new BigNumber(data[5]).dividedBy(decimal).toFixed(6),
                    recommendNum: data[6],
                    profitLevel: data[7],
                    value: new BigNumber(data[8]).dividedBy(decimal).toFixed(6),
                    star:data[9],
                    isKing: data[10],
                }
                that.callMethod("balanceOfAsnow", [], function (res) {
                    if(res.result){
                        detail["asnowBalances"]=new BigNumber(res.result[0]).dividedBy(decimal).toFixed(6);
                    }
                    that.callMethod("id", [], function (res) {
                        if(res.result){
                            detail["id"]=res.result[0]==="JFVVW2ITNSJHF"?"":res.result[0];
                        }
                        that.callMethod("detailsOfIncome", [], function (res) {
                            if(res.result){
                                detail["detailsOfIncome"]=res.result;
                            }
                            that.callMethod("calcuStaticProfit", [], function (res) {
                                if(res.result){
                                    detail["dayProfit"]=new BigNumber(res.result[0]).dividedBy(decimal).toFixed(6);
                                }
                                that.setState({
                                    ct_details: detail
                                })
                            });
                        });
                    });

                });
            }
        });
    }

    getRate() {
        let that = this;
        that.callMethod("conversionRate", [], function (res) {
            let asnow= new BigNumber(res.result[0]);
            let sero = new BigNumber(res.result[1])
            let point = asnow.dividedBy(sero).toFixed(2);
            that.setState({
                ct_rate:point
            })
        });
    }

    // getAsnowBalances() {
    //     let that = this;
    //     that.callMethod("asnowBalances", [that.state.currentAccount.MainPKr], function (res) {
    //         that.setState({
    //             ct_my_asnow: new BigNumber(res.result, 16).toFixed(6)
    //         })
    //     });
    // }

    callMethod(_method, args, callback) {
        let that = this;
        let param = [ABI, contractAddress, _method, args]
        ajax.postSeroRpc("sero_packMethod", param, function (res) {
            if(res.result){
                let callParams = {
                    from: that.state.currentAccount.MainPKr,
                    to: contractAddress,
                    data: res.result
                }
                ajax.postSeroRpc("sero_call", [callParams, "latest"], function (res) {
                    if (res) {
                        that.unPackData(contractAddress, _method, res.result, function (res) {
                            if (callback) {
                                callback(res);
                            }
                        })
                    }
                });
            }else{
                callback(res);
            }
        })
    }

    executeMethod(_method, args,value,cy,password, callback) {
        let that = this;
        let param = [ABI, contractAddress, _method, args]
        ajax.postSeroRpc("sero_packMethod", param, function (res) {
            if (res.result) {
                let data = res.result;
                let executeData = {
                    contract_tx_req: {
                        from: that.state.currentAccount.PK,
                        to: contractAddress,
                        cy:cy,
                        value: value,
                        data: data,
                        gas_price: "1000000000",
                    },
                    password: password,
                };
                let estimateParam = {
                    from: that.state.currentAccount.MainPKr,
                    to: contractAddress,
                    data: data,
                    cy:cy,
                    value: "0x"+new BigNumber(value).toString(16),
                }
                ajax.postSeroRpc("sero_estimateGas", [estimateParam], function (res) {
                    if (res.result) {
                        executeData.contract_tx_req["gas"] = new BigNumber(res.result, 16).plus(10000).toString(10);
                        ajax.postPullupRpc("execute_contract", executeData, function (res) {
                            if (callback){
                                callback(res)
                            }
                        })
                    }else{
                        if (callback){
                            callback(res)
                        }
                    }
                });
            } else {
                if (callback){
                    callback(res)
                }
            }
        })
    }

    unPackData(contractAddress, methodName, data, callback) {
        let param = [
            ABI,
            methodName,
            data
        ]
        ajax.postSeroRpc("sero_unPack", param, function (res) {
            if (res) {
                callback(res)
            }
        });
    }

    handleCancel =()=>{
        this.setState({
            showDeposit:false
        })
    }

    //====  buyAsnow begin
    handleBuyAsnowCancel = () => {
        this.setState({ showBuyAsnow: false });
    };

    handleBuyAsnowCreate = (cb) => {
        let that = this;
        const { form } = this.formRef.props;
        console.log(form)
        form.validateFields((err, values) => {
            if (err) {
                console.log(err);
                if(cb){
                    cb(false)
                }
                return;
            }
            let amount=form.getFieldValue("Amount");
            let password=form.getFieldValue("Password");
            this.executeMethod("buyAsnow",[],new BigNumber(amount).multipliedBy(decimal).toString(10),"SERO",password,function (res) {
                if (res.result){
                    form.resetFields();
                    that.setState({ showBuyAsnow: false });
                    setTimeout(function () {
                        openNotificationWithIcon('success','Successful',`${Lang[that.state.lang].toast.tx}${res.result}`)
                    },3000)
                }else {
                    if (res.error){
                        message.error(res.error.message);
                    }else{
                        message.error("request SERO Node error:["+res+"]");
                    }
                }
                if(cb){cb(false)}
            });
        });
    };

    saveBuyAsnowFormRef = formRef => {
        this.formRef = formRef;
    };
    //====  buyAsnow end

    //====  Invest begin
    handleInvestCancel = () => {
        this.setState({ showInvest: false });
    };

    handleInvestCreate = (cb) => {
        let that = this;
        const { form } = this.formRef2.props;
        form.validateFields((err, values) => {
            if (err) {
                if(cb){
                    cb(false)
                }
                return;
            }
            let amountSero=form.getFieldValue("AmountSero");
            // let ticketSero=form.getFieldValue("TicketSero");
            let referId=form.getFieldValue("ReferId");
            let password=form.getFieldValue("Password");

            let ticketAsnow = new BigNumber(amountSero).dividedBy(10).dividedBy(that.state.ct_rate).toFixed(6);

            if (that.state.ct_details.referId){
                referId = that.state.ct_details.referId;
            }
            if (new BigNumber(amountSero).comparedTo(new BigNumber(this.state.balanceSero))>0){
                if(cb){
                    cb(false)
                }
                message.warn(Lang[that.state.lang].toast.lessAmount);
            } else if (new BigNumber(ticketAsnow).comparedTo(new BigNumber(this.state.ct_details.asnowBalances))>0){
                if(cb){
                    cb(false)
                }
                message.warn(Lang[that.state.lang].toast.lessTicket);
            } else if (parseFloat(amountSero)<100){
                if(cb){
                    cb(false)
                }
                message.warn(Lang[that.state.lang].toast.minInvest);
            }else{
                this.executeMethod("invest",[referId],new BigNumber(amountSero).multipliedBy(decimal).toString(10),"SERO",password,function (res) {
                    if (res.result){
                        form.resetFields();
                        that.setState({ showInvest: false });
                        setTimeout(function () {
                            openNotificationWithIcon('success','Successful',`${Lang[that.state.lang].toast.tx}${res.result}`)
                        },3000)
                    }else {
                        if (res.error){
                            message.error(res.error.message);
                        }else{
                            message.error("request SERO Node error:["+res+"]");
                        }
                    }
                    if(cb){cb(false)}
                });
            }
        });
    };

    calcuPrincipalProfit = (sero,cb) =>{
        if(sero){
            let seroHex = "0x"+new BigNumber(sero).multipliedBy(decimal).toString(16);
            this.callMethod("calcuPrincipalProfit",[seroHex],function (res) {
                if(cb){
                    cb(res);
                }
            })
        }
    }

    saveInvestFormRef = formRef => {
        this.formRef2 = formRef;
    };
    //====  Invest end

    //==== shareProfit begin

    handleShareProfitCancel = () => {
        this.setState({ showShareProfit: false });
    };

    handleShareProfitCreate = (cb) => {
        let that = this;
        const { form } = this.formRef3.props;
        form.validateFields((err, values) => {
            if (err) {
                if(cb){
                    cb(false)
                }
                return;
            }
            let password=form.getFieldValue("Password");

            this.executeMethod("triggerStaticProfit",[],"0","SERO",password,function (res) {
                if (res.result){
                    form.resetFields();
                    that.setState({ showInvest: false });
                    setTimeout(function () {
                        openNotificationWithIcon('success','Successful',`The transaction was submitted successfully, waiting for the block to be packaged, and the transaction hash: ${res.result}.`)
                    },3000)
                }else {
                    if (res.error){
                        message.error(res.error.message);
                    }else{
                        message.error("request SERO Node error:["+res+"]");
                    }
                }
                if(cb){cb(false)}
            });
        });
    };

    saveShareProfitFormRef = formRef => {
        this.formRef3 = formRef;
    };

    //==== shareProfit end

    //==== shareProfit begin

    handleShareProfitCancel = () => {
        this.setState({ showShareProfit: false });
    };

    handleShareProfitCreate = (cb) => {
        let that = this;
        const { form } = this.formRef3.props;
        form.validateFields((err, values) => {
            if (err) {
                if(cb){
                    cb(false)
                }
                return;
            }
            let password=form.getFieldValue("Password");

            this.executeMethod("triggerStaticProfit",[],"0","SERO",password,function (res) {
                if (res.result){
                    form.resetFields();
                    that.setState({ showShareProfit: false });
                    setTimeout(function () {
                        openNotificationWithIcon('success','Successful',`${Lang[that.state.lang].toast.tx}${res.result}`)
                    },3000)
                }else {
                    if (res.error){
                        message.error(res.error.message);
                    }else{
                        message.error("request SERO Node error:["+res+"]");
                    }
                }
                if(cb){cb(false)}
            });
        });
    };

    saveShareProfitFormRef = formRef => {
        this.formRef3 = formRef;
    };

    //==== shareProfit end


    //==== Withdraw begin

    handleWithdrawCancel = () => {
        this.setState({ showWithdraw: false });
    };

    handleWithdrawCreate = (cb) => {
        let that = this;
        const { form } = this.formRef4.props;
        form.validateFields((err, values) => {
            if (err) {
                if(cb){
                    cb(false)
                }
                return;
            }
            let password=form.getFieldValue("Password");

            this.executeMethod("withdrawBalance",[],"0","SERO",password,function (res) {
                if (res.result){
                    form.resetFields();
                    that.setState({ showWithdraw: false });
                    setTimeout(function () {
                        openNotificationWithIcon('success','Successful',`${Lang[that.state.lang].toast.tx}${res.result}`)
                    },3000)
                }else {
                    if (res.error){
                        message.error(res.error.message);
                    }else{
                        message.error("request SERO Node error:["+res+"]");
                    }
                }
                if(cb){cb(false)}
            });
        });
    };

    saveWithdrawFormRef = formRef => {
        this.formRef4 = formRef;
    };

    //==== Withdraw end


    //==== Buy Ticket begin

    handleBuyTicketCancel = () => {
        this.setState({ showBuyTicket: false });
    };

    handleBuyTicketCreate = (cb) => {
        let that = this;
        const { form } = this.formRef5.props;
        form.validateFields((err, values) => {
            if (err) {
                if(cb){
                    cb(false)
                }
                return;
            }

            let password=form.getFieldValue("Password");
            let amount=form.getFieldValue("Amount");
            if(new BigNumber(amount).comparedTo(new BigNumber(that.state.balanceAsnow))>0){
                if(cb){
                    cb(false)
                }
                message.warn(Lang[that.state.lang].toast.lessAsnow);
            }else{
                this.executeMethod("paymentAsnow",[],new BigNumber(amount).multipliedBy(decimal).toString(10),"ASNOW",password,function (res) {
                    if (res.result){
                        form.resetFields();
                        that.setState({ showBuyTicket: false });
                        setTimeout(function () {
                            openNotificationWithIcon('success','Successful',`${Lang[that.state.lang].toast.tx}${res.result}`)
                        },3000)
                    }else {
                        if (res.error){
                            message.error(res.error.message);
                        }else{
                            message.error("request SERO Node error:["+res+"]");
                        }
                    }
                    if(cb){cb(false)}
                });
            }
        });
    };

    saveBuyTicketFormRef = formRef => {
        this.formRef5 = formRef;
    };



    //==== Buy Ticket end

    render() {
        const {loading, showAccountSelect, currentAccount} = this.state;
        let accountName = currentAccount.PK;
        let that  = this;
        let staticReward = that.state.ct_details.detailsOfIncome?new BigNumber(that.state.ct_details.detailsOfIncome[0]).dividedBy(decimal).toFixed(2):0;
        let recommendReward = that.state.ct_details.detailsOfIncome?new BigNumber(that.state.ct_details.detailsOfIncome[1]).dividedBy(decimal).toFixed(2):0;
        let nobilityReward = that.state.ct_details.detailsOfIncome?new BigNumber(that.state.ct_details.detailsOfIncome[2]).dividedBy(decimal).toFixed(2):0;
        let vipReward = that.state.ct_details.detailsOfIncome?new BigNumber(that.state.ct_details.detailsOfIncome[3]).dividedBy(decimal).toFixed(2):0;
        // let currentIncome = that.state.ct_details.detailsOfIncome?new BigNumber(that.state.ct_details.detailsOfIncome[4]).dividedBy(decimal).toFixed(2):0;
        let staticTimestamp = that.state.ct_details.detailsOfIncome?that.state.ct_details.detailsOfIncome[5]:0;

        const salesPieData = [
            {
                x: Lang[this.state.lang].account.title.staticReward,
                y: parseFloat(staticReward),
            },
            {
                x: Lang[this.state.lang].account.title.recommendReward,
                y: parseFloat(recommendReward),
            },
            {
                x: Lang[this.state.lang].account.title.nobilityReward,
                y: parseFloat(nobilityReward),
            },
            {
                x: Lang[this.state.lang].account.title.vipReward,
                y: parseFloat(vipReward),
            },

        ];

        const showChart = parseFloat(staticReward)>0 || parseFloat(recommendReward)>0 ||  parseFloat(nobilityReward)>0 || parseFloat(vipReward)>0

        const countDown = nextShareTime();
        let totalReturnDay = this.state.ct_balanceOfSero?new BigNumber(this.state.ct_balanceOfSero).dividedBy(30).toFixed(6):"0";
        let returnPercent = 0;
        if (this.state.ct_details.returnAmount && parseFloat(this.state.ct_details.returnAmount)>0){
            let a = parseFloat(this.state.ct_details.returnAmount);
            let b = new BigNumber(this.state.ct_details.amount).multipliedBy(this.state.ct_details.profitLevel).toString(10);
            returnPercent = (a*100/parseFloat(b)).toFixed(2);
        }

        let showCountDown = new Date(staticTimestamp*1000).getDate() === parseInt(new Date().getDate());
        return (
            <div className="App" style={{marginTop:'80px'}}>
                    <Content style={{padding: '0 50px'}}>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <a href="http://129.211.98.114:3006/web/v0_1_6/index.html">Home</a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <a href="http://129.211.98.114:3006/web/v0_1_6/dapps.html">DApps</a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>ASNOW</Breadcrumb.Item>
                        </Breadcrumb>
                        <p/>
                        <div style={{background: '#fff', padding: 24, minHeight: document.body.clientHeight}}>

                            <List itemLayout="vertical" size="large" rowKey="1">
                                <List.Item>
                                    <Skeleton loading={loading} avatar>
                                        <Descriptions title={
                                            <h1>{Lang[this.state.lang].account.title.utxo} <Button size="small" onClick={()=>{
                                                this.setState({
                                                    showAccountSelect:true
                                                })
                                            }}>{Lang[this.state.lang].account.title.swith}</Button></h1>}/>
                                        <Row>
                                            <Col span={12}>
                                                <List.Item.Meta
                                                    avatar={<p><Avatar shape="square" size={64} src={currentAccount.avatar}/></p>}
                                                    title={
                                                        <a href={`http://129.211.98.114:3006/web/v0_1_6/account-detail.html?pk=${currentAccount.PK}`}><small>{accountName ? accountName.substring(0, 30) + "..." : ""}{this.state.ct_details.isKing?<Tag color="gold">VIP</Tag>:""}</small></a>}
                                                    description={<Rate count={4} value={this.state.ct_details.star?this.state.ct_details.star:0} disabled/>}
                                                />
                                            </Col>
                                            <Col span={6}>
                                                <Statistic title={Lang[this.state.lang].account.title.balanceSero} value={this.state.balanceSero} precision={6}/>
                                                <Button style={{marginTop: 16}} type="primary" onClick={()=>{this.showDeposit()}}>{Lang[this.state.lang].account.button.deposit}</Button>
                                            </Col>
                                            <Col span={6}>
                                                <Statistic title={Lang[this.state.lang].account.title.balanceAsnow} value={this.state.balanceAsnow} precision={6}/>
                                                <Button style={{marginTop: 16}} type="primary" onClick={()=>{this.setState({showBuyAsnow:true})}}>{Lang[this.state.lang].account.button.buy}</Button>
                                            </Col>
                                        </Row>

                                    </Skeleton>
                                </List.Item>

                                <List.Item>
                                    <Skeleton loading={loading}>
                                        <Descriptions title={<h1>{Lang[this.state.lang].account.title.contract}</h1>}/>
                                        {
                                            showChart?
                                            <Row >
                                                <Col span={12} style={{ textAlign: 'center' }}>
                                                    <div>
                                                        {returnPercent>0?<WaterWave height={234} title={Lang[this.state.lang].account.title.totalReturn} percent={returnPercent} />:<WaterWave height={234} title={Lang[this.state.lang].account.title.totalReturn} percent={0} />}
                                                    </div>
                                                </Col>
                                                <Col span={12} style={{ textAlign: 'left' }}>
                                                    <Pie
                                                        hasLegend
                                                        animate
                                                        title={Lang[this.state.lang].account.title.totalReturn}
                                                        subTitle={Lang[this.state.lang].account.title.totalReturn}
                                                        total={() => (
                                                            <span
                                                                dangerouslySetInnerHTML={{
                                                                    __html: salesPieData.reduce((pre, now) => now.y + pre, 0),
                                                                }}
                                                            />
                                                        )}
                                                        data={salesPieData}
                                                        valueFormat={val => <span dangerouslySetInnerHTML={{ __html: val }} />}
                                                        height={248}
                                                    />
                                                </Col>
                                            </Row>:""
                                        }

                                        <Row style={{ textAlign: 'center' }}>
                                            <Col span={6}>
                                                <Statistic title={Lang[this.state.lang].account.title.estimatedTotal} value={new BigNumber(this.state.ct_details.amount?this.state.ct_details.amount:0).multipliedBy(this.state.ct_details.profitLevel?this.state.ct_details.profitLevel:0).toFixed(6)} precision={6}/>
                                                <Button style={{marginTop: 16}} type="primary" onClick={()=>{this.setState({showInvest:true})}}>{Lang[this.state.lang].account.button.invest}</Button>
                                            </Col>
                                            <Col span={6}>
                                                <Statistic title={Lang[this.state.lang].account.title.ticket} value={new BigNumber(this.state.ct_details.asnowBalances?this.state.ct_details.asnowBalances:0).toFixed(6)} precision={6}/>
                                                <Button style={{marginTop: 16}} type="primary" onClick={()=>{this.setState({showBuyTicket:true})}}>{Lang[this.state.lang].account.button.buyTicket}</Button>
                                            </Col>
                                            <Col span={6}>
                                                <Statistic title={Lang[this.state.lang].account.title.staticIncome} value={this.state.ct_details.dayProfit} precision={6}/>
                                                {
                                                    showCountDown?<Countdown style={{marginTop: 14}} title="" format="HH:mm:ss" value={parseFloat(countDown)} onFinish={()=>{this.getDetail()}} />:<Button style={{marginTop: 16}} type="primary" disabled={showCountDown} onClick={()=>{this.setState({showShareProfit:true})}}>{Lang[this.state.lang].account.button.trigger}</Button>
                                                }
                                            </Col>
                                            <Col span={6}>
                                                <Statistic title={Lang[this.state.lang].account.title.withdraw} value={new BigNumber(this.state.ct_details.value?this.state.ct_details.value:0).toFixed(6)} precision={6}/>
                                                <Button style={{marginTop: 16}} type="primary" onClick={()=>{this.setState({showWithdraw:true})}}>{Lang[this.state.lang].account.button.withdraw}</Button>
                                            </Col>
                                        </Row>
                                        <Divider dashed={true}/>
                                        <Row style={{ textAlign: 'center' }}>
                                            <Col span={6}>
                                                <Statistic title={Lang[this.state.lang].account.title.totalReturnDay} value={totalReturnDay} precision={6}/>
                                            </Col>
                                            <Col span={6}>
                                                <Statistic title={Lang[this.state.lang].account.title.dayIncome} value={this.state.ct_details.dayProfit?new BigNumber(this.state.ct_details.dayProfit).multipliedBy(100).dividedBy(totalReturnDay).toFixed(2):"0"} suffix={"%"}/>
                                            </Col>
                                            <Col span={6}>
                                                <Statistic title={Lang[this.state.lang].account.title.areaTotal} value={this.state.ct_details.largeAreaTotal} precision={6}/>
                                            </Col>
                                            <Col span={6}>
                                                <Statistic title={Lang[this.state.lang].account.title.areaOtherTotal} value={new BigNumber(this.state.ct_details.achievement).minus(new BigNumber(this.state.ct_details.largeAreaTotal)).toFixed(6)} precision={6}/>
                                            </Col>
                                        </Row>
                                    </Skeleton>
                                </List.Item>

                                <List.Item>
                                    <Skeleton loading={loading}>
                                        <Descriptions title={<h1>{Lang[this.state.lang].project.title}</h1>}>
                                            <Descriptions.Item label={Lang[this.state.lang].project.contractAddress}>
                                                <small>{contractAddress}</small>
                                            </Descriptions.Item>
                                        </Descriptions>

                                        <Row>
                                            <Col span={8}>
                                                <Statistic title={Lang[this.state.lang].project.rate} value={this.state.ct_rate} precision={2} valueStyle={{color: '#3f8600'}}/>
                                            </Col>
                                        </Row>
                                        <Divider dashed={true}/>
                                        <Descriptions title={Lang[this.state.lang].account.title.investDetail}>
                                            <Descriptions.Item label={Lang[this.state.lang].account.title.id}>{this.state.ct_details.id}</Descriptions.Item>
                                            <Descriptions.Item label={Lang[this.state.lang].account.title.referId}>{this.state.ct_details.referId}</Descriptions.Item>
                                            <Descriptions.Item label={Lang[this.state.lang].account.title.areaId}>{this.state.ct_details.largeAreaId}</Descriptions.Item>
                                            <Descriptions.Item label={Lang[this.state.lang].account.title.totalInvest}>{this.state.ct_details.amount}</Descriptions.Item>
                                            <Descriptions.Item label={Lang[this.state.lang].account.title.profitLevel}>{this.state.ct_details.profitLevel}</Descriptions.Item>
                                            <Descriptions.Item label={Lang[this.state.lang].account.title.latestTime}>{convertUTCDate(staticTimestamp)}</Descriptions.Item>
                                        </Descriptions>
                                    </Skeleton>
                                </List.Item>

                            </List>
                        </div>
                    </Content>

                <SelectAccount visible={showAccountSelect} selectAccount={this.selectAccount} hiddenAccount={this.hiddenAccount}/>

                <Modal
                    title={Lang[this.state.lang].account.modal.deposit.title}
                    visible={this.state.showDeposit}
                    onCancel={this.handleCancel}
                    footer={null}
                    getContainer={false}
                >
                    <div style={{textAlign:"center"}}>
                        <canvas id="qrImg"></canvas>
                        <p style={{wordBreak:'normal',whiteSpace:'pre-wrap',wordWrap:'break-word'}}><small>{this.state.currentAccount.MainPKr}</small></p>
                        <Button className='copyTxt' onClick={()=>{copy(this.state.currentAccount.MainPKr);message.success('Copy to clipboard successfully');}}>{Lang[this.state.lang].account.modal.deposit.copy}</Button>
                    </div>
                </Modal>

                <BuyAsnowForm
                    wrappedComponentRef={this.saveBuyAsnowFormRef}
                    visible={this.state.showBuyAsnow}
                    onCancel={this.handleBuyAsnowCancel}
                    onCreate={this.handleBuyAsnowCreate}
                    rate={this.state.ct_rate}
                    lang={this.state.lang}
                />

                <InvestForm
                    wrappedComponentRef={this.saveInvestFormRef}
                    visible={this.state.showInvest}
                    onCancel={this.handleInvestCancel}
                    onCreate={this.handleInvestCreate}
                    sero={this.state.balanceSero}
                    asnow={this.state.ct_details.asnowBalances}
                    calcuPrincipalProfit={this.calcuPrincipalProfit}
                    rate={this.state.ct_rate}
                    lang={this.state.lang}
                    times={this.state.ct_details.profitLevel}
                    referId={this.state.ct_details.referId}
                />

                <BuyTicketForm
                    wrappedComponentRef={this.saveBuyTicketFormRef}
                    visible={this.state.showBuyTicket}
                    onCancel={this.handleBuyTicketCancel}
                    onCreate={this.handleBuyTicketCreate}
                    asnow={this.state.balanceAsnow}
                    lang={this.state.lang}
                />

                <ShareProfitForm
                    wrappedComponentRef={this.saveShareProfitFormRef}
                    visible={this.state.showShareProfit}
                    onCancel={this.handleShareProfitCancel}
                    onCreate={this.handleShareProfitCreate}
                    profit={this.state.ct_details.dayProfit}
                    lang={this.state.lang}
                />

                <WithdrawForm
                    wrappedComponentRef={this.saveWithdrawFormRef}
                    visible={this.state.showWithdraw}
                    onCancel={this.handleWithdrawCancel}
                    onCreate={this.handleWithdrawCreate}
                    amount={this.state.ct_details.value}
                    lang={this.state.lang}
                />

                {/*<Modal*/}
                {/*    title="Smart Contract"*/}
                {/*    okText={Lang[this.state.lang].account.button.copy}*/}
                {/*    cancelText={Lang[this.state.lang].account.button.close}*/}
                {/*    style={{ top: 20 }}*/}
                {/*    visible={this.state.modal1Visible}*/}
                {/*    onOk={() => {copy(contract.code);message.success(Lang[this.state.lang].toast.copySuccess);}}*/}
                {/*    onCancel={() => this.setState({modal1Visible:false})}*/}
                {/*>*/}
                {/*    <TextArea*/}
                {/*        value={contract.code}*/}
                {/*        autosize={{ maxRows: 20 }}*/}
                {/*        readOnly={true}*/}
                {/*    />*/}

                {/*</Modal>*/}
            </div>
        );
    }
}


class App extends Component{
    constructor() {
        super();
        this.state = {
            locale: zhCN,
        };
    }

    componentWillMount() {
        let lang = localStorage.getItem("lang");
        let locale = zhCN;
        if (lang){
            if (lang === "zh_CN"){
                locale = zhCN;
            }else if (lang === "en_US"){
                locale = enUS;
            }
        }else{
            locale = zhCN;
            localStorage.setItem("lang","zh_CN");
        }

        this.setState({
            locale:locale
        })
    }

    changeLocale = e => {
        const localeValue = e.target.value;
        this.setState({ locale: localeValue });
        console.log(localeValue.locale);
        if(localeValue.locale === "en"){
            localStorage.setItem("lang","en_US");
        }else if(localeValue.locale === "zh-cn"){
            localStorage.setItem("lang","zh_CN");
        }
    };

    render() {
        const { locale } = this.state;
        return (
            <div className="App">
                <Layout className="layout">
                    <Header className="header">
                        <div className="logo"><img src={logo}/></div>
                        <h1>ASNOW</h1>
                        <div className="change-locale">
                            <Radio.Group value={locale} onChange={this.changeLocale}>
                                <Radio.Button key="en" value={enUS}>
                                    English
                                </Radio.Button>
                                <Radio.Button key="cn" value={zhCN}>
                                    中文
                                </Radio.Button>
                            </Radio.Group>
                        </div>
                    </Header>
                    <ConfigProvider locale={locale}>
                        <ContentPage key={locale ? locale.locale : 'en'} />
                    </ConfigProvider>
                    <Footer style={{textAlign: 'center'}}/>
                </Layout>
            </div>
        );
    }
}

function convertUTCDate(dateTimestamp){
    if(dateTimestamp && dateTimestamp>0){
        let cDate = new Date(dateTimestamp*1000);
        return appendZero(cDate.getMonth() + 1) + "/" + appendZero(cDate.getDate()) + " " + appendZero(cDate.getHours()) + ":" + appendZero(cDate.getMinutes());
    }
    return ""
}

function nextShareTime(){
    let d = new Date();
    d.setTime(d.getTime()+24*60*60*1000);
    let year=d.getFullYear();
    let month=d.getMonth();
    let day=d.getDate();
    d=new Date(year,month,day,0,0,0);

    return d.getTime();
    return ""
}

function appendZero(i) {
    i =  i < 10 ? "0"+i : i;
    return i;
}

export default App;

