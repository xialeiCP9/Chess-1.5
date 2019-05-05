/**
 * 对历史表进行排序
 */
function MoveSort(historyTable,pos){
	this.historyTable = historyTable;
	this.pos = pos;
	//当前选择的走法下标
	this.index = 0;
	//全部走法数组
	this.mvs = [];
	//走法在历史表中对应的值数组
	this.vls = [];
	//生成全部走法
	var mvAll = gen(this.pos.squares);
	for(var i = 0 ; i < mvAll.length ; i++){
		var mv = mvAll[i];
		if(!this.pos.makeMove(mv)){
			continue;
		}
		this.pos.undoMakeMove();
		//如果该走法不会导致将军，则记录该走法
		this.mvs.push(mv);
		//记录走法在历史表中对应的值
		this.vls.push(this.historyTable[this.pos.historyIndex(mv)]);
	}
	//根据历史表中的走法和值，进行排序
	shellSort(this.mvs,this.vls);
}

MoveSort.prototype.next = function(){
	if(this.index < this.mvs.length){
		var mv = this.mvs[this.index];
		this.index++;
		return mv;
	}
	return 0;
}

// 希尔排序
var SHELL_STEP = [0, 1, 4, 13, 40, 121, 364, 1093];
function shellSort(mvs, vls) {
  var stepLevel = 1;
  while (SHELL_STEP[stepLevel] < mvs.length) {
    stepLevel ++;
  }
  stepLevel --;
  while (stepLevel > 0) {
    var step = SHELL_STEP[stepLevel];
    for (var i = step; i < mvs.length; i ++) {
      var mvBest = mvs[i];
      var vlBest = vls[i];
      var j = i - step;
      while (j >= 0 && vlBest > vls[j]) {
        mvs[j + step] = mvs[j];
        vls[j + step] = vls[j];
        j -= step;
      }
      mvs[j + step] = mvBest;
      vls[j + step] = vlBest;
    }
    stepLevel --;
  }
}