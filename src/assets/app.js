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
    var active = this.card('.uk-active')

    if(active.hasClass('CO')) {
      return 'CO'
    }
    else if(active.hasClass('COPlus')) {
      return 'COPlus'
    }
    else if(active.hasClass('COMinus')) {
      return 'COMinus'
    }
    else {
      return false
    }
  }

  /**
   * Return an integer modifier to convert a CO dimension to the current mode
   */
  $.fn.COMod = function(mode) {
    if(mode == undefined) {
      mode = this.COMode()
    }
    // Check the CO mode and add joint if CO+ or substract joint if CO-
    var mod = 0
    if(mode == 'COPlus') {
      mod = joint
    }
    else if(mode == 'COMinus') {
      mod = -1 * joint
    }
    return mod
  }


  /**
   * Given an element, return the index of its parent card
   */
  $.fn.cardIndex = function() {
    return $('.card').index($(this).parents('.card'))
  }


  /**
   * Given an element, return the index of its parent card
   */
  $.fn.card = function(string) {
    return $(this).parents('.card').find(string)
  }

  /**
   * Given a dim input element, update the bricks field to correspond
   * Only configured to work for .current
   */
  $.fn.COUpdateBricks = function(mode) {
    var dim = Number(this.val())
    console.log('Updating bricks to correspond to dim:', dim)

    // Convert the dim to a CO by subtracting the modifier then divide by CO
    var bricks = (dim + (this.COMod(mode) * -1)) / CO(1)

    // Update the related bricks field
    this.parents('.current').find('.bricks').val(limitDP(bricks))

    // Update fields for next and previous
    this.COUpdateSuggestions(bricks, mode)
  }

  /**
   * Given a bricks input element, update the dim field to correspond
   * Only configured to work for .current
   */
  $.fn.COUpdateDim = function(mode) {
    var bricks = Number(this.val())
    console.log('Updating dim to correspond to bricks:', bricks)

    // Calculate the CO then add a modifier if required
    var dim = CO(bricks) + this.COMod(mode)

    // Update the dim field
    this.parents('.current').find('.dim').val(dim)

    // Update fields for next and previous
    this.COUpdateSuggestions(bricks, mode)
  }

  /**
   * Given an element, update the next and previous suggestion fields to correspond
   * Only configured to work for .current
   */
  $.fn.COUpdateSuggestions = function(current, mode) {
    console.log('Updating suggestions for bricks:', current)

    // Round the current bricks value to the nearest 0.5
    // Do this by doubling it, rounding and then halving
    var double = current * 2
    double = Math.round(double)
    var nearest = double / 2
    var previous, next

    if(nearest < current) {
      console.log('Nearest is less than current')
      previous = nearest
      next = nearest + 0.5
    }
    else if(nearest > current) {
      console.log('Nearest is greater than current')
      previous = nearest - 0.5
      next = nearest
    }
    else {
      console.log('Nearest is equal to current')
      previous = nearest - 0.5
      next = nearest + 0.5
    }

    // console.log('Current:', current, 'Nearest:', nearest, 'Previous:', previous, 'Next:', next)

    // Check the CO mode return the modifier
    var mod = this.COMod(mode)

    // Update the previous and next fields
    this.card('.previous .bricks').val(previous)
    this.card('.next .bricks').val(next)

    // Calculate the CO then convert to CO- or CO+ with a modifier as appropriate
    this.card('.previous .dim').val(CO(previous) + mod)
    this.card('.next .dim').val(CO(next) + mod)
  }

  /**
   * Add a copy of the first card and place it at the end
   */
  function duplicate(dim) {
    console.log('Adding new card with dim:', dim)
    var card = $('.prototype').clone(true, true).insertBefore('.duplicate')
    card.removeClass('prototype')

    // Clear the diagram and init a new one
    var d = card.find('.diagram').empty()
    diagrams.push(new Diagram(d))

    if(dim !== undefined) {
      // Update the dim value for the new card
      // Then fire the change event to ensure the related fields are updated
      card.find('.current .dim').val(dim).trigger('keyup')
      // @todo Set the CO Mode to the most sensible 
    }
  }

  /**
   * On page load check the hash then update and add cards accordingly
   */
  function init() {
    // Get hash params from URL
    var hash = window.location.hash.split('/').slice(1)

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
            $('.card.prototype .current .dim').val(hash[0]).trigger('keyup')
          }
          else {
            // Add a new card using dim as the value
            duplicate(dim)
          }
        }
        else {
          console.log('Param isn\'t an integer:', param)
        }
      })
    }

  }

  // // // // // // // // // // // // // // // // // // // // // //
  // Diagram
  
  var diagrams = []

  function Diagram(element) {
    this.x = 0
    this.y = 0
    this.draw = null

    // Given the div a unique id
    var id = 'diagram-' + element.cardIndex()
    element.attr('id', id)

    // Init SVG.js
    this.draw = SVG(id)
    this.viewbox(element.COMode(), false)
    this.draw.attr('preserveaspectratio', 'xMidYMid meet')

    // Draw sequences of bricks
    this.doubleLeaf(4)
    this.doubleLeaf(4, 'dashed')
    this.doubleLeaf(4)
    this.doubleLeaf(4, 'dashed')
    this.doubleLeaf(4)
    this.turn(4)
    this.doubleLeaf(10)

    // Draw the dimensions
    this.dim()

    return this
  }

  Diagram.prototype.doubleLeaf = function(n, style) {
    if(style == undefined) {
      style = 'default'
    }
    for(var i = 0; i < n; i++) {
      this.draw.rect(COMinus(1), COMinus(0.5))
        .addClass(style)
        .move(this.x + CO(i), this.y)

      this.draw.rect(COMinus(1), COMinus(0.5))
        .addClass(style)
        .move(this.x + CO(i), this.y + CO(0.5))
    }

    this.x = this.x + CO(n)
    this.y = this.y + 0

  }

  Diagram.prototype.turn = function() {
    this.draw.rect(COMinus(1), COMinus(0.5))
      .addClass('default')
      .move(this.x + CO(0), this.y)
    this.draw.rect(COMinus(0.5), COMinus(1))
      .addClass('default')
      .move(this.x, this.y + CO(0.5))
    this.draw.rect(COMinus(0.5), COMinus(1))
      .addClass('default')
      .move(this.x + CO(0.5), this.y + CO(0.5))
    this.draw.rect(COMinus(1), COMinus(0.5))
      .addClass('default')
      .move(this.x + CO(0), this.y + CO(1.5))

    this.x = this.x + CO(1)
    this.y = this.y + CO(1)

  }

  Diagram.prototype.dim = function() {
    this.dimVertical(CO(8))
    this.dimHorizontal(CO(8), COMinus(4), 'CO-')
    this.dimVertical(COMinus(12))
    this.dimHorizontal(COMinus(12), COPlus(4), 'CO+')
    this.dimVertical(CO(16))
    this.dimHorizontal(CO(16), CO(4), 'CO')
    this.dimVertical(CO(20))
  }

  Diagram.prototype.dimHorizontal = function(x, width, label) {
    this.draw.line(width, 0, 0, 0)
      .move(x, CO(2.5))
    this.draw.text(label)
      .move(x + COMinus(2), CO(2.75))
  }

  Diagram.prototype.dimVertical = function(x) {
    this.draw.line(0, COMinus(2), 0, 0)
      .move(x, COPlus(1))
    this.draw.line(COMinus(0.5), COMinus(0.5), 0, 0)
      .addClass('diagonal')
      .move(x - CO(0.25), CO(2.25))
  }

  Diagram.prototype.viewbox = function(mode, animate) {
    var start
    if(mode == 'COMinus') {
      start = 2
    }
    else if(mode == 'COPlus') {
      start = 6
    }
    else {
      start = 10
    }

    if(animate === false) {
      this.draw.viewbox(CO(start), CO(-0.5), COMinus(16), 1000)
    }
    else {
      this.draw.animate().viewbox(CO(start), CO(-0.5), COMinus(16), 1000)
    }
  }

  // // // // // // // // // // // // // // // // // // // // // //
  // Events

  // When a dim input value is changed
  $('input.dim').keyup(function(event) {
    console.log('EVENT -- Dim input has changed')

    if(event.key == 'ArrowUp') {
      $(this).card('.next-icon').trigger('click')
    }
    else if(event.key == 'ArrowDown') {
      $(this).card('.previous-icon').trigger('click')
    }
    else {
      $(this).COUpdateBricks()
    }
  })

  // When a bricks input value is changed
  $('input.bricks').keyup(function(event) {
    console.log('EVENT -- Bricks input has changed')

    if(event.key == 'ArrowUp') {
      $(this).card('.next-icon').trigger('click')
    }
    else if(event.key == 'ArrowDown') {
      $(this).card('.previous-icon').trigger('click')
    }
    else {
      $(this).COUpdateDim()
      // @todo Update the URL when the dim is changed
    }
  })

  // When the tab changes
  $('.COMode li').click(function() {
    console.log('EVENT -- Active CO mode has changed')
    var mode = $(this).attr('class').split(' ')[0]
    $(this).card('.current .dim').COUpdateBricks(mode)
    diagrams[$(this).cardIndex()].viewbox(mode)
  })

  // When the previous icon is clicked
  $('.previous-icon').click(function(event) {
    console.log('EVENT -- Previous icon clicked')
    event.preventDefault()
    var element = $(this)
    var previous = element.card('.previous .bricks').val()
    element.card('.current .bricks').val(previous).trigger('keyup')
  })

  // When the next icon is clicked
  $('.next-icon').click(function(event) {
    console.log('EVENT -- Next icon clicked')
    event.preventDefault()
    var element = $(this)
    var next = element.card('.next .bricks').val()
    element.card('.current .bricks').val(next).trigger('keyup')
  })

  // When duplicate icon is clicked
  $('.duplicate-icon').click(function(event) {
    console.log('EVENT -- Duplicate icon clicked')
    event.preventDefault()
    duplicate(890)
  })

  // @todo remember state of images toggle on change event

  // // // // // // // // // // // // // // // // // // // // // //
  // Init

  init()
  diagrams.unshift( new Diagram($('.card .diagram')))

})