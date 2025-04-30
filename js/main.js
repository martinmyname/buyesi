// Disable all AOS animations
// AOS.init({
// 	duration: 800,
// 	easing: 'ease',
// 	once: true,
// 	mirror: false,
// 	disable: 'mobile',
// });

// Detect if we're on the homepage to apply different optimizations
const isHomePage =
	window.location.pathname === '/' ||
	window.location.pathname === '/index.html' ||
	window.location.pathname.endsWith('/index.html');

// AOS initialization with conditional disabling
document.addEventListener('DOMContentLoaded', function () {
	if (window.AOS) {
		window.AOS.init({
			duration: isHomePage ? 0 : 800,
			easing: 'ease',
			once: true,
			mirror: false,
			disable: isHomePage ? true : false,
		});
	}
});

// Counter animation - enabled on homepage, disabled on other pages
const counterAnimation = () => {
	document.querySelectorAll('.number').forEach((counter) => {
		if (isHomePage) {
			// Animated counters on homepage
			const target = +counter.getAttribute('data-number');
			const count = +counter.innerText;
			const increment = target / 100; // Faster increment for homepage

			if (count < target) {
				counter.innerText = Math.ceil(count + increment);
				setTimeout(counterAnimation, 1);
			} else {
				counter.innerText = target;
			}
		} else {
			// Instant counters on other pages
			const target = counter.getAttribute('data-number');
			if (target) {
				counter.innerText = target;
			}
		}
	});
};

// Counter animation on homepage, static on other pages
document.addEventListener('DOMContentLoaded', function () {
	if (isHomePage) {
		// Start with zero for animation effect
		document.querySelectorAll('.number').forEach((counter) => {
			counter.innerText = '0';
		});
		// Start counter animation
		setTimeout(counterAnimation, 500);
	} else {
		// Just set the final values on other pages
		document.querySelectorAll('.number').forEach((counter) => {
			const target = counter.getAttribute('data-number');
			if (target) counter.innerText = target;
		});
	}
});

// Disable intersection observer since we're handling counters differently
const observer = {
	observe: function () {},
	unobserve: function () {},
};

(function ($) {
	'use strict';

	// Disable stellar parallax
	// $(window).stellar({
	// 	responsive: false,
	// 	parallaxBackgrounds: true,
	// 	parallaxElements: true,
	// 	horizontalScrolling: false,
	// 	hideDistantElements: false,
	// 	scrollProperty: 'scroll',
	// });

	// Conditional stellar parallax
	if (!isHomePage && $.stellar) {
		$(window).stellar({
			responsive: false,
			parallaxBackgrounds: true,
			parallaxElements: true,
			horizontalScrolling: false,
			hideDistantElements: false,
			scrollProperty: 'scroll',
		});
	}

	var fullHeight = function () {
		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function () {
			$('.js-fullheight').css('height', $(window).height());
		});
	};
	fullHeight();

	// loader with conditional timing
	var loader = function () {
		if ($('#ftco-loader').length > 0) {
			setTimeout(
				function () {
					$('#ftco-loader').removeClass('show');
				},
				isHomePage ? 0 : 1
			);
		}
	};
	loader();

	// Disable Scrollax
	// $.Scrollax();

	// Conditional Scrollax
	if (!isHomePage && $.Scrollax) {
		$.Scrollax();
	}

	// Carousel initialization for all pages
	var carousel = function () {
		$('.carousel-cause').owlCarousel({
			autoplay: true,
			center: true,
			loop: true,
			items: 1,
			margin: 30,
			stagePadding: 0,
			nav: true,
			navText: [
				'<span class="ion-ios-arrow-back">',
				'<span class="ion-ios-arrow-forward">',
			],
			responsive: {
				0: {
					items: 1,
					stagePadding: 0,
				},
				600: {
					items: 2,
					stagePadding: 50,
				},
				1000: {
					items: 3,
					stagePadding: 100,
				},
			},
		});
	};
	carousel();

	// Simplified dropdown without animations
	$('nav .dropdown').hover(
		function () {
			var $this = $(this);
			$this.addClass('show');
			$this.find('> a').attr('aria-expanded', true);
			$this.find('.dropdown-menu').addClass('show');
		},
		function () {
			var $this = $(this);
			$this.removeClass('show');
			$this.find('> a').attr('aria-expanded', false);
			$this.find('.dropdown-menu').removeClass('show');
		}
	);

	// Navbar scroll behavior
	var scrollWindow = function () {
		$(window).scroll(function () {
			var $w = $(this),
				st = $w.scrollTop(),
				navbar = $('.ftco_navbar'),
				sd = $('.js-scroll-wrap');

			if (st > 150) {
				if (!navbar.hasClass('scrolled')) {
					navbar.addClass('scrolled');
				}
			}
			if (st < 150) {
				if (navbar.hasClass('scrolled')) {
					navbar.removeClass('scrolled sleep');
				}
			}

			if (st > 350) {
				if (!navbar.hasClass('awake')) {
					navbar.addClass('awake');
				}

				if (sd.length > 0) {
					sd.addClass('sleep');
				}
			}
			if (st < 350) {
				if (navbar.hasClass('awake')) {
					navbar.removeClass('awake');
					navbar.addClass('sleep');
				}
				if (sd.length > 0) {
					sd.removeClass('sleep');
				}
			}
		});
	};
	scrollWindow();

	var isMobile = {
		Android: function () {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function () {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function () {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function () {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function () {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function () {
			return (
				isMobile.Android() ||
				isMobile.BlackBerry() ||
				isMobile.iOS() ||
				isMobile.Opera() ||
				isMobile.Windows()
			);
		},
	};

	// Counter function - animated on homepage only
	var counter = function () {
		// Don't use jQuery animation - we're using the custom counter instead
		if (!isHomePage) {
			// For non-homepage, just set the values directly
			$('.number').each(function () {
				var $this = $(this),
					num = $this.data('number');
				$this.text(num);
			});
		}
	};
	counter();

	// Content animation for all pages except homepage
	var contentWayPoint = function () {
		var i = 0;
		$('.ftco-animate').waypoint(
			function (direction) {
				if (
					direction === 'down' &&
					!$(this.element).hasClass('ftco-animated')
				) {
					i++;

					$(this.element).addClass('item-animate');
					setTimeout(function () {
						$('body .ftco-animate.item-animate').each(function (k) {
							var el = $(this);
							setTimeout(
								function () {
									var effect = el.data('animate-effect');
									if (effect === 'fadeIn') {
										el.addClass('fadeIn ftco-animated');
									} else if (effect === 'fadeInLeft') {
										el.addClass('fadeInLeft ftco-animated');
									} else if (effect === 'fadeInRight') {
										el.addClass('fadeInRight ftco-animated');
									} else {
										el.addClass('fadeInUp ftco-animated');
									}
									el.removeClass('item-animate');
								},
								k * 50,
								'easeInOutExpo'
							);
						});
					}, 100);
				}
			},
			{ offset: '95%' }
		);
	};
	contentWayPoint();

	// One Page Navigation - same for all pages
	var OnePageNav = function () {
		$(".smoothscroll[href^='#'], #ftco-nav ul li a[href^='#']").on(
			'click',
			function (e) {
				e.preventDefault();

				var hash = this.hash,
					navToggler = $('.navbar-toggler');
				$('html, body').animate(
					{
						scrollTop: $(hash).offset().top,
					},
					700,
					'easeInOutExpo',
					function () {
						window.location.hash = hash;
					}
				);

				if (navToggler.is(':visible')) {
					navToggler.click();
				}
			}
		);
	};
	OnePageNav();

	// Magnific popup - conditionally optimized
	$('.image-popup').magnificPopup({
		type: 'image',
		closeOnContentClick: true,
		closeBtnInside: false,
		fixedContentPos: true,
		mainClass: 'mfp-no-margins' + (isHomePage ? '' : ' mfp-with-zoom'),
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0, 1],
		},
		image: {
			verticalFit: true,
		},
		zoom: {
			enabled: !isHomePage,
			duration: 300,
		},
	});

	$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		mainClass: isHomePage ? 'mfp-no-margins' : 'mfp-fade',
		removalDelay: isHomePage ? 0 : 160,
		preloader: true,
		fixedContentPos: true,
	});

	// Datepicker
	if (typeof $.fn.datepicker !== 'undefined') {
		$('#appointment_date').datepicker({
			format: 'm/d/yyyy',
			autoclose: true,
		});
	}

	$('#appointment_time').timepicker();
})(jQuery);
