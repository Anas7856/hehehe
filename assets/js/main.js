(function ($) {
   "use strict";


   var windowOn = $(window);

   windowOn.on('load', function () {
      wowAnimation();
   });

//   // preloader 
//   windowOn.on('load', function () {
//      $("#loading").fadeOut(500);
//   })


   // back-to-top
   var btn = $('#back-to-top');
   windowOn.scroll(function () {
      if (windowOn.scrollTop() > 300) {
         btn.addClass('show');
      } else {
         btn.removeClass('show');
      }
   });
   btn.on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, '300');
   });



   // sticky js 
   windowOn.on('scroll', function () {
      var scroll = windowOn.scrollTop();
      if (scroll < 100) {
         $("#tp-header-sticky").removeClass("header-sticky");
      } else {
         $("#tp-header-sticky").addClass("header-sticky");
      }
   });

   // mobile menu 
   var tpMenuWrap = $('.tp-mobile-menu-active > ul').clone();
   var tpSideMenu = $('.tp-offcanvas-menu nav');
   tpSideMenu.append(tpMenuWrap);
   if ($(tpSideMenu).find('.sub-menu, .tp-mega-menu').length != 0) {
      $(tpSideMenu).find('.sub-menu, .tp-mega-menu').parent().append('<button class="tp-menu-close"><i class="fas fa-chevron-right"></i></button>');
   }

   var sideMenuList = $('.tp-offcanvas-menu nav > ul > li button.tp-menu-close, .tp-offcanvas-menu nav > ul li.has-dropdown > a');
   $(sideMenuList).on('click', function (e) {
      e.preventDefault();
      if (!($(this).parent().hasClass('active'))) {
         $(this).parent().addClass('active');
         $(this).siblings('.sub-menu, .tp-mega-menu').slideDown();
      } else {
         $(this).siblings('.sub-menu, .tp-mega-menu').slideUp();
         $(this).parent().removeClass('active');
      }
   });


   // offcanvas bar 
   $(".tp-offcanvas-toogle").on('click', function () {
      $(".tp-offcanvas").addClass("tp-offcanvas-open");
      $(".tp-offcanvas-overlay").addClass("tp-offcanvas-overlay-open");
   });
   $(".tp-offcanvas-close-toggle,.tp-offcanvas-overlay").on('click', function () {
      $(".tp-offcanvas").removeClass("tp-offcanvas-open");
      $(".tp-offcanvas-overlay").removeClass("tp-offcanvas-overlay-open");
   });

   // Search bar
//   $(".tp-search-toggle").on('click', function () {
//      $(".tp-header-search-bar").addClass("tp-search-open");
//      $(".tp-offcanvas-overlay").addClass("tp-offcanvas-overlay-open");
//   });
//
   $(".tp-offcanvas-overlay").on('click', function () {
//      $(".tp-header-search-bar").removeClass("tp-search-open");
      $(".tp-offcanvas-overlay").removeClass("tp-offcanvas-overlay-open");
   });


   gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

   if ($('#smooth-wrapper').length && $('#smooth-content').length) {

      gsap.config({
         nullTargetWarn: false,
      });

      let smoother = ScrollSmoother.create({
         smooth: 1.35,
         effects: true,
         smoothTouch: 0.1,
         normalizeScroll: false,
         ignoreMobileResize: true,
      });
   }




   // data bg img 
   $("[data-background]").each(function () {
      $(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
   })

//   // data bg color
//   $("[data-bg-color]").each(function () {
//      $(this).css("background-color", $(this).attr("data-bg-color"))
//   })
//
//   // data bg color
//   $("[data-color]").each(function () {
//      $(this).css("color", $(this).attr("data-color"))
//   })
//
//   $('.popup-image').magnificPopup({
//      type: 'image'
//      // other options
//   });
//   $('.popup-video').magnificPopup({
//      type: 'iframe'
//      // other options
//   });
//
//   if ($('.grid').length != 0) {
//      var $grid = $('.grid').imagesLoaded(function () {
//         $('.grid').isotope({
//            itemSelector: '.grid-item',
//            percentPosition: true,
//            masonry: {
//               columnWidth: 1
//            }
//         })

         // filter items on button click
//         $('.tp-portfolio-filter').on('click', 'button', function () {
//            var filterValue = $(this).attr('data-filter');
//            $grid.isotope({ filter: filterValue });
//         });
         //for menu active class
//         $('.tp-portfolio-filter button').on('click', function (event) {
//            $(this).siblings('.active').removeClass('active');
//            $(this).addClass('active');
//            event.preventDefault();
//         });
//      });
//   }

   // blog slider 
   var swiper = new Swiper(".tp-blog-active", {
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: {
         enabled: true,
      },
      pagination: {
         el: ".swiper-pagination",
         clickable: true,
      },
      navigation: {
         nextEl: ".tp-swiper-blog-button-next",
         prevEl: ".tp-swiper-blog-button-prev",
      },
   });

   // testimonial slider 
   var swiper = new Swiper(".tp-testimonial-active", {
      slidesPerView: 1,
      spaceBetween: 30,
      keyboard: {
         enabled: true,
      },
      pagination: {
         el: ".swiper-pagination",
         clickable: true,
      },
      navigation: {
         nextEl: ".tp-swiper-test-button-next",
         prevEl: ".tp-swiper-test-button-prev",
      },
   });

   // tp-test-active slider 
   var swiper = new Swiper(".tp-test-active", {
      slidesPerView: 4,
      spaceBetween: 30,
      keyboard: {
         enabled: true,
      },
      pagination: {
         el: ".swiper-pagination",
         clickable: true,
      },
      navigation: {
         nextEl: ".tp-review-button-next",
         prevEl: ".tp-review-button-prev",
      },
      breakpoints: {
         0: {
            slidesPerView: 1,
         },
         768: {
            slidesPerView: 2,
         },
         992: {
            slidesPerView: 3,
         },
         1200: {
            slidesPerView: 4,
         }
      },
   });



   // tp-testimonial-content-active
   var slider = new Swiper('.tp-testimonial-content-active', {
      slidesPerView: 1,
      centeredSlides: true,
      loop: true,
      loopedSlides: 3,
      navigation: {
         nextEl: '.tp-room-details-slide-next',
         prevEl: '.tp-room-details-slide-prev',
      },
   });
   var thumbs = new Swiper('.tp-testimonial-thumb-active', {
      slidesPerView: 3,
      spaceBetween: 10,
      centeredSlides: false,
      centeredSlides: true,
      loop: true,
      slideToClickedSlide: true,
   });

   slider.controller.control = thumbs;
   thumbs.controller.control = slider;


   // brand slider 
   var swiper = new Swiper(".tp-brand-top-active", {
      slidesPerView: 'auto',
      spaceBetween: 80,
      freemode: true,
      centeredSlides: true,
      loop: true,
      speed: 4000,
      allowTouchMove: false,
      autoplay: {
         delay: 1,
         disableOnInteraction: true,
      },
   });

   // brand slider  
   var swiper = new Swiper(".tp-brand-bottom-active", {
      slidesPerView: 'auto',
      spaceBetween: 80,
      freemode: true,
      centeredSlides: true,
      loop: true,
      speed: 4000,
      allowTouchMove: false,
      autoplay: {
         delay: 1,
         disableOnInteraction: true,
      },
   });

   // brand title slider  
   var swiper = new Swiper(".tp-brand-title-active", {
      slidesPerView: 'auto',
      spaceBetween: 40,
      freemode: true,
      centeredSlides: true,
      loop: true,
      speed: 4000,
      allowTouchMove: false,
      autoplay: {
         delay: 1,
         disableOnInteraction: true,
      },
   });


   // brand normal slider 
   var swiper = new Swiper(".tp-brand-nromal-active", {
      slidesPerView: 5,
      spaceBetween: 30,
      keyboard: {
         enabled: true,
      },
      pagination: {
         el: ".swiper-pagination",
         clickable: true,
      },
      navigation: {
         nextEl: ".tp-swiper-team-button-next",
         prevEl: ".tp-swiper-team-button-prev",
      },
      breakpoints: {
         0: {
            slidesPerView: 1,
         },
         768: {
            slidesPerView: 2,
         },
         992: {
            slidesPerView: 3,
         },
         1200: {
            slidesPerView: 5,
         }
      },
   });

   // team slider 
   var swiper = new Swiper(".tp-team-active", {
      slidesPerView: 4,
      spaceBetween: 30,
      keyboard: {
         enabled: true,
      },
      pagination: {
         el: ".swiper-pagination",
         clickable: true,
      },
      navigation: {
         nextEl: ".tp-swiper-team-button-next",
         prevEl: ".tp-swiper-team-button-prev",
      },
      breakpoints: {
         0: {
            slidesPerView: 1,
         },
         768: {
            slidesPerView: 2,
         },
         992: {
            slidesPerView: 4,
         },
         1200: {
            slidesPerView: 6,
         }
      },
   });

   // project slider 
   var swiper = new Swiper(".tp-project-active", {
      slidesPerView: 2,
      spaceBetween: 30,
      keyboard: {
         enabled: true,
      },
      pagination: {
         el: ".swiper-pagination",
         clickable: true,
      },
      navigation: {
         nextEl: ".tp-swiper-team-button-next",
         prevEl: ".tp-swiper-team-button-prev",
      },
      breakpoints: {
         0: {
            slidesPerView: 1,
         },
         768: {
            slidesPerView: 2,
         },
         992: {
            slidesPerView: 3,
         },
         1200: {
            slidesPerView: 3,
         }
      },
   });

   // wow
   function wowAnimation() {
      var wow = new WOW({
         boxClass: 'wow',
         animateClass: 'animated',
         offset: 0,
         mobile: false,
         live: true
      });
      wow.init();
   }


   // jarallax
   if ($('.jarallax').length) {
      $('.jarallax').jarallax({
         speed: 0.2,
      });
   }

   if ($('.tp_title_anim').length > 0) {
      let splitTitleLines = gsap.utils.toArray(".tp_title_anim");
      splitTitleLines.forEach(splitTextLine => {
         const tl = gsap.timeline({
            scrollTrigger: {
               trigger: splitTextLine,
               start: 'top 90%',
               end: 'bottom 60%',
               scrub: false,
               markers: false,
               toggleActions: 'play none none none'
            }
         });

         const itemSplitted = new SplitText(splitTextLine, { type: "words, lines" });
         gsap.set(splitTextLine, { perspective: 400 });
         itemSplitted.split({ type: "lines" })
         tl.from(itemSplitted.lines, {
            duration: 1,
            delay: 0.3,
            opacity: 0,
            rotationX: -80,
            force3D: true,
            transformOrigin: "top center -50",
            stagger: 0.1
         });
      });
   }
//
//
//// tp_ecommerce
//function tp_ecommerce() {
//   $('.tp-cart-minus').on('click', function () {
//     var $input = $(this).parent().find('input');
//     var count = parseInt($input.val()) - 1;
//     count = count < 1 ? 1 : count;
//     $input.val(count);
//     $input.change();
//     return false;
//   });
// 
//   $('.tp-cart-plus').on('click', function () {
//     var $input = $(this).parent().find('input');
//     $input.val(parseInt($input.val()) + 1);
//     $input.change();
//     return false;
//   });
// 
//     //  tpReturnCustomerLoginForm //
//     $('.tp-checkout-login-form-reveal-btn').on('click', function () {
//       $('#tpReturnCustomerLoginForm').slideToggle(400);
//     });
// 
// 
//     //  Show Coupon Toggle Js //
//       $('.tp-checkout-coupon-form-reveal-btn').on('click', function () {
//          $('#tpCheckoutCouponForm').slideToggle(400);
//       });
//    
// 
//       // Create An Account Toggle Js //
//       $('#cbox').on('click', function () {
//          $('#cbox_info').slideToggle(900);
//       });
//    
//       // Shipping Box Toggle Js //
//       $('#ship-box').on('click', function () {
//          $('#ship-box-info').slideToggle(1000);
//       });
// 
// 
// }
// tp_ecommerce();
// 

    //  Nice Select Js
//    $('.tp-shop-area select, .tp-checkout-area select, .profile__area select').niceSelect();

})(jQuery);


