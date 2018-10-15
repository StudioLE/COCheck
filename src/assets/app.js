'use strict'

$(document).ready(function() {

  // // // // // // // // // // // // // // // // // // // // // //
  // Variables

  var brick = 215
  var joint = 10
  var dp = 3

  // // // // // // // // // // // // // // // // // // // // // //
  // Functions

  /**
   * Never exceed x decimal places
   */
  function limitDP(x) {
    // If the number contains a decimal place
    // and has more than dp number of decimal places
    if(x.toString().split('.').length > 1 && x.toString().split('.')[1].length > dp) {
      x = x.toFixed(dp)
    }
    return x
  }

  /**
   * Return the CO dimension for x bricks
   */
  function CO(x) {
    return (brick + joint) * x
  }

  /**
   * Return the CO+ dimension for x bricks
   */
  function COPlus(x) {
    return CO(x) + joint
  }

  /**
   * Return the CO- dimension for x bricks
   */
  function COMinus(x) {
    return CO(x) - joint
  }

  /**
   * Given an element, determine the active CO mode
   */
  $.fn.COMode = function() {
    var active = this.parents(".uk-card").find(".uk-active")

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
      return false
    }
  }

  /**
   * Return an integer modifier to convert a CO dimension to the current mode
   */
  $.fn.COModeMod = function() {
    // Check the CO mode and add joint if CO+ or substract joint if CO-
    var mod = 0
    if(this.COMode() == "COPlus") {
      mod = joint
    }
    else if(this.COMode() == "COMinus") {
      mod = -1 * joint
    }
    return mod
  }

  /**
   * Given a dim input element, update the bricks field to correspond
   * Only configured to work for .current
   */
  $.fn.COUpdateBricks = function() {
    var dim = Number(this.val())
    console.log("Updating bricks to correspond to dim:", dim)

    // Convert the dim to a CO by subtracting the modifier then divide by CO
    var bricks = (dim + (this.COModeMod() * -1)) / CO(1)

    // Update the related bricks field
    // @todo Truncate the number to 2 decimal places
    this.parents(".current").find(".bricks").val(limitDP(bricks))

    // Update fields for next and previous
    this.COUpdateSuggestions(bricks)
  }

  /**
   * Given a bricks input element, update the dim field to correspond
   * Only configured to work for .current
   */
  $.fn.COUpdateDim = function() {
    var bricks = Number(this.val())
    console.log("Updating dim to correspond to bricks:", bricks)

    // Calculate the CO then add a modifier if required
    var dim = CO(bricks) + this.COModeMod()

    // Update the dim field
    this.parents(".current").find(".dim").val(dim)

    // Update fields for next and previous
    this.COUpdateSuggestions(bricks)
  }

  /**
   * Given an element, update the next and previous suggestion fields to correspond
   * Only configured to work for .current
   */
  $.fn.COUpdateSuggestions = function(current) {
    console.log("Updating suggestions for bricks:", current)

    // Round the current bricks value to the nearest 0.5
    // Do this by doubling it, rounding and then halving
    var double = current * 2
    double = Math.round(double)
    var nearest = double / 2
    var previous, next

    if(nearest < current) {
      console.log("Nearest is less than current")
      previous = nearest
      next = nearest + 0.5
    }
    else if(nearest > current) {
      console.log("Nearest is greater than current")
      previous = nearest - 0.5
      next = nearest
    }
    else {
      console.log("Nearest is equal to current")
      previous = nearest - 0.5
      next = nearest + 0.5
    }

    // console.log("Current:", current, "Nearest:", nearest, "Previous:", previous, "Next:", next)

    // Check the CO mode return the modifier
    var mod = this.COModeMod()

    // Update the previous and next fields
    var card = this.parents(".uk-card")
    card.find(".previous .bricks").val(previous)
    card.find(".next .bricks").val(next)

    // Calculate the CO then convert to CO- or CO+ with a modifier as appropriate
    card.find(".previous .dim").val(CO(previous) + mod)
    card.find(".next .dim").val(CO(next) + mod)
  }

  /**
   * Add a copy of the first card and place it at the end
   */
  function duplicate(dim) {
    console.log("Adding new card with dim:", dim)
    var card = $(".prototype").clone(true, true).insertBefore(".duplicate")
    card.removeClass("prototype")

    if(dim !== undefined) {
      // Update the dim value for the new card
      // Then fire the change event to ensure the related fields are updated
      card.find(".current .dim").val(dim).trigger("change")
      // @todo Set the CO Mode to the most sensible 
    }
  }

  /**
   * On page load check the hash then update and add cards accordingly
   */
  function init() {
    // Get hash params from URL
    var hash = window.location.hash.split("/").slice(1)

    // If there is a hash then cycle through each parameter and add or update the cards accordingly
    if(hash.length >= 1) {
      var i = 0
      hash.forEach(function(param) {
        var dim = Number(param)
        i++
        if(Number.isInteger(dim)) {
          if(i <= 1) {
            // Update the dim value for the first card
            // Then fire the change event to ensure the related fields are updated
            $(".card.prototype .current .dim").val(hash[0]).trigger("change")
          }
          else {
            // Add a new card using dim as the value
            duplicate(dim)
          }
        }
        else {
          console.log("Param isn't an integer:", param)
        }
      })
    }

  }

  // // // // // // // // // // // // // // // // // // // // // //
  // Events

  // When a dim input value is changed
  $("input.dim").change(function(event) {
    console.log("EVENT -- Dim input has changed")
    $(this).COUpdateBricks()
  })

  // When a bricks input value is changed
  $("input.bricks").change(function(event) {
    console.log("EVENT -- Bricks input has changed")
    $(this).COUpdateDim()
    // @todo Update the URL when the dim is changed
  })

  // When the tab changes
  // @todo Switcher event doesn't fire on duplicated cards
  UIkit.util.on('.uk-switcher', 'shown', function () {
    console.log("EVENT -- Active CO mode has changed")
    $(this).parents(".uk-card").find(".current .dim").COUpdateBricks()
  })

  // When the previous icon is clicked
  $(".previous-icon").click(function(event) {
    console.log("EVENT -- Previous icon clicked")
    event.preventDefault()
    var element = $(this)
    var previous = element.parents(".uk-card").find(".previous .bricks").val()
    element.parents(".uk-card").find(".current .bricks").val(previous).trigger("change")
  })

  // When the next icon is clicked
  $(".next-icon").click(function(event) {
    console.log("EVENT -- Next icon clicked")
    event.preventDefault()
    var element = $(this)
    var next = element.parents(".uk-card").find(".next .bricks").val()
    element.parents(".uk-card").find(".current .bricks").val(next).trigger("change")
  })

  // When duplicate icon is clicked
  $(".duplicate-icon").click(function(event) {
    console.log("EVENT -- Duplicate icon clicked")
    event.preventDefault()
    duplicate(900)
  })

  // @todo Remember state of images toggle on change event

  // // // // // // // // // // // // // // // // // // // // // //
  // Init

  init()
})