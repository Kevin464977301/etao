var changepage = function (){
	var oBtnUp = document.querySelector('#btnUp');
	var oBtnDn = document.querySelector('#btnDn');
	var num=1;
	oBtnDn.addEventListener('click',function(event){
		event = event|| window.event;
		var val = parseInt(oBtnUp.value);
		num++;
		oBtnDn.value = num;
		oBtnUp.value = num;
		var cat_id = getQueryString('cat_id');
		var pagesize = 10;
		var page = getQueryString('page');
		var oGood1 = document.querySelector('#hot-good');
	  myajax.get('http://h6.duchengjiu.top/shop/api_goods.php',{cat_id: cat_id, pagesize: pagesize, page: num},
	  (err,responseText) => {
	    var json = JSON.parse(responseText);
	    var data = json.data; 
	    var counts = json.page.count;
	    var sum;
	    if (counts%pagesize != 0) {
	    	sum = parseInt(counts/pagesize + 1);
	    }else{
	    	sum = parseInt(counts/pagesize);
	    }
			if (num >= sum) {
				oBtnDn.style.visibility = 'hidden';
			}else{
				oBtnDn.style.visibility = 'visible';
			}
			if (num <= 1) {
				oBtnUp.style.visibility = 'hidden';
			}else{
				oBtnUp.style.visibility = 'visible';
			}
	    //判断如果没有数据，则显示空的提示
	    if (data.length === 0) {
	      return;
	    }
	    oGood1.innerHTML = '';
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
	oBtnUp.addEventListener('click',function(event){
		event = event|| window.event;
		var val = parseInt(oBtnDn.value);
		num--;
		var cat_id = getQueryString('cat_id');
		var pagesize = 10;
		var page = getQueryString('page');
		var oGood1 = document.querySelector('#hot-good');
	  myajax.get('http://h6.duchengjiu.top/shop/api_goods.php',{cat_id: cat_id, pagesize: pagesize, page: num},
	  (err,responseText) => {
	    var json = JSON.parse(responseText);
	    var data = json.data;
	    var counts = json.page.count;
	    var sum;
	    if (counts%pagesize != 0) {
	    	sum = parseInt(counts/pagesize + 1);
	    }else{
	    	sum = parseInt(counts/pagesize);
	    }
	    if (num >= sum) {
				oBtnDn.style.visibility = 'hidden';
			}else{
				oBtnDn.style.visibility = 'visible';
			}
			if (num <= 1) {
				oBtnUp.style.visibility = 'hidden';
			}else{
				oBtnUp.style.visibility = 'visible';
			}
	    //判断如果没有数据，则显示空的提示
	    if (data.length === 0) {
	      return;
	    }
	    oGood1.innerHTML = '';
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
