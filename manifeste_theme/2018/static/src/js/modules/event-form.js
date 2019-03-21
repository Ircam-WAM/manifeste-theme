var EventForm = function() {

    var that = this;

    this.$form = $('#jsEventsForm');
    this.$homeform = $('#jsEventsHomeForm');
    this.$container = $('#jsEventsContainer');
    this.baseFilters = [];
    this.baseLocations = [];
    this.calendarUpdate = false;
    this.req = null;

    this.queryDict = {}
    location.search.substr(1).split("&").forEach(function(item) {that.queryDict[item.split("=")[0]] = item.split("=")[1]});

    //
    // Init
    //
    if(this.$form.length > 0) {
        this.init();
        this.initBaseFilters();
        this.checkFilters();

        $('input.vertigo').parents('li').addClass('vertigo');
    }

    if(this.$homeform.length > 0) {
        $('input[type="radio"][disabled]', that.$homeform).each(function(idx) {
            $(this).parents('li').addClass('disabled');
        });

        $('input[type="radio"]', that.$homeform).on('change', function() {
            that.$homeform.submit();
        });
    }

};

EventForm.prototype.initBaseFilters = function() {
    var that = this;

    //
    // Get the event lists
    //
    that.baseFilters = [];
    $('.event-line-box__category', that.$container).each(function() {
        var t = $(this).text().trim().toLowerCase();
        if(that.baseFilters.indexOf(t) === -1) {
            that.baseFilters.push(t);
        }
    });

};

EventForm.prototype.checkFilters = function() {

    var that = this;

    //
    // Get the event lists
    //
    var categories = [];
    $('.event-line-box__category', that.$container).each(function() {
        var t = $(this).text().trim().toLowerCase();
        if(categories.indexOf(t) === -1) {
            categories.push(t);
        }
    });
    categories = categories.concat(that.baseFilters);
    locations = that.baseLocations;

    $('#id_event_categories_filter li').addClass('disabled');
    $('#id_event_categories_filter input').attr('disabled', 'disabled');
    $('#id_event_locations_filter li').addClass('disabled');
    $('#id_event_locations_filter input').attr('disabled', 'disabled');

    $('#id_event_categories_filter input').each(function() {
        var v = $(this).val().toLowerCase();
        if(categories.indexOf(v) >= 0) {
            $(this).parents('li').removeClass('disabled');
            $(this).removeAttr('disabled');
        }
    });

    $('#id_event_locations_filter input').each(function() {
        var v = $(this).val().toLowerCase();
        if(locations.indexOf(v) >= 0) {
            $(this).parents('li').removeClass('disabled');
            $(this).parents('li').addClass('active');
            $(this).prop('checked', true);
            $(this).removeAttr('disabled');
        }
    });

};

EventForm.prototype.init = function() {

    var that = this;

    that.$form.on('submit', function(e) {
        e.preventDefault();

        var data = that.$form.serialize();

        that.$container.addClass('fade-out');

        setTimeout(function() {
            if(that.req) that.req.abort();
            that.req = $.get(that.$form.attr('action'), data, function(res) {
                that.$container.html(res);

                if(that.calendarUpdate == true) {
                    that.initBaseFilters();
                    that.calendarUpdate = false;
                }
                // reload Lazyload
                window['LazyLoadInit'].init();

                that.checkFilters();
                that.$container.removeClass('fade-out');
            });
        }, 500);

        return false;
    });

    $('#id_event_day_filter li').each(function(idx) {
        if( $('input', $(this)).prop('checked') ) {
            $($('#id_event_day_filter li')[idx]).addClass('active');
        }
    });

    if(!that.queryDict['event_categories_filter[]']) {
        //$('#id_event_categories_filter input').prop("checked", true);
        //$('#id_event_categories_filter li').addClass('active');
    }
    if(that.queryDict['event_locations_filter[]']) {
        //$('#id_event_locations_filter input').prop("checked", true);
        //$('#id_event_locations_filter li').addClass('active');
        that.baseLocations = [];
        $('.event-line-box__location span', that.$container).each(function() {
            var t = $(this).text().trim().toLowerCase();
            if(that.baseLocations.indexOf(t) === -1) {
                that.baseLocations.push(t);
            }
        });
    }

    $('input[type="radio"][disabled]', that.$form).each(function(idx) {
        $(this).parents('li').addClass('disabled');
    });

    $('input[type="radio"]', that.$form).on('change', function() {
        $('#id_event_categories_filter input').prop('checked', false);
        $('#id_event_categories_filter li').removeClass('active');
        $('#id_event_categories_filter li').addClass('disabled');
        $('#id_event_categories_filter input').attr('disabled', 'disabled');

        /*$('#id_event_locations_filter input').prop('checked', false);
        $('#id_event_locations_filter li').removeClass('active');
        $('#id_event_locations_filter li').addClass('disabled');
        $('#id_event_locations_filter input').attr('disabled', 'disabled');*/

        that.calendarUpdate = true;
        that.$form.submit();

        $('#id_event_day_filter li').removeClass('active');
        $(this).parents('li').addClass('active');
    });

    $('input[type="checkbox"]', that.$form).on('change', function() {
        that.$form.submit();

        if($(this).prop('checked')) {
            $(this).parents('li').addClass('active');
        } else {
            $(this).parents('li').removeClass('active');
        }

    });

};

module.exports = EventForm;
