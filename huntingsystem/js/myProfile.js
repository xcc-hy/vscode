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
                imgUrl : "img/admin.jpg",
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
                file : "",
            },
            created() {
                this.loadIco();
            },
            watch : {
                industryType() {
                    this.companyInfo.industryId = "";
                },
                user () {
                    this.loadIco();
                },
            },
            computed : {
                selectedIndustry() {
                    if (this.industryType != "") {
                        return this.industryList[this.industryType].detail;
                    } else {
                        return {};
                    }
                }
            },
            methods : {
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
                updateIco(e) {
                    var icoFile = e.target.files[0];
                    var _this = this;
                    let postData = new FormData();
                    postData.append("multipartFile", icoFile);
                    axios.put(JSON_URL.user.update_ico, postData).then(function (response) {
                        if (response.code == RESPONSE_CODE.SUCCESS) {
                            _this.user.imgPath = response.data;
                            saveUser(_this.user);
                            _this.loadIco();
                        } else {
                            alert(response.msg);
                        }
                    });
                },
                submitEdit() {
                    this.editAble = true;
                    // submit
                    let postData = copyObjWithoutNull(user);
                    var _this = this;
                    axios.put(JSON_URL.user.update_base, user).then(function (response) {
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
                        let postData = new FormData();
                        postData.append("id", this.user.id);
                        postData.append("email", this.user.email);
                        postData.append("password", this.oldPwd);
                        postData.append("newPassword", this.newPwd);
                        axios.put(JSON_URL.user.update_pswd, postData).then(function (response) {
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
                    this.file = e.target.files[0];
                },
                addOldCompany() {
                    if (this.companyName == null || this.companyName == "") {
                        alert("公司名不能为空");
                    } else {
                        let postData = new FormData();
                        postData.append("companyFullName", this.companyName);
                        axios.post(JSON_URL.hr_application.create + user.id, postData).then(function (response) {
                            if (response.code == RESPONSE_CODE.SUCCESS) {
                                alert("申请已提交，等待管理员审核");
                            } else {
                                alert(response.msg);
                            }
                        });
                    }
                },
                createNewCompany() {
                    this.companyInfo.establishDate = $('#establishDate').val();
                    let postData = new FormData();
                    postData.append("companyName", this.companyInfo.name);
                    postData.append("companyFullName", this.companyInfo.fullName);
                    postData.append("companyIsListed", this.companyInfo.isListed);
                    postData.append("companyScaleLevel", this.companyInfo.scaleLevel);
                    postData.append("companyType", this.companyInfo.type);
                    postData.append("companyCorporate", this.companyInfo.corporate);
                    postData.append("companyRegisterCapital", this.companyInfo.registerCapital);
                    postData.append("companyEstablishDate", this.companyInfo.establishDate);
                    postData.append("companyIndustryId", this.companyInfo.industryId);
                    postData.append("companyIntroduction", this.companyInfo.introduction);
                    postData.append("multipartFile", this.file);
                    axios.post(JSON_URL.new_company_application.create + user.id, postData).then(function (response) {
                        if (response.code == RESPONSE_CODE.SUCCESS) {
                            alert("申请已提交，等待管理员审核");
                        } else {
                            alert(response.msg);
                        }
                    });
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
