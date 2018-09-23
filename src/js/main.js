/* This is main javascript
*
* Table of content
* - Variables
* - Functions
* - Event Listeners
*/

$(function () {

  // Variables
  // ====================

  const $header = $('.js-header');
  let headerActive = false;


  // Event Listeners
  // ====================
  
  $(window).on('scroll', (e) => {

    if( !headerActive && $(window).scrollTop() > 0 ) {

      $header.addClass('header--active');
      headerActive = true;

    } else if ( $(window).scrollTop() === 0 ) {

      $header.removeClass('header--active');
      headerActive = false;

    }

  });

});
