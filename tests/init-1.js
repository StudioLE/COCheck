// jshint ignore: start

import { Selector } from 'testcafe'

fixture `Init prototype`
  .page `http://localhost:1337/src/#!/1125/720`

// // // // // // // // // // // // // // // // // // // // // //
// Selectors

const currentDim = Selector('.card.prototype .current .dim')
const previousDim = Selector('.card.prototype .previous .dim')
const nextDim = Selector('.card.prototype .next .dim')
const currentBricks = Selector('.card.prototype .current .bricks')
const previousBricks = Selector('.card.prototype .previous .bricks')
const nextBricks = Selector('.card.prototype .next .bricks')

// // // // // // // // // // // // // // // // // // // // // //
// Tests

test('CO-', async t => {
  await t
    .expect(currentDim.value).eql('1125', 'Current dim')
    .expect(previousDim.value).eql('1115', 'Previous dim')
    .expect(nextDim.value).eql('1227.5', 'Next dim')
    .expect(currentBricks.value).eql('5.044', 'Current bricks')
    .expect(previousBricks.value).eql('5', 'Previous bricks')
    .expect(nextBricks.value).eql('5.5', 'Next bricks')
})

test('CO+', async t => {
  await t
    .click(Selector('.card.prototype .COPlus'))
    .expect(currentDim.value).eql('1125', 'Current dim')
    .expect(previousDim.value).eql('1022.5', 'Previous dim')
    .expect(nextDim.value).eql('1135', 'Next dim')
    .expect(currentBricks.value).eql('4.956', 'Current bricks')
    .expect(previousBricks.value).eql('4.5', 'Previous bricks')
    .expect(nextBricks.value).eql('5', 'Next bricks')
})

test('CO', async t => {
  await t
    .click(Selector('.card.prototype .CO'))
    .expect(currentDim.value).eql('1125', 'Current dim')
    .expect(previousDim.value).eql('1012.5', 'Previous dim')
    .expect(nextDim.value).eql('1237.5', 'Next dim')
    .expect(currentBricks.value).eql('5', 'Current bricks')
    .expect(previousBricks.value).eql('4.5', 'Previous bricks')
    .expect(nextBricks.value).eql('5.5', 'Next bricks')
})