// This file will be auto-imported in the app-test context, ensuring the method is always available

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import { Promise } from 'meteor/promise';
import { _ } from 'meteor/underscore';

// Convert an NPM-style function returning a callback to one that returns a Promise.
export const denodeify = f => (...args) => new Promise((resolve, reject) => {
  f(...args, (err, val) => {
    if (err) {
      reject(err);
    } else {
      resolve(val);
    }
  });
});

const createList = (userId) => {
  const list = Factory.create('list', { userId });
  _.times(3, () => Factory.create('todo', { listId: list._id }));
  return list;
};

Meteor.methods({
  generateFixtures() {
    resetDatabase();

    // create 3 public lists
    _.times(3, () => createList());

    // create 3 private lists
    _.times(3, () => createList(Random.id()));
  },
});

let generateData;
if (Meteor.isClient) {
  // Create a second connection to the server to use to call test data methods
  // We do this so there's no contention w/ the currently tested user's connection
  const testConnection = Meteor.connect(Meteor.absoluteUrl());

  // generateData = Promise.denodeify((cb) => {
  generateData = denodeify((cb) => {
    testConnection.call('generateFixtures', cb);
  });
}

const generateDataExport = generateData;

export { generateDataExport };
