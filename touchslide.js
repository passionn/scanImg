var slide = function(option) {
	this.option = option;
	this.init();
};
slide.prototype = {
	init: function() {
		this.wrap = this.option.dom;
		this.list = this.option.list;
		this.index = this.option.index || 0;
		this.autoplay=this.option.autoplay||false;
		this.timedely=this.option.timedely||3000;
		this.trrigerCls=this.option.trrigerCls;
		this.trrigerCur=this.option.trrigerCur||'cur';
		//手指的开始位置；
		this.startPos = {
				x: 0,
				y: 0,
				stime:new Date()
			}
		//手指一移动的距离；
		this.moveDes = {
			x: 0,
			y: 0
		}

		this.renderDom();
		this.bindEvent();
		
	},
	renderDom: function() {
		this.width= this.wrap.getBoundingClientRect().width;
		for (var i = 0, len = this.list.length; i < len; i++) {
			this.list[i].style.width = this.width + "px";
		}
		this.container=this.wrap.children[0];
		this.container.style.width = this.width * this.list.length + "px";
		this.container.style.webkitTransform = 'translate3d(0,0,0)';
	},
	bindEvent: function() {
		var self = this;
			
		this.container.addEventListener('touchstart', this, false);
		this.container.addEventListener('touchmove', this, false);
		this.container.addEventListener('touchend', this, false);
		this.container.addEventListener('touchcancel', this, false);
		this.container.addEventListener('webkitTransitionEnd', function(){
		}, false);

		window.onresize=function(){
			self.resize();
		}

		if(self.autoplay){
			var time=setInterval(function(){
				self.autoRun();
			} ,self.timedely);
		}else{

		}

	},
	handleEvent:function(e){
		switch (e.type){
			case 'touchstart':
				this.touchstart(e);
				break;
			case 'touchmove':
				this.touchmove(e);
				break;
			case 'touchend':
				this.touchend(e);
				break;
		}

	},
	touchstart: function(e) {
		this.startPos.x = e.touches[0].pageX;
		this.startPos.y = e.touches[0].pageY;
		this.startPos.stime=new Date();
		this.container.style.webkitTransition = '-webkit-transform 0s ease-out';
	},
	touchmove: function(e) {
		e.preventDefault();
		var x = e.targetTouches[0].pageX,
			y = e.targetTouches[0].pageY;
		this.moveDes.x = x - this.startPos.x;
		/*计算欢动到左边的距离*/
		var	left = -this.width * this.index + this.moveDes.x;

		this.container.style.webkitTransform = 'translate3d(' + left + 'px,0,0)';
	},
	touchend: function(e) {
		this.getCurrent();
		
		this._next.call(this,'');

		this.setTrriger.call(this,'');
	},
	getCurrent: function() {
		var self = this,
			etime=new Date();

		if (Math.abs(self.moveDes.x) > self.width / 6 ||(etime-self.startPos.stime)<200) {
			if (self.moveDes.x > 0) {
				self.index > 0 ? self.index-- : 0;
			} else {
				self.index >= self.list.length - 1 ? self.index = self.list.length - 1 : self.index++;
			}
		}
	},
	_next:function(){
		var self=this;
		self.container.style.webkitTransition='-webkit-transform 0.2s ease-out';
		self.container.style.webkitTransform='translate3d(-'+self.width * self.index + 'px,0,0)';
	},
	setTrriger:function(){
		var self=this;
		for(var i=0;i<self.trrigerCls.length;i++){
			self.trrigerCls[i].className="";
		}
		self.trrigerCls[self.index].className="cur";

	},
	autoRun:function(){
		var self=this;
		self.index++;
		if(self.index>=self.list.length){
			self.index=0;
		}
		self._next();
		self.setTrriger();
	},
	/**
	 *   改变窗口的大小时相应页面大小;
	 */
	resize: function() {
		this.renderDom();
	}
};