//盒子对象
var box = document.querySelector(".box");
//棋盘对象
var board = document.querySelector(".board");
//棋盘遮罩
var boardMask = document.querySelector(".mask");
//提示棋子遮罩
var promptMsak = document.querySelector(".promptMask");
//信息框
var messageBox = document.querySelector(".messageBox");
//信息框确定按钮
var confirm = document.querySelector(".confirm");
//信息框提示文本
var text = document.querySelector(".text");


//开始游戏按钮
var startBtn = document.querySelector(".start");
//悔棋按钮
var backBtn = document.querySelector(".back");
//计步按钮
var stepInfoBtn = document.querySelector(".stepInfo");
//AI按钮
var AIBtn = document.querySelector(".AI");


//设置游戏为未开始
var start = false;
//设置当前落子为黑棋
var flag = "black";
//设置计步是否启动
var step = false;
//存储棋子坐标,如["1,2",3,4]
var pieceArray = [];
//存储棋子坐标和当前坐标的棋子颜色,如["1,2block","5,6white"]
var pieceColorArray = [];
//提示数组
var piecePrompt = [];


//程序加载事件
document.addEventListener("DOMContentLoaded", function () {
    drawingBoard(board);//生成棋盘
    console.log(box.offsetWidth + box.offsetLeft + 20);
    startBtn.style.left = box.offsetWidth + box.offsetLeft + 20 + "px";
    backBtn.style.left = box.offsetWidth + box.offsetLeft + 20 + "px";
    stepInfoBtn.style.left = box.offsetWidth + box.offsetLeft + 20 + "px";
    AIBtn.style.left = box.offsetWidth + box.offsetLeft + 20 + "px";
    messageBox.style.left = box.offsetWidth + box.offsetLeft + 20 + "px";
});

//浏览器窗口尺寸改变
window.addEventListener("resize", function () {
    startBtn.style.left = box.offsetWidth + box.offsetLeft + 20 + "px";
    backBtn.style.left = box.offsetWidth + box.offsetLeft + 20 + "px";
    stepInfoBtn.style.left = box.offsetWidth + box.offsetLeft + 20 + "px";
    AIBtn.style.left = box.offsetWidth + box.offsetLeft + 20 + "px";
    messageBox.style.left = box.offsetWidth + box.offsetLeft + 20 + "px";
});

//"开始游戏"按钮单击
startBtn.addEventListener("click", function () {
    clear(boardMask);//清除棋盘所有棋子
    start = true;//设置游戏为开始
    flag = "black";//设置当前落子为黑子
    messageBox.style.display = "none";//隐藏信息框
});


//"悔棋"按钮单击
backBtn.addEventListener("click", function () {
    backPiece();//删除最后一颗落子
});


//"计步"按钮单击
stepInfoBtn.addEventListener("click", function () {
    stepInfo();//为每一颗棋子添加索引

    if (stepInfoBtn.innerHTML == "开启计步") {

        step = true;
        stepInfoBtn.innerHTML = "关闭计步"
    } else if (stepInfoBtn.innerHTML == "关闭计步") {
        step = false;
        // boardMask.children[i].innerHTML = i + 1;
        stepInfoBtn.innerHTML = "开启计步"
    }
});


//"人工智障"按钮单击
AIBtn.addEventListener("click", function () {

    //获取棋子坐标
    var pieceLocation = pieceAI();

    //若棋子坐标已经存在,则重新获取
    while (pieceArray.indexOf(pieceLocation.join(",")) != -1) {
        pieceLocation = pieceAI();
    }

    //若获取到棋子坐标且游戏是开始状态,则创建棋子加入到棋盘中
    if (pieceLocation[0] == -1 || pieceLocation[1] == -1 || start == false) {
        return
    }    //创建棋子
    var piece = document.createElement("div");

    setPieceStyle(piece, pieceLocation);//设置棋子样式

    //把数组坐标转化为字符串
    var pieceString = pieceLocation.join(",");
    //把数组坐标转化为字符串加上棋子颜色
    var pieceColorString = pieceLocation.join(",") + flag;

    //判断当前落子的是黑棋还是白棋
    if (flag == "black") {
        //设置为黑棋
        piece.style.backgroundColor = "#000";
        flag = "white"
    } else {
        //设置为白棋
        piece.style.backgroundColor = "#fff";
        flag = "black";
    }

    //若当前坐标没有棋子,则把该棋子加入棋盘
    if (pieceArray.indexOf(pieceString) == -1) {


        //棋子加入棋盘
        boardMask.appendChild(piece);

        //计步
        if (step) {
            stepInfo();
        }
        //棋子坐标字符串加入坐标数组
        pieceArray.push(pieceString);
        //棋子坐标和棋子种类加入数组
        pieceColorArray.push(pieceColorString);
    }

    //获取胜利方
    var winColor = getWin(pieceColorArray);
    if (winColor) {
        //设置信息框信息
        info(winColor);
        //显示信息框
        messageBox.style.display = "block";
    }
});


//棋盘遮罩单击事件
box.addEventListener("click", function (e) {

    var pieceLocation = getLocation(e, box);

    //若获取到棋子坐标且游戏是开始状态,则创建棋子加入到棋盘中
    if (pieceLocation[0] == -1 || pieceLocation[1] == -1 || start == false) {
        return;
    }

    if (pieceArray.indexOf(pieceLocation.join(",")) != -1) {
        return;
    }

    //创建棋子
    var piece = document.createElement("div");

    setPieceStyle(piece, pieceLocation);

    //把数组坐标转化为字符串
    var pieceString = pieceLocation.join(",");
    //把数组坐标转化为字符串加上棋子颜色
    var pieceColorString = pieceLocation.join(",") + flag;

    //判断当前落子的是黑棋还是白棋
    if (flag == "black") {
        //设置为黑棋
        piece.style.backgroundColor = "#000";
        flag = "white"
    } else {
        //设置为白棋
        piece.style.backgroundColor = "#fff";
        flag = "black";
    }

    //若当前坐标没有棋子,则把该棋子加入棋盘
    if (pieceArray.indexOf(pieceString) == -1) {
        //棋子加入棋盘
        boardMask.appendChild(piece);
        //计步
        if (step) {
            stepInfo();
        }
        //棋子坐标字符串加入坐标数组
        pieceArray.push(pieceString);
        //棋子坐标和棋子种类加入数组
        pieceColorArray.push(pieceColorString);
    }

    //获取胜利方
    var winColor = getWin(pieceColorArray);
    if (winColor) {
        //设置信息框信息
        info(winColor);
        //显示信息框
        messageBox.style.display = "block";
    }
});


//落子提示
document.addEventListener("mousemove", function (e) {

    //获取棋子的坐标
    var pieceLocation = getLocation(e, box);

    // console.log(pieceLocation);
    if (pieceLocation[0] == -1 || pieceLocation[1] == -1) {
        while (promptMsak.children.length != 0) {
            promptMsak.removeChild(promptMsak.children[0]);
        }
        piecePrompt = [];
        return;
    }

    //若获取到棋子坐标且游戏是开始状态,则创建棋子加入到棋盘中
    if (pieceLocation && start) {

        //创建棋子
        var piece = document.createElement("div");

        setPieceStyle(piece, pieceLocation);

        //设置半透明
        piece.style.opacity = "0.4";


        //判断当前落子的是黑棋还是白棋
        if (flag == "black") {
            //设置为黑棋
            piece.style.backgroundColor = "#000";
            // flag = "white"
        } else {
            //设置为白棋
            piece.style.backgroundColor = "#fff";
            // flag = "black";
        }

        //把数组坐标转化为字符串
        var pieceString = pieceLocation.join(",");

        if (piecePrompt.indexOf(pieceString) == -1) {

            //若棋盘存在其他半透明棋子,则删除
            if (piecePrompt.length != 0) {
                promptMsak.removeChild(promptMsak.lastElementChild);
                piecePrompt.pop();
            } else if (pieceArray.indexOf(pieceString) == -1) {
                promptMsak.appendChild(piece);
                piecePrompt.push(pieceString);
            }

        }

    } else {
        //清空提示棋子
        while (promptMsak.children.length != 0) {
            promptMsak.removeChild(promptMsak.children[0]);
        }
        piecePrompt = [];
    }

});


//获取棋子坐标
function getLocation(event, box) {

    //鼠标在棋盘的横坐标
    var x = event.pageX - box.offsetLeft - 40;

    //鼠标在棋盘的纵坐标
    var y = event.pageY - box.offsetTop - 40;

    var pieceX, pieceY;//棋子坐标

    //若鼠标在交叉线横向左右30px内点击,返回交叉线的横坐标0-8
    if (x % 80 >= 50) {
        pieceX = parseInt(x / 80) + 1;
    } else if (x % 80 <= 30) {
        pieceX = parseInt(x / 80);
    } else {
        pieceX = -1;
    }
    //若鼠标在交叉线竖向左右30px内点击,返回交叉线的纵坐标0-8
    if (y % 80 >= 50) {
        pieceY = parseInt(y / 80) + 1;
    } else if (y % 80 <= 30) {
        pieceY = parseInt(y / 80);
    } else {
        pieceY = -1;
    }

    if (pieceX < 0 || pieceX > 8) {
        pieceX = -1;
    }
    if (pieceY < 0 || pieceY > 8) {
        pieceY = -1;
    }

    //返回棋子的横纵坐标,[0,0]到[8,8]
    return [pieceX, pieceY];
}


//获取胜利方
function getWin(arr) {
    //当前棋子颜色
    var pieceColor = arr[arr.length - 1].slice(3);
    //当前棋子横坐标
    var pieceX = parseInt(arr[arr.length - 1].slice(0, 1));
    //当前棋子纵坐标
    var pieceY = parseInt(arr[arr.length - 1].slice(2, 3));
    //双层循环,从八个方向判断一条线上是否有五个同色棋子
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            //一共八条线路,原点不用判断
            if (i == 0 && j == 0) {
                continue;
            }

            var direction_i = i;//方向变量X
            var direction_j = j;//方向变量Y
            var step = 1;//步长
            var count = 1;//记录同色棋子个数
            var reversal = 0;//反转次数

            while (true) {

                //获取棋子坐标
                var x = pieceX + step * direction_i;
                var y = pieceY + step * direction_j;

                //获取棋子坐标和种类
                var piece = x + "," + y + pieceColor;

                //判断当前线路是否有同色棋子在棋盘中
                if (arr.indexOf(piece) != -1) {

                    count++;//同色棋子个数加1

                    //同色棋子个数为5,游戏胜利,返回获胜的棋子颜色
                    if (count == 5) {
                        return pieceColor;
                    }
                    step++;//步长加1

                } else {
                    reversal++;//反转次数加一
                    //当反转次数为2时,结束当前循环,当前线路没有五个同色棋子
                    if (reversal == 2) {
                        break;
                    }
                    direction_i = -i;//线路反转,X方向改变
                    direction_j = -j;//线路反转,Y方向改变
                    step = 1;//当前线路反转,步长重新设置为1

                }
            }
        }
    }
}


//设置棋子的样式
function setPieceStyle(piece, pieceLocation) {
    //设置棋子绝对定位
    piece.style.position = "absolute";
    //设置棋子宽
    piece.style.width = "60px";
    //设置棋子高
    piece.style.height = "60px";
    //设置棋子为圆形
    piece.style.borderRadius = "50%";
    //设置棋子绝对定位左边距
    piece.style.left = pieceLocation[0] * 80 + 10 + "px";
    //设置棋子绝对定位上边距
    piece.style.top = pieceLocation[1] * 80 + 10 + "px";
}


//信息框设置
function info(color) {
    start = false;//游戏设置为未开始
    //判断赢家
    if (color == "black") {
        text.innerHTML = "黑棋获胜";
    } else {
        text.innerHTML = "白棋获胜";
    }
    //按钮单击事件
    confirm.addEventListener("click", function () {
        clear(boardMask);//清除所有棋子
        messageBox.style.display = "none";
    });
}


//清除所有棋子和坐标数组
function clear(ele) {
    //清除棋盘所有棋子
    while (ele.children.length != 0) {
        ele.removeChild(ele.children[0]);
    }
    //清空棋盘坐标数组
    pieceArray = [];
    //清空棋盘坐标种类数组
    pieceColorArray = [];
}


//生成棋盘
function drawingBoard(board) {
    for (var i = 0; i < 64; i++) {
        //创建棋格
        var grid = document.createElement("div");
        //设置棋格边框
        grid.style.float = "left";
        grid.style.width = "80px";
        grid.style.height = "80px";
        grid.style.backgroundColor = "#d2a143";
        grid.style.borderLeft = "1px solid #000";
        grid.style.borderTop = "1px solid #000";
        //设置棋盘外边框
        if (i % 8 == 0) {
            grid.style.borderLeft = "3px solid #000";
        }

        if (i % 8 == 7) {
            grid.style.borderRight = "3px solid #000";
        }

        if (i <= 7) {
            grid.style.borderTop = "3px solid #000";
        }

        if (i >= 56) {
            grid.style.borderBottom = "3px solid #000";
        }
        //把棋格添加到棋盘
        board.appendChild(grid);
    }
}


//悔棋
function backPiece() {
    boardMask.removeChild(boardMask.lastElementChild);//删除棋盘最后一颗棋子
    pieceArray.pop();//删除存储的最后一颗棋子坐标
    pieceColorArray.pop();//删除存储的最后一颗棋子坐标和颜色信息
}

//开启计步
function stepInfo() {
    //为每一颗棋子设置索引
    for (var i = 0; i < boardMask.children.length; i++) {
        boardMask.children[i].style.lineHeight = "60px";
        boardMask.children[i].style.color = "red";
        boardMask.children[i].style.textAlign = "center";
        boardMask.children[i].innerHTML = i + 1;
    }
}

//人工智障
function pieceAI() {
    //设置[0,8]之间的随机数
    function getRandom(a, b) {
        return parseInt(Math.random() * (b - a + 1));
    }
    //随机获取棋子横坐标
    var AI_x = getRandom(0, 8);
    //随机获取棋子纵坐标
    var AI_y = getRandom(0, 8);
    //返回棋子坐标
    return [AI_x, AI_y];
}
