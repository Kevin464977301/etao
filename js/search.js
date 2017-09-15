var searchtext = function(){
	var oSearch = document.querySelector("#search");
  oSearch.onkeyup = function(event) {
  	event = event || window.event;
    if (event.keyCode === 13) {
      location.href = 'search.html?search_text=' + this.value;
    }
  }
	var oSumbit = document.querySelector('#searchSubmit');
	oSumbit.onclick = function(event){
		if (oSearch.value != "") {
			location.href = 'search.html?search_text=' + oSearch.value;
		}
	}
}

var searchgoods = function(){
	var search_text = getQueryString('search_text');
  var oGoods = document.querySelector('#searchAllgoods');
  myajax.get('http://h6.duchengjiu.top/shop/api_goods.php',
  {search_text: search_text,pagesize : 20},
  function(err,responseText){
    var json = JSON.parse(responseText);
    console.log(json);
    var data = json.data;
    //如果没数据要给出提示
    if (data.length === 0) {
      oGoods.innerHTML = "未搜索到商品, <span id='second'>5</span>秒后跳回首页";
      var oSecond = oGoods.querySelector('#second');
      var timer = setInterval(() => {
        var second = parseInt(oSecond.innerText);
        oSecond.innerText = --second;
      }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      location.href = 'index.html';
    }, 5000);
      return;
    }
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

var searchload = function(){
	var oInputs = document.querySelector('#page1');
	oInputs.addEventListener('click',function(event){
		event = event|| window.event;
		var search_text = getQueryString('search_text');
		var val = parseInt(this.value);
		var num;
		num = ++val;
		oInputs.value = num;
		var cat_id = 45;
		var pagesize = 20;
		var page = getQueryString('page');
		var oGood1 = document.querySelector('#searchAllgoods');
	  myajax.get('http://h6.duchengjiu.top/shop/api_goods.php',{ search_text: search_text, pagesize: pagesize, page: num},
	  (err,responseText) => {
	    var json = JSON.parse(responseText);
	    console.log(json);
	    console.log(search_text);
	    var data = json.data;
	    //判断如果没有数据，则显示空的提示
	    if (data.length === 0) {
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
	});
}
