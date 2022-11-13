jQuery(document).ready(function($) {

    $("a[name='menu']").click(function () {
        $("li[name='menu']").removeClass("active");
        $(this).parent("li").addClass("active");
        $("#content").load($(this).attr('data'));
    });

})