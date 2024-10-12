if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const UPDATE_MODEL_EVENT = "update:modelValue";
  const UPDATE_VISIBLE_EVENT = "update:visible";
  const CHANGE_EVENT = "change";
  const CLICK_EVENT = "click";
  const OPEN_EVENT = "open";
  const CLOSE_EVENT = "close";
  const OPENED_EVENT = "opened";
  const CLOSED_EVENT = "closed";
  const FOCUS_EVENT = "focus";
  const BLUR_EVENT = "blur";
  const SEARCH_EVENT = "search";
  const CLEAR_EVENT = "clear";
  const CANCEL_EVENT = "cancel";
  const CHOOSE_EVENT = "choose";
  const PREFIX = "nut";
  const animationName = {
    center: "fade",
    top: "slide-down",
    bottom: "slide-up",
    left: "slide-left",
    right: "slide-right"
  };
  let globalZIndex = 2e3;
  function useGlobalZIndex() {
    return ++globalZIndex;
  }
  function useInject(key) {
    const parent = vue.inject(key, null);
    if (parent) {
      const instance = vue.getCurrentInstance();
      const { add, remove, internalChildren } = parent;
      add(instance);
      vue.onUnmounted(() => remove(instance));
      const index = vue.computed(() => internalChildren.indexOf(instance));
      return {
        parent,
        index
      };
    }
    return {
      parent: null,
      index: vue.ref(-1)
    };
  }
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function flattenVNodes(shouldTraverseChildren, childName) {
    const result = [];
    const traverse = (children) => {
      if (!Array.isArray(children))
        return;
      children.forEach((child) => {
        var _a;
        if (!isVNode(child))
          return;
        {
          if (child.type && child.type.name === childName) {
            result.push(child);
            return;
          }
        }
        if ((_a = child.component) == null ? void 0 : _a.subTree)
          traverse(child.component.subTree.children);
        if (child.children)
          traverse(child.children);
      });
    };
    traverse(shouldTraverseChildren);
    return result;
  }
  function sortChildren(parent, internalChildren, childName) {
    const vnodes = flattenVNodes(parent && parent.subTree && parent.subTree.children, childName);
    internalChildren.sort((a, b) => {
      return vnodes.indexOf(a.vnode) - vnodes.indexOf(b.vnode);
    });
  }
  function useProvide(key, childName) {
    const internalChildren = vue.shallowReactive([]);
    const publicChildren = vue.shallowReactive([]);
    const parent = vue.getCurrentInstance();
    const add = (child) => {
      if (!child.proxy)
        return;
      internalChildren.push(vue.markRaw(child));
      publicChildren.push(vue.markRaw(child.proxy));
      sortChildren(parent, internalChildren, childName);
    };
    const remove = (child) => {
      if (child.proxy) {
        internalChildren.splice(internalChildren.indexOf(vue.markRaw(child)), 1);
        publicChildren.splice(publicChildren.indexOf(vue.markRaw(child.proxy)), 1);
      }
    };
    return (value) => {
      vue.provide(key, {
        add,
        remove,
        internalChildren,
        ...value
      });
      return {
        internalChildren,
        children: publicChildren
      };
    };
  }
  function useSelectorQuery(instance) {
    let query = null;
    if (!instance)
      instance = vue.getCurrentInstance();
    if (!instance)
      console.warn("useSelectorQuery", "useSelectorQuery必须在setup函数中使用");
    query = uni.createSelectorQuery().in(instance);
    const getSelectorNodeInfo = (selector) => {
      return new Promise((resolve, reject) => {
        if (query) {
          query.select(selector).boundingClientRect((res) => {
            const selectRes = res;
            if (selectRes)
              resolve(selectRes);
            else
              reject(new Error(`未找到对应节点: ${selector}`));
          }).exec();
        } else {
          reject(new Error("未找到对应的SelectorQuery实例"));
        }
      });
    };
    const getSelectorNodeInfos = (selector) => {
      return new Promise((resolve, reject) => {
        if (query) {
          query.selectAll(selector).boundingClientRect((res) => {
            const selectRes = res;
            if (selectRes && selectRes.length > 0)
              resolve(selectRes);
            else
              reject(new Error(`未找到对应节点: ${selector}`));
          }).exec();
        } else {
          reject(new Error("未找到对应的SelectorQuery实例"));
        }
      });
    };
    return {
      query,
      getSelectorNodeInfo,
      getSelectorNodeInfos
    };
  }
  function useRect(id, instance) {
    const { getSelectorNodeInfo } = useSelectorQuery(instance);
    return getSelectorNodeInfo(`#${id}`);
  }
  const toString = Object.prototype.toString;
  function is(val, type) {
    return toString.call(val) === `[object ${type}]`;
  }
  function isDef(val) {
    return typeof val !== "undefined";
  }
  function isObject(val) {
    return val !== null && is(val, "Object");
  }
  function isEmpty(val) {
    if (isArray(val) || isString(val))
      return val.length === 0;
    if (val instanceof Map || val instanceof Set)
      return val.size === 0;
    if (isObject(val))
      return Object.keys(val).length === 0;
    return false;
  }
  function isNumber(val) {
    return is(val, "Number");
  }
  function isString(val) {
    return is(val, "String");
  }
  function isFunction(val) {
    return typeof val === "function";
  }
  function isBoolean(val) {
    return is(val, "Boolean");
  }
  function isArray(val) {
    return val && Array.isArray(val);
  }
  function getPropByPath(obj, keyPath) {
    try {
      return keyPath.split(".").reduce((prev, curr) => prev[curr], obj);
    } catch (error) {
      return "";
    }
  }
  function cacheStringFunction(fn) {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  }
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction(
    (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
  );
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  const { hasOwnProperty } = Object.prototype;
  function assignKey(to, from, key) {
    const val = from[key];
    if (!isDef(val))
      return;
    if (!hasOwnProperty.call(to, key) || !isObject(val))
      to[key] = val;
    else
      to[key] = deepAssign(Object(to[key]), val);
  }
  function deepAssign(to, from) {
    Object.keys(from).forEach((key) => {
      assignKey(to, from, key);
    });
    return to;
  }
  function getRandomId() {
    return Math.random().toString(36).slice(-8);
  }
  const numericProp = [Number, String];
  const truthProp = {
    type: Boolean,
    default: true
  };
  const nullableBooleanProp = {
    type: Boolean,
    default: void 0
  };
  function makeArrayProp(defaultVal = []) {
    return {
      type: Array,
      default: () => defaultVal
    };
  }
  function makeObjectProp(defaultVal) {
    return {
      type: Object,
      default: () => defaultVal
    };
  }
  function makeNumberProp(defaultVal) {
    return {
      type: Number,
      default: defaultVal
    };
  }
  function makeNumericProp(defaultVal) {
    return {
      type: numericProp,
      default: defaultVal
    };
  }
  function makeStringProp(defaultVal) {
    return {
      type: String,
      default: defaultVal
    };
  }
  const commonProps = {
    /**
     * @description 自定义类名
     */
    customClass: {
      type: [String, Object, Array],
      default: ""
    },
    /**
     * @description 自定义样式
     */
    customStyle: {
      type: [String, Object, Array],
      default: ""
    }
  };
  function pxCheck(value) {
    return Number.isNaN(Number(value)) ? String(value) : `${value}px`;
  }
  const _window = window;
  function requestAniFrame() {
    if (typeof _window !== "undefined") {
      return _window.requestAnimationFrame || _window.webkitRequestAnimationFrame || function(callback) {
        _window.setTimeout(callback, 1e3 / 60);
      };
    } else {
      return function(callback) {
        setTimeout(callback, 1e3 / 60);
      };
    }
  }
  const requestAniFrame$1 = requestAniFrame();
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:([\s\S]+)/;
  const styleCommentRE = /\/\*.*?\*\//g;
  function parseStringStyle(cssText) {
    const ret = {};
    cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }
  function stringifyStyle(styles) {
    let ret = "";
    if (!styles || isString(styles))
      return ret;
    for (const key in styles) {
      const value = styles[key];
      const normalizedKey = key.startsWith("--") ? key : hyphenate(key);
      if (isString(value) || typeof value === "number") {
        ret += `${normalizedKey}:${value};`;
      }
    }
    return ret;
  }
  function normalizeStyle(value) {
    if (isArray(value)) {
      const res = {};
      for (let i2 = 0; i2 < value.length; i2++) {
        const item = value[i2];
        const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
        if (normalized) {
          for (const key in normalized) {
            if (!isEmpty(normalized[key]))
              res[key] = normalized[key];
          }
        }
      }
      return res;
    }
    if (isString(value))
      return value;
    if (isObject(value))
      return value;
  }
  function normalizeClass(value) {
    let res = "";
    if (isString(value)) {
      res = value;
    } else if (isArray(value)) {
      for (let i2 = 0; i2 < value.length; i2++) {
        const normalized = normalizeClass(value[i2]);
        if (normalized)
          res += `${normalized} `;
      }
    } else if (isObject(value)) {
      for (const name2 in value) {
        if (value[name2])
          res += `${name2} `;
      }
    }
    return res.trim();
  }
  function getMainClass(props, componentName2, cls2) {
    return normalizeClass([props.customClass, { [componentName2]: true }, cls2]);
  }
  function getMainStyle(props, style) {
    return stringifyStyle(normalizeStyle([props.customStyle, style]));
  }
  const MIN_DISTANCE = 10;
  function getDirection(x, y) {
    if (x > y && x > MIN_DISTANCE)
      return "horizontal";
    if (y > x && y > MIN_DISTANCE)
      return "vertical";
    return "";
  }
  function useTouch() {
    const startX = vue.ref(0);
    const startY = vue.ref(0);
    const moveX = vue.ref(0);
    const moveY = vue.ref(0);
    const deltaX = vue.ref(0);
    const deltaY = vue.ref(0);
    const offsetX = vue.ref(0);
    const offsetY = vue.ref(0);
    const direction = vue.ref("");
    const isVertical = () => direction.value === "vertical";
    const isHorizontal = () => direction.value === "horizontal";
    const reset = () => {
      deltaX.value = 0;
      deltaY.value = 0;
      offsetX.value = 0;
      offsetY.value = 0;
      direction.value = "";
    };
    const start = (event) => {
      reset();
      startX.value = event.touches[0].clientX;
      startY.value = event.touches[0].clientY;
    };
    const move = (event) => {
      const touch = event.touches[0];
      deltaX.value = touch.clientX - startX.value;
      deltaY.value = touch.clientY - startY.value;
      moveX.value = touch.clientX;
      moveY.value = touch.clientY;
      offsetX.value = Math.abs(deltaX.value);
      offsetY.value = Math.abs(deltaY.value);
      if (!direction.value)
        direction.value = getDirection(offsetX.value, offsetY.value);
    };
    return {
      move,
      start,
      reset,
      startX,
      startY,
      moveX,
      moveY,
      deltaX,
      deltaY,
      offsetX,
      offsetY,
      direction,
      isVertical,
      isHorizontal
    };
  }
  const swiperProps = {
    ...commonProps,
    /**
     * @description 轮播卡片的宽度
     */
    width: makeNumericProp(""),
    /**
     * @description 轮播卡片的高度
     */
    height: makeNumericProp(""),
    /**
     * @description 轮播方向,可选值 `horizontal`, `vertical`
     */
    direction: makeStringProp("horizontal"),
    /**
     * @description 分页指示器是否展示
     */
    paginationVisible: Boolean,
    /**
     * @description 分页指示器选中的颜色
     */
    paginationColor: makeStringProp("#fff"),
    /**
     * @description 是否循环轮播
     */
    loop: truthProp,
    /**
     * @description 动画时长（单位是ms）
     */
    duration: makeNumericProp(500),
    /**
     * @description 自动轮播时长，0表示不会自动轮播
     */
    autoPlay: makeNumericProp(0),
    /**
     * @description 是否自动播放
     */
    isAutoPlay: truthProp,
    /**
     * @description 初始化索引值
     */
    initPage: makeNumericProp(0),
    /**
     * @description 是否可触摸滑动
     */
    touchable: truthProp,
    /**
     * @description 滑动过程中是否禁用默认事件
     */
    isPreventDefault: truthProp,
    /**
     * @description 滑动过程中是否禁止冒泡
     */
    isStopPropagation: truthProp,
    /**
     * @description 轮播列表数据
     */
    list: {
      type: Array,
      default: () => []
    },
    /**
     * @description 分页指示器没有选中的颜色
     */
    paginationUnselectedColor: makeStringProp("#ddd")
  };
  const swiperEmits = {
    [CHANGE_EVENT]: (val) => isNumber(val)
  };
  const SWIPER_KEY = Symbol("swiper");
  const componentName$f = `${PREFIX}-swiper`;
  const __default__$d = vue.defineComponent({
    name: componentName$f,
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  });
  const _sfc_main$q = /* @__PURE__ */ vue.defineComponent({
    ...__default__$d,
    props: swiperProps,
    emits: swiperEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const instance = vue.getCurrentInstance();
      const containerId = `container-${getRandomId()}`;
      const state = vue.reactive({
        active: 0,
        num: 0,
        rect: null,
        width: 0,
        height: 0,
        moving: false,
        offset: 0,
        touchTime: 0,
        autoplayTimer: null,
        childrenVNode: [],
        style: {}
      });
      const touch = useTouch();
      const classes = vue.computed(() => {
        const prefixCls = componentName$f;
        return {
          [prefixCls]: true
        };
      });
      const isVertical = vue.computed(() => props.direction === "vertical");
      const classesInner = vue.computed(() => {
        const prefixCls = componentName$f;
        return {
          [`${prefixCls}-inner`]: true,
          [`${prefixCls}-vertical`]: isVertical.value
        };
      });
      const classesPagination = vue.computed(() => {
        const prefixCls = componentName$f;
        return {
          [`${prefixCls}-pagination`]: true,
          [`${prefixCls}-pagination-vertical`]: isVertical.value
        };
      });
      const delTa = vue.computed(() => {
        return isVertical.value ? touch.deltaY.value : touch.deltaX.value;
      });
      const isCorrectDirection = vue.computed(() => {
        return touch.direction.value === props.direction;
      });
      const childCount = vue.computed(() => internalChildren.length);
      const size = vue.computed(() => state[isVertical.value ? "height" : "width"]);
      const trackSize = vue.computed(() => childCount.value * size.value);
      const minOffset = vue.computed(() => {
        if (state.rect) {
          const base = isVertical.value ? state.rect.height : state.rect.width;
          return base - size.value * childCount.value;
        }
        return 0;
      });
      const activePagination = vue.computed(() => (state.active + childCount.value) % childCount.value);
      function getStyle() {
        let offset = 0;
        offset = state.offset;
        state.style = {
          transitionDuration: `${state.moving ? 0 : props.duration}ms`,
          transform: `translate${isVertical.value ? "Y" : "X"}(${offset}px)`,
          [isVertical.value ? "height" : "width"]: `${size.value * childCount.value}px`,
          [isVertical.value ? "width" : "height"]: `${isVertical.value ? state.width : state.height}px`
        };
      }
      const { internalChildren } = useProvide(SWIPER_KEY, "nut-form-swiper")(
        {
          props,
          size
        }
      );
      function getOffset(active, offset = 0) {
        let currentPosition = active * size.value;
        if (!props.loop)
          currentPosition = Math.min(currentPosition, -minOffset.value);
        let targetOffset = offset - currentPosition;
        if (!props.loop)
          targetOffset = clamp(targetOffset, minOffset.value, 0);
        return targetOffset;
      }
      function getActive(pace) {
        const { active } = state;
        if (pace) {
          if (props.loop)
            return clamp(active + pace, -1, childCount.value);
          return clamp(active + pace, 0, childCount.value - 1);
        }
        return active;
      }
      function move({ pace = 0, offset = 0, isEmit = false }) {
        if (childCount.value <= 1)
          return;
        const { active } = state;
        const targetActive = getActive(pace);
        const targetOffset = getOffset(targetActive, offset);
        if (props.loop) {
          if (internalChildren[0] && targetOffset !== minOffset.value) {
            const rightBound = targetOffset < minOffset.value;
            internalChildren[0].exposed.setOffset(rightBound ? trackSize.value : 0);
          }
          if (internalChildren[childCount.value - 1] && targetOffset !== 0) {
            const leftBound = targetOffset > 0;
            internalChildren[childCount.value - 1].exposed.setOffset(leftBound ? -trackSize.value : 0);
          }
        }
        state.active = targetActive;
        state.offset = targetOffset;
        if (isEmit && active !== state.active)
          emit("change", activePagination.value);
        getStyle();
      }
      function resettPosition() {
        state.moving = true;
        if (state.active <= -1)
          move({ pace: childCount.value });
        if (state.active >= childCount.value)
          move({ pace: -childCount.value });
      }
      function stopAutoPlay() {
        if (state.autoplayTimer)
          clearTimeout(state.autoplayTimer);
      }
      function jump(pace) {
        resettPosition();
        touch.reset();
        requestAniFrame$1(() => {
          requestAniFrame$1(() => {
            state.moving = false;
            move({
              pace,
              isEmit: true
            });
          });
        });
      }
      function prev() {
        jump(-1);
      }
      function next() {
        jump(1);
      }
      function to(index) {
        resettPosition();
        touch.reset();
        requestAniFrame$1(() => {
          state.moving = false;
          let targetIndex;
          if (props.loop && childCount.value === index)
            targetIndex = state.active === 0 ? 0 : index;
          else
            targetIndex = index % childCount.value;
          move({
            pace: targetIndex - state.active,
            isEmit: true
          });
        });
      }
      function autoplay() {
        if (+props.autoPlay <= 0 || childCount.value <= 1)
          return;
        stopAutoPlay();
        state.autoplayTimer = setTimeout(() => {
          next();
          autoplay();
        }, Number(props.autoPlay));
      }
      async function init(active = +props.initPage) {
        stopAutoPlay();
        state.rect = await useRect(containerId, instance);
        if (state.rect) {
          active = Math.min(childCount.value - 1, active);
          state.width = props.width ? +props.width : state.rect.width;
          state.height = props.height ? +props.height : state.rect.height;
          state.active = active;
          state.offset = getOffset(state.active);
          state.moving = true;
          getStyle();
          autoplay();
        }
      }
      function onTouchStart(e) {
        if (props.isStopPropagation)
          e.stopPropagation();
        if (!props.touchable)
          return;
        touch.start(e);
        state.touchTime = Date.now();
        stopAutoPlay();
        resettPosition();
      }
      function onTouchMove(e) {
        if (props.touchable && state.moving) {
          touch.move(e);
          if (isCorrectDirection.value) {
            move({
              offset: delTa.value
            });
          }
        }
      }
      function onTouchEnd(e) {
        if (!props.touchable || !state.moving)
          return;
        const speed = delTa.value / (Date.now() - state.touchTime);
        const isShouldMove = Math.abs(speed) > 0.3 || Math.abs(delTa.value) > +(size.value / 2).toFixed(2);
        if (isShouldMove && isCorrectDirection.value) {
          let pace = 0;
          const offset = isVertical.value ? touch.offsetY.value : touch.offsetX.value;
          if (props.loop)
            pace = offset > 0 ? delTa.value > 0 ? -1 : 1 : 0;
          else
            pace = -Math[delTa.value > 0 ? "ceil" : "floor"](delTa.value / size.value);
          move({
            pace,
            isEmit: true
          });
        } else if (delTa.value) {
          move({ pace: 0 });
        }
        state.moving = false;
        getStyle();
        autoplay();
      }
      __expose({
        prev,
        next,
        to
      });
      vue.onDeactivated(() => {
        stopAutoPlay();
      });
      vue.onBeforeUnmount(() => {
        stopAutoPlay();
      });
      vue.watch(
        () => props.initPage,
        (val) => {
          vue.nextTick(() => {
            init(+val);
          });
        }
      );
      vue.watch(
        () => props.height,
        (val) => {
          vue.nextTick(() => {
            init(+val);
          });
        }
      );
      vue.watch(
        () => internalChildren.length,
        () => {
          vue.nextTick(() => {
            init();
          });
        }
      );
      vue.watch(
        () => props.autoPlay,
        (val) => {
          +val > 0 ? autoplay() : stopAutoPlay();
        }
      );
      const __returned__ = { componentName: componentName$f, props, emit, instance, containerId, state, touch, classes, isVertical, classesInner, classesPagination, delTa, isCorrectDirection, childCount, size, trackSize, minOffset, activePagination, getStyle, internalChildren, getOffset, getActive, move, resettPosition, stopAutoPlay, jump, prev, next, to, autoplay, init, onTouchStart, onTouchMove, onTouchEnd };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      id: $setup.containerId,
      class: vue.normalizeClass([$setup.classes, _ctx.customClass]),
      "catch-move": _ctx.isPreventDefault,
      style: vue.normalizeStyle([_ctx.customStyle]),
      onTouchstart: _cache[0] || (_cache[0] = (...args) => $setup.onTouchStart && $setup.onTouchStart(...args)),
      onTouchmove: _cache[1] || (_cache[1] = (...args) => $setup.onTouchMove && $setup.onTouchMove(...args)),
      onTouchend: _cache[2] || (_cache[2] = (...args) => $setup.onTouchEnd && $setup.onTouchEnd(...args)),
      onTouchcancel: _cache[3] || (_cache[3] = (...args) => $setup.onTouchEnd && $setup.onTouchEnd(...args))
    }, [
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass($setup.classesInner),
          style: vue.normalizeStyle($setup.state.style)
        },
        [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ],
        6
        /* CLASS, STYLE */
      ),
      vue.renderSlot(_ctx.$slots, "page", {}, void 0, true),
      _ctx.paginationVisible && !_ctx.$slots.page ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: vue.normalizeClass($setup.classesPagination)
        },
        [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.internalChildren.length, (item, index) => {
              return vue.openBlock(), vue.createElementBlock(
                "i",
                {
                  key: index,
                  class: vue.normalizeClass(["pagination", { active: $setup.activePagination === index }]),
                  style: vue.normalizeStyle({
                    backgroundColor: $setup.activePagination === index ? _ctx.paginationColor : _ctx.paginationUnselectedColor
                  })
                },
                null,
                6
                /* CLASS, STYLE */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ],
        2
        /* CLASS */
      )) : vue.createCommentVNode("v-if", true)
    ], 46, ["catch-move"]);
  }
  const __unplugin_components_1$2 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__scopeId", "data-v-d429ac3a"], ["__file", "D:/WebStormProject/bird-identification-app/node_modules/nutui-uniapp/components/swiper/swiper.vue"]]);
  const swiperItemProps = {
    ...commonProps
  };
  const componentName$e = `${PREFIX}-swiper-item`;
  const __default__$c = vue.defineComponent({
    name: componentName$e,
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  });
  const _sfc_main$p = /* @__PURE__ */ vue.defineComponent({
    ...__default__$c,
    props: swiperItemProps,
    setup(__props, { expose: __expose }) {
      const props = __props;
      const { parent } = useInject(SWIPER_KEY);
      const state = vue.reactive({
        offset: 0
      });
      const classes = vue.computed(() => {
        return getMainClass(props, componentName$e);
      });
      const style = vue.computed(() => {
        const style2 = {};
        const direction = parent == null ? void 0 : parent.props.direction;
        if (parent == null ? void 0 : parent.size.value)
          style2[direction === "horizontal" ? "width" : "height"] = `${parent == null ? void 0 : parent.size.value}px`;
        if (state.offset)
          style2.transform = `translate${direction === "horizontal" ? "X" : "Y"}(${state.offset}px)`;
        return getMainStyle(props, style2);
      });
      function setOffset(offset) {
        state.offset = offset;
      }
      __expose({ setOffset });
      const __returned__ = { componentName: componentName$e, props, parent, state, classes, style, setOffset };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.classes),
        style: vue.normalizeStyle($setup.style)
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __unplugin_components_0$5 = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__scopeId", "data-v-8e0d26b2"], ["__file", "D:/WebStormProject/bird-identification-app/node_modules/nutui-uniapp/components/swiperitem/swiperitem.vue"]]);
  const tabbarProps = {
    ...commonProps,
    /**
     * @description 选中标签的索引值或者名称
     */
    modelValue: makeNumericProp(0),
    /**
     * @description 是否固定在页面底部
     */
    bottom: Boolean,
    /**
     * @description icon激活的颜色
     */
    activeColor: String,
    /**
     * @description icon未激活的颜色
     */
    unactiveColor: String,
    /**
     * @description 是否开启iphone系列全面屏底部安全区适配
     */
    safeAreaInsetBottom: Boolean,
    /**
     * @description 固定在底部时，是否在标签位置生成一个等高的占位元素
     */
    placeholder: Boolean
  };
  const tabbarEmits = {
    tabSwitch: (val, index) => val instanceof Object && (isNumber(index) || isString(index)),
    [UPDATE_MODEL_EVENT]: (val) => isString(val) || isNumber(val)
  };
  const TABBAR_CONTEXT_KEY = Symbol("TABBAR_CONTEXT");
  const componentName$d = `${PREFIX}-tabbar`;
  const __default__$b = vue.defineComponent({
    name: componentName$d,
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  });
  const _sfc_main$o = /* @__PURE__ */ vue.defineComponent({
    ...__default__$b,
    props: tabbarProps,
    emits: tabbarEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const instance = vue.getCurrentInstance();
      const { getSelectorNodeInfo } = useSelectorQuery(instance);
      const classes = vue.computed(() => {
        return getMainClass(props, componentName$d, {
          "nut-tabbar-bottom": props.bottom,
          "nut-tabbar-safebottom": props.safeAreaInsetBottom
        });
      });
      const wrapperClasses = vue.computed(() => {
        return {
          "nut-tabbar__placeholder": props.bottom && props.placeholder
        };
      });
      const trulyHeight = vue.ref();
      const wrapperStyles = vue.computed(() => {
        const value = {};
        if (trulyHeight.value != null) {
          value.height = `${trulyHeight.value}px`;
        }
        return value;
      });
      const parentData = vue.reactive({
        modelValue: props.modelValue,
        activeColor: props.activeColor,
        unactiveColor: props.unactiveColor,
        children: [],
        changeIndex
      });
      vue.provide(TABBAR_CONTEXT_KEY, parentData);
      vue.watch(() => props.modelValue, (value) => {
        parentData.modelValue = value;
      });
      vue.watch(() => [props.activeColor, props.unactiveColor], ([activeColor, unactiveColor]) => {
        parentData.activeColor = activeColor;
        parentData.unactiveColor = unactiveColor;
      });
      function changeIndex(index, active) {
        parentData.modelValue = active;
        emit(UPDATE_MODEL_EVENT, active);
        emit("tabSwitch", parentData.children[index], active);
      }
      async function fetchTrulyHeight() {
        const node = await getSelectorNodeInfo(".nut-tabbar");
        trulyHeight.value = node.height;
      }
      vue.onMounted(() => {
        if (props.bottom && props.placeholder) {
          setTimeout(() => {
            fetchTrulyHeight();
          }, 500);
        }
      });
      const __returned__ = { componentName: componentName$d, props, emit, instance, getSelectorNodeInfo, classes, wrapperClasses, trulyHeight, wrapperStyles, parentData, changeIndex, fetchTrulyHeight };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.wrapperClasses),
        style: vue.normalizeStyle($setup.wrapperStyles)
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass($setup.classes),
            style: vue.normalizeStyle($setup.props.customStyle)
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __unplugin_components_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__scopeId", "data-v-36e4f19c"], ["__file", "D:/WebStormProject/bird-identification-app/node_modules/nutui-uniapp/components/tabbar/tabbar.vue"]]);
  const badgeProps = {
    ...commonProps,
    /**
     * @description 显示的内容
     */
    value: [String, Number],
    /**
     * @description `value` 为数值时，最大值
     */
    max: makeNumberProp(1e4),
    /**
     * @description 是否为小点
     */
    dot: Boolean,
    /**
     * @description 是否为气泡形状
     * @since >v4.0.0
     */
    bubble: Boolean,
    /**
     * @description 是否隐藏
     */
    hidden: Boolean,
    /**
     * @description 上下偏移量，支持单位设置，可设置为：`5px` 等
     */
    top: makeStringProp("0"),
    /**
     * @description 左右偏移量，支持单位设置，可设置为：`5px` 等
     */
    right: makeStringProp("0"),
    /**
     * @description 徽标的 `z-index` 值
     */
    zIndex: makeNumberProp(10),
    /**
     * @description 徽标背景颜色
     */
    customColor: makeStringProp("")
  };
  const componentName$c = `${PREFIX}-badge`;
  const __default__$a = vue.defineComponent({
    name: componentName$c,
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  });
  const _sfc_main$n = /* @__PURE__ */ vue.defineComponent({
    ...__default__$a,
    props: badgeProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const getStyle = vue.computed(() => {
        return getMainStyle(props, {
          top: pxCheck(props.top),
          right: pxCheck(props.right),
          zIndex: props.zIndex,
          background: props.customColor
        });
      });
      const classes = vue.computed(() => {
        return getMainClass(props, componentName$c);
      });
      const content = vue.computed(() => {
        if (props.dot)
          return;
        const value = props.value;
        const max = props.max;
        if (typeof value === "number" && typeof max === "number")
          return max < value ? `${max}+` : value;
        return value;
      });
      const __returned__ = { componentName: componentName$c, props, getStyle, classes, content };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.classes)
      },
      [
        !$setup.props.hidden && !$setup.props.dot && _ctx.$slots.icon ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: "nut-badge__icon",
            style: vue.normalizeStyle($setup.getStyle)
          },
          [
            vue.renderSlot(_ctx.$slots, "icon", {}, void 0, true)
          ],
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true),
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
        !$setup.props.hidden && ($setup.content || $setup.props.dot) ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 1,
            class: vue.normalizeClass(["nut-badge__content nut-badge__content--sup", { "nut-badge__content--dot": $setup.props.dot, "nut-badge__content--bubble": !$setup.props.dot && $setup.props.bubble }]),
            style: vue.normalizeStyle($setup.getStyle)
          },
          vue.toDisplayString($setup.content),
          7
          /* TEXT, CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const NutBadge = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__scopeId", "data-v-9ec2ecfa"], ["__file", "D:/WebStormProject/bird-identification-app/node_modules/nutui-uniapp/components/badge/badge.vue"]]);
  const iconProps = {
    ...commonProps,
    popClass: { type: String, default: "" },
    /**
     * @description 图标宽度
     */
    width: makeNumericProp(""),
    /**
     * @description 图标高度
     */
    height: makeNumericProp(""),
    /**
     * @description 图标名称
     */
    name: makeStringProp(""),
    /**
     * @description 图标大小
     */
    size: makeNumericProp(""),
    /**
     * @description 自定义 `icon` 类名前缀，用于使用自定义图标
     */
    classPrefix: { type: String, default: "nut-icon" },
    /**
     * @description  自定义 `icon` 字体基础类名
     */
    fontClassName: { type: String, default: "nutui-iconfont" },
    /**
     * @description 图标颜色
     */
    customColor: { type: String, default: "" }
  };
  const iconEmits = {
    [CLICK_EVENT]: (evt) => evt instanceof Object
  };
  const componentName$b = `${PREFIX}-icon`;
  const __default__$9 = vue.defineComponent({
    name: componentName$b,
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  });
  const _sfc_main$m = /* @__PURE__ */ vue.defineComponent({
    ...__default__$9,
    props: iconProps,
    emits: iconEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emits = __emit;
      function handleClick(event) {
        emits(CLICK_EVENT, event);
      }
      const isImage = vue.computed(() => {
        return props.name ? props.name.includes("/") : false;
      });
      const classes = vue.computed(() => {
        const obj = {};
        if (isImage.value) {
          obj[`${componentName$b}__img`] = true;
        } else {
          obj[props.fontClassName] = true;
          obj[`${props.classPrefix}-${props.name}`] = true;
          obj[props.popClass] = true;
        }
        return getMainClass(props, componentName$b, obj);
      });
      const getStyle = vue.computed(() => {
        const style = {
          color: props.customColor,
          fontSize: pxCheck(props.size),
          width: pxCheck(props.width),
          height: pxCheck(props.height)
        };
        return getMainStyle(props, style);
      });
      const __returned__ = { componentName: componentName$b, props, emits, handleClick, isImage, classes, getStyle };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return $setup.isImage ? (vue.openBlock(), vue.createElementBlock("image", {
      key: 0,
      class: vue.normalizeClass($setup.classes),
      style: vue.normalizeStyle($setup.getStyle),
      src: _ctx.name,
      onClick: $setup.handleClick
    }, null, 14, ["src"])) : (vue.openBlock(), vue.createElementBlock(
      "text",
      {
        key: 1,
        class: vue.normalizeClass($setup.classes),
        style: vue.normalizeStyle($setup.getStyle),
        onClick: $setup.handleClick
      },
      null,
      6
      /* CLASS, STYLE */
    ));
  }
  const NutIcon = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__scopeId", "data-v-cd13477f"], ["__file", "D:/WebStormProject/bird-identification-app/node_modules/nutui-uniapp/components/icon/icon.vue"]]);
  const tabbaritemProps = {
    ...commonProps,
    ...badgeProps,
    /**
     * @description 标签名称，作为匹配的标识符
     */
    name: String,
    /**
     * @description 标签页显示的图标
     */
    icon: String,
    /**
     * @description 标签页的标题
     */
    tabTitle: String
  };
  const componentName$a = `${PREFIX}-tabbar-item`;
  const __default__$8 = vue.defineComponent({
    name: componentName$a,
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  });
  const _sfc_main$l = /* @__PURE__ */ vue.defineComponent({
    ...__default__$8,
    props: tabbaritemProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const slots = vue.useSlots();
      const instance = vue.getCurrentInstance();
      const tabbarContext = vue.inject(TABBAR_CONTEXT_KEY);
      const innerIndex = vue.ref(-1);
      const innerValue = vue.computed(() => {
        if (props.name != null) {
          return props.name;
        }
        return innerIndex.value;
      });
      const isActive = vue.computed(() => {
        if (tabbarContext == null) {
          return false;
        }
        return innerValue.value === tabbarContext.modelValue;
      });
      const classes = vue.computed(() => {
        return getMainClass(props, componentName$a, {
          "nut-tabbar-item__icon--unactive": !isActive.value
        });
      });
      const styles = vue.computed(() => {
        const value = {};
        if (tabbarContext != null) {
          value.color = isActive.value ? tabbarContext.activeColor : tabbarContext.unactiveColor;
        }
        return getMainStyle(props, value);
      });
      function triggerChange() {
        if (tabbarContext == null) {
          return;
        }
        tabbarContext.changeIndex(innerIndex.value, innerValue.value);
      }
      function bindContext() {
        if (tabbarContext == null || instance == null || instance.proxy == null) {
          return;
        }
        tabbarContext.children.push(instance.proxy);
        innerIndex.value = tabbarContext.children.indexOf(instance.proxy);
      }
      function unbindContext() {
        if (tabbarContext == null) {
          return;
        }
        tabbarContext.children.splice(innerIndex.value, 1);
      }
      vue.onMounted(() => {
        bindContext();
      });
      vue.onBeforeUnmount(() => {
        unbindContext();
      });
      const __returned__ = { componentName: componentName$a, props, slots, instance, tabbarContext, innerIndex, innerValue, isActive, classes, styles, triggerChange, bindContext, unbindContext, NutBadge, NutIcon };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.classes),
        style: vue.normalizeStyle($setup.styles),
        onClick: _cache[0] || (_cache[0] = ($event) => $setup.triggerChange())
      },
      [
        vue.createVNode($setup["NutBadge"], {
          value: $setup.props.value,
          "custom-color": $setup.props.customColor,
          top: $setup.props.top,
          right: $setup.props.right,
          max: $setup.props.max,
          dot: $setup.props.dot,
          bubble: $setup.props.bubble,
          hidden: $setup.props.hidden,
          "z-index": $setup.props.zIndex
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "nut-tabbar-item_icon-box" }, [
              $setup.slots.icon ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "nut-tabbar-item_icon-box_icon"
              }, [
                vue.renderSlot(_ctx.$slots, "icon", { active: $setup.isActive }, void 0, true)
              ])) : (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                { key: 1 },
                [
                  $setup.props.icon ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
                    vue.createVNode($setup["NutIcon"], {
                      "custom-class": "nut-popover-item-img",
                      name: $setup.props.icon
                    }, null, 8, ["name"])
                  ])) : vue.createCommentVNode("v-if", true)
                ],
                64
                /* STABLE_FRAGMENT */
              )),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["nut-tabbar-item_icon-box_nav-word", { "nut-tabbar-item_icon-box_big-word": !$setup.props.icon && !$setup.slots.icon }])
                },
                [
                  $setup.slots.default ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }, void 0, true) : (vue.openBlock(), vue.createElementBlock(
                    vue.Fragment,
                    { key: 1 },
                    [
                      $setup.props.tabTitle ? (vue.openBlock(), vue.createElementBlock(
                        "view",
                        { key: 0 },
                        vue.toDisplayString($setup.props.tabTitle),
                        1
                        /* TEXT */
                      )) : vue.createCommentVNode("v-if", true)
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  ))
                ],
                2
                /* CLASS */
              )
            ])
          ]),
          _: 3
          /* FORWARDED */
        }, 8, ["value", "custom-color", "top", "right", "max", "dot", "bubble", "hidden", "z-index"])
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __unplugin_components_0$4 = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__scopeId", "data-v-b4ec6fcd"], ["__file", "D:/WebStormProject/bird-identification-app/node_modules/nutui-uniapp/components/tabbaritem/tabbaritem.vue"]]);
  const _sfc_main$k = /* @__PURE__ */ vue.defineComponent({
    __name: "tab-bar",
    props: {
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const tabSwitch = (item, index) => {
        switch (item.tabTitle) {
          case "首页":
            uni.navigateTo({
              url: "/pages/index"
            });
            break;
          case "ai识鸟":
            uni.navigateTo({
              url: "/pages/identification-bird"
            });
            break;
          case "今日分享":
            uni.navigateTo({
              url: "/pages/today-share"
            });
            break;
          case "鸟窝探秘":
            uni.navigateTo({
              url: "/pages/explore-bird-nest"
            });
            break;
          case "我的":
            uni.navigateTo({
              url: "/pages/myself"
            });
            break;
          default:
            uni.navigateTo({
              url: "/pages/index"
            });
            break;
        }
      };
      const props = __props;
      const innerIndex = vue.computed(() => {
        return props.currentIndex;
      });
      const __returned__ = { tabSwitch, props, innerIndex };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_nut_tabbar_item = __unplugin_components_0$4;
    const _component_nut_tabbar = __unplugin_components_1$1;
    return vue.openBlock(), vue.createBlock(_component_nut_tabbar, {
      "model-value": $setup.innerIndex,
      onTabSwitch: $setup.tabSwitch
    }, {
      default: vue.withCtx(() => [
        vue.createVNode(_component_nut_tabbar_item, {
          "tab-title": "首页",
          icon: "home"
        }),
        vue.createVNode(_component_nut_tabbar_item, {
          "tab-title": "ai识鸟",
          icon: "category"
        }),
        vue.createVNode(_component_nut_tabbar_item, {
          "tab-title": "今日分享",
          icon: "find"
        }),
        vue.createVNode(_component_nut_tabbar_item, {
          "tab-title": "鸟窝探秘",
          icon: "cart"
        }),
        vue.createVNode(_component_nut_tabbar_item, {
          "tab-title": "我的",
          icon: "my"
        })
      ]),
      _: 1
      /* STABLE */
    }, 8, ["model-value"]);
  }
  const TabBar = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__file", "D:/WebStormProject/bird-identification-app/src/components/tab-bar.vue"]]);
  const _sfc_main$j = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const swiperList = vue.ref([]);
      const commonBirdList = vue.ref();
      vue.onMounted(() => {
        swiperList.value = [
          "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
          "https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg",
          "https://storage.360buyimg.com/jdc-article/welcomenutui.jpg",
          "https://storage.360buyimg.com/jdc-article/fristfabu.jpg"
        ];
        commonBirdList.value = [
          "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
          "https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg",
          "https://storage.360buyimg.com/jdc-article/welcomenutui.jpg",
          "https://storage.360buyimg.com/jdc-article/fristfabu.jpg"
        ];
      });
      const __returned__ = { swiperList, commonBirdList, TabBar };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_nut_swiper_item = __unplugin_components_0$5;
    const _component_nut_swiper = __unplugin_components_1$2;
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("view", { class: "container" }, [
        vue.createElementVNode("view", { class: "top" }, [
          vue.createVNode(_component_nut_swiper, {
            "init-page": 0,
            "pagination-visible": true,
            "pagination-color": "#426543",
            "auto-play": "3000"
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.swiperList, (item) => {
                  return vue.openBlock(), vue.createBlock(
                    _component_nut_swiper_item,
                    { key: item },
                    {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("img", {
                          src: item,
                          alt: ""
                        }, null, 8, ["src"])
                      ]),
                      _: 2
                      /* DYNAMIC */
                    },
                    1024
                    /* DYNAMIC_SLOTS */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            _: 1
            /* STABLE */
          })
        ]),
        vue.createElementVNode("view", { class: "middle" }, [
          vue.createElementVNode("view", { class: "left" }, [
            vue.createElementVNode("img", {
              src: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
              alt: ""
            })
          ]),
          vue.createElementVNode("view", { class: "right" }, [
            vue.createElementVNode("img", {
              src: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
              alt: ""
            }),
            vue.createElementVNode("img", {
              src: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
              alt: ""
            })
          ])
        ]),
        vue.createElementVNode("view", { class: "bottom" }, [
          vue.createElementVNode("text", null, " 地区常见鸟 "),
          vue.createVNode(_component_nut_swiper, {
            loop: false,
            "init-page": 0,
            "pagination-visible": false,
            width: "200"
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.commonBirdList, (item) => {
                  return vue.openBlock(), vue.createBlock(
                    _component_nut_swiper_item,
                    { key: item },
                    {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("img", {
                          src: item,
                          alt: ""
                        }, null, 8, ["src"])
                      ]),
                      _: 2
                      /* DYNAMIC */
                    },
                    1024
                    /* DYNAMIC_SLOTS */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            _: 1
            /* STABLE */
          })
        ])
      ]),
      vue.createElementVNode("view", { class: "bottom" }, [
        vue.createVNode($setup["TabBar"], { "current-index": 0 })
      ])
    ]);
  }
  const PagesIndex = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__scopeId", "data-v-d1d3d0d7"], ["__file", "D:/WebStormProject/bird-identification-app/src/pages/index.vue"]]);
  const transitionProps = {
    ...commonProps,
    /**
     * @description 内置动画名称，可选值为 `fade` `fade-up` `fade-down` f`ade-left` `fade-right` `slide-up` `slide-down` `slide-left` `slide-right`
     */
    name: makeStringProp("fade"),
    /**
     * @description 是否展示过渡动画级
     */
    show: Boolean,
    /**
     * @description 动画时长，单位为毫秒
     */
    duration: makeNumberProp(300),
    /**
     * @description 动画函数
     */
    timingFunction: makeStringProp("ease"),
    destroyOnClose: Boolean,
    /**
     * @description 进入动画前的类名
     */
    enterFromClass: String,
    /**
     * @description 进入动画时的类名
     */
    enterActiveClass: String,
    /**
     * @description 进入动画后的类名
     */
    enterToClass: String,
    /**
     * @description 离开动画前的类名
     */
    leaveFromClass: String,
    /**
     * @description 离开动画时的类名
     */
    leaveActiveClass: String,
    /**
     * @description 离开动画后的类名
     */
    leaveToClass: String
  };
  const transitionEmits = {
    beforeEnter: () => true,
    enter: () => true,
    afterEnter: () => true,
    beforeLeave: () => true,
    leave: () => true,
    afterLeave: () => true,
    [CLICK_EVENT]: (evt) => evt instanceof Object
  };
  const defaultAnimations = {
    "fade": {
      enter: "nutFadeIn",
      leave: "nutFadeOut"
    },
    "fade-up": {
      enter: "nutFadeUpIn",
      leave: "nutFadeUpOut"
    },
    "fade-down": {
      enter: "nutFadeDownIn",
      leave: "nutFadeDownOut"
    },
    "fade-left": {
      enter: "nutFadeLeftIn",
      leave: "nutFadeLeftOut"
    },
    "fade-right": {
      enter: "nutFadeRightIn",
      leave: "nutFadeRightOut"
    },
    "slide-up": {
      enter: "nutSlideUpIn",
      leave: "nutSlideDownOut"
    },
    "slide-down": {
      enter: "nutSlideDownIn",
      leave: "nutSlideUpOut"
    },
    "slide-left": {
      enter: "nutSlideLeftIn",
      leave: "nutSlideLeftOut"
    },
    "slide-right": {
      enter: "nutSlideRightIn",
      leave: "nutSlideRightOut"
    },
    "zoom": {
      enter: "nutZoomIn",
      leave: "nutZoomOut"
    }
  };
  const componentName$9 = `${PREFIX}-transition`;
  function isKeyOfAnimations(value) {
    const keys = Object.keys(defaultAnimations);
    return keys.includes(value);
  }
  function getDefaultClassNames(name2) {
    return {
      enter: `${name2}-enter-from`,
      enterActive: `${name2}-enter-active`,
      enterTo: `${name2}-enter-to ${name2}-enter-active`,
      leave: `${name2}-leave-from`,
      leaveActive: `${name2}-leave-active`,
      leaveTo: `${name2}-leave-to ${name2}-leave-active`
    };
  }
  function getClassNames(name2, {
    enterClass,
    enterActiveClass,
    enterToClass,
    leaveClass,
    leaveActiveClass,
    leaveToClass
  }) {
    const defaultClassNames = getDefaultClassNames(name2);
    return {
      enter: enterClass || defaultClassNames.enter,
      enterActive: enterActiveClass || defaultClassNames.enterActive,
      enterTo: enterToClass || defaultClassNames.enterTo,
      leave: leaveClass || defaultClassNames.leave,
      leaveActive: leaveActiveClass || defaultClassNames.leaveActive,
      leaveTo: leaveToClass || defaultClassNames.leaveTo
    };
  }
  function useTransition(props, emit) {
    const display = vue.ref(false);
    const name2 = vue.computed(() => props.name || "fade");
    const duration = vue.computed(() => props.duration || 200);
    const animationClass = vue.ref("");
    const classNames = vue.computed(
      () => getClassNames(props.name, {
        enterClass: props.enterFromClass,
        enterActiveClass: props.enterActiveClass,
        enterToClass: props.enterToClass,
        leaveClass: props.leaveFromClass,
        leaveActiveClass: props.leaveActiveClass,
        leaveToClass: props.leaveToClass
      })
    );
    async function enter() {
      var _a, _b;
      if (display.value)
        return;
      emit("beforeEnter");
      display.value = true;
      animationClass.value = ((_a = defaultAnimations[name2.value]) == null ? void 0 : _a.enter) ? (_b = defaultAnimations[name2.value]) == null ? void 0 : _b.enter : `${classNames.value.enter} ${classNames.value.enterActive}`;
      await vue.nextTick();
      emit("enter");
      setTimeout(() => {
        if (!isKeyOfAnimations(props.name))
          animationClass.value = classNames.value.enterTo;
        emit("afterEnter");
      }, duration.value);
    }
    async function leave() {
      var _a, _b;
      if (!display.value)
        return;
      emit("beforeLeave");
      animationClass.value = ((_a = defaultAnimations[name2.value]) == null ? void 0 : _a.leave) ? (_b = defaultAnimations[name2.value]) == null ? void 0 : _b.leave : `${classNames.value.leave} ${classNames.value.leaveActive}`;
      await vue.nextTick();
      emit("leave");
      setTimeout(() => {
        if (!props.show && display.value)
          display.value = false;
        if (!isKeyOfAnimations(props.name))
          animationClass.value = classNames.value.leaveTo;
        emit("afterLeave");
      }, duration.value);
    }
    vue.watch(
      () => props.show,
      (val) => {
        val ? enter() : leave();
      },
      { immediate: true }
    );
    function clickHandler(evt) {
      emit(CLICK_EVENT, evt);
    }
    const classes = vue.computed(() => {
      return getMainClass(props, componentName$9, {
        [animationClass.value]: true,
        "nut-hidden": !display.value
      });
    });
    const styles = vue.computed(() => {
      return getMainStyle(props, {
        "animation-duration": isKeyOfAnimations(props.name) ? `${props.duration}ms` : "",
        "animation-timing-function": isKeyOfAnimations(props.name) ? props.timingFunction : ""
      });
    });
    return {
      display,
      classes,
      styles,
      clickHandler
    };
  }
  const componentName$8 = `${PREFIX}-transition`;
  const __default__$7 = vue.defineComponent({
    name: componentName$8,
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  });
  const _sfc_main$i = /* @__PURE__ */ vue.defineComponent({
    ...__default__$7,
    props: transitionProps,
    emits: transitionEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emits = __emit;
      const { display, classes, clickHandler, styles } = useTransition(props, emits);
      const __returned__ = { componentName: componentName$8, props, emits, display, classes, clickHandler, styles };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return !$setup.props.destroyOnClose || $setup.display ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass($setup.classes),
        style: vue.normalizeStyle($setup.styles),
        onClick: _cache[0] || (_cache[0] = (...args) => $setup.clickHandler && $setup.clickHandler(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    )) : vue.createCommentVNode("v-if", true);
  }
  const NutTransition = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-6604b1ac"], ["__file", "D:/WebStormProject/bird-identification-app/node_modules/nutui-uniapp/components/transition/transition.vue"]]);
  const overlayProps = {
    ...commonProps,
    /**
     * @description 控制遮罩的显示/隐藏
     */
    visible: Boolean,
    /**
     * @description 自定义遮罩层级
     */
    zIndex: Number,
    /**
     * @description 显示/隐藏的动画时长，单位毫秒
     */
    duration: makeNumericProp(300),
    /**
     * @description 自定义遮罩类名
     */
    overlayClass: makeStringProp(""),
    /**
     * @description 自定义遮罩样式
     */
    overlayStyle: Object,
    /**
     * @description 遮罩显示时的背景是否锁定
     */
    lockScroll: Boolean,
    /**
     * @description 点击遮罩时是否关闭
     */
    closeOnClickOverlay: truthProp,
    /**
     * @description 是否保留遮罩关闭后的内容
     */
    destroyOnClose: Boolean
  };
  const overlayEmits = {
    [UPDATE_VISIBLE_EVENT]: (visible) => isBoolean(visible),
    [CLICK_EVENT]: (evt) => evt instanceof Object
  };
  const componentName$7 = `${PREFIX}-overlay`;
  const __default__$6 = vue.defineComponent({
    name: componentName$7,
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  });
  const _sfc_main$h = /* @__PURE__ */ vue.defineComponent({
    ...__default__$6,
    props: overlayProps,
    emits: overlayEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const classes = vue.computed(() => {
        return getMainClass(props, componentName$7, {
          [props.overlayClass]: true
        });
      });
      const innerDuration = vue.computed(() => {
        if (typeof props.duration === "number")
          return props.duration;
        return Number(props.duration);
      });
      const styles = vue.computed(() => {
        return getMainStyle(props, {
          transitionDuration: `${innerDuration.value}ms`,
          zIndex: props.zIndex,
          ...props.overlayStyle
        });
      });
      function onClick(event) {
        emit(CLICK_EVENT, event);
        if (props.closeOnClickOverlay)
          emit(UPDATE_VISIBLE_EVENT, false);
      }
      const __returned__ = { componentName: componentName$7, props, emit, classes, innerDuration, styles, onClick, NutTransition };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createBlock($setup["NutTransition"], {
      "custom-class": $setup.classes,
      "custom-style": $setup.styles,
      show: $setup.props.visible,
      name: "fade",
      duration: $setup.innerDuration,
      "destroy-on-close": $setup.props.destroyOnClose,
      onClick: $setup.onClick
    }, {
      default: vue.withCtx(() => [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ]),
      _: 3
      /* FORWARDED */
    }, 8, ["custom-class", "custom-style", "show", "duration", "destroy-on-close"]);
  }
  const NutOverlay = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-53e96d45"], ["__file", "D:/WebStormProject/bird-identification-app/node_modules/nutui-uniapp/components/overlay/overlay.vue"]]);
  const popupProps = {
    ...overlayProps,
    ...commonProps,
    /**
     * @description 弹出位置（top,bottom,left,right,center）
     */
    position: makeStringProp("center"),
    /**
     * @description 动画名
     */
    transition: {
      type: String,
      default: ""
    },
    /**
     * @description 自定义弹框类名
     */
    popClass: makeStringProp(""),
    /**
     * @description 是否显示关闭按钮
     */
    closeable: Boolean,
    /**
     * @description 关闭按钮位置（top-left,top-right,bottom-left,bottom-right）
     */
    closeIconPosition: makeStringProp("top-right"),
    /**
     * @description 关闭按钮图标
     */
    closeIcon: makeStringProp("close"),
    /**
     * @description 是否保留弹层关闭后的内容
     */
    destroyOnClose: truthProp,
    /**
     * @description 是否显示遮罩层
     */
    overlay: truthProp,
    /**
     * @description 是否显示圆角
     */
    round: Boolean,
    /**
     * @description 是否开启 iPhone 系列全面屏底部安全区适配，仅当 `position` 为 `bottom` 时有效
     */
    safeAreaInsetBottom: Boolean,
    /**
     * @description 是否开启 iPhone 顶部安全区适配
     */
    safeAreaInsetTop: truthProp
  };
  const popupEmits = {
    [UPDATE_VISIBLE_EVENT]: (visible) => isBoolean(visible),
    "click-pop": (evt) => evt instanceof Object,
    "click-close-icon": () => true,
    [OPEN_EVENT]: () => true,
    [CLOSE_EVENT]: () => true,
    [OPENED_EVENT]: () => true,
    /**
     * @deprecated
     */
    "opend": () => true,
    [CLOSED_EVENT]: () => true,
    "click-overlay": () => true
  };
  const componentName$6 = `${PREFIX}-popup`;
  function usePopup(props, emit) {
    const state = vue.reactive({
      innerVisible: false,
      innerIndex: props.zIndex,
      showSlot: true
    });
    const classes = vue.computed(() => {
      return getMainClass(props, componentName$6, {
        round: props.round,
        [`nut-popup--${props.position}`]: true,
        [`nut-popup--${props.position}--safebottom`]: props.position === "bottom" && props.safeAreaInsetBottom,
        [`nut-popup--${props.position}--safetop`]: props.position === "top" && props.safeAreaInsetTop,
        [props.popClass]: true
      });
    });
    const popStyle = vue.computed(() => {
      return getMainStyle(props, {
        zIndex: state.innerIndex,
        transitionDuration: `${props.duration}ms`
      });
    });
    const transitionName = vue.computed(() => {
      return props.transition ? props.transition : `${animationName[props.position]}`;
    });
    const open = () => {
      if (state.innerVisible)
        return;
      state.innerIndex = props.zIndex !== void 0 ? props.zIndex : useGlobalZIndex();
      state.innerVisible = true;
      emit(UPDATE_VISIBLE_EVENT, true);
      state.showSlot = true;
      emit(OPEN_EVENT);
    };
    const close = () => {
      if (!state.innerVisible)
        return;
      state.innerVisible = false;
      emit(UPDATE_VISIBLE_EVENT, false);
      emit(CLOSE_EVENT);
    };
    const onClick = (e) => {
      emit("click-pop", e);
    };
    const onClickCloseIcon = (e) => {
      e.stopPropagation();
      emit("click-close-icon");
      close();
    };
    const onClickOverlay = () => {
      emit("click-overlay");
      if (props.closeOnClickOverlay)
        close();
    };
    const onOpened = () => {
      emit(OPENED_EVENT);
      emit("opend");
    };
    const onClosed = () => {
      emit(CLOSED_EVENT);
      state.showSlot = !props.destroyOnClose;
    };
    vue.watch(() => props.visible, (value) => {
      if (value && !state.innerVisible)
        open();
      if (!value && state.innerVisible) {
        state.innerVisible = false;
        emit(CLOSE_EVENT);
      }
    });
    return {
      ...vue.toRefs(state),
      popStyle,
      transitionName,
      classes,
      onClick,
      onClickCloseIcon,
      onClickOverlay,
      onOpened,
      onClosed
    };
  }
  const componentName$5 = `${PREFIX}-popup`;
  const __default__$5 = vue.defineComponent({
    name: componentName$5,
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  });
  const _sfc_main$g = /* @__PURE__ */ vue.defineComponent({
    ...__default__$5,
    props: popupProps,
    emits: popupEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const {
        classes,
        popStyle,
        innerIndex,
        showSlot,
        transitionName,
        onClick,
        onClickCloseIcon,
        onClickOverlay,
        onOpened,
        onClosed
      } = usePopup(props, emit);
      const __returned__ = { componentName: componentName$5, props, emit, classes, popStyle, innerIndex, showSlot, transitionName, onClick, onClickCloseIcon, onClickOverlay, onOpened, onClosed, NutIcon, NutOverlay, NutTransition };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        $setup.props.overlay ? (vue.openBlock(), vue.createBlock($setup["NutOverlay"], vue.mergeProps({ key: 0 }, _ctx.$attrs, {
          visible: $setup.props.visible,
          "close-on-click-overlay": $setup.props.closeOnClickOverlay,
          "z-index": $setup.innerIndex,
          "lock-scroll": $setup.props.lockScroll,
          duration: $setup.props.duration,
          "overlay-class": $setup.props.overlayClass,
          "overlay-style": $setup.props.overlayStyle,
          "destroy-on-close": $setup.props.destroyOnClose,
          onClick: $setup.onClickOverlay
        }), null, 16, ["visible", "close-on-click-overlay", "z-index", "lock-scroll", "duration", "overlay-class", "overlay-style", "destroy-on-close", "onClick"])) : vue.createCommentVNode("v-if", true),
        vue.createVNode($setup["NutTransition"], {
          name: $setup.transitionName,
          "custom-class": $setup.classes,
          show: $setup.props.visible,
          "destroy-on-close": $setup.props.destroyOnClose,
          "custom-style": $setup.popStyle,
          duration: Number($setup.props.duration),
          onAfterEnter: $setup.onOpened,
          onAfterLeave: $setup.onClosed,
          onClick: $setup.onClick
        }, {
          default: vue.withCtx(() => [
            $setup.showSlot ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }, void 0, true) : vue.createCommentVNode("v-if", true),
            $setup.props.closeable ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 1,
                class: vue.normalizeClass(["nut-popup__close-icon", `nut-popup__close-icon--${$setup.props.closeIconPosition}`]),
                onClick: _cache[0] || (_cache[0] = (...args) => $setup.onClickCloseIcon && $setup.onClickCloseIcon(...args))
              },
              [
                vue.renderSlot(_ctx.$slots, "closeIcon", {}, () => [
                  vue.createVNode($setup["NutIcon"], {
                    name: "close",
                    height: "12px"
                  })
                ], true)
              ],
              2
              /* CLASS */
            )) : vue.createCommentVNode("v-if", true)
          ]),
          _: 3
          /* FORWARDED */
        }, 8, ["name", "custom-class", "show", "destroy-on-close", "custom-style", "duration", "onAfterEnter", "onAfterLeave", "onClick"])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const NutPopup = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-551f68f5"], ["__file", "D:/WebStormProject/bird-identification-app/node_modules/nutui-uniapp/components/popup/popup.vue"]]);
  const actionsheetProps = {
    ...popupProps,
    ...commonProps,
    /**
     * @description 是否显示圆角
     */
    round: truthProp,
    /**
     * @description 是否开启 iPhone 系列全面屏底部安全区适配，仅当 `position` 为 `bottom` 时有效
     */
    safeAreaInsetBottom: truthProp,
    /**
     * @description 遮罩显示时的背景是否锁定
     */
    lockScroll: truthProp,
    /**
     * @description 自定义 popup 弹框样式
     */
    popStyle: {
      type: Object
    },
    /**
     * @description 取消文案
     */
    cancelTxt: makeStringProp(""),
    /**
     * @description 设置列表项标题展示使用参数
     */
    optionTag: makeStringProp("name"),
    /**
     * @description 设置列表项二级标题展示使用参数
     */
    optionSubTag: makeStringProp("subname"),
    /**
     * @description 设置选中项的值，和 'option-tag' 的值对应
     */
    chooseTagValue: makeStringProp(""),
    /**
     * @description 设置列表项标题
     */
    title: makeStringProp(""),
    /**
     * @description 选中项颜色，当 choose-tag-value == option-tag 的值 生效
     */
    customColor: makeStringProp("#ee0a24"),
    /**
     * @description 设置列表项副标题/描述
     */
    description: makeStringProp(""),
    /**
     * @description 列表项
     */
    menuItems: makeArrayProp([]),
    /**
     * @description 遮罩层是否可关闭
     */
    closeAbled: truthProp
  };
  const actionsheetEmits = {
    [CLOSE_EVENT]: () => true,
    [UPDATE_VISIBLE_EVENT]: (val) => isBoolean(val),
    [CANCEL_EVENT]: () => true,
    [CHOOSE_EVENT]: (item, index) => item instanceof Object && isNumber(index)
  };
  const componentName$4 = `${PREFIX}-action-sheet`;
  const __default__$4 = vue.defineComponent({
    name: componentName$4,
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  });
  const _sfc_main$f = /* @__PURE__ */ vue.defineComponent({
    ...__default__$4,
    props: actionsheetProps,
    emits: actionsheetEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const slotDefault = !!vue.useSlots().default;
      const classes = vue.computed(() => {
        return getMainClass(props, componentName$4);
      });
      function isHighlight(item) {
        return props.chooseTagValue && props.chooseTagValue === item[props.optionTag] ? props.customColor : "";
      }
      function cancelActionSheet() {
        emit(CANCEL_EVENT);
        emit(UPDATE_VISIBLE_EVENT, false);
      }
      function chooseItem(item, index) {
        if (!item.disable && !item.loading) {
          emit(CHOOSE_EVENT, item, index);
          emit(UPDATE_VISIBLE_EVENT, false);
        }
      }
      function close() {
        if (props.closeAbled) {
          emit(CLOSE_EVENT);
          emit(UPDATE_VISIBLE_EVENT, false);
        }
      }
      const __returned__ = { componentName: componentName$4, props, emit, slotDefault, classes, isHighlight, cancelActionSheet, chooseItem, close, NutIcon, NutPopup };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createBlock($setup["NutPopup"], {
      "pop-class": $setup.props.popClass,
      "custom-style": $setup.props.popStyle,
      visible: $setup.props.visible,
      position: "bottom",
      overlay: $setup.props.overlay,
      round: $setup.props.round,
      "safe-area-inset-bottom": $setup.props.safeAreaInsetBottom,
      "z-index": $setup.props.zIndex,
      duration: $setup.props.duration,
      "overlay-class": $setup.props.overlayClass,
      "overlay-style": $setup.props.overlayStyle,
      "lock-scroll": $setup.props.lockScroll,
      "close-on-click-overlay": $setup.props.closeAbled,
      onClickOverlay: $setup.close
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass($setup.classes),
            style: vue.normalizeStyle($setup.props.customStyle)
          },
          [
            $setup.props.title ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: "nut-action-sheet__title"
              },
              vue.toDisplayString($setup.props.title),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true),
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
            !$setup.slotDefault ? (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, [
              $setup.props.description ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: "nut-action-sheet__item nut-action-sheet__desc"
                },
                vue.toDisplayString($setup.props.description),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true),
              $setup.props.menuItems.length ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "nut-action-sheet__menu"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.props.menuItems, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: index,
                      class: vue.normalizeClass(["nut-action-sheet__item", {
                        "nut-action-sheet__item--disabled": item.disable,
                        "nut-action-sheet__item--loading": item.loading
                      }]),
                      style: vue.normalizeStyle({ color: $setup.isHighlight(item) || item.color }),
                      onClick: ($event) => $setup.chooseItem(item, index)
                    }, [
                      item.loading ? (vue.openBlock(), vue.createBlock($setup["NutIcon"], {
                        key: 0,
                        name: "loading"
                      })) : (vue.openBlock(), vue.createElementBlock(
                        "view",
                        { key: 1 },
                        vue.toDisplayString(item[$setup.props.optionTag]),
                        1
                        /* TEXT */
                      )),
                      vue.createElementVNode(
                        "view",
                        { class: "nut-action-sheet__subdesc" },
                        vue.toDisplayString(item[$setup.props.optionSubTag]),
                        1
                        /* TEXT */
                      )
                    ], 14, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              $setup.props.cancelTxt ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 2,
                  class: "nut-action-sheet__cancel",
                  onClick: $setup.cancelActionSheet
                },
                vue.toDisplayString($setup.props.cancelTxt),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ])) : vue.createCommentVNode("v-if", true)
          ],
          6
          /* CLASS, STYLE */
        )
      ]),
      _: 3
      /* FORWARDED */
    }, 8, ["pop-class", "custom-style", "visible", "overlay", "round", "safe-area-inset-bottom", "z-index", "duration", "overlay-class", "overlay-style", "lock-scroll", "close-on-click-overlay"]);
  }
  const __unplugin_components_1 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-56211029"], ["__file", "D:/WebStormProject/bird-identification-app/node_modules/nutui-uniapp/components/actionsheet/actionsheet.vue"]]);
  const buttonProps = {
    ...commonProps,
    /**
     * @description 指定按钮按下去的样式类
     */
    hoverClass: makeStringProp("button-hover"),
    /**
     * @description 按住后多久出现点击态，单位毫秒
     */
    hoverStartTime: makeNumberProp(20),
    /**
     * @description 手指松开后点击态保留时间，单位毫秒
     */
    hoverStayTime: makeNumberProp(70),
    /**
     * @description 按钮颜色，支持传入 `linear-gradient` 渐变色
     */
    customColor: String,
    /**
     * @description 形状，可选值为 `square` `round`
     */
    shape: makeStringProp("round"),
    /**
     * @description 是否为朴素按钮
     */
    plain: Boolean,
    /**
     * @description 按钮 `loading` 状态
     */
    loading: Boolean,
    /**
     * @description 是否禁用按钮
     */
    disabled: Boolean,
    /**
     * @description 按钮类型，可选值为 `primary` `info` `warning` `danger` `success` `default`
     */
    type: makeStringProp("default"),
    /**
     * @description 表单类型，可选值 `button` `submit` `reset`
     */
    formType: makeStringProp("button"),
    /**
     * @description 尺寸，可选值为 `large` `small` `mini` `normal`
     */
    size: makeStringProp("normal"),
    /**
     * @description 是否为块级元素
     */
    block: Boolean,
    /**
     * @description 小程序开放能力
     */
    openType: String,
    /**
     * @description 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文
     */
    lang: makeStringProp("en"),
    /**
     * @description 会话来源，openType="contact"时有效
     */
    sessionFrom: String,
    /**
     * @description 会话内消息卡片标题，openType="contact"时有效
     */
    sendMessageTitle: String,
    /**
     * @description 会话内消息卡片点击跳转小程序路径，openType="contact"时有效
     */
    sendMessagePath: String,
    /**
     * @description 会话内消息卡片图片，openType="contact"时有效
     */
    sendMessageImg: String,
    /**
     * @description 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，用户点击后可以快速发送小程序消息，openType="contact"时有效
     */
    showMessageCard: Boolean,
    /**
     * @description 打开群资料卡时，传递的群号，openType="openGroupProfile"时有效
     */
    groupId: String,
    /**
     * @description 打开频道页面时，传递的频道号 openType="openGuildProfile"时有效
     */
    guildId: makeStringProp(""),
    /**
     * @description 打开公众号资料卡时，传递的号码 openType="openPublicProfile"时有效
     */
    publicId: String,
    /**
     * @description 客服的抖音号,openType="im"时有效
     */
    dataImId: String,
    /**
     * @description IM卡片类型,openType="im"时有效
     */
    dataImType: String,
    /**
     * @description 商品的id，仅支持泛知识课程库和生活服务商品库中的商品,openType="im"时有效
     */
    dataGoodsId: String,
    /**
     * @description 订单的id，仅支持交易2.0订单, openType="im"时有效
     */
    dataOrderId: String,
    /**
     * @description 商品类型，“1”代表生活服务，“2”代表泛知识。openType="im"时有效
     */
    dataBizLine: String
  };
  const buttonEmits = {
    [CLICK_EVENT]: (evt) => evt instanceof Object,
    getphonenumber: (evt) => evt instanceof Object,
    getuserinfo: (evt) => evt instanceof Object,
    error: (evt) => evt instanceof Object,
    opensetting: (evt) => evt instanceof Object,
    launchapp: (evt) => evt instanceof Object,
    contact: (evt) => evt instanceof Object,
    chooseavatar: (evt) => evt instanceof Object,
    agreeprivacyauthorization: (evt) => evt instanceof Object,
    addgroupapp: (evt) => evt instanceof Object,
    chooseaddress: (evt) => evt instanceof Object,
    chooseinvoicetitle: (evt) => evt instanceof Object,
    subscribe: (evt) => evt instanceof Object,
    login: (evt) => evt instanceof Object,
    im: (evt) => evt instanceof Object
  };
  const componentName$3 = `${PREFIX}-button`;
  const __default__$3 = vue.defineComponent({
    name: componentName$3,
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  });
  const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
    ...__default__$3,
    props: buttonProps,
    emits: buttonEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const classes = vue.computed(() => {
        return getMainClass(props, componentName$3, {
          [`${componentName$3}--${props.type}`]: !!props.type,
          [`${componentName$3}--${props.size}`]: !!props.size,
          [`${componentName$3}--${props.shape}`]: !!props.shape,
          [`${componentName$3}--plain`]: props.plain,
          [`${componentName$3}--block`]: props.block,
          [`${componentName$3}--disabled`]: props.disabled,
          [`${componentName$3}--loading`]: props.loading,
          [`${componentName$3}--hovercls`]: props.hoverClass !== "button-hover"
        });
      });
      const styles = vue.computed(() => {
        const value = {};
        if (props.customColor) {
          if (props.plain) {
            value.color = props.customColor;
            value.background = "#fff";
            if (!props.customColor.includes("gradient"))
              value.borderColor = props.customColor;
          } else {
            value.color = "#fff";
            value.background = props.customColor;
          }
        }
        return getMainStyle(props, value);
      });
      function handleClick(event) {
        if (props.disabled || props.loading)
          return;
        emit(CLICK_EVENT, event);
      }
      const __returned__ = { componentName: componentName$3, props, emit, classes, styles, handleClick, Icon: NutIcon };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("button", {
      class: vue.normalizeClass($setup.classes),
      style: vue.normalizeStyle($setup.styles),
      "form-type": $setup.props.formType === "button" ? void 0 : $setup.props.formType,
      "open-type": $setup.props.disabled || $setup.props.loading ? void 0 : $setup.props.openType,
      "hover-class": $setup.props.hoverClass,
      "hover-start-time": $setup.props.hoverStartTime,
      "hover-stay-time": $setup.props.hoverStayTime,
      "hover-stop-propagation": "",
      lang: $setup.props.lang,
      "session-from": $setup.props.sessionFrom,
      "send-message-title": $setup.props.sendMessageTitle,
      "send-message-path": $setup.props.sendMessagePath,
      "send-message-img": $setup.props.sendMessageImg,
      "show-message-card": $setup.props.showMessageCard,
      "group-id": $setup.props.groupId,
      "guild-id": $setup.props.guildId,
      "public-id": $setup.props.publicId,
      "data-im-id": $setup.props.dataImId,
      "data-im-type": $setup.props.dataImType,
      "data-goods-id": $setup.props.dataGoodsId,
      "data-order-id": $setup.props.dataOrderId,
      "data-biz-line": $setup.props.dataBizLine,
      onClick: $setup.handleClick,
      onGetphonenumber: _cache[0] || (_cache[0] = ($event) => $setup.emit("getphonenumber", $event)),
      onGetuserinfo: _cache[1] || (_cache[1] = ($event) => $setup.emit("getuserinfo", $event)),
      onError: _cache[2] || (_cache[2] = ($event) => $setup.emit("error", $event)),
      onOpensetting: _cache[3] || (_cache[3] = ($event) => $setup.emit("opensetting", $event)),
      onAddgroupapp: _cache[4] || (_cache[4] = ($event) => $setup.emit("addgroupapp", $event)),
      onChooseaddress: _cache[5] || (_cache[5] = ($event) => $setup.emit("chooseaddress", $event)),
      onChooseavatar: _cache[6] || (_cache[6] = ($event) => $setup.emit("chooseavatar", $event)),
      onChooseinvoicetitle: _cache[7] || (_cache[7] = ($event) => $setup.emit("chooseinvoicetitle", $event)),
      onLaunchapp: _cache[8] || (_cache[8] = ($event) => $setup.emit("launchapp", $event)),
      onLogin: _cache[9] || (_cache[9] = ($event) => $setup.emit("login", $event)),
      onSubscribe: _cache[10] || (_cache[10] = ($event) => $setup.emit("subscribe", $event)),
      onContact: _cache[11] || (_cache[11] = ($event) => $setup.emit("contact", $event)),
      onAgreeprivacyauthorization: _cache[12] || (_cache[12] = ($event) => $setup.emit("agreeprivacyauthorization", $event)),
      onIm: _cache[13] || (_cache[13] = ($event) => $setup.emit("im", $event))
    }, [
      vue.createElementVNode("view", { class: "nut-button__wrap" }, [
        _ctx.loading ? (vue.openBlock(), vue.createBlock($setup["Icon"], {
          key: 0,
          name: "loading",
          class: "nut-icon-loading"
        })) : vue.createCommentVNode("v-if", true),
        _ctx.$slots.icon && !_ctx.loading ? vue.renderSlot(_ctx.$slots, "icon", { key: 1 }, void 0, true) : vue.createCommentVNode("v-if", true),
        _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 2,
            class: vue.normalizeClass({ "nut-button__text": _ctx.$slots.icon || _ctx.loading })
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ],
          2
          /* CLASS */
        )) : vue.createCommentVNode("v-if", true)
      ])
    ], 46, ["form-type", "open-type", "hover-class", "hover-start-time", "hover-stay-time", "lang", "session-from", "send-message-title", "send-message-path", "send-message-img", "show-message-card", "group-id", "guild-id", "public-id", "data-im-id", "data-im-type", "data-goods-id", "data-order-id", "data-biz-line"]);
  }
  const __unplugin_components_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-7bcd9bda"], ["__file", "D:/WebStormProject/bird-identification-app/node_modules/nutui-uniapp/components/button/button.vue"]]);
  const ON_SHOW = "onShow";
  const ON_HIDE = "onHide";
  const ON_LAUNCH = "onLaunch";
  const ON_LOAD = "onLoad";
  function requireNativePlugin(name2) {
    return weex.requireModule(name2);
  }
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createHook(ON_SHOW);
  const onHide = /* @__PURE__ */ createHook(ON_HIDE);
  const onLaunch = /* @__PURE__ */ createHook(ON_LAUNCH);
  const onLoad = /* @__PURE__ */ createHook(ON_LOAD);
  const onPageHide = onHide;
  const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
    __name: "identification-bird",
    setup(__props, { expose: __expose }) {
      __expose();
      const sheetVisible = vue.ref(false);
      const menuItems = [
        {
          name: "选择图片"
        },
        {
          name: "拍照"
        },
        {
          name: "选择视频"
        },
        {
          name: "选择音频"
        }
      ];
      const uploadImg = (filePath) => {
        uni.uploadFile({
          url: "https://your-server.com/upload",
          // 后端服务器接口地址
          filePath,
          // 选择的文件路径
          name: "file",
          // 后端接收文件的字段名
          // formData: {
          //   user: "test", // 如果需要传递其他数据，可以通过 formData 传递
          // },
          success: (uploadFileRes) => {
            formatAppLog("log", "at pages/identification-bird.vue:29", "上传成功: ", uploadFileRes);
            if (uploadFileRes.statusCode === 200) {
              const data = JSON.parse(uploadFileRes.data);
              formatAppLog("log", "at pages/identification-bird.vue:32", "后端返回的结果：", data);
            } else {
              formatAppLog("error", "at pages/identification-bird.vue:34", "上传失败，状态码：", uploadFileRes.statusCode);
            }
          },
          fail: (err) => {
            formatAppLog("error", "at pages/identification-bird.vue:38", "上传失败: ", err);
          }
        });
      };
      const chooseItem = (itemParams) => {
        switch (itemParams.name) {
          case "从相册选择":
            uni.chooseImage({
              count: 1,
              // 默认9，选择图片的数量
              sizeType: ["original"],
              // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ["album"],
              // 从相册选择
              success: function(res) {
                const tempFilePaths = res.tempFilePaths;
                formatAppLog("log", "at pages/identification-bird.vue:52", tempFilePaths);
                uni.navigateTo({
                  url: "/pages/result"
                });
              }
            });
            break;
          case "拍照":
            uni.chooseImage({
              count: 1,
              // 可以选择图片的数量
              sourceType: ["camera"],
              // 仅使用摄像头
              success: function(res) {
                const tempFilePaths = res.tempFilePaths;
                formatAppLog("log", "at pages/identification-bird.vue:65", tempFilePaths);
              }
            });
            break;
          case "选择视频":
            uni.chooseVideo({
              sourceType: ["album"],
              // 从相册选择
              success: (res) => {
                formatAppLog("log", "at pages/identification-bird.vue:74", "chooseVideo success", JSON.stringify(res));
              },
              fail: (err) => {
                uni.showModal({
                  title: "选择视频失败",
                  content: JSON.stringify(err),
                  showCancel: false
                });
              }
            });
            break;
          case "选择音频":
            uni.chooseFile({
              type: "all",
              // 选择音频文件
              success: function(res) {
                formatAppLog("log", "at pages/identification-bird.vue:89", "选择的音频文件：", res.tempFilePaths[0]);
              },
              fail: function(err) {
                formatAppLog("log", "at pages/identification-bird.vue:92", "文件选择失败：", err);
              }
            });
            break;
        }
      };
      const __returned__ = { sheetVisible, menuItems, uploadImg, chooseItem, TabBar };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_nut_button = __unplugin_components_0$3;
    const _component_nut_action_sheet = __unplugin_components_1;
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("view", { class: "container" }, [
        vue.createElementVNode("view", { class: "top" }),
        vue.createElementVNode("view", { class: "middle" }, [
          vue.createVNode(_component_nut_button, {
            type: "primary",
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.sheetVisible = true)
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("智能识鸟")
            ]),
            _: 1
            /* STABLE */
          })
        ]),
        vue.createElementVNode("view", { class: "bottom" })
      ]),
      vue.createElementVNode("view", { class: "bottom" }, [
        vue.createVNode($setup["TabBar"], { "current-index": 1 })
      ]),
      vue.createVNode(_component_nut_action_sheet, {
        visible: $setup.sheetVisible,
        "menu-items": $setup.menuItems,
        "cancel-txt": "取消",
        "close-abled": true,
        onChoose: $setup.chooseItem,
        onClose: _cache[1] || (_cache[1] = ($event) => $setup.sheetVisible = false),
        onCancel: _cache[2] || (_cache[2] = ($event) => $setup.sheetVisible = false)
      }, null, 8, ["visible"])
    ]);
  }
  const PagesIdentificationBird = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-48e52518"], ["__file", "D:/WebStormProject/bird-identification-app/src/pages/identification-bird.vue"]]);
  const { registerUTSInterface, initUTSProxyClass, initUTSProxyFunction, initUTSPackageName, initUTSIndexClassName, initUTSClassName } = uni;
  const name = "limeAudioPlayer";
  const moduleName = "lime-audio-player 音频播放";
  const moduleType = "";
  const errMsg = ``;
  const is_uni_modules = true;
  const pkg = /* @__PURE__ */ initUTSPackageName(name, is_uni_modules);
  const cls = /* @__PURE__ */ initUTSIndexClassName(name, is_uni_modules);
  registerUTSInterface("InnerAudioContextOptions", Object.assign({ moduleName, moduleType, errMsg, package: pkg, class: initUTSClassName(name, "InnerAudioContextByJsProxy", is_uni_modules) }, { "methods": { "updateAutoplayByJs": { "async": false, "keepAlive": false, "params": [{ "name": "v", "type": "boolean" }] }, "updateLoopByJs": { "async": false, "keepAlive": false, "params": [{ "name": "isLooping", "type": "boolean" }] }, "updatePlaybackRateByJs": { "async": false, "keepAlive": false, "params": [{ "name": "rate", "type": "number" }] }, "updateSrcByJs": { "async": false, "keepAlive": false, "params": [{ "name": "src", "type": "string" }] }, "updateStartTimeByJs": { "async": false, "keepAlive": false, "params": [{ "name": "value", "type": "number" }] }, "updateVolumeByJs": { "async": false, "keepAlive": false, "params": [{ "name": "volume", "type": "number" }] }, "destroyByJs": { "async": false, "keepAlive": false, "params": [] }, "offCanplayByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "offEndedByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "offErrorByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "offPauseByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "offPlayByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "offSeekedByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "offSeekingByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "offStopByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "offTimeUpdateByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "offWaitingByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "onCanplayByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "onEndedByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "onErrorByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "onPauseByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "onPlayByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "onSeekedByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "onSeekingByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "onStopByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "onTimeUpdateByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "onWaitingByJs": { "async": false, "keepAlive": false, "params": [{ "name": "listener", "type": "UTSCallback" }] }, "pauseByJs": { "async": false, "keepAlive": false, "params": [] }, "playByJs": { "async": false, "keepAlive": false, "params": [] }, "seekByJs": { "async": false, "keepAlive": false, "params": [{ "name": "position", "type": "number" }] }, "stopByJs": { "async": false, "keepAlive": false, "params": [] }, "setAudioOutputByJs": { "async": false, "keepAlive": false, "params": [{ "name": "outputType", "type": "number" }] } }, "props": ["autoplay", "buffered", "currentTime", "duration", "loop", "obeyMuteSwitch", "paused", "playbackRate", "referrerPolicy", "src", "startTime", "volume"], "setters": { "autoplay": { "name": "autoplay", "type": "boolean" }, "buffered": { "name": "buffered", "type": "number" }, "currentTime": { "name": "currentTime", "type": "number" }, "duration": { "name": "duration", "type": "number" }, "loop": { "name": "loop", "type": "boolean" }, "obeyMuteSwitch": { "name": "obeyMuteSwitch", "type": "boolean" }, "paused": { "name": "paused", "type": "boolean" }, "playbackRate": { "name": "playbackRate", "type": "number" }, "referrerPolicy": { "name": "referrerPolicy", "type": "string" }, "src": { "name": "src", "type": "string" }, "startTime": { "name": "startTime", "type": "number" }, "volume": { "name": "volume", "type": "number" } } }));
  const createInnerAudioContext = /* @__PURE__ */ initUTSProxyFunction(false, { moduleName, moduleType, errMsg, main: true, package: pkg, class: cls, name: "createInnerAudioContextByJs", keepAlive: false, params: [], return: { "type": "interface", "options": "InnerAudioContextOptions" } });
  const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
    __name: "audio-app",
    props: {
      src: {
        type: String,
        default: ""
      }
    },
    setup(__props, { expose: __expose }) {
      const ctx = createInnerAudioContext();
      const isPlay = vue.ref(false);
      const duration = vue.ref(1e3);
      const progress = vue.ref(0);
      const props = __props;
      vue.watch(
        () => props.src,
        () => {
          if (props.src) {
            ctx.src = props.src;
          }
        },
        {
          immediate: true
        }
      );
      const volume = vue.ref(ctx.volume);
      const song = vue.reactive({
        id: 0,
        src: "",
        name: ""
      });
      let timeStr = vue.computed(() => {
        const seconds = Math.floor(progress.value / 1e3);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
      });
      const songList = [
        {
          id: 1404596131,
          src: "",
          name: "see you again"
        },
        {
          id: 401723106,
          src: "",
          name: "Walking In the Sun"
        },
        {
          id: 1339030970,
          src: "",
          name: "直到世界尽头"
        }
      ];
      let index = 0;
      const loadData = () => {
        return;
      };
      const bindAudioEventHandlers = () => {
        ctx.onError((res) => {
          formatAppLog("log", "at components/audio-app.vue:94", "onError", res);
        });
        ctx.onSeeked((res) => {
          formatAppLog("log", "at components/audio-app.vue:103", "onSeeked", res);
        });
        ctx.onTimeUpdate((_) => {
          progress.value = ctx.currentTime * 1e3;
        });
        ctx.onCanplay((_) => {
          duration.value = ctx.duration * 1e3;
        });
        ctx.onEnded((res) => {
          formatAppLog("log", "at components/audio-app.vue:113", "res", res.errMsg);
        });
      };
      const unbindAudioEventHandlers = () => {
        ctx.offEnded();
        ctx.offPause();
        ctx.offPlay();
        ctx.offSeeked();
        ctx.offTimeUpdate();
        ctx.offCanplay();
        ctx.offEnded();
        ctx.destroy();
      };
      const togglePlay = () => {
        isPlay.value = !isPlay.value;
        if (isPlay.value) {
          ctx.play();
        } else {
          ctx.pause();
        }
      };
      const handleSeek = (e) => {
        ctx.seek(e.detail.value / 1e3);
      };
      const setStop = () => {
        if (isPlay.value) {
          formatAppLog("log", "at components/audio-app.vue:144", "audio stop", ctx.src);
          ctx.pause();
          ctx.seek(0);
          progress.value = 0;
          isPlay.value = false;
        }
      };
      __expose({
        setStop
      });
      vue.onMounted(() => {
        bindAudioEventHandlers();
      });
      onPageHide(() => {
        unbindAudioEventHandlers();
      });
      const __returned__ = { ctx, isPlay, duration, progress, props, volume, song, get timeStr() {
        return timeStr;
      }, set timeStr(v) {
        timeStr = v;
      }, songList, get index() {
        return index;
      }, set index(v) {
        index = v;
      }, loadData, bindAudioEventHandlers, unbindAudioEventHandlers, togglePlay, handleSeek, setStop };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _imports_0 = "/static/logo.png";
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "audio" }, [
          vue.createElementVNode("view", { class: "top" }, [
            vue.createElementVNode("view", { class: "audio__player-play-cont" }, [
              vue.createElementVNode("view", {
                class: "audio__player-play",
                onClick: $setup.togglePlay
              }, [
                vue.createElementVNode(
                  "image",
                  {
                    src: _imports_0,
                    class: vue.normalizeClass(`${$setup.isPlay ? "rotate" : ""}`)
                  },
                  null,
                  2
                  /* CLASS */
                ),
                vue.createElementVNode("view", { class: "audio__player-play-icon" }, [
                  vue.createElementVNode("image", {
                    src: $setup.isPlay ? "/static/pause.png" : "/static/play.png"
                  }, null, 8, ["src"])
                ])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "title" }),
          vue.createCommentVNode('    <view class="audio__player-progress-container">'),
          vue.createCommentVNode("      <view"),
          vue.createCommentVNode('        ref="audioProgressWrap"'),
          vue.createCommentVNode('        class="audio__player-progress-wrap"'),
          vue.createCommentVNode('        @click.stop="handleClickProgressWrap"'),
          vue.createCommentVNode("      >"),
          vue.createCommentVNode("        <view"),
          vue.createCommentVNode('          ref="audioProgress"'),
          vue.createCommentVNode('          class="audio__player-progress"'),
          vue.createCommentVNode('          :style="{'),
          vue.createCommentVNode("            backgroundColor: option_.progressBarColor,"),
          vue.createCommentVNode('          }"'),
          vue.createCommentVNode("        />"),
          vue.createCommentVNode("        <view"),
          vue.createCommentVNode('          ref="audioProgressPoint"'),
          vue.createCommentVNode('          class="audio__player-progress-point"'),
          vue.createCommentVNode('          :style="{'),
          vue.createCommentVNode("            backgroundColor: option_.indicatorColor,"),
          vue.createCommentVNode("            boxShadow: `0 0 10px 0 ${option_.indicatorColor}`,"),
          vue.createCommentVNode('          }"'),
          vue.createCommentVNode('          @panstart="handleProgressPanStart"'),
          vue.createCommentVNode('          @panend="handleProgressPanEnd"'),
          vue.createCommentVNode('          @panmove="handleProgressPanMove"'),
          vue.createCommentVNode("        />"),
          vue.createCommentVNode("      </view>"),
          vue.createCommentVNode('      <view class="audio__player-time">'),
          vue.createCommentVNode("        <span>{{ `${formatSecond(currentTime)} / ${totalTimeStr}` }}</span>"),
          vue.createCommentVNode("      </view>"),
          vue.createCommentVNode("    </view>")
        ]),
        vue.createCommentVNode('  <view class="audio-player">'),
        vue.createElementVNode(
          "text",
          { class: "song-title" },
          vue.toDisplayString($setup.song.name),
          1
          /* TEXT */
        ),
        vue.createCommentVNode('  <view class="audio-controls">'),
        vue.createCommentVNode('    <text class="current-time">{{ timeStr }}</text>'),
        vue.createElementVNode("slider", {
          class: "process",
          value: $setup.progress,
          min: 0,
          max: $setup.duration,
          step: 1,
          onChange: $setup.handleSeek
        }, null, 40, ["value", "max"]),
        vue.createCommentVNode("  </view>"),
        vue.createCommentVNode('    <button type="button" @click="togglePlay">'),
        vue.createCommentVNode('      {{ isPlay ? "暂停" : "播放" }}'),
        vue.createCommentVNode("    </button>"),
        vue.createCommentVNode('    &lt;!&ndash;    <button type="button" @click="nextSong">下一曲</button>&ndash;&gt;'),
        vue.createCommentVNode('    <button type="button" @click="stopAudio">停止</button>'),
        vue.createCommentVNode('    <button type="button" @click="setSpeed(1)">1倍速</button>'),
        vue.createCommentVNode('    <button type="button" @click="setSpeed(1.5)">1.5倍速</button>'),
        vue.createCommentVNode('    <button type="button" @click="setSpeed(2)">2倍速</button>'),
        vue.createCommentVNode('    <view class="volume-controls">'),
        vue.createCommentVNode("      <text>音量{{ volume }}</text>"),
        vue.createCommentVNode("      <slider"),
        vue.createCommentVNode('        :value="volume"'),
        vue.createCommentVNode('        :min="0"'),
        vue.createCommentVNode('        :max="100"'),
        vue.createCommentVNode('        :step="1"'),
        vue.createCommentVNode('        @change="changeVolume"'),
        vue.createCommentVNode("      ></slider>"),
        vue.createCommentVNode("    </view>"),
        vue.createCommentVNode("  </view>")
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const AudioApp = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-bcafd490"], ["__file", "D:/WebStormProject/bird-identification-app/src/components/audio-app.vue"]]);
  var byteToHex = [];
  for (var i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).slice(1));
  }
  function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  }
  var lookup = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    62,
    0,
    62,
    0,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    0,
    0,
    0,
    0,
    63,
    0,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51
  ];
  function base64Decode(source, target) {
    var sourceLength = source.length;
    var paddingLength = source[sourceLength - 2] === "=" ? 2 : source[sourceLength - 1] === "=" ? 1 : 0;
    var tmp;
    var byteIndex = 0;
    var baseLength = sourceLength - paddingLength & 4294967292;
    for (var i2 = 0; i2 < baseLength; i2 += 4) {
      tmp = lookup[source.charCodeAt(i2)] << 18 | lookup[source.charCodeAt(i2 + 1)] << 12 | lookup[source.charCodeAt(i2 + 2)] << 6 | lookup[source.charCodeAt(i2 + 3)];
      target[byteIndex++] = tmp >> 16 & 255;
      target[byteIndex++] = tmp >> 8 & 255;
      target[byteIndex++] = tmp & 255;
    }
    if (paddingLength === 1) {
      tmp = lookup[source.charCodeAt(i2)] << 10 | lookup[source.charCodeAt(i2 + 1)] << 4 | lookup[source.charCodeAt(i2 + 2)] >> 2;
      target[byteIndex++] = tmp >> 8 & 255;
      target[byteIndex++] = tmp & 255;
    }
    if (paddingLength === 2) {
      tmp = lookup[source.charCodeAt(i2)] << 2 | lookup[source.charCodeAt(i2 + 1)] >> 4;
      target[byteIndex++] = tmp & 255;
    }
  }
  const crypto = {
    getRandomValues(arr) {
      if (!(arr instanceof Int8Array || arr instanceof Uint8Array || arr instanceof Int16Array || arr instanceof Uint16Array || arr instanceof Int32Array || arr instanceof Uint32Array || arr instanceof Uint8ClampedArray)) {
        throw new Error("Expected an integer array");
      }
      if (arr.byteLength > 65536) {
        throw new Error("Can only request a maximum of 65536 bytes");
      }
      var crypto2 = requireNativePlugin("DCloud-Crypto");
      base64Decode(crypto2.getRandomValues(arr.byteLength), new Uint8Array(
        arr.buffer,
        arr.byteOffset,
        arr.byteLength
      ));
      return arr;
    }
  };
  var getRandomValues;
  var rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
      if (!getRandomValues) {
        throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      }
    }
    return getRandomValues(rnds8);
  }
  var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
  const native = {
    randomUUID
  };
  function v4(options, buf, offset) {
    if (native.randomUUID && !buf && !options) {
      return native.randomUUID();
    }
    options = options || {};
    var rnds = options.random || (options.rng || rng)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    return unsafeStringify(rnds);
  }
  const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
    __name: "video-app",
    props: {
      src: {
        type: String,
        default: ""
      },
      videoClass: {
        type: String,
        default: ""
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const innerVideoClass = vue.computed(() => {
        return props.videoClass;
      });
      const iframeContent = vue.computed(() => {
        return `
    <!DOCTYPE html>
    <html>
    <head>
      <style scoped>
        .media {
          width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body style="margin: 0">
      <video id="video" class="media" controls></video>
      <script>
        const video = document.getElementById('video');

        video.src = '${props.src}';
        video.currentTime = 0.1;

         window.addEventListener("message", (event) => {
           if(event.data === 'stop'){
              video.pause()
              video.currentTime = 0;
           }
        });

      <\/script>
    </body>
    </html>
    `;
      });
      const __returned__ = { props, innerVideoClass, iframeContent };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("iframe", {
      class: vue.normalizeClass(["iframe", $setup.innerVideoClass]),
      srcdoc: $setup.iframeContent,
      style: { "height": "100%", "width": "100%" }
    }, null, 10, ["srcdoc"]);
  }
  const VideoApp = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-6cdea94a"], ["__file", "D:/WebStormProject/bird-identification-app/src/components/video-app.vue"]]);
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    __name: "media-loader",
    props: {
      type: {
        type: String,
        default: ""
        // 默认加载图片
      },
      src: {
        type: String,
        default: ""
      },
      videoClass: {
        type: String,
        default: ""
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const innerType = vue.computed(() => {
        return props.type;
      });
      const innerSrc = vue.computed(() => {
        return props.src;
      });
      const innerVideoClass = vue.computed(() => {
        return props.videoClass;
      });
      const audioRef = vue.ref();
      const setStop = () => {
        var _a;
        (_a = audioRef.value) == null ? void 0 : _a.setStop();
      };
      const previewImg = (url) => {
        uni.previewImage({
          current: url,
          // 当前显示的图片链接
          urls: [url]
          // 只预览这一张图片
        });
      };
      function generateShortUUID() {
        return v4().split("-")[0];
      }
      const className = vue.ref(generateShortUUID());
      const observerElement = vue.ref();
      vue.onMounted(() => {
        const observer = uni.createIntersectionObserver(this, {
          thresholds: [0.1]
          // 设置可见性阈值,
        });
        observer.observe(`.media-container${className.value}`, (res) => {
          if (res.intersectionRatio > 0.1)
            ;
          else {
            setStop();
          }
        });
      });
      const __returned__ = { props, innerType, innerSrc, innerVideoClass, audioRef, setStop, previewImg, generateShortUUID, className, observerElement, AudioApp, VideoApp };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        ref: "observerElement",
        class: vue.normalizeClass(["media-container", `media-container${$setup.className}`])
      },
      [
        vue.createElementVNode("view", { class: "top" }, [
          vue.createTextVNode(
            vue.toDisplayString($setup.className) + " ",
            1
            /* TEXT */
          ),
          $setup.innerType === "image" ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
            vue.createElementVNode("image", {
              src: $setup.innerSrc,
              mode: "aspectFit",
              class: "media",
              onClick: _cache[0] || (_cache[0] = ($event) => $setup.previewImg($setup.innerSrc))
            }, null, 8, ["src"])
          ])) : $setup.innerType === "video" ? (vue.openBlock(), vue.createBlock($setup["VideoApp"], {
            key: 1,
            src: $setup.innerSrc,
            "video-class": $setup.innerVideoClass
          }, null, 8, ["src", "video-class"])) : $setup.innerType === "audio" ? (vue.openBlock(), vue.createBlock($setup["AudioApp"], {
            key: 2,
            ref: "audioRef",
            src: $setup.innerSrc
          }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "bottom" }, [
          vue.createElementVNode("view", { class: "res" })
        ])
      ],
      2
      /* CLASS */
    );
  }
  const MediaLoader = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-f403e231"], ["__file", "D:/WebStormProject/bird-identification-app/src/components/media-loader.vue"]]);
  const wsUrl = "ws://localhost:5000";
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    __name: "result",
    setup(__props, { expose: __expose }) {
      __expose();
      const isLoading = vue.ref(false);
      const type = vue.ref("");
      const src = vue.ref("");
      const handleReceiveData = (data) => {
        const convertRes = JSON.parse(data);
        type.value = convertRes.type;
        src.value = convertRes.url;
      };
      let ws;
      const connectWebSocket = () => {
        ws = new WebSocket(wsUrl);
        ws.onopen = () => {
          formatAppLog("log", "at pages/result.vue:28", "WebSocket 连接成功");
        };
        ws.onmessage = (event) => {
          handleReceiveData(event.data);
        };
        ws.onerror = (error) => {
          formatAppLog("error", "at pages/result.vue:38", "WebSocket 错误:", error);
        };
        ws.onclose = () => {
          formatAppLog("log", "at pages/result.vue:43", "WebSocket 连接关闭");
        };
      };
      vue.onMounted(() => {
        connectWebSocket();
      });
      vue.onUnmounted(() => {
        if (ws) {
          ws.close();
        }
      });
      const __returned__ = { isLoading, type, src, handleReceiveData, wsUrl, get ws() {
        return ws;
      }, set ws(v) {
        ws = v;
      }, connectWebSocket, MediaLoader };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_nut_icon = NutIcon;
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      $setup.isLoading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "loading"
      }, [
        vue.createVNode(_component_nut_icon, { name: "loading" }),
        vue.createElementVNode("view", null, "识别中，请稍等....")
      ])) : (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, [
        vue.createElementVNode("view", { class: "top" }, [
          vue.createVNode($setup["MediaLoader"], {
            type: $setup.type,
            src: $setup.src
          }, null, 8, ["type", "src"])
        ]),
        vue.createElementVNode("view", { class: "bottom" })
      ]))
    ]);
  }
  const PagesResult = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-b7aacf42"], ["__file", "D:/WebStormProject/bird-identification-app/src/pages/result.vue"]]);
  const block0 = (Comp) => {
    (Comp.$renderjs || (Comp.$renderjs = [])).push("renderScript");
    (Comp.$renderjsModules || (Comp.$renderjsModules = {}))["renderScript"] = "74d14232";
  };
  const _sfc_main$8 = {
    components: {
      MediaLoader,
      TabBar
    },
    data() {
      return {
        result: [
          {
            type: "video",
            src: "http://vjs.zencdn.net/v/oceans.mp4",
            content: "0"
          },
          {
            type: "audio",
            src: "https://ting8.yymp3.com/new27/liyugang6/6.mp3",
            content: "1"
          },
          {
            type: "image",
            src: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
            content: "2"
          },
          {
            type: "audio",
            src: "https://ting8.yymp3.com/new27/jinzhiwen3/1.mp3",
            content: "3"
          },
          {
            type: "image",
            src: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
            content: "4"
          },
          {
            type: "video",
            src: "https://media.w3.org/2010/05/sintel/trailer.mp4",
            content: "5"
          }
        ],
        stopStatus: false,
        currentIndex: 0,
        originIndex: 0
      };
    },
    methods: {
      // 处理切换的函数
      dealChange(index) {
        this.originIndex = this.currentIndex;
        this.currentIndex = index;
        if (this.result[this.originIndex].type === "video") {
          formatAppLog("log", "at pages/today-share.vue:58", "emit stop");
          this.stopStatus = !this.stopStatus;
        }
      },
      // 停止事件
      // stop() {
      //   this.stopStatus = !this.stopStatus;
      // },
      generateShortUUID() {
        return v4().split("-")[0];
      }
    },
    mounted() {
      this.result.forEach((item) => {
        if (item.type === "video") {
          item.className = `iframe${this.generateShortUUID()}`;
        }
      });
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_media_loader = MediaLoader;
    const _component_nut_swiper_item = __unplugin_components_0$5;
    const _component_nut_swiper = __unplugin_components_1$2;
    const _component_tab_bar = TabBar;
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createVNode(_component_nut_swiper, {
        loop: false,
        direction: "vertical",
        duration: 500,
        style: { "height": "100%" },
        onChange: $options.dealChange
      }, {
        default: vue.withCtx(() => [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.result, (item, index) => {
              return vue.openBlock(), vue.createBlock(
                _component_nut_swiper_item,
                { key: index },
                {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "top" }, [
                      vue.createElementVNode("view", { class: "top" }, [
                        vue.createVNode(_component_media_loader, {
                          ref_for: true,
                          ref: "mediaRef",
                          type: item.type,
                          src: item.src,
                          "video-class": item.className
                        }, null, 8, ["type", "src", "video-class"])
                      ]),
                      vue.createElementVNode(
                        "view",
                        { class: "content" },
                        vue.toDisplayString(item.content),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  _: 2
                  /* DYNAMIC */
                },
                1024
                /* DYNAMIC_SLOTS */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        _: 1
        /* STABLE */
      }, 8, ["onChange"]),
      vue.createElementVNode("view", {
        prop: vue.wp($data.stopStatus),
        "change:prop": _ctx.renderScript.setStop(this.result[this.originIndex].className)
      }, null, 8, ["prop", "change:prop"]),
      vue.createElementVNode("view", { class: "bottom" }, [
        vue.createVNode(_component_tab_bar, { "current-index": 2 })
      ])
    ]);
  }
  if (typeof block0 === "function")
    block0(_sfc_main$8);
  const PagesTodayShare = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-dc54c317"], ["__file", "D:/WebStormProject/bird-identification-app/src/pages/today-share.vue"]]);
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "explore-bird-nest",
    setup(__props, { expose: __expose }) {
      __expose();
      const type = vue.ref("");
      const src = vue.ref("");
      const result = vue.ref();
      let id;
      onLoad(async (query) => {
        id = query.id;
        if (id) {
          uni.request({
            url: "/aa",
            // API 地址
            method: "GET",
            // 使用 GET 方法
            data: {
              id
            },
            success: (res) => {
            },
            fail: (err) => {
              formatAppLog("error", "at pages/explore-bird-nest.vue:29", "请求失败:", err);
            }
          });
        } else {
          uni.request({
            url: "https://example.com/api",
            // API 请求地址
            method: "GET",
            // 请求方式
            success: (res) => {
            },
            fail: (err) => {
              formatAppLog("error", "at pages/explore-bird-nest.vue:41", err);
            }
          });
        }
      });
      const jumpSearch = () => {
        uni.navigateTo({
          url: "/pages/bird-search"
        });
      };
      setTimeout(() => {
        result.value = [
          {
            name: "睚眦1",
            family: "XX科",
            lang: "80cm",
            danger: "一级",
            env: "填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充",
            habits: "填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充",
            distribution: "填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充"
          },
          {
            name: "睚眦2",
            family: "XX科",
            lang: "80cm",
            danger: "一级",
            env: "填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充",
            habits: "填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充",
            distribution: "填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充"
          },
          {
            name: "睚眦3",
            family: "XX科",
            lang: "80cm",
            danger: "一级",
            env: "填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充",
            habits: "填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充",
            distribution: "填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充"
          }
        ];
      }, 200);
      const __returned__ = { type, src, result, get id() {
        return id;
      }, set id(v) {
        id = v;
      }, jumpSearch, TabBar, MediaLoader };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_nut_swiper_item = __unplugin_components_0$5;
    const _component_nut_swiper = __unplugin_components_1$2;
    const _component_nut_icon = NutIcon;
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createVNode(_component_nut_swiper, {
        "pagination-visible": false,
        loop: false
      }, {
        default: vue.withCtx(() => [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.result, (item, index) => {
              return vue.openBlock(), vue.createBlock(
                _component_nut_swiper_item,
                { key: index },
                {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "top" }, [
                      vue.createElementVNode("view", { class: "top" }, [
                        vue.createVNode($setup["MediaLoader"], {
                          type: $setup.type,
                          src: $setup.src
                        }, null, 8, ["type", "src"])
                      ]),
                      vue.createElementVNode("view", { class: "content" }, [
                        vue.createElementVNode("view", { class: "top" }, [
                          vue.createElementVNode(
                            "view",
                            { class: "name" },
                            vue.toDisplayString(item.name),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "view",
                            { class: "family" },
                            vue.toDisplayString(item.family),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode("view", { class: "middle" }, [
                          vue.createElementVNode(
                            "view",
                            null,
                            vue.toDisplayString(item.lang),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "view",
                            null,
                            vue.toDisplayString(item.danger),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode("view", null, "zhanwei")
                        ]),
                        vue.createElementVNode("view", { class: "list" }, [
                          vue.createElementVNode("view", { class: "list-item" }, [
                            vue.createElementVNode("view", { class: "title" }, "特征一："),
                            vue.createElementVNode(
                              "view",
                              null,
                              vue.toDisplayString(item.env),
                              1
                              /* TEXT */
                            )
                          ]),
                          vue.createElementVNode("view", { class: "list-item" }, [
                            vue.createElementVNode("view", { class: "title" }, "特征一："),
                            vue.createElementVNode(
                              "view",
                              null,
                              vue.toDisplayString(item.habits),
                              1
                              /* TEXT */
                            )
                          ]),
                          vue.createElementVNode("view", { class: "list-item" }, [
                            vue.createElementVNode("view", { class: "title" }, "特征一："),
                            vue.createElementVNode(
                              "view",
                              null,
                              vue.toDisplayString(item.distribution),
                              1
                              /* TEXT */
                            )
                          ])
                        ])
                      ])
                    ])
                  ]),
                  _: 2
                  /* DYNAMIC */
                },
                1024
                /* DYNAMIC_SLOTS */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createElementVNode("view", { class: "bottom" }, [
        vue.createVNode($setup["TabBar"], { "current-index": 3 })
      ]),
      vue.createElementVNode("view", {
        class: "fixed",
        onClick: $setup.jumpSearch
      }, [
        vue.createVNode(_component_nut_icon, { name: "search" })
      ])
    ]);
  }
  const PagesExploreBirdNest = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-831a9a38"], ["__file", "D:/WebStormProject/bird-identification-app/src/pages/explore-bird-nest.vue"]]);
  function defineLocaleConfig(locale) {
    return locale;
  }
  function EnUSLang() {
    return defineLocaleConfig({
      save: "Save",
      confirm: "Confirm",
      cancel: "Cancel",
      done: "Done",
      noData: "No Data",
      placeholder: "Placeholder",
      select: "Select",
      video: {
        errorTip: "Error Tip",
        clickRetry: "Click Retry"
      },
      fixednav: {
        activeText: "Close Nav",
        unActiveText: "Open Nav"
      },
      pagination: {
        prev: "Previous",
        next: "Next"
      },
      calendaritem: {
        weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        end: "End",
        start: "Start",
        title: "Calendar",
        monthTitle: (year, month) => `${year}/${month}`,
        today: "Today"
      },
      shortpassword: {
        title: "Please input a password",
        desc: "Verify",
        tips: "Forget password"
      },
      uploader: {
        ready: "Ready",
        readyUpload: "Ready to upload",
        waitingUpload: "Waiting for upload",
        uploading: "Uploading",
        success: "Upload successful",
        error: "Upload failed"
      },
      countdown: {
        day: " Day ",
        hour: " Hour ",
        minute: " Minute ",
        second: " Second "
      },
      address: {
        selectRegion: "Select Region",
        deliveryTo: "Delivery To",
        chooseAnotherAddress: "Choose Another Address"
      },
      signature: {
        reSign: "Re Sign",
        unSupportTpl: "Sorry, the current browser doesn't support canvas, so we can't use this control!"
      },
      ecard: {
        chooseText: "Select",
        otherValueText: "Other Value",
        placeholder: "Placeholder"
      },
      timeselect: {
        pickupTime: "Pickup Time"
      },
      sku: {
        buyNow: "Buy Now",
        buyNumber: "Buy Number",
        addToCart: "Add to Cart"
      },
      skuheader: {
        skuId: "Sku Number"
      },
      addresslist: {
        addAddress: "Add New Address",
        default: "default"
      },
      comment: {
        complaintsText: "I have a complaint",
        additionalReview: (day) => `Review after ${day} days of purchase`,
        additionalImages: (length) => `There are ${length} follow-up comments`
      },
      infiniteloading: {
        loading: "Loading...",
        pullTxt: "Loose to refresh",
        loadMoreTxt: "Oops, this is the bottom"
      },
      datepicker: {
        year: "Year",
        month: "Month",
        day: "Day",
        hour: "Hour",
        min: "Minute",
        seconds: "Second"
      },
      audiooperate: {
        back: "Back",
        start: "Start",
        pause: "Pause",
        forward: "Forward",
        mute: "Mute"
      },
      pullrefresh: {
        pulling: "Pull to refresh...",
        loosing: "Loose to refresh...",
        loading: "Loading..."
      }
    });
  }
  function ZhCNLang() {
    return defineLocaleConfig({
      save: "保存",
      confirm: "确认",
      cancel: "取消",
      done: "完成",
      noData: "暂无数据",
      placeholder: "请输入",
      select: "请选择",
      video: {
        errorTip: "视频加载失败",
        clickRetry: "点击重试"
      },
      fixednav: {
        activeText: "收起导航",
        unActiveText: "快速导航"
      },
      pagination: {
        prev: "上一页",
        next: "下一页"
      },
      calendaritem: {
        weekdays: ["日", "一", "二", "三", "四", "五", "六"],
        end: "结束",
        start: "开始",
        title: "日期选择",
        monthTitle: (year, month) => `${year}年${month}月`,
        today: "今天"
      },
      shortpassword: {
        title: "请输入密码",
        desc: "您使用了虚拟资产，请进行验证",
        tips: "忘记密码"
      },
      uploader: {
        ready: "准备完成",
        readyUpload: "准备上传",
        waitingUpload: "等待上传",
        uploading: "上传中",
        success: "上传成功",
        error: "上传失败"
      },
      countdown: {
        day: "天",
        hour: "时",
        minute: "分",
        second: "秒"
      },
      address: {
        selectRegion: "请选择所在地区",
        deliveryTo: "配送至",
        chooseAnotherAddress: "选择其他地址"
      },
      signature: {
        reSign: "重签",
        unSupportTpl: "对不起，当前浏览器不支持Canvas，无法使用本控件！"
      },
      ecard: {
        chooseText: "请选择电子卡面值",
        otherValueText: "其他面值",
        placeholder: "请输入1-5000整数"
      },
      timeselect: {
        pickupTime: "取件时间"
      },
      sku: {
        buyNow: "立即购买",
        buyNumber: "购买数量",
        addToCart: "加入购物车"
      },
      skuheader: {
        skuId: "商品编号"
      },
      addresslist: {
        addAddress: "新建地址",
        default: "默认"
      },
      comment: {
        complaintsText: "我要投诉",
        additionalReview: (day) => `购买${day}天后追评`,
        additionalImages: (length) => `${length}张追评图片`
      },
      infiniteloading: {
        loading: "加载中...",
        pullTxt: "松开刷新",
        loadMoreTxt: "哎呀，这里是底部了啦"
      },
      datepicker: {
        year: "年",
        month: "月",
        day: "日",
        hour: "时",
        min: "分",
        seconds: "秒"
      },
      audiooperate: {
        back: "倒退",
        start: "开始",
        pause: "暂停",
        forward: "快进",
        mute: "静音"
      },
      pullrefresh: {
        pulling: "下拉刷新",
        loosing: "释放刷新",
        loading: "加载中..."
      }
    });
  }
  const currentLang = vue.ref("zh-CN");
  const langs = vue.reactive({
    "zh-CN": ZhCNLang(),
    "en-US": EnUSLang()
  });
  const Locale = {
    languages() {
      return langs[currentLang.value];
    },
    use(lang, Languages) {
      currentLang.value = lang;
      if (Languages)
        langs[lang] = Languages;
    },
    merge(Languages) {
      deepAssign(this.languages(), Languages);
    }
  };
  function useTranslate(compName) {
    function translate2(keyPath, ...args) {
      const { languages } = Locale;
      const text = getPropByPath(languages(), `${compName.split("-").slice(1).join("-").replace("-", "")}.${keyPath}`) || getPropByPath(languages(), keyPath);
      return isFunction(text) ? text(...args) : text;
    }
    return {
      translate: translate2
    };
  }
  const emptyProps = {
    ...commonProps,
    /**
     * @description 图片类型，可选值为 `empty`、`error`、`network`，支持传入图片 `URL`
     */
    image: makeStringProp("empty"),
    /**
     * @description 图片大小，单位为 `px`
     */
    imageSize: makeNumericProp(""),
    /**
     * @description 图片下方的描述文字
     */
    description: makeStringProp("")
  };
  const componentName$2 = `${PREFIX}-empty`;
  const { translate: translate$1 } = useTranslate(componentName$2);
  const __default__$2 = vue.defineComponent({
    name: componentName$2,
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  });
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$2,
    props: emptyProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const defaultStatus = {
        empty: "https://static-ftcms.jd.com/p/files/61a9e3183985005b3958672b.png",
        error: "https://ftcms.jd.com/p/files/61a9e33ee7dcdbcc0ce62736.png",
        network: "https://static-ftcms.jd.com/p/files/61a9e31de7dcdbcc0ce62734.png"
      };
      const classes = vue.computed(() => {
        return getMainClass(props, componentName$2);
      });
      const style = vue.computed(() => {
        if (props.imageSize) {
          return {
            width: pxCheck(props.imageSize),
            height: pxCheck(props.imageSize)
          };
        }
        return {};
      });
      const isHttpUrl = props.image.startsWith("https://") || props.image.startsWith("http://") || props.image.startsWith("//");
      const src = isHttpUrl ? props.image : defaultStatus[props.image];
      const __returned__ = { componentName: componentName$2, translate: translate$1, props, defaultStatus, classes, style, isHttpUrl, src };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.classes),
        style: vue.normalizeStyle(_ctx.customStyle)
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "nut-empty__box",
            style: vue.normalizeStyle($setup.style)
          },
          [
            vue.renderSlot(_ctx.$slots, "image", {}, () => [
              $setup.src ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 0,
                class: "nut-empty__box--img",
                src: $setup.src
              }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true)
            ], true)
          ],
          4
          /* STYLE */
        ),
        vue.renderSlot(_ctx.$slots, "description", {}, () => [
          vue.createElementVNode(
            "view",
            { class: "nut-empty__description" },
            vue.toDisplayString(_ctx.description || $setup.translate("noData")),
            1
            /* TEXT */
          )
        ], true),
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __unplugin_components_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-afb53fd7"], ["__file", "D:/WebStormProject/bird-identification-app/node_modules/nutui-uniapp/components/empty/empty.vue"]]);
  const FORM_KEY = Symbol("Form");
  function useFormDisabled(disabled) {
    const { parent } = useInject(FORM_KEY);
    return vue.computed(() => {
      if (disabled.value != null)
        return disabled.value;
      if ((parent == null ? void 0 : parent.props.disabled) != null)
        return parent.props.disabled;
      return false;
    });
  }
  const searchbarProps = {
    ...commonProps,
    /**
     * @description 当前输入的值
     */
    modelValue: makeNumericProp(""),
    /**
     * @description 输入框类型
     */
    inputType: makeStringProp("text"),
    /**
     * @description 搜索框形状，可选值为 `square` `round`
     */
    shape: makeStringProp("round"),
    /**
     * @description 最大输入长度
     */
    maxLength: numericProp,
    /**
     * @description 输入框默认占位符
     */
    placeholder: String,
    /**
     * @description 是否展示清除按钮
     */
    clearable: truthProp,
    /**
     * @description 自定义清除按钮图标
     */
    clearIcon: makeStringProp("circle-close"),
    /**
     * @description 输入框外部背景
     */
    background: String,
    /**
     * @description 输入框内部背景
     */
    inputBackground: String,
    /**
     * @description 聚焦时搜索框样式
     */
    focusStyle: makeObjectProp({}),
    /**
     * @description 是否自动聚焦
     */
    autofocus: Boolean,
    /**
     * @description 是否禁用输入框
     */
    disabled: nullableBooleanProp,
    /**
     * @description 输入框只读
     */
    readonly: Boolean,
    /**
     * @description 对齐方式，可选 `left` `center` `right`
     */
    inputAlign: makeStringProp("left"),
    /**
     * @description 键盘右下角按钮的文字，仅在`type='text'`时生效，可选值 `send`：发送、`search`：搜索、`next`：下一个、`go`：前往、`done`：完成
     */
    confirmType: makeStringProp("done"),
    /**
     * @description 是否开启 iphone 系列全面屏底部安全区适配
     */
    safeAreaInsetBottom: Boolean,
    /**
     * @description 指定的距离的最小值作为光标与键盘的距离
     */
    cursorSpacing: makeNumberProp(0)
  };
  const searchbarEmits = {
    [UPDATE_MODEL_EVENT]: (val, event) => (isString(val) || val === void 0) && event instanceof Object,
    [CHANGE_EVENT]: (val, event) => (isString(val) || val === void 0) && event instanceof Object,
    [BLUR_EVENT]: (val, event) => (isString(val) || val === void 0) && event instanceof Object,
    [FOCUS_EVENT]: (val, event) => (isString(val) || val === void 0) && event instanceof Object,
    [CLEAR_EVENT]: (val) => isString(val) || val === void 0,
    [SEARCH_EVENT]: (val) => isString(val) || val === void 0,
    clickInput: (val, event) => (isString(val) || val === void 0) && event instanceof Object,
    clickLeftIcon: (val, event) => (isString(val) || val === void 0) && event instanceof Object,
    clickRightIcon: (val, event) => (isString(val) || val === void 0) && event instanceof Object
  };
  const componentName$1 = `${PREFIX}-searchbar`;
  const { translate } = useTranslate(componentName$1);
  const __default__$1 = vue.defineComponent({
    name: componentName$1,
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  });
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1,
    props: searchbarProps,
    emits: searchbarEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const slots = vue.useSlots();
      function hasSlot(name2) {
        return Boolean(slots[name2]);
      }
      const formDisabled = useFormDisabled(vue.toRef(props, "disabled"));
      const state = vue.reactive({
        active: false
      });
      function stringModelValue() {
        if (props.modelValue == null)
          return "";
        return String(props.modelValue);
      }
      const innerValue = vue.computed(() => {
        return stringModelValue();
      });
      const innerMaxLength = vue.computed(() => {
        if (props.maxLength == null)
          return -1;
        return Number(props.maxLength);
      });
      const classes = vue.computed(() => {
        return getMainClass(props, componentName$1, {
          "safe-area-inset-bottom": props.safeAreaInsetBottom
        });
      });
      const styles = vue.computed(() => {
        return getMainStyle(props, {
          background: props.background
        });
      });
      const inputWrapperStyles = vue.computed(() => {
        const style = {
          background: props.inputBackground
        };
        if (state.active)
          Object.assign(style, props.focusStyle);
        return style;
      });
      const inputStyles = vue.computed(() => {
        return {
          textAlign: props.inputAlign
        };
      });
      function handleValue(value) {
        if (innerMaxLength.value > 0 && value.length > innerMaxLength.value)
          value = value.slice(0, innerMaxLength.value);
        return value;
      }
      function handleInput(event) {
        const value = handleValue(event.detail.value);
        emit(UPDATE_MODEL_EVENT, value, event);
        emit(CHANGE_EVENT, value, event);
      }
      function handleFocus(event) {
        const value = handleValue(event.detail.value);
        state.active = true;
        emit(FOCUS_EVENT, value, event);
      }
      function handleBlur(event) {
        const value = handleValue(event.detail.value);
        setTimeout(() => {
          state.active = false;
        }, 200);
        emit(BLUR_EVENT, value, event);
      }
      function handleClear(event) {
        emit(UPDATE_MODEL_EVENT, "", event);
        emit(CHANGE_EVENT, "", event);
        emit(CLEAR_EVENT, "");
      }
      function handleSubmit() {
        emit(SEARCH_EVENT, innerValue.value);
      }
      function handleInputClick(event) {
        emit("clickInput", innerValue.value, event);
      }
      function handleLeftIconClick(event) {
        emit("clickLeftIcon", innerValue.value, event);
      }
      function handleRightIconClick(event) {
        emit("clickRightIcon", innerValue.value, event);
      }
      const __returned__ = { componentName: componentName$1, translate, props, emit, slots, hasSlot, formDisabled, state, stringModelValue, innerValue, innerMaxLength, classes, styles, inputWrapperStyles, inputStyles, handleValue, handleInput, handleFocus, handleBlur, handleClear, handleSubmit, handleInputClick, handleLeftIconClick, handleRightIconClick, NutIcon };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.classes),
        style: vue.normalizeStyle($setup.styles)
      },
      [
        $setup.hasSlot("leftout") ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "nut-searchbar__search-icon nut-searchbar__left-search-icon",
          onClick: $setup.handleLeftIconClick
        }, [
          vue.renderSlot(_ctx.$slots, "leftout", {}, void 0, true)
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["nut-searchbar__search-input", [$setup.props.shape]]),
            style: vue.normalizeStyle($setup.inputWrapperStyles)
          },
          [
            $setup.hasSlot("leftin") ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "nut-searchbar__search-icon nut-searchbar__iptleft-search-icon"
            }, [
              vue.renderSlot(_ctx.$slots, "leftin", {}, void 0, true)
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["nut-searchbar__input-inner", { "nut-searchbar__input-inner-absolute": $setup.hasSlot("rightin") }])
              },
              [
                vue.createElementVNode(
                  "form",
                  {
                    class: "nut-searchbar__input-form",
                    action: "#",
                    onsubmit: "return false",
                    onSubmit: vue.withModifiers($setup.handleSubmit, ["prevent"])
                  },
                  [
                    vue.createElementVNode("input", {
                      class: vue.normalizeClass(["nut-searchbar__input-bar", { "nut-searchbar__input-bar_clear": $setup.props.clearable }]),
                      style: vue.normalizeStyle($setup.inputStyles),
                      type: $setup.props.inputType,
                      maxlength: $setup.innerMaxLength,
                      placeholder: $setup.props.placeholder || $setup.translate("placeholder"),
                      value: $setup.innerValue,
                      focus: $setup.props.autofocus,
                      "confirm-type": $setup.props.confirmType,
                      disabled: $setup.formDisabled,
                      readonly: $setup.props.readonly,
                      "cursor-spacing": $setup.props.cursorSpacing,
                      onClick: $setup.handleInputClick,
                      onInput: $setup.handleInput,
                      onFocus: $setup.handleFocus,
                      onBlur: $setup.handleBlur,
                      onConfirm: $setup.handleSubmit
                    }, null, 46, ["type", "maxlength", "placeholder", "value", "focus", "confirm-type", "disabled", "readonly", "cursor-spacing"])
                  ],
                  32
                  /* NEED_HYDRATION */
                )
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["nut-searchbar__input-inner-icon", { "nut-searchbar__input-inner-icon-absolute": $setup.hasSlot("rightin") }])
              },
              [
                $setup.props.clearable ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: vue.normalizeClass(["nut-searchbar__search-icon nut-searchbar__input-clear", { "nut-hidden": $setup.innerValue.length <= 0 }]),
                    onClick: $setup.handleClear
                  },
                  [
                    $setup.hasSlot("clear-icon") ? vue.renderSlot(_ctx.$slots, "clear-icon", { key: 0 }, void 0, true) : (vue.openBlock(), vue.createBlock($setup["NutIcon"], {
                      key: 1,
                      name: $setup.props.clearIcon
                    }, null, 8, ["name"]))
                  ],
                  2
                  /* CLASS */
                )) : vue.createCommentVNode("v-if", true),
                $setup.hasSlot("rightin") ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "nut-searchbar__search-icon nut-searchbar__iptright-search-icon",
                  onClick: $setup.handleRightIconClick
                }, [
                  vue.renderSlot(_ctx.$slots, "rightin", {}, void 0, true)
                ])) : vue.createCommentVNode("v-if", true)
              ],
              2
              /* CLASS */
            )
          ],
          6
          /* CLASS, STYLE */
        ),
        $setup.hasSlot("rightout") ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "nut-searchbar__search-icon nut-searchbar__right-search-icon"
        }, [
          vue.renderSlot(_ctx.$slots, "rightout", {}, void 0, true)
        ])) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __unplugin_components_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-2f2d6563"], ["__file", "D:/WebStormProject/bird-identification-app/node_modules/nutui-uniapp/components/searchbar/searchbar.vue"]]);
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "bird-search",
    setup(__props, { expose: __expose }) {
      __expose();
      const searchValue = vue.ref();
      const res = vue.ref();
      setTimeout(() => {
        res.value = [
          {
            id: "1",
            name: "1",
            img: "https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png"
          },
          {
            id: "1",
            name: "2",
            img: "https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png"
          },
          {
            id: "1",
            name: "3",
            img: "https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png"
          }
        ];
      });
      const jumpPage = (id) => {
        uni.navigateTo({
          url: `/pages/explore-bird-nest?id=${id}`
        });
      };
      const __returned__ = { searchValue, res, jumpPage };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_nut_searchbar = __unplugin_components_0$1;
    const _component_nut_empty = __unplugin_components_0$2;
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "top" }, [
        vue.createVNode(_component_nut_searchbar, {
          modelValue: $setup.searchValue,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.searchValue = $event)
        }, {
          rightout: vue.withCtx(() => [
            vue.createTextVNode("搜索")
          ]),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"])
      ]),
      vue.createElementVNode("view", { class: "list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.res, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "list-item",
              key: index,
              onClick: ($event) => $setup.jumpPage(item.id)
            }, [
              vue.createElementVNode("img", {
                src: item.img,
                alt: ""
              }, null, 8, ["src"]),
              vue.createElementVNode(
                "view",
                { class: "name" },
                vue.toDisplayString(item.name),
                1
                /* TEXT */
              )
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        vue.createVNode(_component_nut_empty, { description: "无数据" })
      ])
    ]);
  }
  const PagesBirdSearch = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-576df4ed"], ["__file", "D:/WebStormProject/bird-identification-app/src/pages/bird-search.vue"]]);
  const AVATAR_GROUP_KEY = Symbol("avatarGroup");
  const avatarProps = {
    ...commonProps,
    /**
     * @description 头像的大小，可选值为：`large`、`normal`、`small`，支持直接输入数字
     */
    size: makeNumericProp(void 0),
    /**
     * @description 头像的形状，可选值为：`square`、`round`
     */
    shape: makeStringProp(void 0),
    /**
     * @description 背景色
     */
    bgColor: makeStringProp("#eee"),
    /**
     * @description 字体颜色
     */
    customColor: makeStringProp("#666")
  };
  const avatarSize = ["large", "normal", "small"];
  const componentName = `${PREFIX}-avatar`;
  const __default__ = vue.defineComponent({
    name: componentName,
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  });
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    ...__default__,
    props: avatarProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const instance = vue.getCurrentInstance();
      const { parent } = useInject(AVATAR_GROUP_KEY);
      const show = vue.ref(true);
      const innerZIndex = vue.ref(void 0);
      vue.watch(() => ({
        maxCount: parent == null ? void 0 : parent.props.maxCount,
        children: parent == null ? void 0 : parent.internalChildren
      }), ({ maxCount, children }) => {
        if (maxCount == null || Number(maxCount) <= 0 || children == null || instance == null) {
          show.value = true;
          innerZIndex.value = void 0;
          return;
        }
        const index = children.findIndex((item) => {
          var _a;
          return item.uid === instance.uid && !((_a = item.props.customClass) == null ? void 0 : _a.includes("avatar-fold"));
        });
        if (index < 0) {
          show.value = true;
          innerZIndex.value = void 0;
          return;
        }
        show.value = index < Number(maxCount);
        if ((parent == null ? void 0 : parent.props.zIndex) === "right")
          innerZIndex.value = children.length - index;
        else
          innerZIndex.value = void 0;
      }, {
        immediate: true,
        deep: true
      });
      function getTrulySize() {
        if (props.size != null)
          return props.size;
        if (parent != null && parent.props.size != null)
          return parent.props.size;
        return "normal";
      }
      const finalSize = vue.computed(() => {
        const size = getTrulySize();
        const preset = avatarSize.includes(size);
        return {
          preset,
          value: preset ? size : pxCheck(size)
        };
      });
      const finalShape = vue.computed(() => {
        if (props.shape != null)
          return props.shape;
        if (parent != null && parent.props.shape != null)
          return parent.props.shape;
        return "round";
      });
      const classes = vue.computed(() => {
        const value = {
          [`nut-avatar-${finalShape.value}`]: true,
          "nut-hidden": !show.value
        };
        if (finalSize.value.preset)
          value[`nut-avatar-${finalSize.value.value}`] = true;
        return getMainClass(props, componentName, value);
      });
      const styles = vue.computed(() => {
        const value = {
          backgroundColor: props.bgColor,
          color: props.customColor
        };
        if (!finalSize.value.preset) {
          value.width = finalSize.value.value;
          value.height = finalSize.value.value;
        }
        if (parent == null ? void 0 : parent.props.span)
          value.marginLeft = pxCheck(parent == null ? void 0 : parent.props.span);
        if (innerZIndex.value !== void 0)
          value.zIndex = innerZIndex.value;
        return getMainStyle(props, value);
      });
      const __returned__ = { componentName, props, instance, parent, show, innerZIndex, getTrulySize, finalSize, finalShape, classes, styles };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        style: vue.normalizeStyle($setup.styles),
        class: vue.normalizeClass($setup.classes)
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __unplugin_components_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-49958696"], ["__file", "D:/WebStormProject/bird-identification-app/node_modules/nutui-uniapp/components/avatar/avatar.vue"]]);
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "myself",
    setup(__props, { expose: __expose }) {
      __expose();
      const res = vue.ref();
      const init = async () => {
        res.value = {
          id: "1",
          name: "啊实打",
          sex: "男",
          region: "东北",
          phone: "1333333333",
          email: "222@22.com"
        };
      };
      const sheetVisible = vue.ref(false);
      const menuItems = [
        {
          name: "从相册选择"
        },
        {
          name: "拍照"
        }
      ];
      const chooseItem = (itemParams) => {
        switch (itemParams.name) {
          case "从相册选择":
            uni.chooseImage({
              count: 1,
              // 默认9，选择图片的数量
              sizeType: ["original"],
              // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ["album"],
              // 从相册选择
              success: function(res2) {
                const tempFilePaths = res2.tempFilePaths;
                formatAppLog("log", "at pages/myself.vue:38", tempFilePaths);
              }
            });
            break;
          case "拍照":
            uni.chooseImage({
              count: 1,
              // 可以选择图片的数量
              sourceType: ["camera"],
              // 仅使用摄像头
              success: function(res2) {
                const tempFilePaths = res2.tempFilePaths;
                formatAppLog("log", "at pages/myself.vue:51", tempFilePaths);
              }
            });
            break;
        }
      };
      const jumpPage = (id) => {
        uni.navigateTo({
          url: `/pages/my-bird?id=${id}`
        });
      };
      vue.onMounted(() => {
        init();
      });
      const __returned__ = { res, init, sheetVisible, menuItems, chooseItem, jumpPage, TabBar };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    var _a, _b, _c, _d, _e;
    const _component_nut_avatar = __unplugin_components_0;
    const _component_nut_action_sheet = __unplugin_components_1;
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "top" }, [
        vue.createElementVNode("view", { class: "head" }, [
          vue.createVNode(_component_nut_avatar, {
            size: "large",
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.sheetVisible = true)
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("image", { src: "https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png" })
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createElementVNode(
            "view",
            { class: "name" },
            vue.toDisplayString((_a = $setup.res) == null ? void 0 : _a.name),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "edit" }, "编辑")
        ]),
        vue.createElementVNode("view", { class: "content" }, [
          vue.createElementVNode("view", { class: "info" }, [
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("view", { class: "title" }, "性别"),
              vue.createElementVNode(
                "view",
                null,
                vue.toDisplayString((_b = $setup.res) == null ? void 0 : _b.sex),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("view", { class: "title" }, "地域"),
              vue.createElementVNode(
                "view",
                null,
                vue.toDisplayString((_c = $setup.res) == null ? void 0 : _c.region),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("view", { class: "title" }, "手机号"),
              vue.createElementVNode(
                "view",
                null,
                vue.toDisplayString((_d = $setup.res) == null ? void 0 : _d.phone),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("view", { class: "title" }, "邮箱"),
              vue.createElementVNode(
                "view",
                null,
                vue.toDisplayString((_e = $setup.res) == null ? void 0 : _e.email),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", {
            class: "history",
            onClick: _cache[1] || (_cache[1] = ($event) => $setup.jumpPage($setup.res.id))
          }, [
            vue.createElementVNode("view", { class: "title" }, "我的识鸟")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "bottom" }, [
        vue.createVNode($setup["TabBar"], { "current-index": 4 })
      ]),
      vue.createVNode(_component_nut_action_sheet, {
        visible: $setup.sheetVisible,
        "menu-items": $setup.menuItems,
        "cancel-txt": "取消",
        "close-abled": true,
        onChoose: $setup.chooseItem,
        onClose: _cache[2] || (_cache[2] = ($event) => $setup.sheetVisible = false),
        onCancel: _cache[3] || (_cache[3] = ($event) => $setup.sheetVisible = false)
      }, null, 8, ["visible"])
    ]);
  }
  const PagesMyself = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-6ce9bf4d"], ["__file", "D:/WebStormProject/bird-identification-app/src/pages/myself.vue"]]);
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "my-bird",
    setup(__props, { expose: __expose }) {
      __expose();
      const searchValue = vue.ref();
      const res = vue.ref();
      setTimeout(() => {
        res.value = [
          {
            id: "1",
            name: "1",
            img: "https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png"
          },
          {
            id: "1",
            name: "2",
            img: "https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png"
          },
          {
            id: "1",
            name: "3",
            img: "https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png"
          }
        ];
      });
      const jumpPage = (id) => {
        uni.navigateTo({
          url: `/pages/explore-bird-nest?id=${id}`
        });
      };
      const __returned__ = { searchValue, res, jumpPage };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_nut_empty = __unplugin_components_0$2;
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "top" }, " 识别记录 "),
      vue.createElementVNode("view", { class: "list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.res, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "list-item",
              key: index,
              onClick: ($event) => $setup.jumpPage(item.id)
            }, [
              vue.createElementVNode("img", {
                src: item.img,
                alt: ""
              }, null, 8, ["src"]),
              vue.createElementVNode(
                "view",
                { class: "name" },
                vue.toDisplayString(item.name),
                1
                /* TEXT */
              )
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        vue.createVNode(_component_nut_empty, { description: "无数据" })
      ])
    ]);
  }
  const PagesMyBird = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-03a80356"], ["__file", "D:/WebStormProject/bird-identification-app/src/pages/my-bird.vue"]]);
  __definePage("pages/index", PagesIndex);
  __definePage("pages/identification-bird", PagesIdentificationBird);
  __definePage("pages/result", PagesResult);
  __definePage("pages/today-share", PagesTodayShare);
  __definePage("pages/explore-bird-nest", PagesExploreBirdNest);
  __definePage("pages/bird-search", PagesBirdSearch);
  __definePage("pages/myself", PagesMyself);
  __definePage("pages/my-bird", PagesMyBird);
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props, { expose: __expose }) {
      __expose();
      onLaunch(() => {
        formatAppLog("log", "at App.vue:4", "App Launch");
      });
      onShow(() => {
        formatAppLog("log", "at App.vue:7", "App Show");
      });
      onHide(() => {
        formatAppLog("log", "at App.vue:10", "App Hide");
      });
      const __returned__ = { get onLaunch() {
        return onLaunch;
      }, get onShow() {
        return onShow;
      }, get onHide() {
        return onHide;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/WebStormProject/bird-identification-app/src/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
