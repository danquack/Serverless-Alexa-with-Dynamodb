
import { BaseHandler } from '../BaseHandler';
import { expect } from 'chai';
import 'mocha';

describe('True to be True', () => {
  it('true should be true', () => {
    expect(true).to.be.true;
  });
});