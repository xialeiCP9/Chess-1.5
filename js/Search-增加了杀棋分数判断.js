/**
 * 搜索函数
 * 生成电脑自动下子的走法
 */
(function(){
	var MINMAXDEPTH = 64;//最大搜索深度
	var millis = 100; //最大搜索时间
	var Search = window.Search = function(pos){
		this.pos = pos;
	}
	Search.prototype.searchMain = function(){
		this.mvResult = 0; 			// 搜索出的走法
  		this.pos.distance = 0;		// 初始化搜索深度
		var alpha = -MATE_VALUE,beta = MATE_VALUE;
		//this.negaMaxSearch(MINMAXDEPTH,alpha,beta);	// 调用极大极小搜索算法
		var time = new Date().getTime();
		for(var i = 1 ; i < MINMAXDEPTH ; i++){
			var t = new Date().getTime() - time;
			if(t > millis){
				break;
			}
			var value = this.negaMaxSearch(i,alpha,beta);
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
		var vlBest = -MATE_VALUE; // 如果vlBest已经是最好的分数，此时说明该走法已经是杀棋
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
			if(vl > vlBest){ //当前值大于上一次的最好值，则取当前值
				vlBest = vl;
				//如果当前值比beta大，则说明要进行截断
				if(vl >= beta){
					break;
				}
				if(vl > alpha){ // 找到一个PV走法
					alpha = vl;  // 缩小Alpha-Beta边界
					//已到达根节点，记录走法
					if(this.pos.distance == 0){
						this.mvResult = mv;
					}
				}
			}
		}
		//如果此时的最好值为-MATE_VALUE，则说明该走法为杀棋，可以根据走法深度对该走法进行评分
		if(vlBest == -MATE_VALUE){
			return this.pos.mateValue();
		}
		return vlBest; //返回当前节点的最优值
	}
})()