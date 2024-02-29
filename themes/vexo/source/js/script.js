(function ($) {
  console.log('© Theme-Vexo | https://github.com/yanm1ng/hexo-theme-vexo')
  var app = $('.app-body')
  var header = $('.header')
  var banner = document.getElementById('article-banner') || false
  var about = document.getElementById('about-banner') || false
  var top = $('.scroll-top')
  var catalog = $('.catalog-container .toc-main')
  var leftSidebar = $('.left-sidebar')
  var isOpen = false

  console.log("scripts run...")


  $(document).ready(function () {
    NProgress.start()
    $('#nprogress .bar').css({
      'background': '#42b983'
    })
    $('#nprogress .spinner').hide()

    var fade = {
      transform: 'translateY(0)',
      opacity: 1
    }
    if (banner) {
      app.css('transition-delay', '0.15s')
      $('#article-banner').children().css(fade)
    }
    if (about) {
      $('.author').children().css(fade)
    }
    app.css(fade)
  })

  window.onload = function () {
    setTimeout(function () {
      NProgress.done()
    }, 200)
  }

  $('.menu').on('click', function () {
    if (!header.hasClass('fixed-header') || isOpen) {
      header.toggleClass('fixed-header')
      isOpen = !isOpen
    }
    $('.menu-mask').toggleClass('open')
  })

  $('#tag-cloud a').on('click', function () {
    var list = $('.tag-list')
    var name = $(this).data('name').replace(/[\ \'\/\+\#]/gi, "\\$&")
    // var maoH = list.find('#' + name).offset().top
    // $('html,body').animate({
    //   scrollTop: maoH - header.height()
    // }, 500)
  })

  $('a').on('click', function () {
    var herf = $(this).attr('href'); // 获取链接的href属性值
    if(herf){
      var parts = herf.split("/")
      if(parts.length === 2){ //这里说明是一级目录，即menu
        localStorage.setItem("currentMenu", herf);
      }
    }
    console.log("currentMenu: " + localStorage.getItem("currentMenu") );
  });


  $('#category-cloud a').on('click', function () {
    var list = $('.category-list')
    var name = $(this).data('name').replace(/[\ \'\/\+\#]/gi, "\\$&")
    var maoH = list.find('#' + name).offset().top
    $('html,body').animate({
      scrollTop: maoH - header.height()
    }, 500)
  })

  $('.reward-btn').on('click', function () {
    $('.money-code').fadeToggle()
  })

  $('.arrow-down').on('click', function () {
    $('html, body').animate({
      scrollTop: banner.offsetHeight - header.height()
    }, 500)
  })

  $('.toc-nav a').on('click', function (e) {
    e.preventDefault()
    var catalogTarget = e.currentTarget
    // var scrollTarget = $(catalogTarget.getAttribute('href'))
    var scrollTarget = $(decodeURIComponent(catalogTarget.getAttribute('href')))
    var top = scrollTarget.offset().top
    if (top > 0) {
      $('html,body').animate({
        scrollTop: top - 65
      }, 500)
    }
  })

  top.on('click', function () {
    console.log("Current file and line number: ", new Error().stack.split("\n")[1]);
    $('html, body').animate({ scrollTop: 0 }, 600)
  })

  document.addEventListener('scroll', function () {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    var headerH = header.height()
    if (banner) {
      if (scrollTop > headerH) {
        header.addClass('fixed-header')
      } else if (scrollTop === 0) {
        header.removeClass('fixed-header')
      }
    }
    if (scrollTop > 100) {
      top.addClass('opacity')
    } else {
      top.removeClass('opacity')
    }
    if (scrollTop > 190) {
      catalog.addClass('fixed-toc')
      leftSidebar.addClass('top-pad')
    } else {
      catalog.removeClass('fixed-toc')
      leftSidebar.removeClass('top-pad')
    }
  })
})(jQuery)
