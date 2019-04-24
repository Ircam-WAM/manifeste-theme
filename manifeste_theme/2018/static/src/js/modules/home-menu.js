var HomeMenu = function() {

    //
    // Init
    //
    this.init();

    this.$menu = $('.home__menu-item');

};

HomeMenu.prototype.init = function() {

    var that = this,
        $elements = $('.home__menu-item a');

    $('.home__menu-item').hover(function() {

        $elements.removeClass('active');
        $(this).find('>a').addClass('active');
        $('.home__shutter').removeClass('active');
        $(this).find('.home__shutter').addClass('active');

    }, function() {

        $('.home__shutter').removeClass('active');
        $elements.removeClass('active');
        $($elements.get(0)).addClass('active');

    });

    /*$('.home__menu').bind('mouseleave', function() {

        $('.home__shutter').removeClass('active');
        $elements.removeClass('active');
        $($elements.get(0)).addClass('active');

    });*/
    var is_touch_device = function() {
        return 'ontouchstart' in window;
    }

    if($('body.home').length > 0) {

        var scrollDown = function() {
            $('html, body').animate({
                scrollTop:$(window).height()
            }, 'slow');
        };
        var idle = setTimeout(function() {
            scrollDown();
        }, 5000);

        $('#jsHero').click(function(e) {
            scrollDown();
        });
        var clearIdle = function() {
            clearTimeout(idle);
            $(window).unbind('scroll', clearIdle);
            $(window).unbind('click', clearIdle);
            $(window).unbind('touch', clearIdle);
        };

        $(window).scroll(clearIdle);
        $(window).click(clearIdle);
    }

};

module.exports = HomeMenu;
