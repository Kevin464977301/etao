var registername = function () {
	var oUsername = document.querySelector('input[name=username]');
	var oPassword = document.querySelector('input[name=password]');
	var oSubimit = document.querySelector('input[type=submit]');
	var oPasswords = document.querySelector('input[type=opsswords]');
	oSubimit.onclick = function(){
		myajax.post('http://h6.duchengjiu.top/shop/api_user.php',
		{
			status:'register',
			username:oUsername.value,
			password:oPassword.value,
		},
		function(err,responseText){
			var json = JSON.parse(responseText);
			console.log(json);
		});
	}
}
