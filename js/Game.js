/**
 * 中介者类
 * 1、资源读取
 */
(function(){
	var Game = window.Game = function(id){
		this.canvas = document.querySelector(id);
		this.ctx = this.canvas.getContext("2d");
		this.thinking = document.querySelector(".thinking");
		this.startBtn = document.querySelector("#start");
		this.giveBtn = document.querySelector("#give");
		this.retractBtn = document.querySelector("#retract");
		//所有资源图片的集合
		this.R = {};
		this.init();
	}
	//初始化，设置canvas宽、高
	Game.prototype.init = function(){
		this.canvas.width = 521;
		this.canvas.height = 577;
		//设置“等待”图片的位置
		this.thinking.style.left = (this.canvas.width - 32) / 2 + "px";
		this.thinking.style.top = (this.canvas.height - 32) * (1 - 0.618) + "px";

		var self = this;

		this.loadAllResources("R.json",function(){
			self.start();
		});
	}
	//开始游戏，先读取资源文件，然后开始
	Game.prototype.start = function(){
		this.sm = new SceneManager();
		this.sm.render();
	}
	//读取资源文件
	Game.prototype.loadAllResources = function(file,callback){
		var xhr;
		var self = this;
		if(window.XMLHttpRequest){
			xhr = new XMLHttpRequest();
		} else {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xhr.onreadystatechange = function(){
			if(xhr.status == 200 && xhr.readyState == 4){
				var result = JSON.parse(xhr.responseText);

				var images = result.images;
				var len = images.length;
				var count = 0;
				for(var i=0;i<len;i++){
					self.R[images[i]["name"]] = new Image();
					self.R[images[i]["name"]].src = images[i]["url"];
					self.R[images[i]["name"]].onload = function(){
						count++;
						var text = "正在加载 " + count + "/" + len + ",请稍后...";
						self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
						self.ctx.textAlign = "center";
						self.ctx.font = "15px 微软雅黑";
						self.ctx.fillText(text,self.canvas.width / 2,self.canvas.height * (1 - 0.618));
						if(count >= len){
							console.log("加载完毕");
							self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
							callback && callback();
						}
					}	
				}
			}
		}
		xhr.open("get",file);
		xhr.send(null);
	}
})()