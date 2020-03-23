;(function($){

	"use strict";

	var Core = {

		DOMReady: function(){

			var self = this;

			self.events();
			self.tabs();
			self.docClick();
            
		},

		windowLoad: function(){

			var self = this;
			
			self.preloader();
			
		},

		/**
		**	Tabs
		**/

		tabs: function(){

			$('.js-tabs').each(function(){

				var $this = $(this),
					active = $this.children('.js-tabs-list').find("li.is-active").length ? $this.children('.js-tabs-list').find("li.is-active") : $this.children('.js-tabs-list').find('li:first-child').addClass('is-active'),
					index = active.index();

				$this.find('.js-tabs-box').children("div").eq(index).show();
				
			});

			$('.js-tabs-list').on('click', 'li', function(){

				var ind = $(this).index();
				$(this).addClass('is-active').siblings().removeClass('is-active');
				$(this).closest('.js-tabs')
					   .find('.js-tabs-box')
					   .children()
					   .eq(ind)
					   .addClass('active')
					   .show()
					   .siblings()
					   .removeClass('is-active')
					   .hide();

			});

		},

		/**
		**  docClick
		**/

		docClick: function(){
            $(document).on("click touchstart", function(event) {

               if($('.todos_dot_box').hasClass('is-open')){
                    if($(event.target).closest(".todos_dots_icon,.todos_dot_box").length){return}
                    else{
                        $('.todos_dot_box').removeClass('is-open');
                    }
                }
                
            });
        },

		/**
		**  Events
		**/

		events: function(){


		    // $('.js-menu-btn').on('click', function(event) {
		    //     event.preventDefault();
		    //     $('.navigation_menu').addClass('is-open');
		    //     $('body').addClass('showMenu');
		    // });

		    // $('.js-close-btn').on('click', function(event) {
		    //     event.preventDefault();
		    //     $('.navigation_menu').removeClass('is-open');
		    //     $('body').removeClass('showMenu');
		    // });
		    if($('html').hasClass('md_touch')){

		    	$('.todos_dots_icon').on('click', function(event) {
		    		$(this).next('.todos_dot_box').toggleClass('is-open');
		    	});
		    }

			$('table .tb-check').on('change', 'input', function(event) {
				if($(this).prop("checked")){
					$(this).closest('tr').find('.table_wrap_box').addClass('is-active');
				}
				else{
					$(this).closest('tr').find('.table_wrap_box').removeClass('is-active');
				}
			});

			$('.table2 .tb-check').on('change', 'input', function(event) {
				if($(this).prop("checked")){
					$(this).closest('tr').find('.table2_td').addClass('is-active');
				}
				else{
					$(this).closest('tr').find('.table2_td').removeClass('is-active');
				}
			});

			function chek(){
				$('.tb-check input').each(function(index, el) {
					if($(this).prop('checked')){
						$(this).closest('tr').find('.table_wrap_box').addClass('is-active');
						$(this).closest('tr').find('.table2_td').addClass('is-active');
					}
					else{
						$(this).closest('tr').find('.table_wrap_box').removeClass('is-active');
						$(this).closest('tr').find('.table2_td').removeClass('is-active');
					}
				});
			}

			$('.table_check').on('change', 'input', function(event) {
				if($(this).prop("checked")){
					$(this).closest('table').find('.tb-check input').prop('checked', true);
					chek();
				}
				else{
					$(this).closest('table').find('.tb-check input').prop('checked', false);
					chek();
				}
			});

			$('.table_dots').on('click', function(event) {
				$(this).hide(400);
				$(this).closest('.table_wrap_box').find('.table_course_wrap').addClass('is-active');
				$(this).closest('.table_wrap_box').find('.table_progres_bar').slideDown('400');
				$(this).closest('.table_wrap_box').find('.session').slideDown('400');
				$(this).closest('.table_wrap_box').find('.table_location_it').slideDown('400');

				$(this).closest('tr').find('.table_course_wrap').addClass('is-active');
				$(this).closest('tr').find('.table_progres_bar').slideDown('400');
				$(this).closest('tr').find('.session').slideDown('400');
				$(this).closest('tr').find('.table_location_it').slideDown('400');
			});


			function pseudoSelect(){
				var selected =  $('.pseudo-select .options > div.selected').clone();
				$(selected).appendTo('.pseudo-select .selectt');
				$('.pseudo-select .selectt').find('.flag-wrapper').removeClass('selected');
			    $('.pseudo-select .selectt').on('click',function(){
			        // $(this).parent().find('.options').fadeIn('fast');
			        $(this).parent().find('.options').addClass('is-open');
			    });

			    $('.pseudo-select .options').on('mouseleave', function(){
			        // $(this).fadeOut('fast');
			        $(this).removeClass('is-open');
			    });

			    $('.pseudo-select .options > div').on('click', function(){
			        $(this).addClass('selected').siblings().removeClass('selected').closest('.pseudo-select').find('.selectt').html($(this).html());
			        $(this).closest('.pseudo-select').find('.pseudo-select-input').attr('value', $(this).attr('value'));
			        // $.each($(this).parent().children('div.check'), function(){
			        //     $(this).removeClass('check');
			        // });
			        // $(this).addClass('check');
			        // $(this).parent().removeClass('is-open').fadeOut('fast');
			        $(this).parent().removeClass('is-open');
			    });
			}pseudoSelect();


		},


        /**
        **  Preloader
        **/

        preloader: function(){

            var self = this;

            self.preloader = $('#page-preloader');
            self.spinner   = self.preloader.find('.preloader');

            self.spinner.fadeOut();
            self.preloader.delay(500).fadeOut('slow');
        },



	}


	$(document).on('ready', function(){

		Core.DOMReady();

	});

	$(window).on('load', function(){

		Core.windowLoad();

	});

})(jQuery);