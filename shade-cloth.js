$(function() {
  // Insert a llama.
  $('<img>')
    .attr('src', chrome.extension.getURL('images/llama.png'))
    .attr('class', '_gcLlama')
    .attr('width', '15px')
    .insertAfter('.rating-icon.rating-with-name');

  var _gcShowFeedback = true;
  // Hack to get fullname of current user. If this doesn't work  for every case
  // then we'll need to inject this entire script into the DOM so we can have
  // at the `_gcFullName` global that GH exposes.
  var _gcFullName = $('#reminder_modal input.email-from.max-width').val().split('<').shift().trim().replace(/"/g, '');

  // An .interview-info class means that feedback has not yet been submitted by someone!
  $('.interview .wrapper .interview-info').each(function() {
    // Lol Greenhouse globals.
    var $_gcSpan = $(this);
    var _gcNameText = $_gcSpan.text().trim();
    if (_gcNameText && _gcNameText.indexOf(_gcFullName) === 0) {
      // If it's me, don't show me feedback yet!
      _gcShowFeedback = false;
    }
  });

  if (_gcShowFeedback) {
    $('.rating-icon.rating-with-name').show();
    $('._gcLlama').remove();
  }
});
