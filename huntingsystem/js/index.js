jQuery(document).ready(function ($) {

    $("#content").load("font.html");

    var commonUser = getUser();

    if (commonUser == null) {
        $("#leftdiv").load("leftmenuCommon.html");
    } else if ("求职者" == commonUser.roleName) {
        $("#leftdiv").load("leftmenuCommon.html");
    } else if ("企业" == commonUser.roleName) {
		if (commonUser.isManager == '1') {
			$("#leftdiv").load("leftmenuCompany.html");
		} else {
			$("#leftdiv").load("leftmenuHr.html");
		}
    } else if ("管理员" == commonUser.roleName) {
        $("#leftdiv").load("leftmenuAdmin.html");
    }

    var headerVue = new Vue({
        el : "#header",
        data : {
            user : commonUser,
			imgUrl : "img/admin.jpg",
        },
		created () {
			this.loadIco();
		},
		watch : {
			user () {
				this.loadIco();
			},
		},
        computed : {
            login() {
                return this.user != null;
            },
        },
		methods : {
			logout() {
				if (confirm("确定退出登录？你的登录信息将被删除!")) {
					removeToken();
					window.location.href = "login.html";
				}
			},
			loadIco() {
				if (this.user != null && this.user.imgPath != null && this.user.imgPath != "") {
					var _this = this;
					axios.get(JSON_URL.file.ico + this.user.imgPath).then(function (response) {
						if (response.code == RESPONSE_CODE.SUCCESS) {
							_this.imgUrl = "data:image/png;base64," + response.data;
						} else {
							alert(response.msg);
						}
					});
				}
			},
		}
    })

});
$(function() {

	"use strict";

	

	[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
		new SelectFx(el);
	});

	jQuery('.selectpicker').selectpicker;


	

	$('.search-trigger').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').addClass('open');
	});

	$('.search-close').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').removeClass('open');
	});

	$('.equal-height').matchHeight({
		property: 'max-height'
	});

	// var chartsheight = $('.flotRealtime2').height();
	// $('.traffic-chart').css('height', chartsheight-122);


	// Counter Number
	$('.count').each(function () {
		$(this).prop('Counter',0).animate({
			Counter: $(this).text()
		}, {
			duration: 3000,
			easing: 'swing',
			step: function (now) {
				$(this).text(Math.ceil(now));
			}
		});
	});


	 
	 
	// Menu Trigger
	$('body').on('click', '#menuToggle', function(event) {
		var windowWidth = $(window).width();   		 
		if (windowWidth<1010) { 
			$('body').removeClass('open'); 
			if (windowWidth<760){ 
				$('#left-panel').slideToggle(); 
			} else {
				$('#left-panel').toggleClass('open-menu');  
			} 
		} else {
			$('body').toggleClass('open');
			$('#left-panel').removeClass('open-menu');  
		} 
			 
	}); 

	

    $("a.nav-link").click(function () {
        $("#content").load($(this).attr('data'));
    });

	 
	$(".menu-item-has-children.dropdown").each(function() {
		$(this).on('click', function() {
			var $temp_text = $(this).children('.dropdown-toggle').html();
			$(this).children('.sub-menu').prepend('<li class="subtitle">' + $temp_text + '</li>'); 
		});
	});


	// Load Resize 
	$(window).on("load resize", function(event) { 
		var windowWidth = $(window).width();  		 
		if (windowWidth<1010) {
			$('body').addClass('small-device'); 
		} else {
			$('body').removeClass('small-device');  
		} 
		
	});
});