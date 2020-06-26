$(function () {

  //left-to-right
  $('.text-wrapper').each(function() {

    //vars
    var $this = $(this);

    var count = 10;
    for (var i = 0; i < count; i++) {
      $this.find('.texts').append('<div class="text"></div>');
    }

    var $text = $this.find('.text');
    var $textWidth = $text.outerWidth();
    var $textCount = $this.find('.texts .text').length;
    var $textTotal = $textWidth * $textCount;
    var $textWrapperWidth = $textTotal - $textWidth;
    var $leftSide = $('.left');
    var $rightSide = $('.right');

    

    //set text wrapper width
    $this.width($textWrapperWidth);

    //create timeline
    var tl = gsap.timeline({
      repeat: -1,
    });

    //set timeline
    tl.set($text, {
      x: function x(i) {
        return i * $textWidth;
      }
    });

    //wrap
    function wrap(value, min, max) {
      var v = value - min;
      var r = max - min;
      return ((r + v % r) % r) + min;
    };

    //animation timeline
    tl.to($text, {
      duration: $textCount * 8,
      ease: "none",
      x: '+=' + $textTotal,
      modifiers: {
        x: gsap.utils.unitize(function (x) {
          return wrap(x, -$textWidth, $textWrapperWidth)
        })
      },
    });

    //left side
    $leftSide.on("mouseenter", function (e) {
      tl.timeScale(1);
    });

    //right side
    $rightSide.on("mousemove", function (e) {
      var rightPos = e.pageX - this.offsetLeft;
      tl.timeScale(rightPos / 250);
    });

    //mouse leave browser set to default speed
    $(document).on("mouseleave", function (e) {
      tl.timeScale(1);
    });

  });


  //right-to-left
  $('.text-wrapper2').each(function () {

    //vars
    var $this = $(this);

    var count = 10;
    for (var i = 0; i < count; i++) {
      $this.find('.texts2').append('<div class="text2"></div>');
    }

    var $text = $this.find('.text2');
    var $textWidth = $text.outerWidth();
    var $textCount = $this.find('.texts2 .text2').length;
    var $textTotal = $textWidth * $textCount;
    var $textWrapperWidth = $textTotal - $textWidth;
    var $leftSide = $('.left');
    var $rightSide = $('.right');

    //set text wrapper width
    $this.width($textWrapperWidth);

    //create timeline
    var tl = gsap.timeline({
      repeat: -1,
    });

    //set timeline
    tl.set($text, {
      x: function x(i) {
        return i * $textWidth;
      }
    });

    //wrap
    function wrap(value, min, max) {
      var v = value - min;
      var r = max - min;
      return ((r + v % r) % r) + min;
    };

    //animation timeline
    tl.to($text, {
      duration: $textCount * 8,
      ease: "none",
      x: '-=' + $textTotal,
      modifiers: {
        x: gsap.utils.unitize(function (x) {
          return wrap(x, -$textWidth, $textWrapperWidth)
        })
      },
    });

    //left side
    $leftSide.on("mousemove", function (e) {
      var leftPos = e.pageX - (window.innerWidth - this.getBoundingClientRect().right);
      tl.timeScale(Math.abs(leftPos) / 250);
    });

    //right side
    $rightSide.on("mouseenter", function (e) {
      tl.timeScale(1);
    });

    //mouse leave browser set to default speed
    $(document).on("mouseleave", function (e) {
      tl.timeScale(1);
    });

  });

});