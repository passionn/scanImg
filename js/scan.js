(function() {
	var touchSlide = function(options) {
		this.options = options;
		this.init();
		this.renderHTML();
		this.bindEvent();
	};
	touchSlide.prototype = {
		init: function() {
			var opts = this.options;
			//
			this.wrap = opts.dom;
			//
			this.data = opts.data;

			this.isloop = opts.isloop || false;

			//slide end callback;
			this.onslideend = opts.onslideend;

			this.width = this.wrap.clientWidth;
			this.height = this.wrap.clientHeight;

			//比例
			this.ratio = this.height / this.width;

			this.scale = this.isVertical ? this.height : this.width;

			this.slideIndex = opts.slideIndex || 0;

			//手指的开始位置；
			this.startPos = {
					x: 0,
					y: 0,
					stime: new Date()
				}
				//手指一移动的距离；
			this.moveDes = {
				x: 0,
				y: 0
			}
		},
		animateFun: function(dom, scale, i, offset) {
			dom.style.webkitTransform = 'translate3d(' + (offset + scale * (i - 1)) + 'px, 0, 0)';
			//dom.style.webkitTransform = 'translate3d(0 ,'+ (offset + scale * (i - 1)) + 'px, 0)';
		},
		preloadImg: function(dataIndex) {
			var self = this,
				len = self.data.length;
			var loadImg = function(index) {
				if (index < 0 || self.data[index].loaded) return;
				var img = new Image();
				img.src = self.data[index].img;
				img.onload = function() {
					self.data[index].width = img.width;
					self.data[index].height = img.height;
					self.data[index].loaded = true;
				}
			}
			if (len > 3) {
				var nextImg = dataIndex + 2 > len - 1 ? (dataIndex + 2) % len : dataIndex + 2;
				var preImg = dataIndex - 2 < 0 ? (dataIndex - 2) % len : dataIndex - 2;
				loadImg(nextImg);
				loadImg(preImg);
			}
		},
		renderHTML: function() {
			this.wrap && (this.wrap.innerHTML = '');
			var ul = document.createElement('ul');
			ul.className = 'islider-outer';
			ul.style.cssText = "height:" + this.height + "px; width:" + this.width + "px";
			// store li elements ,only  store 3 elements to reduce memory uaage;
			this.els = [];
			for (var i = 0; i < 3; i++) {
				var li = document.createElement('li');
				li.className = 'islide-item';
				li.style.cssText = 'height:' + this.height + 'px;' + 'width:' + this.width + 'px';
				this.els.push(li);

				this.renderItem(li, i - 1 + this.slideIndex);


				this.animateFun(li, this.scale, i, 0);

				ul.appendChild(li);
			}
			this.wrap.appendChild(ul);
			this.preloadImg(this.slideIndex);

		},
		renderItem: function(el, i) {
			var self = this,
				len = this.data.length,
				item;
			var insertHtml = function() {
				var html = item.height / item.width > self.ratio ? '<p>' + item.describe + '</p><div><img height="' + self.height + '" src="' + item.img + '"/></div>' : '<p>' + item.describe + '</p><div><img width="' + self.width + '" src="' + item.img + '" /></div>';
				//var html = item.height / item.width > self.ratio ? '<img height="' + self.height + '" src="' + item.img + '"/>' : '<img width="' + self.width + '" src="' + item.img + '" />';

				el.innerHTML = html;
			};

			item = self.data[i] || {
				empty: true
			};
			//图片循环轮播；
			if (this.isloop) {
				if (i < 0) {
					item = this.data[len + i];
				} else if (i > len - 1) {
					item = this.data[i - len];
				} else {
					item = this.data[i];
				}
			}

			if (item.empty) {
				el.innerHTML = "";
				return;
			}

			if (item.width && item.height) {
				insertHtml();
			} else {
				var currentImg = new Image();
				currentImg.src = item.img;
				currentImg.onload = function() {
					item.height = currentImg.height;
					item.width = currentImg.width;
					insertHtml();
				}
			}


		},
		slideTo: function(index) {
			var data = this.data;
			var ele;
			var forward = index - this.slideIndex;
			/*if (Math.abs(forward) > 1) {
		    	var nextEls = n > 0 ? this.els[2] : this.els[0];
		    	this.renderItem(nextEls, index);
		    }*/
			this.preloadImg(index);

			if (this.data[index]) {
				this.slideIndex = index;
			} else {
				if (this.isloop) {
					this.slideIndex = forward > 0 ? 0 : data.length - 1;
				} else {
					this.slideIndex = this.slideIndex;
					forward = 0;
				}
			}

			//判断往左移动还是往右移动；
			if (forward > 0) {
				ele = this.els.shift();
				this.els.push(ele);
			} else if (forward < 0) {
				ele = this.els.pop();
				this.els.unshift(ele);
			}
			//重新渲染 列表；
			if (forward !== 0) {
				if (Math.abs(forward) > 1) {
					this._renderItem(this.els[0], index - 1);
        			this._renderItem(this.els[2], index + 1);

				} else if (Math.abs(forward) === 1) {
					this.renderItem(ele, this.slideIndex + forward);
				}
			}

			for (var i = 0; i < 3; i++) {
				var item = this.els[i];
				if (item != ele) {
					item.style.webkitTransition = "all 0.2s";
				}
				this.animateFun(item, this.scale, i, 0);
			}

			this.onslideend && this.onslideend(this.slideIndex);

		},
		handleEvent: function(e) {
			switch (e.type) {
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
			this.isMoveing = true;
			this.startPos.x = e.touches[0].pageX;
			this.startPos.y = e.touches[0].pageY;
			this.startPos.stime = new Date();
		},
		touchmove: function(e) {
			e.preventDefault();
			if (!this.isMoveing) {
				return;
			}

			var len = this.data.length;
			this.moveDes.x = e.targetTouches[0].pageX - this.startPos.x;
			this.moveDes.y = e.targetTouches[0].pageY - this.startPos.y;
			for (var i = 0; i < 3; i++) {
				var item = this.els[i];
				item.style.webkitTransition = "all 0s";
				this.animateFun(item, this.scale, i, this.moveDes.x);
			}

		},
		touchend: function(e) {
			this.isMoveing = false;
			var offset = this.moveDes;
			var endtime = new Date();

			if (Math.abs(this.moveDes.x) > 40 || (Math.abs(this.moveDes.x) > 20 && (endtime - this.startPos.x) < 200)) {
				if (this.moveDes.x > 0) {
					this.slideTo(this.slideIndex - 1);
				} else {
					this.slideTo(this.slideIndex + 1);
				}
			} else {
				this.slideTo(this.slideIndex);
			}

			this.moveDes.x = this.moveDes.y = 0;

		},
		bindEvent: function() {
			var content = this.wrap;
			content.addEventListener('touchstart', this, false);
			content.addEventListener('touchmove', this, false);
			content.addEventListener('touchend', this, false);
		}
	}

	window.touchSlide = touchSlide;

})(window);

(function() {

	var wrap = document.getElementById('wrap'),
		pageIndex = document.querySelectorAll('.pagenum span')[0],
		pagenum = document.querySelectorAll('.pagenum')[0],
		goback = document.querySelectorAll('.pagenum a')[0];
	var slide = new touchSlide({
		dom: wrap,
		data: data,
		isloop: true,
		isVertical:true,
		slideIndex:3
	});

	slide.onslideend = function(index) {
		pageIndex.innerHTML = index + 1 + "/" + data.length;
		pagenum.style.display = "none";
	}

	wrap.onclick = function() {
		pagenum.style.display = "block";
	}

	goback.onclick = function() {
		history.back();
	}


})();