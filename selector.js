const selectorRe = /([.#:[])([-\w]+)(?:\((.+?)\)|([~^$*|]?)=(("|')(?:\\?.)*?\6|[-\w]+))?]?/g;
const selectorLastRe = /([~\s>+]*)(?:("|')(?:\\?.)*?\2|\(.+?\)|\[.+?\]|[^\s+>\[\]])+$/;
const selectorSplitRe = /\s*,\s*(?=(?:[^'"()]|"(?:\\?.)*?"|'(?:\\?.)*?'|\(.+?\))+$)/;
const selectorCache = {};
const selectorMap = {
  "any": "m(_,v)",
  "empty": "!_.lastChild",
  "enabled": "!m(_,':disabled')",
  "first-child": "(a=_.parentNode)&&a.firstChild===_",
  "first-of-type": "!p(_,_.tagName)",
  "lang": "m(c(_,'[lang]'),'[lang|='+v+']')",
  "last-child": "(a=_.parentNode)&&a.lastChild===_",
  "last-of-type": "!n(_,_.tagName)",
  "link": "m(_,'a[href]')",
  "not": "!m(_,v)",
  "nth-child": "(a=2,'odd'===v?b=1:'even'===v?b=0:a=1 in(v=v.split('n'))?(b=v[1],v[0]):(b=v[0],0),v=_.parentNode.childNodes,v=1+v.indexOf(_),0===a?v===b:('-'===a||0===(v-b)%a)&&(0<a||v<=b))",
  "only-child": "(a=_.parentNode)&&a.firstChild===a.lastChild",
  "only-of-type": "!p(_,_.tagName)&&!n(_,_.tagName)",
  "optional": "!m(_,':required')",
  "root": "(a=_.parentNode)&&!a.tagName",
  "scope": "true",
  ".": "~_.className.split(/\\s+/).indexOf(a)",
  "#": "_.id===a",
  "^": "!a.indexOf(v)",
  "|": "a.split('-')[0]===v",
  "$": "a.slice(-v.length)===v",
  "~": "~a.split(/\\s+/).indexOf(v)",
  "*": "~a.indexOf(v)",
  ">>": "m(_.parentNode,v)",
  "++": "m(_.previousSibling,v)",
  "~~": "p(_,v)",
  "": "c(_.parentNode,v)"
};
selectorMap["nth-last-child"] = selectorMap["nth-child"].replace("1+", "v.length-");

function selectorFn(str) {
  // jshint evil:true
  return selectorCache[str] ||
  (selectorCache[str] = Function("m,c,n,p", "return function(_,v,a,b){return " +
    str.split(selectorSplitRe).map(function(sel) {
      var relation, from
      , rules = ["_&&_.nodeType==1"]
      , parentSel = sel.replace(selectorLastRe, function(_, _rel, a, start) {
        from = start + _rel.length
        relation = _rel.trim()
        return ""
      })
      , tag = sel.slice(from).replace(selectorRe, function(_, op, key, subSel, fn, val, quotation) {
        rules.push(
          "((v='" +
          (subSel || (quotation ? val.slice(1, -1) : val) || "").replace(/'/g, "\\'") +
          "'),(a='" + key + "'),1)"
          ,
          selectorMap[op === ":" ? key : op] ||
          "(a=_.ownerDocument.defaultView.Element.prototype.getAttribute.call(_,a))" +
          (fn ? "&&" + selectorMap[fn] : val ? "===v" : "!==null")
        )
        return ""
      })

      if (tag && tag !== "*") rules[0] += "&&_.tagName&&_.tagName.toUpperCase()==='" + tag.toUpperCase() + "'"
      if (parentSel) {
        rules.push("(v='" + parentSel + "')", selectorMap[relation + relation]);
      }
      return rules.join("&&")
    }).join("||") + "}"
  )(matches, closest, next, prev))
}


function walk(next, el, sel, first, nextFn) {
  var out = []
  sel = selectorFn(sel)
  for (; el; el = el[next] || nextFn && nextFn(el)) if (sel(el)) {
    if (first) return el
    out.push(el)
  }
  return first ? null : out
}

function find(node, sel, first = false) {
  sel = selectorFn(sel);
  if (first) {
    return node.traverse(el => {
      if (sel(el)) {
        return el;
      }
    }) || null;
  } else {
    const result = [];
    node.traverse(el => {
      if (sel(el)) {
        result.push(el);
      }
    });
    return result;
  }
}

function matches(el, sel) {
  return Boolean(selectorFn(sel)(el));
}

function closest(el, sel) {
  return walk("parentNode", el, sel, 1)
}

function next(el, sel) {
  return walk("nextSibling", el.nextSibling, sel, 1)
}

function prev(el, sel) {
  return walk("previousSibling", el.previousSibling, sel, 1)
}

exports.find = find;
exports.matches = matches;
exports.closest = closest;
exports.next = next;
exports.prev = prev;
