
$(function () {
     $("#loginsubmit").click(function () {
          let postData = new FormData();
          postData.append('email', $("#mobileinput").val());
          postData.append('password', $("#passwordinput").val());
          // let postData = {'email': $("#mobileinput").val(), 'password': $("#passwordinput").val()};
          axios.post(JSON_URL.user.login, postData).then(function (response) {
               if (response.code == RESPONSE_CODE.SUCCESS) {
                    window.location.href = "index.html";
                    saveUser(response.data);
                    setToken(response.token);
               } else {
                    alert(response.msg);
               }
          });
     });



     $("#registersubmit").click(function () {
          let p1 = $("#registerpasswordinput").val();
          let p2 = $("#registerpasswordinput2").val();
          if (p1 != p2) {
               alert("两次密码输入不一致！请重新输入");
          } else {
               let postData = new URLSearchParams();
               postData.append('email', $("#registeremailinput").val());
               postData.append('name', $("#registernameinput").val());
               postData.append('password', $("#registerpasswordinput").val());
               postData.append('phone', $("#registermobileinput").val());
               postData.append('age', $("#registerageinput").val());
               postData.append('gender', $("#registersexinput").val());
               axios.post(JSON_URL.user.register, postData).then(function (response) {
                    if (response.code == RESPONSE_CODE.SUCCESS) {
                         Auth.vars.login_link.click();
                    } else {
                         alert(response.msg);
                    }
               });
          }
     });

});

