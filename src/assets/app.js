$(document).ready(function() {

  var brick = 215
  var joint = 10

  function CO(x) {
    return (brick + joint) * x;
  }

  function COPlus(x) {
    return CO(x) + joint;
  }

  function COMinus(x) {
    return CO(x) - joint;
  }

  function mode(element) {
    var active = element.parents(".uk-card").find(".uk-active")

    if(active.hasClass("CO")) {
      return "CO"
    }
    else if(active.hasClass("COPlus")) {
      return "COPlus"
    }
    else if(active.hasClass("COMinus")) {
      return "COMinus"
    }
    else {
      return false;
    }
  }

  function check(element) {
    if(element.hasClass("mm")) {
      var value = Number(element.val())
      console.log("Length has changed to ", value)

      // Check the CO mode and add or subtract a joint if required
      var mod = 0;
      if(mode(element) == "COPlus") {
        mod = 1 * joint;
      }
      else if(mode(element) == "COMinus") {
        mod = -1 * joint;
      }

      // Adjust the value to a CO and see how many bricks it is
      var bricks = (value + mod) / CO(1)

      // Update the bricks field
      element.parents(".current").find(".bricks").val(bricks)

      // Suggest
      suggest(element, bricks)
    }
    else if (element.hasClass("bricks")) {
      var value = Number(element.val())
      console.log("Number of bricks has changed to", value)

      // Check the CO mode and add or subtract a joint if required
      var mod = 0;
      if(mode(element) == "COPlus") {
        mod = 1 * joint;
      }
      else if(mode(element) == "COMinus") {
        mod = -1 * joint;
      }

      // Adjust the value
      var mm = CO(value) + mod

      // Update the mm field
      element.parents(".current").find(".mm").val(mm)

      // Suggest
      suggest(element, value)
    }
    else {
      console.log("Unknown input")
    }
  }

  function suggest(element, current) {

    var double = current * 2
    double = Math.round(double)
    var nearest = double / 2
    var previous = nearest - 0.5
    var next = nearest + 0.5

    if(nearest < current) {
      previous = nearest
    }
    else {
      next = nearest
    }

    console.log(current, nearest, previous, next)

    if(nearest === previous) {
      previous = previous - 0.5
    }
    else if(nearest === next) {
      next = next + 0.5
    }

    // Check the CO mode and add or subtract a joint if required
    var mod = 0;
    if(mode(element) == "COPlus") {
      mod = -1 * joint;
    }
    else if(mode(element) == "COMinus") {
      mod = 1 * joint;
    }

    // Update the previous and next fields
    element.parents(".uk-card").find(".previous .bricks").val(previous)
    element.parents(".uk-card").find(".next .bricks").val(next)
    element.parents(".uk-card").find(".previous .mm").val(CO(previous) + mod)
    element.parents(".uk-card").find(".next .mm").val(CO(next) + mod)

  }

  // When an input value is changed
  $("input").change(function(event) {
    check($(this))
  });

  // When the tab changes
  UIkit.util.on('.uk-switcher', 'shown', function () {
    // @todo this doesn't quite work...
    check($('.current .mm'))
  });

  // When the previous icon is clicked
  $(".previous-icon").click(function(event) {
    event.preventDefault()
    var element = $(this)
    var previous = element.parents(".uk-card").find(".previous .bricks").val()
    element.parents(".uk-card").find(".current .bricks").val(previous).trigger("change")
  });

  // When the next icon is clicked
  $(".next-icon").click(function(event) {
    event.preventDefault()
    var element = $(this)
    var next = element.parents(".uk-card").find(".next .bricks").val()
    element.parents(".uk-card").find(".current .bricks").val(next).trigger("change")
  });

  // When duplicate icon is clicked
  $(".duplicate-icon").click(function(event) {
    event.preventDefault()
    $(".prototype").clone(true, true).insertBefore(".duplicate");
    $(".cell").slice(1).removeClass("prototype")
  });
});