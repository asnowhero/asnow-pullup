class Lang {

    zh_CN={
        project:{
            title:"合约详情",
            totalSupply:"发行量 (ASNOW)",
            contractAddress:"合约地址",
            balanceSero:"当前余额 (SERO)",
            balanceAsnow:"当前余额 (ASNOW)",
            rate:"兑换比例 (SERO / ASNOW)",
        },

        account:{
            title:{
                utxo:"钱包账户",
                contract:"合约账户",
                swith:"切换账户",
                balanceSero:"余额 (SERO)",
                balanceAsnow:"余额 (ASNOW)",
                estimatedTotal:"预计总收益 (SERO)",
                dayIncome:"当天返还比例",
                staticIncome:"当天静态返还 (SERO)",
                withdraw:"可提现金额 (SERO)",
                detail:"详情",
                id:"编号",
                referId:"推荐人编号",
                areaId:"大区编号",
                totalInvest:"本金",
                profitLevel:"收益倍数",
                latestTime:"最新收益时间",
                totalReturn:"当前返还总数(SERO)",
                totalReturnDay:"当天返还总数(SERO)",
                recommend:"下级人数",
                ticket:"当前可用(ASNOW)",
                staticIncomeTips:"今天的静态收益已经支付到可提现账户.",
                staticIncomeTips2:"触发收益到提现账户.",
                investDetail:"投资详情",
                myIncome:"我的业绩",
                areaTotal:"大区业绩",
                areaOtherTotal:"业绩总和(不含大区)",

                staticReward:"静态返还",
                recommendReward:"推荐奖",
                nobilityReward:"星级奖",
                vipReward:"VIP奖",
                viewCode:"查看智能合约",

            },
            button:{
                deposit:"充值",
                buy:"兑换ASNOW",
                invest:"投资",
                buyTicket:"充值ASNOW",
                trigger:"触发收益",
                withdraw:"提现",
                close:"关闭",
                copy:"拷贝",
            },
            modal:{
                deposit:{
                    title:"充值",
                    copy:"拷贝",
                },

                buyAsnow:{
                    title:"兑换ASNOW",
                    amount:"数量 (SERO)",
                    amountPlace:"输入数量",
                    rate:"兑换比例",
                    exchange:"兑换",
                    password:"账户密码",
                    passwordPlace:"输入账户密码",
                },

                invest:{
                    title:"投资",
                    referId:"推荐人编号",
                    amount:"投资金额",
                    amountTips:"100 SERO起投",
                    ticket:"门票",
                    availableSERO:"可用的余额",
                    availableAsnow:"可用的ASNOW",
                    availableExchange:"最多可抵用",
                    total:"应付合计",
                    estimate:"预计收益",
                    password:"账户密码",
                    passwordPlace:"输入账户密码",
                },

                buyTicket:{
                    title:"充值ASNOW",
                    amount:"数量 (ASNOW)",
                    amountPlace:"输入数量",
                    password:"账户密码",
                    passwordPlace:"输入账户密码",
                    availableAsnow:"可用的ASNOW",
                    availableExchange:"可兑换",
                },
                trigger:{
                    password:"账户密码",
                    passwordPlace:"输入账户密码",
                },

                withdraw:{
                    password:"账户密码",
                    passwordPlace:"输入账户密码",
                    tips:"* 提现金额将直接提到UTXO账户.",
                },
            },
        },
        toast:{
            lessAmount:"SERO余额不足以支付本次交易.",
            lessTicket:"当前可用的ASNOW不足，请先充值ASNOW",
            lessAsnow:"钱包账户中可用的ASNOW不足，请先兑换ASNOW",
            minInvest:"最小投资金额为100SERO.",
            tx:"交易提交成功, 等待区块打包交易, 交易哈希: ",
            copySuccess:"拷贝成功! ",

        }
    };

    en_US={
        project:{
            title:"Contract Info",
            totalSupply:"Total Supply (ASNOW)",
            contractAddress:"Contract Address",
            balanceSero:"Current Balance (SERO)",
            balanceAsnow:"Current Balance (ASNOW)",
            rate:"Exchange Rate (SERO / ASNOW)",
        },

        account:{
            title:{
                utxo:"Wallet Account",
                contract:"Contract Account",
                swith:"Switch Account",
                balanceSero:"Balance (SERO)",
                balanceAsnow:"Balance (ASNOW)",
                estimatedTotal:"Estimated Total Income (SERO)",
                dayIncome:"Return rate on the day",
                staticIncome:"Static Return (SERO)",
                withdraw:"Withdrawal Account (SERO)",
                detail:"Detail",
                id:"ID",
                referId:"Refer ID",
                areaId:"Large Area ID",
                totalInvest:"Total Invest",
                profitLevel:"Profit Level",
                latestTime:"Latest Share Time",
                totalReturn:"Total Return",
                totalReturnDay:"Total return on the day (SERO)",
                recommend:"Recommend Number",
                ticket:"Available (ASNOW)",
                staticIncomeTips:"Your income have been paid to the withdrawal account.",
                staticIncomeTips2:"Trigger to withdrawal account. ",
                investDetail:"Invest Info",
                myIncome:"My performance",
                areaTotal:"Regional performance",
                areaOtherTotal:"Total performance (excluding the large region)",

                staticReward:"Static",
                recommendReward:"Recommend",
                nobilityReward:"Nobility",
                vipReward:"VIP",
                viewCode:"View Smart Contract",
            },
            button:{
                deposit:"Deposit SERO",
                buy:"Exchange ASNOW",
                invest:"Invest",
                buyTicket:"Deposit ASNOW",
                trigger:"Trigger Income",
                withdraw:"Withdraw",
                close:"Close",
                copy:"Copy",
            },
            modal:{
                deposit:{
                    title:"Deposit",
                    copy:"COPY",
                },

                buyAsnow:{
                    title:"Exchange ASNOW",
                    amount:"Amount (SERO)",
                    amountPlace:"Input Amount",
                    rate:"Exchange Rate",
                    exchange:"Exchange",
                    password:"Password",
                    passwordPlace:"Input Password",
                },
                buyTicket:{
                    title:"Deposit ASNOW",
                    amount:"Amount (ASNOW)",
                    amountPlace:"Input Number",
                    password:"Password",
                    passwordPlace:"Input Your Password",
                    availableAsnow:"Available ASNOW",
                    availableExchange:"Exchange",
                },
                invest:{
                    title:"Invest",
                    referId:"Refer ID",
                    ticket:"Tickets",
                    amount:"Invet Amount",
                    amountTips:"At least invest 100 SERO",
                    availableSERO:"Available Blance",
                    availableAsnow:"Available ASNOW",
                    availableExchange:"Max Exchange",
                    total:"Total",
                    estimate:"Estimated Return",
                    password:"Password",
                },

                trigger:{
                    password:"Password",
                },

                withdraw:{
                    password:"Password",
                    tips:"* This is the withdrawal of the amount to the UTXO account.",
                },
            },
        },
        toast:{
            lessAmount:"The balance is not enough to pay for this transaction.",
            lessTicket:"There are not enough tickets, please depost the asnow first.",
            minInvest:"Invest Amount at least 100 SERO.",
            lessAsnow:"Insufficient ASNOW available in the wallet account, please exchange ASNOW first",
            tx:"The transaction was submitted successfully, waiting for the block to be packaged, and the transaction hash: ",
            copySuccess:"Copy to clipboard successfully! ",
        },
    }
}

export default Lang