/**
 * @file els core文件
 * @author fanyue
 */

(function () {
    'use strict'
    $.els = $.els || {};
    $.els.version = "2.2.0";
    //通用配置
    $.els.defaultConfig ? '' : $.els.defaultConfig = {
        grid: {},
        validate: {},
        form: {},
        myCascade: {},
        cascade: {},
        cascader2: {},
        layout: {},
        mainFrame: {},
        menu: {},
        modal: {},
        router: {},
        select: {},
        notice: {},
        alert: {},
        collapse: {},
        dropDown: {},
        progress: {},
        selectGroup: {},
        step: {},
        subarea: {},
        swipepad: {},
        switchery: {},
        pdfBasePath: '../../plugins/pdf/web/viewer.html?file='
    };
    /**
     * 组件生成入口
     * @param {string} key 字段名
     * @param {object} constructor 构造器
     */
    $.els.entry = function (key, constructor) {
        return function () {
            var instance = arguments[0].data(key);
            if ((arguments.length == 2 && typeof arguments[1] === 'object') || arguments.length == 1) {
                if (instance) {
                    throw new Error('[' + key + '] the element has been init');
                } else {
                    var options = arguments[1] || {};
                    return new constructor(arguments[0], options);
                }
            } else if (typeof arguments[1] === 'string') {
                if (instance) {
                    if (!instance.callMethod[arguments[1]]) {
                        throw new Error('[' + key + '] the method doesn\'t exist');
                    }
                    return instance.callMethod[arguments[1]](arguments[2]);
                } else {
                    throw new Error('[' + key + '] the element is not instantiated');
                }
            }
        }
    }
    $.els.util = {
        /**
         * @desc 判断object 对象是否存在key值
         * @param {object} obj 被判断的对象
         * @param {string} key 键名
         * @returns {boolean} 返回true or false
         */
        hasKey: function (obj, key) {
            return ({}).hasOwnProperty.call(obj, key);
        },
        /**
         * @desc 判断页面是否有 纵向滚动条
         * @returns {boolean} 返回true or false
         */
        hasScrollbar: function () {
            return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
        },
        /**
         * @desc 计算纵向滚动条宽度
         * @returns {number} 纵向滚动条宽度
         */
        getScrollbarWidth: function () {
            var scrollDiv = document.createElement("div");
            scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
            document.body.appendChild(scrollDiv);
            var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
            return scrollbarWidth;
        },
        /**
         * @desc  锁定滚动条 并返回锁定前overflow的设置
         * @returns {object} {x,y} 分别对应 overflow-x 和 overflow-y
         */
        scrollState: function ($content) {
            var content = $content || $("body"),
                state = {
                    x: content.css("overflow-x"),
                    y: content.css("overflow-y")
                };
            content.css({
                "overflow-x": 'hidden',
                "overflow-y": 'hidden'
            })
            return state;
        },
        /**
         * @desc 阻止冒泡事件
         * @param {object} event 事件event对象
         */
        stopPropagation: function (e) {
            if (e && e.stopPropagation) {
                //因此它支持W3C的stopPropagation()方法
                e.stopPropagation();
            } else {
                //否则，我们需要使用IE的方式来取消事件冒泡
                window.event.cancelBubble = true;
                return false;
            }
        },
        /**
         * @desc 阻止默认事件
         * @param {object} event 事件event对象
         */
        preventDefault: function (e) {
            //如果提供了事件对象，则这是一个非IE浏览器
            if (e && e.preventDefault) {
                //阻止默认浏览器动作(W3C)
                e.preventDefault();
            } else {
                //IE中阻止函数器默认动作的方式
                window.event.returnValue = false;
                return false;
            }
        },
        loading: function () {
            // return layer.load(1, {
            //     shade: [0.1, '#fff']
            // });
            return top.layer.msg('加载中', {
                icon: 16,
                shade: 0.01,
                time: false
            });
        },
        /**
         * @desc 表单序列化
         */
        serializeObject: function ($form) {
            var o = {};
            var a = $form.serializeArray();
            $.each(a, function () {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push($.trim(this.value) || '');
                } else {
                    o[this.name] = $.trim(this.value) || '';
                }
            });
            return o;
        },
        post: function (url, paramters, target) {
            $("#ELSPOST").length && $("#ELSPOST").remove();
            var temp_form = document.createElement("form");
            temp_form.id = 'ELSPOST'
            temp_form.action = url;
            //如需打开新窗口，form的target属性要设置为'_blank'
            var t = target || "_self";
            temp_form.target = t;
            temp_form.method = "post";
            temp_form.style.display = "none";
            var p = paramters || {};
            for (var item in paramters) {
                var opt = document.createElement("textarea");
                opt.name = item;
                opt.value = p[item];
                temp_form.appendChild(opt);
            }
            document.body.appendChild(temp_form);
            temp_form.submit();
        },
        getRealPath: function () {
            var curWwwPath = window.document.location.href;
            var index = curWwwPath.lastIndexOf('/') + 1;
            return curWwwPath.substring(0, index);
        },
        /**
         * @desc 加载远程文件
         * @param file 文件名称，可以是css,js,图片等
         * @param callback 成功回调
         * @param error 失败回调
         * @returns {boolean}
         */
        loadFile: function (file, callback, error) {
            callback = callback || function () {};
            error = error || function (data) {
                els.showMessage(data)
            };
            var files = typeof file == "string" ? [file] : file;
            var htmlDoc = document.getElementsByTagName("head")[0],
                okCounts = 0,
                fileCounts = files.length,
                i,
                loadFilePath = null;
            for (i = 0; i < fileCounts; i++) {
                var includeFile = null,
                    att = null,
                    ext, hash;
                loadFilePath = files[i];
                hash = $.els.util.hashCode(loadFilePath);
                if (document.getElementById("loadHash_" + hash)) {
                    okCounts += 1;
                    if (okCounts == fileCounts) {
                        callback();
                        return true
                    }
                    continue
                }
                att = loadFilePath.split("?")[0].split(".");
                ext = att[att.length - 1].toLowerCase();
                switch (ext) {
                    case "css":
                        includeFile = document.createElement("link");
                        includeFile.setAttribute("rel", "stylesheet");
                        includeFile.setAttribute("type", "text/css");
                        includeFile.setAttribute("href", loadFilePath);
                        break;
                    case "js":
                        includeFile = document.createElement("script");
                        includeFile.setAttribute("type", "text/javascript");
                        includeFile.setAttribute("src", loadFilePath);
                        break;
                    case "jpg":
                    case "jpeg":
                    case "png":
                    case "gif":
                        includeFile = document.createElement("img");
                        includeFile.setAttribute("src", loadFilePath);
                        break;
                    default:
                        error("载入的格式不支持:" + loadFilePath);
                        return false
                }
                if (typeof includeFile != "undefined") {
                    includeFile.setAttribute("id", "loadHash_" + hash);
                    htmlDoc.appendChild(includeFile);
                    includeFile.onreadystatechange = function () {
                        if (includeFile.readyState == "loaded" || includeFile.readyState == "complete") {
                            okCounts += 1;
                            if (okCounts == fileCounts) {
                                callback();
                                return true
                            }
                        }
                    };
                    includeFile.onload = function () {
                        okCounts += 1;
                        if (okCounts == fileCounts) {
                            callback();
                            return true
                        }
                    };
                    includeFile.onerror = function () {
                        $("#loadhash_" + hash).remove();
                        error(loadFilePath + " load error");
                        return false
                    }
                } else {
                    error("文件创建失败");
                    return false
                }
            }
        },
        /**
         * @desc get请求时候， 为url添加参数
         * @param url
         * @param params
         * @returns {*}
         */
        addParam: function (url, params) {
            if (params != "") {
                url += (url.indexOf("?") == -1 ? "?" : "&");
                url += params
            }
            return url
        },
        /**
         * @desc 获取url上的参数。
         * @param paramName
         * @param url
         * @returns {*}
         */
        getParam: function (paramName, url) {
            var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)", "i");
            if (!url || url == "") {
                url = window.location.search
            } else {
                url = url.substring(url.indexOf("?"))
            }
            r = url.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2])
            }
            return null
        },
        /**
         * @desc 对url进行编码。 解决url中文问题
         * @param url
         * @returns {string}
         */
        encodeUrl: function (url) {
            return encodeURIComponent(url)
        },
        /**
         * @desc 对url进行解码， 解决中文问题
         * @param url
         * @returns {string}
         */
        decodeUrl: function (url) {
            return decodeURIComponent(url)
        },
        /**
         * @desc 防抖
         * @param {number} idle 延时
         * @param {function} action 函数
         */
        debounce: function (idle, action) {
            var last;
            return function () {
                var ctx = this,
                    args = arguments
                clearTimeout(last)
                last = setTimeout(function () {
                    action.apply(ctx, args)
                }, idle)
            }
        },
        /**
         * @desc 函数节流
         * @param idle 延迟执行毫秒数
         * @param func 函数
         */
        throttle: function (idle, action) {
            var timer;
            return function() {
                if (timer) {
                    return;
                }
                var ctx = this;
                var args = arguments
                timer = setTimeout(function() {
                    action.apply(ctx, args)
                    timer = null;
                }, idle);
            };
        },
        /**
         * @desc 判断url是绝对路径 还是相对路径
         * @param {string} url 路径
         */
        isAbsoluteUrl: function (url) {
            if (typeof url !== 'string') {
                throw new TypeError('Expected a string');
            }
            return /^[a-z][a-z0-9+.-]*:/.test(url);
        },
        /**
         * @desc 数组去重 不支持对象
         * @param {Array} arr 数组
         */
        unique: function (arr) {
            return $.grep(arr, function (item, index) {
                return arr.indexOf(item) === index
            })
        },
        /**
         * @desc 哈希码：第二个参数判断是否大小写敏感
         * @param str
         * @param caseSensitive
         * @returns {number}
         */
        hashCode: function (str, caseSensitive) {
            if (caseSensitive != true) {
                str = str.toLowerCase()
            }
            var hash = 1315423911,
                i, ch;
            for (i = str.length - 1; i >= 0; i--) {
                ch = str.charCodeAt(i);
                hash ^= ((hash << 5) + ch + (hash >> 2))
            }
            return (hash & 2147483647)
        },
        /**
         * @desc 删除iframe并释放内存 - IE
         * @param {object} iframe 原生iframe元素
         */
        destroyIframe: function (iframe) {
            //把iframe指向空白页面，这样可以释放大部分内存。
            iframe.src = 'about:blank';
            try {
                iframe.contentWindow.document.write('');
                iframe.contentWindow.document.clear();
            } catch (e) {}
            //把iframe从页面移除
            iframe.parentNode.removeChild(iframe);
        },
        getScrollEventTarget: function (element, rootElement) {
            var node = element;
            var rootElement = rootElement || window;
            var overflowScrollReg = /scroll|auto/i;
            while (node.tagName !== 'HTML' &&
                node.nodeType === 1 &&
                node !== rootElement
            ) {
                var overflowY = window.getComputedStyle(node)['overflowY'];
                if (overflowScrollReg.test(overflowY)) {
                    if (node.tagName !== 'BODY') {
                        return node
                    }
                    var htmlOverflowY = window.getComputedStyle(node.parentNode)['overflowY']
                    if (overflowScrollReg.test(htmlOverflowY)) {
                        return node;
                    }
                }
                node = node.parentNode;
            }
            return rootElement;
        },
        /**
         * @desc 阅读jquery-validation源码 $.fn.valid 函数在未初始化表单效验的表单内使用会造成表单自动效验初始化
         * 三方表单控件的数据变动， 往往无法有效触发表单效验需要手动触发效验， 且在无表单效验的表单内， 不应在变动后调用$.fn.valid方法（存在未导入，或不应该的自动初始化效验问题）
         * 我们需要一种智能方法在三方控件数据变更的时候，自动决定是否效验。
         * 这样后期可以避免在三方控件的html上书写data-valid标签。减少忘写，漏写的可能。
         * @param {object} $element jquery 表单子元素 例如input select 不可是form
         * @returns {boolean}存在validator实例返回效验结果，不存在或没有父表单则返回true
         */
        _valid: function ($element) {
            var form = $element.get(0).form;
            if (form) {
                return $.data(form, 'validator') ? $element.valid() : true;
            }
            return true
        }
    }
    $.els.store = {
        scrollbarWidth: 0,
        /**
         * 判断当前游览器是否为ie
         */
        ie: function () {
            var agent = navigator.userAgent.toLowerCase();
            return (!!window.ActiveXObject || "ActiveXObject" in window) ? ((agent.match(/msie\s(\d+)/) || [])[1] || (agent.match(/Trident/i) && agent.match(/rv:(\d+)/) || [])[1] || false) : false
        }(),
    }
    /**
     * @desc resize事件优化
     * @param {function} fn 将要运行的函数
     */
    $.els.resize = function (fn) {
        $(window).resize($.els.util.debounce(500, fn));
    }
    /**
     * @desc scroll事件优化
     * @param {function} fn 将要运行的函数
     */
    $.els.scroll = function (fn) {
        $(window).scroll($.els.util.debounce(500, fn));
    }
    /**
     * 自定义函数队列，绑定至resize scroll事件
     */
    $.els.resizeFn = $.Callbacks('unique');
    $.els.scrollFn = $.Callbacks('unique');

    $.els.resize(function () {
        /**
         * $.Callbacks无法改变执行顺序
         * 有些需求是在框架自适应组件代码运行前，进行执行的。
         * 例：动态修改jqgrid容器的宽度，再让jqgrid自适应跟进
         * 现定义beforeResize方法触发
         */
        $(window).trigger('beforeResize');
        $.els.resizeFn.fire();
    })
    $.els.scroll(function () {
        $.els.scrollFn.fire();
    })


    /**
     * 初始化
     */
    $(function () {
        //获取滚动条宽度
        $.els.store.scrollbarWidth = $.els.util.getScrollbarWidth();
    })

    $.els.resizeFn.add(function () {
        $('.els-tab').each(function () {
            var $this = $(this);
            var instance = $this.data('els.tab')
            if (instance) {
                $.els.tab($this, 'full');
                if (instance.opt.sticky){
                    $.els.tab($this, 'scrollCheck');
                }

            }
        });
        if ($.fn.jqGrid) {
            $('.els-jqGrid').each(function () {
                $.els.grid.full($(this));
            });
        }
        if (window.echarts) {
            $('.els-echart').each(function () {
                var instance_id = $(this).attr('_echarts_instance_');
                var instance = echarts.getInstanceById(instance_id);
                instance.resize();
            });
        }

    })

})();

// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        var k;
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = +fromIndex || 0;
        if (Math.abs(n) === Infinity) {
            n = 0;
        }
        if (n >= len) {
            return -1;
        }
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

/**
 * @file 省市区级联组件
 * @author fanyue
 * @version 1.0
 */
;
(function () {
    'use strict'
    var AddressCascade = function ($dom, options) {
        var that = this;
        that.cityJson = null;
        $dom.data('els.addressCascade', that);
        that.$container = $dom;
        that.$province = that.$container.find('select[data-type=\"province\"]');
        that.$city = that.$container.find('select[data-type=\"city\"]');
        that.$district = that.$container.find('select[data-type=\"district\"]');
        that.opt = $.extend({}, defaultOpt, options);
        /**
         * @desc select change 事件绑定
         */
        that.bindEvent = function () {
            that.$province.on('change.els.addressCascade', function (event, selectedValue) {
                var cityArr = that.getOptionsData($(this).val());
                that.$district.get(0).options.length = 1;
                that.render(that.$city, cityArr, selectedValue);
            })

            that.$city.on('change.els.addressCascade', function (event, selectedValue) {
                var districtArr = that.getOptionsData($(this).val());
                that.render(that.$district, districtArr, selectedValue);
            })
        };
        /**
         * @desc 获取数据 promise 函数，如若一个页面重复出现该组件 则ajax获取数据只会执行一次。
         */
        that.getChinaData = function () {
            return $.ajax({
                url: that.opt.url,
                type: that.opt.type,
                dataType: 'json'
            }).then(function (data) {
                that.cityJson = that.formatter(data);
                that.opt.done();
            })
        };
        /**
         *@desc 根据数组字符串动态生成下一个级联的字符串数组
         * @param {string} key 动态生成options字符串数组
         */
        that.getOptionsData = function (key) {
            var arr = [];
            if (arguments.length == 0 || !that.cityJson[key] || key == that.opt.invalidValue) {
                return arr;
            }
            $.each(that.cityJson[key], function (index, value) {
                arr.push(value)
            })
            return arr
        }
        /**
         *
         * @param {object} $el 被渲染的select的jquery对象
         * @param {object} data 需要被渲染的options字符串数组
         * @param {*} selectedValue 要被选中的数据的值
         */
        that.render = function ($el, data, selectedValue) {
            var type = $el.attr('data-type');
            var str = "";
            $.each(data, function (index, item) {
                str += '<option value=\"' + item[that.opt.render.value] + '\"';
                if (selectedValue && item[that.opt.render.value] == selectedValue[type]) {
                    str += 'selected = selected'
                }
                str += '>' + item[that.opt.render.label] + '</option>';
            })
            $el.get(0).options.length = 1
            $el.append(str);
            $el.trigger('change', [selectedValue])
        };
        /**
         * @desc 解析被选中的数据的省市区
         * @param {string} data 要被选中的数据的值
         * @returns {object} 返回被选中数组对应的省市区json数据
         */
        that.resolve = function (data) {
            var arr = data.toString().split('');
            var length = arr.length;
            var c = arr[length - 3];
            var d = arr[length - 4];
            var e = arr[length - 5];
            var f = arr[length - 6];
            return {
                province: f + e + '0000',
                city: f + e + d + c + "00",
                district: data.toString()
            }
        }
        /**
         * 格式化ajax得到的数据
         * @param {object} data
         */
        that.formatter = function (data) {
            var json = {};
            var fatherId = that.opt.render.fatherId;
            var value = that.opt.render.value;
            var provinceFatherId = that.opt.provinceFatherId
            $.each(data, function (index, item) {
                if (item[fatherId] == provinceFatherId) { //省
                    json[provinceFatherId] ? '' : json[provinceFatherId] = {}
                    json[provinceFatherId][item[value]] = item;
                    json[value] ? '' : json[value] = {};
                } else {
                    var idArr = item[value].split('');
                    if (idArr[length - 1] != '0' && idArr[length - 2] != '0') { //市
                        json[item[value]] ? '' : json[item[value]] = {};
                        json[item[fatherId]] ? '' : json[item[fatherId]] = {};
                        json[item[fatherId]][item[value]] = item;
                    } else { //区
                        json[item[fatherId]] ? '' : json[item[fatherId]] = {};
                        json[item[fatherId]] = item;
                    }
                }
            })
            return json;
        }
        /**
         *
         * 初始化
         */
        that.init = function () {
            that.bindEvent();
            that.getChinaData().then(function () {
                var selectedValue = that.opt.data ? that.resolve(that.opt.data) : null;
                var provinceArr = that.getOptionsData(that.opt.provinceFatherId)
                that.render(that.$province, provinceArr, selectedValue);
            })
        }

        that.callMethod = {
            /**
             * @desc 设置被选中的区的值
             * @param {string} data 被选中的区的值
             */
            'setData': function (data) {
                var selectedValue = that.resolve(data);
                var provinceArr = that.getOptionsData(that.opt.provinceFatherId)
                that.$province.get(0).options.length = 1;
                that.$city.get(0).options.length = 1;
                that.$district.get(0).options.length = 1;
                that.render(that.$province, provinceArr, selectedValue);
            },
            /**
             * @desc 返回被选中的区的值
             * @returns 当前被选中地区的值
             */
            "getData": function () {
                if (that.$district.val() != that.opt.invalidValue) {
                    return that.$district.val();
                } else if (that.$city.val() != that.opt.invalidValue) {
                    return that.$city.val();
                } else if (that.$province.val() != that.opt.invalidValue) {
                    return that.$province.val();
                } else {
                    return that.opt.invalidValue;
                }
            },
            /**
             *@desc 重置
             */
            'reset':function(){
                that.$province.find('option[value="' + that.opt.invalidValue + '"]').prop('selected',true);
                that.$city.get(0).options.length = 1;
                that.$district.get(0).options.length = 1;
            },
            'destroy': function () {
                that.$province.get(0).options.length = 1;
                that.$province.off('change.els.addressCascade');
                that.$city.get(0).options.length = 1;
                that.$city.off('change.els.addressCascade');
                that.$district.get(0).options.length = 1;
                $dom.removeData('els.addressCascade');
            }
        }
        that.init();
    }
    var defaultOpt = {
        url: '',
        type: "post",
        render: {
            value: 'value',
            label: "label",
            fatherId: "fatherId"
        },
        data: null,
        provinceFatherId: '000000',
        invalidValue: "-1",
        done:$.noop
    }
    $.els.addressCascade = $.els.entry('els.addressCascade', AddressCascade);
})()

/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+ function ($) {
    'use strict';

    // AFFIX CLASS DEFINITION
    // ======================

    var Affix = function (element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options)

        this.$target = $(this.options.target)
            .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
            .on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this))

        this.$element = $(element)
        this.affixed = null
        this.unpin = null
        this.pinnedOffset = null

        this.checkPosition()
    }

    Affix.VERSION = '3.3.7'

    Affix.RESET = 'affix affix-top affix-bottom'

    Affix.DEFAULTS = {
        offset: 0,
        target: window
    }

    Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
        var scrollTop = this.$target.scrollTop()
        var position = this.$element.offset()
        var targetHeight = this.$target.height()

        if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

        if (this.affixed == 'bottom') {
            if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
            return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
        }

        var initializing = this.affixed == null
        var colliderTop = initializing ? scrollTop : position.top
        var colliderHeight = initializing ? targetHeight : height

        if (offsetTop != null && scrollTop <= offsetTop) return 'top'
        if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

        return false
    }

    Affix.prototype.getPinnedOffset = function () {
        if (this.pinnedOffset) return this.pinnedOffset
        this.$element.removeClass(Affix.RESET).addClass('affix')
        var scrollTop = this.$target.scrollTop()
        var position = this.$element.offset()
        return (this.pinnedOffset = position.top - scrollTop)
    }

    Affix.prototype.checkPositionWithEventLoop = function () {
        setTimeout($.proxy(this.checkPosition, this), 1)
    }

    Affix.prototype.checkPosition = function () {
        if (!this.$element.is(':visible')) return

        var height = this.$element.height()
        var offset = this.options.offset
        var offsetTop = offset.top
        var offsetBottom = offset.bottom
        var scrollHeight = Math.max($(document).height(), $(document.body).height())

        if (typeof offset != 'object') offsetBottom = offsetTop = offset
        if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element)
        if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

        var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

        if (this.affixed != affix) {
            if (this.unpin != null) this.$element.css('top', '')

            var affixType = 'affix' + (affix ? '-' + affix : '')
            var e = $.Event(affixType + '.bs.affix')

            this.$element.trigger(e)

            if (e.isDefaultPrevented()) return

            this.affixed = affix
            this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

            this.$element
                .removeClass(Affix.RESET)
                .addClass(affixType)
                .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
        }

        if (affix == 'bottom') {
            this.$element.offset({
                top: scrollHeight - height - offsetBottom
            })
        }
    }


    // AFFIX PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.affix')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.affix

    $.fn.affix = Plugin
    $.fn.affix.Constructor = Affix


    // AFFIX NO CONFLICT
    // =================

    $.fn.affix.noConflict = function () {
        $.fn.affix = old
        return this
    }


    // AFFIX DATA-API
    // ==============

    $(window).on('load', function () {
        $('[data-spy="affix"]').each(function () {
            var $spy = $(this)
            var data = $spy.data()

            data.offset = data.offset || {}

            if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
            if (data.offsetTop != null) data.offset.top = data.offsetTop

            Plugin.call($spy, data)
        })
    })

}(jQuery);

/**
 * @file 警告信息
 * @author fanyue
 * @version 1.0
 */

;
(function () {
    'use strict'
    var Alert = function ($dom, options) {
        var that = this;
        $dom.data('els.alert', that);
        that.opt = $.extend({}, defaultOpt, $.els.defaultConfig.alert,options);

        that.method = {
            init: function () {
                that.method.bindEvent();
            },
            bindEvent: function () {
                var x = $dom.find('.els-alert-close');
                if(x.length){
                    x.on('click.els.alert', function () {
                        $dom.fadeOut('fast', function () {
                            $dom.remove();
                        })
                    });
                }
            }
        }

        that.callMethod = {
            destroy: function () {
                var x = $dom.find('.els-alert-close');
                x.length && x.off('click.els.alert');
                $dom.removeData('els.alert');
            }
        }

        that.method.init();
    }


    var defaultOpt = {
        close:true
    }

    $.els.alert = $.els.entry('els.alert', Alert);

    $(function(){
        $('[data-alert]').each(function(){
            $.els.alert($(this));
        })
    })
})()

/**
 * @file 个人函数，他人请勿使用！
 * @author fanyue
 */
;
(function () {
    $.els._analysis = {
        /**
         * @des 一维json数组处理
         */
        linearF: function (data, jsonReader) {
            var ret = {};
            var render = $.extend({}, {
                id: 'id',
                pid: 'pid',
                children: 'children'
            }, jsonReader);
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (ret[item[render.id]]) { //本身键值对已经存在
                    ret[item[render.id]] = $.extend({}, ret[item[render.id]], item) //完善自身信息
                } else {
                    ret[item[render.id]] = $.extend({}, item);
                }
                if (ret[item[render.pid]]) { //父键对值存在
                    (ret[item[render.pid]][render.children] || (ret[item[render.pid]][render.children] = [])).push(item[render.id])
                } else {
                    ret[item[render.pid]] = {}
                    ret[item[render.pid]][render.children] = []
                    ret[item[render.pid]][render.children].push(item[render.id])
                }
            }
            return ret;
        },
        /**
         * @desc 嵌套json数组处理
         */
        treeF: function (data, jsonReader) {
            var ret = {};
            var count = 0;
            var render = $.extend({}, {
                children: 'children'
            }, jsonReader);
            var _recursion = function (arr, pid) {
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    var _d = $.extend({}, item);
                    var _id = count++;
                    delete _d[render.children];
                    _d['_id'] = _id;
                    _d['_pid'] = pid;
                    ret[_id] = _d;
                    if (pid == 0) {
                        if (ret[pid]) {
                            ret[pid]._children.push(_id)
                        } else {
                            ret[pid] = {
                                _children: []
                            }
                            ret[pid]._children.push(_id)
                        }
                    } else {
                        (ret[pid]._children || (ret[pid]._children = [])).push(_id);
                    }
                    if (item[render.children] && item[render.children].length) {
                        _recursion(item[render.children], _id);
                    }
                }
            }
            _recursion(data, count++);
            return ret;
        },
    }
    $.els._dom = {
        /**
         * @desc 生成菜单dom
         */
        createMenu: function (str) {
            var domStr = str || '<div><ul></ul></div>';
            return $(domStr).appendTo('body');
        },
        /**
         * @desc 定位数据
         */
        getBoundingClientRect: function (dom) {
            var offset = dom.offset();
            return {
                top: offset.top,
                left: offset.left,
                width: dom.outerWidth(),
                height: dom.outerHeight()
            }
        },
        createHiddenfield:function(type,attr){
            var tagName = type || 'input';
            var attribute  = attr || {};
            return $(tagName).attr(attribute);
        }
    }
})()

/**
 * @file 自动完成 废弃废弃不再维护
 * @author fanyue
 * @version 1.0
 */

;
(function () {
    'use strict'

    var AutoComplete = function ($dom, options) {
        var that = this;
        $dom.data('els.autoComplete', that);
        that.opt = $.extend({}, defaultOpt, options);
        // that.$container = null;
        that.uiInstance = null;
        that.menu = null;
        // that.icon = null;

        that.method = {
            init: function () {
                // that.$container = $(container);
                // $dom.after(that.$container);
                // that.icon = that.$container.find('.els-autoComplete-icon');
                // that.$container.prepend($dom);
                that.method.jqueryUiInit();
                that.method.bindEvent();
            },
            bindEvent: function () {
                $dom.on('keydown.els.autoComplete',function(){
                    if (event.keyCode === $.ui.keyCode.TAB &&
                        that.uiInstance.menu.active) {
                        event.preventDefault();
                    }
                });
                $dom.on('click.els.autoComplete', function () {
                    // that.menu.is(":hidden") && that.menu.show();
                    $dom.autocomplete('search');
                })
            },
            jqueryUiInit: function () {
                $dom.autocomplete(that.opt)
                that.uiInstance = $dom.data("ui-autocomplete");
                that.menu = that.uiInstance.menu.element;
                // that.uiInstance._resizeMenu = function () {
                //     this.menu.element.outerWidth(that.$container.outerWidth());
                // };
                // that.uiInstance._renderMenu =  function (ul, items) {
                //     var that = this;
                //     $.each(items, function (index, item) {
                //         that._renderItemData(ul, item);
                //     });
                // }

            //    $dom.on({
            //        "autocompleteselect":function (event, ui) {
            //         //    that.data = ui.item;
            //             if (that.opt.multi){
            //                 console.log(ui.item)
            //                 console.log($dom.val(ui.item.label))
            //                 return false;
            //             }

            //        },
            //        "autocompleteopen":function(){ //展开菜单或更新建议时，添加统一开头
            //             // that.menu.prepend('<li><div style=\"height:30px;\">取消<div></li>');

            //        },
            //        'autocompleteresponse': function (event, ui) { //在搜索完成后菜单显示前触发

            //        },
            //        'autocompletesearch': function (event, ui) { //在搜索执行前满足 minLength 和 delay 后触发

            //        }
            //    });
            }
        }

        that.callMethod = {

        }

        that.method.init();
    }

    var container = '<div class="els-autoComplete-container"><i class="els-autoComplete-icon fa-caret-down fa"></i></div>';

    var defaultOpt = {
        minLength: 0,
        matchSubset: false,
        delay: 500,
        focus: function () {
            return false;
        },
    }

    $.els.autoComplete = $.els.entry('els.autoComplete', AutoComplete);
})()

/**
 * @file 返回头部
 * @author fanyue
 * @version 1.0
 */
;(function(){
    'use strict'
    $.els.defaultConfig.backTop = {
        top:400,
        // target:'window',
        time:1000
    }

    var BackTop = function ($dom, options) {
        var that = this;
        $dom.data('els.backTop', that);
        that.opt = $.extend({}, defaultOpt, options);
        that.isWindow;
        that.warpper;
        that.method = {
            init:function(){
                that.isWindow = $.isWindow(that.opt.target);
                that.warpper = that.isWindow ? $('body,html') : $(that.opt.target);
                that.method.bindEvent();
                that.method.scroll();
            },
            bindEvent:function(){
                $dom.on('click.els.backTop', function () {
                    that.warpper.animate({
                        scrollTop: 0
                    }, that.opt.time);
                    return false;
                });
                if (that.isWindow){
                    $.els.scrollFn.add(that.method.scroll)
                }else{
                    that.warpper.on('scroll.els.backTop', that.method.scroll);
                }
            },
            scroll:function(){
                var scrollTop = that.warpper.scrollTop();
                scrollTop >= that.opt.top ? $dom.fadeIn() : $dom.fadeOut();
            }
        }
        that.callMethod = {
            destroy: function () {
                $dom.off('click.els.backTop').show();
                if (that.isWindow){
                    $.els.scrollFn.remove(that.method.scroll);
                }else{
                    that.warpper.off('scroll.els.backTop');
                }
                $dom.removeData('els.backTop');
            }
        }

        that.method.init();
    }

    var defaultOpt = {
       top: 400,
       time: 1000,
       target:window
    }

    $.els.backTop = $.els.entry('els.backTop', BackTop);

    $(function(){
        var btn = $('[data-scrollTop]');
        /**
         * @ desc 循环 data-scrollTop 属性标签 根据其data-target属性返回顶部（不写则更根据body返回顶部）
         */
        btn.each(function(){
            var self = $(this);
            var config = {};
            self.attr('data-top') && (config['top'] = self.attr('data-top'));
            self.attr('data-target') && (config['target'] = self.attr('data-target'));
            self.attr('data-time') && (config['time'] = self.attr('data-time'));
            $.els.backTop(self,config);

            // var top = self.attr('data-top') || $.els.defaultConfig.backTop.top;
            // var target = self.attr('data-target') ? self.attr('data-target') : 'window';
            // var isWindow = target == 'window';
            // var targetDom = isWindow ? $('body,html') : $(target);
            // self.on('click.els.backTop', function () {
            //     targetDom.animate({
            //         scrollTop: 0
            //     }, $.els.defaultConfig.time);
            //     return false;
            // });
            // var scrollTop = targetDom.scrollTop();
            // scrollTop >= top ? self.show() : self.hide();
            // if (isWindow){
            //     $.els.scrollFn.add(function () {
            //         var scrollTop = targetDom.scrollTop();
            //         scrollTop >= top ? self.fadeIn() : self.fadeOut();
            //     })
            // }else{
            //     targetDom.scroll(function(){
            //         var scrollTop = targetDom.scrollTop();
            //         scrollTop >= top ? self.fadeIn() : self.fadeOut();
            //     })
            // }

        });
    })

})()

/**
 * @file 二级联动联组件 废弃不再维护
 * @author fanyue
 * @version 1.0
 */
;
(function () {
    'use strict'
    var util = $.els.util
    var cascade = function ($dom, options) {
        var that = this;
        $dom.data('els.cascade', that);
        that.$container = $dom;
        that.$level1 = that.$container.find('select[data-type=\"first\"]').eq(0);
        that.$level2 = that.$container.find('select[data-type=\"second\"]').eq(0);
        that.opt = $.extend({}, defaultOpt, $.els.defaultConfig.cascade, options);
        that.data = {
            "level1": {}
        };


        that.init = function () {
            that.formatter();
            that.bindEvent();
            that.render(that.$level1, that.data["level1"]);
        }

        that.bindEvent = function () {
            /**
             * @desc level1 select change事件 level2 select组件内容变化，
             */
            that.$level1.on('change', function () {
                var value = $(this).val()
                if (that.opt.invalidValue == value) {
                    that.$level2.get(0).options.length = 1;
                    return
                }
                that.$level2.get(0).options.length = 1;
                that.render(that.$level2, that.data[value]);
            })
        }
        /**
         * @desc 数据格式为特殊树型，便于级联
         */
        that.formatter = function () {
            var render = that.opt.render;
            $.each(that.opt.data, function (index, item) {
                that.data['level1'][item[render.id]] = item[render.name]
                if (util.hasKey(item, render.children) && $.isArray(item[render.children])) {
                    that.data[item[render.id]] = {};
                    $.each(item[render.children], function (_index, _item) {
                        that.data[item[render.id]][_item[render.id]] = _item[render.name]
                    })
                }
            })
        }
        /**
         * @desc 根据jquery select对象 以及数据数组  循环渲染option
         * @param {Object} $select jquery select对象
         * @param {Object} obj 循环数据
         */
        that.render = function ($select, obj) {
            var str = "";
            $.each(obj, function (key, value) {
                str += '<option value=\"' + key + '\">' +
                    value + '</option>';
            })
            $select.get(0).options.length = 1
            $select.append(str);
        }

        that.callMethod = {
            /**
             * @desc 重置方法 吧level2 内容清空只剩下第一个，并讲level1 option选择归为第一个。
             */
            'reset':function(){
                that.$level2.get(0).options.length = 1;
                that.$level1.find('option[value="' + that.opt.invalidValue + '"]').prop('selected',true);
            }
        }

        that.init();

    }

    var defaultOpt = {
        invalidValue: "-1",
        render: {
            name: 'name',
            id: 'id',
            children: 'children'
        },
        data: []
    }

    $.els.cascade = $.els.entry('els.cascade', cascade)
})()

/**
 * @file 级联组件2 废弃不再维护
 * @author fanyue
 * @version 1.0
 */
;
(function () {
    'use strict'
    var cascader2 = function ($dom, options) {
        var that = this;
        $dom.data('els.cascade2', that);
        that.opt = $.extend({}, defaultOpt, $.els.defaultConfig.cascader2, options);
        that.$container = $(
            '<div class=\"els-cascader2-picker\"><i class=\"els-cascader2-icon-arrows fa fa-angle-down\"></i>' +
            '<i class=\"els-cascader2-icon-clear fa fa-close\"></i></div>')
        that.$menu = $(
            '<div class=\"els-cascader2-menus els-cascader2-menus-hidden els-cascader2-menus-transition\"></div>'
        );
        that.$i = that.$container.children('.els-cascader2-icon-arrows').eq(0);
        that.$clear = that.$container.children('.els-cascader2-icon-clear').eq(0);
        that.init = function () {
            that.$container.insertBefore($dom).prepend($dom);
            $('body').append(that.$menu);
            that.bindEvent();
            that.method.renderHtml(null, that.opt.data);
            if (that.opt.defaultValue instanceof Array && that.opt.defaultValue.length != 0) {
                that.method.selected(that.opt.defaultValue);
            }
        }

        that.method = {
            /**
             * @desc 根据显示框体的位置，设置级联菜单出现的位置
             */
            position: function () {
                var offset = that.$container.offset();
                that.$menu.css({
                    left: offset.left,
                    top: offset.top + that.$container.outerHeight()
                })
            },
            /**
             * @desc 设置级联菜单的位置，并显示
             */
            openMenu: function () {
                this.position();
                that.$menu.removeClass('els-cascader2-menus-hidden');
                setTimeout(function () {
                    that.$menu.removeClass('els-cascader2-menus-transition');
                }, 100);
                that.$i.addClass('els-reversal');
                that.$container.addClass('els-cascader2-picker-focus');
                that.opt.onPopupVisibleChange.apply($dom,[true])
            },
            /**
             * @desc 隐藏级联菜单
             */
            closeMenu: function () {
                that.$menu.addClass('els-cascader2-menus-hidden').addClass(
                    'els-cascader2-menus-transition');
                that.$i.removeClass('els-reversal');
                that.$container.removeClass('els-cascader2-picker-focus');
                that.opt.onPopupVisibleChange.apply($dom, [false])
            },
            /**
             * @desc 根据数据渲染新的级联菜单子菜单
             * @param {Object} indexArr 索引数组
             * @param {Object} dataArr 渲染循环的数据
             */
            renderHtml: function (indexArr, dataArr) {
                if (dataArr instanceof Array && dataArr.length == 0) {
                    return;
                }
                var indexArr = indexArr || [];
                var indexStr = indexArr.join('-');
                var str = '<div  class=\"els-cascader2-menu\"><ul>'
                dataArr.forEach(function (item, index) {
                    if (({}).hasOwnProperty.call(item, that.opt.render.children) && item[that.opt.render.children] instanceof Array &&
                        item[that.opt.render.children].length != 0) {
                        var expand = ' els-cascader2-menu-item-expand';
                    } else {
                        var expand = '';
                    }
                    str += '<li class=\"els-cascader2-menu-item' + expand +
                        '\" data-index=\"' +
                        (indexArr.length != 0 ? indexStr + '-' + index : index) +
                        '\" data-value=\"' + item[that.opt.render.value] + '\">' + item[that.opt.render.label] + '</li>'
                });
                str += '</ul></div>'
                that.$menu.append(str);
            },
            /**
             * @desc 根据索引数组 得到级联下一级的数据
             * @param {Object} indexArr 索引数组
             * @returns {Object} 下一级联的数组
             */
            getData: function (indexArr) {
                var length = indexArr.length;
                var start = 0;
                var dataArr = that.opt.data;
                while (start <= length - 1) {
                    dataArr = dataArr[parseInt(indexArr[start++])];
                    if (({}).hasOwnProperty.call(dataArr, that.opt.render.children) && dataArr[that.opt.render.children] instanceof Array &&
                        dataArr[that.opt.render.children].length != 0) {
                        dataArr = dataArr[that.opt.render.children];
                    } else {
                        dataArr = [];
                        break;
                    }
                }
                return dataArr
            },
            /**
             * @desc 获取节点数据
             * @param {Object} indexArr 索引数组
             * @returns {Object} 节点数据
             */
            getNodeData: function (indexArr) {
              if (indexArr.length == 1){
                return this.filterNodeData(that.opt.data[indexArr[0]])
              }else{
                var start = 1;
                  var data = that.opt.data[indexArr[0]][that.opt.render.children];
                while (start < indexArr.length){
                    if(start>1){
                        data = data[that.opt.render.children][parseInt(indexArr[start++])];
                    }else{
                        data = data[parseInt(indexArr[start++])]
                    }
                }
                return this.filterNodeData(data)
              }
            },
            /**
             * @desc 拷贝一个新的节点数据，防止插件内数据被访问后修改，
             * @param {Object} data
             * @returns {Object} 新的节点数据对象
             */
            filterNodeData:function(data){
                var node = {};
                for(var i in data){
                    if (i != that.opt.render.children){
                        node[i] = data[i];
                    }
                }
                return node;
            },
            /**
             * @desc 设置文本内容
             */
            setText: function () {
                var str = '';
                if (that.opt['showAllLevels']){
                    that.$menu.find('.els-cascader2-menu-item-active').each(function () {
                        str += $(this).text() + that.opt.textJoin;
                    })
                     $dom.val(str.substring(0, str.length - 1));
                }else{
                    str += that.$menu.find('.els-cascader2-menu-item-active:last').text()
                    $dom.val(str);
                }
            },
            /**
             * @desc 根据元素滚动到可视范围
             * @param {object} item 需要被显示的元素jquery对象
             * @param {object} menu 被滚动的菜单jquery对象
             */
            scroll:function(item,menu){
                var top = item.position().top;
                var contentHeight = menu.height();
                var height = item.outerHeight();
                if (!(top <= contentHeight - height)){
                    menu.scrollTop(top - contentHeight + height);
                }
            },
            /**
             * @desc 根据value数组 进行选中子菜单
             * @param {Object} valueArr
             */
            selected: function (valueArr) {
                var self = this;
                that.callMethod.clear();
                that.$menu.css({
                    top:'-9999px',
                    left:'-9999px',
                    display:'block'
                });
                valueArr.forEach(function (value, index) {
                    if (0 == index) {
                        var menu = that.$menu.children('.els-cascader2-menu').eq(index).children('ul');
                        var menuActiveItem;
                        menu.scrollTop(0);
                        menu.find('.els-cascader2-menu-item').each(function () {
                            var $this = $(this);
                            if (value == $this.attr('data-value')){
                                $this.addClass('els-cascader2-menu-item-active')
                                menuActiveItem = $this;
                            }else{
                                $this.removeClass('els-cascader2-menu-item-active');
                            }
                        })
                        self.scroll(menuActiveItem,menu);
                    } else {
                        var indexArr = that.$menu.find(
                            '.els-cascader2-menu-item-active:last').attr('data-index').split(
                            '-');
                        var dataArr = self.getData(indexArr);
                        self.renderHtml(indexArr, dataArr);
                        var menu = that.$menu.children('.els-cascader2-menu').eq(index).children('ul');
                        var menuActiveItem;
                        menu.find('.els-cascader2-menu-item').each(function () {
                            var $this = $(this);
                            if (value == $this.attr('data-value')) {
                                $this.addClass('els-cascader2-menu-item-active')
                                menuActiveItem = $this;
                            } else {
                                $this.removeClass('els-cascader2-menu-item-active');
                            }
                        });
                        self.scroll(menuActiveItem, menu);
                    }
                    if (index == valueArr.length - 1) {
                        var indexArr = that.$menu.find(
                            '.els-cascader2-menu-item-active:last').attr('data-index').split(
                            '-');
                        var dataArr = self.getData(indexArr);
                        self.renderHtml(indexArr, dataArr);
                    }
                });
                self.setText();
                that.$menu.attr('style','');
            },
            /**
             * @desc 文档被点击后，运行该函数（分割在此的理由是为了解绑函数功能做伏笔）
             */
            documentClickFn: function () {
                if (!that.$menu.hasClass('els-cascader2-menus-hidden')) {
                    that.method.closeMenu();
                    return
                }
            }
        }

        that.callMethod = {
            /**
             * @desc 控件清空
             */
            clear: function () {
                if (!that.$menu.hasClass('els-cascader2-menus-hidden')) {
                    that.method.closeMenu();
                }
                that.$menu.find('.els-cascader2-menu-item-active').removeClass(
                    'els-cascader2-menu-item-active');
                $dom.val('');
                that.$menu.children('.els-cascader2-menu:gt(0)').remove();
            },
            /**
             * @desc 获取控件的value数组
             * @returns value数组
             */
            getValue: function () {
                var arr = [];
                that.$menu.find('.els-cascader2-menu-item-active').each(function () {
                    arr.push($(this).attr('data-value'));
                })
                return arr;
            },
            /**
             * @desc 设置控件value 值
             * @param {Object} valueArr value数组
             */
            setValue: function (valueArr) {
                that.method.selected(valueArr);
            },
            /**
             * @desc 聚焦控件
             */
            focus: function () {
                if (that.$menu.hasClass('els-cascader2-menus-hidden')) {
                    that.method.openMenu();
                }
                return
            },
            /**
             * @desc 取消聚焦控件
             */
            blur: function () {
                if (!that.$menu.hasClass('els-cascader2-menus-hidden')) {
                    that.method.closeMenu();
                }
                return
            },
            /**
             * @desc 获取控件文本内容
             */
            getText: function () {
                return $dom.val();
            },
            /**
             * @desc 控件销毁
             */
            destroy: function () {
                that.$container.remove();
                that.$menu.remove();
                $(document).off('click', that.method.documentClickFn);
                $dom.data('els.cascade2', null);
            }
        }

        /**
         * @desc 控件事件绑定函数
         */
        that.bindEvent = function () {
            that.$container.on({
                'click': function () {
                    if (that.$menu.hasClass('els-cascader2-menus-hidden')) {
                        that.method.openMenu();
                    } else {
                        that.method.closeMenu();
                    }
                    return false;
                },
                'mouseenter': function () {
                    if ('' == $dom.val()) {
                        that.$i.show();
                        that.$clear.hide();
                    } else {
                        that.$i.hide();
                        that.$clear.show();
                    }
                },
                'mouseleave': function () {
                    that.$i.show();
                    that.$clear.hide();
                }
            })

            that.$clear.on('click', function (event) {
                that.callMethod.clear();
                $.els.util.stopPropagation(event);
            })

            that.$menu.on('click', '.els-cascader2-menu-item', function () {
                var $this = $(this);
                var indexArr = $this.attr('data-index').split('-');
                var $parent = $this.closest('.els-cascader2-menu');
                var dataArr = that.method.getData(indexArr);
                $this.addClass('els-cascader2-menu-item-active')
                    .siblings('.els-cascader2-menu-item-active')
                    .removeClass('els-cascader2-menu-item-active');
                $parent.nextAll('.els-cascader2-menu').remove();
                if (!($this.hasClass('els-cascader2-menu-item-expand'))) {
                    that.method.closeMenu();
                }
                that.method.setText();
                that.method.renderHtml(indexArr, dataArr);
                that.opt.onChange.apply($dom, [$this, that.method.getNodeData(indexArr), $this.hasClass('els-cascader2-menu-item-expand')]);
            })

            that.$menu.on('click', function (event) {
                $.els.util.stopPropagation(event);
            })

            $(document).on('click', that.method.documentClickFn);
        }

        that.init();
    }

    var defaultOpt = {
        'defaultValue': [],
        'textJoin': '/',
        'showAllLevels':false,
        'render':{
            'value':'value',
            'label':'label',
            'children':'children'
        },
        onChange: $.noop, //$li, nodeData,isParent
        onPopupVisibleChange: $.noop //state
    }

    $.els.cascader2 = $.els.entry('els.cascade2', cascader2);
})()

/**
 * @file ickeck初始化组件
 * @author fanyue
 * @version 1.0
 */
;
(function () {
    'use strict'
    $.els.check = {
        /**
         * 默认icheck初始化
         * @param {*} selector 选择器字符串
         */
        init: function (selector) {
            var selector = selector || '.els-check';
            $(selector).each(function () {
                var $this = $(this);
                var checkboxClass = $this.attr('data-checkboxClass');
                var radioClass = $this.attr('data-radioClass');
                //var valid = $this.attr('data-valid');
                var options = {};
                options.checkboxClass = checkboxClass ? checkboxClass : 'icheckbox_square-blue';
                options.radioClass = radioClass ? radioClass : 'iradio_square-blue';
                $this.iCheck(options);
                $this.on('ifChanged', function () {
                    // if ('true' == valid) {
                        //$this.closest('form').validate().element($this);
                    // }
                    $.els.util._valid($this);
                })
            })
        },
        /**
         * 默认自定义icheck复选框初始化
         * @param {*} selector 选择器字符串
         */
        initCheckGroup: function (selector){
            var selector = selector || '.els-diy-check-group';
            var buildConfig = function(label){
                return {
                    insert: '<div class="els-diy-check-insert">'+label+'</div>',
                    checkedClass: 'els-diy-check-checked',
                    checkboxClass: 'els-diy-checkbox'
                }
            };

            $(selector).each(function () {
                var $this = $(this);
                var $all = $this.find('.els-diy-check-all');
                var $item = $this.find('.els-diy-check-item');
                //var valid = $this.attr('data-valid');
                $all.iCheck(buildConfig($all.attr('data-label')));
                $all.on('ifToggled',function(){
                    $all.prop('checked') ? $item.iCheck('check') : $item.iCheck('uncheck')
                })
                $item.each(function(){
                    var _$item = $(this);
                    _$item.iCheck(buildConfig(_$item.attr('data-label')));
                    _$item.on('ifToggled',function(){
                        $item.filter(':checked').length == $item.length ? $all.prop('checked', true) : $all.prop('checked',false);
                        $all.iCheck('update');
                        // if (!_$item.closest('form').validate().element(_$item)){
                        //     _$item.closest('.els-form-item').addClass('els-error');
                        // }
                        $.els.util._valid(_$item);
                    })
                })
                if (!$this.hasClass('els-diy-check-group')) $this.addClass('els-diy-check-group');
            })
        },
         /**
         * 默认自定义icheck 单选框初始化
         * @param {*} selector 选择器字符串
         */
        initRadioGroup: function (selector){
            var selector = selector || '.els-diy-radio-group';
            var buildConfig = function (label) {
                return {
                    insert: '<div class="els-diy-radio-insert">' + label + '</div>',
                    checkedClass: 'els-diy-radio-checked',
                    radioClass: 'els-diy-radio'
                }
            }
            $(selector).each(function () {
                var $this = $(this);
                //var valid = $this.attr('data-valid');
                $this.find('.els-diy-radio-item').each(function(){
                    var $item = $(this);
                    $item.iCheck(buildConfig($item.attr('data-label')));
                    $item.on('ifToggled',function(){
                        // if (!$item.closest('form').validate().element($item)){
                        //     $item.closest('.els-form-item').addClass('els-error');
                        // }
                        $.els.util._valid($item);
                    })
                })
                if (!$this.hasClass('els-diy-radio-group')) $this.addClass('els-diy-radio-group');
            })
        },
        destroy:function($dom){
            if ($dom.hasClass('els-diy-radio-group')){
                $dom.find('.els-diy-radio-item').iCheck('destroy');
            } else if ($dom.hasClass('els-diy-check-group')) {
                $dom.find('.els-diy-check-item').iCheck('destroy');
                $dom.find('.els-diy-check-all').iCheck('destroy');
            } else if (/^(radio|checkbox)$/i.test($dom[0].type) && $dom.data('iCheck')) {
                $dom.iCheck('destroy');
            }
        }
    }
    $(function () {
        if ($.fn.iCheck){
            $.els.check.init();
            $.els.check.initCheckGroup();
            $.els.check.initRadioGroup();
        }
    })
})()

/**
 * @file 折叠面板
 * @author fanyue
 * @version 1.0
 */

 ;(function(){
    'use strict'
     var Collapse = function ($dom, options) {
         var that = this;
         $dom.data('els.collapse', that);
         that.opt = $.extend({}, defaultOpt, $.els.defaultConfig.collapse,options);

         that.method = {
             init: function () {
                 that.method.bindEvent();
             },
             bindEvent: function () {
                 /**
                  * @desc collapse头部点击事件绑定
                  */
                 $dom.children('.els-collapse-item').children('.els-collapse-header')
                 .on('click.els.collapse',function(){
                     var $this = $(this);
                     var $item = $this.closest('.els-collapse-item');
                     var $content = $this.next('.els-collapse-content');
                     var hasActive = $item.hasClass('els-collapse-item-active');
                     hasActive ?
                     $item.removeClass('els-collapse-item-active'):
                     $item.addClass('els-collapse-item-active');
                    if (that.opt.accordion){
                        if (hasActive){
                            $content.stop().slideUp(that.opt.time);
                        }else{
                            var _siblings = $item.siblings('.els-collapse-item');
                            _siblings.removeClass('els-collapse-item-active')
                            .children('.els-collapse-content')
                            .stop().slideUp(that.opt.time);
                            $content.stop().slideDown(that.opt.time);
                        }
                    }else{
                        hasActive ?
                        $content.stop().slideUp(that.opt.time):
                        $content.stop().slideDown(that.opt.time);
                    }
                 })
             }
         }



         that.callMethod = {
             destroy:function(){
                 $dom.children('.els-collapse-item').children('.els-collapse-header')
                     .off('click.els.collapse');
                 $dom.removeData('els.collapse');
             }
         }

         that.method.init();
     }


     var defaultOpt = {
         accordion:true,
         time:200
     }

     $.els.collapse = $.els.entry('els.collapse', Collapse);
 })()

/**
 * @file 颜色选择器
 * @author fanyue
 * @version 1.0
 *
 */
;
(function () {
     'use strict'
    //https://github.com/Simonwep/pickr
    $.els.colorPicker = {
        create: function ($dom, options) {
            var instance;
            var opt = $.extend({}, defaultOpt, options);
            var hiddenField = $('<input type=\"hidden\"></input>');
            var theme = $dom.attr('data-theme');
            var name = $dom.attr('name');
            if (name) opt.fieldAttr.name = name;
            if(theme) opt.theme = theme;
            hiddenField.attr(opt.fieldAttr);
            opt.el = $dom.get(0);
            $dom.after(hiddenField);
            instance = Pickr.create(opt);
            instance.hiddenField = hiddenField;
            instance.on('init', function (i) {
                hiddenField.val(i.getSelectedColor().toHEXA().toString());
            })
            instance.on('save', function (HSVaColorObject, PickrInstance) {
                if (HSVaColorObject){
                    hiddenField.val(HSVaColorObject.toHEXA().toString());
                }else{
                    hiddenField.val('');
                }
            })
            return instance;
        }
    }

    var defaultOpt = {
        fieldAttr: {},
        theme: 'monolith',
        container: 'body',
        appClass: 'els-colorPicker',
        showAlways: false,
        strings: {
            save: '保存', // Default for save button
            clear: '清空', // Default for clear button
            cancel: '关闭' // Default for cancel button
        },
        swatches: [
            'rgba(244, 67, 54, 1)',
            'rgba(233, 30, 99, 0.95)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(103, 58, 183, 0.85)',
            'rgba(63, 81, 181, 0.8)',
            'rgba(33, 150, 243, 0.75)',
            'rgba(3, 169, 244, 0.7)',
            'rgba(0, 188, 212, 0.7)',
            'rgba(0, 150, 136, 0.75)',
            'rgba(76, 175, 80, 0.8)',
            'rgba(139, 195, 74, 0.85)',
            'rgba(205, 220, 57, 0.9)',
            'rgba(255, 235, 59, 0.95)',
            'rgba(255, 193, 7, 1)'
        ],
        components: {
            preview: true,
            opacity: true,
            hue: true,

            interaction: {
                input: true,
                clear: true,
                save: true
            }
        }
    }

    $(function () {
        // $('.els-colorPicker').each(function () {
        //     var self = $(this);
        //     var theme = self.attr('data-theme');
        //     theme = theme ? theme : 'monolith';
        //     var name = self.attr('data-name');
        //     var fieldAttr = name ? {
        //         name: name
        //     } : {};
        //     var defaultColor = self.attr('data-color');

        //     var opt = {
        //         theme: theme,
        //         fieldAttr: fieldAttr,
        //     };
        //     if (defaultColor) {
        //         opt['default'] = defaultColor;
        //     }

        //     var instance = $.els.colorPicker.create(self, opt);

        // })
    })

})()

/**
 * @file 时间控件以及自动初始化
 * @author fanyue
 * @version 1.0
 */
;
(function () {
    'use strict'
    $.els.date = {
        /**
         * @desc 时间控件初始化函数
         * @param {string} selector 选择器字符串 不写则默认.els-date
         */
        init: function (selector) {
            var selector = selector || '.els-date';
            $(selector).each(function () {
                var $this = $(this);
                var min = $this.attr('data-min');
                var max = $this.attr('data-max');
                var id = $this.attr('id');
                var value = $this.attr('data-value');
                var range = $this.attr('data-range');
                var type = $this.attr('data-type');
                var done = $this.attr('data-done');
                //var valid = $this.attr('data-valid');
                range = range == 'true' ? true : range;
                var options = {};
                min ? options.min = min : '';
                id ? options.elem = '#' + id : '';
                max ? options.max = max : '';
                value ? options.value = value : '';
                range ? options.range = range : '';
                type ? options.type = type : ''
                var donefn = function () {
                    if (done && window[done] && typeof window[done] == 'function') {
                        window[done].apply(this, arguments);
                    }
                    /**
                     * Class.prototype.tool confirm 点击回调中 done函数比setValue函数更早运行，
                     * 故修改laydaye源码 在最后trigger('focusout')
                     */
                    //'true' == valid && $this.valid();
                    //$this.closest('form').validate().element($this);
                    $.els.util._valid($this);

                }
                options.done = donefn;
                window.laydate.render(options);
            })
        },
        /**
         * @desc 双控件开始结束时间限制
         *       无数据时的默认限制遵循laydate的api说明，因laydaye默认配置在独立作用域名中，故只能查看源码并写死
         * @param {object} s_config 开始配置
         * @param {object} e_config 结束配置
         * @param {boolean} valid 选择时间后是否触发表单效验
         */
        initRange: function (start_config, end_config) {
            var util = $.els.util;
            var start_instance;
            var end_instance;
            var $start;
            var $end;
            // start 配置
            var start_done = $.Callbacks();
            start_done.add(function (value, date, endDate) {
                end_instance.config.min = $.isEmptyObject(date) ? {
                    date: 1,
                    hours: 0,
                    minutes: 0,
                    month: 0,
                    seconds: 0,
                    year: 1900
                } : {
                    year: date.year,
                    month: date.month - 1, //关键
                    date: date.date,
                    hours: date.hours,
                    minutes: date.minutes,
                    seconds: date.seconds
                };
                //if (valid) {
                    // var $startDom = $(start_config.elem);
                    // $startDom.closest('form').validate().element($startDom);
                //}
                $.els.util._valid($start);
            });
            util.hasKey(start_config, 'done') ? start_done.add(start_config.done) : '';
            start_config.done = function () {
                start_done.fireWith(this, arguments);
            }
            delete start_config['range'];
            start_instance = window.laydate.render(start_config);
            //end 配置
            var end_done = $.Callbacks();
            end_done.add(function (value, date, endDate) {
                start_instance.config.max = $.isEmptyObject(date) ? {
                    date: 31,
                    hours: 0,
                    minutes: 0,
                    month: 11,
                    seconds: 0,
                    year: 2099
                } : {
                    year: date.year,
                    month: date.month - 1, //关键
                    date: date.date,
                    hours: date.hours,
                    minutes: date.minutes,
                    seconds: date.seconds
                };
                //if (valid) {
                    // var $endDom = $(end_config.elem);
                    // $endDom.closest('form').validate().element($endDom);
                //}
                $.els.util._valid($end);
            });
            util.hasKey(end_config, 'done') ? end_done.add(end_config.done) : '';
            end_config.done = function () {
                end_done.fireWith(this, arguments);
            }
            delete end_config['range'];
            end_instance = window.laydate.render(end_config);
            // 考虑到手动被清空值,故在click出发前再设置值
            $start = $(start_config.elem);
            $start.data('els.dateRange', start_instance);
            $start.on('mousedown.els.date', function () {
                $end.val() == '' && (start_instance.config.max = {
                    date: 31,
                    hours: 0,
                    minutes: 0,
                    month: 11,
                    seconds: 0,
                    year: 2099
                })
            });
            $end = $(end_config.elem);
            $end.data('els.dateRange', end_instance);
            $end.on('mousedown.els.date', function () {
                $start.val() == '' && (end_instance.config.min = {
                    date: 1,
                    hours: 0,
                    minutes: 0,
                    month: 0,
                    seconds: 0,
                    year: 1900
                });
            });
            return {
                start: start_instance,
                end: end_instance
            }
        },
        /**
         * @desc laydate 销毁方法
         * 参考 https: //fly.layui.com/jie/50980/
         * 个人觉得clone覆盖后实例无法和dom对应算是废除了功能，但是实例终归还在内存里，期待后续解决方式
         * @param {string|obejct} selector 时间空间input框体选择器
         */
        destroy: function (selector) {
            var $dom = $(selector);
            var key = $dom.attr('lay-key');
            key && $('#layui-laydate'+key).remove();
            var $clone = $dom.clone(true).val('').removeAttr('lay-key').off('mousedown.els.date');
            $dom.replaceWith($clone);
        }
    }
    $(function () {

        if (window.laydate){
             // 谷歌新版本浏览器时间框体闪现问题修正
            window.laydate.set({
                trigger: 'click'
            });

            // 自动初始化时间限制控件 此控件无法对初始化参数
            $('.els-date-range').each(function () {
                var $this = $(this);
                var startDom = $this.find('input[data-start]').eq(0);
                var endDom = $this.find('input[data-end]').eq(0);
                var startId = startDom.removeClass('els-date').attr('id');
                var endId = endDom.removeClass('els-date').attr('id');
                var startValue = startDom.val();
                var endValue = endDom.val();
                //var valid = $this.attr('data-valid') == 'true' ? true : false;
                var type = $this.attr('data-type');
                var startOptions = {
                    elem: '#' + startId,
                };
                var endOptions = {
                    elem: '#' + endId,
                }

                //类型设置
                if (type) {
                    startOptions.type = type;
                    endOptions.type = type;
                }

                // 时间先后顺序设置
                if (startValue) {
                    endOptions.min = startValue;
                }

                if (endValue) {
                    startOptions.max = endValue;
                }

                $.els.date.initRange(startOptions, endOptions)
            });
            //自动初始化普通时间控件
            $.els.date.init();
        }
    })
})()

/**
 * @file 下拉菜单
 * @author fanyue
 * @version 1.0
 */
;(function(){
    'use strict'
    var componentIndex = 0;
    var DropDown = function ($dom, options) {
        var that = this;
        $dom.data('els.dropDown', that);
        that.opt = $.extend({}, defaultOpt, $.els.defaultConfig.dropDown ,options);
        that.menu = $dom.find('.els-dropdown-menu');
        that._componentIndex = componentIndex++;
        that.timeout = null;
        that.position = new $.els.position($dom.get(0), that.menu.get(0),{
            placement:['bottom','top'],
            offset:5
        })
        that.method = {
            init: function () {
                that.method.bindEvent();
            },
            hide: function () {
                clearTimeout(that.timeout);
                that.timeout = setTimeout(function () {
                    that.menu.hide();
                }, arguments.length == 0 ? 150 : arguments[0]);
            },
            show:function(){
                clearTimeout(that.timeout);
                that.timeout = setTimeout(function () {
                    that.menu.show();
                    that.position.placement();
                }, arguments.length == 0 ? 150 : arguments[0]);
            },
            bindEvent: function () {
                var event;
                var idle;
                if(that.opt.event == 'hover'){
                    event = 'mouseenter';
                    idle = 150
                    $dom.on('mouseleave.els.dropdown' + that._componentIndex,function(){
                        that.method.hide();
                    });
                    that.menu.on('click.els.dropdown' + that._componentIndex,function(){
                        that.method.hide(0);
                    })
                    that.menu.on('mouseenter.els.dropdown' + that._componentIndex, function () {
                         that.method.show();
                    })

                    $dom.on(event + '.els.dropdown' + that._componentIndex, function (event) {
                        that.method.show(idle);
                        $.els.util.stopPropagation();
                    });

                } else if (that.opt.event == 'click') {
                    event = 'click';
                    idle = 0

                    $(document).on('click.els.dropdown' + that._componentIndex,function(){
                         that.method.hide(0);
                    })

                    that.menu.on('click.els.dropdown' + that._componentIndex, function () {
                        that.method.hide(0);
                        $.els.util.stopPropagation(event);
                    });

                    $dom.on(event + '.els.dropdown' + that._componentIndex, function (event) {
                        that.method.show(idle);
                        $.els.util.stopPropagation();
                    });

                }
            }
        }
        that.callMethod = {
            destroy: function () {
                var event = that.opt.event;
                if (event == 'click') {
                    $(document).off('click.els.dropdown' + that._componentIndex);
                    that.menu.off('click.els.dropdown' + that._componentIndex);
                    $dom.off('click.els.dropdown' + that._componentIndex);
                }else if(event == 'hover'){
                    $dom.off('mouseleave.els.dropdown' + that._componentIndex);
                    that.menu.off('click.els.dropdown' + that._componentIndex);
                    that.menu.off('mouseenter.els.dropdown' + that._componentIndex);
                    $dom.off('mouseenter.els.dropdown' + that._componentIndex);
                }
                $dom.removeData('els.dropDown');
            }
        }
        that.method.init();
    }


    var defaultOpt = {
        event: 'click'
    }

    $.els.dropDown = $.els.entry('els.dropDown', DropDown);


    $(function(){
        $('[data-dropdown]').each(function(){
            var $this = $(this);
            var event = $this.attr('data-dropdown') == 'hover' ?'hover':'click';
            $.els.dropDown($this,{
                event: event
            });
        })
    })
})()


/**
 * @file grid组件
 * @author fanyue
 * @version 1.0
 */
;
(function () {
    'use strict'
    var util = $.els.util;
    $.els.grid = {
        /**
         * @desc jqgrid初始化
         * @param {object} $table
         * @param {object} options
         */
        createGrid: function ($table, options) {
            var that = this;
            var defaultopt = {
                mtype: "POST",
                datatype: "json",
                rowNum: 10,
                rowList: [10, 20, 30],
                height: 100,
                autowidth: false,
                pager: "#gridpage",
                viewrecords: true,
                shrinkToFit: false,
                resizeStop: $.noop,
                gridComplete: $.noop,
                onPaging: $.noop,
                serializeGridData: function (postData) {
                    return postData
                },
                rownumbers: true,
                subGrid: false,
                multiselect: false,
                treeGrid: false,
                cellLayout: 5,
                subGridWidth: 20,
                rownumWidth: 25,
                multiselectWidth: 20,

                // 自定义参数
                elsPager: false, //自定义翻页控件，此处封装在jquery.jqGrid.src.js 内 搜索 fanyue code
                elsShrinkToFit: false, //全自动列宽伸缩方案
                autoRn: true, //全自动自适应序号列宽度 与其他列自适应方案冲突（如shrinkToFit，elsShrinkToFit）
                virtualScrollbar: false, //虚拟滚动条方案 滚动容器只可为body
                validPages: true //回车触发翻页查询前效验有效页码
                // searchForm:'#form',
                // searchBtn:'#search'
            };
            var opt = $.extend({}, defaultopt, $.els.defaultConfig.grid, options);
            var gridComplete = $.Callbacks();
            var resizeStop = $.Callbacks();
            gridComplete.add(function () {
                var $this = $(this);

                if (this.p.autoRn && !this.p.elsShrinkToFit) {
                    autoRNWidth($this);
                }
                /**
                 * 自适应，虽然仅需插件初始化运行一次即可
                 * 但是因为动态修改页面显示条数后， shrinkToFit无法正确保持样式
                 * 故每次数据变更，都重新计算，性能不佳，后期开发可寻找更加合适的方案代替
                 */
                that.full($this);
                if (!$this.data('_firstInit')) { //初次初始化
                    if (opt.virtualScrollbar) {
                        $.els.gridVirtualScrollbar($this);
                    }
                    $this.data('_firstInit', 'true');
                } else {
                    if (opt.virtualScrollbar) {
                        $.els.gridVirtualScrollbar($this, 'synchronization');
                    }
                }
                //参数保存开始

            });
            gridComplete.add(opt.gridComplete);
            resizeStop.add(function () {
                if (opt.virtualScrollbar) { //列宽拖拽后，重置虚拟滚动条
                    $.els.gridVirtualScrollbar($(this), 'synchronization');
                }
            })
            resizeStop.add(opt.resizeStop);
            opt.gridComplete = function () {
                gridComplete.fireWith(this, arguments)
            };
            opt.resizeStop = function () {
                resizeStop.fireWith(this, arguments)
            }
            var onPaging = opt.onPaging;
            opt.onPaging = function () {
                var pgButton = arguments[0];
                /**
                 * 分页input框回车触发 则进行判断
                 * 若翻页页数大于总页数，则跳转到最后一页
                 */
                if (pgButton == 'user' && this.p.validPages) {
                    var $this = $(this);
                    var lastpage = this.p.lastpage;
                    var pageNum = $(this.p.pager).find('input.ui-pg-input').val();
                    pageNum = parseInt(pageNum, 10);
                    pageNum = isNaN(pageNum) ? 1 : pageNum;
                    if (pageNum > lastpage) {
                        $this.setGridParam({
                            page: lastpage
                        }).trigger("reloadGrid");
                        return 'stop'
                    }
                }

                return onPaging.apply(this, arguments);
            }

            var serializeGridData = opt.serializeGridData;
            opt.serializeGridData = function () {
                return serializeGridData.apply(this, arguments);
            }



            //绑定查询表单
            if (util.hasKey(opt, 'searchBtn')) {
                var b = $(opt.searchBtn);
                var f = util.hasKey(opt, 'searchForm') ? $(opt.searchForm) : $(b[0].form);
                b.on('click.els.grid', function (event) {
                    util.preventDefault(event);
                    /**
                     * 此处的setGridParam函数，第二个参数为true 并非jqGrid插件提供的函数 而是私人改动jqGrid，
                     * 改动理由
                     * https://blog.csdn.net/trig_jack/article/details/82842592
                     * 改动方案见下
                     * https://github.com/tonytomov/jqGrid/commit/7cbddd60d59f5efea64cc680e72e165b23445b0e
                     * 关于其他解决方案
                     * https://blog.csdn.net/huangpeng13/article/details/39226337
                     */
                    $table.jqGrid('setGridParam', {
                        postData: f.serializeArray(),
                        page: 1
                    }, true).trigger("reloadGrid");
                });
                opt['postData'] = f.serializeArray();
                if (!util.hasKey(opt, 'url')) {
                    opt['url'] = f.attr('action') || '';
                }
            }

            //树型设置
            if (util.hasKey(opt, '_tree')) { //封装树存在
                var ExpandColumn = opt._tree;
                delete opt['_tree'];
                opt = gridTree(ExpandColumn, opt);
            }

            //  树表格清除rownumbers，避免rownumbers参数不生效，但可能获取到不正确的值
            if (opt.treeGrid) {
                delete opt['rownumbers'];
            }

            //colNames不存在时刻，动态生成
            if (!util.hasKey(opt, 'colNames')) {
                var colNames = [];
                for (var i = 0; i < opt.colModel.length; i++) {
                    var item = opt.colModel[i];
                    if (util.hasKey(item, 'header')) {
                        colNames.push(item['header'])
                    } else if (util.hasKey(item, 'label')) {
                        colNames.push(item['label'])
                    } else if (util.hasKey(item, 'name')) {
                        colNames.push(item['name'])
                    } else if (util.hasKey(item, 'index')) {
                        colNames.push(item['index'])
                    } else {
                        colNames.push('未命名标题' + (i + 1))
                    }
                }
                if (colNames.length == opt.colModel.length) {
                    opt.colNames = colNames;
                }
            }

            //elsShrinkToFit 动态判断列是否根据容器自适应，或者按（设置宽度/默认宽度）进行分配
            if (opt.elsShrinkToFit && !$table.is(':hidden')) {
                opt.treeGrid = util.hasKey(opt, 'treeGrid') ? opt['treeGrid'] : false
                /**
                 * 默认ui-jqgrid左右边框1px，
                 * 动态生成div计算边框宽度也可，但考虑到ui皮肤暂时无改动计划，且开发人员生命周期不为我们所控制，
                 * 很有可能在计算之前，就调用jqgrid初始化，故暂时写死，后续可优化动态计算
                 */
                var warpperWidth = $table.parent().width() - 2;
                var colWidthTotal = 0;
                if (opt.treeGrid == false) {
                    opt.rownumbers && (colWidthTotal += opt.rownumWidth);
                    opt.subGrid && (colWidthTotal += opt.subGridWidth);
                    opt.multiselect && (colWidthTotal += opt.multiselectWidth);
                }
                /**
                 * 循环计算所有列宽度，不传宽度则默认150（150数据来自官方api）
                 * cellLayout也为官方api的数据 为内边距和border宽度合
                 */
                for (var i = 0; i < opt.colModel.length; i++) {
                    var item = opt.colModel[i];
                    if (util.hasKey(item, 'hidden') && (item['hidden'] === true)) { //隐藏列无视，不计算
                        continue;
                    }
                    colWidthTotal += util.hasKey(item, 'width') ? (item['width'] + opt.cellLayout) : (150 + opt.cellLayout)
                }

                opt.shrinkToFit = (colWidthTotal <= warpperWidth)
            }

            return $table.jqGrid(opt);
        },
        /**
         * @desc 根据 table 标签上data-fullType 属性 执行自适应方案
         * @param {Object} $table
         */
        full: function ($table) {
            if ($table.is(':hidden')) {
                return;
            }
            //尝试判断冻结列是否存在，后续研究其对自适应的影响
            // if ($table.closest('.ui-jqgrid').find('.frozen-bdiv').length) {

            // }
            // var option = $table.jqGrid('getGridParam');

            var full = $table.attr('data-fullType');
            if (full) {
                if (full == 'fullPage') {
                    gridLayout['fullPage']($table);
                } else if (full == 'fullWrapper') {
                    gridLayout['fullWrapper']($table, $table.closest('.ui-jqgrid').parent());
                } else if (full == 'fullWidth') {
                    gridLayout['fullWidth']($table, $table.closest('.ui-jqgrid').parent());
                } else if (full == 'fullTab') {
                    gridLayout['fullTab']($table, $table.closest('.els-tab-content-item'));
                } else if (full == 'close') {
                    return
                }
            } else {
                gridLayout['fullPage']($table);
            }

        },
        /**
         * @desc 存在循环表格行，
         * @param {object} $table
         * @param {function} callback 回调函数 包含(id,tr,rowData)
         */
        eachRow: function ($table, callback) {
            callback = callback || $.noop;
            var ids = $table.jqGrid('getDataIDs');
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var tr = $table.jqGrid('getGridRowById', id);
                var rowData = $table.jqGrid('getRowData', id);
                var ret = callback.apply($table, [id, tr, rowData]);
                if (ret === false) {
                    break
                }
            }
        },
        /**
         * @desc 当数据仅一条时默认选中
         * @param {object} $table
         */
        selectOnlyData: function ($table) {
            var records = $table.jqGrid('getGridParam', 'records');
            if (records == 1) {
                var id = ($table.jqGrid('getDataIDs'))[0];
                var $tr = $($table.jqGrid('getGridRowById', id));
                if (!$tr.hasClass('ui-state-highlight')) {
                    $table.jqGrid('setSelection', id)
                }
            }
        },
        /**
         * 销毁
         * @param {object} $table
         */
        destroy: function ($table) {
            if ($table.data('els.gridVirtualScrollbar')) { //销毁自定义虚拟滚动条
                $.els.gridVirtualScrollbar($table, 'destroy');
            }

            var p = $table.get(0).p;
            if (p.elsPager) { //销毁自定义分页
                var pgid = $.jgrid.jqID(ts.p.pager.substr(1));
                var $paginator = $('#' + pgid + "_paginator");
                $paginator.jqPaginator('destroy');
            }

            $table.removeData('_firstInit');
            $table.jqGrid('GridUnload');

        },
        /**
         * 保存postData传输的数据至localStorage
         * @param {string} id table 的id
         */
        setCache: function (id) {
            var key = encodeURIComponent(window.location.href + '#' + id);
            var table = document.getElementById(id);
            // var prmNames = table.p.prmNames;
            var postData = table.p.postData;
            // var postData = {};
            // for (var i in postData) {
            //     var external = true;
            //     for (var j in prmNames) {
            //         if (prmNames[i] !== null && prmNames[j] === i) {
            //             external = false;
            //         }
            //     }
            //     if (external) {
            //         externalData[i] = postData[i];
            //     }
            // }
            localStorage.setItem(key, JSON.stringify(postData));
        },
        /**
         * 从localStorage获取postData传输的数据
         * @param {string} id table 的id
         */
        getCache: function (id) {
            var key = encodeURIComponent(window.location.href + '#' + id);
            return JSON.parse(localStorage.getItem(key));
        }
    }
    /**
     * 树型配置
     */
    var gridTree = function (ExpandColumn, options) {
        var defaultopt = {
            treeGrid: true,
            treeGridModel: "adjacency",
            ExpandColumn: ExpandColumn,
            ExpandColClick: true,
            treeReader: {
                level_field: "level",
                parent_id_field: "parent",
                leaf_field: "leaf",
                expanded_field: "expanded",
            },
            // jsonReader: {
            //     repeatitems: false
            // },
            treeIcons: {
                leaf: 'ui-icon-radio-off'
            }
        };
        options.treeGrid = true;
        return $.extend({}, defaultopt, options);
    }

    /**
     * 宽高自适应代码
     */
    var gridLayout = {
        fullPage: function ($table) {
            // var content = $('.els-content');
            var grid = $table.closest('.ui-jqgrid');
            var state = util.scrollState();
            var gridPH = Math.floor(grid.parent().width());
            var winH = $(window).height();
            // var contentH = content.outerHeight(true);
            var contentH = document.body.scrollHeight;
            var bdiv = $table.closest('.ui-jqgrid-bdiv');
            var bdivH = bdiv.height();
            bdiv.height(Math.floor(bdivH + winH - contentH) - 1);
            $table.jqGrid("setGridWidth", gridPH - 2);
            $("body").css({
                "overflow-x": state.x,
                "overflow-y": state.y
            })
        },
        fullWrapper: function ($table, $content) {
            var state = util.scrollState($content);
            var contentWidth = Math.floor($content.width());
            var contentHeight = Math.floor($content.height());
            var grid = $table.closest('.ui-jqgrid');
            var outerHeight = Math.ceil(grid.outerHeight(true));
            var $bdiv = $table.closest('.ui-jqgrid-bdiv');
            var $bdivHeight = Math.ceil($bdiv.height());
            var toleranceHeight = contentHeight - outerHeight
            $table.jqGrid("setGridWidth", contentWidth - 2);
            $bdiv.height($bdivHeight + toleranceHeight);
            $content.css({
                "overflow-x": state.x,
                "overflow-y": state.y
            })
        },
        fullWidth: function ($table, $content) {
            var state = util.scrollState($content);
            var contentWidth = Math.floor($content.width());
            $table.jqGrid("setGridWidth", contentWidth - 2);
            $content.css({
                "overflow-x": state.x,
                "overflow-y": state.y
            })
        },
        fullTab: function ($table, $content) {
            var state = util.scrollState($content);
            var contentWidth = Math.floor($content.width());
            $table.jqGrid("setGridWidth", contentWidth - 2);
            var cot = $content.offset().top;
            var ch = $content.outerHeight();
            var c_destination = cot + ch;
            var c_void = (ch - $content.height()) / 2;
            var grid = $table.closest('.ui-jqgrid');
            var got = grid.offset().top;
            var gh = grid.outerHeight();
            var g_destination = got + gh;
            var $bdiv = $table.closest('.ui-jqgrid-bdiv');
            var bh = Math.floor($bdiv.height());
            $bdiv.height(bh + Math.floor(c_destination - g_destination) - c_void);
            $content.css({
                "overflow-x": state.x,
                "overflow-y": state.y
            })
        }
    }

    /**
     * @desc 序号列自适应 功能直接对dom操作， 并不能改变jqgrid内部的数据，故shrinkToFit属性会无效
     * @param {object} $table
     */
    var autoRNWidth = function ($table) {
        var p = $table[0].p;
        var grid = $table[0].grid;
        if (!p.rownumbers || p.treeGrid) {
            return;
        }
        var fontSize = parseInt($table.find('.jqgfirstrow').find('td').eq(0).css('font-size').replace(/px/g, '')); //截取字体像素
        var page = $table.jqGrid('getGridParam', 'page');
        var rowNum = $table.getGridParam("rowNum");
        var largest = (rowNum * page).toString(); //计算当前页面出现的序号最大数字
        var width = Math.ceil((largest.length) * (fontSize / 2 + 2)); //数字貌似是汉字大小的一半+1像素

        if ($table[0].p.rownumWidth >= width) {
            return;
        } else {
            grid.cols[0].style.width = width + 'px';
            grid.headers[0].width = width;
            grid.headers[0].el.style.width = width + 'px';
            p.rownumWidth = width;
           p.colModel[0].width = width
        }
    };




    /**
     * @desc 关于虚拟滚动条的类
     */
    var GridVirtualScrollbar = function ($dom) {
        var that = this;
        $dom.data('els.gridVirtualScrollbar', that);
        that.$scrollbarContainer = null;
        that.$scrollbar = null;
        that.$bdiv = $dom.closest('.ui-jqgrid-bdiv');
        that.render = function () {
            that.$scrollbar = $('<div></div>').css({
                height: '1px',
                width: $dom.outerWidth(true)
            });
            that.$scrollbarContainer = $('<div></div>').css({
                width: that.$bdiv.width(),
                position: 'fixed',
                bottom: '0px',
                left: that.$bdiv.offset().left + 'px',
                'overflow-x': 'auto'
            });
            that.$scrollbarContainer.append(that.$scrollbar);
            that.$scrollbarContainer.appendTo('body');
        }

        that.bindEvent = function () {
            that.$scrollbarContainer.on('scroll', function () {
                that.$bdiv.scrollLeft($(this).scrollLeft());
            });
            that.$bdiv.on('scroll', function () {
                that.$scrollbarContainer.scrollLeft($(this).scrollLeft());
            });
            $.els.resizeFn.add(that.callMethod.synchronization);
            $.els.scrollFn.add(that.callMethod.synchronization);
        }

        that.init = function () {
            that.render();
            that.bindEvent();
            that.callMethod.synchronization();
        }
        that.callMethod = {
            /**
             * @desc 重新设置宽高和滚动的距离,并判断滚动条是否显示
             */
            synchronization: function () {
                var offset = that.$bdiv.offset();
                that.$scrollbar.css('width', $dom.outerWidth(true));
                that.$scrollbarContainer.css({
                    width: that.$bdiv.width(),
                    left: offset.left + 'px',
                })
                that.$scrollbarContainer.scrollLeft(that.$bdiv.scrollLeft());
                var scrollTop = $(document).scrollTop();
                var wh = $(window).height();
                var $bdivOffsetTop = offset.top;
                if ($bdivOffsetTop + that.$bdiv.outerHeight(true) > scrollTop + wh) {
                    //直接消失隐藏会导致滚动条归零
                    that.$scrollbarContainer.css('left', offset.left + 'px');
                } else {
                    that.$scrollbarContainer.css('left', '-9999px');
                }
            },
            destroy: function () {
                that.$scrollbarContainer.remove();
                $.els.resizeFn.remove(this.synchronization);
                $.els.scrollFn.remove(this.synchronization);
                $dom.removeData('els.gridVirtualScrollbar');
            }
        }
        that.init();
    }

    $.els.gridVirtualScrollbar = $.els.entry('els.gridVirtualScrollbar', GridVirtualScrollbar)

})()

/**
 * @file http组件
 * @author fanyue
 * @version 1.0
 */
;
(function () {
    'use strict'
    var util = $.els.util;
    $.els.http = {
        /**
         * @desc 返回封装后表单验证插件配置
         * @param {obejct} options 配置项
         */
        validateOpt: function (options) {
            var defaultopt = {
                errorElement: 'span',
                errorClass: 'els-form-error',
                // validClass: 'right',
                onkeyup: function (element) {
                    $(element).valid();
                },
                onfocusout: function (element) {
                    $(element).valid();
                },
                errorPlacement: function (error, element) {
                    var $item = element.closest('.els-form-item');
                    $item.append(error);
                    $item.addClass('els-error');
                },
                success: function () {
                    $(arguments[1]).closest('.els-form-item').removeClass('els-error')
                        .find('span.els-form-error').remove();
                }
            };
            return $.extend({}, defaultopt, $.els.defaultConfig.validate, options);
        },

        validate: function ($form, options) {
            $form.validate(this.validateOpt(options));
        },
        /**
         * @desc 返回封装后表单提交插件配置项
         * @param {obejct} options 配置项
         */
        formsubmitOpt: function (options) {
            var defaultopt = {
                type: 'POST',
                datatype: 'json',
                success: $.noop,
                beforeSubmit: $.noop,
                error: $.noop,
                layer: true,
                content: '是否保存',
                yes: '确定',
                no: '取消',
                title: '提示',
                valid: true,
                loading: true,
                trim: true
            };
            var opt = $.extend({}, defaultopt, $.els.defaultConfig.form, options);
            var beforeSubmit = $.Callbacks();
            var success = $.Callbacks();
            var error = $.Callbacks();
            var _index;

            beforeSubmit.add(function (formData) {
                opt.loading && (_index = util.loading());
                if (opt.trim) {
                    var length = formData.length;
                    for (var i = 0; i < length; i++) {
                        if (typeof formData[i].value == 'string') {
                            formData[i].value = $.trim(formData[i].value)
                        }
                    }
                }
            });
            beforeSubmit.add(opt.beforeSubmit);
            opt.beforeSubmit = function () {
                beforeSubmit.fireWith(this, arguments);
            };

            success.add(function () {
                opt.loading && top.layer.close(_index);
            });
            success.add(opt.success);
            opt.success = function () {
                success.fireWith(this, arguments);
            };

            error.add(function () {
                opt.loading && top.layer.close(_index);
            });
            error.add(opt.error);
            opt.error = function () {
                error.fireWith(this, arguments);
            };
            return opt
        },
        formsubmit: function ($form, options) {
            if (!(options['valid'] === false)) {
                if (!$form.valid()) {
                    return;
                }
            }
            var opt = this.formsubmitOpt(options);
            if (opt.layer) {
                top.layer.confirm(opt.content, {
                    btn: [opt.yes, opt.no],
                    title: opt.title
                }, function (index) {
                    top.layer.close(index);
                    $form.ajaxSubmit(opt);
                }, function (index) {
                    top.close(index);
                });
            } else {
                $form.ajaxSubmit(opt);
            }
        },
        /**
         * @desc ajax 遮罩层，去前后空格 封装
         * @param {obejct} options 配置项
         */
        ajax: function (options) {
            var defaultopt = {
                data: {},
                type: 'post',
                datatype: 'json',
                success: $.noop,
                beforeSend: $.noop,
                complete: $.noop,
                loading: true,
                trim: true
            };
            var opt = $.extend({}, defaultopt, options);
            var beforeSend = $.Callbacks();
            var complete = $.Callbacks();
            var _index;

            beforeSend.add(function () {
                opt.loading && (_index = util.loading());
            });
            beforeSend.add(opt.beforeSend);
            opt.beforeSend = function () {
                beforeSend.fireWith(this, arguments);
            };
            complete.add(function () {
                opt.loading && top.layer.close(_index);
            });
            complete.add(opt.complete);
            opt.complete = function () {
                complete.fireWith(this, arguments);
            };
            if (opt.trim) { // 去前后空格
                if ($.isPlainObject(opt.data)) { //纯粹对象
                    $.each(opt.data, function (key, value) {
                        typeof value == 'string' && (opt.data[key] = $.trim(value));
                    })
                } else if ($.isArray(opt.data)) {
                    $.each(opt.data, function (key, value) {
                        typeof value['value'] == 'string' && (value['value'] = $.trim(value['value']));
                    })
                } else if (typeof opt.data == 'string') {
                    //字符串数据来源不可预测(表单序列化后的空格是特殊符号，而手写的字符串空格就是空格)，暂不支持前后去空格
                    // opt.data = $.map(opt.data.replace(/\+/g, " ").split('&'), function (value) {
                    //     var kvArr = value.split('=');
                    //     typeof kvArr[1] == 'string' && (kvArr[1] = $.trim(kvArr[1]));
                    //     return kvArr.join('=');
                    // }).join('&');
                } else {
                    console.error('data属性数据类型错误');
                    return;
                }
            }
            return $.ajax(opt)
        },
        /**
         * @desc 清空表单 （清空功能总是考虑有限的，特殊页面 特殊需要 届时请开发人员手动封装新方法）
         * @param {*} $dom 清空按钮或form的jquery对象
         */
        clear: function ($dom) {
            var $form = $dom.is('form') ? $dom : $($dom[0].form);
            if (!$form.length) return;
            //普通icheck
            var ickeck = $form.find('.els-check');
            //icheck 组
            var ickeck_group = $form.find('.els-diy-radio-item,.els-diy-check-item,.els-diy-check-all');
            //清空后默认选中的icheck
            var default_check = ickeck.filter('[data-default]');
            //省市区级联
            $form.find('.els-area').each(function () {
                $.els.addressCascade($(this), 'reset');
            });
            //二级联动
            $form.find('.els-cascade-level2').each(function () {
                $.els.cascade($(this), 'reset')
            });
            var validator = $.data($form[0], 'validator');
            if (validator) { // 存在效验，则清空效验错误
                $form.find('div.els-form-item.els-error').removeClass('els-error');
                $form.find('span.els-form-error').remove();
                $form.find('a.fa.els-form-error').tooltip('destroy').remove();
                validator.resetForm();
            } else { //原生清除
                $form[0].reset();
            }
            //icheck默认选中
            default_check.length && default_check.prop('checked', true);
            //icheck更新
            ickeck.length && ickeck.iCheck('update');
            ickeck_group.length && ickeck_group.iCheck('update');
            //清空select2
            $form.find('.els-select2').trigger("change");
            //双时间控件联动
            $form.find('input[data-start],input[data-end]').each(function () {
                var instance = $.data(this, 'els.dateRange');
                if (instance) {
                    instance.config.min = {
                        date: 1,
                        hours: 0,
                        minutes: 0,
                        month: 0,
                        seconds: 0,
                        year: 1900
                    };
                    instance.config.max = {
                        date: 31,
                        hours: 0,
                        minutes: 0,
                        month: 11,
                        seconds: 0,
                        year: 2099
                    }
                }
            });
        },
        /**
         * @desc 表单数据回显 value模式在非原生组件下仅支持（select2，icheck）
         * 面对耦合重的功能时（级联组件），请利用函数模式，判断处理。
         * @param {object} data
         */
        echo: function (data, rules) {
            for (var i in data) {
                if (typeof rules[i] === 'function') {
                    rules[i](i, data[i]);
                } else if (rules[i] === 'value') {
                    var $element = $('[name=\"' + i + '\"]');
                    if ($element.length) {
                        var tag = $element.prop('tagName');

                        if (tag === 'INPUT') { // input
                            var type = $element.prop('type');
                            if (type == /^(text|hidden)$/i.test(type)) {
                                $element.val(data[i]);
                            } else if (/^(radio|checkbox)$/i.test(type)) {
                                var $filter;
                                if ($.isArray(data[i])) {
                                    for (var j = 0, len = data[i].length; j < len; j++) {
                                        $filter = $element.filter('[value=\"' + data[i][j] + '\"]');
                                        $filter.data('iCheck') ? $filter.iCheck('check') : $filter.prop('checked', true);
                                    }
                                } else {
                                    $filter = $element.filter('[value=\"' + data[i] + '\"]')
                                    $filter.data('iCheck') ? $filter.iCheck('check') : $filter.prop('checked', true);
                                }
                            }
                        } else if (tag === 'SELECT') {
                            if ($.isArray(data[i])) {
                                for (var j = 0, len = data[i].length; j < len; j++) {
                                    $element.children('option[value=\"' + data[i][j] + '\"]').prop('selected', true);
                                }
                            } else {
                                $element.children('option[value=\"' + data[i] + '\"]').prop('selected', true);
                            }
                            if ($element.hasClass("select2-hidden-accessible")) {
                                $element.trigger('change');
                            }
                        } else if (tag === 'TEXTAREA') {
                            $element.val(data[i]);
                        }
                    }
                }
            }
        }
    }
})()

/**
 * @file 数字输入框
 * @author fanyue
 * @version 1.0
 */
;
(function () {
    'use strict'
    var InputNumber = function ($dom, options) {
        var that = this;
        $dom.data('els.inputNumber', that);
        that.opt = $.extend({}, defaultOpt, options);
        that.$input = $dom.find('input[type=\"text\"]');
        that.$add = $dom.find('[data-type=\"add\"]');
        that.$reduce = $dom.find('[data-type=\"reduce\"]');
        that.effectiveValue = isNaN(that.opt.value) ? 0 : Number(that.opt.value);

        that.method = {
            init:function(){
                if (that.opt.disabled) that.$input.prop('disabled',true);
                that.$input.val(that.effectiveValue);
                that.method.bindEvent();
            },
            bindEvent:function(){
                that.$input
                .on({
                    // 'input.els.inputNumber':function(){
                    //     that.method.valid(this.value)
                    // },
                    // 'propertychange.els.inputNumber':function(){
                    //     that.method.valid(this.value)
                    // },
                    'blur.els.inputNumber':function(){
                         that.method.valid(this.value)
                    }
                })
                that.$add.on('click.els.inputNumber',function(){
                    if (that.opt.disabled) return false;
                    that.$input.val(that.effectiveValue += that.opt.step);
                })
                that.$reduce.on('click.els.inputNumber',function(){
                    if (that.opt.disabled) return false;
                    that.$input.val(that.effectiveValue -= that.opt.step);
                })
            },
            /**
             * @desc 数字效验方法
             * @param {*} val
             */
            valid:function(val){
                if (!isNaN(val)) {
                    that.effectiveValue = Number(val);
                    that.$input.val(that.effectiveValue);
                }else{
                    that.$input.val(that.effectiveValue);
                }

            }
        }



        that.callMethod = {
        }

         that.method.init();
    }


    var defaultOpt = {
        // change: function (state) {},
        disabled:false,
        max: 'Infinity',
        min: 'Infinity',
        step:1,
        value:0
    }

    $.els.inputNumber = $.els.entry('els.inputNumber', InputNumber);
})()

/**
 * @file 首页布局动画效果组件
 * @author fanyue
 * @version 1.0
 */
;
(function () {
    'use strict'
    var Layout = function ($dom, options) {
        var that = this;
        $dom.data('els.layout', that);
        that.$container = $dom;
        that.opt = $.extend({}, defaultOpt, $.els.defaultConfig.layout, options);
        that.$aside = that.$container.find('.els-sideBar').eq(0);
        that.$main = that.$container.find('.els-main').eq(0);
        that.$header = that.$container.find('.els-header').eq(0);
        that.asideWidth = that.$aside.outerWidth();

        that.method = {
            /**
             * @desc main 动画promise封装
             * @param {object} style 动画结果样式json
             * @returns {object} jquery封装过的promise对象
             */
            // movingHeaderDiv: function (style) {
            //     var def = $.Deferred();
            //     that.$main.stop().animate(style, {
            //         duration: that.opt.duration,
            //         easing: that.opt.easing,
            //         complete: function () {
            //             def.resolve();
            //         }
            //     })
            //     return def.promise();
            // },
            /**
             * @desc main 动画promise封装
             * @param {object} style 动画结果样式json
             * @returns {object} jquery封装过的promise对象
             */
            movingMainDiv: function (style) {
                var def = $.Deferred();
                that.$main.stop().animate(style, {
                    duration: that.opt.duration,
                    easing: that.opt.easing,
                    complete: function () {
                        def.resolve();
                    }
                })
                return def.promise();
            },
            /**
             * @desc aside 动画promise封装
             * @param {bject} style 动画结果样式json
             * @returns {object} jquery封装过的promise对象
             */
            movingAsideDiv: function (style) {
                var def = $.Deferred();
                that.$aside.stop().animate(style, {
                    duration: that.opt.duration,
                    easing: that.opt.easing,
                    complete: function () {
                        def.resolve();
                    }
                })
                return def.promise();
            },
            /**
             * @desc 根据当前实例的状态获取下个状态的样式json对象
             * @param {boolean} b  当前组件状态
             * @return {object} 样式json对象
             */
            getLayoutStyle: function (b) {
                var style = {
                    main: {},
                    aside: {},
                };
                if (b) {
                    style.aside = {
                        left: '0px'
                    }
                    style.main = {
                        "padding-left": that.asideWidth + 'px'
                    }

                } else {
                    style.aside = {
                        left: "-" + that.asideWidth + 'px'
                    }
                    style.main = {
                        "padding-left": '0px'
                    }
                }
                return style;
            }
        }

        /**
         * 函数初始化
         */
        that.init = function () {
            var initialStyle = that.method.getLayoutStyle(that.opt.asideShown);
            that.$aside.css(initialStyle.aside)
            that.$main.css(initialStyle.main);
        }


        that.callMethod = {
            /**
             * @desc 获取当前组件的状态
             * @returns {boolean} 当前组件的状态
             */
            getState: function () {
                return that.opt.asideShown;
            },
            /**
             * @desc 组件动画，根据当前状态 自动切换
             */
            toggle: function () {
                that.opt.asideShown = !that.opt.asideShown;
                var style = that.method.getLayoutStyle(that.opt.asideShown);
                $.when(
                    // that.method.movingHeaderDiv(style.header),
                    that.method.movingAsideDiv(style.aside),
                    that.method.movingMainDiv(style.main)
                ).then(function () {
                    that.opt.complete(that.opt.asideShown);
                })
            },
            /**
             * @desc 销毁事件
             */
            destroy:function(){
                $dom.removeData('els.layout');
            }
        }

        that.init();
    }

    var defaultOpt = {
        asideShown: true,
        duration: 1000,
        easing: 'swing',
        complete: $.noop //state
    }

    $.els.layout = $.els.entry('els.layout', Layout)
})()


/**
 * @file mainFrame
 * @author fanyue
 * @version 1.0
 */

;
(function(){
    'use strict'
    var MainFrame = function ($dom, options) {
        var that = this;
        $dom.data('els.mainFrame', that);
        that.$container = $dom;
        that.opt = $.extend({}, defaultOpt, $.els.defaultConfig.mainFrame, options);
        that.$iframe ;
        that.$crumb;

        that.init = function(){
            var templ = '<div class="els-mainFrame-address"><ul class="els-mainFrame-crumb"><li>'+that.opt.homeName+'</li></ul></div><div class="els-mainFrame-content">' +
                    '<iframe class="els-iframe" src=\"' + that.opt.homeSrc + '\" id="els-iframe" frameborder="0"></iframe></div>'
            that.$container.html(templ);
            that.$iframe = $('#els-iframe');
            that.$crumb = that.$container.find('.els-mainFrame-crumb');
        }

        that.callMethod = {
            /**
             * @desc 根据对象跳转方法
             * @param {Object} route {src,name}
             */
            push: function (route) {
                // that.$iframe.attr('src', 'javascript:void(0)');
                // setTimeout(function(){
                    that.$iframe.attr('src', route.src);
                // },1);
                var str = '';
                $.each(route.name,function(index,item){
                    str += '<li>' + item + '</li>';
                })
                that.$crumb.html(str);
            },
            /**
             * @desc 销毁
             */
            destroy:function(){
                $.els.util.destroyIframe(that.$iframe.get(0));
                $dom.empty();
                $dom.removeData('els.mainFrame');
            }
        }

        that.init();
    }
    var defaultOpt = {
        homeSrc:'',
        homeName:'首页'
    };

    $.els.mainFrame = $.els.entry('els.mainFrame', MainFrame);
})()

/**
 * @file 导航菜单组件
 * @author fanyue
 * @version 1.0
 */
;
(function () {
    'use strict'
    var util = $.els.util;
    var Menu = function ($dom, options) {
        var that = this;
        $dom.data('els.menu', that);
        that.$container = $dom;
        that.opt = $.extend({}, defaultOpt, $.els.defaultConfig.menu, options);
        that.count = 0;
        that.data = {};
        /**
         * 初始化函数
         */
        that.init = function () {
            // that.data = that.method.resolveNodeTree();
            // that.method.bindEvent()
            that.bindEvent();
        };
        /**
         * 事件绑定函数
         */
        that.bindEvent = function () {
            that.$container.on("click.els.menu", '.els-menu-item', function (event) {
                util.preventDefault(event);
                var $this = $(this);
                var submenu = $this.next('.els-submenu');
                var state = submenu.is(':hidden');
                if (state) {
                    $this.addClass('active');
                    //判断是不是非一级菜单
                    // var pSubmenu = $this.closest('.els-submenu');
                    // if (pSubmenu.length) {
                    //     $this.closest('li').siblings().find('.els-submenu-item').removeClass('active');
                    // }
                    submenu.slideDown();
                } else {
                    $this.removeClass('active')
                    submenu.slideUp();
                }

                //手风琴
                if (that.opt.accordion) {
                    var $siblings = submenu.closest('li').siblings();
                    $siblings.find('.els-submenu').slideUp(function () {
                        submenu.find('.els-submenu').hide();
                        submenu.find('.els-menu-item').removeClass('active');
                    });
                    $siblings.find('.els-menu-item').removeClass('active');
                }
                //回调函数
                var arr = that.method.recursiveName($this);
                arr.push($this.find('span').eq(0).text());
                that.opt.openChange.apply(this, [state, arr]);
            });

            that.$container.on("click.els.menu", '.els-submenu-item', function (event) {
                util.preventDefault(event);
                var $this = $(this);
                $this.closest('.els-menu').find('.els-submenu-item').removeClass('active');
                $this.addClass('active');
                // var item = $this.closest('li').siblings().children('.els-menu-item');
                // item.removeClass('active').next('.els-submenu').slideUp();

                var arr = that.method.recursiveName($this);
                arr.push($this.text());
                that.opt.select.apply(this, [arr]);
            });
        }

        that.method = {
            /**
             * 递归标题数组
             * @param {*} dom
             */
            recursiveName: function (dom) {
                var arrName = [];
                var fn = function (dom) {
                    var $submenu = dom.closest('.els-submenu');
                    if ($submenu.length) {
                        var $title = $submenu.prev('.els-menu-item');
                        arrName.unshift($title.find('span').eq(0).text());
                        fn($title);
                    }
                }
                fn(dom);
                return arrName;
            }


        }

        that.callMethod = {
            /**
             * @desc 设置是否启用手风琴模式
             * @param {boolean} b 是否
             */
            setAccordion: function (b) {
                that.opt.accordion = b;
            },
            destroy: function () {
                that.$container.off("click.els.menu");
                $dom.removeData('els.menu');
            }
        }

        that.init();
    }
    var defaultOpt = {
        accordion: true,
        select: function () {},
        openChange: $.noop,
        //openChange: function (state) {}
    };

    $.els.menu = $.els.entry('els.menu', Menu);
})()

!(function () {
    $.alert = function (text, option) {
        if (arguments.length == 1) {
            return top.layer.alert(text, {
                skin: 'els-layer-alert'
            })
        } else if (arguments.length == 2) {
            return top.layer.alert(text, $.extend({}, {
                skin: 'els-layer-alert'
            }, option))
        }
    };
    $.confirm = function () {
        var opt = {
            skin: 'els-layer-confirm'
        };
        var length = arguments.length;
        var argArr = [];
        if (length >= 2) {
            var hasConfig = typeof arguments[1] == 'object';

            if (hasConfig) {
                for (var i = 0; i < length; i++) {
                    var arg = arguments[i];
                    if (i == 1) {
                        argArr.push($.extend({}, opt, arg));
                    } else {
                        argArr.push(arg);
                    }
                }
            } else {
                for (var i = 0; i < length; i++) {
                    argArr.push(arguments[i]);
                }
                argArr.splice(1, 0, opt)
            }

        } else {
            argArr.push(arguments[0]);
            argArr.push(opt);
        }
        return top.layer.confirm.apply(null, argArr);
    };
})();

/**
 * @file iframe弹窗组件
 * @author fanyue
 * @version 1.0
 */
;
(function () {
    'use strict'
    /**
     * @desc 封装post跳转弹出层
     * @param {object} options
     * @returns {number} layer的index
     */
    $.els.modal = function (options) {
        var opt = $.extend({}, defaultOpt, $.els.defaultConfig.modal, options);
        var index;
        var url;
        if ((!$.els.util.isAbsoluteUrl(opt.content)) && (!/^\//.test(opt.content))) {
            var _path = window.location.href;
            opt.content = _path.substring(0, _path.lastIndexOf('/'))
            +'/' + opt.content;
        }
        //判断为post请求 此时先将初始化的iframe src 设置为javascript:void(0)
        if (opt.httpType == 'post') {
            url = opt.content;
            opt.content = 'javascript:void(0)';
        }
        var successFn = opt.success;
        delete opt.success;
        opt.success = function () {
            try {
                //根据success回调函数的参数，找到弹窗内的window对象，并在改对象的$.elsx.origin变量中设置打开改页面的window对象
                var win = arguments[0].find('iframe').prop('contentWindow');
                win.$.elsx.origin = window;
                /**
                 * 子页面的$(document).ready函数将在success函数运行前执行，所以ready函数中无法获取想要的$.elsx.origin对象
                 * 可在ready函数内捆绑事件， 监听$.elsx.origin挂载完成。
                 */
                win.$(win).trigger('originMounted');
            } catch (error) {
                //console.error(error.message);
            }
            successFn.apply(this, arguments);
        }
        index = top.layer.open(opt);
        if (opt.httpType == 'post') {
            //判断为post请求 根据封装的动态表单生成post跳转方法，指向生成弹窗的iframe
            top.$.els.util.post(url, opt.postData, 'layui-layer-iframe' + index);
        }
        return index;
    }

    var defaultOpt = {
        moveOut: false,
        type: 2,
        httpType: 'get',
        resize: false,
        postData: {},
        shadeClose: false,
        shade: false,
        maxmin: true,
        success: $.noop
    }

})()

/**
 * 针对$.els.modal封装代码
 * 提供一定数目的工具方法
 * 解决部分iframe层级之间相互调用时数据交互或方法调用便利
 */

;
(function () {
    'use strict'
    window.$.elsx = {
        store: {},
        origin: '', //打开本页面的窗口的window对象
        data: function () {
            if (arguments.length == 2) {
                try {
                    top.window.$.elsx.store[arguments[0]] = arguments[1]
                } catch (error) {
                    console.error('window.$.elsx.data err');
                }

            } else {
                try {
                    return top.window.$.elsx.store[arguments[0]]
                } catch (error) {
                    return null
                }

            }
        },
        /**
         * 根据设置的id,获取打开网页的window对象
         * @param {number} id
         */
        getWindowById: function (id) {
            try {
                return top.document.getElementById(id).getElementsByTagName('iframe')[0]
                    .contentWindow
            } catch (error) {
                return null
            }
        },
        /**
         * 获取使用modal方法打开本页面的页面的window对象
         */
        getOrigin: function (fn) {
            if (window.$.elsx.origin){
                fn(window.$.elsx.origin)
            }else{
                $(window).on('originMounted',function(){
                    fn(window.$.elsx.origin);
                })
            }
        },
        /**
         * iframe 内部自我关闭
         */
        close:function(){
            var index =  top.layer.getFrameIndex(window.name);
            top.layer.close(index);
        }
    }
})()

/**
 * @desc 级联辅助类
 * @author fanyue
 * @version 1.0
 */

;
(function () {
    'use strict'
    var MyCascader = function (options) {
        var that = this;
        that.opt = $.extend({}, defaultOpt, options);
        that.data;
        that.method = {
            /**
             * @desc 初始化数据格式
             */
            init: function () {
                that.data = $.els._analysis.treeF(that.opt.data, that.opt.render);
                // console.log(that.data)
            },
            /**
             * @desc 根据格式化内置的id 运行含有子级参数的回调函数
             */
            getDataByPid: function (id, callback) {
                var node = that.data[id];
                if (node['_children']) {
                    for (var i = 0; i < node['_children'].length; i++) {
                        callback(that.data[node['_children'][i]]);
                    }
                }
            },
            /**
             * @desc 根据数据，获取从自己到顶级的层级关系
             */
            hierarchy: function (id, callback) {
                var ret = [];
                var recursion = function (_id) {
                    var node = that.data[_id];
                    callback(node)
                    if (node['_pid'] === 0) {
                        return
                    } else {
                        var parentNode = that.data[node['_pid']];
                        recursion(parentNode['_id']);
                    }
                }
                recursion(id)
                return ret;
            }
        }
        that.method.init();
    }

    var defaultOpt = {
        data: [],
        render: {}
    }

    $.els.myCascader = MyCascader;
})()


/**
 * @desc 级联
 * @author fanyue
 * @version 1.0
 */

;
(function () {
    'use strict'
     var componentIndex = 0;
    var Ecascader = function ($dom, options) {
        var that = this;
        $dom.data('els.ecascader', that);
        that._componentIndex = componentIndex++;
        that.opt = $.extend({}, defaultOpt, $.els.defaultConfig.myCascade,options);
        that.myCascader = new $.els.myCascader({
            data: that.opt.data,
            render: that.opt.render
        });
        that.$container = $('<div class="els-ecascader-container">' +
            '<i class="els-ecascader-icon-arrows fa fa-angle-down"></i>' +
            '<i class="els-ecascader-icon-clear fa fa-close" style="display: none;"></i>' +
            '<input type="hidden">'+
            '</div>');
        that.menus = $('<div class="els-ecascader-menu"></div>').appendTo('body');
        that.arrows = null;
        that.clear = null;
        that.hidden = null;
        that.nodeList = []
        that.method = {
            init: function () {
                $dom.after(that.$container);
                that.$container.prepend($dom);
                that.arrows = that.$container.find('.els-ecascader-icon-arrows');
                that.clear = that.$container.find('.els-ecascader-icon-clear');
                that.hidden = that.$container.find('input[type=\"hidden\"]');
                that.hidden.attr(that.opt.fieldAttr);
                that.menus.append(that.method.createMenus(0));
                that.method.bindEvent();
            },
            bindEvent: function () {
                that.$container.on({
                    'click.els.ecascader': function (event) {
                        that.menus.is(':hidden') ? that.method.show() : that.method.hide();
                        $.els.util.stopPropagation(event)
                    },
                    'mouseenter.els.ecascader':function(){
                        if (that.nodeList.length){
                            that.arrows.hide();
                            that.clear.show();
                        }
                    },
                    'mouseleave.els.ecascader':function(){
                        that.arrows.show();
                        that.clear.hide();
                    }
                });

                that.clear.on('click.els.ecascader',function(){
                    that.callMethod.clear();
                    $.els.util.stopPropagation(event);
                });

                that.menus.on('click.els.ecascader', function (event) {
                    $.els.util.stopPropagation(event);
                });

                that.menus.on('click.els.ecascader', '.els-ecascader-menu-item', function (event) {
                    var _this = $(this);
                    var _id = _this.attr('data-id');
                    var nodeList = []
                    if (_this.hasClass('els-ecascader-menu-item-active')) return;
                    if (!_this.hasClass('els-ecascader-menu-item-expand')) {
                        _this.addClass('els-ecascader-menu-item-active')
                            .siblings().removeClass('els-ecascader-menu-item-active')
                        _this.closest('.els-ecascader-menus').nextAll().remove();
                        that.myCascader.method.hierarchy(_id, function (node) {
                            nodeList.unshift(node);
                        })
                        $dom.val(that.opt.displayRender(nodeList));
                        that.method.setHiddenFieldValue(nodeList);
                        that.opt.change.apply($dom, [nodeList]);
                        that.method.hide();

                        return;
                    };
                    _this.closest('.els-ecascader-menus').nextAll().remove();
                    that.menus.append(that.method.createMenus(_id));
                    _this.addClass('els-ecascader-menu-item-active')
                        .siblings().removeClass('els-ecascader-menu-item-active');

                    that.myCascader.method.hierarchy(_id, function (node) {
                        nodeList.unshift(node);
                    });
                    $dom.val(that.opt.displayRender(nodeList));
                    that.method.setHiddenFieldValue(nodeList);

                    that.opt.change.apply($dom, [nodeList]);
                });

                $(document).on('click.els.ecascader' + that._componentIndex, function () {
                    that.method.hide();
                });
            },
            position: function () {
                var offset = that.$container.offset();
                var h = that.$container.outerHeight(true);
                that.menus.css({
                    left: offset.left,
                    top: offset.top + h
                });
            },
            createMenus: function (id, selectedId) {
                var str = '<div class=\"els-ecascader-menus\"><ul>';
                var selectedId = selectedId || -1;
                that.myCascader.method.getDataByPid(id, function (node) {
                    var className = node['_children'] ? ' els-ecascader-menu-item-expand' : '';
                    selectedId === node['_id'] ? className += ' els-ecascader-menu-item-active' : '';
                    str += '<li class=\"els-ecascader-menu-item' + className + '\" data-id=\"' + node._id + '\" data-value=\"' +
                        node[that.opt.render.value] +
                        '\">' +
                        node[that.opt.render.label]
                    '</li>'
                })
                str += '</ul></div>';
                return str;
            },
            show: function () {
                that.method.position();
                that.menus.show();
                that.arrows.addClass('fa-angle-up').removeClass('fa-angle-down');
            },
            hide: function () {
                that.menus.hide();
                that.arrows.addClass('fa-angle-down').removeClass('fa-angle-up');
            },
            targetScroll: function ($self) {
                var position = $self.position();
                var wrapper = $self.closest('ul');
                var wrapperH = wrapper.height();
                var h = $self.outerHeight(true);
                if (h + position.top > wrapperH) {
                    wrapper.scrollTop(position.top + h - wrapperH)
                }
            },
            setHiddenFieldValue: function (nodeList) {
                that.nodeList = nodeList;
                that.hidden.val(that.opt.valueRender(nodeList));
            }
        }

        that.callMethod = {
            setValue: function (value) {
                var id = -1;
                for (var i in that.myCascader.data) {
                    if (that.myCascader.data[i][that.opt.render.value] === value) {
                        id = i;
                        break;
                    }
                }
                if (id != -1) {
                    var menus = that.menus.find('.els-ecascader-menus');
                    var levelMenu = menus.eq(0);
                    var nodeList = [];
                    levelMenu.siblings().remove();
                    that.menus.css({
                        visibility: 'hidden',
                        display: 'block'
                    });
                    that.myCascader.method.hierarchy(id, function (node) {
                        var selectItem;
                        if (node['_pid'] === 0) {
                            selectItem = levelMenu.find('li[data-id=\"' + node['_id'] + '\"]');
                        } else {
                            var newMenus = $(that.method.createMenus(node['_pid'], node['_id']));
                            levelMenu.after(newMenus);
                            selectItem = newMenus.find('li[data-id=\"' + node['_id'] + '\"]');
                        }
                        selectItem.addClass('els-ecascader-menu-item-active')
                            .siblings().removeClass('els-ecascader-menu-item-active');
                        that.method.targetScroll(selectItem);
                        nodeList.unshift(node);
                    });
                    that.menus.css({
                        visibility: 'visible',
                        display: 'none'
                    });
                    $dom.val(that.opt.displayRender(nodeList));
                    that.method.setHiddenFieldValue(nodeList);
                } else {
                    throw new Error("value inexistence");
                }
            },
            getValue: function () {
                return that.nodeList;
            },
            clear:function(){
                var level1 = that.menus.find('.els-ecascader-menus').eq(0);
                level1.find('.els-ecascader-menu-item-active').removeClass('els-ecascader-menu-item-active');
                level1.siblings().remove();
                that.nodeList = [];
                $dom.val('');
                that.hidden.val('');
            },
            destroy:function(){
                that.$container.off('click.els.ecascader');
                that.$container.off('mouseenter.els.ecascader');
                that.$container.off('mouseleave.els.ecascader');
                that.clear.off('click.els.ecascader');
                that.menus.off('click.els.ecascader').remove();
                $(document).off('click.els.ecascader' + that._componentIndex);
                $dom.val('').removeData('els.ecascader');
                that.$container.replaceWith($dom);
            }
        }

        that.method.init();
    }


    var defaultOpt = {
        data:[],
        render: {
            value: 'value',
            label: 'label',
            children: 'children',
        },
        fieldAttr: {},
        displayRender: function (nodeList) {
            var _this = this;
            return $.map(nodeList, function (item) {
                return item[_this.render.label]
            }).join('\/')
        },
        valueRender: function (nodeList) {
            return nodeList[nodeList.length-1].value
        },
        change: $.noop //nodeList
    }


    $.els.ecascader = $.els.entry('els.ecascader', Ecascader);
})()

/**
 * @file 通知提醒
 * @author fanyue
 * @version 1.0
 */

;
(function () {
    // var id = 0;
    var hasContainer = false;
    var $container = false;
    var defaultOpt = {
        time: 2000,
        duration: 400,
        title:'',
        desc:'',
        type: 'info',
        onClose: $.noop
    };

    $.els.notice = function (options) {
        var opt = $.extend({}, defaultOpt, $.els.defaultConfig.notice,options);
        if (!hasContainer) {
            $container = $('<div class=\"els-notice-container\"></div>').appendTo('body');
            hasContainer = true;
        }
        if ($container.is(':hidden')) {
            $container.show();
        }
        var icon = {
            info: 'fa-info-circle',
            warn :'fa-warning',
            success: 'fa-check-circle',
            error: 'fa-bug'

        }
        var dom = $('<div class=\"els-notice\">'
        +
        '<i class=\"els-notice-icon fa ' + icon[opt['type']] + '\"></i>'
        +
        '<i class=\"els-notice-close\">&times;</i>'
        +
        '</div>').appendTo($container);
        var title = $('<div class=\"els-notice-title\">' + opt.title + '</div>');
        var desc = $('<div class=\"els-notice-desc\">' + opt.desc + '</div>');
        dom.append(title);
        dom.append(desc);
        /**
         * @desc notice显示方法
         * @returns {object} jquery promise 对象
         */
        var _show = function () {
            var def = $.Deferred();
            dom.stop().animate({
                left: 0
            }, {
                duration: opt['duration'],
                complete: function () {
                    def.resolve();
                }
            })
            return def.promise();
        };
        /**
         * @desc notice隐藏方法
         * @returns {object} jquery promise 对象
         */
        var _hide = function () {
            var def = $.Deferred();
            dom.stop().animate({
                left: '324px'
            }, {
                duration: opt['duration'],
                complete: function () {
                    def.resolve();

                }
            })
            return def.promise();
        };
        /**
         * @desc notice等待方法
         * @returns {object} jquery promise 对象
         */
        var _wait = function () {
            var def = $.Deferred();
                setTimeout(function () {
                    def.resolve();
                }, opt['time']);

            return def.promise();
        }

        /**
         * @desc 销毁方法
         */
        var _destroy = function(){
            var length = dom.siblings().length;
            dom.remove();
            !length && $container.hide();
        }

        if (!opt['time']){
            _show(dom);
        }else{
            _show(dom).then(_wait).then(_hide).then(function(){
                _destroy();
                opt.onClose()
            })
        }

        //关闭按钮点击事件执行
        dom.find('.els-notice-close').on('click.els.notice',function(){
            _hide().then(function(){
                _destroy();
                opt.onClose()
            })
        })

    }


})()

/**
 * @file 面板
 * @author fanyue
 * @version 1.0
 */
;
(function () {
    'use strict'
    var Panel = function ($dom, options) {
        var that = this;
        $dom.data('els.panel', that);
        that.$btn = $dom.children('.els-panel-head').find('.els-panel-btn').addClass('fa');
        that.$panel = $dom.children('.els-panel-body');
        that.$more = $dom.find('.els-more');
        that.state = that.$panel.is(':visible');

        that.opt = $.extend({}, defaultOpt, options);

        that.method = {
            init: function () {
                if (that.state) {
                    that.$btn.addClass(that.opt.iconMinus).removeClass(that.opt.iconPlus);
                } else {
                    that.$btn.removeClass(that.opt.iconMinus).addClass(that.opt.iconPlus);
                }
                if (that.opt.advancedQuery) {
                    $dom.addClass('els-panel__advanced');
                }

                that.method.bindEvent();
                that.$more.trigger('click.els.panel');
            },
            bindEvent: function () {
                that.$btn.on('click.els.panel', function () {
                    that.callMethod.toggle();
                    that.opt.change(that.state);
                });
                if (that.opt.advancedQuery) {
                    that.$more.on('click.els.panel', function () {
                        var $tr = that.$panel.find('.els-tableStyle-query>tbody>tr:gt(1)')
                        var isHidden = $tr.is(':hidden');
                        if (isHidden) {
                            $tr.show();
                            $(this).find('span').text('收缩').end().find('.fa')
                            .addClass('fa-angle-up').removeClass('fa-angle-down')
                        }else{
                            $tr.hide();
                            $(this).find('span').text('更多').end().find('.fa')
                            .addClass('fa-angle-down').removeClass('fa-angle-up')
                        }
                        that.opt.advancedQueryCallBack.call(this, !isHidden);
                    })
                }
            }
        }

        that.callMethod = {
            /**
             * @desc 获取显示状态
             * @returns {boolean}
             */
            getState: function () {
                return that.state
            },
            /**
             * @desc 状态切换
             */
            toggle: function () {
                that.state ? that.callMethod.hide() : that.callMethod.show();
            },
            /**
             * @desc 显示面板
             */
            show: function () {
                if (that.state) return;
                that.$btn.addClass(that.opt.iconMinus).removeClass(that.opt.iconPlus);
                that.state = true;
                that.$panel.show();
                that.opt.resize && $.els.resizeFn.fire();
                that.opt.callback.call($dom.get(0), that.state);

            },
            /**
             * @desc 隐藏面板
             */
            hide: function () {
                if (!that.state) return;
                that.$btn.removeClass(that.opt.iconMinus).addClass(that.opt.iconPlus);
                that.state = false;
                that.$panel.hide();
                that.opt.resize && $.els.resizeFn.fire();
                that.opt.callback.call($dom.get(0), that.state);
            },
            /**
             * @desc 更新面板状态
             */
            updateState: function () {
                that.state = that.$panel.is(':visible');
            },
            destroy: function () {
                if (that.opt.advancedQuery) {
                    $dom.removeClass('els-panel__advanced');
                    that.$more.off('click.els.panel');
                }
                that.$btn.off('click.els.panel');
                $dom.removeData('els.panel');
            }
        }

        that.method.init();
    }

    var defaultOpt = {
        change: $.noop, //state
        iconPlus: 'fa-angle-double-down',
        iconMinus: 'fa-angle-double-up',
        callback: $.noop,
        advancedQuery: false,
        advancedQueryCallBack: $.noop,
        resize: false

    }

    $.els.panel = $.els.entry('els.panel', Panel);
})()

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+ function ($) {
    'use strict';

    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================

    var Tooltip = function (element, options) {
        this.type = null
        this.options = null
        this.enabled = null
        this.timeout = null
        this.hoverState = null
        this.$element = null
        this.inState = null

        this.init('tooltip', element, options)
    }

    Tooltip.VERSION = '3.3.7'

    Tooltip.TRANSITION_DURATION = 150

    Tooltip.DEFAULTS = {
        animation: true,
        placement: 'top',
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    }

    Tooltip.prototype.init = function (type, element, options) {
        this.enabled = true
        this.type = type
        this.$element = $(element)
        this.options = this.getOptions(options)
        this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
        this.inState = {
            click: false,
            hover: false,
            focus: false
        }

        if (this.$element[0] instanceof document.constructor && !this.options.selector) {
            throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
        }

        var triggers = this.options.trigger.split(' ')

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i]

            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
            } else if (trigger != 'manual') {
                var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin'
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

                this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
                this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
            }
        }

        this.options.selector ?
            (this._options = $.extend({}, this.options, {
                trigger: 'manual',
                selector: ''
            })) :
            this.fixTitle()
    }

    Tooltip.prototype.getDefaults = function () {
        return Tooltip.DEFAULTS
    }

    Tooltip.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options)

        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            }
        }

        return options
    }

    Tooltip.prototype.getDelegateOptions = function () {
        var options = {}
        var defaults = this.getDefaults()

        this._options && $.each(this._options, function (key, value) {
            if (defaults[key] != value) options[key] = value
        })

        return options
    }

    Tooltip.prototype.enter = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type)

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }

        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
        }

        if (self.tip().hasClass('in') || self.hoverState == 'in') {
            self.hoverState = 'in'
            return
        }

        clearTimeout(self.timeout)

        self.hoverState = 'in'

        if (!self.options.delay || !self.options.delay.show) return self.show()

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'in') self.show()
        }, self.options.delay.show)
    }

    Tooltip.prototype.isInStateTrue = function () {
        for (var key in this.inState) {
            if (this.inState[key]) return true
        }

        return false
    }

    Tooltip.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type)

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }

        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
        }

        if (self.isInStateTrue()) return

        clearTimeout(self.timeout)

        self.hoverState = 'out'

        if (!self.options.delay || !self.options.delay.hide) return self.hide()

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'out') self.hide()
        }, self.options.delay.hide)
    }

    Tooltip.prototype.show = function () {
        var e = $.Event('show.bs.' + this.type)

        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e)

            var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
            if (e.isDefaultPrevented() || !inDom) return
            var that = this

            var $tip = this.tip()

            var tipId = this.getUID(this.type)

            this.setContent()
            $tip.attr('id', tipId)
            this.$element.attr('aria-describedby', tipId)

            if (this.options.animation) $tip.addClass('fade')

            var placement = typeof this.options.placement == 'function' ?
                this.options.placement.call(this, $tip[0], this.$element[0]) :
                this.options.placement

            var autoToken = /\s?auto?\s?/i
            var autoPlace = autoToken.test(placement)
            if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

            $tip
                .detach()
                .css({
                    top: 0,
                    left: 0,
                    display: 'block'
                })
                .addClass(placement)
                .data('bs.' + this.type, this)

            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
            this.$element.trigger('inserted.bs.' + this.type)

            var pos = this.getPosition()
            var actualWidth = $tip[0].offsetWidth
            var actualHeight = $tip[0].offsetHeight

            if (autoPlace) {
                var orgPlacement = placement
                var viewportDim = this.getPosition(this.$viewport)

                placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' :
                    placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' :
                    placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' :
                    placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' :
                    placement

                $tip
                    .removeClass(orgPlacement)
                    .addClass(placement)
            }

            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

            this.applyPlacement(calculatedOffset, placement)

            var complete = function () {
                var prevHoverState = that.hoverState
                that.$element.trigger('shown.bs.' + that.type)
                that.hoverState = null

                if (prevHoverState == 'out') that.leave(that)
            }

            $.support.transition && this.$tip.hasClass('fade') ?
                $tip
                .one('bsTransitionEnd', complete)
                .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
                complete()
        }
    }

    Tooltip.prototype.applyPlacement = function (offset, placement) {
        var $tip = this.tip()
        var width = $tip[0].offsetWidth
        var height = $tip[0].offsetHeight

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10)
        var marginLeft = parseInt($tip.css('margin-left'), 10)

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop)) marginTop = 0
        if (isNaN(marginLeft)) marginLeft = 0

        offset.top += marginTop
        offset.left += marginLeft

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
            using: function (props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, offset), 0)

        $tip.addClass('in')

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight

        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight
        }

        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

        if (delta.left) offset.left += delta.left
        else offset.top += delta.top

        var isVertical = /top|bottom/.test(placement)
        var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

        $tip.offset(offset)
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
    }

    Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
        this.arrow()
            .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
            .css(isVertical ? 'top' : 'left', '')
    }

    Tooltip.prototype.setContent = function () {
        var $tip = this.tip()
        var title = this.getTitle()

        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
        $tip.removeClass('fade in top bottom left right')
    }

    Tooltip.prototype.hide = function (callback) {
        var that = this
        var $tip = $(this.$tip)
        var e = $.Event('hide.bs.' + this.type)

        function complete() {
            if (that.hoverState != 'in') $tip.detach()
            if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
                that.$element
                    .removeAttr('aria-describedby')
                    .trigger('hidden.bs.' + that.type)
            }
            callback && callback()
        }

        this.$element.trigger(e)

        if (e.isDefaultPrevented()) return

        $tip.removeClass('in')

        $.support.transition && $tip.hasClass('fade') ?
            $tip
            .one('bsTransitionEnd', complete)
            .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
            complete()

        this.hoverState = null

        return this
    }

    Tooltip.prototype.fixTitle = function () {
        var $e = this.$element
        if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
        }
    }

    Tooltip.prototype.hasContent = function () {
        return this.getTitle()
    }

    Tooltip.prototype.getPosition = function ($element) {
        $element = $element || this.$element

        var el = $element[0]
        var isBody = el.tagName == 'BODY'

        var elRect = el.getBoundingClientRect()
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = $.extend({}, elRect, {
                width: elRect.right - elRect.left,
                height: elRect.bottom - elRect.top
            })
        }
        var isSvg = window.SVGElement && el instanceof window.SVGElement
        // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
        // See https://github.com/twbs/bootstrap/issues/20280
        var elOffset = isBody ? {
            top: 0,
            left: 0
        } : (isSvg ? null : $element.offset())
        var scroll = {
            scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop()
        }
        var outerDims = isBody ? {
            width: $(window).width(),
            height: $(window).height()
        } : null

        return $.extend({}, elRect, scroll, outerDims, elOffset)
    }

    Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? {
                top: pos.top + pos.height,
                left: pos.left + pos.width / 2 - actualWidth / 2
            } :
            placement == 'top' ? {
                top: pos.top - actualHeight,
                left: pos.left + pos.width / 2 - actualWidth / 2
            } :
            placement == 'left' ? {
                top: pos.top + pos.height / 2 - actualHeight / 2,
                left: pos.left - actualWidth
            } :
            /* placement == 'right' */
            {
                top: pos.top + pos.height / 2 - actualHeight / 2,
                left: pos.left + pos.width
            }

    }

    Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
        var delta = {
            top: 0,
            left: 0
        }
        if (!this.$viewport) return delta

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
        var viewportDimensions = this.getPosition(this.$viewport)

        if (/right|left/.test(placement)) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
            }
        } else {
            var leftEdgeOffset = pos.left - viewportPadding
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset
            } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
            }
        }

        return delta
    }

    Tooltip.prototype.getTitle = function () {
        var title
        var $e = this.$element
        var o = this.options

        title = $e.attr('data-original-title') ||
            (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)

        return title
    }

    Tooltip.prototype.getUID = function (prefix) {
        do prefix += ~~(Math.random() * 1000000)
        while (document.getElementById(prefix))
        return prefix
    }

    Tooltip.prototype.tip = function () {
        if (!this.$tip) {
            this.$tip = $(this.options.template)
            if (this.$tip.length != 1) {
                throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
            }
        }
        return this.$tip
    }

    Tooltip.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
    }

    Tooltip.prototype.enable = function () {
        this.enabled = true
    }

    Tooltip.prototype.disable = function () {
        this.enabled = false
    }

    Tooltip.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled
    }

    Tooltip.prototype.toggle = function (e) {
        var self = this
        if (e) {
            self = $(e.currentTarget).data('bs.' + this.type)
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions())
                $(e.currentTarget).data('bs.' + this.type, self)
            }
        }

        if (e) {
            self.inState.click = !self.inState.click
            if (self.isInStateTrue()) self.enter(self)
            else self.leave(self)
        } else {
            self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
        }
    }

    Tooltip.prototype.destroy = function () {
        var that = this
        clearTimeout(this.timeout)
        this.hide(function () {
            that.$element.off('.' + that.type).removeData('bs.' + that.type)
            if (that.$tip) {
                that.$tip.detach()
            }
            that.$tip = null
            that.$arrow = null
            that.$viewport = null
            that.$element = null
        })
    }


    // TOOLTIP PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.tooltip')
            var options = typeof option == 'object' && option

            if (!data && /destroy|hide/.test(option)) return
            if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tooltip

    $.fn.tooltip = Plugin
    $.fn.tooltip.Constructor = Tooltip


    // TOOLTIP NO CONFLICT
    // ===================

    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old
        return this
    }

}(jQuery);


/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+ function ($) {
    'use strict';

    // POPOVER PUBLIC CLASS DEFINITION
    // ===============================

    var Popover = function (element, options) {
        this.init('popover', element, options)
    }

    if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

    Popover.VERSION = '3.3.7'

    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'right',
        trigger: 'click',
        content: '',
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    })


    // NOTE: POPOVER EXTENDS tooltip.js
    // ================================

    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

    Popover.prototype.constructor = Popover

    Popover.prototype.getDefaults = function () {
        return Popover.DEFAULTS
    }

    Popover.prototype.setContent = function () {
        var $tip = this.tip()
        var title = this.getTitle()
        var content = this.getContent()

        $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
        $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
            this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
        ](content)

        $tip.removeClass('fade top bottom left right in')

        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
    }

    Popover.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    }

    Popover.prototype.getContent = function () {
        var $e = this.$element
        var o = this.options

        return $e.attr('data-content') ||
            (typeof o.content == 'function' ?
                o.content.call($e[0]) :
                o.content)
    }

    Popover.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
    }


    // POPOVER PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.popover')
            var options = typeof option == 'object' && option

            if (!data && /destroy|hide/.test(option)) return
            if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.popover

    $.fn.popover = Plugin
    $.fn.popover.Constructor = Popover


    // POPOVER NO CONFLICT
    // ===================

    $.fn.popover.noConflict = function () {
        $.fn.popover = old
        return this
    }

}(jQuery);

!(function () {
    var Position = function (reference, popper, options) {
        var that = this;
        that.opt = $.extend({}, Position.defaultOption, options);
        that.reference = reference;
        that.$reference = $(reference);
        that.popper = popper;
        that.$popper = $(popper);

        that.placement = function () {
            if (that.$popper.is(':hidden') || that.$reference.is(':hidden')) { //隐藏则不计算
                return
            }
            var referenceRect = that.reference.getBoundingClientRect();
            var windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            if (referenceRect.top >= windowHeight || referenceRect.bottom <= 0 ||
                referenceRect.left >= windowWidth || referenceRect.right <= 0) { //不在视野内不计算
                return
            }
            var referenceWidth = that.reference.offsetWidth;
            var referenceHeight = that.reference.offsetHeight;
            var popperWidth = that.popper.offsetWidth;
            var popperHeight = that.popper.offsetHeight;
            var sl = document.documentElement.scrollTop || window.pageYOffset || document.body
                .scrollTop;
            var sw = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
            var offset = that.opt.offset
            var p;
            for (var i = 0, len = that.opt.placement.length; i < len; i++) {
                var item = that.opt.placement[i];
                if (item == 'bottom' && windowHeight - referenceRect.bottom - offset - popperHeight >= 0) {
                    that.$popper.attr('data-placement', item);
                    p = item;
                    var difference_value = referenceWidth - popperWidth;
                    var left;
                    if (difference_value >= 0) {
                        left = sw + referenceRect.left - difference_value / 2
                    } else {
                        var abs_difference_value = Math.abs(difference_value);
                        if (referenceRect.right + abs_difference_value / 2 + offset <= windowWidth &&
                            referenceRect.left - abs_difference_value / 2 - offset >= 0) {
                            left = sw + referenceRect.left - abs_difference_value / 2;
                        } else if (referenceRect.right + popperWidth >= windowWidth) {
                            left = sw + windowWidth - popperWidth - offset;
                        } else if (referenceRect.left - abs_difference_value <= 0) {
                            left = sw + offset
                        }
                    }
                    that.$popper.offset({
                        top: Math.round(sl + referenceRect.bottom + offset),
                        left: Math.round(left)
                    });
                    break;
                }
                if (item == 'top' && referenceRect.top - offset - popperHeight >= 0) {
                    that.$popper.attr('data-placement', item);
                    p = item;
                    var difference_value = referenceWidth - popperWidth;
                    var left;
                    if (difference_value >= 0) {
                        left = sw + referenceRect.left - difference_value / 2
                    } else {
                        var abs_difference_value = Math.abs(difference_value);
                        if (referenceRect.right + abs_difference_value / 2 + offset <= windowWidth &&
                            referenceRect.left - abs_difference_value / 2 - offset >= 0) {
                            left = sw + referenceRect.left - abs_difference_value / 2;
                        } else if (referenceRect.right + popperWidth >= windowWidth) {
                            left = sw + windowWidth - popperWidth - offset;
                        } else if (referenceRect.left - abs_difference_value <= 0) {
                            left = sw + offset
                        }
                    }
                    that.$popper.offset({
                        top: Math.round(sl + referenceRect.top - offset - popperHeight),
                        left: Math.round(left)
                    });
                    break;
                }
                if (item == 'right' && windowWidth - referenceRect.right - offset - popperWidth >= 0) {
                    that.$popper.attr('data-placement', item);
                    p = item;
                    var difference_value = referenceHeight - popperHeight;
                    var top;
                    if (difference_value >= 0) {
                        top = sl + referenceRect.top + difference_value / 2
                    } else {
                        var abs_difference_value = Math.abs(difference_value);
                        if (referenceRect.top - abs_difference_value / 2 - offset >= 0 &&
                            referenceRect.bottom + abs_difference_value / 2 + offset <= windowHeight
                        ) {
                            top = sl + referenceRect.top - abs_difference_value / 2
                        } else if (referenceRect.bottom + abs_difference_value >= windowHeight) {
                            top = sl + windowHeight - popperHeight - offset;
                        } else if (referenceRect.top - abs_difference_value <= 0) {
                            top = sl + offset
                        }
                    }
                    that.$popper.offset({
                        top: Math.round(top),
                        left: Math.round(referenceRect.right + offset)
                    });
                    break;
                }
                if (item == 'left' && referenceRect.left - offset - popperWidth >= 0) {
                    that.$popper.attr('data-placement', item);
                    p = item;
                    var difference_value = referenceHeight - popperHeight;
                    var top;
                    if (difference_value >= 0) {
                        top = sl + referenceRect.top + difference_value / 2
                    } else {
                        var abs_difference_value = Math.abs(difference_value);
                        if (referenceRect.top - abs_difference_value / 2 - offset >= 0 &&
                            referenceRect.bottom + abs_difference_value / 2 + offset <= windowHeight
                        ) {
                            top = sl + referenceRect.top - abs_difference_value / 2
                        } else if (referenceRect.bottom + abs_difference_value >= windowHeight) {
                            top = sl + windowHeight - popperHeight - offset;
                        } else if (referenceRect.top - abs_difference_value <= 0) {
                            top = sl + offset
                        }
                    }
                    that.$popper.offset({
                        top: Math.round(top),
                        left: Math.round(referenceRect.left - offset - popperWidth)
                    });
                    break;
                }
            }
        }



    }

    Position.defaultOption = {
        offset: 10,
        placement: ['bottom', 'top', 'right', 'left'],
        arrow: false
    }

    $.els.position = Position;
})();

/**
 * @file 进度条
 * @author fanyue
 */
;
(function () {
    'use strict'
    var Progress = function ($dom, options) {
        var that = this;
        $dom.data('els.progress', that);
        that.opt = $.extend({}, defaultOpt, $.els.defaultConfig.progress,options);
        that.$bar = null;
        that.$field = null;
        that.percent = that.opt.percent;
        that.init = function () {
            that.$bar = $('<div class=\"els-progress-bar\"></div>').appendTo($dom);
            that.$field = $('<input type=\"hidden\">').appendTo($dom);
            $.els.util.hasKey(that.opt, 'name') && that.$field.attr('name',that.opt['name']);
            that.method.set(that.percent);
        }

        that.method = {
            /**
             * 设置百分比（内部）
             * @param {number} percent
             */
            set: function (percent){
                that.percent = percent;
                that.$field.val(that.opt.fieldFormat(percent));
                that.$bar.css({
                    width: percent.toString()+'%'
                })
            },
            /**
             * @desc 获取百分比（内部）
             * @returns  获取百分比
             */
            get:function(){
                return that.percent;
            }
        }

        that.callMethod = {
            /**
             * @desc 根据值 设置百分比
             * @param {number} percent
             */
            setValue: function (percent){
                that.method.set(percent);
                $dom.triggerHandler($.Event('percentChange'), {
                    percent: percent
                });
                that.opt.change.apply($dom, [percent]);
            },
            /**
             * @desc 获取百分比
             * @returns {number} 百分比
             */
            getValue:function(){
                return that.method.get();
            },
            /**
             * @desc 销毁
             */
            destroy:function(){
                $dom.removeData('els.progress');
                $dom.empty();
            }
        }

        that.init();
    }

    var defaultOpt = {
        percent:0,
        // name:'xxx',
        change: $.noop, //percent
        fieldFormat:function(value){ // 格式化隐藏域
            return value
        }
    }

    $.els.progress = $.els.entry('els.progress', Progress);
})()

/**
 * @file 多标签网页组件
 * @author fanyue
 */
;
(function () {
    'use strict'
    var util = $.els.util;
    var Router = function ($dom, options) {
        var that = this;
        $dom.data('els.router', that);
        that.$container = $dom;
        that.$tabContent = null;
        that.$iframeContent = null;
        that.$tool = null;
        that.$tabWarpper = null;
        that.opt = $.extend({}, defaultOpt, $.els.defaultConfig.router, options);
        that.method = {
            /**
             * @desc 根据jquery的tab的对象判断是否为当前选中
             * @param {object} $tab jquery 的tab对象
             * @returns {boolean}  是否选中
             */
            isCurrent: function ($tab) {
                return $tab.hasClass('els-router-active')
            },
            /**
             * @desc 切换显示jquery的tab, iframe对象
             * @param {object} $tab jquery 的tab对象
             * @param {object} $iframe jquery 的iframe对象
             */
            toggleView: function ($tab, $iframe, callback) {
                var fn = callback || $.noop;
                $tab.addClass('els-router-active').siblings().removeClass('els-router-active');
                $iframe.fadeIn(function () {
                    fn();
                    try {
                        $iframe.prop("contentWindow").$.els.resizeFn.fire();
                    } catch (error) {}
                }).siblings().hide();
            },
            /**
             * @desc 创建标签页 并返回
             * @param {string} url 地址
             * @param {string} text 文字
             */
            createView: function (url, text) {
                var id = this.hx(url);
                var $tabDom = $('<li data-src=\"' + url + '\" data-id=\"' + id + '\" title=\"' + text + '\">' + text + '<i>&times;</i></li>');
                var $iframeDom = $('<iframe src=\"' + url + '\" frameborder="0"></iframe>');
                that.$tabContent.append($tabDom);
                that.$iframeContent.append($iframeDom);
                return {
                    tab: $tabDom,
                    iframe: $iframeDom
                }
            },
            /**
             * @desc 根据url 获取标签页jquery tab对象
             * @param {string} url 地址
             * @returns {object} jquery tab对象
             */
            getTargetTab: function (url) {
                var id = this.hx(url);
                return that.$tabContent.find('[data-id=\"' + id + '\"]')
            },
            /**
             * @desc 根据url 获取标签页iframe
             * @param {string} url 地址
             * @returns {object} jquery iframe对象
             */
            getTargetIframe: function (url) {
                return that.$iframeContent.find('iframe[src=\"' + url + '\"]')
            },
            limit: function () {
                return that.opt.limit <= that.$iframeContent.find('iframe').length;
            },
            hx: function (url) {
                var id;
                if (!that.opt.identifyParam) {
                    if (url.indexOf("?") != -1) {
                        id = url.split("?")[0];
                    } else {
                        id = url;
                    }
                } else {
                    id = url;
                }
                return id
            }
        };

        that.callMethod = {
            /**
             * @desc 获取当前选中的选项卡jquery对象
             * @returns 选项卡jquery对象
             */
            getCurrent: function () {
                return that.$tabContent.find('.els-router-active').eq(0);
            },
            /**
             * @desc 根据参数跳转或生成标签页
             * @param {Object} param {url,text} 地址 标题 对象
             */
            push: function (param) {
                var url = param['url'];
                if (!url) {
                    return
                }
                var text = param['text'];
                var $targetTab = that.method.getTargetTab(url);

                if ($targetTab.length) { //已存在
                    $.els.adaptiveRolling(that.$tabWarpper, 'light', $targetTab);
                    if (that.method.isCurrent($targetTab)) {
                        return
                    } else {
                        var $targetIframe = that.method.getTargetIframe(url)
                        that.method.toggleView($targetTab, $targetIframe);
                    }

                } else { //不存在
                    if (that.method.limit()) {
                        layer.msg("选项卡数量已达上限", {
                            icon: 5
                        });
                        return
                    }
                    var $domObj = that.method.createView(url, text);
                    that.method.toggleView($domObj.tab, $domObj.iframe);
                    $.els.adaptiveRolling(that.$tabWarpper, 'toEarth');
                }
            },
            /**
             * @desc 根据地址关闭选项卡
             * @param {string|object} param 地址 || $tab
             */
            close: function (param) {
                var $tab;
                var $iframe;
                if (typeof param == "string") {
                    $tab = that.method.getTargetTab(param);
                    $iframe = that.method.getTargetIframe(param);
                } else {
                    $tab = param;
                    $iframe = that.method.getTargetIframe($tab.attr('data-src'));
                }
                if ($tab.hasClass('els-router-home')) {
                    return
                }
                //$iframe.attr('src', 'javascript:void(0)').remove();
                util.destroyIframe($iframe[0]);
                if (that.method.isCurrent($tab)) { //关闭的是当前打开的  则切换 移除后不做处理
                    var $prevTab = $tab.prev();
                    var prevUrl = $prevTab.attr('data-src');
                    var $prevIframe = that.method.getTargetIframe(prevUrl);
                    that.method.toggleView($prevTab, $prevIframe);
                }
                var isLast = $tab.next().length;
                $tab.remove();
                if (!isLast) {
                    $.els.adaptiveRolling(that.$tabWarpper, 'toEarth');
                }

            },
            /**
             * @desc 根据地址关闭其他的选项卡（ els-router-home除外）
             * @param {string|object} param 地址 || $tab
             */
            closeSiblings: function (param) {
                var $tab;
                var $iframe;
                if (typeof param == "string") {
                    $tab = that.method.getTargetTab(url);
                    $iframe = that.method.getTargetIframe(url);
                } else {
                    $tab = param;
                    $iframe = that.method.getTargetIframe($tab.attr('data-src'));
                }

                $tab.siblings(':not(.els-router-home)').remove();
                //$iframe.siblings(':not(.els-router-home)').attr('src', 'javascript:void(0)').remove();
                $iframe.siblings(':not(.els-router-home)').each(function(){
                    util.destroyIframe(this);
                })
                if (!that.method.isCurrent($tab)) {
                    that.method.toggleView($tab, $iframe);
                }
            },
            /**
             * @desc 关闭所有选项卡（els-router-home除外）
             */
            closeAll: function () {
                that.$tabContent.find('li:not(.els-router-home)').remove();
                //that.$iframeContent.find('iframe:not(.els-router-home)').attr('src', 'javascript:void(0)').remove();
                that.$iframeContent.find('iframe:not(.els-router-home)').each(function(){
                    util.destroyIframe(this);
                })
                var $tab = that.$tabContent.find('li.els-router-home').eq(0);
                if (!that.method.isCurrent($tab)) {
                    var $iframe = that.$iframeContent.find('iframe.els-router-home').eq(0);
                    that.method.toggleView($tab, $iframe);
                }
            },
            /**
             * @desc 根据url 刷新iframe内网页
             * @param {string} url 地址
             */
            reload: function (url) {
                var $iframe = that.method.getTargetIframe(url);
                if ($iframe.length) {
                    try {
                        $iframe.prop('contentWindow').location.reload();
                    } catch (error) {}
                }
            },
            resize: function () {
                $.els.adaptiveRolling(that.$tabWarpper, 'resize');
            },
            destroy: function () {
                $.els.adaptiveRolling(that.$tabWarpper, 'destroy');
                that.$iframeContent.find('iframe').each(function(){
                    util.destroyIframe(this);
                });
                $dom.empty();
                $dom.removeData('els.router');
            }
        }

        that.bindEvent = function () {
            //选项卡点击事件
            that.$tabContent.on('click.els.router', 'li', function () {
                that.opt.click.apply(this)
                var $this = $(this);
                if (that.method.isCurrent($this)) {
                    return;
                } else {
                    var $iframe = that.method.getTargetIframe($this.attr('data-src'));
                    that.method.toggleView($this, $iframe, $.proxy(that.opt.toggle, this));
                }
            });

            //选项卡关闭事件
            that.$tabContent.on('click.els.router', 'li>i', function (event) {
                util.stopPropagation(event);
                // if (!that.opt.beforeClose.apply(this)){
                //     return;
                // }
                that.callMethod.close($(this).parent())
            });

            //选项卡工具栏悬停事件
            that.$tool.hover(function () {
                $(this).children('.els-router-menu').show();
            }, function () {
                $(this).children('.els-router-menu').hide();
            })

            var _TOOLMETHOD = {
                "SELF": function () {
                    that.callMethod.close(that.callMethod.getCurrent());
                },
                "SIBLINGS": function () {
                    that.callMethod.closeSiblings(that.callMethod.getCurrent());
                    $.els.adaptiveRolling(that.$tabWarpper, 'resize');
                },
                "ALL": function () {
                    that.callMethod.closeAll();
                    $.els.adaptiveRolling(that.$tabWarpper, 'resize');
                },
                "RELOAD": function () {
                    that.callMethod.reload(that.callMethod.getCurrent().attr('data-src'));
                }
            }

            that.$tool.find('a').on('click.els.router', function (event) {
                util.stopPropagation(event);
                var type = $(this).attr('data-type')
                _TOOLMETHOD[type]();
            })

            that.$container.find('.els-router-angle').on('click.els.router', function () {
                $.els.adaptiveRolling(that.$tabWarpper, $(this).attr('data-type'));
            })
        }

        that.init = function () {
            that.$container.append('<div class="els-router-header"><div class="els-router-tool">' +
                '<i class="fa fa-bars"></i>' +
                '<div class="els-router-menu">' +
                '<ul>' +
                '<li>' +
                '<a href="javascript:void(0)" data-type="SELF">关闭当前</a>' +
                '<a href="javascript:void(0)" data-type="SIBLINGS">关闭其他</a>' +
                '<a href="javascript:void(0)" data-type="ALL">关闭所有</a>' +
                '<a href="javascript:void(0)" data-type="RELOAD">刷新当前</a>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '<i class="fa fa-angle-double-left els-router-angle" data-type="toR"></i>' +
                '<i class="fa fa-angle-double-right els-router-angle" data-type="toL"></i>' +
                '<div class="els-router-panel"><ul></ul></div></div>' +
                '<div class="els-router-content"></div>');
            that.$tabWarpper = that.$container.find('.els-router-panel');
            that.$tabContent = that.$tabWarpper.find('ul');
            that.$iframeContent = that.$container.find('.els-router-content');
            that.$tool = that.$container.find('.els-router-tool');
            if ('' != that.opt.homeUrl) {
                var url = that.opt.homeUrl;
                var id = that.method.hx(url);
                var $homeTab = $('<li class="els-router-home els-router-active" data-src=\"' + url + '\" data-id=\"' + id + '\" title=\"主页\">' +
                    '<em class="fa fa-home els-router-home-icon"></em></li>');
                var $homeIframe = $('<iframe class="els-router-home" src=\"' + url + '\" frameborder="0"></iframe>');
                that.$tabContent.append($homeTab);
                that.$iframeContent.append($homeIframe);
            }
            var testLi = $('<li style=\"visibility:hidden;\"></li>').appendTo(that.$tabContent);
            $.els.adaptiveRolling(that.$tabWarpper, {
                cw: testLi.outerWidth(),
                fw: that.$tabContent.find('.els-router-home').outerWidth()
            });
            testLi.remove();
            that.bindEvent();
        }

        that.init();
    }

    var defaultOpt = {
        limit: 5,
        identifyParam: true,
        homeUrl: '',
        toggle: $.noop, //li
        click: $.noop, //li
    }

    $.els.router = $.els.entry('els.router', Router);
})()


;
(function () {
    'use strict'
    /**
     * @desc 这个构造器目的为生成可以根据标签页滚动组件实例
     * @param {*} $dom
     * @param {*} options
     */
    var AdaptiveRolling = function ($dom, options) {
        var that = this;
        $dom.data('els.adaptiveRolling', that);
        that.opt = $.extend({}, defaultOpt, options);
        that.$content = $dom.find(that.opt.content);
        that.warpperWidth = 0;
        that.contentWidth = 0;
        that.left = 0;
        that.$distanceArr = [];
        that.init = function () {
            that.callMethod.setStore();
            that.bindEvent();
        }

        that.method = {
            /**
             * @desc 获取所有标签页的宽度总和
             */
            getItemWidth: function () {
                var $list = that.$content.find(that.opt.item);
                var length = $list.length;
                that.$distanceArr = [];
                for (var i = 0; i < length; i++) {
                    if (i == 0) {
                        var start = 0;
                        var end = that.opt.hw;
                    } else {
                        var start = (i - 1) * that.opt.cw + that.opt.fw;
                        var end = start + that.opt.cw
                    }
                    that.$distanceArr.push([start, end])
                }
                that.contentWidth = (length - 1) * that.opt.cw + that.opt.fw;
            },
            /**
             * @desc 根据left值 设置滚动标签页容器
             * @param {string} left
             */
            setLeft: function (left) {
                var left = left || '0px';
                that.$content.css('left', left);
                that.left = parseInt(left.replace(/px/g, ''));
            }
        }

        that.callMethod = {
            /**
             * @desc 容器向右滚动
             */
            toR: function () {
                this.setStore();
                if (that.contentWidth <= that.warpperWidth) {
                    that.method.setLeft();
                } else {
                    var hiddenW = -that.left;
                    if (hiddenW <= that.warpperWidth) {
                        that.method.setLeft();
                    } else {
                        var pageNo = (hiddenW - (hiddenW % that.warpperWidth)) / that.warpperWidth;
                        var s = hiddenW - pageNo * that.warpperWidth + that.opt.cw;
                        var l = that.$distanceArr.length;
                        var t = null;
                        for (var i = 0; i < l; i++) {
                            var item = that.$distanceArr[i];
                            if (s >= item[0] && s <= item[1]) {
                                if (s == item[1]) {
                                    if (i + 1 < l) {
                                        t = that.$distanceArr[i + 1][0];
                                    }
                                } else {
                                    t = item[0]
                                }
                                break;
                            }
                            continue;
                        }
                        if (t) {
                            that.method.setLeft('-' + t + 'px');
                        }
                    }
                }
            },
            /**
             * @desc 容器向左滚动
             */
            toL: function () {
                this.setStore();
                if (that.contentWidth <= that.warpperWidth) {
                    that.method.setLeft();
                } else {
                    var s = that.warpperWidth - that.left;
                    var t = null;
                    var l = that.$distanceArr.length;
                    for (var i = 0; i < l; i++) {
                        var item = that.$distanceArr[i];
                        if (s >= item[0] && s <= item[1]) {
                            if (s == item[1]) {
                                if (i + 1 < l) {
                                    t = that.$distanceArr[i + 1][0];
                                }
                            } else {
                                t = item[0]
                            }
                            break;
                        }
                        continue;
                    }
                    if (t) {
                        that.method.setLeft('-' + t + 'px');
                    }
                }
            },
            /**
             * @desc 标签页变化的时候 保证最新出现的标签页标题在视图中的方法
             */
            toEarth: function () {
                this.setStore();
                if (that.contentWidth <= that.warpperWidth) {
                    that.method.setLeft();
                } else {
                    that.method.setLeft('-' + (that.contentWidth - that.warpperWidth) + 'px');
                }
            },
            /**
             * @desc 目标标签页，滚动显示到视图中
             * @param {object} item 目标标签页标题
             */
            light: function (item) {
                this.setStore();
                if (that.contentWidth <= that.warpperWidth) {
                    that.method.setLeft();
                } else {
                    var itemL = item.position().left;
                    var l = that.$distanceArr.length;
                    var t = null;
                    for (var i = 0; i < l; i++) {
                        var item = that.$distanceArr[i];
                        if (itemL >= item[0] && itemL <= item[1]) {
                            if (itemL == item[1]) {
                                if (i + 1 < l) {
                                    t = that.$distanceArr[i + 1][0];
                                }
                            } else {
                                t = item[0]
                            }
                            break;
                        }
                        continue;
                    }
                    if (t) {
                        that.method.setLeft('-' + t + 'px');
                    }
                }
            },
            /**
             * @desc 更新容器大小，标签页标题总长度
             */
            setStore: function () {
                that.warpperWidth = $dom.width();
                that.method.getItemWidth();
            },
            /**
             * @desc 刷新页面标签页滚动状态 宽度重新计算，容器滚动归0
             */
            resize: function () {
                that.callMethod.setStore();
                that.method.setLeft();
            },
            destroy: function () {
                $.els.resizeFn.remove(that.callMethod.resize);
                $dom.removeData('els.adaptiveRolling');
            }
        }

        that.bindEvent = function () {
            $.els.resizeFn.add(that.callMethod.resize);
        }

        that.init();
    }

    var defaultOpt = {
        content: 'ul',
        item: 'li',
        cw: 120,
        fw: 40
    }

    $.els.adaptiveRolling = $.els.entry('els.adaptiveRolling', AdaptiveRolling)
})();

/**
 * @file 下拉多选 废弃不再维护
 * @author fanyue
 * @version 1.0
 */
;
(function () {
    'use strict'
    var util = $.els.util;
    var componentIndex = 0;
    var Select = function ($dom, options) {
        var that = this;
        $dom.data('els.select', that);
        that.$input = $('<input type=\"text\" readonly>');
        that.opt = $.extend({}, defaultOpt, $.els.defaultConfig.select, options);
        that.$menu = null;
        that.$ul = null;
        that._componentIndex = componentIndex++;

        that.method = {
            /**
             * @desc 初始化组件方法
             */
            init:function(){
                $dom.addClass('els-multisel-hidden');
                $dom.after(that.$input);
                that.$input.css(that.opt.inputStyle);
                that.$menu = $.els._dom.createMenu().addClass('els-multisel');
                that.$ul = that.$menu.children('ul').addClass('els-multisel-list');
                if(that.opt.value.length){
                    if (that.opt.value.length > that.opt.size && that.opt.size!=0){
                        throw new Error('value limitation of length ');
                    }else{
                        that.callMethod.setValue(that.opt.value);
                    }
                }else{
                    that.method.render();
                    that.method.changeView();
                }

                that.method.bindEvent();
            },
            /**
             * @desc 渲染选项
             */
            render:function(){
                that.$ul.empty();
                $dom.empty();
                var len = that.opt.data.length;
                for(var i = 0;i<len;i++){
                    var item = that.opt.data[i];
                    var $li = $('<li class=\"els-multisel-item\">'+
                        '<a>' + item.label+'</a>'
                    +'</li>').appendTo(that.$ul)
                    var $option = $('<option value=\"' + item.value + '\">' + item.label + '</option>').appendTo($dom);
                    $li.data('els.select.item', item);
                    if (item['_selected'] === true) {
                        $li.addClass('els-active');
                        $option.prop('selected',true);
                    }
                }
            },
            /**
             * @desc 绑定事件
             */
            bindEvent:function(){
                //文本框绑定按下状态切换事件
                that.$input.on('mousedown.els.select.' + that._componentIndex, function () {
                    that.callMethod.toggle();
                    return false
                });

                // 选项点击函数
                that.$ul.on('click.els.select.' + that._componentIndex, '.els-multisel-item', function () {
                    var $this = $(this);
                    var itemData = $this.data('els.select.item');
                    if (itemData['_selected'] === true){
                        itemData['_selected'] = false;
                        $this.removeClass('els-active');
                        $dom.find('option[value=\"' + itemData.value + '\"]').prop('selected',false);
                    }else{
                        if (that.opt.size != 0 && that.callMethod.getValue().length >= that.opt.size) {
                            return;
                        }
                        itemData['_selected'] = true;
                        $this.addClass('els-active')
                        $dom.find('option[value=\"' + itemData.value + '\"]').prop('selected', true);
                    }
                    $dom.trigger('selectChange', itemData)
                })

                //给document绑定mousedown事件 控件隐藏函数
                $(document).on('mousedown.els.select.' + that._componentIndex, function () {
                    that.callMethod.hide();
                });

                //控件本身 mousedown事件 不向上冒泡。
                that.$menu.on('mousedown', function (event) {
                    util.stopPropagation(event);
                })

                //控件自定义选择变化事件
                $dom.on('selectChange', function (event, itemData){
                    that.method.changeView();
                    that.opt.select.apply($dom, [itemData]);
                })
            },
            /**
             * @desc 根据控件位置 渲染菜单部分的位置
             */
            getStyle:function () {
                var size = $.els._dom.getBoundingClientRect(that.$input);
                that.$menu.css({
                    top: size.top + size.height,
                    left: size.left,
                    minWidth: size.width
                })
            },
            /**
             * @desc 获取选中数据的数组
             * @param {function} callback 便利获取时的回调函数
             * @returns {array} 选中数据的数组
             */
            getSelectList:function(callback){
                var len = that.opt.data.length;
                var arr = [];
                for (var i = 0; i < len; i++) {
                    var item = that.opt.data[i];
                    if (item['_selected']){
                        if (typeof callback == 'function') {
                            callback(item);
                        }
                        arr.push(item);
                    }

                }
                return arr;
            },
            /**
             * @desc 根据控件选中的数据 更新文本框的视图
             */
            changeView:function(){
                var str = '';
                that.method.getSelectList(function(item) {
                    str += item.label + ',';
                })
                str = str.substring(0,str.length-1);
                that.$input.val(str);
            }
        }



        that.callMethod = {
            /**
             * @desc 显示菜单栏
             */
            show: function () {
                if (!that.$menu.is(':hidden')) {
                    return
                }
                that.method.getStyle();
                that.$menu.show();
            },
            /**
             * @desc 隐藏菜单栏
             */
            hide: function () {
                that.$menu.hide();
            },
            /**
             * @desc 菜单栏状态切换
             */
            toggle: function () {
                if (that.$menu.is(':hidden')) {
                    that.callMethod.show();
                } else {
                    that.callMethod.hide();
                }
            },
            /**
             * @desc 获取菜单是否为显示状态
             */
            isShow: function () {
                return !that.$menu.is(':hidden') ? true : false;
            },
            /**
             * @desc 设置选中值
             * @param {object} arr 选中项的value数组
             */
            setValue: function (arr) {

                var len = that.opt.data.length;
                for (var i = 0; i < len;i++){
                    var item = that.opt.data[i];
                    if (-1 == arr.indexOf(item.value)){
                        item['_selected'] = false;
                    }else{
                        item['_selected'] = true
                    }
                }
                that.method.render();
                that.method.changeView();
            },
            /**
             * @desc 返回选中值
             * @returns 返回选中项value数组
             */
            getValue: function () {
                return !$dom.val() ? [] : $dom.val();
            },
            /**
             * @desc 摧毁
             */
            destroy:function(){
                $(document).off('mousedown.els.select.' + that._componentIndex);
                that.$input.off('mousedown.els.select.' + that._componentIndex);
                that.$ul.find('.els-multisel-item').each(function(){
                    $(this).removeData("els.select.item");
                });
                that.$menu.remove();
                that.$input.val('');
                $dom.removeData('els.select');
            }
        }

        that.method.init();
    }

    var defaultOpt = {
        data: [],
        inputStyle: {

        },
        value:[],
        select: $.noop, //itemData
        size:0
    }
    $.els.select = $.els.entry('els.select', Select);
})()

/**
 * @file 无限select
 * @author fanyue
 * @version 1.0
 */
;(function () {
    'use strict'
    var SelectGroup = function ($dom, options) {
        var that = this;
        $dom.data('els.selectGroup', that);
        that.opt = $.extend({}, defaultOpt, $.els.defaultConfig.selectGroup,options);

        that.method = {
            init: function () {
                $dom.empty().append(that.opt.defaultOption);
                that.method.bindEvent();
            },
            bindEvent: function () {
                if (that.opt.p_selecror){ // 存在父级
                    var $p_select = $(that.opt.p_selecror);
                    $p_select.on('change.els.selectGroup',function(){
                        $dom.get(0).options.length = 1;
                        var value = $p_select.val();
                        var label = $p_select.find("option:selected").text();
                        if(value == "-1") {
                            $dom.trigger('change.els.selectGroup');
                            return
                        }
                        $dom.trigger('change.els.selectGroup');
                        that.method.promise(value, label).then(function (data) {
                            var data = data || [];
                            that.method.renderOption(data);
                        })
                    })

                }
                that.method.renderOption(that.opt.data);
            },
            /**
             * @desc 异步对象，等待用户source函数 response对象返回需要的数据数组
             * @param {*} value
             * @param {*} label
             */
            promise: function (value, label){
                var dtd = $.Deferred();
                that.opt.source({
                    value: value,
                    label: label
                }, dtd.resolve);
                return dtd.promise();
            },
            /**
             * @desc 根据父级change事件 渲染下级select option
             * @param {array} data 数据数组
             */
            renderOption:function(data){
                var str = ''
                $.each(data,function(index,item){
                    str += '<option value=\"' + item.value + '\"';
                    if (item.selected){
                        str += 'selected';
                    }
                    str += '>' + item.label+'</option>';
                })
                $dom.append(str);
            }
        }

        that.callMethod = {
            destroy: function () {
                 that.opt.p_selecror && $(that.opt.p_selecror).off('change.els.selectGroup');
                 $dom.removeData('els.selectGroup');
            }
        }

        that.method.init();
    }


    var defaultOpt = {
        p_selecror:false,
        defaultOption:'<option value="-1">请选择</option>',
        data:[],
        selectedValue:'-1',
        source: function (request, response){
            response([]);
        }
    }

    $.els.selectGroup = $.els.entry('els.selectGroup', SelectGroup);

})()

/**
 * @file 步骤条
 * @author fanyue
 */

; (function () {
    'use strict'
    var Step = function ($dom, options) {
        var that = this;
        $dom.data('els.step', that);
        that.opt = $.extend({}, defaultOpt, $.els.defaultConfig.step,options);
        that.opt.vertical = $dom.hasClass('els-steps-vertical') ?  true:false;
        that._index = 0;
        that.method = {
            init: function () {
                that.method.initRender();
                if (that.opt.current > that.opt.data.length || that.opt.current<0) return;
                that.method.setStatusByCurrent();
            },
            /**
             * @desc 初始化渲染
             */
            initRender: function () {
                $.each(that.opt.data, function (index, item) {
                    var domStr = that.opt.renderItem(index, item, that.opt.current, that.opt.vertical);
                    var $item = $(domStr).addClass(that.opt.itemClass);
                    var width = that.opt.vertical ? '100%' : 100 / that.opt.data.length + '%';
                    $item.css('width', width).appendTo($dom);
                });
            },
            /**
             * @desc 根据current值 设置状态
             */
            setStatusByCurrent:function(){
                var $item = $dom.find('.' + that.opt.itemClass).removeClass(that.opt.processClass)
                    .removeClass(that.opt.finishClass).removeClass(that.opt.waitClass);
                var $process = $item.eq(that.opt.current).addClass(that.opt.processClass);
                $process.prevAll('.' + that.opt.itemClass).addClass(that.opt.finishClass);
                $process.nextAll('.' + that.opt.itemClass).addClass(that.opt.waitClass);
            }
        }

        that.callMethod = {
            /**
             * @desc 获取current值
             */
            getCurrent:function(){
                return that.opt.current;
            },
            setCurrent: function (current){
                if (current > that.opt.data.length || current < 0) return;
                that.opt.current = current;
                that.method.setStatusByCurrent();
            },
            destroy: function () {
                $dom.removeData('els.step');
                $dom.empty();
            }
        }

        that.method.init();
    }

    var defaultOpt = {
        data: [],
        current:0,
        finishClass: 'els-steps-status-finish',
        itemClass: 'els-steps-item',
        processClass: 'els-steps-status-process',
        waitClass: 'els-steps-status-wait',
        renderItem: function (index, item, current, vertical){
            var str = '<div>';
            if (vertical) str+= '<div class="els-steps-tail"></div>'
            if (index < current){
                str += '<div class="els-steps-icon">'+(index+1)+'</div>'
            } else if (index == current){
                str += '<div class="els-steps-icon">' + (index + 1) + '</div>'
            }else{
                str += '<div class="els-steps-icon">' + (index + 1) + '</div>'
            }
            str += '<div class="els-steps-main">' +
                '<div class="els-steps-title">' + item.title + '</div>' +
                '<div class="els-steps-content">' + item.content + '</div>' +
                '</div></div>'
            return str;
        }
    }
    $.els.step = $.els.entry('els.step', Step);
})()

/**
 * @file 分屏组件
 * @author fanyue
 */

;
(function () {
    'use strict'

    var defaultOpt = {
        iframeName: 'subarea_iframe',
        iframeId: 'subarea_iframe',
        iframeSrc: '',
        bottom: 0
    }

    $.els.subarea = {
        /**
         * @desc 创建分屏
         * @param {*} parameter
         */
        create: function (parameter) {
            var options;
            if ('string' == typeof parameter) {
                options = {};
                options['iframeSrc'] = parameter;
            } else if ('object' == typeof parameter) {
                options = parameter;
            } else {
                options = {};
            }
            var opt = $.extend({}, defaultOpt, $.els.defaultConfig.subarea, options);
            if ($('.els-subarea').length) {
                $.els.subarea.changeUrl(opt['iframeSrc'])
                return
            }
            // 图片预览插件如果存在 则关闭
            $('.els-viewer').each(function(){
                $(this).viewer('hide');
            });
            var templ = '<div class=\"els-subarea\" style="bottom:' + opt['bottom'] + 'px"><div class="viewer-button viewer-close"></div><iframe src=\"' + opt['iframeSrc'] + '\"  name=\"' + opt['iframeName'] + '\" ' +
                'id=\"' + opt['iframeId'] + '\" frameborder="0"></iframe></div>';
            var $templ = $(templ);
            $templ.find('.viewer-close').on('click',function(){
                 $.els.subarea.destroy();
            });
            $('html').addClass('subarea-half');
            $('body').append($templ);
            $.els.resizeFn.fire();
        },
        /**
         * @desc 修改分屏iframe url
         * @param {string} url
         */
        changeUrl:function(url){
            var $container = $('.els-subarea')
            if ($container.length) {
                return
            }
            $container.find('iframe').attr('src', url);
        },
        /**
         * @desc 销毁分屏组件
         * @param {boolean} viewerT 是否不还原减半屏幕，true为不还原
         */
        destroy: function () {
            var dom = $('.els-subarea');
            if (dom.length) {
                var iframe = dom.find('iframe');
                $.els.util.destroyIframe(iframe[0]);
                // iframe.attr('src', 'javascript:void(0)');
                dom.remove();
                $('html').removeClass('subarea-half');
                $.els.resizeFn.fire();
            }
        }

    }

})()

/**
 * @file 侧滑面板组件（抽屉）
 * @author fanyue
 * @version 1.0
 */
;(function(){
    var Swipepad = function ($dom, options) {
        var that = this;
        $dom.data('els.swipepad', that);
        that.$container = $dom;
        that.opt = $.extend({}, defaultOpt, $.els.defaultConfig.swipepad,options);


        that.init = function () {
            var style = that.getStyle();
            style['width'] = that.opt.width;
            that.$container.css(style);
        }

        /**
         * @desc 根据状态 返回抽屉定位样式
         */
        that.getStyle = function () {
            return {
                right: that.opt.shown ? 0 : parseInt('-' + that.opt.width + 'px')
            }
        }

        /**
         * @desc 根据样式，进行显示或隐藏的动画效果
         */
        that.animate = function () {
            that.$container.stop().animate(that.getStyle(), {
                complete: function () {
                    that.opt.complete.apply(this, [that.opt, that.opt.shown])
                },
                duration: that.opt.duration
            })
        }

        that.callMethod = {
            /**
             * @desc 返回抽屉显示状态
             * @returns {boolean}
             */
            getState: function () {
                return that.opt.shown;
            },
            /**
             * @desc 设置抽屉为显示状态
             */
            show: function () {
                that.opt.shown = true;
                that.animate()
            },
            /**
             * @desc 设置抽屉为隐藏状态
             */
            hide: function () {
                that.opt.shown = false;
                that.animate()
            },
            /**
             * @desc 设置抽屉状态切换
             */
            toggle: function () {
                that.opt.shown = !that.opt.shown;
                that.animate()
            },
            destroy: function () {
                $dom.removeData('els.swipepad');
            }
        }

        that.init();

    }

    var defaultOpt = {
        shown: false,
        width:250 ,
        duration: 300,
        easing: 'swing',
        complete: $.noop //opt shown
    }

   $.els.swipepad = $.els.entry('els.swipepad', Swipepad)
})()



/**
 * @file 开关按钮组件 等待改版
 * @author fanyue
 * @version 1.0
 */
;(function(){
    'use strict'
    var Switch = function ($dom, options) {
        var that = this;
        $dom.data('els.switch', that);
        that.$container = null;
        that.$sliderBlock = null;
        that.$checked = $dom;
        that.opt = $.extend({}, defaultOpt,options);
        that.state = null;

        that.init = function () {
            that.method.create();
            that.method.judge();
            that.method.setClass(that.state);
            that.bindEvent();
        }

        that.bindEvent = function () {
            that.$container.on('click', function () {
                that.callMethod.setState(!that.state);
                $.els.util._valid(that.$checked);
                // var valid = that.$checked.attr('data-valid');
                // if (valid && valid == 'true') {
                //     that.$checked.closest('form').validate().element(that.$checked);
                //}
                // that.opt.toggle.apply(that.$checked[0],[that.state]);
            })
        }

        that.callMethod = {
            /**
             * @desc 获取开关的状态
             * @returns {boolean}
             */
            getState: function () {
                return that.state;
            },
            /**
             * @desc 设置开关状态
             * @param {boolean} state
             */
            setState: function (state) {
                if (state == that.state) {
                    return
                } else {
                    that.method.toggleState();
                    that.method.setClass(state)
                }
            }
        }

        that.method = {
            /**
             * @desc 生成switch dom 标签
             */
            create: function () {
                var str = template.replace(/{{ON}}/g, that.opt.on);
                str = str.replace(/{{OFF}}/g, that.opt.off);
                that.$container = $(str);
                $dom.after(that.$container);
                that.$sliderBlock = that.$container.children('.els-switch-container');
                that.$sliderBlock.append($dom);
            },
            /**
             * @desc 判断checkox控件的状态
             */
            judge: function () {
                that.state = that.$checked.prop('checked');
            },
            /**
             * @desc 切换控件状态
             */
            toggleState: function () {
                that.state = !that.state;
                that.$checked.prop('checked', that.state);
                that.opt.toggle.apply(that.$checked[0], [that.state]);
            },
            /**
             * @desc 根据状态设置class
             * @param {boolean} state
             */
            setClass: function (state) {
                if (state) {
                    that.$sliderBlock.removeClass('els-switch-off');
                    that.$sliderBlock.addClass('els-switch-on');
                } else {
                    that.$sliderBlock.removeClass('els-switch-on');
                    that.$sliderBlock.addClass('els-switch-off');
                }
            }
        }

        that.init();

    }

    var defaultOpt = {
        on: 'ON',
        off: 'OFF',
        toggle: $.noop //state
    }

    var template = '<div class="els-switch"><div class="els-switch-container"><span class="els-switch-handle-on">{{ON}}</span>'+
            '<span class="els-switch-handle-label"></span><span class="els-switch-handle-off">{{OFF}}</span>'+
    '</div></div>';

    $.els._switch = $.els.entry('els.switch', Switch);
})()


/**
 * @file https://github.com/abpetkov/switchery 魔改 若出现bug请查看源码
 * @author fanyue
 * @version 1.0
 */
; (function () {
    'use strict'
    var Switch = function ($dom, options) {
        var that = this;
        $dom.data('els.switchery', that);
        that.opt = $.extend({}, defaultOpt, $.els.defaultConfig.switchery,options);
        that.element = $dom.get(0);

        that.callMethod = {
            /**
             * @desc 自我销毁
             */
            destroy: function () {
                $dom.removeData('els.switchery');
                $dom.removeAttr('data-switchery')
                var style = $dom.off('change.els.switchery').prop('style');
                style.removeProperty('position');
                style.removeProperty('width');
                style.removeProperty('height');
                style.removeProperty('border');
                style.removeProperty('visibility');
                that.switcher.off('click.els.switchery').remove();
            },
            /**
             * @desc 恢复使用
             */
            enable:function() {
                if (!that.opt.disabled) return;
                if (that.opt.disabled) that.opt.disabled = false;
                if (that.element.disabled) that.element.disabled = false;
                if (that.element.readOnly) that.element.readOnly = false;
                that.switcher.get(0).style.opacity = 1;
                that.method.bindEvent();
            },
            /**
             * @desc 禁止使用
             */
            disable:function(){
                if (that.opt.disabled) return;
                if (!that.opt.disabled) that.opt.disabled = true;
                if (!that.element.disabled) that.element.disabled = true;
                if (!that.element.readOnly) that.element.readOnly = true;
                this.switcher.get(0).style.opacity = that.options.disabledOpacity;
                that.method.unbindEvent();
            },
            /**
             * @desc 判断是否禁用状态
             * @returns {boolean}
             */
            isDisabled:function(){
                return that.opt.disabled || that.element.disabled || that.element.readOnly;
            }
        }

        that.method = {
            /**
             * @desc 初始化组件
             */
            init: function () {
                that.method.hide();
                that.method.show();
                that.method.setSize();
                that.method.setPosition();
                that.method.markAsSwitched();
                that.method.bindEvent();
            },
            /**
             * @desc 绑定事件
             */
            bindEvent: function () {
                $dom.on('change.els.switchery', function () {
                    arguments[1] != 'handle' && that.method.setPosition();
                    $.els.util._valid($dom);
                });
                that.switcher.on('click.els.switchery',function(){
                    var parent = that.element.parentNode.tagName.toLowerCase()
                        , labelParent = (parent === 'label') ? false : true;

                    that.method.setPosition(labelParent);
                    that.method.handleOnchange();
                });
            },
            /**
             * @desc 取消绑定事件
             */
            unbindEvent:function(){
                $dom.off('change.els.switchery');
                that.switcher.off('click.els.switchery')
            },
            /**
             * @desc 设置checkbox隐藏
             */
            hide: function () {
                $dom.css({
                    'position':'absolute',
                    'width':'0px',
                    'height':'0px',
                    'border':'0',
                    'visibility':'hidden'
                });
            },
            /**
             * @desc 在checkbox后 放入switchery组件
             */
            show: function () {
                $dom.after(that.method.create());
            },
            /**
             * @desc 创建switchery组件的dom元素
             */
            create: function () {
                that.switcher = $('<span></span>');
                that.jack = $('<small></small>');
                that.switcher.append(that.jack);
                that.switcher.addClass(that.opt.className);
                return that.switcher;
            },
            /**
             * @desc 设置switchery组件的大小
             */
            setSize: function () {
                var small = 'switchery-small'
                    , normal = 'switchery-default'
                    , large = 'switchery-large';

                switch (that.opt.size) {
                    case 'small':
                        that.switcher.addClass(small)
                        break;
                    case 'large':
                        that.switcher.addClass(large)
                        break;
                    default:
                        that.switcher.addClass(normal)
                        break;
                }
            },
            /**
             * @desc 根据状态切换switchery组件内dom样式位置
             * @param {boolean} clicked
             */
            setPosition: function (clicked) {
                var checked = that.method.isChecked();
                var switcher = that.switcher;
                var jack = that.jack;

                if (clicked && checked) checked = false;
                else if (clicked && !checked) checked = true;

                if (checked === true) {
                    that.element.checked = true;
                    jack.css('left', parseInt(switcher.width()) - parseInt(jack.width()))
                    if (that.opt.color) that.method.colorize();
                    that.method.setSpeed();
                } else {
                    jack.css('left',0);
                    that.element.checked = false;
                    that.switcher.css({
                        'boxShadow': 'inset 0 0 0 0 ' + that.opt.secondaryColor,
                        'borderColor': that.opt.secondaryColor,
                        'backgroundColor': (that.opt.secondaryColor !== defaultOpt.secondaryColor) ? that.opt.secondaryColor:'#fff'
                    })
                    that.jack.css('backgroundColor',(that.opt.jackSecondaryColor !== that.opt.jackColor) ? that.opt.jackSecondaryColor : that.opt.jackColor)
                    that.method.setSpeed();
                }
            },
            /**
             * @desc 判断checkbox 点击状态
             */
            isChecked: function () {
                return $dom.prop('checked');
            },
            /**
             * @desc 颜色设置
             */
            colorize:function () {
                var switcherHeight = that.switcher.outerWidth() / 2;
                that.switcher.css({
                    'backgroundColor':that.opt.color,
                    'borderColor': that.opt.color,
                    'boxShadow': 'inset 0 0 0 ' + switcherHeight + 'px ' + that.opt.color
                });
                that.jack.css('backgroundColor', that.opt.jackColor);
            },
            /**
             * @desc 设置切换动画速度
             */
            setSpeed:function(){
                var switcherProp = {}
                    , jackProp = {
                        'background-color': that.opt.speed
                        , 'left': that.opt.speed.replace(/[a-z]/, '') / 2 + 's'
                    };

                if (that.method.isChecked()) {
                    switcherProp = {
                        'border': that.opt.speed
                        , 'box-shadow': that.opt.speed
                        , 'background-color': that.opt.speed.replace(/[a-z]/, '') * 3 + 's'
                    };
                } else {
                    switcherProp = {
                        'border': that.opt.speed
                        , 'box-shadow': that.opt.speed
                    };
                }

                Transitionize(that.switcher[0], switcherProp);
                Transitionize(that.jack[0], jackProp);
            },
            /**
             * @desc 猜测为初始化后打上标记，但我在魔改后，暂未找到使用
             */
            markAsSwitched:function(){
                $dom.attr('data-switchery', true);
            },
            /**
             * @desc 触发绑定的change事件
             */
            handleOnchange:function(){
                $dom.trigger('change.els.switchery',['handle']);
            },
            /**
             * @desc 判断是否为disbale状态
             * @returns {boolean}
             */
            isDisabled:function(){
                return that.opt.disabled || $dom.prop('disabled') || $dom.prop('readOnly');
            }

        }

        if (that.element != null && that.element.type == 'checkbox') {
            that.method.init();
        }
        if (that.method.isDisabled() === true) that.callMethod.disable();


    }

    var defaultOpt = {
        color: '#64bd63',
        secondaryColor: '#dfdfdf',
        jackColor: '#fff',
        jackSecondaryColor: null,
        className: 'switchery',
        disabled: false,
        disabledOpacity: 0.5,
        speed: '0.4s',
        size: 'default'
    };


    $.els.switchery = $.els.entry('els.switchery', Switch);

    function Transitionize(element, props) {
        if (!(this instanceof Transitionize)) return new Transitionize(element, props);

        this.element = element;
        this.props = props || {};
        this.init();
    }

    /**
     * Detect if Safari.
     *
     * @returns {Boolean}
     * @api private
     */

    Transitionize.prototype.isSafari = function () {
        return (/Safari/).test(navigator.userAgent) && (/Apple Computer/).test(navigator.vendor);
    };

    /**
     * Loop though the object and push the keys and values in an array.
     * Apply the CSS3 transition to the element and prefix with -webkit- for Safari.
     *
     * @api private
     */

    Transitionize.prototype.init = function () {
        var transitions = [];

        for (var key in this.props) {
            transitions.push(key + ' ' + this.props[key]);
        }

        this.element.style.transition = transitions.join(', ');
        if (this.isSafari()) this.element.style.webkitTransition = transitions.join(', ');
    };
})()


/**
 * @file 选项卡
 * @author fanyue
 */
;
(function () {
    'use strict'
    var util = $.els.util;
    var Tab = function ($dom, options) {
        var that = this;
        $dom.data('els.tab', that);
        that.$container = $dom;
        that.$tab = that.$container.children('.els-tab-header');
        that.$tabContent = that.$container.children('.els-tab-content');
        that.opt = $.extend({}, defaultOpt, options);
        that.scroller;
        that.$placeholder;
        that.$bar

        that.init = function () {
            if (that.opt.transformBar) {
                that.$bar = $('<div class=\"els-tab__bar\"></div>').prependTo(that.$tab);
            }
            that.bindEvent();
            that.callMethod.full();
        }

        that.bindEvent = function () {
            that.$tab.children('.els-tab-item').each(function (index, el) {
                if (index == 0 && that.opt.transformBar) {
                     that.$bar.css({
                         width: $(el).outerWidth() + 'px',
                         transform: 'translateX(' + el.offsetLeft + 'px)'
                     })
                }
                $(el).on('click.els.tab', function (event) {
                    var $this = $(this);
                    //如若.els-tab-item 含有.els-disable 或配置的click时间返回false 则切换失败
                    if (!that.opt['click'].apply(this, [index]) || $this.hasClass('els-disable')) {
                        return
                    }
                    if ($this.hasClass('els-active')) {
                        // that.opt['toggle'].apply(this, [index])
                        return
                    }
                    if (that.opt.transformBar){
                        var offsetLeft = $this.get(0).offsetLeft;
                        var outerWidth = $this.outerWidth();
                        that.$bar.css({
                            width: outerWidth+'px',
                            transform: 'translateX(' + offsetLeft + 'px)'
                        })
                    }
                    $this.addClass('els-active').siblings().removeClass('els-active');
                    that.$tabContent.children('.els-tab-content-item').eq(index).addClass('els-active').siblings().removeClass('els-active');
                    that.opt['toggle'].apply(this, [index]);
                    if (that.opt.sticky) {
                        that.callMethod.scrollCheck();
                    }
                })
            });

            if (that.opt.sticky) {
                that.scroller = $($.els.util.getScrollEventTarget($dom.get(0)));
                that.$placeholder = $('<div></div>').insertAfter(that.$tab);
                that.scroller.on('scroll.els.tab', function () {
                    that.callMethod.scrollCheck();
                })
                that.callMethod.scrollCheck();
            }
        }

        that.callMethod = {
            /**
             * @desc 根据.els-content 元素自适应 （不建议使用）
             */
            fullPage: function () {
                var state = util.scrollState();
                var content = $('.els-content');
                var winH = $(window).height();
                var contentH = content.outerHeight(true);
                var tabContentH = Math.floor(that.$tabContent.height());
                that.$tabContent.height(Math.floor(tabContentH + winH - contentH) - 1);
                $("body").css({
                    "overflow-x": state.x,
                    "overflow-y": state.y
                })
            },
            /**
             * @desc 触发自适应效果的函数，逐渐扩展
             */
            full: function () {
                var full = that.$container.attr('data-fullType');
                if (full && full == 'fullPage') {
                    // var y = that.$container.attr('data-fullY');
                    this[full]();
                }
            },
            scrollCheck: function () {
                var rect = $dom.get(0).getBoundingClientRect();
                var height = that.$tab.outerHeight();
                if (rect.top < 0 && rect.bottom - height > 0) {
                    that.$placeholder.height(height);
                    that.$tab.css({
                        'position': 'fixed',
                        'top': 0,
                        'left': 0
                    })
                } else {
                    that.$placeholder.height(0);
                    that.$tab.css({
                        'position': 'relative',
                        'top': 'auto',
                        'left': 'auto'
                    })
                }
            },
            /**
             * @desc 销毁
             */
            destroy: function () {
                that.$tab.children('.els-tab-item').each(function (index, el) {
                    $(el).off('click.els.tab');
                });
                var full = that.$container.attr('data-fullType');
                if (full && full == 'fullPage') {
                    var style = that.$tabContent.prop('style');
                    style.removeProperty('height');
                }
                if (that.opt.sticky) {
                    that.$placeholder.remove();
                    that.scroller.off('scroll.els.tab');
                    var headStyle = that.$tab.prop('style');
                    headStyle.removeProperty('position');
                    headStyle.removeProperty('top');
                    headStyle.removeProperty('left');
                }
                if (that.opt.transformBar) {
                    that.$bar.remove();
                }
                $dom.removeData('els.tab');
            }
        }

        that.init();
    }

    var defaultOpt = {
        sticky: false,
        transformBar: false, //滑动变形
        'toggle': $.noop, //index
        "click": function () {
            return true;
        }
    }

    $.els.tab = $.els.entry('els.tab', Tab);
})()

/**
 * @file 标签
 * @author fanyue
 * @version 1.0
 */

;
(function () {
    'use strict'
    var Tag = function ($dom, options) {
        var that = this;
        $dom.data('els.tag', that);
        that.opt = $.extend({}, defaultOpt, options);
        // that._id = 0;
        that._data = {}

        that.method = {
            init: function () {
                var str = ''
                for (var i = 0; i < that.opt.data.length;i++) {
                // for (that._id = 0; that._id < that.opt.data.length; that._id++) {
                    //var item = that.opt.data[that._id];
                    var item = that.opt.data[i];
                    //that._data[that._id] = item;
                    that._data['value'] = item;
                    //str += '<div class="els-tag" data-id=\"' + that._id + '\" data-value=\"' + item.value + '\"><span>' + item.label + '</span>';
                    str += '<div class="els-tag" data-value=\"' + item.value + '\"><span>' + item.label + '</span>';
                    if (item.close) {
                        str += '<i class="els-tag-close">&times;</i>'
                    }
                    str += '</div>'
                }
                //that._id--; //for循环原因 多一次自增所以减回来，本身没意义，我就看的_id连贯舒服。
                $dom.append(str);
                that.method.bindEvent();
            },
            bindEvent: function () {
                $dom.on('click.els.tag', '.els-tag-close', function () {
                    var tag = $(this).closest('.els-tag');
                    //var id = tag.attr('data-id');
                    var v = tag.attr('data-value');
                    //var _d = that._data[id];
                    var _d = that._data[v];
                    that.opt.close(_d);
                    //delete that._data[id]
                    delete that._data[v]
                    tag.remove();
                    return false;
                })
            },
        }

        that.callMethod = {
            /**
             * @desc 根据数据增加tag
             * @param {object} param  {label,value}
             */
            add: function (param) {
                if (that._data[param['value']]){
                    return
                }
                var str = '';
                //that._id++;
                // str += '<div class="els-tag" data-id=\"' + that._id + '\" data-value=\"' +
                //     param.value + '\"><span>' + param.label + '</span>';
                str += '<div class="els-tag" data-value=\"' +
                    param.value + '\"><span>' + param.label + '</span>';
                if (param['close']) {
                    str += '<i class="els-tag-close">&times;</i>'
                }
                $dom.append(str);
                that._data[param['value']] = param;
            },
            /**
             * @desc 根据value值删除tag
             * @param {string} value
             */
            remove: function (value) {
                var tag = $dom.find('.els-tag[data-value=\"' + value + '\"]');
                //var id = tag.attr('data-id');
                var _d = that._data[value];
                that.opt.close(_d);
                //delete that._data[id];
                delete that._data[value];
                 tag.remove();
            },
            /**
             * @desc 获取所有的tag数据
             * @returns {array} [{label,value}]
             */
            getData: function () {
                var arr = [];
                for (var i in that._data) {
                    arr.push(that._data[i])
                }
                return arr;
            },
            destroy: function () {
                $dom.removeData('els.tag');
                $dom.off('click.els.tag', '.els-tag-close');
                $dom.empty();
            }
        }

        that.method.init();
    }


    var defaultOpt = {
        data: [],
        close: $.noop //data
    }

    $.els.tag = $.els.entry('els.tag', Tag);
})()

/**
 * @file 一级穿梭框
 * @author fanyue
 */
;
(function ($) {
    var Transfer = function ($dom, options) {
        var that = this;
        $dom.data('els.transfer', that);
        that.opt = $.extend({}, defaultOpt, options);
        that.$container = $dom;
        that.$leftTransfer = that.$container.find('ul.els-shuttle-list-content-add').eq(0);
        that.$rightTransfer = that.$container.find('ul.els-shuttle-list-content-reduce').eq(0);
        that.$operation = that.$container.find('.els-shuttle-operation');
        that.$allCheckbox = that.$container.find('.els-shuttle-all-checkbox');
        var TYPE = {
            REDUCE: that.$leftTransfer,
            ADD: that.$rightTransfer
        }

        that.method = {
            init:function () {
                that.method.bindEvent()
            },
            bindEvent:function(){
                var callback = function () {
                    var $this = $(this);
                    var $item = $this.closest('.els-shuttle-item');
                    var type = $this.closest('.els-shuttle-list-content').attr('data-type');
                    var $target = TYPE[type] ? TYPE[type] : $();
                    $item.find('.els-shuttle-item-checkbox').prop('checked',false);
                    if (!that.opt.change.apply(this, [$item, type])) {
                        return
                    }
                    $target.append($item);
                    that.method.verify();
                }
                that.$leftTransfer.on('click.els.transfer', '.els-shuttle-icon', callback);
                that.$rightTransfer.on('click.els.transfer', '.els-shuttle-icon', callback);
                that.$operation.find('[data-type]').on('click.els.transfer', function () {
                    var $this = $(this);
                    var type = $this.attr('data-type');
                    var $from;
                    var $to;
                    if (type == "ADD") {
                        $from = that.$leftTransfer;
                        $to = that.$rightTransfer;
                    } else if (type == "REDUCE") {
                        $to = that.$leftTransfer;
                        $from = that.$rightTransfer;
                    }
                    $from.find('.els-shuttle-item-checkbox:checked').each(function () {
                        var $check = $(this).prop('checked', false);
                        var $item = $check.closest('.els-shuttle-item');
                        $to.append($item);
                    })
                    that.method.verify();
                })
                that.$allCheckbox.on('click.els.transfer', function () {
                    var $allCheck = $(this);
                    var $checklist = $allCheck.closest('.els-shuttle-list').find('.els-shuttle-item-checkbox');
                    $allCheck.prop('checked') ? $checklist.prop('checked', true) : $checklist.prop('checked', false);
                })
                $dom.on('click.els.transfer','.els-shuttle-item-checkbox',function(){
                    that.method.verify();
                })
            },
            /**
             * @desc 效验左右两侧 多选是否正常
             */
            verify:function(){
                var $leftCheckboxList = that.$leftTransfer.find('.els-shuttle-item-checkbox');
                var $rightCheckboxList = that.$rightTransfer.find('.els-shuttle-item-checkbox');
                var count = 0;
                var state = false;
                $leftCheckboxList.each(function(){
                    if ($(this).prop('checked')){
                        count++;
                    }
                })
                if (count == 0) {
                    state = false;
                } else if (count == $leftCheckboxList.length){
                    state = true;
                }else{
                    state = false;
                }
                that.$leftTransfer.closest('.els-shuttle-list').find('.els-shuttle-all-checkbox').prop('checked', state);
                count = 0;
                $rightCheckboxList.each(function () {
                    if ($(this).prop('checked')) {
                        count++;
                    }
                })
                if (count == 0) {
                    state = false;
                } else if (count == $rightCheckboxList.length) {
                    state = true;
                } else {
                    state = false;
                }
                that.$rightTransfer.closest('.els-shuttle-list').find('.els-shuttle-all-checkbox').prop('checked', state);
            }
        }

        that.callMethod = {
            /**
             * @desc 获取左侧框体jquery dom 集合
             * @returns {object}
             */
            getAddDomList: function () {
                return that.$leftTransfer.children('.els-shuttle-item');
            },
            /**
             * @desc 获取右侧框体jquery dom 集合
             * @returns {object}
             */
            getReduceDomList: function () {
                return that.$rightTransfer.children('.els-shuttle-item');
            },
            destroy: function () {
                that.$leftTransfer.off('click.els.transfer');
                that.$rightTransfer.off('click.els.transfer');
                that.$operation.find('[data-type]').off('click.els.transfer');
                $dom.removeData('els.transfer');
            }
        }
        that.method.init()
    }

    var defaultOpt = {
        change: function () {
            return true
        }
    }


    $.els.transfer = $.els.entry('els.transfer', Transfer)


})(jQuery)

/**
 * @file 基于半屏预览图片插件封装
 * @author fanyue
 */
;
(function () {
    'use strict'
    $.els.viewer = {
        /**
         * viewer为分屏预览功能封装函数
         * 1.依靠分屏添加 html.viewer-half 形成分屏样式
         * 2.修改viewer.js 源码 扩展half属性 并 修改尺寸代码（该插件中搜索fy code可见修改部分）
         *
         * @param {object} $dom 容器jquery对象
         * @param {object} options  配置
         */
        create: function ($dom, options) {
            var options = options || {
                show:$.noop,
                shown: $.noop,
                hidden: $.noop
            };
            var opt = $.extend({}, defaultOpt, options);
            var show = $.Callbacks();
            var shown = $.Callbacks();
            var hidden = $.Callbacks();

            show.add(opt.show);
            opt.show = function () {
                show.fireWith(this, arguments)
            }

            shown.add(opt.shown);
            opt.shown = function () {
                shown.fireWith(this, arguments)
            }

            hidden.add(opt.hide);
            opt.hidden = function () {
                hidden.fireWith(this, arguments)
            }

            if (opt.half == true) {
                show.add(function () {
                    //分屏iframe组件如若存在 则删除，但不需要解除界面宽度减半的效果
                    $.els.subarea.destroy();
                    $('html').addClass('viewer-half');

                });
                shown.add(function () {
                    $.els.resizeFn.fire();
                });
                hidden.add(function () {
                    $('html').removeClass('viewer-half');
                    $.els.resizeFn.fire();
                });
            }
            return $dom.viewer(opt);
        },
        updata: function ($dom) {
            /**
             * 似乎没有初始化调用update会默认初始化，
             * 暂不限制，理由如下
             * 开发人员碰巧依靠update实现的功能，会被破坏，不好估量
             */
            //$dom.data('viewer') &&
            $dom.viewer('update');
        },
        destroy: function ($dom) {
            $dom.viewer('destroy');
        }
    }

    var defaultOpt = {
        half: false,
        show: $.noop,
        hide: $.noop,
    }


    $(function(){
    //自动初始化图片预览
        $('.els-viewer').each(function () {
            var $this = $(this);
            var half = $this.attr('data-half') == 'true'?true:false;
            // 删除事件委托
            // $this.on('click', '.fa-trash', function () {
            //     $(this).closest('.els-previewBox').remove();
            //     $.els.viewer.updata($this); //删除后照片预览插件更新，（增加图片删除图片都需要刷新！切记）
            //     return false;
            // })
            // 图片控件初始化 如果仅仅是pdf预览 则无需添加该代码
            $.fn.viewer && $.els.viewer.create($this, {
                half: half,
                filter: function (image) { //判断pdf图标 不触发放大效果
                    return $(image).hasClass('els-img');
                }
            });
            // pdf 分屏效果委托
            $this.on('click.els.viewer', '.els-pdf-img', function () {
                var url = $.els.defaultConfig.pdfBasePath + $(this).attr('data-original');
                $.els.subarea.create(url);
            });
        })
    })
})()

/**
 * @file 三方select2控件功能封装 以及自动初始化
 * @author fanyue
 * @version 1.0
 */

;
(function () {
    // 暴露select2 内置的util模块
    var _utils;
    $.fn.select2 &&
    $.fn.select2.amd.require(
        ["select2/utils"],
        function (Utils) {
            _utils = Utils;
    });
    /**
     * @desc select2 全选反选按钮封装
     * 本功能上属于测试阶段以下为常见问题：
     * 1.点击document菜单不消失bug，因为select2源码菜单消失逻辑捆绑在body的mousedown事件内，
     * 如果body本身高度不够，鼠标无法正常点击到，则造成点击菜单无法消失的错觉。
     * 2.请勿用input标签初始化，官方api的清空事件无效。等待后续版本更新修复。
     * 3.不支持配置ajax属性使用远程datasouce(未测试)
     * @param {object} $dom jquery 选择器
     * @param option select2初始化配置
     */

    $.els.select2 = function ($dom, option) {
        $dom.hasClass("select2-hidden-accessible") && $dom.select2('destroy'); //如果已经初始化过，即销毁
        $dom.select2(option);
        $dom.on('select2:open', function () {
            var instance = $dom.data('select2'); //获取实例
            if (instance.options.options.multiple) { //判断是否为复选
                //去除搜索框
                // var $searchfield = $dom.parent().find('.select2-search__field');
                // $searchfield.prop('disabled', true);
                // 添加全选按钮
                var $dropdown = instance.$dropdown;
                if (!$dropdown.find('.els-select2-control').length) { //不存在则添加按钮绑定事件
                    var $controlStr = $('<span class=\"els-select2-control \">' +
                        '<span class=\"els-select2-all\">选择全部/取消</span>' +
                        '</span>');
                    $dropdown.find('.select2-results').prepend($controlStr);
                    //全选事件绑定
                    $controlStr.find('.els-select2-all').on({
                        'click': function () {
                            var $opt = $dropdown.find('.select2-results__option:not(.select2-results__message)');
                            var $opt_t = $dropdown.find('.select2-results__option[aria-selected=true]');
                            var current_data = $.map($dom.select2('data'),function(item){
                                return item['id'];
                            });
                            var option_data = [];
                            $opt.each(function () {
                                //此处_utils.GetData方法是阅读select2源码得知，后续可能会因为版本更新失效,请持续更新维护
                                option_data.push(_utils.GetData(this, 'data')['id']);
                            });
                            if ($opt.length == $opt_t.length) { //进入取消逻辑
                                $.each(option_data,function(k,v){
                                    var _index = current_data.indexOf(v);
                                    (_index != -1) && current_data.splice(_index,1);
                                })
                                $dom.val(current_data).trigger("change");
                            } else {
                                //去重
                                var _d = $.els.util.unique(current_data.concat(option_data));
                                // 考虑到数量限制
                                var limit = instance.options.options.maximumSelectionLength;
                                limit == 0 ?
                                $dom.val(_d).trigger("change"): $dom.val(_d.slice(0, limit)).trigger("change");
                            }
                            $dom.select2("close"); //关闭菜单
                            return false
                        },
                        'mouseenter':function(){
                            // 接触后下方选项高亮取消
                            $('.select2-results__option--highlighted').removeClass('select2-results__option--highlighted');
                        }
                    })
                }

            }
        });
        //表单效验
        // 'true' == $dom.attr('data-valid') && $dom.on("select2:select", function (e) {
        //     $dom.closest('form').validate().element($dom);
        // })
        $dom.on("select2:select", function (e) {
            $.els.util._valid($dom);
        })

    }
    $(function () {
        //select2 自动初始化效验
        $.fn.select2 && $('.els-select2').each(function () {
            var $this = $(this);
            if (!$this.hasClass('els-select2-noinit')) {
                //var valid = $this.attr('data-valid');
                $this.select2({
                    closeOnSelect: $this.prop('multiple')?false:true
                });
                //表单效验
                // 'true' == valid && $this.on("select2:select", function (e) {
                //     $this.closest('form').validate().element($this);
                // })
                $this.on("select2:select", function (e) {
                    $.els.util._valid($this);
                })
            }
        });
    })
})()

//# sourceMappingURL=els.js.map
