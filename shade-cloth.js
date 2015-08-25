$(function() {
  if (window.location.pathname.indexOf('people') == '1') {
    scorecardOperations();
  }

  if (window.location.pathname.indexOf('guides') == '1') {
    ratingOperations();
  }

  if (window.location.pathname.indexOf('scorecards') == '1') {
    $('.rating-icon.rating-with-name').show();
    modifyThumbs();
  }
});

function ratingOperations() {
  if (!setRatingNames()) {
    var interval = setInterval(function() {
      if (setRatingNames()) {
        clearInterval(interval);
      }
    }, 500);
  }

  function setRatingNames() {
    if ($('.definitely-not').length) {
      $('.definitely-not').text('Solid no');
      $('.no').text('Weak no');
      $('.yes').text('Weak yes');
      $('.absolutely').text('Solid yes');
      return true;
    }
    return false;
  }
}

function scorecardOperations() {
  var gcShowFeedback = false;
  var gcForceShowFeedback = false;

  $('a[href="#scorecard"]').on('click', pollScorecards);
  pollScorecards();

  function pollScorecards() {
    var interval = setInterval(function() {
      if (checkScorecards()) {
        clearInterval(interval);
      }
    }, 500);
  }

  function checkScorecards() {
    if ($('.scorecards-section').length === 0) {
      return false;
    }

    injectShadeClothScorecardElements();
    modifyThumbs();

    // Hack to get fullname of current user. If this doesn't work  for every case
    // then we'll need to inject this entire script into the DOM so we can have
    // at the `gcFullName` global that GH exposes.
    //   new method || old method
    var gcFullName = $('script[data-key="myFullName"]').data('value');
    if (!gcFullName) {
      // Try old method.
      var oldMethod = $('#reminder_modal input.email-from.max-width').val();
      if (oldMethod) {
        gcFullName = oldMethod.split('<').shift().trim().replace(/"/g, '');
      } else {
        showFeedback();
        return true;
      }
    }

    var feedback = $('#scorecards .name');
    if (!feedback.length) {
      gcShowFeedback = true;
      $('.interview .wrapper .interview-info').each(function() {
        // Lol Greenhouse globals.
        var $gcSpan = $(this);
        var gcNameText = $gcSpan.text().trim();
        if (gcNameText && gcNameText.indexOf(gcFullName) === 0) {
          // If it's me, don't show me feedback yet!
          gcShowFeedback = false;
        }
      });
    } else {
      feedback.each(function() {
        var $gcSpan = $(this);
        var gcNameText = $gcSpan.text().trim();
        if (gcNameText && gcNameText.indexOf(gcFullName) === 0) {
          // If it's me, I've already interviewed this person!
          gcShowFeedback = true;
        }
      });
    }

    if (gcShowFeedback) {
      showFeedback();
    }

    return true;
  }

  function showFeedback() {
    gcForceShowFeedback = true;
    $('.rating-icon.rating-with-name').show();
    $('.gcLlama').remove();
  }

  function injectShadeClothScorecardElements() {
    if (gcShowFeedback || gcForceShowFeedback) {
      return;
    }

    if (!$('img.gcLlama').length) {
      $('<img>')
        .attr('src', chrome.extension.getURL('images/llama.png'))
        .attr('class', 'gcLlama')
        .attr('width', '15px')
        .insertAfter('.rating-icon.rating-with-name');
    }
    if (!$('.gcShowScorecards').length) {
      var wrapper = $('#scorecards').length ? '#scorecards' : '.interview .wrapper';
      $('<button>')
        .attr('class', 'gcShowScorecards')
        .text('I won\'t be biased; show me the ratings!')
        .insertAfter('#scorecards')
        .on('click', function() {
          showFeedback();
          $(this).remove();
        });
    }
  }
}

function modifyThumbs() {
  $('.thumbs-up').removeClass('thumbs-up').addClass('gcGreen').text('Weak yes');
  $('.two-thumbs-up').removeClass('two-thumbs-up').addClass('thumbs-up').addClass('gcGreen').text('Solid yes');
  $('.thumbs-down').removeClass('thumbs-down').addClass('gcRed').text('Weak no');
  $('.two-thumbs-down').removeClass('two-thumbs-down').addClass('thumbs-down').addClass('gcRed').text('Solid no');
}
