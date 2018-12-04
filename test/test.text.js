/**
 * mocha 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var expect = require('chai-jasmine').expect;
var parser = require('../src/index.js');
var fs = require('fs');
var path = require('path');

describe('parser', function () {
    it('基本', function () {
        var css = fs.readFileSync(path.join(__dirname, 'css.css'), 'utf8');
        var ast = parser(css);

        expect(ast.css).toBe(css);
        expect(ast.length).toBe(8);

        expect(ast[0].type).toBe('at');
        expect(ast[1].type).toBe('comment');
        expect(ast[2].type).toBe('at');
        expect(ast[3].type).toBe('at');
        expect(ast[4].type).toBe('style');

        expect(ast[3].styles.length).toBe(1);
        expect(ast[3].styles[0].rules.length).toBe(3);
        expect(ast[3].styles[0].rules[0].prop).toBe('background');
        expect(ast[3].styles[0].rules[0].value[0]).toBe('lightgreen');
        expect(ast[3].styles[0].rules[0].value[1]).toBe('url(image.png)');
        expect(ast[3].styles[0].rules[0].value[2]).toBe('center');
        expect(ast[3].styles[0].rules[0].value[3]).toBe('no-repeat');
    });
});

