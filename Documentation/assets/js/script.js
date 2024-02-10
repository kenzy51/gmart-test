$(document).ready(function() {
		$('a[href^="#"]').bind('click', function(e) {
				e.preventDefault();
        var target = $(this).attr("href");
        $('html, body').stop().animate({
						scrollTop: $(target).offset().top
				}, 100, function() {
						location.hash = target;
				});
        return false;
		});

    $('.scrollToTop').click(function(){
        $('html, body').animate({ scrollTop : 0 }, 100)
        return false;
    });

    $(window).scroll(function() {
    		var scrollDistance = $(window).scrollTop();
        if ($(this).scrollTop() > 100) $('.scrollToTop').fadeIn()
        else $('.scrollToTop').fadeOut()

    		$('.page-section').each(function(i) {
    				if ($(this).position().top <= scrollDistance) {
    						$('.sidebar-nav ul li a.active').removeClass('active');
    						$('.sidebar-nav ul li a').eq(i).addClass('active');
    				}
    		});
    });
});
