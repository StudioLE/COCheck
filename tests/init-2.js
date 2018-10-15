// jshint ignore: start

import { Selector } from 'testcafe'

fixture `Init nth child`
  .page `http://localhost:1337/src/#!/1125/720`

// // // // // // // // // // // // // // // // // // // // // //
// Selectors

const currentDim = Selector('.card .current .dim').nth(1)
const previousDim = Selector('.card .previous .dim').nth(1)
const nextDim = Selector('.card .next .dim').nth(1)
const currentBricks = Selector('.card .current .bricks').nth(1)
const previousBricks = Selector('.card .previous .bricks').nth(1)
const nextBricks = Selector('.card .next .bricks').nth(1)

// // // // // // // // // // // // // // // // // // // // // //
// Tests

test('CO', async t => {
  await t
    .expect(currentDim.value).eql('720', 'Current dim')
    .expect(previousDim.value).eql('675', 'Previous dim')
    .expect(nextDim.value).eql('787.5', 'Next dim')
    .expect(currentBricks.value).eql('3.2', 'Current bricks')
    .expect(previousBricks.value).eql('3', 'Previous bricks')
    .expect(nextBricks.value).eql('3.5', 'Next bricks')
})

test('CO+', async t => {
  await t
    .click(Selector('.card').nth(1).find('.COPlus'))
    .expect(currentDim.value).eql('720', 'Current dim')
    .expect(previousDim.value).eql('685', 'Previous dim')
    .expect(nextDim.value).eql('797.5', 'Next dim')
    .expect(currentBricks.value).eql('3.244', 'Current bricks')
    .expect(previousBricks.value).eql('3', 'Previous bricks')
    .expect(nextBricks.value).eql('3.5', 'Next bricks')
})

test('CO-', async t => {
  await t
    .click(Selector('.card').nth(1).find('.COMinus'))
    .expect(currentDim.value).eql('720', 'Current dim')
    .expect(previousDim.value).eql('665', 'Previous dim')
    .expect(nextDim.value).eql('777.5', 'Next dim')
    .expect(currentBricks.value).eql('3.156', 'Current bricks')
    .expect(previousBricks.value).eql('3', 'Previous bricks')
    .expect(nextBricks.value).eql('3.5', 'Next bricks')
})