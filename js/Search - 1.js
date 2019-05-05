/**
 * 搜索函数
 * 生成电脑自动下子的走法
 */
(function(){
	var MINMAXDEPTH = 3;
	var MATE_VALUE = 10000;
	var Search = window.Search = function(pos){
		this.pos = pos;
	}
	Search.prototype.searchMain = function(){
		this.mvResult = 0; 	// 搜索出的走法
		this.maxMinSearch();	// 调用极大极小搜索算法

		return this.mvResult;	// 返回搜索结果
	}
	Search.prototype.maxMinSearch = function(){
		if(this.pos.sdPlayer == COMPUTER){ //电脑走棋，调用极小值点
			this.minSearch(MINMAXDEPTH);
		} else {
			this.maxSearch(MINMAXDEPTH);
		}
	}
	Search.prototype.maxSearch = function(depth){
		//到达根节点
		if(depth == 0){
			return this.pos.evaluate();
		}
		//获取所有可行走法
		var mvs = gen(this.pos.squares);
		//分数
		var vl = 0,best = -MATE_VALUE;
		for(var i = 0 ; i < mvs.length ; i++){
			//尝试走这个走法
			if(!this.pos.makeMove(mvs[i]))
				continue;
			//执行极小值搜索
			vl = this.minSearch(depth - 1);
			//撤销走法
			this.pos.undoMakeMove();
			if(vl > best){
				best = vl;
				//到达根节点,记录走法
				if(depth == MINMAXDEPTH){
					this.mvResult = mvs[i];
				}
			}
		}
		return best; //返回当前节点的最优值
	}
	Search.prototype.minSearch = function(depth){
		//到达叶子节点
		if(depth == 0){
			return this.pos.evaluate();
		}
		//获取所有可行走法
		var mvs = gen(this.pos.squares);
		//分数
		var vl = 0,best = MATE_VALUE;
		for(var i = 0 ; i < mvs.length ; i++){
			//尝试走这个走法
			if(!this.pos.makeMove(mvs[i]))
				continue;
			//执行极小值搜索
			vl = this.maxSearch(depth - 1);
			//撤销走法
			this.pos.undoMakeMove();
			//查找最小值
			if(vl < best){
				best = vl;
				//到达根节点,记录走法
				if(depth == MINMAXDEPTH){
					this.mvResult = mvs[i];
				}
			}
		}
		return best; //返回当前节点的最优值
	}
})()