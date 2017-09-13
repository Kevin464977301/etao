/* 楼层导航 */
var floornav = function(){
	//左侧导航条的li
	var leftNavLis = document.getElementById("leftNav").getElementsByTagName("li");
	//得到所有楼层div，由于我们的楼层div没有放到同一个div里面，所以不好通过getElementsByTagName得到
	//那么我们就要遍历body的所有儿子，看看哪个儿子nodeType属性是1，并且有类型floor
	var floorArr = [];	//所有floor的div
	var floorOffsetTopArr = [];	//所有floor的offsetTop值
	for(var i = 0 ; i < document.body.childNodes.length ; i++){
		if(document.body.childNodes[i].nodeType == 1 && document.body.childNodes[i].className.indexOf("floor") != -1){
			floorArr.push(document.body.childNodes[i]);
			floorOffsetTopArr.push(document.body.childNodes[i].offsetTop);
		}
	}
	var floorArrLength = floorArr.length;
	//offsetTop这个数组，里面存放的是所有.floor楼层的offsetTop值，数组的最后一项应该就是最后一个楼层
	//的下边框距离页面顶部的距离。
	floorOffsetTopArr.push(floorArr[floorArrLength - 1].clientHeight + floorOffsetTopArr[floorArrLength - 1]);
	//当前楼层信号量，NaN表示不在任何楼层里
	var nowfloor = NaN;	
	//页面卷动事件
	window.onscroll = function(){
		//备份一下老楼层编号
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		//判断此时在第几个楼层，就相当于判断我们现在的卷动值在正序数组中的第几位
		for(var i = 0 ; i < floorArrLength ; i++){
			if(scrollTop >= floorOffsetTopArr[i] - 200 && scrollTop < floorOffsetTopArr[i + 1] - 200){
				//此时在第i层，但是我们为了防止动画、DOM操作频繁触发，仅当楼层编号发生变化的时候
				//再做里面的事情，验证i有没有变化
				if(i != nowfloor){
					!isNaN(nowfloor) && (leftNavLis[nowfloor].className = "");
					//更改信号量
					nowfloor = i;
					//让新的信号量加cur
					leftNavLis[nowfloor].className = "cur";
				}
				break;
			}
		}
	 	//如果在数组中没有找到合适的位置：
		if(i == floorArrLength){
			//老信号量这个人去掉cur
			!isNaN(nowfloor) && (leftNavLis[nowfloor].className = "");
			nowfloor = NaN;
		}
	}
	//左侧导航li的监听
	for(var i = 0 ; i < leftNavLis.length ; i++){
		leftNavLis[i].index = i;
		leftNavLis[i].onclick = function(){
			idx = this.index;
			scrollAnimate(floorOffsetTopArr[this.index],600);
		}
	}
	//窗口动画函数
	function scrollAnimate(target,time){
		var frameNumber = 0;	//帧编号
		var start = document.body.scrollTop || document.documentElement.scrollTop;	 //起点
		var distance = target - start;
		var interval = 10;
		var maxFrame = time / interval;
		clearInterval(timer);
		var timer = setInterval(function(){
			frameNumber++;
			if(frameNumber == maxFrame){
				clearInterval(timer);
			}
			//第一个参数t表示当前帧编号
			//第二个参数b表示起始位置
			//第三个参数c表示变化量
			//第四个参数d表示总帧数
			//返回当前帧应该在哪儿
			document.body.scrollTop = document.documentElement.scrollTop = CubicEaseInOut(frameNumber,start,distance,maxFrame);
		},10);
    function CubicEaseInOut(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    }
	}
}
/* 回到顶部 */
var backtops = function() {
	function BackToTop() {
		this.dom = null;
		this.init();
		this.bindEvent();
		this.bindScrollEvent();
	}
	BackToTop.prototype.init = function() {
		this.dom = document.querySelector('#backtotop');
	}
	BackToTop.prototype.bindScrollEvent = function() {
		var self = this;
		window.onscroll = function(){
		  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		  if (scrollTop > 500) {
			self.dom.style.display = 'block';
		  } else {
			self.dom.style.display = 'none';
		  }
		}
	}
	BackToTop.prototype.bindEvent = function() {
		 this.dom.onclick = function() {
		  scrollAnimate(0, 1000);
		}

		function scrollAnimate(target, timer) {
		  var interval = 20;
		  var frame = 0;
		  var frames = timer / interval;
		  var start = document.body.scrollTop || document.documentElement.scrollTop;
		  var distance = target - start;
		  var timer;
		  clearInterval(timer);
		  timer = setInterval(function(){
			frame++;
			if (frame >= frames) {
			  clearInterval(timer);
			}
			//第一个参数t表示当前帧
			//第二个b表示起始位置
			//第三个c表示变化量
			//第四个d表示总帧数
			document.body.scrollTop = document.documentElement.scrollTop = CubicEaseInOut(frame, start, distance, frames);
		  }, interval);

		  function CubicEaseInOut(t,b,c,d){
				if ((t/=d/2) < 1) return c/2*t*t*t + b;
				return c/2*((t-=2)*t*t + 2) + b;
			}
		}
	}
	var backtotop = new BackToTop();
}
/* 搜索框下得到商品分类 */
var show = function () {
	var oSearchCat = document.querySelector('#search-hot-list');
	myajax.get('http://h6.duchengjiu.top/shop/api_cat.php', {}, function(error, responseText){
		var json = JSON.parse(responseText);//返回的整个json对象
		var data = json.data;//json对象当中的data是一个数组
		for (var i = 0; i < data.length; i++) {
		  var obj = data[i];//数组里面的每一项是一个商品分类的对象
			oSearchCat.innerHTML += `<li><a href="classification.html?cat_id=${obj.cat_id}">${obj.cat_name}</a></li>`;
	  }
	});
}
/* 吸顶效果 */
var ceiling = function() {
	var nav = document.querySelector('#category');
	var topDis = getAllTop(nav);
	document.onscroll = function(e){
		var nowTop = document.documentElement.scrollTop || document.body.scrollTop;
		if (nowTop >= topDis) {
			nav.style.position = "fixed";
			nav.style.marginTop = -topDis + 'px';
		} else{
			nav.style.position = 'relative';
			nav.style.marginTop = 0;
		}
	};
	function getAllTop(obj) {
		var allTop = obj.offsetTop;
		while (obj = obj.offsetParent){
			allTop += obj.offsetTop;
		}
		return allTop;
	}
}

/*  */
/* 左侧轮播图 */
var sports = function () {
	var oCarousel = document.getElementById('left_carousel');
	var oSports = document.getElementById('m_sports');
	var oListUls = document.getElementsByTagName('ul')[3];
	var oList = oListUls.getElementsByTagName('li');
	var listlengths = oList.length;
	
	var index = 0;
	oListUls.innerHTML += oListUls.innerHTML;
	oCarousel.onmouseover = function() {
	  clearInterval(timer);
	}
	oCarousel.onmouseout = function(){
	  timer = setInterval(mover, 2000);
	}
	
	function mover() {
	  index++;
	  animate(oSports, {"left": -220 * index}, 800, function() {
	    if (index > listlengths - 1) {
	      index = 0;
	      this.style.left = "0px";
	    }
	  });
	}
	var timer;
	timer = setInterval(mover, 3000);
}
/* 右侧轮播图 */
var moves = function () {
	var oRolling = document.getElementById('rolling');
	var oMUnit = document.getElementById('m_unit');
	var oListUl = document.getElementsByTagName('ul')[4];
	var oLis = oListUl.getElementsByTagName('li');
	var listlength = oLis.length;
	
	var index = 0;
	oListUl.innerHTML += oListUl.innerHTML;
	
	oRolling.onmouseover = function() {
	  clearInterval(timer);
	}
	oRolling.onmouseout = function(){
	  timer = setInterval(move, 2000);
	}
	
	function move() {
	  index++;
	  animate(oMUnit, {"left": -750 * index}, 1000, function() {
	    if (index > listlength - 1) {
	      index = 0;
	      this.style.left = "0px";
	    }
	  });
	}
	var timer;
	timer = setInterval(move, 2000);
}
/* 商品分类ul */
var cats = function() {
	var oCat = document.querySelector('#category-cat');
	myajax.get('http://h6.duchengjiu.top/shop/api_cat.php', {},
	function(error,responseText){
		var json = JSON.parse(responseText);//返回整个json对象
		var data = json.data;//json对象当中的data是一个数组
		for (var i = 0; i < data.length; i++) {
			var obj = data[i];
			oCat.innerHTML +=`<li><a href="classification.html?cat_id=${obj.cat_id}">${obj.cat_name}</a></li>`;
		}
	});
}
/* 获取热门商品 */
var hotgoods = function() {
	var oGoods = document.querySelector('#hot-good');
	myajax.get('http://h6.duchengjiu.top/shop/api_goods.php', {}, function(err, responseText){
		var json = JSON.parse(responseText);
		console.log(json);
		var data = json.data;
		for (var i = 0; i < data.length; i++) {
			var obj = data[i];
			oGoods.innerHTML += `<li><a href="detail.html?goods_id=${obj.goods_id}">
				<div><img src="${obj.goods_thumb}"/></div>
				<div class='goods_name'>${obj.goods_name}</div>
				<div class='price'>¥${obj.price}</div></a>
			</li>`;
		}
	});
}

/* 获取家居商品 */
var  housegoods = function() {
	var oGoods = document.querySelector('#house-good');
	myajax.get('http://h6.duchengjiu.top/shop/api_goods.php?cat_id=45', {},function(error, responseText){
		var json = JSON.parse(responseText);
		console.log(json);
		var data = json.data;
		for (var i = 0; i < data.length; i++) {
			var obj = data[i];
			oGoods.innerHTML += `<li><a href="detail.html?goods_id=${obj.goods_id}">
				<div><img src='${obj.goods_thumb}'/></div>
				<div class='goods_name'>${obj.goods_name}</div>
				<div class='price'>¥${obj.price}</div></a>
			</li>`;
		}
	});
}
/* 获取家具商品 */
var  furnituregoods = function() {
	var oGoods = document.querySelector('#furniture-good');
	myajax.get('http://h6.duchengjiu.top/shop/api_goods.php?cat_id=55', {},function(error, responseText){
		var json = JSON.parse(responseText);
		console.log(json);
		var data = json.data;
		for (var i = 0; i < data.length; i++) {
			var obj = data[i];
			oGoods.innerHTML += `<li><a href="detail.html?goods_id=${obj.goods_id}">
				<div><img src='${obj.goods_thumb}'/></div>
				<div class='goods_name'>${obj.goods_name}</div>
				<div class='price'>¥${obj.price}</div></a>
			</li>`;
		}
	});
}
/* 获取文具商品 */
var  stationerygoods = function() {
	var oGoods = document.querySelector('#stationery-good');
	myajax.get('http://h6.duchengjiu.top/shop/api_goods.php?cat_id=62', {},function(error, responseText){
		var json = JSON.parse(responseText);
		console.log(json);
		var data = json.data;
		for (var i = 0; i < data.length; i++) {
			var obj = data[i];
			oGoods.innerHTML += `<li><a href="detail.html?goods_id=${obj.goods_id}">
				<div><img src='${obj.goods_thumb}'/></div>
				<div class='goods_name'>${obj.goods_name}</div>
				<div class='price'>¥${obj.price}</div></a>
			</li>`;
		}
	});
}
/* 获取数码商品 */
var  figuregoods = function() {
	var oGoods = document.querySelector('#figure-good');
	myajax.get('http://h6.duchengjiu.top/shop/api_goods.php?cat_id=69', {},function(error, responseText){
		var json = JSON.parse(responseText);
		console.log(json);
		var data = json.data;
		for (var i = 0; i < data.length; i++) {
			var obj = data[i];
			oGoods.innerHTML += `<li><a href="detail.html?goods_id=${obj.goods_id}">
				<div><img src='${obj.goods_thumb}'/></div>
				<div class='goods_name'>${obj.goods_name}</div>
				<div class='price'>¥${obj.price}</div></a>
			</li>`;
		}
	});
}
/* 获取童装产品 */
var childrengoods = function(){
	var oGoods = document.querySelector('#children-good');
	myajax.get('http://h6.duchengjiu.top/shop/api_goods.php?cat_id=125', {},function(error, responseText){
		var json = JSON.parse(responseText);
		console.log(json);
		var data = json.data;
		for (var i = 0; i < data.length; i++) {
			var obj = data[i];
			oGoods.innerHTML += `<li><a href="detail.html?goods_id=${obj.goods_id}">
				<div><img src='${obj.goods_thumb}'/></div>
				<div class='goods_name'>${obj.goods_name}</div>
				<div class='price'>¥${obj.price}</div></a>
			</li>`;
		}
	});
}
/* 获取所有商品 */
var showgoods = function () {
	var cat_id = getQueryString('cat_id');
	var oGood1 = document.querySelector('#allgoods');
  myajax.get('http://h6.duchengjiu.top/shop/api_goods.php?cat_id=45',{},
  (err,responseText) => {
    var json = JSON.parse(responseText);
    console.log(json);
    var data = json.data;
    //判断如果没有数据，则显示空的提示
    if (data.length === 0) {
      oGoods.innerHTML = "<center style='padding-top:100px;color:#999;font-size:30px;'>抱歉,暂时无商品出售,敬请期待!</center>";
      return;
    }
		for (var i = 0; i < data.length; i++) {
      var obj = data[i];
			oGood1.innerHTML += `<li><a href="detail.html?goods_id=${obj.goods_id}">
				<div><img src='${obj.goods_thumb}'/></div>
				<div class='goods_name'>${obj.goods_name}</div>
				<div class='price'>¥${obj.price}</div></a>
			</li>`;
		}
  });
  myajax.get('http://h6.duchengjiu.top/shop/api_goods.php?cat_id=55',{},
  (err,responseText) => {
    var json = JSON.parse(responseText);
    console.log(json);
    var data = json.data;
    //判断如果没有数据，则显示空的提示
    if (data.length === 0) {
      oGoods.innerHTML = "<center style='padding-top:100px;color:#999;font-size:30px;'>抱歉,暂时无商品出售,敬请期待!</center>";
      return;
    }
		for (var i = 0; i < data.length; i++) {
      var obj = data[i];
			oGood1.innerHTML += `<li><a href="detail.html?goods_id=${obj.goods_id}">
				<div><img src='${obj.goods_thumb}'/></div>
				<div class='goods_name'>${obj.goods_name}</div>
				<div class='price'>¥${obj.price}</div></a>
			</li>`;
		}
  });
  myajax.get('http://h6.duchengjiu.top/shop/api_goods.php?cat_id=62',{},
  (err,responseText) => {
    var json = JSON.parse(responseText);
    console.log(json);
    var data = json.data;
    //判断如果没有数据，则显示空的提示
    if (data.length === 0) {
      oGoods.innerHTML = "<center style='padding-top:100px;color:#999;font-size:30px;'>抱歉,暂时无商品出售,敬请期待!</center>";
      return;
    }
		for (var i = 0; i < data.length; i++) {
      var obj = data[i];
			oGood1.innerHTML += `<li><a href="detail.html?goods_id=${obj.goods_id}">
				<div><img src='${obj.goods_thumb}'/></div>
				<div class='goods_name'>${obj.goods_name}</div>
				<div class='price'>¥${obj.price}</div></a>
			</li>`;
		}
  });
  myajax.get('http://h6.duchengjiu.top/shop/api_goods.php?cat_id=69',{},
  (err,responseText) => {
    var json = JSON.parse(responseText);
    console.log(json);
    var data = json.data;
    //判断如果没有数据，则显示空的提示
    if (data.length === 0) {
      oGoods.innerHTML = "<center style='padding-top:100px;color:#999;font-size:30px;'>抱歉,暂时无商品出售,敬请期待!</center>";
      return;
    }
		for (var i = 0; i < data.length; i++) {
      var obj = data[i];
			oGood1.innerHTML += `<li><a href="detail.html?goods_id=${obj.goods_id}">
				<div><img src='${obj.goods_thumb}'/></div>
				<div class='goods_name'>${obj.goods_name}</div>
				<div class='price'>¥${obj.price}</div></a>
			</li>`;
		}
  });
}

/* 商品分类页 */
var showclass = function () {
	var cat_id = getQueryString('cat_id');
  var oGoods = document.querySelector('#hot-good');
  myajax.get('http://h6.duchengjiu.top/shop/api_goods.php',
  {cat_id: cat_id},
  (err,responseText) => {
    var json = JSON.parse(responseText);
    console.log(json);
    var data = json.data;
    //判断如果没有数据，则显示空的提示
    if (data.length === 0) {
      oGoods.innerHTML = "<center style='padding-top:100px;color:#999;font-size:30px;'>抱歉,暂时无商品出售,敬请期待!</center>";
      return;
    }
    for (var i = 0; i < data.length; i++) {
      var obj = data[i];
      oGoods.innerHTML += `<li><a href="detail.html?goods_id=${obj.goods_id}">
				<div><img src='${obj.goods_thumb}'/></div>
				<div class='goods_name'>${obj.goods_name}</div>
				<div class='price'>¥${obj.price}</div></a>
			</li>`;
    }
  });
}
