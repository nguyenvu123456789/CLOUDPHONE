// @ts-check
/**
 * @see https://github.com/luke-chang/js-spatial-navigation/blob/master/spatial_navigation.js
 * # nodeType
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
 */
import { doc, win } from "win-doc";
import getWindowOffset from "get-window-offset";
import callfunc from "call-func";
import ucfirst from "ucfirst-js";

/**
 * @type string
 */
let _lastSectionId = "";
let _sectionCount = 0;
let _idPool = 0;
let _pause = false;
let _duringFocusChange = false;
const EVENT_PREFIX = "sn:";
const ID_POOL_PREFIX = "section-";

/**
 * @type any
 */
const _sections = {};

/**
 * @typedef {UP|RIGHT|DOWN|LEFT} DirectionType
 */
const UP = "up";
const RIGHT = "right";
const DOWN = "down";
const LEFT = "left";
/**
 * @type {{[key: string]:DirectionType}}
 */
const KEYMAPPING = {
  ArrowUp: UP,
  ArrowRight: RIGHT,
  ArrowDown: DOWN,
  ArrowLeft: LEFT,
};

/**
 * @typedef {object} SpatialNavigationConfigs
 * @property {string=} selector
 * @property {string=} defaultElement
 * @property {string=} enterTo
 * @property {string=} restrict
 * @property {string=} tabIndexIgnoreList
 * @property {number=} straightOverlapThreshold
 * @property {boolean=} straightOnly
 * @property {boolean=} disabled
 * @property {any=} events
 */

/**
 * @type SpatialNavigationConfigs
 */
const GlobalConfig = {
  selector: "", // can be a valid <extSelector> except "@" syntax.
  defaultElement: "", // <extSelector> except "@" syntax.
  straightOnly: false,
  straightOverlapThreshold: 0.5,
  disabled: false,
  enterTo: "", // '', 'last-focused', 'default-element'
  restrict: "self-first", // 'self-first', 'self-only', 'none'
  tabIndexIgnoreList:
    "a, input, select, textarea, button, iframe, [contentEditable=true]",
  events: {},
};

class RectType {
  /**
   * @type {number}
   */
  left;
  /**
   * @type {number}
   */
  top;
  /**
   * @type {number}
   */
  right;
  /**
   * @type {number}
   */
  bottom;
  /**
   * @type {number}
   */
  width;
  /**
   * @type {number}
   */
  height;
  /**
   * @type {Element}
   */
  element;
  /**
   * @type {RectCenterType}
   */
  center;
}

class RectCenterType {
  /**
   * @type {number}
   */
  x;
  /**
   * @type {number}
   */
  y;
}

class GetNextNodeProps {
  /**
   * @type DirectionType
   */
  direction;
  /**
   * @type Element
   */
  currentFocusedElement;
  /**
   * @type string
   */
  currentSectionId;
}

/**
 * @param {string|any} selector
 * @returns {HTMLElement[]}
 */
const parseSelector = (selector) => {
  /**
   * @type HTMLElement[]
   */
  let result = [];
  try {
    if (selector) {
      if (typeof selector === "string") {
        result = [].slice.call(document.querySelectorAll(selector));
      } else if (typeof selector === "object" && selector.length) {
        result = [].slice.call(selector);
      } else if (typeof selector === "object" && selector.nodeType === 1) {
        result = [selector];
      }
    }
  } catch (err) {
    console.error(err);
  }
  return result;
};

/**
 * @param {Element} elem
 * @param {string|any} selector
 */
const matchSelector = (elem, selector) => {
  if (typeof selector === "string") {
    const elementMatchesSelector = win().Element?.prototype.matches;
    return elementMatchesSelector.call(elem, selector);
  } else if (typeof selector === "object" && selector.length) {
    return selector.indexOf(elem) >= 0;
  } else if (typeof selector === "object" && selector.nodeType === 1) {
    return elem === selector;
  }
  return false;
};

/**
 * @returns {HTMLElement|undefined}
 */
const getCurrentFocusedElement = () => {
  const activeElement = doc().activeElement;
  if (activeElement && activeElement !== doc().body) {
    return /**@type HTMLElement*/ (activeElement);
  }
};

/**
 * @param {Element} elem
 * @returns {string=}
 */
const getSectionId = (elem) => {
  for (let id in _sections) {
    if (
      !_sections[id].disabled &&
      matchSelector(elem, _sections[id].selector)
    ) {
      return id;
    }
  }
};

/**
 * @param {HTMLElement} elem
 * @param {string} [sectionId]
 * @param {boolean} [verifySectionSelector]
 * @returns {boolean}
 */
const isNavigable = (elem, sectionId, verifySectionSelector = false) => {
  if (
    !elem ||
    !sectionId ||
    !_sections[sectionId] ||
    _sections[sectionId].disabled
  ) {
    return false;
  }
  if (
    (elem.offsetWidth <= 0 && elem.offsetHeight <= 0) ||
    elem.hasAttribute("disabled")
  ) {
    return false;
  }
  if (
    verifySectionSelector &&
    !matchSelector(elem, _sections[sectionId].selector)
  ) {
    return false;
  }

  if (!getWindowOffset(elem, false, -10)?.domInfo.isOnScreen) {
    return false;
  }
  return true;
};

/**
 * @param {string} sectionId
 * @returns {HTMLElement=}
 */
const getSectionLastFocusedElement = (sectionId) => {
  const lastFocusedElement = _sections[sectionId].lastFocusedElement;
  if (!isNavigable(lastFocusedElement, sectionId, true)) {
    return;
  }
  return lastFocusedElement;
};

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/initCustomEvent
 * https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 * @param {Element} elem
 * @param {string} type
 * @param {object} [detail]
 * @param {boolean} cancelable
 * @returns {boolean}
 */
const fireEvent = (elem, type, detail, cancelable = true) => {
  const evt = new CustomEvent(EVENT_PREFIX + type, {
    bubbles: true,
    cancelable,
    detail,
  });
  const eventResult = elem.dispatchEvent(evt);
  const eventType = `on${ucfirst(type)}`;
  const result = callfunc(GlobalConfig.events[eventType], [evt]);
  if (false === result) {
    return false;
  } else {
    return eventResult;
  }
};

/**
 * @param {string} sectionId
 * @returns {HTMLElement=}
 */
const getSectionDefaultElement = (sectionId) => {
  const defaultElement = parseSelector(
    _sections[sectionId].defaultElement
  ).find(
    /**
     * @param {HTMLElement} elem
     */
    (elem) => isNavigable(elem, sectionId, true)
  );
  return defaultElement;
};

/**
 * @param {string} sectionId
 * @returns {HTMLElement[]}
 */
const getSectionNavigableElements = (sectionId) =>
  parseSelector(_sections[sectionId].selector).filter(
    (/**@type HTMLElement*/ elem) => isNavigable(elem, sectionId)
  );

/**
 * @param {Element} elem
 * @param {string=} sectionId
 */
const focusChanged = (elem, sectionId) => {
  const nextSectionId = sectionId ?? getSectionId(elem);
  if (nextSectionId) {
    _sections[nextSectionId].lastFocusedElement = elem;
    _lastSectionId = nextSectionId;
  }
};

/**
 * @param {HTMLElement} elem
 * @param {string} sectionId
 * @param {DirectionType} [direction]
 * @returns {boolean}
 */
const focusElement = (elem, sectionId, direction) => {
  if (!elem) {
    return false;
  }

  const currentFocusedElement = getCurrentFocusedElement();

  const silentFocus = function () {
    if (currentFocusedElement) {
      currentFocusedElement.blur();
    }
    elem.focus();
    focusChanged(elem, sectionId);
  };

  if (_duringFocusChange) {
    silentFocus();
    return true;
  }

  _duringFocusChange = true;

  if (_pause) {
    silentFocus();
    _duringFocusChange = false;
    return true;
  }

  if (currentFocusedElement) {
    const unfocusProperties = {
      nextElement: elem,
      nextSectionId: sectionId,
      direction,
      native: false,
    };
    if (!fireEvent(currentFocusedElement, "willunfocus", unfocusProperties)) {
      _duringFocusChange = false;
      return false;
    }
    currentFocusedElement.blur();
    fireEvent(currentFocusedElement, "unfocused", unfocusProperties, false);
  }

  const focusProperties = {
    previousElement: currentFocusedElement,
    native: false,
    sectionId,
    direction,
  };
  if (!fireEvent(elem, "willfocus", focusProperties)) {
    _duringFocusChange = false;
    return false;
  }
  elem.focus();
  fireEvent(elem, "focused", focusProperties, false);

  _duringFocusChange = false;

  focusChanged(elem, sectionId);
  return true;
};

/**
 * @param {string} [sectionId]
 * @returns {boolean}
 */
const focusSection = (sectionId) => {
  /**
   * @type any[]
   */
  const range = [];
  /**
   * @param {string} id
   */
  const addRange = function (id) {
    if (
      id &&
      range.indexOf(id) < 0 &&
      _sections[id] &&
      !_sections[id].disabled
    ) {
      range.push(id);
    }
  };

  if (sectionId) {
    addRange(sectionId);
  } else {
    addRange(_lastSectionId);
    Object.keys(_sections).forEach(addRange);
  }

  for (let i = 0, j = range.length; i < j; i++) {
    const id = range[i];
    let next;

    if (_sections[id].enterTo == "last-focused") {
      next =
        getSectionLastFocusedElement(id) ||
        getSectionDefaultElement(id) ||
        getSectionNavigableElements(id)[0];
    } else {
      next =
        getSectionDefaultElement(id) ||
        getSectionLastFocusedElement(id) ||
        getSectionNavigableElements(id)[0];
    }

    if (next) {
      return focusElement(next, id);
    }
  }

  return false;
};

/**
 * @param {Element} elem
 * @param {string} direction
 */
const fireNavigatefailed = (elem, direction) =>
  fireEvent(
    elem,
    "navigatefailed",
    {
      direction: direction,
    },
    false
  );

const prioritize = (/**@type any*/ priorities) => {
  let destPriority = null;
  for (let i = 0, j = priorities.length; i < j; i++) {
    if (priorities[i].group.length) {
      destPriority = priorities[i];
      break;
    }
  }

  if (!destPriority) {
    return null;
  }

  const destDistance = destPriority.distance;

  destPriority.group.sort((/**@type any*/ a, /**@type any*/ b) => {
    for (let i = 0, j = destDistance.length; i < j; i++) {
      const distance = destDistance[i];
      const delta = distance(a) - distance(b);
      if (delta) {
        return delta;
      }
    }
    return 0;
  });

  return destPriority.group;
};

/**
 * @param {Element} elem
 * @returns {RectType}
 */
const getRect = (elem) => {
  const cr = elem.getBoundingClientRect();
  const x = cr.left + Math.floor(cr.width / 2);
  const y = cr.top + Math.floor(cr.height / 2);
  const center = {
    x,
    y,
  };
  const rect = {
    left: cr.left,
    top: cr.top,
    right: cr.right,
    bottom: cr.bottom,
    width: cr.width,
    height: cr.height,
    element: elem,
    center,
  };
  return rect;
};

/**
 * @param {RectType} targetRect
 */
const generateDistanceFunction = (targetRect) => ({
  nearPlumbLineIsBetter: (/**@type RectType*/ rect) => {
    let d;
    if (rect.center.x < targetRect.center.x) {
      d = targetRect.center.x - rect.right;
    } else {
      d = rect.left - targetRect.center.x;
    }
    return d < 0 ? 0 : d;
  },
  nearHorizonIsBetter: (/**@type RectType*/ rect) => {
    let d;
    if (rect.center.y < targetRect.center.y) {
      d = targetRect.center.y - rect.bottom;
    } else {
      d = rect.top - targetRect.center.y;
    }
    return d < 0 ? 0 : d;
  },
  nearTargetLeftIsBetter: (/**@type RectType*/ rect) => {
    let d;
    if (rect.center.x < targetRect.center.x) {
      d = targetRect.left - rect.right;
    } else {
      d = rect.left - targetRect.left;
    }
    return d < 0 ? 0 : d;
  },
  nearTargetTopIsBetter: (/**@type RectType*/ rect) => {
    let d;
    if (rect.center.y < targetRect.center.y) {
      d = targetRect.top - rect.bottom;
    } else {
      d = rect.top - targetRect.top;
    }
    return d < 0 ? 0 : d;
  },
  topIsBetter: (/**@type RectType*/ rect) => {
    return rect.top;
  },
  bottomIsBetter: (/**@type RectType*/ rect) => {
    return -1 * rect.bottom;
  },
  leftIsBetter: (/**@type RectType*/ rect) => {
    return rect.left;
  },
  rightIsBetter: (/**@type RectType*/ rect) => {
    return -1 * rect.right;
  },
});

/**
 * @param {RectType[]} rects
 * @param {RectType} targetRect
 * @param {number} straightOverlapThreshold
 * @returns {RectType[][]}
 */
const partition = (rects, targetRect, straightOverlapThreshold) => {
  /**
   * @type RectType[][]
   */
  const groups = [[], [], [], [], [], [], [], [], []];

  for (let i = 0, j = rects.length; i < j; i++) {
    const rect = rects[i];
    const center = rect.center;
    let x, y, groupId;

    if (center.x < targetRect.left) {
      x = 0;
    } else if (center.x <= targetRect.right) {
      x = 1;
    } else {
      x = 2;
    }

    if (center.y < targetRect.top) {
      y = 0;
    } else if (center.y <= targetRect.bottom) {
      y = 1;
    } else {
      y = 2;
    }

    groupId = y * 3 + x;
    groups[groupId].push(rect);

    if ([0, 2, 6, 8].indexOf(groupId) !== -1) {
      const threshold = straightOverlapThreshold;

      if (rect.left <= targetRect.right - targetRect.width * threshold) {
        if (groupId === 2) {
          groups[1].push(rect);
        } else if (groupId === 8) {
          groups[7].push(rect);
        }
      }

      if (rect.right >= targetRect.left + targetRect.width * threshold) {
        if (groupId === 0) {
          groups[1].push(rect);
        } else if (groupId === 6) {
          groups[7].push(rect);
        }
      }

      if (rect.top <= targetRect.bottom - targetRect.height * threshold) {
        if (groupId === 6) {
          groups[3].push(rect);
        } else if (groupId === 8) {
          groups[5].push(rect);
        }
      }

      if (rect.bottom >= targetRect.top + targetRect.height * threshold) {
        if (groupId === 0) {
          groups[3].push(rect);
        } else if (groupId === 2) {
          groups[5].push(rect);
        }
      }
    }
  }

  return groups;
};

/**
 * @param {Element} target
 * @param {string} direction
 * @param {Element[]} candidates
 * @param {any} config
 * @returns {HTMLElement=}
 */
function navigate(target, direction, candidates, config) {
  if (!target || !direction || !candidates || !candidates.length) {
    return;
  }

  const rects = [];
  for (let i = 0, j = candidates.length; i < j; i++) {
    const rect = getRect(candidates[i]);
    if (rect) {
      rects.push(rect);
    }
  }
  if (!rects.length) {
    return;
  }

  const targetRect = getRect(target);
  if (!targetRect) {
    return;
  }

  const distanceFunction = generateDistanceFunction(targetRect);

  const groups = partition(rects, targetRect, config.straightOverlapThreshold);

  const internalGroups = partition(
    groups[4],
    targetRect,
    config.straightOverlapThreshold
  );

  let priorities;

  switch (direction) {
    case LEFT:
      priorities = [
        {
          group: internalGroups[0]
            .concat(internalGroups[3])
            .concat(internalGroups[6]),
          distance: [
            distanceFunction.nearPlumbLineIsBetter,
            distanceFunction.topIsBetter,
          ],
        },
        {
          group: groups[3],
          distance: [
            distanceFunction.nearPlumbLineIsBetter,
            distanceFunction.topIsBetter,
          ],
        },
        {
          group: groups[0].concat(groups[6]),
          distance: [
            distanceFunction.nearHorizonIsBetter,
            distanceFunction.rightIsBetter,
            distanceFunction.nearTargetTopIsBetter,
          ],
        },
      ];
      break;
    case RIGHT:
      priorities = [
        {
          group: internalGroups[2]
            .concat(internalGroups[5])
            .concat(internalGroups[8]),
          distance: [
            distanceFunction.nearPlumbLineIsBetter,
            distanceFunction.topIsBetter,
          ],
        },
        {
          group: groups[5],
          distance: [
            distanceFunction.nearPlumbLineIsBetter,
            distanceFunction.topIsBetter,
          ],
        },
        {
          group: groups[2].concat(groups[8]),
          distance: [
            distanceFunction.nearHorizonIsBetter,
            distanceFunction.leftIsBetter,
            distanceFunction.nearTargetTopIsBetter,
          ],
        },
      ];
      break;
    case UP:
      priorities = [
        {
          group: internalGroups[0]
            .concat(internalGroups[1])
            .concat(internalGroups[2]),
          distance: [
            distanceFunction.nearHorizonIsBetter,
            distanceFunction.leftIsBetter,
          ],
        },
        {
          group: groups[1],
          distance: [
            distanceFunction.nearHorizonIsBetter,
            distanceFunction.leftIsBetter,
          ],
        },
        {
          group: groups[0].concat(groups[2]),
          distance: [
            distanceFunction.nearPlumbLineIsBetter,
            distanceFunction.bottomIsBetter,
            distanceFunction.nearTargetLeftIsBetter,
          ],
        },
      ];
      break;
    case DOWN:
      priorities = [
        {
          group: internalGroups[6]
            .concat(internalGroups[7])
            .concat(internalGroups[8]),
          distance: [
            distanceFunction.nearHorizonIsBetter,
            distanceFunction.leftIsBetter,
          ],
        },
        {
          group: groups[7],
          distance: [
            distanceFunction.nearHorizonIsBetter,
            distanceFunction.leftIsBetter,
          ],
        },
        {
          group: groups[6].concat(groups[8]),
          distance: [
            distanceFunction.nearPlumbLineIsBetter,
            distanceFunction.topIsBetter,
            distanceFunction.nearTargetLeftIsBetter,
          ],
        },
      ];
      break;
    default:
      return;
  }

  if (config.straightOnly) {
    priorities.pop();
  }

  const destGroup = prioritize(priorities);
  if (!destGroup) {
    return;
  }

  const dest = destGroup[0].element;
  return dest;
}

/**
 * @param {Element[]} elemList
 * @param {Element[]} excludedElem
 * @returns {Element[]}
 */
const exclude = (elemList, excludedElem) => {
  for (let i = 0, j = excludedElem.length; i < j; i++) {
    const index = elemList.indexOf(excludedElem[i]);
    if (index >= 0) {
      elemList.splice(index, 1);
    }
  }
  return elemList;
};

/**
 * @param {GetNextNodeProps} props
 * @returns {HTMLElement=}
 */
const getNextNode = ({
  direction,
  currentFocusedElement,
  currentSectionId,
}) => {
  /**
   * @type any
   */
  const sectionNavigableElements = {};
  /**
   * @type any
   */
  const allNavigableElements = [];
  for (let id in _sections) {
    sectionNavigableElements[id] = getSectionNavigableElements(id);
    allNavigableElements.push(...sectionNavigableElements[id]);
  }

  const config = { ...GlobalConfig, ..._sections[currentSectionId] };
  let next;

  if (config.restrict === "self-only" || config.restrict === "self-first") {
    const currentSectionNavigableElements =
      sectionNavigableElements[currentSectionId];

    next = navigate(
      currentFocusedElement,
      direction,
      exclude(currentSectionNavigableElements, [currentFocusedElement]),
      config
    );

    if (!next && config.restrict == "self-first") {
      next = navigate(
        currentFocusedElement,
        direction,
        exclude(allNavigableElements, currentSectionNavigableElements),
        config
      );
    }
  } else {
    next = navigate(
      currentFocusedElement,
      direction,
      exclude(allNavigableElements, [currentFocusedElement]),
      config
    );
  }
  return next;
};

/**
 * @param {GetNextNodeProps} props
 * @returns {boolean}
 */
const focusNext = ({ direction, currentFocusedElement, currentSectionId }) => {
  const next = getNextNode({
    direction,
    currentFocusedElement,
    currentSectionId,
  });
  if (next) {
    _sections[currentSectionId].previous = {
      target: currentFocusedElement,
      destination: next,
    };

    /**
     * @type {string=}
     */
    const nextSectionId = getSectionId(next);

    if (currentSectionId != nextSectionId) {
      return focusSection(nextSectionId);
    }
    return focusElement(next, nextSectionId, direction);
  }

  fireNavigatefailed(currentFocusedElement, direction);
  return false;
};

/**
 * @param {KeyboardEvent} evt
 */
function onKeyDown(evt) {
  if (
    !_sectionCount ||
    _pause ||
    evt.altKey ||
    evt.ctrlKey ||
    evt.metaKey ||
    evt.shiftKey
  ) {
    return;
  }

  /**
   * @type {Element|undefined}
   */
  let currentFocusedElement;
  const preventDefault = function () {
    evt.preventDefault();
    evt.stopPropagation();
    return false;
  };

  /**
   * @type DirectionType
   */
  const direction = KEYMAPPING[evt.key];
  if (!direction) {
    if (evt.key === "Enter") {
      currentFocusedElement = getCurrentFocusedElement();
      if (currentFocusedElement && getSectionId(currentFocusedElement)) {
        if (!fireEvent(currentFocusedElement, "enterDown")) {
          return preventDefault();
        }
      }
    }
    return;
  }

  currentFocusedElement = getCurrentFocusedElement();

  if (!currentFocusedElement) {
    if (_lastSectionId) {
      currentFocusedElement = getSectionLastFocusedElement(_lastSectionId);
    }
    if (!currentFocusedElement) {
      return focusSection() && preventDefault();
    }
  }

  const currentSectionId = getSectionId(currentFocusedElement);
  if (!currentSectionId) {
    return;
  }

  const willmoveProperties = {
    direction,
    sectionId: currentSectionId,
    cause: "keydown",
    hasNext: () =>
      getNextNode({
        direction,
        currentFocusedElement: /**@type Element*/ (currentFocusedElement),
        currentSectionId,
      }),
  };
  const isContinue = fireEvent(
    currentFocusedElement,
    "willmove",
    willmoveProperties
  );
  const focusNextProps = {
    direction: /**@type DirectionType*/ (direction),
    currentFocusedElement,
    currentSectionId,
  };
  if (false === isContinue) {
    if (getNextNode(focusNextProps)) {
      return preventDefault();
    }
  } else {
    return focusNext(focusNextProps) && preventDefault();
  }
}

/**
 * @param {KeyboardEvent} evt
 */
const onKeyUp = (evt) => {
  if (evt.altKey || evt.ctrlKey || evt.metaKey || evt.shiftKey) {
    return;
  }
  if (!_pause && _sectionCount && evt.key === "Enter") {
    const currentFocusedElement = getCurrentFocusedElement();
    if (currentFocusedElement && getSectionId(currentFocusedElement)) {
      if (!fireEvent(currentFocusedElement, "enterUp")) {
        evt.preventDefault();
        evt.stopPropagation();
        return false;
      }
    }
  }
};

/**
 * @param {FocusEvent} evt
 */
const onFocus = (evt) => {
  /**
   * @type HTMLElement
   */
  const target = /**@type any*/ (evt.target);
  if (
    target !== /**@type any*/ (window) &&
    target !== /**@type any*/ (document) &&
    _sectionCount &&
    !_duringFocusChange
  ) {
    const sectionId = getSectionId(target);
    if (sectionId) {
      if (_pause) {
        focusChanged(target, sectionId);
        return;
      }

      const focusProperties = {
        sectionId,
        native: true,
      };

      if (!fireEvent(target, "focused", focusProperties, false)) {
        _duringFocusChange = true;
        target.blur();
        _duringFocusChange = false;
      } else {
        focusChanged(target, sectionId);
      }
    }
  }
};

/**
 * @param {FocusEvent} evt
 */
const onBlur = (evt) => {
  /**
   * @type HTMLElement
   */
  const target = /**@type any*/ (evt.target);
  if (
    target !== /**@type any*/ (window) &&
    target !== /**@type any*/ (document) &&
    !_pause &&
    _sectionCount &&
    !_duringFocusChange &&
    getSectionId(target)
  ) {
    const unfocusProperties = {
      native: true,
    };
    if (!fireEvent(target, "willunfocus", unfocusProperties)) {
      _duringFocusChange = true;
      setTimeout(function () {
        target.focus();
        _duringFocusChange = false;
      });
    } else {
      fireEvent(target, "unfocused", unfocusProperties, false);
    }
  }
};

/**
 * @returns {string}
 */
const generateId = () => {
  let id;
  while (true) {
    id = ID_POOL_PREFIX + String(++_idPool);
    if (!_sections[id]) {
      break;
    }
  }
  return id;
};

class SpatialNavigation {
  /**
   * @param {GetNextNodeProps} props
   */
  focusNext = (props) => focusNext(props);

  /**
   * @param {string} [sectionId]
   */
  focusSection = (sectionId) => focusSection(sectionId);

  /**
   * @typedef {keyof SpatialNavigationConfigs} SpatialNavigationConfigKeys
   */
  /**
   * @param {SpatialNavigationConfigs} config
   */
  mount(config = {}) {
    /**
     * @type SpatialNavigationConfigKeys[]
     */
    const gkeys = /**@type any[]*/ (Object.keys(GlobalConfig));

    gkeys.forEach((key) => {
      if (null != config[key]) {
        GlobalConfig[key] = /**@type never*/ (config[key]);
      }
    });
    const thisWin = win();
    thisWin.addEventListener("keydown", onKeyDown);
    thisWin.addEventListener("keyup", onKeyUp);
    thisWin.addEventListener("focus", onFocus, true);
    thisWin.addEventListener("blur", onBlur, true);
    this.initSection(config);
    this.makeFocusable();
  }

  unmount() {
    const thisWin = win();
    thisWin.removeEventListener("keydown", onKeyDown);
    thisWin.removeEventListener("keyup", onKeyUp);
    thisWin.removeEventListener("focus", onFocus, true);
    thisWin.removeEventListener("blur", onBlur, true);
  }

  /**
   * @param {any} config
   */
  initSection = (config) => {
    const sectionId = null == config.id ? generateId() : config.id;
    _sections[sectionId] = config;
    _sectionCount++;
  };

  /**
   * @param {string} [sectionId]
   */
  makeFocusable = (sectionId) => {
    const doMakeFocusable = function (/**@type any*/ section) {
      const tabIndexIgnoreList =
        section.tabIndexIgnoreList !== undefined
          ? section.tabIndexIgnoreList
          : GlobalConfig.tabIndexIgnoreList;
      parseSelector(section.selector).forEach(
        function (/**@type Element*/ elem) {
          if (!matchSelector(elem, tabIndexIgnoreList)) {
            if (!elem.getAttribute("tabindex")) {
              elem.setAttribute("tabindex", "-1");
            }
          }
        }
      );
    };

    if (sectionId) {
      if (_sections[sectionId]) {
        doMakeFocusable(_sections[sectionId]);
      } else {
        throw new Error('Section "' + sectionId + "\" doesn't exist!");
      }
    } else {
      for (let id in _sections) {
        doMakeFocusable(_sections[id]);
      }
    }
  };
}

const SpaceNav = new SpatialNavigation();
export default SpaceNav;
