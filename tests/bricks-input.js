// jshint ignore: start

import { Selector } from 'testcafe'

fixture `Bricks input`
  .page `http://localhost:1337/`

// // // // // // // // // // // // // // // // // // // // // //
// Selectors

const currentDim = Selector('.card .current .dim').nth(0)
const previousDim = Selector('.card .previous .dim').nth(0)
const nextDim = Selector('.card .next .dim').nth(0)
const currentBricks = Selector('.card .current .bricks').nth(0)
const previousBricks = Selector('.card .previous .bricks').nth(0)
const nextBricks = Selector('.card .next .bricks').nth(0)

// // // // // // // // // // // // // // // // // // // // // //
// Tests

test('CO-', async t => {
  await t
    .typeText(currentBricks, '5', { replace: true })
    .expect(currentDim.value).eql('1115', 'Current dim')
    .expect(previousDim.value).eql('1002.5', 'Previous dim')
    .expect(nextDim.value).eql('1227.5', 'Next dim')
    .expect(currentBricks.value).eql('5', 'Current bricks')
    .expect(previousBricks.value).eql('4.5', 'Previous bricks')
    .expect(nextBricks.value).eql('5.5', 'Next bricks')
})

test('CO+', async t => {
  await t
    .click(Selector('.card').nth(0).find('.COPlus'))
    .typeText(currentBricks, '3.2', { replace: true })
    .expect(currentDim.value).eql('730', 'Current dim')
    .expect(previousDim.value).eql('685', 'Previous dim')
    .expect(nextDim.value).eql('797.5', 'Next dim')
    .expect(currentBricks.value).eql('3.2', 'Current bricks')
    .expect(previousBricks.value).eql('3', 'Previous bricks')
    .expect(nextBricks.value).eql('3.5', 'Next bricks')
})

test('CO', async t => {
  await t
    .click(Selector('.card').nth(0).find('.CO'))
    .typeText(currentBricks, '5', { replace: true })
    .expect(currentDim.value).eql('1125', 'Current dim')
    .expect(previousDim.value).eql('1012.5', 'Previous dim')
    .expect(nextDim.value).eql('1237.5', 'Next dim')
    .expect(currentBricks.value).eql('5', 'Current bricks')
    .expect(previousBricks.value).eql('4.5', 'Previous bricks')
    .expect(nextBricks.value).eql('5.5', 'Next bricks')
})