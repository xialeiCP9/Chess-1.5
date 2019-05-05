/**
 * 场景管理器
 * 分为以下场景
 * 0、欢迎界面
 * 1、开始界面
 * 2、游戏界面
 * 3、结束界面
 */
(function(){
	var SceneManager = window.SceneManager = function(){
		this.sceneNumber = 0;
		this.board = new Board();
		this.whoIsFirst = 0;
		//下方的两个按钮是否可以点击
		this.canClickBtn = false;
		this.bindEvent();
	}

	//根据场景号，判断应该做什么
	SceneManager.prototype.render = function(){
		var self = this;
		switch(this.sceneNumber){
			case 1:
				game.ctx.clearRect(0,0,game.canvas.width,game.canvas.height);
				//设置画布透明度,实现遮布
				game.ctx.save();
				game.ctx.globalAlpha = 0.6;
				game.ctx.fillStyle = "#999";
				game.ctx.fillRect(0,0,game.canvas.width,game.canvas.height);
				game.ctx.restore();
				//弹出模态框，选择先手
				initModal("先手是谁？","我","电脑",function(result){
					//开始游戏
					self.whoIsFirst = result;
					//设置开始按钮不可用，认输和悔棋按钮可用
					game.startBtn.className += " disabled";
					game.giveBtn.className = "give";
					game.retractBtn.className = "retract";
					self.enter(2);
				});
				break;
			case 2: //开始游戏，此时要绘制棋盘的棋子
				this.board.restart();
				break;
			case 3: //游戏结束,根据此时的输赢，判断提示内容
				alert("你赢了");
				this.sceneNumber = 0;
				//设置开始按钮可用，认输和悔棋按钮不可用
				game.startBtn.className = "start";
				game.giveBtn.className += " disabled";
				game.retractBtn.className = " disabled";
		}
	}

	SceneManager.prototype.enter = function(num){
		this.sceneNumber = num;
		this.render();
	}

	//绑定事件
	SceneManager.prototype.bindEvent = function(){
		var self = this;
		//按钮点击事件
		game.startBtn.onclick = function(){
			//在场景0的时候，开始按钮才可用
			if(self.sceneNumber != 0){
				return;
			}
			//进入场景一
			self.enter(1);
		}
		game.giveBtn.onclick = function(){
			if(self.sceneNumber != 2 || self.board.busy){
				return;
			}
			//弹出模态框,询问是否要放弃
			initModal("要放弃吗？","溜了溜了","还能再战",function(result){
				console.log("click give");
				if(result === 0){
					self.enter(3);
				} else {
					return;
				}
			});
		}
		game.retractBtn.onclick = function(){
			if(self.board.busy || self.sceneNumber != 2){
				return;
			}
			self.board.retract();
		}
		//canvas点击、移动事件
		game.canvas.onmousemove = function(event){
			if(self.board.busy || self.sceneNumber != 2){
				return;
			}
			var pos = Util.getPos(document.querySelector(".box"),event);
			var mx = parseInt(pos.x / 57) + 3,my = parseInt(pos.y / 57) + 3;
			var p = COORD_XY(mx,my);
			if(!IN_BOARD(p)){
				return;
			}
			self.board.mousemove = p;
			self.board.flushBoard();
		}
		game.canvas.onclick = function(event){
			if(self.board.busy || self.board.pos.sdPlayer == self.board.computer || self.sceneNumber != 2){
				return;
			}
			var pos = Util.getPos(document.querySelector(".box"),event);
			var mx = parseInt(pos.x / 57) + 3,my = parseInt(pos.y / 57) + 3;
			//获取点击的位置
			var p = COORD_XY(mx,my);
			
			if(!IN_BOARD(p)){
				return;
			}
			//获取点击的棋子
			var pc = self.board.pos.squares[p];
		
			//判断点击的棋子是否是本方棋子
			if((pc & SIDE_TAG(self.board.pos.sdPlayer)) != 0){
				//是点击的己方棋子，则直接赋值
				self.board.sqSelected = p;
				//刷新界面
				self.board.flushBoard();
			} else { //不是本方的棋子，则说明是对方棋子，或者是空子
				var mv = MOVE(self.board.sqSelected,p);
				self.board.addMove(mv,false);
				
				/*self.board.response();*/
			}
		}
	}

	var shade = document.querySelector(".shade");
	var modal = document.querySelector(".modal");		
	var body = modal.querySelector(".modal-body");
	var head = modal.querySelector(".modal-head");
	var firstBtn = document.querySelector("#first");
	var secondBtn = document.querySelector("#second");

	//初始化模态框，添加模态框事件
	function initModal(title,firstText,secondText,callback){

		head.innerText = title;
		firstBtn.innerText = firstText;
		secondBtn.innerText = secondText;
		//添加监听
		body.onclick = function(event){
			var event = event || window.event;
			var result = +event.target.getAttribute("data-selected");
			//关闭modal
			shade.style.display = "none";

			callback && callback(result);
		};
		shade.style.display = "block";
	}
})();