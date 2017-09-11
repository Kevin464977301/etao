//判断用户名如果存在, 则显示用户名并显示退出按钮, 否则显示注册和登录
if (localStorage.username) {
  var oUsername = document.querySelector('a[name=username]');
  var oLogout = document.querySelector('.logout');
  oUsername.innerText = localStorage.username;
  oUsername.style.display = 'inline';
  oLogout.style.display = 'inline';
} else {
  var oRegister = document.querySelector('.register');
  var oLogin = document.querySelector('.login');
  oRegister.style.display = 'inline';
  oLogin.style.display = 'inline';
}