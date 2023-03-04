/* eslint-disable */
// based on https://dribbble.com/shots/3913847-404-page

const pageX = $(document).width()
const pageY = $(document).height()
let mouseY = 0
let mouseX = 0

$(document).mousemove(function (event) {
  // verticalAxis
  mouseY = event.pageY
  const yAxis = (pageY / 2 - mouseY) / pageY * 300
  // horizontalAxis
  mouseX = event.pageX / -pageX
  const xAxis = -mouseX * 100 - 100

  $('.box__ghost-eyes').css({ transform: 'translate(' + xAxis + '%,-' + yAxis + '%)' })

  // console.log('X: ' + xAxis);
})
