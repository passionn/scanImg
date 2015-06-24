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
		var self = this,
			touchstart = function(e) {
				self.touchstart.call(self, e, self);
			},
			touchmove = function(e) {
				self.touchmove.call(self, e, self);
			},
			touchend = function(e) {
				self.touchend.call(self, e, self);
			}

		this.container.addEventListener('touchstart', touchstart, false);
		this.container.addEventListener('touchmove', touchmove, false);
		this.container.addEventListener('touchend', touchend, false);
		this.container.addEventListener('touchcancel', touchend, false);
		this.container.addEventListener('webkitTransitionEnd', function(){
			console.log("hello!!");
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
	touchstart: function(e, obj) {
		obj.startPos.x = e.touches[0].pageX;
		obj.startPos.y = e.touches[0].pageY;
		obj.startPos.stime=new Date();
		obj.container.style.webkitTransition = '-webkit-transform 0s ease-out';
	},
	touchmove: function(e, obj) {
		e.preventDefault();
		var x = e.targetTouches[0].pageX,
			y = e.targetTouches[0].pageY;
		obj.moveDes.x = x - obj.startPos.x;
		var	left = -obj.width * obj.index + obj.moveDes.x;

		obj.container.style.webkitTransform = 'translate3d(' + left + 'px,0,0)';
	},
	touchend: function(e, obj) {
		obj.getCurrent();
		
		obj._next.call(obj,'');

		obj.setTrriger.call(obj,'');
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