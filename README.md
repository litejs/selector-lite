[3]: https://badgen.net/coveralls/c/github/litejs/selector-lite
[4]: https://coveralls.io/r/litejs/selector-lite
[5]: https://badgen.net/packagephobia/install/selector-lite
[6]: https://packagephobia.now.sh/result?p=selector-lite
[7]: https://badgen.net/badge/icon/Buy%20Me%20A%20Tea/orange?icon=kofi&label
[8]: https://www.buymeacoffee.com/lauriro


Selector lite &ndash; [![Coverage][3]][4] [![Size][5]][6] [![Buy Me A Tea][7]][8]
=============

A small pure-JavaScript CSS selector engine.

 - no library dependencies
 - CSS 3 Selector support
 - only 2KB minified and 1KB gzipped

Examples
--------

```javascript
var selector = require("selector-lite")

// Can be used to implement browser built-in functions.

function getElementById(id) {
    return selector.find(this, "#" + id, true)
}
function getElementsByTagName(tag) {
    return selector.find(this, tag)
}
function getElementsByClassName(sel) {
    return selector.find(this, "." + sel.replace(/\s+/g, "."))
}
function querySelector(sel) {
    return selector.find(this, sel, true)
}
function querySelectorAll(sel) {
    return selector.find(this, sel)
}
```

Methods
-------

 - selector.`find(node, selector, returnFirstMatch)` - Find matching elements like querySelector.
 - selector.`matches(node, selector)` - Returns a Boolean indicating whether or not
   the element would be selected by the specified selector string.
 - selector.`closest(selector)` - Returns the Element, descendant of this element
   (or this element itself), that is the closest ancestor of the elements
   selected by the selectors given in parameter.
 - selector.`next(selector)` - Retrieves the next sibling that matches selector.
 - selector.`prev(selector)` - Retrieves the preceding sibling that matches selector.


Custom selectors
----------------

Custom selector can be added to selector.selectorMap,
where method shortcuts are available (m->matches, c->closest, n->next, p->prev).

 - `_` - node.
 - `v` - part between `()` in `:nth-child(2n+1)`.
 - `a` and `b` can be used as temp variables.

```javascript
// Add `:input` selector
selector.selectorMap.input = "_.tagName=='INPUT'"

// Add `:val()` selector
selector.selectorMap.val = "_.value==v"
```

## Contributing

Follow [Coding Style Guidelines](https://github.com/litejs/litejs/wiki/Style-Guidelines)

Run tests

```
npm install
npm test
```

## External links

[GitHub repo](https://github.com/litejs/selector-lite) |
[npm package](https://npmjs.org/package/selector-lite) |
[DOM spec](https://dom.spec.whatwg.org/) |
[Selectors Level 3](http://www.w3.org/TR/selectors/) |
[Coveralls coverage](https://coveralls.io/github/litejs/selector-lite)  
[Buy Me A Tea][8]


## Licence

Copyright (c) 2015-2021 Lauri Rooden &lt;lauri@rooden.ee&gt;  
[The MIT License](http://lauri.rooden.ee/mit-license.txt)


