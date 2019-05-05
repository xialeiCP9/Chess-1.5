/**
 * 获取所有可行的走法
 */
(function(){
	window.gen = function(squares){
		var mvs = [];
		var pcSelfSide = SIDE_TAG(game.sm.board.pos.sdPlayer);
		var pcOppside = OPP_SIDE_TAG(game.sm.board.pos.sdPlayer);
		//遍历整个棋盘
		for(var sqSrc = 0 ; sqSrc < 256 ; sqSrc++){
			//不在真实棋盘上
			if(!IN_BOARD(sqSrc)){
				continue;
			}
			//根据棋子查询可行的走法
			var pcSrc = squares[sqSrc];
			//如果棋子不是本方棋子
			if((pcSrc & pcSelfSide) == 0){
				continue;
			}
			switch(pcSrc - pcSelfSide){
				case PIECE_KING: // 将
					/*console.log("将");*/
					var delta;
					for(var i=0;i<4;i++){
						delta = KING_DELTA[i];
						//沿着方向前进
						var sqDst = sqSrc + delta;
						
						//如果棋子位置不在九宫格上
						if(!IN_FORT(sqDst)){
							continue;
						}
						var pcDst = squares[sqDst];
						//如果棋子为空子或者为对方棋子
						if((pcDst & pcSelfSide) == 0){
							mvs.push(MOVE(sqSrc,sqDst));
							/*console.log(MOVE(sqSrc,sqDst));*/
						}
					}
					break;
				case PIECE_ADVISOR: //士
				/*console.log("士");*/
					var delta;
					for(var i=0;i<4;i++){
						delta = ADVISOR_DELTA[i];
						//沿着方向前进
						var sqDst = sqSrc + delta;
						var pcDst = squares[sqDst];
						//如果棋子位置不在九宫格上
						if(!IN_FORT(sqDst)){
							continue;
						}
						//如果棋子为空子或者为对方棋子
						if((pcDst & pcSelfSide) == 0){
							mvs.push(MOVE(sqSrc,sqDst));
							/*console.log(MOVE(sqSrc,sqDst));*/
						}
					}
					break;
				case PIECE_BISHOP: //象
					/*console.log("象");*/
					var delta;
					for(var i=0;i<4;i++){
						delta = ADVISOR_DELTA[i];
						//得到可能的象眼位置
						var sqEye = sqSrc + delta;
						//如果象眼位置棋子不为空
						if(squares[sqEye] != 0){
							continue;
						}
						//得到可能的终点
						var sqDst = sqEye + delta;
						//如果终点不在真实棋盘
						if(!IN_BOARD(sqDst)){
							continue;
						}
						//如果象跨河
						if(!SAME_HALF(sqSrc,sqDst)){
							continue;
						}
						var pcDst = squares[sqDst];
						//如果终点为对方棋子或者为空
						if((pcDst & pcSelfSide) == 0){
							mvs.push(MOVE(sqSrc,sqDst));
							/*console.log(MOVE(sqSrc,sqDst));*/
						}
					}
					break;
				case PIECE_KNIGHT: //马
					/*console.log("马");*/
					for(var i=0;i<4;i++){
						//马腿
						var leg = sqSrc + KING_DELTA[i];
						//马腿位置存在棋子
						if(squares[leg] != 0){
							continue;
						}
						//马腿位置没有棋子，马腿对应的两个方向
						for(var j=0;j<2;j++){
							var sqDst = sqSrc + KNIGHT_DELTA[i][j];
							if(!IN_BOARD(sqDst)){
								continue;
							}
							var pcDst = squares[sqDst];
							if((pcDst & pcSelfSide) == 0){
								mvs.push(MOVE(sqSrc,sqDst));
								/*console.log(MOVE(sqSrc,sqDst));*/
							}
						}
					}
					break;
				case PIECE_ROOK: //车
					/*console.log("车");*/
					var delta;
					for(var i=0;i<4;i++){
						delta = KING_DELTA[i];
						//沿着该向量前进
						var sqDst = sqSrc + delta;
						while(IN_BOARD(sqDst)){
							if(squares[sqDst] == 0){
								mvs.push(MOVE(sqSrc,sqDst));
								/*console.log(MOVE(sqSrc,sqDst));*/
							} else {
								var pcDst = squares[sqDst];
								if((pcDst & pcOppside) != 0){
									mvs.push(MOVE(sqSrc,sqDst));
									/*console.log(MOVE(sqSrc,sqDst));*/
								}
								break;
							}
							sqDst += delta;
						}
					}
					break;
				case PIECE_CANNON: //炮
					/*console.log("炮");*/
					var delta;
					for(var i=0;i<4;i++){
						delta = KING_DELTA[i];
						//沿着该向量前进
						var sqDst = sqSrc + delta;
						//在棋盘内
						while(IN_BOARD(sqDst)){
							//将空棋子记录到走法中
							if(squares[sqDst] == 0){
								mvs.push(MOVE(sqSrc,sqDst));
								/*console.log(MOVE(sqSrc,sqDst));*/
							} else {
								//遇到非空棋子，退出循环
								break;
							}
							sqDst += delta;
						}
						//此时棋子位置为非空棋子,继续向前走，直到遇到对方棋子
						sqDst += delta;
						while(IN_BOARD(sqDst)){
							var pcDst = squares[sqDst];
							if(pcDst > 0){
								//如果棋子为对方棋子
								if((pcDst & pcSelfSide) == 0){
									mvs.push(MOVE(sqSrc,sqDst));
									/*console.log(MOVE(sqSrc,sqDst));*/
								}
								break;
							}
							sqDst += delta;
						}
					}
					break;
				case PIECE_PAWN:
					/*console.log("兵");*/
					//前进一步，获得对应的位置
					var sqDst = SQUARE_FORWARD(sqSrc,game.sm.board.pos.sdPlayer);
					if(IN_BOARD(sqDst)){
						var pcDst = squares[sqDst];
						if((pcDst & pcSelfSide) == 0){
							mvs.push(MOVE(sqSrc,sqDst));
							/*console.log(MOVE(sqSrc,sqDst));*/
						}
					}
					//如果兵已过河
					if(AWAY_HALF(sqSrc,game.sm.board.pos.sdPlayer)){
						for(var i=-1;i<2;i+=2){
							sqDst = sqSrc + i;
							if(IN_BOARD(sqDst)){
								var pcDst = squares[sqDst];
								if((pcDst & pcSelfSide) == 0){
									mvs.push(MOVE(sqSrc,sqDst));
									/*console.log(MOVE(sqSrc,sqDst));*/
								}
							}
						}
					}
				break;
			}
		}
		return mvs;
	}
})()