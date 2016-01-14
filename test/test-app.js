'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var fs = require('fs-extra');

describe('json model with Options', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        // `dir` is the path to the new temporary directory
        fs.mkdirsSync(path.join(dir, 'test/fixtures'));
        fs.copySync(path.join(__dirname, './fixtures'), path.join(dir, 'test/fixtures'));

      })
      .withOptions({ schemaPath: 'test/fixtures/error.json' })
      .on('end', done);
  });

  
  it('test 1', function(done){

    done();
  });
});


describe('json model with user prompt', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        // `dir` is the path to the new temporary directory
        fs.mkdirsSync(path.join(dir, 'test/fixtures'));
        fs.copySync(path.join(__dirname, './fixtures'), path.join(dir, 'test/fixtures'));

      })
      .withPrompts({ schemaPath: 'test/fixtures/error.json'})
      .on('end', done);
  });

  
  it('test 1', function(done){

    done();
  });
});
