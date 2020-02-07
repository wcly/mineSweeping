//点击开始游戏 -> 动态生成棋盘，100个格子 -> 100div
//leftClick 没有雷 --> 显示数字（以当前小格为中心，周围的8个格子的雷数） 扩散（当前周围八个格没有雷）
//rightClick  没有标记并且没有数字 --> 进行标记 ， 有标记 --> 取消标记 ，判断标记是否正确，10个都标记正确，提示游戏赢了
//已经出现数字 --> 无效果

let startBtn = document.getElementById('btn');
let board = document.getElementById('board');
let flagBox = document.getElementById('flagBox');
let alertBox = document.getElementById('alertBox');
let alertContent = document.getElementById('alertContent');
let closeBtn = document.getElementById('close');
let score = document.getElementById('score');
let minesNum; //雷数
let mineOver; //剩余雷数
let block; //方格
let mineMap = [];
let startGameBool = true;

bindEvent();

function bindEvent() {
    startBtn.onclick = () => {
        if(startGameBool){
            board.style.display = 'block';
            flagBox.style.display = 'block';
            init();
            startGameBool = false;
        }
    }
    //取消右键默认事件
    board.oncontextmenu = () => {
        return false;
    }
    board.onmousedown = (e) => {
        let event = e.target;
        if(e.which == 1){
            leftClick(event);
        }else if(e.which == 3){
            rightClick(event);
        }
    }
    closeBtn.onclick = () =>{
        alertBox.style.display = 'none';
        board.style.display = 'none';
        flagBox.style.display = 'none';
        board.innerHTML = '';
        startGameBool = true;
    }
}

//初始化
function init() {
    minesNum = mineOver = 10;
    score.innerHTML = mineOver;
    //生成棋盘
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let con = document.createElement('div');
            con.classList.add('block');
            con.setAttribute('id', i + '-' + j);
            board.appendChild(con);
            mineMap.push({
                mine: 0
            });
        }
    }
    block = document.getElementsByClassName('block');
    //随机加入雷
    while (minesNum) {
        let mineIndex = Math.floor(Math.random() * 100);
        if (mineMap[mineIndex].mine == 0) {
            mineMap[mineIndex].mine = 1;
            block[mineIndex].classList.add('isLei');
            minesNum--;
        }
    }
}

//点击左键
function leftClick(dom){
    let isLei = document.getElementsByClassName('isLei');
    if(dom.classList.contains('flag')){ //遇到有标记不处理
        return;
    }
    //点到雷
    if(dom && dom.classList.contains('isLei')){
        for(let i = 0; i < isLei.length; i++){
            isLei[i].classList.add('mine');
        }
        setTimeout(()=>{
            alertBox.style.display = 'block';
            alertContent.innerHTML = '游戏结束';
        }, 800);
    }else{
        //没点到雷
        let n = 0; //周围雷数
        let posArr = dom && dom.getAttribute('id').split('-');
        let posX = posArr && parseInt(posArr[0]);
        let posY = posArr && parseInt(posArr[1]);
        dom.classList.add('num');
        //查询点击格子周围的格子是否是雷
        for(let i = posX - 1; i <= posX + 1; i++){
            for(let j = posY - 1; j <= posY + 1; j++){
                let arroundBox = document.getElementById(i + '-' + j);
                if(arroundBox && arroundBox.classList.contains('isLei')){
                    n++;
                }
            }
        }
        //雷数是0扩散
        dom && (dom.innerHTML = n);
        if(n == 0){
            for(let i = posX - 1; i <= posX + 1; i++){
                for(let j = posY - 1; j <= posY + 1; j++){
                    let nearBox = document.getElementById(i + '-' + j);
                    if(nearBox && nearBox.length != 0){
                        if(!nearBox.classList.contains('check')){
                           nearBox.classList.add('check');
                           leftClick(nearBox); 
                        }
                    }
                }
            }
        }
    }
}

//点击右键
function rightClick(dom){
    if(dom.classList.contains('num')){
        return;
    }
    dom.classList.toggle('flag');
    if(dom.classList.contains('isLei') && dom.classList.contains('flag')){
        mineOver--;
    }
    if(dom.classList.contains('isLei') && !dom.classList.contains('flag')){
        mineOver++;
    }
    score.innerHTML = mineOver;
    if(mineOver == 0){
        setTimeout(()=>{
            alertBox.style.display = 'block';
            alertContent.innerHTML = '恭喜，你赢了';
        },200);
    }
}