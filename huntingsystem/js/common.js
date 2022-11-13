
// url信息
var BASE_URL = "http://localhost:8080/";
var BASE_USER_URL = BASE_URL + 'user';
var JSON_URL = {
	user : {
		login : BASE_USER_URL + "/global/login",
		register : BASE_USER_URL + "/global/register",
		update_token : BASE_USER_URL + "/update/token",
		update_base : BASE_USER_URL + "/update/base",
		update_pswd : BASE_USER_URL + "/update/password",
	},
};

// 响应的code含义
var RESPONSE_CODE = {
	SUCCESS : 1,
	FAIL : 0,
	EMAIL_ERROR : 1000,
    PASSWORD_ERROR : 1001,
    ACCOUNT_FREEZE : 1002,
    REGISTRATION_ERROR : 1003,
    USER_NAME_ILLEGAL : 1004,
    UNKNOWN_ERROR : 2000,
    PARAMETER_ILLEGAL : 2001,
    TOKEN_INVALID : 2002,
    TOKEN_MISSION : 2005,
    REFRESH_TOKEN_INVALID : 2006,
    NO_OPERATION_PERMISSION : 2007,
}

// 存储当前全局状态值
var stateLog = {
	token_updating : false, // token正在更新
};

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
	var token = getToken();
	if (token != null) {
		var expTime = getTokenMsg(token).exp;
		var curTime = new Date().getTime() / 1000;
		config.headers['Authorization'] = token;
		if (stateLog.token_updating == false && expTime - curTime < 1000 * 60 * 10) { // 当前没有token更新操作，token还有十分钟过期
			stateLog.token_updating = true;
			axios.get(JSON_URL.user.update_token).catch(function (error) {
				stateLog.token_updating = false; // 若token更新失败，则打开更新token的权限
			});
		}
	}
	// config.headers['Content-Type'] = 'application/json;charset=utf-8';
	config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    return config;
}, function (error) {
	return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
	response = response.data;
	if (response.code == RESPONSE_CODE.TOKEN_INVALID || response.code == RESPONSE_CODE.TOKEN_MISSION) {
		window.location.href = "/login.html";
	} else if (response.token != null) {
		setToken(response.token);
		stateLog.token_updating = false;
	}
    return response;
}, function (error) {
    return Promise.reject(error);
});


function saveUser(user) {
	window.localStorage.setItem("user", JSON.stringify(user));
}

function getIndustryList() {
	// test
	return {
		"1" : {"name" : "啥也不是", "industryList" : {"1":"吃饭", "2" : "睡觉", "3" : "打豆豆", "4" : "没了", "5" : "真没了"}},
		"2" : {"name" : "啥也是", "industryList" : {"6":"吃饭10086", "7" : "睡觉10086", "8" : "打豆豆10086", "9" : "没了10086", "10" : "真没了10086"}},
		"3" : {"name" : "是的", "industryList" : {"11":"吃饭110", "12" : "睡觉110", "13" : "打豆豆110", "14" : "没了110", "15" : "真没了110"}},
	};


	var industryList = localStorage.getItem("industryList");
	if (industryList == null) {

	} else {return JSON.parse(industryList);}
}

// 获取用户信息
function getUser() {

	// test
	return {
		id : "12",
		email : "220@163.com",
		name : "xdx",
		age : 10,
		gender : "男",
		phone : "123456",
		roleName : "求职者",
		education : "全日制大专",
		hometown : "翻斗大街",
		introduce : "不喜欢介绍自己",
		skill : "啥都不会也是技能",
		interest : "喜欢偷懒",
	};


	var user = localStorage.getItem("user");
	if (user == null) return null;
	if (getToken() == null) {
		localStorage.removeItem("user"); // token过期，则删除用户信息
		return null;
	}
	return JSON.parse(user);
}

// 获取token，若token过期，则删除token
function getToken() {

	// test
	return "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjcwMDYyNjgsImV4cCI6MTk2NzAxMzQ2OCwiaWQiOiIxMiJ9.49btTx6OWDWnwEpKMh-peBRDMpHgSQerJeDGdg89klU";

	var token = localStorage.getItem("token");
	if (token != null) {
		var expTime = getTokenMsg(token).exp;
		var curTime = new Date().getTime() / 1000;
		if (expTime <= curTime) {
			removeToken();
			return null;
		}
	}
	return token;
}

function setToken(token) {
	localStorage.setItem("token", token);
}

function removeToken() {
	localStorage.removeItem("token");
}

function getTokenMsg(token) {
	return JSON.parse(decodeURIComponent(window.atob(token.split('.')[1].replace(/-/g, "+").replace(/_/g, "/"))));
}