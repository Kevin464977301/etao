var loginname = function () {
	var oUsername = document.querySelector('input[name=username]');
  var oPassword = document.querySelector('input[name=password]');
  var oBtn = document.querySelector('input[type=button]');
  oBtn.onclick = function() {
    //js校验
    //直接调用登录的接口
    myajax.post('http://h6.duchengjiu.top/shop/api_user.php',
    {
      status: 'login',
      username: oUsername.value,
      password: oPassword.value
    }, function(error, responseText){
      var json = JSON.parse(responseText);
      localStorage.token = json.data.token;
      localStorage.username = json.data.username;
      if (localStorage.backurl) {
      	location.href = localStorage.backurl;
      } else{
      	location.href = 'index.html';
      }
    });
  }
}
