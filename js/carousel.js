(function($) {
	var	methods = {
			init 		: function( options ) {
				
				if( this.length ) {
					
					//DEFAULTS
					var settings = {
						speed		: 500,
						easing	: 'easeOutExpo'
					};
					
					return this.each(function() {
						
						// if options exist, lets merge them with our default settings
						if ( options ) {
							$.extend( settings, options );
						}

						
						//carousel vars						
						var $el 			= $(this),
							$wrapper		= $el.find('.carousel-wrapper'),
							$item			= $wrapper.children('.carousel-item'),
							$itemCount      = $item.length,
							$itemH			= $item.outerHeight(true),
							$activeClass    = 'carousel-active';

						//control vars
						var $prev			= $('.carousel-prev'),
							$next           = $('.carousel-next');

						//pager vars
						var $pager          = $('.carousel-pager'),
							$pagerItem      = 'carousel-pager-item',
							$pagerActive    = 'carousel-pager-active';

						//set data attr with itemHeight( this is set with css mediaqueries)
						var setSlideH = function(){
							$item.attr('data-height', $itemH);
						}

						//set the slide position to top of slide on resize
						var setSlidePos = function(){
							var current = $wrapper.children('li.' + $activeClass).index();
							$wrapper.css('top', '-' + (current * $item.attr('data-height')) + 'px');
						}

						//update slide height on resize
						var updateSlideHeight = function(){
							$('.carousel-item').attr('data-height', $('.carousel-item').outerHeight(true));
							setSlidePos();
						}

						updateSlideHeight();


						//add active class to first slide
						$item.first().addClass($activeClass);

						//clone the first and last
						$wrapper.append($item.first().clone().addClass('carousel-clone').removeClass($activeClass));
						$wrapper.prepend($item.last().clone().addClass('carousel-clone'));


						//set up pager
						var setupPager = function(){
							console.log('pager count', $itemCount);

							for( var i = 0; i < $itemCount; i++ ){
								$pager.append('<li class="' + $pagerItem + '">' + (i + 1) + '</li>');
							}
						};

						var updatePagerActive = function(num){
							$('.' + $pagerItem).eq(num).addClass($pagerActive).siblings().removeClass($pagerActive);
						};

						setupPager();


						//set slide first & last functions
						var setSlideFirst = function(){
							updatePagerActive(0);
							$wrapper.css('top', '-' + $item.attr('data-height') + 'px');
							$item.eq(0).addClass($activeClass).siblings().removeClass($activeClass);
							console.log('SET FIRST');
							//$item.eq(0).addClass($activeClass).siblings().removeClass($activeClass);
						}

						var setSlideLast = function(){
							updatePagerActive($itemCount - 1);
							$wrapper.css('top', '-' + $item.attr('data-height') * $itemCount + 'px');
							$item.eq($itemCount - 1).addClass($activeClass).siblings().removeClass($activeClass);
							console.log('SET LAST');
						}

						//reset first slide (to not be the clone)
						setSlideFirst();

						//position vars
						var positionTop;
						var origPositionTop = $item.last().offset().top;

						//get position
						var getSlidePositionTop = function(){	

							var positionTop = $item.last().offset().top;

							if(positionTop < 0){
								return 'last';
							}else if(positionTop > origPositionTop){
								return 'first';
							}else{
								return 'normal';
							}

						};

						//go to slide
						var goToSlide = function(current, slide, speed){

							//check if the wrapper is already animated (smoother animations)
							if(!$wrapper.is(':animated')){
								
								console.log('slidefrom', current, 'to', slide);
								
								speed = speed || 1;

								var dir;
								var offset;
								var setPager;
								var newSpeed = settings.speed * speed;


								if(current < slide){ //if next
									dir = '-=';
									offset = (slide - current) * $item.attr('data-height');
									setPager = slide - 1;
									$item.eq(slide - 1).addClass($activeClass).siblings().removeClass($activeClass);
								}else if(current > slide){ // if prev
									dir = '+=';
									offset = (current - slide) * $item.attr('data-height');
									setPager = slide - 1;
									$item.eq(slide - 1).addClass($activeClass).siblings().removeClass($activeClass);
								}else{ //if the same?
									dir = '-=';
									offset = 0;
									setPager = 0;
								}

								updatePagerActive(setPager);

								//animate the wrapper
								$wrapper.stop().animate({ 'top' : dir + offset }, newSpeed, settings.easing, function(){

									if(getSlidePositionTop() == 'last'){
										setSlideFirst();
									}else if(getSlidePositionTop() == 'first'){
										setSlideLast();
									}

								});

							}

						};


						//event - next
						$next.bind('click', function(e){
							e.preventDefault();

							//don't need to subtract 0 based due to clone. yay?
							var current = $wrapper.children('li.' + $activeClass).index();
							var to = current + 1;

							goToSlide(current, to);

						});
					

						//event - prev
						$prev.bind('click', function(e){
							e.preventDefault();

							//don't need to subtract 0 based due to clone. yay?
							var current = $wrapper.children('li.' + $activeClass).index();
							var to = current - 1;

							goToSlide(current, to);

						});


						//event - pager
						$('.' + $pagerItem).bind('click', function(e){
							e.preventDefault();
							
							var current = $wrapper.children('li.' + $activeClass).index();
							var to = $(this).index() + 1;
							var speed = (current > to) ? current - to : to - current;

							goToSlide(current, to, speed);

						});


						//event - resize
						$(window).bind("resize", updateSlideHeight);


					});
				}
			}

		};
	
	$.fn.carousel = function(method) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.carousel' );
		}
	};
	
})(jQuery);