/* eslint-env mocha */
// These are Chimp globals */
/* globals browser assert server */

var getMeteorSettings = function (setting) {
  return Meteor.settings[setting];
};

const countLists = () => {
  browser.waitForExist('.list-todo');
  const elements = browser.elements('.list-todo');
  return elements.value.length;
};

describe('list ui', () => {
  beforeEach(() => {
    var result = server.call('generateFixtures');
    browser.url('http://localhost:3100');
  });

  it('can create a list @watch', () => {
    const initialCount = countLists();

    browser.click('.link-list-new');

    var mySetting = server.execute(getMeteorSettings, 'public');
    console.log('>>>>', mySetting);


    assert.equal(countLists(), initialCount + 1);
  });
});
