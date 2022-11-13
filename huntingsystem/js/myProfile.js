jQuery(document).ready(function($) {
    var user = getUser();
    var industryList = getIndustryList();
    if (user == null) {
        window.location.href = "login.html";
    } else {
        window.testName = new Vue({
            el : "#main-myProfile",
            data : {
                user : user,
                editAble : true,
                oldPwd : "",
                newPwd : "",
                confirmPwd : "",
                newCompany : false,
                companyName : "",
                industryList : industryList,
                industryType : "",
                companyInfo : {
                    name : "",
                    fullName : "",
                    isListed : "0",
                    scaleLevel : "",
                    type : "",
                    introduction : "",
                    corporate : "",
                    registerCapital : "",
                    establishDate : "",
                    imgPath : "",
                    industryId : "",
                    },
                path : "",
            },
            watch : {
                industryType() {
                    this.companyInfo.industryId = "";
                }
            },
            computed : {
                selectedIndustry() {
                    if (this.industryType != "") {
                        return this.industryList[this.industryType].industryList;
                    } else {
                        return {};
                    }
                }
            },
            methods : {
                changeAppState() {
                    this.newCompany = !this.newCompany;
                },
                doEdit() {
                    this.editAble = false;
                },
                updateUser() {
                    this.user = getUser();
                    setTimeout(function () {
                        $('textarea').trigger('input');
                    }, 100);
                },
                submitEdit() {
                    this.editAble = true;
                    // submit
                    let postData = new URLSearchParams();
                    for (var key in user) {
                        postData.append(key, user[key]);
                    }
                    var _this = this;
                    axios.put(JSON_URL.user.update_base, postData).then(function (response) {
                        if (response.code == RESPONSE_CODE.SUCCESS) {
                            saveUser(response.data);
                        } else {
                            alert(response.msg);
                        }
                        _this.updateUser();
                    }).catch(function (error) {
                        _this.updateUser();
                    });
                },
                cancleEdit() {
                    this.editAble = true;
                    this.updateUser();
                },
                pswdEditSubmit() {
                    if (this.oldPwd == null || this.oldPwd == "") {
                        alert("旧密码不能为空");
                        return;
                    }
                    if (this.newPwd == null || this.newPwd == "") {
                        alert("新密码不符合条件");
                        return;
                    }
                    var _this = this;
                    if (this.newPwd == this.confirmPwd) {
                        let postData = new URLSearchParams();
                        postData.append("password", this.oldPwd);
                        postData.append("newPassword", this.newPwd);
                        axios.put(JSON_URL.user.update_base, postData).then(function (response) {
                            alert(response.msg);
                        });
                        _this.oldPwd = "";
                        _this.newPwd = "";
                        _this.confirmPwd = "";
                    } else {
                        alert("输入密码不一致");
                    }
                },
                pathChange(e) {
                    this.path = e.target.value;
                },
                addOldCompany() {

                },
                createNewCompany() {
                    this.companyInfo.establishDate = $('#establishDate').val();
                }
            }
        });
    }
    $('textarea').bind("input", function(e) {
        this.style.height = "38px";
        this.style.height = e.target.scrollHeight + 'px';
    });

    $('#establishDate').datetimepicker({
        language: 'zh-CN', // 中文语言包
        autoclose: 1, // 选中日期后自动关闭
        format: 'yyyy-mm-dd', // 日期格式
        minView: "month", // 最小日期显示单元，这里最小显示月份界面，即可以选择到日
        todayBtn: 1, // 显示今天按钮
        todayHighlight: 1, // 显示今天高亮
      });

});
