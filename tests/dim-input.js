// jshint ignore: start

import { Selector } from 'testcafe'

fixture `Dim input`
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
    .typeText(currentDim, '720', { replace: true })
    .expect(currentDim.value).eql('720', 'Current dim')
    .expect(previousDim.value).eql('665', 'Previous dim')
    .expect(nextDim.value).eql('777.5', 'Next dim')
    .expect(currentBricks.value).eql('3.244', 'Current bricks')
    .expect(previousBricks.value).eql('3', 'Previous bricks')
    .expect(nextBricks.value).eql('3.5', 'Next bricks')
})

test('CO+', async t => {
  await t
    .click(Selector('.card').nth(0).find('.COPlus'))
    .typeText(currentDim, '1125', { replace: true })
    .expect(currentDim.value).eql('1125', 'Current dim')
    .expect(previousDim.value).eql('1022.5', 'Previous dim')
    .expect(nextDim.value).eql('1135', 'Next dim')
    .expect(currentBricks.value).eql('4.956', 'Current bricks')
    .expect(previousBricks.value).eql('4.5', 'Previous bricks')
    .expect(nextBricks.value).eql('5', 'Next bricks')
})

test('CO', async t => {
  await t
    .click(Selector('.card').nth(0).find('.CO'))
    .typeText(currentDim, '720', { replace: true })
    .expect(currentDim.value).eql('720', 'Current dim')
    .expect(previousDim.value).eql('675', 'Previous dim')
    .expect(nextDim.value).eql('787.5', 'Next dim')
    .expect(currentBricks.value).eql('3.2', 'Current bricks')
    .expect(previousBricks.value).eql('3', 'Previous bricks')
    .expect(nextBricks.value).eql('3.5', 'Next bricks')
})