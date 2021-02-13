pragma solidity 0.6.7;
pragma experimental ABIEncoderV2;
import 'github.com/OpenZeppelin/zeppelin-solidity/contracts/access/Ownable.sol';
import 'github.com/OpenZeppelin/zeppelin-solidity/contracts/math/SafeMath.sol';

contract highOrLow is Ownable {
    using SafeMath for uint256;
    struct Bet {
        address payable user;
        uint256 amount;
        uint256 timestamp;
        uint256 gameIndex;
        Side side;
    }
    struct Game {
        Bet[] high;
        Bet[] low;
        bool finished;
        Side winner;
        uint256 startTimestamp;
        uint256 closeTimestamp;
        uint256 resultTimestamp;
        uint256 realTimestamp;
        string pairName;
        uint256 decimal;
        uint256 currentPrice;
        uint256 resultPrice;
        string transactionHash;
    }
    enum Side {high, low, draw, noGame}
    uint256 public feePercent;
    Game[] public games;
    uint256 public newestGameIndex;
    mapping(address => Bet[]) public addressToBets;
    mapping(address => uint256) public addressToBetCount;

    constructor(uint256 _feePercent) public {
        feePercent = _feePercent;
    }

    function setFee(uint256 _feePercent) onlyOwner public {
        feePercent = _feePercent;
    }

    function setNewestGameIndex(uint _newestGameIndex) onlyOwner public {
        newestGameIndex = _newestGameIndex;
    }

    function getHighBets (uint256 gameIndex) public view returns (Bet[] memory) {
        return games[gameIndex].high;
    }

    function getLowBets (uint256 gameIndex) public view returns (Bet[] memory) {
        return games[gameIndex].low;
    }

    function getMyBets () public view returns(Bet[] memory) {
        return addressToBets[msg.sender];
    }

    function getBetsByAddress (address _address) public view returns(Bet[] memory) {
        return addressToBets[_address];
    }

    function getHighAmount(uint256 gameIndex) public view returns (uint256){
        uint256 highAmount = 0;
        for(uint256 i = 0; i < games[gameIndex].high.length; i++){
            highAmount = highAmount.add(games[gameIndex].high[i].amount);
        }
        return highAmount;
    }

    function getLowAmount(uint256 gameIndex) public view returns (uint256){
        uint256 lowAmount = 0;
        for(uint256 i = 0; i < games[gameIndex].low.length; i++){
            lowAmount = lowAmount.add(games[gameIndex].low[i].amount);
        }
        return lowAmount;
    }

    function getHighPercentage(uint256 gameIndex) public view returns (uint256){
        uint256 highAmount = getHighAmount(gameIndex);
        uint256 lowAmount = getLowAmount(gameIndex);
        uint256 totalAmount = highAmount.add(lowAmount);
        if(totalAmount == 0) {
            return 50;
        }
        return highAmount.mul(100).div(totalAmount);
    }

    function getLowPercentage(uint256 gameIndex) public view returns (uint256){
        uint256 highAmount = getHighAmount(gameIndex);
        uint256 lowAmount = getLowAmount(gameIndex);
        uint256 totalAmount = highAmount.add(lowAmount);
        if(totalAmount == 0) {
            return 50;
        }
        return lowAmount.mul(100).div(totalAmount);
    }

    function getHighMagnificationPercent(uint256 gameIndex) public view returns(uint256){
        return (100 - feePercent).mul(100).div(getHighPercentage(gameIndex));
    }

    function getLowMagnificationPercent(uint256 gameIndex) public view returns(uint256){
        return (100 - feePercent).mul(100).div(getLowPercentage(gameIndex));
    }

    function createNewGame(uint256 startTimestamp, uint256 closeTimestamp, uint256 resultTimestamp, uint256 decimal, uint256 currentPrice,string memory pairName) onlyOwner public {
        games.push();
        newestGameIndex = games.length -1;
        games[newestGameIndex].startTimestamp = startTimestamp;
        games[newestGameIndex].closeTimestamp = closeTimestamp;
        games[newestGameIndex].resultTimestamp = resultTimestamp;
        games[newestGameIndex].realTimestamp = now;
        games[newestGameIndex].decimal = decimal;
        games[newestGameIndex].currentPrice = currentPrice;
        games[newestGameIndex].pairName = pairName;
    }

    function finishGame(uint256 gameIndex, uint256 resultPrice) onlyOwner public {
        require(!games[gameIndex].finished, "game is already finished.");
        Side winner = games[gameIndex].currentPrice == resultPrice ? Side.draw : games[gameIndex].currentPrice < resultPrice ? Side.high : Side.low;
        uint256 totalAmount = getHighAmount(gameIndex).add(getLowAmount(gameIndex));
        uint256 remainAmount = totalAmount;
        if(games[gameIndex].high.length == 0 || games[gameIndex].low.length ==0 || winner == Side.draw){
            // no game case
            remainAmount = 0;
            if(games[gameIndex].high.length == 0 || games[gameIndex].low.length ==0){
                winner = Side.noGame;
            }
            for(uint256 i = 0; i < games[gameIndex].high.length; i++){
                games[gameIndex].high[i].user.transfer(games[gameIndex].high[i].amount);
            }
            for(uint256 i = 0; i < games[gameIndex].low.length; i++){
                games[gameIndex].low[i].user.transfer(games[gameIndex].low[i].amount);
            }
        }

        else if(winner == Side.high){
            for(uint256 i = 0; i < games[gameIndex].high.length; i++){
                uint256 getAmount = games[gameIndex].high[i].amount.mul(getHighMagnificationPercent(gameIndex)).div(100);
                games[gameIndex].high[i].user.transfer(getAmount);
                remainAmount = remainAmount.sub(getAmount);
            }
        } else if(winner == Side.low) {
            for(uint256 i = 0; i < games[gameIndex].low.length; i++){
                uint256 getAmount = games[gameIndex].low[i].amount.mul(getLowMagnificationPercent(gameIndex)).div(100);
                games[gameIndex].low[i].user.transfer(getAmount);
                remainAmount = remainAmount.sub(getAmount);
            }
        }
        games[gameIndex].finished = true;
        games[gameIndex].winner = winner;
        games[gameIndex].resultPrice = resultPrice;
        if(remainAmount != 0){
            msg.sender.transfer(remainAmount);
        }
    }

    function setTransactionHash(uint256 gameIndex, string memory transactionHash) onlyOwner public {
        games[gameIndex].transactionHash = transactionHash;
    }

    function withdraw(uint256 amount) onlyOwner public{
        msg.sender.transfer(amount);
    }

    function withdrawAll() onlyOwner public{
        msg.sender.transfer(address(this).balance);
    }
    /**
     * @param side 0 high 1 low
     */
    function bet(uint256 gameIndex, Side side) public payable{
        require(msg.value >= 1000000000000000000, "should bet least 1 Tomo");
        require(!games[gameIndex].finished,"game is ginished");
        require(side == Side.high || side == Side.low, "should bet high or low");
        // solidity's timestamp is based on sec not msec.
        require(games[gameIndex].closeTimestamp.div(1000) > now, "game is closed");
        Bet memory userBet = Bet(msg.sender, msg.value, now, gameIndex, side);
        addressToBets[msg.sender].push(userBet);
        addressToBetCount[msg.sender]++;
        if(side == Side.high){
            games[gameIndex].high.push(userBet);
        }
        if(side == Side.low){
            games[gameIndex].low.push(userBet);
        }
    }
}
