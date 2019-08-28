pragma solidity ^0.4.24;

library SafeMath {

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b);

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0);
        uint256 c = a / b;

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;

        return c;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);

        return c;
    }
}

library Utils {
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a < b) {
            return a;
        }
        return b;
    }


    function sameDay(uint day1, uint day2) internal pure returns (bool){
        //        return day1 / 24 / 3600 == day2 / 24 / 3600;
        //        return day1 / 3600 == day2 / 3600;
        return day1 / 600 == day2 / 600;
    }

    function bytes32Eq(bytes32 a, bytes32 b) internal pure returns (bool) {
        for (uint i = 0; i < 32; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }

    function bytes32ToString(bytes32 x) internal pure returns (string) {
        uint charCount = 0;
        bytes memory bytesString = new bytes(32);
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            } else if (charCount != 0) {
                break;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];

        }
        return string(bytesStringTrimmed);
    }

    function _stringToBytes(string memory source) internal pure returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }

    function _stringEq(string a, string b) internal pure returns (bool) {
        if (bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return _stringToBytes(a) == _stringToBytes(b);
        }
    }


    function isContract(address addr) internal view returns (bool) {
        uint size;
        assembly {size := extcodesize(addr)}
        return size > 0;

    }
}

contract SeroInterface {

    bytes32 private topic_sero_issueToken = 0x3be6bf24d822bcd6f6348f6f5a5c2d3108f04991ee63e80cde49a8c4746a0ef3;
    bytes32 private topic_sero_balanceOf = 0xcf19eb4256453a4e30b6a06d651f1970c223fb6bd1826a28ed861f0e602db9b8;
    bytes32 private topic_sero_send = 0x868bd6629e7c2e3d2ccf7b9968fad79b448e7a2bfb3ee20ed1acbc695c3c8b23;
    bytes32 private topic_sero_currency = 0x7c98e64bd943448b4e24ef8c2cdec7b8b1275970cfe10daf2a9bfa4b04dce905;

    function sero_msg_currency() internal returns (string) {
        bytes memory tmp = new bytes(32);
        bytes32 b32;
        assembly {
            log1(tmp, 0x20, sload(topic_sero_currency_slot))
            b32 := mload(tmp)
        }
        return Utils.bytes32ToString(b32);
    }

    function sero_issueToken(uint256 _total, string memory _currency) internal returns (bool success){
        bytes memory temp = new bytes(64);
        assembly {
            mstore(temp, _currency)
            mstore(add(temp, 0x20), _total)
            log1(temp, 0x40, sload(topic_sero_issueToken_slot))
            success := mload(add(temp, 0x20))
        }
        return;
    }

    function sero_balanceOf(string memory _currency) internal view returns (uint256 amount){
        bytes memory temp = new bytes(32);
        assembly {
            mstore(temp, _currency)
            log1(temp, 0x20, sload(topic_sero_balanceOf_slot))
            amount := mload(temp)
        }
        return;
    }

    function sero_send_token(address _receiver, string memory _currency, uint256 _amount) internal returns (bool success){
        return sero_send(_receiver, _currency, _amount, "", 0);
    }

    function sero_send(address _receiver, string memory _currency, uint256 _amount, string memory _category, bytes32 _ticket) internal returns (bool success){
        bytes memory temp = new bytes(160);
        assembly {
            mstore(temp, _receiver)
            mstore(add(temp, 0x20), _currency)
            mstore(add(temp, 0x40), _amount)
            mstore(add(temp, 0x60), _category)
            mstore(add(temp, 0x80), _ticket)
            log1(temp, 0xa0, sload(topic_sero_send_slot))
            success := mload(add(temp, 0x80))
        }
        return;
    }

}


contract Config {

    uint256 constant TREETIMES = 1e21;
    uint256 constant FIVETIMES = 5e21;

    uint256 constant kingAmount = 5e22;
    uint256 constant baron_large_total = 1e23;
    uint256 constant baron_little_total = 2e23;

    uint256 constant earl_large_total = 2e23;
    uint256 constant earl_little_total = 4e23;

    uint256 constant marquess_large_total = 4e23;
    uint256 constant marquess_little_total = 8e23;

    uint256 constant duke_large_total = 8e23;
    uint256 constant duke_little_total = 16e23;
}

contract InvestorRelationship is Config, SeroInterface {

    uint256 constant private MAXHEIGHT = 300;

    struct Investor {
        uint256 refereeId;
        uint256 largeAreaId;

        uint256 amount;
        uint256 totalAmount;
        uint256 returnAmount;
        uint256 achievement;
        uint256 recommendNum;
        uint256 profitLevel;
        uint256 value;
        uint256 otherAchievement;

        address addr;
        uint8 star;
        bool isKing;
    }

    struct ReturnReward {
        uint256 staticReward;
        uint256 recommendReward;
        uint256 starReward;
        uint256 vipReward;
        uint256 currentStaticReward;
        uint256 currentIncome;
        uint256 staticTimestamp;
        uint256 updateTimestamp;
    }

    uint256 public preTotalShare;
    uint256 public preRewardAmount;

    uint256 public totalShare;
    uint256 public lastUpdated;

    uint256 public cash;

    mapping(address => uint256) public indexs;
    Investor[] public investors;
    ReturnReward[] public returnRewards;

    using SafeMath for uint256;

    constructor() public {
        investors.push(Investor({refereeId : 0, largeAreaId : 0, amount : 0, totalAmount : 0, returnAmount : 0, achievement : 0, otherAchievement : 0, recommendNum : 0, profitLevel : 0, addr : 0, star : 0, isKing : false, value : 0}));
        returnRewards.push(ReturnReward({staticReward : 0, recommendReward : 0, starReward : 0, vipReward : 0, currentStaticReward : 0, currentIncome : 0, staticTimestamp : now, updateTimestamp : 0}));
    }

    function findByAddr(address addr) internal view returns (Investor) {
        return investors[indexs[addr]];
    }

    function findById(uint256 id) internal view returns (Investor) {
        return investors[id];
    }

    function getIndexByAddr(address addr) internal view returns (uint256) {
        return indexs[addr];
    }

    function _withdrawBalance(address addr) internal returns (uint256 amount) {
        uint256 index = getIndexByAddr(addr);
        require(index != 0);
        amount = investors[index].value;
        investors[index].value = 0;
        cash = SafeMath.sub(cash, amount);
        return;
    }

    function payStaticProfit(uint256 id, uint256 num) internal {
        _beforeUpdate();

        if (preTotalShare == 0 || preRewardAmount == 0) {
            return;
        }

        uint256 allProfit;
        for (uint256 i = id; i < Utils.min(investors.length, id + num); i++) {
            if (!Utils.sameDay(returnRewards[i].staticTimestamp, now) && investors[i].amount != 0) {
                allProfit += _payStaticProfit(i);
            }
        }
        cash = cash.add(allProfit);
        totalShare = totalShare.sub(allProfit);
    }

    function insert(uint256 refereeId, uint256 amount, address addr) internal {
        _beforeUpdate();

        indexs[addr] = investors.length;
        investors.push(Investor({refereeId : refereeId, largeAreaId : 0, amount : amount, totalAmount : amount, returnAmount : 0, achievement : 0, otherAchievement : 0, recommendNum : 0, profitLevel : 0, addr : addr, star : 0, isKing : false, value : 0}));
        returnRewards.push(ReturnReward({staticReward : 0, recommendReward : 0, starReward : 0, vipReward : 0, currentStaticReward : 0, currentIncome : 0, staticTimestamp : now, updateTimestamp : 0}));

        if (refereeId != 0) {
            investors[refereeId].recommendNum = investors[refereeId].recommendNum.add(1);
        }

        if (amount > 0) {
            _update(indexs[addr], amount);
        }
    }

    function update(uint id, uint256 amount) internal {
        _beforeUpdate();

        if (!Utils.sameDay(returnRewards[id].staticTimestamp, now) && investors[id].amount > 0 && preTotalShare != 0 && preRewardAmount != 0) {
            uint256 profit = _payStaticProfit(id);
            cash = cash.add(profit);
            totalShare = totalShare.sub(profit);
        }

        investors[id].amount = investors[id].amount.add(amount);
        investors[id].totalAmount = investors[id].totalAmount.add(amount);

        if (amount > 0) {
            _update(id, amount);
        }
    }

    function _update(uint256 id, uint256 amount) internal {
        if (amount >= kingAmount) {
            investors[id].isKing = true;
        }

        if (investors[id].profitLevel == 0) {
            investors[id].profitLevel = _profitLevel(amount);
        }


        uint256 childId = id;
        uint256 currentId = investors[id].refereeId;
        uint256 height;
        uint256 otherAmount = amount;
        while (currentId != uint256(0)) {

            if (investors[childId].otherAchievement != 0) {
                otherAmount = otherAmount.add(investors[childId].otherAchievement);
                investors[childId].otherAchievement = 0;
            }

            if (height == MAXHEIGHT && investors[currentId].refereeId != 0) {
                investors[currentId].otherAchievement = investors[currentId].otherAchievement.add(otherAmount);
                break;
            } else {
                investors[currentId].achievement = investors[currentId].achievement.add(otherAmount);
            }

            if (investors[currentId].largeAreaId == 0) {
                investors[currentId].largeAreaId = childId;
            } else {

                uint256 largeAreaId = investors[currentId].largeAreaId;
                uint256 largeAchievement = investors[largeAreaId].achievement.add(investors[largeAreaId].totalAmount);
                uint256 childAchievement = investors[childId].achievement.add(investors[childId].totalAmount);

                if (investors[currentId].largeAreaId != childId && childAchievement > largeAchievement) {
                    investors[currentId].largeAreaId = childId;
                    largeAchievement = childAchievement;
                }

                uint256 littleAchievement = (investors[currentId].achievement.add(investors[currentId].otherAchievement)).sub(largeAchievement);
                uint8 star;
                if (largeAchievement >= duke_large_total && littleAchievement >= duke_little_total) {
                    star = 4;
                } else if (largeAchievement >= marquess_large_total && littleAchievement >= marquess_little_total) {
                    star = 3;
                } else if (largeAchievement >= earl_large_total && littleAchievement >= earl_little_total) {
                    star = 2;
                } else if (largeAchievement >= baron_large_total && littleAchievement >= baron_little_total) {
                    star = 1;
                } else {
                    star = 0;
                }
                if (star > investors[currentId].star) {
                    investors[currentId].star = star;
                }

            }
            height++;
            (childId, currentId) = (currentId, investors[currentId].refereeId);
        }

        uint256 allProfit;
        allProfit += _recommendProfit(investors[id].refereeId, amount);
        allProfit += _starProfit(investors[id].refereeId, amount);
        allProfit += _vipProfit(investors[id].refereeId, amount);

        cash = cash.add(allProfit);
        uint256 addShare = investors[id].amount.mul(investors[id].profitLevel);
        addShare = addShare.sub(allProfit);
        totalShare = totalShare.add(addShare);
    }

    function _payStaticProfit(uint256 id) internal returns (uint256) {

        uint256 allShare = investors[id].amount.mul(investors[id].profitLevel);
        uint256 currentShare = allShare.sub(investors[id].returnAmount);
        uint256 profit = preRewardAmount.mul(currentShare) / preTotalShare;
        uint256 maxprofit = allShare.mul(2) / 1000;
        if (profit > maxprofit) {
            profit = maxprofit;
        }
        profit = _payProfit(id, profit);

        returnRewards[id].staticTimestamp = now;
        returnRewards[id].staticReward = returnRewards[id].staticReward.add(profit);
        returnRewards[id].currentStaticReward = profit;
        return profit;
    }


    function _starProfit(uint256 id, uint256 amount) internal returns (uint256 allProfit) {
        if (id == 0) {
            return;
        }

        uint256 height;
        uint256 rate;
        while (id != 0 && height < MAXHEIGHT && rate < 12) {

            if (investors[id].star == 0 || investors[id].amount == 0) {
                id = investors[id].refereeId;
                height++;
                continue;
            }

            uint currentRate = investors[id].star * 3;
            if (currentRate <= rate) {
                id = investors[id].refereeId;
                height++;
                continue;
            }

            (rate, currentRate) = (currentRate, currentRate - rate);
            uint256 profit = amount.mul(currentRate) / 100;

            profit = _payProfit(id, profit);
            returnRewards[id].starReward = returnRewards[id].starReward.add(profit);
            allProfit += profit;

            id = investors[id].refereeId;
            height++;
        }
        return;
    }

    function _vipProfit(uint256 id, uint256 amount) internal returns (uint256 profit) {
        if (id == 0) {
            return;
        }

        uint256 height;
        while (id != 0 && !investors[id].isKing && height < MAXHEIGHT) {
            id = investors[id].refereeId;
            height++;
        }

        if (id != 0 && investors[id].isKing) {
            profit = _payProfit(id, amount / 20);
            returnRewards[id].vipReward = returnRewards[id].vipReward.add(profit);
        }
        return;
    }

    function _recommendProfit(uint256 firstId, uint256 amount) internal returns (uint256) {
        if (firstId == 0) {
            return;
        }

        uint256 allProfit;
        allProfit += _caleRecommendProfit(firstId, amount, 10);
        uint256 secondId = investors[firstId].refereeId;

        if (secondId != uint256(0)) {
            if (investors[secondId].recommendNum >= 2) {
                allProfit += _caleRecommendProfit(secondId, amount, 8);
            }

            uint256 thirdId = investors[secondId].refereeId;
            if (thirdId != uint256(0) && investors[thirdId].recommendNum >= 3) {
                allProfit += _caleRecommendProfit(thirdId, amount, 7);
            }
        }
        return allProfit;
    }

    function _caleRecommendProfit(uint256 id, uint256 amount, uint256 rate) internal returns (uint256) {
        if (investors[id].amount == 0) {
            return;
        }

        uint256 profile = amount.mul(rate) / 100;
        profile = _payProfit(id, profile);
        returnRewards[id].recommendReward = returnRewards[id].recommendReward.add(profile);
        return profile;
    }

    function _beforeUpdate() internal {
        if (!Utils.sameDay(now, lastUpdated)) {
            preRewardAmount = _balanceOfSero() / 30;
            preTotalShare = totalShare;
            lastUpdated = now;
        }
    }

    function _balanceOfSero() internal view returns (uint256){
        return sero_balanceOf("SERO").sub(cash);
    }

    function _payProfit(uint id, uint256 amount) internal returns (uint256) {

        uint256 totalProfit = investors[id].amount.mul(investors[id].profitLevel);
        if (amount.add(investors[id].returnAmount) > totalProfit) {
            amount = totalProfit.sub(investors[id].returnAmount);
        }

        investors[id].returnAmount = investors[id].returnAmount.add(amount);
        if (investors[id].returnAmount >= totalProfit) {
            investors[id].amount = 0;
            investors[id].returnAmount = 0;
            investors[id].isKing = false;
        }

        if (!Utils.sameDay(now, returnRewards[id].updateTimestamp)) {
            returnRewards[id].currentIncome = amount;
            returnRewards[id].updateTimestamp = now;
        } else {
            returnRewards[id].currentIncome = returnRewards[id].currentIncome.add(amount);
        }

        investors[id].value = investors[id].value.add(amount);
        return amount;
    }

    function _profitLevel(uint256 amount) internal pure returns (uint256) {
        if (amount < TREETIMES) {
            return 3;
        } else if (amount < FIVETIMES) {
            return 4;
        } else {
            return 5;
        }
    }
}


contract Ownable {

    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

interface CodeService {

    function encode(uint64 n) external view returns (string);

    function decode(string code) external view returns (uint);
}

contract Asnow is InvestorRelationship, Ownable {

    string private constant SERO_CURRENCY = "SERO";
    string private constant TOKEN_CURRENCY = "ASNOW";
    uint256 private constant FIVEHUNDREDTHOUSAND = 5e23;
    uint256 private constant MILLION = 1e24;
    uint256 private constant TENMILLION = 1e25;
    uint256[] private  dList = [1e16, 2e16, 3e16, 4e16, 12e16, 2e17, 4e17, 8e17, 102e16];
    uint256[] private  startList = [8e16, 28e16, 68e16, 128e16, 208e16, 448e16, 848e16, 1648e16, 3248e16];

    uint256 private _totalSupply = 21e24;
    bool public isSell = true;
    uint256 private triggerStaticNum = 20;

    uint256 public allIncome;
    mapping(address => uint256) private asnowBalances;
    address private marketAddr;

    CodeService private codeService;

    constructor(address _marketAddr, address _codeServiceAddr, address _otherAddr) public payable {
        require(sero_issueToken(_totalSupply, TOKEN_CURRENCY));
        require(sero_send_token(_otherAddr, TOKEN_CURRENCY, 1e25));
        marketAddr = _marketAddr;
        codeService = CodeService(_codeServiceAddr);
    }

    function name() public pure returns (string memory) {
        return "ASNOW";
    }

    function symbol() public pure returns (string memory) {
        return TOKEN_CURRENCY;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function decimals() public pure returns (uint8) {
        return 18;
    }

    function balanceOf() public view returns (uint256 amount) {
        return sero_balanceOf(TOKEN_CURRENCY);
    }

    function balanceOfSero() public view returns (uint256 amount) {
        return _balanceOfSero();
    }

    function setMarketAddr(address addr) public onlyOwner {
        marketAddr = addr;
    }

    function setTriggerStaticNum(uint256 _triggerStaticNum) public onlyOwner {
        triggerStaticNum = _triggerStaticNum;
    }

    function id() public view returns (string) {
        uint256 index = getIndexByAddr(msg.sender);
        return codeService.encode(uint64(index));
    }

    function codeExist(string memory code) public view returns (bool) {
        uint256 index = codeService.decode(code);
        return index != 0 && index < investors.length;
    }

    function balanceOfAsnow() public view returns (uint256 amount) {
        return asnowBalances[msg.sender];
    }

    function details() public view
    returns (string, string, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint8, bool)  {
        Investor memory i = findByAddr(msg.sender);
        uint256 largeAchievement;
        if (i.largeAreaId != 0) {
            largeAchievement = investors[i.largeAreaId].achievement.add(investors[i.largeAreaId].totalAmount);
        }

        return (codeService.encode(uint64(i.refereeId)), codeService.encode(uint64(i.largeAreaId)), largeAchievement, i.amount, i.returnAmount, i.achievement, i.recommendNum, i.profitLevel, i.value, i.star, i.isKing);
    }

    function detailsOfIncome() public view returns (uint256, uint256, uint256, uint256, uint256, uint256){

        uint256 index = getIndexByAddr(msg.sender);
        uint256 currentIncome;
        if (Utils.sameDay(returnRewards[index].updateTimestamp, now)) {
            currentIncome = returnRewards[index].currentIncome;
        }

        return (returnRewards[index].staticReward, returnRewards[index].recommendReward, returnRewards[index].starReward, returnRewards[index].vipReward, currentIncome, returnRewards[index].staticTimestamp);
    }

    function withdrawBalance() public {
        uint value = _withdrawBalance(msg.sender);
        if (value > 0) {
            require(sero_send_token(msg.sender, SERO_CURRENCY, value));
        }
    }

    function registerNode(address addr) public onlyOwner {
        require(!Utils.isContract(addr));
        insert(0, 0, addr);
    }

    function paymentAsnow() public payable {
        require(Utils._stringEq(TOKEN_CURRENCY, sero_msg_currency()));
        asnowBalances[msg.sender] = asnowBalances[msg.sender].add(msg.value);
    }

    function triggerStaticProfit() public {
        uint256 index = getIndexByAddr(msg.sender);
        require(index != 0);
        payStaticProfit(index, triggerStaticNum);
    }

    function calcuStaticProfit() public view returns (uint256) {
        uint256 index = getIndexByAddr(msg.sender);
        require(index != 0);
        _beforeUpdate();

        if (Utils.sameDay(now, returnRewards[index].staticTimestamp)) {
            return returnRewards[index].currentStaticReward;
        }

        return _payStaticProfit(index);
    }

    function _usedAsnow(uint256 amount) internal returns (bool) {
        uint256 needAsnow = seroToAsnow(amount / 10);
        if (asnowBalances[msg.sender] < needAsnow) {
            return false;
        }
        asnowBalances[msg.sender] = asnowBalances[msg.sender] - needAsnow;
        return true;
    }

    function invest(string memory refereeCode) public payable returns (bool){
        require(Utils._stringEq(SERO_CURRENCY, sero_msg_currency()));
        require(!Utils.isContract(msg.sender));

        require(msg.value >= 1e20);
        require(_usedAsnow(msg.value));

        allIncome = allIncome.add(msg.value);

        uint256 index = getIndexByAddr(msg.sender);
        if (index == 0) {
            uint256 refereeId = codeService.decode(refereeCode);
            require(refereeId != 0 && refereeId < investors.length);
            insert(refereeId, msg.value, msg.sender);
        } else {
            update(index, msg.value);
        }
        uint256 fee = msg.value.mul(3) / 200;
        require(sero_send_token(owner, SERO_CURRENCY, fee));
        require(sero_send_token(marketAddr, SERO_CURRENCY, fee));
        return true;
    }

    function setSell(bool flag) public onlyOwner {
        isSell = flag;
    }

    function buyAsnow() public payable returns (uint256 asnowAmount) {
        require(isSell);
        require(Utils._stringEq(SERO_CURRENCY, sero_msg_currency()));

        uint256 amount = msg.value;
        if (msg.value > 1e23) {
            amount = 1e23;
            require(sero_send_token(msg.sender, SERO_CURRENCY, msg.value - amount));
        }

        asnowAmount = seroToAsnow(amount);
        allIncome = allIncome.add(amount);

        require(sero_send_token(msg.sender, TOKEN_CURRENCY, asnowAmount));
        return asnowAmount;
    }

    function conversionRate() public view returns (uint256, uint256) {
        if (allIncome < MILLION) {
            return (1e17, 1e18);
        }

        uint256 m = allIncome / TENMILLION;
        if (m >= 8) {
            m = 8;
        }
        uint256 d = dList[m];
        uint256 start = startList[m];
        uint256 n = (allIncome - m * TENMILLION) / FIVEHUNDREDTHOUSAND;

        return (start + d * n, 1e18);
    }


    function seroToAsnow(uint256 value) internal view returns (uint256) {
        uint256 r1;
        uint256 r2;
        (r1, r2) = conversionRate();
        return value.mul(r2) / r1;
    }

    function asnowToSero(uint256 value) internal view returns (uint256) {
        uint256 r1;
        uint256 r2;
        (r1, r2) = conversionRate();
        return value.mul(r1) / r2;
    }
}