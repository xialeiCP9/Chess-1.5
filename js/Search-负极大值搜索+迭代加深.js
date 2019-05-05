/**
 * 搜索函数
 * 生成电脑自动下子的走法
 */
(function(){
	var MINMAXDEPTH = 3;//最大搜索深度
	var MATE_VALUE = 10000;
	var millis = 100; //最大搜索时间
	var Search = window.Search = function(pos){
		this.pos = pos;
	}
	Search.prototype.searchMain = function(){
		this.mvResult = 0; 	// 搜索出的走法
		var alpha = -MATE_VALUE,beta = MATE_VALUE;
		//this.negaMaxSearch(MINMAXDEPTH,alpha,beta);	// 调用极大极小搜索算法
		var time = new Date().getTime();
		var depth = 1;
		while(new Date().getTime() - time < millis){
			var value = this.negaMaxSearch(depth++,alpha,beta);
			if(depth > MINMAXDEPTH){
				break;
			}
			//如果分出了胜负，也退出
			if(value > WIN_VALUE || value < -WIN_VALUE){
				break;
			}
		}
		return this.mvResult;	// 返回搜索结果
	}
	Search.prototype.negaMaxSearch = function(depth,alpha,beta){
		//到达根节点
		if(depth == 0){
			return this.pos.evaluate();
		}
		//获取所有可行走法
		var mvs = gen(this.pos.squares);
		//分数
		var vl = 0;
		var mv;
		for(var i = 0 ; i < mvs.length ; i++){
			//尝试走这个走法
			mv = mvs[i];
			if(!this.pos.makeMove(mv))
				continue;
			//执行极小值搜索
			vl = -this.negaMaxSearch(depth - 1,-beta,-alpha);
			//撤销走法
			this.pos.undoMakeMove();
			//得到大于beta的值，则返回beta，并截断这个分支
			if(vl >= beta){
				return beta;
			}

			if(vl > alpha){
				alpha = vl;
				//到达根节点,记录走法
				if(depth == MINMAXDEPTH){
					this.mvResult = mv;
				}
			}
		}
		return alpha; //返回当前节点的最优值
	}
})()