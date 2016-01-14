'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var wreck = require('wreck');
var util = require('util');
var debuglog = util.debuglog('jsonmodel');

module.exports = yeoman.generators.Base.extend({
    
    _resolve: function (schemaPath, cb) {
        var self =this;

        if (!schemaPath) {
            cb(new Error('Empty schemaPath'));
            return;
        }

        if (schemaPath.indexOf('http') === 0) {
            //Remote URL
            debuglog('Remote schemaPath %s', schemaPath);          
            wreck.get(schemaPath, function (err, res, payload) {
                if (err) {
                    cb(err);
                    return;
                }
                if (res.statusCode !== 200) {
                    cb(new Error('Unable to resolve schemaPath ' + schemaPath));
                    return;
                }
                //Save the payload as the schema
                self.schema = payload;
                self.schemaPath = schemaPath;
                cb(null, self.schemaPath);
                return;
            });
        } else {
            //Local path
            self.schemaPath = path.resolve(schemaPath);
            debuglog('Local schemaPath %s', self.schemaPath);
            
            cb(null, self.schemaPath);
            return;
        }
    },

    _skipPrompt: function (cb) {

        if (!this.options.schemaPath) {
            debuglog('Empty schemaPath option. Prompt for user input.');
            cb(null, false);
            return;
        }

        this._resolve(this.options.schemaPath, function (err, resolved) {
            if (err) {
                cb(err);
                return;
            }

            cb(null, resolved);
        });
    },

    constructor: function () {
        var self = this;
        yeoman.generators.Base.apply(self, arguments);
        self.option('schemaPath');
    },

    prompting: function () {
        
        var self = this;
        var done = self.async();
        //Check if user input is required or not?     
        this._skipPrompt(function (err, skipPrompt) {
            if (err) {
                done(err);
                return;
            }
            if (skipPrompt) {
                debuglog('vaild schemaPath option. Skip user prompt.');
                done();
                return;
            }
            self.log(yosay('Welcome to the marvelous ' + chalk.red('Jsonmodel') + ' generator!'));
            
            var prompts = [{
                name: 'schemaPath',
                message: 'Enter the json schema path (or URL):',
                required: true
            }];
            self.prompt(prompts, function (inputs) {
                self.inputs = inputs;

                debuglog('User entered schemaPath %s', self.inputs.schemaPath);

                self._resolve(self.inputs.schemaPath, function (err, resolved) {
                    if (err) {
                        debuglog('Error in resolving schemaPath %s', resolved);
                        done(err);
                        return;
                    }
                    debuglog('Resolved schemaPath %s successfully', resolved);
                    self.schemaPath = resolved;
                    done();
                });
                done();
            }.bind(self));

        });
    },

    loadSchema: function () {
        var self = this;

        if (!self.schema) {
            debuglog('Load the schema from schemaPath %s', self.schemaPath);
            self.schemaJSON = self.fs.readJSON(self.schemaPath);
        } else {
            debuglog('Parse the schema content');
            self.schemaJSON = JSON.parse(self.schema);
        }
    },

    print: function () {

        console.log(this.schemaJSON);
    }
    // ,
    // writing: {
    //     app: function () {
    //       this.fs.copy(
    //         this.templatePath('_package.json'),
    //         this.destinationPath('package.json')
    //       );
    //       this.fs.copy(
    //         this.templatePath('_bower.json'),
    //         this.destinationPath('bower.json')
    //       );
    //     },
    // }
});
