/**
 * coolie-parser-css
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 */


'use strict';

var object = require('blear.utils.object');
var CSSTree = require('csstree');

var defaults = {
    /**
     * 源文件
     * @type String | null
     */
    source: null
};

module.exports = function (css, options) {
    options = object.assign({}, defaults, options);
    var tree = new CSSTree(css);
    var traveler = function (branches) {
        var ast = [];

        branches.forEach(function (branch) {
            var node = {};

            if ('comment' in branch) {
                node.type = 'comment';
                node.value = branch.comment;
                node.start = branch.position.range.start;
                node.end = branch.position.range.end + 1/* / */;
            } else if ('atrule' in branch) {
                node.type = 'at';
                node.name = branch.parts.shift().slice(1);
                node.value = branch.parts;
                node.start = branch.position.range.start;
                node.end = branch.position.range.end + 1/* } */;

                if (branch.branches && branch.branches.length > 0) {
                    node.styles = traveler(branch.branches);
                }
            } else {
                node.type = 'style';
                node.selector = branch.selector;
                node.start = branch.position.range.start;
                node.end = branch.position.range.end + 1/* } */;
                node.rules = branch.rules.map(function (rule) {
                    return {
                        prop: rule.property,
                        value: rule.parts,
                        start: rule.position.range.start,
                        end: rule.position.range.end + 1
                    };
                });
            }

            ast.push(node);
        });

        return ast;
    };
    var ast = traveler(tree.branches);
    ast.css = css;
    return ast;
};
