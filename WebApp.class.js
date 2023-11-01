/**
 * @fileoverview WebApp class
 * @version 1.0.1
 * @author Mate-Team (shpaw415)
 */
/**
 * WebApp class
 */
// consts
const STORAGE_NAME = 'WebAppPageStorage';
const SUCCESS = 'success';
const ERROR = 'error';
const TYPE_FOLDER = 'folder';
const TYPE_ITEM = 'item';
const TYPE_ITEM_FOLDER = 'item_folder';
const TYPE_OPTION = 'option';
const KEYBOARD_OPTION_ONLY_CHARACTERS = 'on-only-characters';
// end
// Global variables
let LANGUAGE = navigator.language;
;
;
;
;
;
;
;
;
class WebApp {
    WebAppVersion = 'v1.0.0';
    pager = new PageController();
    interactor = new InteractionManager();
    utils = new Utils();
    securer = new Security();
    ws = new WSManager();
    user = new UserManager();
    animationManager = new AnimationManager();
    icon = new Icon('common/icons/');
    mouse = new MouseManager();
    constructor() {
        this.Init();
    }
    Init() {
        this.utils.Init();
    }
    page(id = false) {
        if (id !== false)
            this.pager.SelectedID = id;
        return this.pager;
    }
    interact(selector) {
        if (typeof selector == 'string')
            this.interactor.SelectedElement = document.querySelector(selector);
        else if (selector instanceof Element)
            this.interactor.SelectedElement = selector;
        else
            this.interactor.SelectedElement = selector.element;
        return this.interactor;
    }
    animate(selector) {
        let proxy = null;
        let newSelector = Array();
        if (typeof selector == 'string') {
            proxy = document.querySelectorAll(selector);
            if (proxy == null)
                throw new Error(`Invalid selector`);
            else
                newSelector.push(...proxy);
        }
        else if (selector instanceof ElementManager)
            newSelector.push(selector.element);
        else if (selector instanceof Array) {
            for (let i = 0; i < selector.length; i++) {
                let el = selector[i];
                if (el instanceof ElementManager) {
                    newSelector.push(el.element);
                }
                else if (el instanceof Element) {
                    newSelector.push(el);
                }
                else if (typeof el === 'string') {
                    newSelector.push(...document.querySelectorAll(el));
                }
            }
        }
        else
            throw new Error('Invalid selector');
        this.animationManager.SelectedElement = Array(...newSelector);
        return this.animationManager;
    }
    security() {
        return new Security();
    }
    SetPageOptions(Selector, localStore = false, js_path = 'js/', css_path = 'css/', html_path = 'html/') {
        this.pager.setOptions(Selector, localStore, js_path, css_path, html_path);
    }
    SetVersion(Version) {
        this.WebAppVersion = Version;
        this.pager.WebAppVersion = Version;
    }
    /**
     *
     * @returns {Array} array of queried elements
     * @return {Element} one queried element
     */
    get(...args) {
        let list = Array();
        let list2 = Array();
        for (let i = 0; i < arguments.length; i++) {
            list = list.concat(document.querySelectorAll(arguments[i]));
            for (let j = 0; j < list[i].length; j++) {
                list2.push(list[i][j]);
            }
        }
        return list2;
    }
    create(ElType) {
        let el = document.createElement(ElType);
        if (el === null)
            throw new Error('Invalid element type');
        return new ElementManager(el);
    }
    select(El) {
        return new ElementManager(El);
    }
    insert(element, html) {
        let proxy = typeof element === 'string' ? document.querySelector(element) : element;
        if (proxy === null)
            throw new Error('Invalid element');
        element = proxy;
        element.innerHTML = html;
    }
}
class Utils {
    msgbox;
    msgList = Array();
    msgIsUsed = false;
    supportsPassive = false;
    wheelOpt = false;
    wheelEvent = '';
    security = new Security();
    currentBox = null;
    BoxResolver = () => { };
    boxOpened = false;
    constructor() {
        let proxy = document.querySelector('.warning');
        if (proxy !== null) {
            this.msgbox = proxy;
        }
        else {
            this.msgbox = document.createElement('div');
            this.msgbox.classList.add('warning');
            document.body.appendChild(this.msgbox);
        }
        this.msgbox.style.display = 'none';
        this.Init();
    }
    Init() {
        this.msgbox.addEventListener('click', () => {
            this.msgbox.style.display = 'none';
        });
        this.msgbox.addEventListener('mouseover', () => {
            this.msgbox.style.opacity = '0.5';
        });
        this.msgbox.addEventListener('mouseout', () => {
            this.msgbox.style.opacity = '1';
        });
        this.wheelOpt = this.supportsPassive ? { passive: false } : false;
        this.wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
    }
    async Get(url) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        let prom = await new Promise((resolve, reject) => {
            xhr.onload = () => {
                if (xhr.status === 200)
                    resolve(xhr.responseText);
                else
                    reject(false);
            };
            xhr.send();
        });
        return prom;
    }
    async Post(url, data, timeOut = false) {
        //data = {key: value, key: value, ...}
        let formatdata = '';
        let first = '';
        Object.entries(data).forEach(([key, value]) => {
            formatdata += `${first}${key}=${value}`;
            first = '&';
        });
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", url, true); // true for asynchronous
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlHttp.send(formatdata);
        let res = await new Promise((resolve, reject) => {
            if (typeof timeOut !== 'boolean') {
                setTimeout(() => {
                    xmlHttp.abort();
                    resolve(false);
                }, timeOut);
            }
            xmlHttp.onreadystatechange = () => {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    resolve(xmlHttp.responseText);
                }
                else if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
                    resolve(false);
                }
            };
        });
        return res;
    }
    GetCookie(name) {
        let cookies = document.cookie.split(';');
        let cookieInfo = Array();
        for (let i = 0; i < cookies.length; i++) {
            cookieInfo = cookies[i].split('=');
            if (cookieInfo[0].trim() == name) {
                return cookieInfo[1].trim();
            }
        }
        return false;
    }
    /**
     *
     * @param {string} msg message to show
     * @param {string} color color of the message
     * @param {int} time time to show message in milliseconds
     * @return {void} Display message on screen
     */
    WarningMsg(msg, color = 'white', time = 5000) {
        if (msg.length == 0)
            return false;
        if (this.msgList.find(e => e.message == msg))
            return false;
        let self = this;
        this.msgList.push({
            message: msg,
            color: color,
            time: time
        });
        async function display() {
            self.msgbox.innerHTML = self.msgList[0].message;
            self.msgbox.style.color = self.msgList[0].color;
            self.msgbox.style.display = 'block';
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    self.msgbox.style.display = 'none';
                    if (self.msgList.length > 0)
                        display();
                    else
                        self.msgIsUsed = false;
                    self.msgList.shift();
                    resolve(true);
                }, self.msgList[0].time);
            });
        }
        async function loop() {
            await display();
            if (self.msgList.length > 0)
                loop();
        }
        loop();
    }
    ClearAlerts() {
        this.msgList = Array();
    }
    Alert(msg, color = 'white', time = 5000) {
        return this.WarningMsg(msg, color, time);
    }
    async GetFileFromUser() {
        let res = await new Promise((resolve, reject) => {
            let file = document.createElement('input');
            file.type = 'file';
            const onchangeEvent = (e) => {
                let elem = e.target;
                if (elem === null || elem.files === null)
                    return;
                let file = elem.files[0];
                resolve(file);
            };
            file.onchange = onchangeEvent;
            file.onabort = () => resolve(false);
            file.onerror = (e) => resolve(false);
            file.oncancel = (e) => resolve(false);
            file.click();
        });
        return res;
    }
    async uploadFile(url, files, postData = {}, progress_callback) {
        let res = await new Promise((resolve, reject) => {
            let formData = new FormData();
            for (let [key, value] of Object.entries(postData)) {
                if (typeof value === 'string') {
                    formData.append(key, value);
                }
                else
                    formData.append(key, JSON.stringify(value));
            }
            for (let key of Object.keys(files)) {
                formData.append(key, files[key]);
            }
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.upload.onprogress = (e) => {
                let percent = (e.loaded / e.total) * 100;
                if (progress_callback)
                    progress_callback(percent);
            };
            xhr.onload = () => {
                let data = JSON.parse(xhr.responseText);
                resolve(data);
            };
            xhr.send(formData);
        });
        return res;
    }
    /**
     *
     * @param {string} filename the name of the file
     * @param {Array|string} extension extension of the file to verify
     * @returns {boolean} true if the file extension is correct, false otherwise
     */
    static checkFileExtension(filename, extension) {
        if (typeof extension === 'string')
            extension = [extension];
        for (let i = 0; i < extension.length; i++) {
            if (filename.endsWith(extension[i]))
                return true;
        }
        return false;
    }
    async FileToBase64(file) {
        let res = await new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = (e) => {
                if (e.target === null || e.target.result === null)
                    return;
                resolve(e.target.result.toString());
            };
            reader.onerror = (e) => reject(null);
            reader.readAsDataURL(file);
        });
        return res;
    }
    /** trigger Confim(), CustomBox() or InputBox() to accept  */
    accept() {
        if (!this.currentBox || !this.boxOpened)
            return;
        const data = this.currentBox.global();
        if (!data.onAccept)
            return;
        data.onAccept(this.currentBox.global().resolve, this.currentBox);
    }
    /** trigger Confim(), CustomBox() or InputBox() to cancel  */
    cancel() {
        if (!this.currentBox || !this.boxOpened)
            return;
        const data = this.currentBox.global();
        if (!data.oncancel)
            return;
        data.oncancel(this.currentBox.global().resolve, this.currentBox);
    }
    _boxOpened() {
        if (this.boxOpened) {
            this.WarningMsg(Utils.translate('un boite de dialogue est deja ouverte', 'modal box is already opened'), 'orange');
            return true;
        }
        return false;
    }
    async CustomBox(element, msg, blackout = false, onAction) {
        if (this._boxOpened())
            return false;
        let man = new ElementManager();
        let box = man.create().id('input-box').in('body');
        let blackoutEl = new ElementManager('body');
        if (blackout)
            blackoutEl.blackout(true);
        this.currentBox = box;
        this.boxOpened = true;
        let prom = await new Promise(async (resolve, reject) => {
            let onActionDefault = {
                onAccept: () => resolve(box),
                oncancel: () => resolve(false)
            };
            if (onAction)
                onAction = { ...onActionDefault, ...onAction };
            else
                onAction = { ...onActionDefault };
            box
                .global({ resolve: resolve, reject: reject, ...onAction })
                .add(man.create('div').class('msg', 'color-primary', 'up-10', 'text-size-2').html(msg), element, man.create('div').id('btn-section-input').class('row').set('style', 'margin-top:20px;').add(man.create('button')
                .class('btn-primary', 'back-grad-green', 'back-set-1', 'color-black', 'margin-right-5')
                .html('accept')
                .event('click', () => this.accept())
                .make('accept-btn'), man.create('button')
                .class('btn-primary', 'back-grad-red', 'back-set-1', 'color-white', 'margin-left-5')
                .html('cancel')
                .event('click', () => this.cancel())
                .make('cancel-btn')));
        });
        if (blackout)
            blackoutEl.blackout(false);
        this.boxOpened = false;
        this.currentBox.remove();
        return prom;
    }
    /** @description the resolver, reject function will be found in the global ElementManager the box will be found in the global ElementManager as well... when resolve is called the box is closed and it returns the promise value */
    async box(element, blackout = false, onAction) {
        if (this._boxOpened())
            return false;
        if (element instanceof ElementManager === false)
            throw new Error('Invalid element must be an instance of ElementManager');
        this.boxOpened = true;
        let box = new ElementManager();
        this.currentBox = box;
        let blackoutEl = new ElementManager('body');
        if (blackout)
            blackoutEl.blackout(true);
        const prom = await new Promise(async (resolve, reject) => {
            let onActionDefault = {
                onAccept: () => resolve(box),
                oncancel: () => resolve(false)
            };
            if (onAction)
                onAction = { ...onActionDefault, ...onAction };
            else
                onAction = { ...onActionDefault };
            box.id('input-box')
                .global({ resolve: resolve, reject: reject, ...onAction })
                .add(element)
                .in('body');
        });
        this.boxOpened = false;
        this.currentBox.remove();
        if (blackout)
            blackoutEl.blackout(false);
        return prom;
    }
    async Confirm(msg, blackout = false, onAction) {
        if (this._boxOpened())
            return false;
        this.boxOpened = true;
        let man = new ElementManager();
        let body = new ElementManager('body');
        if (blackout)
            body.blackout(true);
        this.currentBox = man;
        const prom = await new Promise(async (resolve, reject) => {
            const onActionDefault = {
                onAccept: () => resolve(man),
                oncancel: () => resolve(false)
            };
            if (onAction)
                onAction = { ...onActionDefault, ...onAction };
            else
                onAction = { ...onActionDefault };
            man.id('confirm-box')
                .global({ resolve: resolve, reject: reject, ...onAction })
                .class('space-between')
                .add(man.create('div').class('msg', 'color-primary', 'up-10', 'text-size-2').html(Utils.translate('Etes-vous sur?', 'Are you sure?')), man.create('div').class('margin-bottom-10').html(msg), man.create('div').id('btn-section-input').class('row').set('style', 'margin-top:20px;').add(man.create('button')
                .class('btn-primary', 'back-grad-green', 'back-set-1', 'color-black', 'margin-right-5')
                .html('accept')
                .event('click', () => this.accept()), man.create('button')
                .class('btn-primary', 'back-grad-red', 'back-set-1', 'color-white', 'margin-left-5')
                .html('cancel')
                .event('click', () => this.cancel()))).in(body);
        });
        man.remove();
        if (blackout)
            body.blackout(false);
        this.boxOpened = false;
        return prom;
    }
    async urlDataToBase64(url) {
        let res = await new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var reader = new FileReader();
                reader.onloadend = () => {
                    if (reader && reader.result)
                        resolve(reader.result.toString());
                    else
                        resolve(null);
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        });
        return res;
    }
    isInt(value) {
        return Number(value) === value && value % 1 === 0;
    }
    isFloat(value) {
        return Number(value) === value && value % 1 !== 0;
    }
    MajFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    MajWords(string) {
        return string.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    }
    ;
    RandomString(length = 10) {
        return Utils.RandomString(length);
    }
    static RandomString(length = 10) {
        var result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    preventDefault(e) {
        e.preventDefault();
    }
    disableScroll(element) {
        let arrayOfElement = [];
        if (element instanceof Element)
            arrayOfElement = Array(element);
        let self = this;
        arrayOfElement.forEach((el) => {
            el.addEventListener('DOMMouseScroll', this.preventDefault, false); // older FF
            el.addEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt); // modern desktop
            el.addEventListener('touchmove', this.preventDefault, this.wheelOpt); // mobile
        });
    }
    enableScroll(element) {
        if (element instanceof Element)
            element = [element];
        element.forEach((el) => {
            el.removeEventListener('DOMMouseScroll', this.preventDefault, false);
            el.removeEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt);
            el.removeEventListener('touchmove', this.preventDefault, this.wheelOpt);
        });
    }
    formatToDate(year, month, day) {
        return `${year}-${month}-${day}`;
    }
    CalculateAge(date) {
        let birthDate = new Date(date);
        let ageDifMs = Date.now() - birthDate.getTime();
        let ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    date(date) {
        return new DateManager(date);
    }
    static sideScroll(element) {
        let proxy;
        if (typeof element === 'string')
            proxy = document.querySelector(element);
        else
            proxy = element;
        if (!proxy)
            throw new Error('element not found');
        element = proxy;
        element.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY > 0)
                element.scrollLeft += 10;
            else
                element.scrollLeft -= 10;
        });
    }
    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    static bindval(eventType, value_selector, this_selector, defaultValue = '', bypassEventTrigger = false) {
        let proxy = null;
        proxy = typeof value_selector === 'string' ? document.querySelector(value_selector) : value_selector;
        if (!proxy)
            throw new Error('value_selector not found');
        value_selector = proxy;
        let proxy2 = null;
        proxy2 = typeof this_selector === 'string' ? document.querySelector(this_selector) : this_selector;
        if (!proxy2)
            throw new Error('this_selector not found');
        this_selector = proxy2;
        let val = value_selector.getAttribute('value');
        this_selector.setAttribute('value', val ? val : defaultValue);
        value_selector.addEventListener(eventType, e => {
            let value = value_selector.value;
            if (value == this_selector.value)
                return;
            this_selector.value = value ? value : defaultValue;
            if (!bypassEventTrigger)
                this_selector.dispatchEvent(new Event(eventType));
        });
    }
    static translate(fr, en) {
        if (LANGUAGE.includes('fr'))
            return fr;
        else
            return en;
    }
    static blackout(selector) {
        let man = new ElementManager(selector);
        let blackout = man.element.querySelector('.blackout');
        if (blackout != null)
            return blackout.remove();
        else
            return man.blackout(true);
    }
    static selectFromList(list, valueKey, htmlKey, element, clear = true) {
        if (typeof list === 'string')
            list = JSON.parse(list);
        list = list;
        element ? element : document.createElement('select');
        if (!element)
            return;
        else
            element = element;
        if (clear)
            element.innerHTML = '';
        for (let i = 0; i < list.length; i++) {
            let el = document.createElement('option');
            el.value = valueKey ? list[i][valueKey] : list[i];
            el.style.width = '100%';
            el.innerHTML = valueKey ? list[i][htmlKey] : list[i];
            element.appendChild(el);
        }
        return element;
    }
    static getCurrentRotation(el) {
        var st = window.getComputedStyle(el, null);
        var tr = st.getPropertyValue("-webkit-transform") ||
            st.getPropertyValue("-moz-transform") ||
            st.getPropertyValue("-ms-transform") ||
            st.getPropertyValue("-o-transform") ||
            st.getPropertyValue("transform") ||
            "FAIL";
        try {
            var values = tr.split('(')[1].split(')')[0].split(',');
            var a = values[0];
            var b = values[1];
            return Math.round(Math.atan2(b, a) * (180 / Math.PI));
        }
        catch (e) {
            return 0;
        }
    }
    static async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static getAngleFromPoints(cx, cy, ex, ey) {
        var dy = ey - cy;
        var dx = ex - cx;
        var theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        //if (theta < 0) theta = 360 + theta; // range [0, 360)
        return theta;
    }
    static pxPositionToPercent(element) {
        let man = new ElementManager(element);
        const top = parseInt(man.css('top'));
        const left = parseInt(man.css('left'));
        const parentDim = man.element.parentElement?.getBoundingClientRect();
        if (!parentDim)
            throw new Error('element as no parent element to refer as');
        const parentWidth = parentDim.width;
        const parentHeight = parentDim.height;
        return {
            left: ((left) / parentWidth) * 100,
            top: ((top) / parentHeight) * 100
        };
    }
    static pxDimensionsToPercent(element) {
        let man = new ElementManager(element);
        const width = parseInt(man.css('width'));
        const height = parseInt(man.css('height'));
        const parentDim = man.element.parentElement?.getBoundingClientRect();
        if (!parentDim)
            throw new Error('element as no parent element to refer as');
        return {
            width: ((width) / parentDim.width) * 100,
            height: ((height) / parentDim.height) * 100
        };
    }
    static getMethods(obj) {
        return Object.getOwnPropertyNames(obj).filter(item => typeof obj[item] === 'function');
    }
}
class PageController {
    WebAppVersion = '1.0.0';
    SelectedID;
    pageList = [];
    elementSelector = null;
    localStorage = false;
    pagename_list = [];
    pathlist;
    history = [];
    OnRenderCallbackList = [];
    optionsMenuList = [];
    optionsMenuListOpen = [];
    return;
    OptionOpenCallback = () => { };
    OptionCloseCallback = () => { };
    OptionIDList = [];
    isModule = false;
    isDoneList = {};
    constructor(id = 0) {
        this.SelectedID = id;
        this.pathlist = {
            js: 'js/',
            css: 'css/',
            html: 'html/'
        };
        this.return = new ReturnManager();
        this.return.callback(() => this.closeOption());
    }
    isDone(id) {
        return this.isDoneList[id];
    }
    id(id) {
        this.SelectedID = id;
        return this;
    }
    CheckUpdateVersion() {
        if (this.WebAppVersion != localStorage.getItem('WebAppVersion')) {
            localStorage.removeItem(STORAGE_NAME);
            localStorage.setItem('WebAppVersion', this.WebAppVersion);
        }
    }
    jsPath(path = 'js/') {
        path = path.endsWith('/') ? path : path + '/';
        this.pathlist.js = path;
        return this;
    }
    cssPath(path = 'css/') {
        path = path.endsWith('/') ? path : path + '/';
        this.pathlist.css = path;
        return this;
    }
    htmlPath(path = 'html/') {
        path = path.endsWith('/') ? path : path + '/';
        this.pathlist.html = path;
        return this;
    }
    /**
     *
     * @param {string} html html path (defaulted to 'html/')
     * @param {string} css css path (defaulted to 'css/')
     * @param {string} js js path (defaulted to 'js/')
     * @returns this instance
     */
    paths(html, css, js) {
        html = html.endsWith('/') ? html : html + '/';
        css = css.endsWith('/') ? css : css + '/';
        js = js.endsWith('/') ? js : js + '/';
        this.pathlist.html = html;
        this.pathlist.css = css;
        this.pathlist.js = js;
        return this;
    }
    /**
     *
     * @param {string} pageContainer Selecor of the page container
     * @param {bool} localStore save pages in localStorage for fast loading but more memory consuming default to false
     * @param {string} js_path Path to the js files root folder defaulted to 'js/'
     * @param {string} css_path Path to the css files root folder defaulted to 'css/'
     * @param {string} html_path Path to the html files root folder defaulted to 'html/'
     */
    setOptions(pageContainer, localStore = false, js_path = 'js/', css_path = 'css/', html_path = 'html/') {
        this.elementSelector = pageContainer;
        this.pathlist.js = js_path;
        this.pathlist.css = css_path;
        this.pathlist.html = html_path;
        this.localStorage = localStore;
        this.CheckUpdateVersion();
        if (localStore && localStorage.getItem(STORAGE_NAME) == null)
            localStorage.setItem(STORAGE_NAME, JSON.stringify(Array()));
        else if (localStore) {
            let proxy = localStorage.getItem(STORAGE_NAME);
            if (proxy != null)
                this.pageList = JSON.parse(proxy);
        }
        return this;
    }
    /**
     * Load in memory the html page and its js and css files
     * @param {Array} html html files to load
     * @param {Array} js js files to load
     * @param {Array} css css files to load
     */
    async AddPage(html = Array(), js = Array(), css = Array()) {
        if (!this.SelectedID)
            throw new Error('no SelectedID set');
        let resolver;
        let utils = new Utils();
        this.isDoneList[this.SelectedID] = new Promise((resolve) => resolver = resolve);
        let array_page = {
            id: this.SelectedID,
            html_name: html,
            js_name: js,
            css_name: css,
        };
        const index = this.pageList.find(e => e.id == this.SelectedID);
        if (typeof index != 'undefined')
            array_page = index;
        else
            this.pageList.push(array_page);
        let self = this;
        let res;
        for await (const page of html) {
            if (!self.AddToPageNameList(page))
                continue;
            res = await utils.Get(self.pathlist.html + page);
            if (res === false)
                throw new Error(`Page: '${self.pathlist.html}${page}' not found`);
            this.AddContentToPageNameList(page, res);
        }
        for await (const page of css) {
            if (!self.AddToPageNameList(page))
                continue;
            res = await utils.Get(self.pathlist.css + page);
            if (res === false)
                throw new Error(`Page: '${self.pathlist.css}${page}' not found`);
            this.AddContentToPageNameList(page, res);
        }
        for await (const page of js) {
            if (!self.AddToPageNameList(page))
                continue;
            res = await utils.Get(self.pathlist.js + page);
            if (res === false)
                throw new Error(`Page: '${self.pathlist.js}${page}' not found`);
            this.AddContentToPageNameList(page, res);
        }
        resolver(this);
        if (this.localStorage)
            localStorage.setItem(STORAGE_NAME, JSON.stringify(self.pagename_list));
        return this;
    }
    AddToPageNameList(name = '') {
        if (this.pagename_list.findIndex(el => el.name == name) != -1)
            return false;
        this.pagename_list.push({ name: name, content: '' });
        return true;
    }
    async AddContentToPageNameList(name = '', content = '') {
        for (let i = 0; i < this.pagename_list.length; i++) {
            if (this.pagename_list[i].name == name) {
                this.pagename_list[i].content = content;
                return;
            }
        }
        throw new Error(`Page: '${name}' not found`);
    }
    findPageList(id = '') {
        let page = this.pageList.find(el => el.id == id);
        if (!page)
            throw new Error(`Page: '${id}' not found`);
        return page;
    }
    async getPageListContant(id, pageListname) {
        await this.isDoneList[id];
        for (let i = 0; i < this.pagename_list.length; i++) {
            const page = this.pagename_list[i];
            if (page.name === pageListname)
                return page.content;
        }
        throw new Error(`Page: '${pageListname}' not found`);
    }
    modifyContantPageNameList(pageListname = '', newContent = '') {
        let data = this.pagename_list.find(el => el.name === pageListname);
        if (!data)
            throw new Error(`Page: '${pageListname}' not found`);
        data.content = newContent;
    }
    /**
     * Show the page into the selected element
     * @param {string} selector Selector of the element where to show the page default is the element set in setPageOptions
     */
    async render(selector = null, callback = () => { }, isModule = false) {
        if (!this.SelectedID)
            throw new Error(`Page: '${this.SelectedID}' not found`);
        let id = this.SelectedID;
        await this.isDoneList[this.SelectedID];
        this.OptionReset();
        this.history.push(id);
        let elem = null;
        if (!selector)
            selector = this.elementSelector;
        if (typeof selector == 'string')
            elem = document.querySelector(selector);
        else
            elem = selector;
        if (elem != null)
            elem = new ElementManager(elem);
        else
            throw new Error(`Element: '${selector}' not found`);
        elem.clear();
        let pageList = this.pageList.find(el => el.id == id);
        if (!pageList)
            throw new Error(`Page: '${id}' not found`);
        for (let i = 0; i < pageList.html_name.length; i++) {
            let content = this.pagename_list.find(el => el.name == pageList.html_name[i])?.content || '';
            elem.plainhtml(elem._html() + content);
        }
        for (let i = 0; i < pageList.css_name.length; i++) {
            elem.add(elem.create('style')
                .plainhtml(this.pagename_list.find(el => el.name == pageList.css_name[i])?.content || ''));
        }
        for (let i = 0; i < pageList.js_name.length; i++) {
            elem.add(elem.create('script')
                .set('type', isModule ? 'module' : 'text/javascript')
                .plainhtml(this.pagename_list.find(el => el.name == pageList.js_name[i])?.content || ''));
        }
        callback();
        this.OnRenderCallbackList.forEach((el) => {
            if (el.id === id)
                el.callback(el.id);
        });
        let e = elem.element.querySelectorAll('*');
        for (let i = 0; i < e.length; i++) {
            if (e[i].onload)
                e[i].onload();
        }
    }
    /**
     *
     * @param {function} callback call when the page is rendered
     * - Select id of the callback for modify it
     */
    onRender(callback) {
        if (!this.SelectedID)
            throw new Error('SelectedID is not set');
        this.OnRenderCallbackList.push({
            id: this.SelectedID,
            callback: callback
        });
        return this;
    }
    getHistory(fromlast = 1) {
        fromlast = fromlast + 1;
        return this.history[this.history.length - fromlast];
    }
    getid() {
        return this.SelectedID;
    }
    createOptionMenu(selector, open_callback = () => { }, close_callback = () => { }, layer = 1, side = 'right') {
        let menu = document.querySelector(selector);
        if (!menu)
            throw new Error(`Element: '${selector}' not found`);
        else if (!this.SelectedID)
            throw new Error(`The id is not set`);
        if (!this.OptionIDList.includes(this.SelectedID)) {
            this.OptionIDList.push(this.SelectedID);
            this.optionsMenuList.push({
                id: this.SelectedID,
                element: menu,
                side: side,
                opencallback: open_callback,
                closecallback: close_callback
            });
        }
        else {
            let index = this.optionsMenuList.findIndex(el => el.id == this.SelectedID);
            this.optionsMenuList[index] = {
                id: this.SelectedID,
                element: menu,
                side: side,
                opencallback: open_callback,
                closecallback: close_callback
            };
        }
        menu.classList.add('options-pages');
        menu.style.position = 'fixed';
        menu.style.zIndex = (layer + 1).toString();
        menu.style.width = '100%';
        menu.style.height = '100%';
        menu.style.display = 'flex';
        menu.style.top = '0';
        if (side == 'right') {
            menu.style.right = '0';
            menu.style.transform = 'translateX(110%)';
        }
        else {
            menu.style.left = '0';
            menu.style.transform = 'translateX(-110%)';
        }
    }
    openOption(callback_data = {}) {
        let res = this.optionsMenuList.find(opt => opt.id === this.SelectedID);
        if (!res)
            return;
        res.element.style.transform = 'translateX(0%)';
        if (res.opencallback)
            res.opencallback(res.element, callback_data);
        if (this.OptionOpenCallback && this.optionsMenuListOpen.length == 0)
            this.OptionOpenCallback(res.element, callback_data);
        this.optionsMenuListOpen.push(res.id);
        this.return.add();
    }
    closeOption() {
        let res = this.optionsMenuList.find(opt => opt.id === this.SelectedID);
        if (this.SelectedID === false)
            return;
        else if (!res)
            throw new Error(`ID: ${this.SelectedID} not found in optionsMenuList`);
        if (res.side == 'right')
            res.element.style.transform = 'translateX(100%)';
        else
            res.element.style.transform = 'translateX(-100%)';
        if (res.closecallback)
            res.closecallback(res.element);
        this.optionsMenuListOpen.splice(this.optionsMenuListOpen.indexOf(res.id), 1);
        if (this.optionsMenuListOpen.length == 0) {
            this.return.reset();
            this.OptionCloseCallback();
        }
        else {
            if (!this.SelectedID)
                return;
            let proxy = this.optionsMenuListOpen.at(-1);
            if (!proxy)
                return;
            this.SelectedID = proxy;
            this.return.add();
        }
    }
    OnOptionOpen(callback) {
        this.OptionOpenCallback = callback;
        return this;
    }
    OnOptionClose(callback) {
        this.OptionCloseCallback = callback;
        return this;
    }
    OptionReset() {
        this.optionsMenuListOpen = Array();
        this.optionsMenuList = Array();
        this.SelectedID = false;
        this.OptionOpenCallback = () => { };
        this.OptionCloseCallback = () => { };
        this.OptionIDList = Array();
    }
}
class ContextualMenu {
    elements;
    clickside;
    mobileCompatible;
    SelectedElement = null;
    man = new ElementManager();
    clickPosition = { x: 0, y: 0 };
    menuIsOpen = false;
    constructor(selector, clickside = 'right', mobileCompatible = true) {
        if (typeof selector == 'string')
            this.elements = document.querySelectorAll(selector);
        else if (selector instanceof Element)
            this.elements = [selector];
        this.elements = this.elements;
        this.clickside = clickside;
        this.mobileCompatible = mobileCompatible;
        this.init();
    }
    init() {
        this.man.destroyChildren();
        for (var i = 0; i < this.elements.length; i++) {
            if (this.clickside == 'left') {
                this.elements[i].addEventListener('click', (event) => {
                    let e = event;
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    let target = e.target;
                    if (!target)
                        return;
                    this.SelectedElement = target;
                    this.clickPosition = { x: e.pageX, y: e.pageY };
                    this.menuIsOpen ? this.close() : this.open();
                });
                this.elements[i].addEventListener('contextmenu', () => {
                    this.close();
                });
            }
            else if (this.clickside == 'right') {
                this.elements[i].addEventListener('contextmenu', (event) => {
                    let e = event;
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    let target = e.target;
                    if (!target)
                        return;
                    this.SelectedElement = target;
                    this.clickPosition = { x: e.pageX, y: e.pageY };
                    this.menuIsOpen ? this.close() : this.open();
                });
                this.elements[i].addEventListener('click', () => this.close());
            }
            let isTouched = false;
            let Timout = false;
            if (this.mobileCompatible) {
                this.elements[i].addEventListener('touchstart', (event) => {
                    if (isTouched || Timout)
                        return;
                    let e = event;
                    event.stopPropagation();
                    isTouched = true;
                    Timout = true;
                    setTimeout(() => {
                        Timout = false;
                        if (!isTouched || !event.target)
                            return;
                        this.SelectedElement = event.target;
                        self.open();
                    }, 1000);
                });
                this.elements[i].addEventListener('touchend', (event) => {
                    event.stopPropagation();
                    isTouched = false;
                });
            }
        }
        document.addEventListener('click', (event) => { this.close(); });
        document.addEventListener('contextmenu', (event) => {
            if (!this.menuIsOpen)
                return;
            this.close();
        });
        this.man.class('contextual-menu-container', 'closed').in('body');
    }
    /**
     *
     * @param {string} icon icon to display can be a svg url or a plain html
     * @param {string} text the text to display in the button
     * @param {function} callback will be called when the button is clicked (elementClicked) => {}
     * @returns {ContextualMenu} this instance
     */
    add(icon = '', text, callback) {
        if (icon.endsWith('.svg'))
            icon = `<img src="${icon}"/>`;
        this.man.add(this.man.create('button').add(this.man.create('div').class('contextual-menu-item-icon', 'margin-right-10').plainhtml(icon), this.man.create('div').class('contextual-menu-item-text').plainhtml(text)).event('click', (self, e) => {
            e.preventDefault(); // prevent
            e.stopImmediatePropagation(); // stop propagation
            if (!this.SelectedElement)
                return;
            callback(this.SelectedElement);
            this.close();
        }).class('contextual-menu-item'));
        return this;
    }
    open() {
        if (this.menuIsOpen)
            return;
        this.man.in('body');
        this.man.set('style', `top: ${this.clickPosition.y}px; left: ${this.clickPosition.x}px`);
        const position = this.man.element.getBoundingClientRect();
        if (position.width + position.left > window.innerWidth) {
            const newWidth = (position.width + position.left) - (window.innerWidth);
            this.man.set('style', `
            top: ${this.clickPosition.y}px; 
            left: ${this.clickPosition.x - newWidth}px;
            `);
        }
        this.menuIsOpen = true;
        this.man.classSwitch('opened', 'closed', 'opened');
    }
    close() {
        if (!this.menuIsOpen)
            return;
        this.man.classSwitch('closed', 'opened', 'closed');
        this.menuIsOpen = false;
    }
}
class Security /* DONE */ {
    string = '';
    status = false;
    constructor() {
    }
    SanitizeXSS(string) {
        this.string = string.toString();
        if (this.string != this.string.replaceAll('<', '&lt;').replaceAll('>', '&gt;'))
            this.status = false;
        return this.string.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    }
}
class WSManager extends Utils {
    callbackList = Array();
    WebSocketObject = null;
    wsActive = false;
    isActive = false;
    onopenCustom = () => { };
    oncloseCustom = () => { };
    onmessageCustom = () => { };
    onerrorCustom = () => { };
    connectInterval = 0;
    intervalcounter = 0;
    url = '';
    constructor() {
        super();
    }
    Init() {
        if (this.wsActive || !this.isActive)
            return;
        else {
            this.WebSocketObject = new WebSocket(this.url);
            this.WebSocketObject.onopen = () => { this.wsActive = true; this.onopenCustom(); };
            this.WebSocketObject.onclose = () => { this.wsActive = false; this.oncloseCustom(); };
            this.WebSocketObject.onerror = () => { this.wsActive = false; this.onerrorCustom(); };
            this.WebSocketObject.onmessage = (msg) => {
                let data = JSON.parse(msg.data);
                let index = this.callbackList.findIndex(el => el.action == data.action);
                if (index != -1)
                    this.callbackList[index]['callback'](data.data);
                else
                    console.log(data);
            };
        }
    }
    isOn() {
        return this.wsActive;
    }
    start(url) {
        this.url = url;
        this.isActive = true;
        this.Init();
        this.connectInterval = setInterval(() => {
            this.Init();
            this.intervalcounter++;
            if (this.intervalcounter > 10) {
                clearInterval(this.connectInterval);
                this.intervalcounter = 0;
                this.isActive = false;
                this.WarningMsg('Connection error with messaging server');
            }
        }, 10000);
    }
    stop() {
        if (!this.isActive)
            return false;
        if (this.WebSocketObject)
            this.WebSocketObject.close(1000);
        clearInterval(this.connectInterval);
        this.isActive = false;
    }
    onopen(callback) {
        this.onopenCustom = callback;
    }
    onclose(callback) {
        this.oncloseCustom = callback;
    }
    onerror(callback) {
        this.onerrorCustom = callback;
    }
    AddAction(actionStr, callback) {
        const index = this.callbackList.findIndex(el => el.action == actionStr);
        if (index != -1) {
            this.callbackList[index]['callback'] = callback;
            return;
        }
        else {
            this.callbackList.push({
                action: actionStr,
                callback: callback
            });
        }
    }
    send(action, data, callback = () => { }) {
        if (!this.WebSocketObject) {
            this.WarningMsg('WebSocket not initialized', 'red');
            return;
        }
        this.WebSocketObject.send(JSON.stringify({
            action: action,
            data: data
        }));
        setTimeout(() => {
            if (!this.wsActive)
                this.WarningMsg('Failed to send data to server', 'red');
            callback(this.wsActive);
        }, 1000);
    }
}
class UserManager {
    userdata = {};
    isLoged = false;
}
class InteractionManager {
    SelectedElement;
    startFrom;
    pressed;
    wordlist = [];
    constructor(selector = false) {
        this.SelectedElement = null;
        if (typeof selector === 'string')
            this.SelectedElement = document.querySelector(selector);
        else if (selector instanceof Element)
            this.SelectedElement = selector;
        this.startFrom = 0;
        this.pressed = false;
    }
    SetInfoBox(text) {
        if (this.SelectedElement == null)
            return;
        const el = this.SelectedElement.getBoundingClientRect();
        let opts = {
            width: 'fit-content',
            height: 'fit-content',
            color: 'black',
            backgroundColor: 'white',
            top: el.top + el.height + 'px',
            left: el.left + el.width + 'px',
            position: 'absolute',
            display: 'flex'
        };
        const infoBox = document.createElement('div');
        infoBox.className = 'info-box';
        infoBox.innerHTML = text;
        document.body.appendChild(infoBox);
        Object.keys(opts).forEach((el, val) => {
            infoBox.style[el] = opts[el];
        });
    }
    Slide(callback, fromSide = 'left', Pxtreshold = 50) {
        if (this.SelectedElement === null)
            return;
        const onTouchstart = (event) => {
            this.pressed = true;
            this.startFrom = event.touches[0].clientX;
        };
        const onTouchMove = (event) => {
            if (!this.pressed)
                return;
            const movePositionX = event.touches[0].clientX;
            const movePositionY = event.touches[0].clientY;
            switch (fromSide) {
                case 'left':
                    if (movePositionX - this.startFrom > Pxtreshold) {
                        callback();
                        this.pressed = false;
                    }
                    break;
                case 'right':
                    if (this.startFrom - movePositionX > Pxtreshold) {
                        callback();
                        this.pressed = false;
                    }
                    break;
                case 'top':
                    if (this.startFrom - movePositionY > Pxtreshold) {
                        callback();
                        this.pressed = false;
                    }
                    break;
                case 'bottom':
                    if (movePositionY - this.startFrom > Pxtreshold) {
                        callback();
                        this.pressed = false;
                    }
                    break;
                default:
                    break;
            }
        };
        this.SelectedElement.addEventListener('touchstart', (e) => onTouchstart);
        this.SelectedElement.addEventListener('touchend', (e) => this.pressed = false);
        this.SelectedElement.addEventListener('touchmove', (e) => ontouchmove);
    }
    TextCalculator(display_selector, maxLen = 100) {
        if (this.SelectedElement == null)
            return;
        let text = this.SelectedElement;
        let val = text.getAttribute('value');
        let len = 0;
        if (val === null)
            val = '';
        if (val)
            len = parseInt(val);
        if (typeof display_selector == 'string') {
            let elem = document.querySelector(display_selector);
            if (!elem)
                return;
            else
                display_selector = elem;
        }
        text.addEventListener('input', (e) => {
            len = text.value.length;
            display_selector.innerHTML = `${len}/${maxLen}`;
            if (len > maxLen - 1) {
                val = text.value;
                if (val === null)
                    val = '';
                text.value = val.slice(0, maxLen - 1);
            }
        });
        display_selector.innerHTML = `${len}/${maxLen}`;
    }
    LiveReload(wordlist, initer) {
        if (this.SelectedElement == null)
            return;
        let man = new ElementManager('div');
        let selected;
        this.wordlist = wordlist;
        const makeElements = async () => {
            const filterdWordLsit = this.wordlist.filter(el => el.startsWith(selected._val()) === true);
            initer?.onInput ? initer.onInput(filterdWordLsit) : null;
            man.destroyChildren();
            if (selected._val().length < 1)
                return;
            for await (const word of filterdWordLsit)
                man.add(man.create('div').style({
                    width: '100%',
                    maxHeight: '20px',
                    height: '20px',
                    margin: '3px 0',
                    display: 'flex',
                    borderTop: '1px solid black',
                    borderBottom: '1px solid black',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer'
                })
                    .event('click', () => {
                    man.destroyChildren();
                    selected.val(word);
                    initer?.onSelect ? initer.onSelect(word) : null;
                })
                    .html(word));
            redimention();
        };
        const redimention = () => {
            const dim = this.SelectedElement?.getBoundingClientRect();
            if (!dim)
                return;
            man.style({
                width: `${dim.width}px`,
                maxHeight: '200px',
                overflow: 'auto',
                position: 'absolute',
                top: `${dim.top + dim.height}px`,
                left: `${dim.left}px`,
                display: 'flex',
                flexDirection: 'column',
                background: 'white',
                transition: 'none'
            });
        };
        window.addEventListener('resize', redimention);
        selected = new ElementManager(this.SelectedElement)
            .event("input", () => { makeElements(); })
            .event('focus', () => { makeElements(); })
            .event('blur', () => { setTimeout(() => man.destroyChildren(), 200); });
        return {
            setWordlist: (wordlist) => { this.wordlist = wordlist; }
        };
    }
    Fold(fold = false, height = false, width = false) {
        let el = this.SelectedElement;
        if (!el)
            return;
        el.style.transition = 'all 0.5s ease-in-out';
        if (fold) {
            if (height)
                el.style.height = height.toString();
            if (width)
                el.style.width = width.toString();
            el.style.overflowY = 'hidden';
        }
        else {
            if (height)
                el.style.height = height.toString();
            if (width)
                el.style.width = width.toString();
            el.style.overflowY = 'auto';
        }
    }
}
;
class ResizableElement {
    onResizeCallback;
    onSideResizeCallback;
    onSquareResizeCallback;
    permanantMove;
    man;
    call = () => { };
    caller = (e) => this.call(e);
    dropEvent;
    hasmoved = false;
    active = false;
    dragPreventDefault;
    /**
     *
     * @param {Node|string|boolean} element The element to be resizable
     * @param {function|boolean} onResizeCallback(ElementManager) The callback to be called when the element is resized
     * @example new ResizableElement(element, (ElementManager_Of_The_Selected_Element) => {some code...})
    */
    constructor(element, permanantMove = false, onResizeCallback, onSideResize = () => { }, onSquareResize = () => { }) {
        this.onResizeCallback = onResizeCallback;
        this.onSideResizeCallback = onSideResize;
        this.onSquareResizeCallback = onSquareResize;
        this.permanantMove = permanantMove;
        this.man = new ElementManager(element, false);
        this.dropEvent = () => {
            this.man.data.active = false;
            if (this.hasmoved)
                this.onResizeCallback(this._makeData());
            this.man.data.lastMovementX = 0;
            this.man.data.lastMovementY = 0;
            this.hasmoved = false;
        };
        this.dragPreventDefault = (e) => {
            e.preventDefault();
        };
    }
    _makeData() {
        return {
            width: parseInt(this.man.data.width),
            height: parseInt(this.man.data.height),
            left: (this.man.element.offsetLeft + this.man.data.lastMovementX),
            top: (this.man.element.offsetTop + this.man.data.lastMovementY)
        };
    }
    start() {
        if (this.active)
            return;
        this.active = true;
        const commonStyle = {
            position: 'absolute',
            width: '10px',
            height: '10px',
            border: '1px solid red',
            backgroundColor: 'white',
            zIndex: '10',
            borderRadius: '10px',
        };
        this.man
            .style({ transition: 'none' })
            .setdata({ lastMovementX: 0, lastMovementY: 0, treshold: 10 })
            .add(this.man.create('div', false)
            .style({
            ...commonStyle,
            top: '0',
            left: '0',
            transform: 'translate(-50%, -50%)',
            cursor: 'se-resize'
        }).event('mousedown', (self, e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hasmoved = true;
            this.call = (e) => {
                if (!self.mouse.isClick())
                    return;
                let newX = e.movementX + this.man.data.lastMovementX;
                let newY = e.movementY + this.man.data.lastMovementY;
                let width = parseInt(this.man.css('width').toString()) - e.movementX;
                let height = parseInt(this.man.css('height').toString()) - e.movementY;
                this.man.style({
                    transform: `rotate(${Utils.getCurrentRotation(this.man.element)}deg) translate(${newX}px, ${newY}px)`,
                    width: `${width}px`,
                    height: `${height}px`,
                });
                this.man.data.lastMovementX = newX;
                this.man.data.lastMovementY = newY;
                this.man.data.width = width;
                this.man.data.height = height;
                if (this.onSquareResizeCallback)
                    this.onSquareResizeCallback(this._makeData());
            };
        }).make('top-left'), this.man.create('div', false)
            .style({
            ...commonStyle,
            top: '0',
            right: '0',
            transform: 'translate(50%, -50%)',
            cursor: 'ne-resize'
        })
            .event('mousedown', (self, e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hasmoved = true;
            this.call = (e) => {
                if (!self.mouse.isClick())
                    return;
                const newY = this.man.data.lastMovementY + e.movementY;
                const width = parseInt(this.man.css('width').toString()) + e.movementX;
                const height = parseInt(this.man.css('height').toString()) - e.movementY;
                this.man.style({
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: `translateY(${newY}px) rotate(${Utils.getCurrentRotation(this.man.element)}deg)`,
                });
                this.man.data.lastMovementY = newY;
                this.man.data.width = width;
                this.man.data.height = height;
                if (this.onSquareResizeCallback)
                    this.onSquareResizeCallback(this._makeData());
            };
        })
            .make('top-right'), this.man.create('div', false)
            .style({
            ...commonStyle,
            bottom: '0',
            right: '0',
            transform: 'translate(50%, 50%)',
            cursor: 'se-resize'
        }).event('mousedown', (self, e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hasmoved = true;
            this.call = (e) => {
                if (!self.mouse.isClick())
                    return;
                const height = parseInt(this.man.css('height').toString()) + e.movementY;
                const width = parseInt(this.man.css('width').toString()) + e.movementX;
                this.man.style({
                    height: `${height}px`,
                    width: `${width}px`,
                });
                this.man.data.width = width;
                this.man.data.height = height;
                if (this.onSquareResizeCallback)
                    this.onSquareResizeCallback(this._makeData());
            };
        }).make('bottom-right'), this.man.create('div', false)
            .style({
            ...commonStyle,
            bottom: '0',
            left: '0',
            transform: 'translate(-50%, 50%)',
            cursor: 'ne-resize'
        })
            .event('mousedown', (self, e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hasmoved = true;
            this.call = (e) => {
                if (!self.mouse.isClick())
                    return;
                const newX = this.man.data.lastMovementX + e.movementX;
                const height = parseInt(this.man.css('height').toString()) + e.movementY;
                const width = parseInt(this.man.css('width').toString()) - e.movementX;
                this.man.style({
                    height: `${height}px`,
                    width: `${width}px`,
                    transform: `translateX(${newX}px) rotate(${Utils.getCurrentRotation(this.man.element)}deg)`,
                });
                this.man.data.lastMovementX = newX;
                this.man.data.width = width;
                this.man.data.height = height;
                if (this.onSquareResizeCallback)
                    this.onSquareResizeCallback(this._makeData());
            };
        })
            .make('bottom-left'), this.man.create('div', false)
            .style({
            ...commonStyle,
            left: '50%',
            top: '0',
            transform: 'translate(-50%, -50%)',
            cursor: 'row-resize'
        })
            .event('mousedown', (self, e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hasmoved = true;
            this.call = (e) => {
                if (!self.mouse.isClick())
                    return;
                const newY = this.man.data.lastMovementY + e.movementY;
                const height = parseInt(this.man.css('height').toString()) - e.movementY;
                this.man.style({
                    height: `${height}px`,
                    transform: `translateY(${newY}px) rotate(${Utils.getCurrentRotation(this.man.element)}deg)`,
                });
                this.man.data.lastMovementY = newY;
                this.man.data.width = null;
                this.man.data.height = height;
            };
        }), this.man.create('div', false)
            .style({
            ...commonStyle,
            right: '0',
            top: '50%',
            transform: 'translate(50%, -50%)',
            cursor: 'col-resize'
        })
            .event('mousedown', (self, e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hasmoved = true;
            this.call = (e) => {
                if (!self.mouse.isClick())
                    return;
                const width = parseInt(this.man.css('width').toString()) + e.movementX;
                this.man.style({
                    width: `${width}px`,
                    transform: `translateX(${e.movementX}px) rotate(${Utils.getCurrentRotation(this.man.element)}deg)`,
                });
                this.man.data.width = width;
                this.man.data.height = null;
                this.man.data.lastMovementX = e.movementX;
            };
        }), this.man.create('div', false)
            .style({
            ...commonStyle,
            left: '50%',
            bottom: '0',
            transform: 'translate(-50%, 50%)',
            cursor: 'row-resize'
        })
            .event('mousedown', (self, e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hasmoved = true;
            this.call = (e) => {
                if (!self.mouse.isClick())
                    return;
                const height = parseInt(this.man.css('height').toString()) + e.movementY;
                this.man.style({
                    height: `${height}px`,
                    transform: `translateY(${e.movementY}px) rotate(${Utils.getCurrentRotation(this.man.element)}deg)`,
                });
                this.man.data.height = height;
                this.man.data.width = null;
                this.man.data.lastMovementY = e.movementY;
            };
        }), this.man.create('div', false)
            .style({
            ...commonStyle,
            left: '0',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: 'col-resize'
        })
            .event('mousedown', (self, e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hasmoved = true;
            this.call = (e) => {
                if (!self.mouse.isClick())
                    return;
                const width = parseInt(this.man.css('width').toString()) - e.movementX;
                let newX = this.man.data.lastMovementX + e.movementX;
                this.man.style({
                    width: `${width}px`,
                    transform: `translateX(${newX}px) rotate(${Utils.getCurrentRotation(this.man.element)}deg)`,
                });
                this.man.data.width = width;
                this.man.data.height = null;
                this.man.data.lastMovementX = newX;
            };
        }))
            .event('mousemove', (self, event) => {
            if (!this.active)
                return;
            let e = event;
            const x = e.offsetX;
            const y = e.offsetY;
            const element = {
                x: parseInt(this.man.css('left').toString()),
                y: parseInt(this.man.css('top').toString()),
                width: parseInt(this.man.css('width').toString()),
                height: parseInt(this.man.css('height').toString()),
            };
            if (self.mouse.isClick() && this.onSideResizeCallback)
                this.onSideResizeCallback(this._makeData());
        });
        document.addEventListener('mousemove', this.caller);
        document.addEventListener('mouseup', this.dropEvent);
        document.addEventListener('dragstart', this.dragPreventDefault);
    }
    stop() {
        if (!this.active)
            return;
        this.active = false;
        this.man.style({ cursor: '' });
        this.man.resetEvents();
        this.man.children().forEach(e => e.destroy());
        document.removeEventListener('mouseup', this.dropEvent);
        document.removeEventListener('dragstart', this.dragPreventDefault);
        document.removeEventListener('mousemove', this.caller);
    }
}
class DragableElement {
    SelectedElement = null;
    movecallback;
    endMoveCallback;
    permanantMove = false;
    hasmoved = false;
    initialStyle;
    man = new ElementManager;
    call = () => { };
    documentEvent;
    documentMove;
    active = false;
    enable = true;
    currentDeg = 0;
    constructor(element, permanantMove = false, onMoveCallback = () => { }, onEndMoveCallback = () => { }) {
        this.movecallback = onMoveCallback;
        this.endMoveCallback = onEndMoveCallback;
        this.permanantMove = permanantMove;
        this.documentEvent = () => {
            if (!this.hasmoved)
                return this.man.setdata({ lastMovementX: 0, lastMovementY: 0 });
            if (!this.permanantMove)
                this.man.element.setAttribute('style', this.initialStyle);
            else {
                this.man.style({
                    top: (this.man.element.offsetTop + this.man.data.lastMovementY) + 'px',
                    left: (this.man.element.offsetLeft + this.man.data.lastMovementX) + 'px',
                    transform: '',
                });
            }
            if (this.hasmoved) {
                this.endMoveCallback({
                    element: this.man,
                    left: this.man.element.offsetLeft + this.man.data.lastMovementX,
                    top: this.man.element.offsetTop + this.man.data.lastMovementY,
                });
            }
            if (this.SelectedElement)
                this.initialStyle = this.SelectedElement.getAttribute('style');
            this.man.setdata({ lastMovementX: 0, lastMovementY: 0 });
            this.hasmoved = false;
        };
        this.documentMove = (e) => this.call(e);
        element ? this._init(element) : null;
    }
    _init(element) {
        if (element) {
            let proxy = typeof element === 'string' ? document.querySelector(element) : element;
            if (!proxy)
                throw new Error('Element not found');
            this.SelectedElement = proxy;
            this.man = new ElementManager(this.SelectedElement, false);
        }
        this.initialStyle = this.SelectedElement.getAttribute('style');
    }
    async start(element = false) {
        if (this.active)
            return;
        if (!element)
            element = this.SelectedElement ? this.SelectedElement : false;
        if (!element)
            return;
        this.active = true;
        this._init(element);
        this.man ?? new Error('DragableElement: element not found or setted');
        document.addEventListener('mousemove', this.documentMove);
        document.addEventListener('mouseup', this.documentEvent);
        this.man.style({ transition: 'none' });
        this.man.event('mousedown', (self, e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!this.SelectedElement)
                return;
            if (e.button != 0) {
                this.call = () => { };
                return;
            }
            this.initialStyle = this.SelectedElement.getAttribute('style');
            this.call = (event) => {
                let e = event;
                if (!self.mouse.isClick() || !this.enable)
                    return;
                this.hasmoved = true;
                this.man.data.lastMovementX = e.movementX + this.man.data.lastMovementX;
                this.man.data.lastMovementY = e.movementY + this.man.data.lastMovementY;
                self.style({
                    transform: `translate(${this.man.data.lastMovementX}px, ${this.man.data.lastMovementY}px) rotate(${Utils.getCurrentRotation(self.element)}deg)`,
                });
                this.movecallback({
                    left: this.man.data.lastMovementX,
                    top: this.man.data.lastMovementY,
                });
            };
        })
            .setdata({ lastMovementX: 0, lastMovementY: 0 });
    }
    stop() {
        if (!this.active)
            return;
        this.active = false;
        this.man.resetEvents();
        document.removeEventListener('mouseup', this.documentEvent);
        document.removeEventListener('mousemove', this.documentMove);
        this.man.style({ position: '' });
    }
}
class RotationableElement {
    onRotateCallback;
    man;
    manList;
    initialStyle = '';
    call = () => { };
    docuementEvent;
    documentEndMove;
    active = false;
    constructor(element, permanantMove = false, onRotateCallback = () => { }) {
        this.onRotateCallback = onRotateCallback;
        this.man = new ElementManager(element);
        this.manList = [];
        this.docuementEvent = (e) => { this.call(e); };
        this.documentEndMove = () => {
            if (!permanantMove)
                this.man.style({ transform: '' });
            if (this.onRotateCallback)
                this.onRotateCallback({
                    element: this.man,
                    deg: this.man.data.lastDeg,
                });
        };
    }
    start() {
        if (this.active)
            return;
        this.active = true;
        this.man ?? new Error('RotationableElement: element not found or setted');
        this.man.style({ transition: 'none' });
        this.man.add(this.man.create('div', false)
            .class('template-rotation-btn', 'rotate-cursor')
            .add(this.man.create('img')
            .set('src', Icon.svg('rotate'))
            .set('draggable', false)).event('mousedown', (self, e) => {
            e.preventDefault();
            e.stopPropagation();
            this.call = (e) => {
                if (!self.mouse.isClick())
                    return;
                this.man.data.lastDeg = (parseInt(this.man.data.lastDeg) - e.movementX) - e.movementY;
                let xyElement = {
                    x: ((this.man.element.offsetWidth / 2) + this.man.element.offsetLeft),
                    y: ((this.man.element.offsetHeight / 2) + this.man.element.offsetTop),
                };
                this.man.data.lastDeg = Utils.getAngleFromPoints(e.x, e.y, xyElement.x, xyElement.y) + 125;
                this.man.style({
                    transform: `rotate(${this.man.data.lastDeg}deg)`,
                });
            };
        })
            .style({
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translate(-50%, 150%)'
        }))
            .setdata({ lastDeg: Utils.getCurrentRotation(this.man.element) });
        document.addEventListener('mousemove', this.docuementEvent);
        document.addEventListener('mouseup', this.documentEndMove);
    }
    stop() {
        if (!this.active)
            return;
        this.active = false;
        this.man.children().forEach(e => e.destroy());
        this.man.style({ transition: '' });
        document.removeEventListener('mousemove', this.docuementEvent);
        document.removeEventListener('mouseup', this.documentEndMove);
    }
}
class AnimationManager {
    SelectedElement = Array();
    utils = new Utils();
    constructor() {
        this.SelectedElement;
        this.utils;
    }
    /**
     * @param {int} time duration of animation in ms
     * @param {Array} style Example: {opacity: {from:0, to:1, switch: 100}}} // switch is the time when the animation will switch between (from - to)
    */
    shake(time = 1000, style = { transform: { from: 'translateX(-10px)', to: 'translateX(10px)', switch: 100 } }, scrollToFisrt = false) {
        let isdone = false;
        let blinkerlist = Array();
        const styleKeys = Object.keys(style);
        if (scrollToFisrt && this.SelectedElement.length > 0)
            this.SelectedElement[0].scrollIntoView();
        this.SelectedElement.forEach((el, val) => {
            el.style.transition = 'all 0.1s ease-in-out';
            for (let i = 0; i < styleKeys.length; i++) {
                let key = styleKeys[i];
                blinkerlist.push(setInterval(() => {
                    if (!isdone)
                        el.style[key] = style[key].to;
                    setTimeout(() => {
                        if (!isdone)
                            el.style[key] = style[key].from;
                    }, style[key].switch);
                }, style[key].switch * 2));
            }
            setTimeout(() => {
                blinkerlist.forEach((blinker) => {
                    clearInterval(blinker);
                });
                isdone = true;
                styleKeys.forEach((key, val) => {
                    el.style[key] = '';
                    el.style.transition = '';
                });
                isdone = true;
            }, time);
        });
        return this;
    }
    switch(time = 1000, side = 'left', fade = false, callback = () => { }) {
        this.SelectedElement.forEach((el, val) => {
            el.style.transition = `all ${time}ms ease-in-out`;
            switch (side) {
                case 'left':
                    el.style.transform = 'translateX(-100%)';
                    break;
                case 'right':
                    el.style.transform = 'translateX(100%)';
                    break;
                case 'top':
                    el.style.transform = 'translateY(-100%)';
                    break;
                case 'bottom':
                    el.style.transform = 'translateY(100%)';
                    break;
            }
            if (fade)
                el.style.opacity = '0';
            setTimeout(() => {
                el.style.transition = 'all 0ms ease-in-out'(el).style.position = 'fixed';
                el.style.display = 'flex';
                switch (side) {
                    case 'left':
                        el.style.transform = 'translateX(100%)';
                        break;
                    case 'right':
                        el.style.transform = 'translateX(-100%)';
                        break;
                    case 'top':
                        el.style.transform = 'translateY(100%)';
                        break;
                    case 'bottom':
                        el.style.transform = 'translateY(-100%)';
                        break;
                }
                callback();
                setTimeout(() => {
                    el.style.transition = `all ${time}ms ease-in-out`;
                    if (fade)
                        el.style.opacity = '1';
                }, 10);
                setTimeout(() => { el.style.transform = 'translate(0, 0)'; }, 20);
                setTimeout(() => {
                    el.style.display = '';
                    el.style.position = '';
                    el.style.transition = '';
                }, time);
            }, time);
        });
        return this;
    }
    fade(time = 1000, callback = () => { }) {
        this.SelectedElement.forEach((el, val) => {
            el.style.transition = `all ${time}ms ease-in-out`;
            el.style.opacity = '0';
            setTimeout(() => {
                callback();
                el.style.transition = '';
                el.style.opacity = '1';
            }, time);
        });
        return this;
    }
    blink(time = 1000, color = 'red') {
        this.SelectedElement.forEach((el) => {
            el.style.transition = `all 100ms ease-in-out`;
            let interval = setInterval(() => {
                el.style.borderColor = el.style.borderColor == color ? '' : color;
            }, 100);
            setTimeout(() => {
                el.style.transition = '';
                el.style.borderColor = '';
                clearInterval(interval);
            }, time);
        });
        return this;
    }
    clickRipple() {
        for (let el of this.SelectedElement) {
            el.style.position = 'relative';
            el.style.overflow = 'hidden';
            el.addEventListener('mousedown', (e) => {
                const ripple = el.getElementsByClassName("ripple")[0];
                if (ripple)
                    ripple.remove();
                let event = e;
                const circle = document.createElement("span");
                const diameter = Math.max(el.clientWidth, el.clientHeight);
                const radius = diameter / 2;
                circle.style.position = "absolute";
                circle.style.width = circle.style.height = `${diameter}px`;
                circle.style.left = `${event.clientX - (el.offsetLeft + radius)}px`;
                circle.style.top = `${event.clientY - (el.offsetTop + radius)}px`;
                circle.classList.add("ripple");
                el.appendChild(circle);
            });
        }
    }
    async differ2(time = 1000, styleData) {
        await new Promise((resolve) => {
            this.SelectedElement.forEach((el) => {
                el.setAttribute('style', styleData);
            });
            setTimeout(() => resolve(true), time);
        });
        return this;
    }
    /**
     * @param {int} time duration of animation in ms
     * @param {string} style Example: width: 100px; height: 100px;
     * @example param must be in pairs differ(1000, 'width: 100px;', 1000, 'width: 200px;');
     */
    async differ(...args) {
        let differList = [];
        for (let i = 0; i < arguments.length; i++) {
            differList.push({
                time: arguments[i],
                style: arguments[i + 1],
            });
            i++;
        }
        for (let i = 0; i < differList.length; i++) {
            await this.differ2(differList[i].time, differList[i].style);
        }
        return this;
    }
}
class ReturnManager extends Utils {
    caller = () => { };
    url = 'about:blank';
    constructor() {
        super();
        this.reset();
        window.addEventListener('popstate', async () => {
            if (window.history.state == 'START') {
                let res = await this.Confirm('Are you sure you want to exit?');
                if (res)
                    window.location.assign(this.url);
                else
                    this.reset();
            }
            else
                this.callback(window.history.state);
        });
    }
    reset() {
        window.history.pushState('START', '', '');
        window.history.pushState(null, '', '');
        return this;
    }
    change(id = 'null') {
        window.history.replaceState(id, '', '');
        return this;
    }
    add(id = 'null') {
        window.history.pushState(id, '', '');
        return this;
    }
    callback(callback) {
        this.caller = callback;
        return this;
    }
    SetExit(url) {
        this.url = url;
        return this;
    }
}
class DateManager {
    date = new Date();
    constructor(date) {
        this.date = new Date(date.replaceAll('-', '/'));
    }
    ispast() {
        return this.date.getTime() < Date.now();
    }
    isfuture() {
        return this.date.getTime() > Date.now();
    }
    istoday() {
        return this.date.toDateString() == new Date().toDateString();
    }
    /**
     *
     * @returns {mixed} -1 if past, 1 if future, 0 if today
     */
    is() {
        if (this.date.toDateString() == new Date().toDateString())
            return true;
        else if (this.ispast())
            return -1;
        else
            return 1;
    }
    /**
     *
     * @param {string} date
     * @returns {int} the difference in days between two dates
     */
    dif(date = false) {
        if (typeof date === 'string')
            date = new Date(date.replaceAll('-', '/'));
        else
            date = new Date();
        const diffInMs = Math.abs(this.date.getTime() - date.getTime());
        return diffInMs / (1000 * 60 * 60 * 24) < 1 ? 0 : Math.round(diffInMs / (1000 * 60 * 60 * 24));
    }
}
class ElementManager {
    element = document.createElement('div');
    backoutElement = null;
    addList = {};
    manager_id = Utils.RandomString(10);
    data = Array();
    globaldata = Array();
    temp_data = Array();
    suffixText = '';
    preffixText = '';
    html_text = '';
    parentElement = false;
    EventCallbackList = Array();
    call_on_update = () => { };
    callStack = Array();
    funcPool = Array();
    primaryClick = false;
    doubleClick = false;
    resolver = () => { };
    done = new Promise((resolve, reject) => this.resolver = resolve);
    mouse;
    isDummy = true;
    cloneNbr = 0;
    isClone = false;
    cloneSuffix = 0;
    isScoped = false;
    constructor(element = false, dummy = true, scoped = false) {
        if (element) {
            let proxy = this.checkClass(element);
            if (proxy)
                this.element = proxy;
        }
        if (this.element.id == '')
            this.element.id = this.manager_id;
        setTimeout(() => this.resolve(), 10);
        this.mouse = {
            isClick: () => this.mouse.click.isDown,
            click: {
                x: 0,
                y: 0,
                isDown: false,
                event: null,
            },
            isOver: () => this.mouse.over.isOver,
            over: {
                x: 0,
                y: 0,
                isOver: false,
                event: null,
            }
        };
        this.isDummy = dummy;
        this.isScoped = scoped;
        if (dummy)
            return;
        this.init();
        if (!this.element)
            throw new Error('Invalid element');
    }
    getCloneNbr() {
        return this.cloneNbr;
    }
    getAddList() {
        return this.addList;
    }
    global(data = false) {
        if (data === false)
            return this.globaldata;
        this.globaldata = { ...this.globaldata, ...data };
        this._global(data);
        return this;
    }
    async _global(data = false) {
        await this.done;
        let children = [...this.parent(true).children(), this.parent(true)];
        this.globaldata = { ...this.globaldata, ...data };
        for (let i = 0; i < children.length; i++) {
            children[i].globaldata = { ...this.globaldata, ...data };
        }
    }
    scoped(value) {
        this.isScoped = value;
        return this;
    }
    resolve() {
        this.resolver();
        try {
            this.parent(true).children().forEach(e => e.resolver());
        }
        catch (e) { }
        return this;
    }
    init() {
        this._initMouse();
    }
    _initMouse() {
        this.element.addEventListener('mousedown', (e) => {
            this.mouse.click = {
                x: e.clientX,
                y: e.clientY,
                isDown: true,
                event: e,
            };
            this._doubleClickHandler(e);
        });
        this.element.addEventListener('mouseup', (e) => {
            this.mouse.click = {
                x: e.clientX,
                y: e.clientY,
                isDown: false,
                event: e,
            };
        });
        this.element.addEventListener('mouseenter', (e) => {
            this.mouse.over = {
                x: e.clientX,
                y: e.clientY,
                isOver: true,
                event: e,
            };
        });
        this.element.addEventListener('mouseleave', (e) => {
            this.mouse.over = {
                x: 0,
                y: 0,
                isOver: false,
                event: e,
            };
        });
        this.element.addEventListener('dragstart', (e) => this.mouse.click.isDown = true);
        this.element.addEventListener('dragend', (e) => this.mouse.click.isDown = false);
        document.addEventListener('mouseup', (e) => this.mouse.click.isDown = false);
        document.addEventListener('mouseleave', (e) => this.mouse.click.isDown = false);
    }
    isDoubleClick() {
        return this.doubleClick;
    }
    _doubleClickHandler(event) {
        if (this.primaryClick) {
            this.doubleClick = true;
            this.primaryClick = false;
        }
        else if (!this.primaryClick) {
            this.primaryClick = true;
            setTimeout(() => {
                if (this.doubleClick)
                    setTimeout(() => { this.doubleClick = false; }, 500);
                this.primaryClick = false;
            }, 300);
        }
    }
    _reset() {
        this.resetEvents();
        this.backoutElement = null;
        this.addList = {};
        this.data = Array();
        this.suffixText = '';
        this.preffixText = '';
        this.html_text = '';
        this.parentElement = false;
        this.EventCallbackList = Array();
        this.call_on_update = () => { };
        this.callStack = Array();
        this.primaryClick = false;
        this.doubleClick = false;
    }
    /**
     * @description Remove all events from the element
     */
    resetEvents() {
        for (let i = 0; i < this.EventCallbackList.length; i++) {
            let e = this.EventCallbackList[i];
            let res = this.element.removeEventListener(e.type, e.caller, false);
        }
        this.EventCallbackList = Array();
    }
    /**
     *
     * @param {Function} referance function reference
     */
    removeEvent(referance) {
        let index = this.EventCallbackList.findIndex(e => e.callback === referance);
        if (index === -1)
            return this;
        this.element.removeEventListener(this.EventCallbackList[index].type, this.EventCallbackList[index].caller, false);
        this.EventCallbackList.splice(index, 1);
        return this;
    }
    /**
     *
     * @param {ElementManager} element manager
     */
    add(...args) {
        for (let i = 0; i < args.length; i++) {
            let elem = args[i];
            if (args[i] === false)
                continue;
            else if (args[i] instanceof Element || args[i] instanceof HTMLElement) {
                this.element.appendChild(elem);
                continue;
            }
            if (!args[i])
                continue;
            this.element.appendChild(this.checkClass(args[i]));
            if (elem instanceof ElementManager && elem.manager_id != null) {
                this.addList[elem.manager_id] = args[i];
                args[i].parentElement = this;
                args[i].globaldata = { ...this.parent(true).globaldata, ...this.globaldata, ...args[i].globaldata };
                args[i].resolve();
            }
        }
        this.resolve();
        return this;
    }
    addBefore(id, newElement) {
        if (!this.addList[id])
            throw new Error(`insertBefore: ${id} was not found`);
        newElement.parentElement = this;
        let newAddList = {};
        let keys = Object.keys(this.addList);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (key === id)
                newAddList[newElement.manager_id] = newElement;
            newAddList[key] = this.addList[key];
        }
        this.addList = newAddList;
    }
    addAfter(id, newElement) {
        if (!this.addList[id])
            throw new Error(`insertAfter: ${id} was not found`);
        newElement.parentElement = this;
        let newAddList = {};
        let keys = Object.keys(this.addList);
        for (let i = 0; i < keys.length; i++) {
            newAddList[keys[i]] = this.addList[keys[i]];
            if (keys[i] === id)
                newAddList[newElement.manager_id] = newElement;
        }
        this.addList = newAddList;
    }
    dummy(type, initer = {}) {
        return ElementManager.dummyElement(type, initer);
    }
    static dummyElement(type, initer = {}) {
        let el = document.createElement(type);
        if (!el)
            throw new Error("Invalid type: " + type);
        let keys = Object.keys(initer);
        for (let i = 0; i < keys.length; i++) {
            switch (keys[i]) {
                case 'html':
                    el.innerHTML = initer[keys[i]];
                    break;
                default:
                    el.setAttribute(keys[i], initer[keys[i]]);
                    break;
            }
        }
        return el;
    }
    wrap(...args) {
        let el = new ElementManager(false, true).add(...args);
        el.parentElement = this;
        return el;
    }
    onupdate(callback) {
        this.call_on_update = callback;
        return this;
    }
    update() {
        return this.setdata();
    }
    suf(suffixText) {
        this.suffixText = new Security().SanitizeXSS(suffixText);
        this.element.innerHTML = `${this.element.innerHTML}${suffixText}`;
        return this;
    }
    plainsuf(suffixText) {
        this.suffixText = suffixText;
        this.element.innerHTML = `${this.element.innerHTML}${suffixText}`;
        return this;
    }
    pre(preffixText) {
        this.preffixText = new Security().SanitizeXSS(preffixText);
        this.element.innerHTML = `${this.preffixText}${this.element.innerHTML}`;
        return this;
    }
    plainpre(preffixText) {
        this.preffixText = preffixText;
        this.element.innerHTML = `${this.preffixText}${this.element.innerHTML}`;
        return this;
    }
    create(type = 'div', dummy = true) {
        if (type[0] === '#' || type[0] === '.') {
            let elem = document.querySelector(type);
            if (elem)
                return new ElementManager(elem, dummy);
        }
        else
            return new ElementManager(document.createElement(type), dummy);
        return new ElementManager();
    }
    select(el) {
        let proxy = this.checkClass(el);
        if (proxy)
            this.element = proxy;
        return this;
    }
    /**
     * Warning this method can be XSS injected
     * @param {String} html_text
     * @returns
     */
    plainhtml(html_text) {
        this.html_text = html_text;
        this.element.innerHTML = html_text;
        return this;
    }
    make(id) {
        if (this.parentElement) {
            const keys = Object.keys(this.parentElement.addList);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                if (key === this.manager_id) {
                    delete this.parentElement.addList[key];
                    this.parentElement.addList[id] = this;
                    break;
                }
            }
        }
        this.manager_id = id;
        return this;
    }
    call(func) {
        this.callStack.push(func);
        const caller = async () => {
            await this.done;
            func(this);
        };
        caller();
        return this;
    }
    bind(id) {
        let res;
        res = this.parent(true)._bind(id);
        if (!res && this.isClone)
            res = this.bind(`${this.cloneSuffix}_${id}`);
        if (!res)
            throw new Error(`tag ${id} was not found`);
        return res;
    }
    _bind(id) {
        if (this.manager_id === id)
            return this;
        let keys = Object.keys(this.addList);
        if (keys.length == 0)
            return false;
        if (keys.includes(id))
            return this.addList[id];
        for (let i = 0; i < keys.length; i++) {
            let found = this.addList[keys[i]]._bind(id);
            if (found)
                return found;
        }
        return false;
    }
    setdata(data = false) {
        if (data) {
            const d = { ...this.data, ...data };
            this.data = d;
        }
        if (this.call_on_update)
            this.call_on_update(this);
        return this;
    }
    setTempData(data = false) {
        if (data) {
            this.temp_data = { ...this.temp_data, ...data };
        }
        if (this.call_on_update)
            this.call_on_update(this);
        return this;
    }
    findKey(key, scoped = false) {
        if (scoped)
            return this._findKey(key);
        else
            return this.parent(true)._findKey(key);
    }
    _findKey(key) {
        const keys = Object.keys(this.addList);
        let found = undefined;
        for (let i = 0; i < keys.length; i++) {
            if (typeof this.addList[keys[i]].data[key] != 'undefined')
                return this.addList[keys[i]];
            else
                found = this.addList[keys[i]]._findKey(key);
            if (found instanceof ElementManager)
                return found;
        }
        return found;
    }
    findData(key, value, scoped = false) {
        if (scoped)
            return this._findData(key, value);
        else
            return this.parent(true)._findData(key, value);
    }
    _findData(key, value) {
        const keys = Object.keys(this.addList);
        let found = undefined;
        for (let i = 0; i < keys.length; i++) {
            if (this.addList[keys[i]].data[key] == value) {
                return this.addList[keys[i]];
            }
            else
                found = this.addList[keys[i]]._findData(key, value);
            if (found instanceof ElementManager)
                return found;
        }
        return found;
    }
    findAllData(key, value, scoped = false) {
        if (scoped)
            return this._findAllData(key, value);
        else
            return this.parent(true)._findAllData(key, value);
    }
    _findAllData(key, value) {
        let keys = Object.keys(this.addList);
        let foundList = Array();
        if (this.data[key] == value)
            foundList.push(this);
        for (let i = 0; i < keys.length; i++) {
            let found = this.addList[keys[i]]._findAllData(key, value);
            if (found && found.length > 0) {
                foundList.push(...found);
            }
        }
        return foundList;
    }
    deleteChild(id) {
        if (!this.addList[id])
            throw new Error(`removeChild: ${id} was not found`);
        this.addList[id].remove();
        this.addList[id].parentElement = false;
        delete this.addList[id];
    }
    deleteSelf() {
        if (this.parentElement)
            this.parentElement.deleteChild(this.manager_id);
    }
    remove() {
        this.element.remove();
        return this;
    }
    destroy() {
        this.children().forEach(child => child.destroy());
        this.resetEvents();
        this.remove();
        if (this.parent())
            delete this.parent().addList[this.manager_id];
        return this;
    }
    restore() {
        let keys = Object.keys(this.addList);
        for (let i = 0; i < keys.length; i++) {
            this.element.appendChild(this.addList[keys[i]].element);
            this.addList[keys[i]].restore();
        }
        return this;
    }
    parent(toFirst = false, bypassScop = false) {
        if (toFirst && this.parentElement !== false && (!this.isScoped || bypassScop)) {
            return this.parentElement.parent(true);
        }
        else if (toFirst && this.parentElement === false)
            return this;
        if (this.parentElement === false || this.isScoped)
            return this;
        return this.parentElement;
    }
    getChild(id) {
        if (!this.addList[id])
            throw new Error(`getChild: ${id} was not found`);
        return this.addList[id];
    }
    child(index) {
        if (index < 0) {
            if (Object.values(this.addList).length == 0)
                return false;
            return Object.values(this.addList).at(index);
        }
        if (index < 0 || index >= Object.values(this.addList).length)
            return this;
        return Object.values(this.addList)[index];
    }
    children() {
        let children = Object.values(this.addList);
        for (let i = 0; i < children.length; i++) {
            let man = children[i];
            children.push(...man.children());
        }
        return children;
    }
    destroyChildren() {
        let child = this.children();
        for (let i = 0; i < child.length; i++) {
            child[i].destroy();
        }
        return this;
    }
    classRemove(...args) {
        for (let i = 0; i < arguments.length; i++) {
            this.element.classList.remove(arguments[i]);
        }
        return this;
    }
    set(key, val) {
        this.element.setAttribute(key, val.toString());
        return this;
    }
    clear() {
        this.element.innerHTML = '';
        return this;
    }
    class(...args) {
        let classesList = Array();
        for (let i = 0; i < arguments.length; i++) {
            let classes = arguments[i].split(' ');
            classesList.push(...classes);
        }
        this.element.classList.add(...arguments);
        return this;
    }
    classSwitch(class1, class2, mustBe = false) {
        if (this.element.classList.contains(class1) && mustBe != class1) {
            this.element.classList.remove(class1);
            this.element.classList.add(class2);
        }
        else if (this.element.classList.contains(class2) && mustBe != class2) {
            this.element.classList.remove(class2);
            this.element.classList.add(class1);
        }
        else if (mustBe)
            this.element.classList.add(mustBe);
        return this;
    }
    _id() {
        return this.element.id;
    }
    id(id = false) {
        if (id)
            this.element.id = id;
        else
            return this._id();
        return this;
    }
    AutoResize() {
        this.element.style.boxSizing = 'border-box';
        var offset = this.element.offsetHeight - this.element.clientHeight;
        this.event('input', (self, event) => {
            if (!event.target)
                return;
            event.target.style.height = 'auto';
            event.target.style.height = event.target.scrollHeight + offset + 'px';
        });
        return this;
    }
    val(value = false) {
        if (value !== false) {
            this.element.value = value;
            return this;
        }
        else
            return this._val();
    }
    _val() {
        return this.element.value;
    }
    // STYLE SECTION
    /**
     *
     * @param {Object} style array of key-value pairs
     * @returns {ElementManager} this instance
     */
    style(styleList) {
        let keys = Object.keys(styleList);
        keys.forEach((key) => {
            this.element.style[key] = styleList[key].toString();
        });
        return this;
    }
    css(cssValueToQuery) {
        switch (cssValueToQuery) {
            case 'rotate':
                return Utils.getCurrentRotation(this.element);
            default:
                return window.getComputedStyle(this.element, null).getPropertyValue(cssValueToQuery);
        }
    }
    display(mode = true) {
        if (mode === true)
            this.element.style.display = 'flex';
        else
            this.element.style.display = mode === false ? 'none' : mode;
        return this;
    }
    getPosition(mode = 'absolute') {
        switch (mode) {
            case 'absolute':
                return this.element.getBoundingClientRect();
                break;
            case 'relative':
                const parentPos = this.parent().getPosition();
                let elemPos = this.element.getBoundingClientRect();
                return {
                    y: elemPos.top - parentPos.top,
                    x: elemPos.left - parentPos.left
                };
                break;
        }
    }
    _html() {
        return this.html_text;
    }
    html(html) {
        this.html_text = new Security().SanitizeXSS(html);
        const formated = `${this.preffixText}${this.html_text}${this.suffixText}`;
        this.element.innerHTML = formated;
        return this;
    }
    in(element) {
        let proxy = this.checkClass(element);
        if (!proxy)
            throw new Error('Element not found');
        proxy.appendChild(this.element);
        if (element instanceof ElementManager)
            element.addList[this.manager_id] = this;
        return this;
    }
    on(selector) {
        let elem = document.querySelector(selector);
        if (!elem)
            throw new Error('Element not found');
        this.element = elem;
        return this;
    }
    focus() {
        this._focus();
        return this;
    }
    async _focus() {
        await this.done;
        this.element.focus();
    }
    checkClass(element) {
        if (typeof element == 'string')
            return document.querySelector(element);
        else if (element instanceof ElementManager)
            return element.element;
        return element;
    }
    async _saveDataTree(proxy, pool) {
        const keys = Object.keys(this.addList);
        let eventListToString = Array();
        const inPool = (func, funcPool) => {
            const strfunc = func.toString();
            const id = Utils.RandomString(5);
            for (let i = 0; i < funcPool.length; i++) {
                if (funcPool[i].function == strfunc)
                    return funcPool[i].id;
            }
            funcPool.push({
                id: id,
                function: strfunc
            });
            return id;
        };
        for (let i = 0; i < this.EventCallbackList.length; i++) {
            eventListToString.push({
                type: this.EventCallbackList[i].type,
                callback: inPool(this.EventCallbackList[i].callback, pool),
            });
        }
        let callListToString = Array();
        for (let i = 0; i < this.callStack.length; i++) {
            callListToString.push(inPool(this.callStack[i], pool));
        }
        const emptyfunc = () => { };
        let formatedData = Array();
        let dataKeys = Object.keys(this.data);
        for (let i = 0; i < dataKeys.length; i++) {
            let data;
            let type = 'data';
            if (typeof this.data[dataKeys[i]] === 'function') {
                data = this.data[dataKeys[i]].toString();
                type = 'function';
            }
            else if (typeof this.data[dataKeys[i]] === 'object')
                try {
                    JSON.stringify(this.data[dataKeys[i]]);
                    data = this.data[dataKeys[i]];
                }
                catch (e) {
                    continue;
                }
            else
                data = this.data[dataKeys[i]];
            formatedData.push({
                type: type,
                data: data,
                name: dataKeys[i]
            });
        }
        let dataList = {
            proxy: proxy,
            isScoped: this.isScoped,
            dummy: this.isDummy,
            globaldata: this.globaldata,
            tagName: this.element.tagName.toLowerCase(),
            manager_id: this.manager_id,
            data: formatedData,
            suffixText: this.suffixText || '',
            preffixText: this.preffixText || '',
            html_text: this.html_text || '',
            EventCallbackList: eventListToString,
            call_on_update: this.call_on_update ? inPool(this.call_on_update, pool) : inPool(emptyfunc, pool),
            addList: {},
            callStack: callListToString,
            element_id: this._id(),
            element_class: this.element.getAttribute('class'),
            element_style: this.element.getAttribute('style'),
            element_placeholder: this.element.getAttribute('placeholder'),
            cloneNbr: this.cloneNbr
        };
        for (let i = 0; i < keys.length; i++) {
            dataList.addList[keys[i]] = await this.addList[keys[i]]._saveDataTree(false, pool);
        }
        return dataList;
    }
    /**
     *
     * @returns Object of data wrapping all the ElementManager's structure can be restored with loadDataTree()
     */
    async saveDataTree(proxy = false) {
        await this.done;
        let tree = await this._saveDataTree(proxy, this.funcPool);
        tree.funcPool = this.funcPool;
        return JSON.stringify(tree);
    }
    /**
     *
     * @param {object|String} dataTree dataTree created with saveDataTree() can be json or direct object format
     */
    async loadDataTree(dataTree, bypassCallStack = false, contextualData = {}) {
        this._reset();
        await this.done;
        dataTree = typeof dataTree === 'string' ? JSON.parse(dataTree) : dataTree;
        await this._loadDataTree(dataTree, dataTree.funcPool || Array(), bypassCallStack, contextualData);
        return this;
    }
    async _loadDataTree(dataTree, funcPool, bypassCallStack, contextualData = {}) {
        const keys = Object.keys(dataTree);
        const fromPool = (id) => {
            for (let i = 0; i < funcPool.length; i++) {
                if (funcPool[i].id == id)
                    return eval(funcPool[i].function);
            }
        };
        for (let i = 0; i < keys.length; i++) {
            switch (keys[i]) {
                case 'manager_id':
                    this.make(dataTree.manager_id);
                    break;
                case 'tagName':
                case 'funcPool':
                case 'proxy':
                case 'addList':
                    break;
                case 'EventCallbackList':
                    for (let i = 0; i < dataTree.EventCallbackList.length; i++) {
                        let e = dataTree.EventCallbackList[i];
                        this.event(e.type, fromPool(e.callback));
                    }
                    break;
                case 'call_on_update':
                    this.call_on_update = eval(fromPool(dataTree.call_on_update));
                    break;
                case 'callStack':
                    for (let i = 0; i < dataTree.callStack.length; i++) {
                        this.callStack.push(fromPool(dataTree.callStack[i]));
                    }
                    break;
                case 'html_text':
                    this.html(dataTree.html_text);
                    break;
                case 'data':
                    for (let i = 0; i < dataTree.data.length; i++) {
                        switch (dataTree.data[i].type) {
                            case 'function':
                                this.data[dataTree.data[i].name] = eval(dataTree.data[i].data);
                                break;
                            case 'data':
                                this.data[dataTree.data[i].name] = dataTree.data[i].data;
                                break;
                        }
                    }
                    break;
                default:
                    if (keys[i].startsWith('element_')) {
                        let elemkey = keys[i].replace('element_', '');
                        if (dataTree[keys[i]])
                            this.element.setAttribute(elemkey, dataTree[keys[i]]);
                    }
                    else
                        this[keys[i]] = dataTree[keys[i]];
                    break;
            }
        }
        this.data = { ...this.data, contextualData: contextualData };
        if (!bypassCallStack) {
            for (let i = 0; i < this.callStack.length; i++) {
                this.callStack[i](this);
            }
        }
        const addkeys = Object.keys(dataTree.addList);
        for (let i = 0; i < addkeys.length; i++) {
            let e = addkeys[i];
            let elem;
            if (!dataTree.addList[e].proxy) {
                elem = this.create(dataTree.addList[e].tagName.toLowerCase(), dataTree.dummy);
            }
            else
                elem = this.create('#' + dataTree.addList[e].element_id, dataTree.dummy);
            this.add(elem);
            await elem._loadDataTree(dataTree.addList[e], funcPool, bypassCallStack, contextualData);
        }
        await new Promise((resolve, reject) => { resolve(true); });
        return this;
    }
    blackout(state, onclick = () => { }) {
        if (this.backoutElement == null) {
            this.backoutElement = document.createElement('div');
            this.backoutElement.classList.add('blackout');
            this.backoutElement.addEventListener('click', (e) => {
                e.stopPropagation();
                onclick(this);
            });
            window.addEventListener('resize', (e) => { setDimention(); });
        }
        let self = this;
        setDimention();
        if (state) {
            this.element.appendChild(this.backoutElement);
            this.backoutElement.style.display = 'flex';
        }
        else {
            try {
                this.element.removeChild(this.backoutElement);
            }
            catch (e) { }
        }
        function setDimention() {
            if (!self.backoutElement)
                return;
            self.backoutElement.style.top = self.element.offsetTop + 'px';
            self.backoutElement.style.left = self.element.offsetLeft + 'px';
            self.backoutElement.style.width = self.element.offsetWidth + 'px';
            self.backoutElement.style.height = self.element.offsetHeight + 'px';
        }
        return this;
    }
    disable(timeout = 1000) {
        this.element.disabled = timeout === false ? false : true;
        this.class('disabled');
        if (timeout === true || timeout === false)
            return this;
        if (timeout)
            setTimeout(() => {
                this.element.disabled = false,
                    this.classSwitch('disabled', 'enabled', 'enabled');
            }, timeout);
        return this;
    }
    /**
     *
     * @param {string} eventType event type
     * @param {function} callback (self, event)
     */
    event(eventType, callback) {
        let callbackFormat = {
            type: eventType,
            caller: async (event) => {
                await this.done;
                callback(this, event);
                return true;
            },
            callback: callback
        };
        this.EventCallbackList.push(callbackFormat);
        this.element.addEventListener(eventType, callbackFormat.caller);
        return this;
    }
    trigger(event) {
        if (typeof event === 'string')
            event = new Event(event);
        else
            event = new Event(event.type, event);
        this.element.dispatchEvent(event);
    }
    isChild(element) {
        if (this.element.contains(element))
            return true;
    }
    async sleep(millis) {
        return await new Promise(resolve => setTimeout(() => resolve(this), millis));
    }
    async clone(contextualData = {}) {
        let strSavedElem = await this.saveDataTree(false);
        let savedElem = JSON.parse(strSavedElem);
        let clone = new ElementManager().create(this.element.tagName.toLowerCase(), this.isDummy).scoped(true);
        await clone.loadDataTree(savedElem, false, contextualData);
        clone.make(`${clone.manager_id}_${this.cloneNbr}`);
        let children = clone.children();
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            child.id(`${child._id()}_${this.cloneNbr}`);
            child.isClone = true;
        }
        clone.id(`${clone._id()}_${this.cloneNbr}`);
        clone.isClone = true;
        return await new Promise((resolve, reject) => {
            this.cloneNbr++;
            resolve(clone);
        });
    }
}
class FolderManager {
    folders = Array();
    tagList = Array();
    tagElementContainer;
    foldersContainer = false;
    primaryFolder = false;
    constructor(tagContainerSelector, foldersContainerSelector = false) {
        let proxy = typeof tagContainerSelector === 'string' ? document.querySelector(tagContainerSelector) : tagContainerSelector;
        if (!proxy)
            throw new Error('Element not found');
        this.tagElementContainer = proxy;
        proxy = typeof foldersContainerSelector === 'string' ? document.querySelector(foldersContainerSelector) : foldersContainerSelector;
        if (!proxy && foldersContainerSelector)
            throw new Error('Element not found');
        else if (foldersContainerSelector)
            this.foldersContainer = proxy;
    }
    /**
     *
     * @param {string} name html name of folder
     * @param {string} folder_id the folder id to give to the newely created folder
     * @param {array} folder_classes the classes to give to the newely created folder
     * @param {string} [displayStyle=''] the display style to give to the newely created folder
     * @param {boolean} [show=false] show the folder at start (default: false)
     * @returns {FolderManager} this instance
     */
    add(name, folder_id, folder_classes, displayStyle = '', show = false) {
        let folder = null;
        if (document.getElementById(folder_id) != null) {
            folder = document.getElementById(folder_id);
        }
        else {
            folder = document.createElement('div');
            folder.id = folder_id;
            if (folder_classes)
                folder.classList.add(...folder_classes);
            if (!this.foldersContainer || !folder)
                throw new Error('Element not found');
            this.foldersContainer.appendChild(folder);
        }
        if (!folder)
            throw new Error('Element not found');
        this.folders.push(folder);
        let element = document.createElement('button');
        this.tagList.push(element);
        element.classList.add('FolderManager-tagContainer', 'btn');
        element.innerHTML = name;
        this.tagElementContainer.appendChild(element);
        element.addEventListener('click', (e) => {
            if (!folder)
                return;
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
            for (let i = 0; i < this.folders.length; i++) {
                this.folders[i].style.display = 'none';
            }
            folder.style.display = '';
            for (let i = 0; i < this.tagList.length; i++) {
                this.tagList[i].classList.remove('active');
            }
            e.target.classList.add('active');
        });
        if (show && !this.primaryFolder && folder) {
            folder.style.display = displayStyle;
            element.classList.add('active');
            this.primaryFolder = true;
        }
        else if (folder)
            folder.style.display = 'none';
        return this;
    }
    getFolder(id) {
        return this.folders.find(e => e.id == id);
    }
}
class KeyBoardManager {
    PressedList = Array();
    generalCallbacks = () => { };
    specificCallbacks = Array();
    id = '';
    bypass = false;
    enabled = true;
    constructor() {
        this.init();
    }
    init() {
        document.addEventListener('keydown', (e) => {
            if (this.bypass || !this.enabled)
                return;
            if (!this.PressedList.includes(e.code))
                this.PressedList.push(e.code, e.key);
            if (this.generalCallbacks)
                this.generalCallbacks(e.code, e, this);
            if (this.specificCallbacks.length > 0)
                this._getById(this.id).callback(e.code, e, this);
        });
        document.addEventListener('keyup', (e) => {
            this.bypass = false;
            if (this.PressedList.length < 1)
                return;
            this.PressedList.splice(this.PressedList.indexOf(e.code), 1);
            this.PressedList.splice(this.PressedList.indexOf(e.key), 1);
        });
    }
    trigger(code) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: code }));
    }
    set(id) {
        this.id = id;
        return this;
    }
    /**
     *
     * @param {function} callback (keycode, event, self)
     * @returns {KeyBoardManager} this instance
     * @description Needs to set the id first, when set, it will call the callback associated with the id
     */
    add(callback) {
        this.specificCallbacks.push({ id: this.id, callback: callback });
        return this;
    }
    /**
     *
     * @param {function} callback (keycode, event, self)
     * @returns {KeyBoardManager} this instance
     * @description Is called regardless of the id
     */
    general(callback) {
        this.generalCallbacks = callback;
        return this;
    }
    _getById(id) {
        let proxy = this.specificCallbacks.find(e => e.id == id);
        if (!proxy)
            throw new Error('No callback found');
        return proxy;
    }
    /**
     *
     * @param {string} code the keycode to check if it is pressed
     * @returns {boolean} true if the keycode is pressed, false otherwise
     */
    isPressed(code) {
        return this.PressedList.includes(code);
    }
    enable(value = true) {
        this.enabled = value;
        return this;
    }
}
class MouseManager {
    currentPos = { x: 0, y: 0 };
    constructor() {
        document.addEventListener('mousemove', (event) => {
            let e = event;
            this.currentPos.x = e.clientX;
            this.currentPos.y = e.clientY;
        });
    }
    getPosition() {
        return this.currentPos;
    }
}
/**
 * exemple :
 *          lists = [
 *              {
 *                  name: 'name
 *                  type: TYPE_FOLDER | TYPE_FILE | TYPE_ITEM_FOLDER,
 *                  folder: [{...}]
 *              }
 *          ]
 *          new GridTemplate('#id').grid('name').set(lists,
 *              (self, item, folder) => { clicked item }
 *          ).style('item-className').item(110, 110).render();
 */
/*class GridTemplate {
    // TODO : Add item Style

    constructor(selector) {
        this.man = new ElementManager(selector);

        //Grid section
        this.gridList = Array();
        this.Grid_item_select_callback = null;
        this.current_grid = null;
        this.current_data = Array();
        this.pages_nbr = 0;
        this.current_page = 0;
        this.path = Array();

        this.item_class = 'template-grid-item';
        this.container_class = 'template-grid-container';
        this.styleText = false;
        this.container_style = false;

        this.fillEmptySpace = true;
        this.Enablecontrols = true;

        this.item_width = 100; //width
        this.item_height = 120; //height
        this.max_item = 0;
        this.current_column = 0;
        this.current_row = 0;
        this.selectedItem = null;

        window.addEventListener('resize', () => {
            if (this._CheckGridSize()) this.render(this.current_data);
        });

    }
    grid(id = false) {
        const found = this.gridList.find(e => e.id == id);
        if (found) this.current_grid = found;
        else {
            if (!id) id = Utils.RandomString(10);
            const grid = {
                id: id,
                grid: null,
                data: Array(),
                callback: () => { },
                page_control_position: 'bottom',
                grid_item_style: false,
            };
            this.gridList.push(grid);
            this.current_grid = grid;
        }
        return this;
    }
    /**
     *
     * @param {ElementManager} selector String | ElementManager
     * @param {Array} data [{name: String, type: [TYPE_ITEM, TYPE_FOLDER, TYPE_ITEM_FOLDER], ...}]
     * @param {Function} item_select_callback (data) => {id, data}
     * @param {String} page_control_position bottom | top
     * @param {String} grid_item_style String | false
     * @returns {this}
     * /
    set(data, item_select_callback = () => { }, fillEmptySpace = true, Enablecontrols = true, page_control_position = 'bottom', grid_item_style = 'default') {
        this.current_grid.data = data;
        this.current_grid.callback = item_select_callback;
        this.current_grid.page_control_position = page_control_position;
        this.current_grid.grid_item_style = grid_item_style;
        this.fillEmptySpace = fillEmptySpace;
        this.Enablecontrols = Enablecontrols;

        this.path.push({ data: data, name: 'menu' });

        this._makeID(this.current_grid.data);

        this.man.add(
            this.man.create('div').class('template-grid-controls', 'row').make('path-controls'),
            this.man.create('div').class(this.container_class).make('page-contents'),
        ).call((self) => {
            if (this.Enablecontrols) self.add(self.create('div').make('page-controls'));
        }).class('space-between', 'col');
        if (this.Enablecontrols) this._initPageControls();
        return this;
    }
    style(ItemclassName = false, Itemstyle = false, ContainerclassName = false, ContainerStyle = false) {
        if (ItemclassName) this.item_class = ItemclassName;
        if (Itemstyle) this.item_style = Itemstyle;
        if (ContainerclassName) this.container_class = ContainerclassName;
        if (ContainerStyle) this.container_style = ContainerStyle;
        return this;
    }
    item(width, height) {
        this.item_width = width;
        this.item_height = height;
        return this;
    }
    resetPath() {
        meat
        this.path = this.path.at(0);
    }
    removeFrom(position) {
        this.man.findData('position', position).destroy();
    }
    remove() {
        this.selectedItem.destroy();
        this.selectedItem = null;
    }
    render(data = false) {
        let container = this.man.bind('page-contents');
        container.clear();

        let bypass_pathrender = false;
        this._CheckGridSize();
        this._setSize();

        if (!data) {
            data = this.current_grid.data;
            this.current_data = data;
        } else this.current_data = data;

        if (this.max_item !== 0) this.pages_nbr = Math.ceil(this.current_data.length / this.max_item);
        else this.pages_nbr = 1;
        const offset = this.current_page * this.max_item;
        for (let i = 0; i < (data.length - offset); i++) {
            if (i == this.max_item) break;
            let e = data[i + offset];
            e.position = i;
            container.add(
                this.man.create('div').class(this.item_class).setdata({ isItem: true, position: i }).html(e.name).event( 'click',(self) => {
                    if (
                        e.type != TYPE_ITEM &&
                        e.type != TYPE_OPTION
                    ) {
                        this.current_page = 0;
                        this.render(e.folder);
                        this.path.push({ data: e.folder, name: e.name });
                        bypass_pathrender = true;
                    }
                    this.current_grid.callback(this, e, data);
                    this.selectedItem = self;
                }).call((self) => { this.selectedItem = self; }),
            );
        }
        if (!bypass_pathrender && this.Enablecontrols) this._renderPath();
        if (this.Enablecontrols) this._renderPageControls();
        if ((data.length - offset) < this.max_item && this.fillEmptySpace) {
            const emptySlot = this.max_item - (data.length - offset);
            for (let i = 0; i < emptySlot; i++) {
                container.add(
                    this.man.create('div').class(this.item_class),
                );
            }
        }

    }
    _CheckGridSize() {

        const newRow = Math.floor(this.man.element.offsetWidth / this.item_width);
        const newCol = Math.floor(this.man.element.offsetHeight / this.item_height);

        if (
            newRow != this.current_row ||
            newCol != this.current_col
        ) {
            this.current_col = newCol;
            this.current_row = newRow;
            this.max_item = newRow * newCol - newRow;
            if (this.max_item == 0) this.max_item = 1;
            return true;
        } else return false;
    }
    _setSize() {
        let style = 'grid-template-columns:';
        for (let i = 0; i < this.current_row; i++) {
            style += ` ${this.item_width - 10}px`;
        }
        style += ';';
        this.man.bind('page-contents').style(style);
    }
    _renderPath() {
        let controls = this.man.bind('path-controls');
        controls.clear();

        for (let i = 0; i < this.path.length; i++) {
            let e = this.path[i];
            controls.add(
                this.man.create('div').class('template-grid-controls-path').html(e.name || 'menu').event( 'click',() => {
                    this.current_page = 0;
                    this.render(e.data);
                    const pos = this.path.length - i - 1;
                    for (let j = 0; j < pos; j++) this.path.pop();
                    this._renderPath();
                }),
            );
        }
    }
    _renderPageControls() {
        let controls = this.man.bind('page-controls-center');
        controls.clear();

        for (let i = 0; i < this.pages_nbr; i++) {
            controls.add(
                this.man.create('div').class(
                    'template-grid-controls-page-point',
                    'template-grid-controls-page-point-not-active'
                ).setdata({ page_controls_id: i, page_controls: true }).call((self) => {
                    if (self.data.page_controls_id == this.current_page) {
                        self.classSwitch('template-grid-controls-page-point-not-active', 'template-grid-controls-page-point-active');
                    }
                })
            );
        }
    }
    _initPageControls() {
        let controls = this.man.bind('page-controls');
        controls.add(
            this.man.create('div').class('page-controls-btn').html('&#8592;').event( 'click',(self) => {
                if (this.current_page == 0) return;
                this.man.findAllData('page_controls', true).forEach(e => e.classSwitch('template-grid-controls-page-point-active', 'template-grid-controls-page-point-not-active'));
                this.current_page--;
                this.render(this.path.at(-1).data);
            }),
            this.man.create('div').class('row').make('page-controls-center'),
            this.man.create('div').class('page-controls-btn').html('&#8594;').event( 'click',(self) => {
                if (this.current_page == this.pages_nbr - 1) return;
                this.man.findAllData('page_controls', true).forEach(e => e.classSwitch('template-grid-controls-page-point-active', 'template-grid-controls-page-point-not-active'));
                this.current_page++;
                this.render(this.path.at(-1).data);
            }),
        ).class('template-grid-controls-page', 'row', 'width-90');
    }
    _makeID(array) {
        array.forEach(e => {
            if (typeof e.folder != 'undefined') this._makeID(e.folder);
            if (typeof e.item_id == 'undefined') e.item_id = Utils.RandomString(10);
        });
    }
}*/
/**
 *
 */
class SideMenuTemplate {
    selector;
    slideObj;
    slideToOpen;
    menuSide;
    open_callback = () => { };
    close_callback = () => { };
    setBlackout;
    blackout = new ElementManager();
    itemQty = 0;
    customhamburger;
    customId;
    enabled = true;
    isopen = false;
    man = new ElementManager();
    hamburgerElement;
    constructor(side = 'left', slideToOpen = true, blackout = true, hamburger = false, selector = false, customId = false) {
        this.selector = selector ? selector : 'body';
        this.slideObj = new InteractionManager(this.selector);
        this.slideToOpen = slideToOpen;
        this.menuSide = side == 'left' ? 'left' : 'right';
        this.setBlackout = blackout;
        this.hamburgerElement = hamburger ? new ElementManager(hamburger) : new ElementManager();
        this.customhamburger = hamburger ? true : false;
        this.customId = customId ? customId : 'side-menu-template-container';
        if (this.setBlackout) {
            this.blackout = new ElementManager();
            this.blackout
                .class('blackout')
                .event('click', () => this.close())
                .in(this.selector);
        }
        this.Init();
    }
    destroy() {
        this.close();
        this.man.destroy();
        this.blackout ? this.blackout.destroy() : null;
    }
    trigger(index) {
        let elem = this.man.findData('item_index', index);
        if (elem)
            elem.element.click();
    }
    Init() {
        this.man = this.man.create('div').id(this.customId).class('close', 'col', this.menuSide).in(this.selector);
        this.add('&#10060;', 'menu', '', (self) => this.close());
        let man = this.hamburgerElement;
        man.class('hambuger').plainhtml('<span></span><span></span><span></span>').event('click', (self) => this.open());
        if (!this.customhamburger)
            man.in(this.selector);
        if (this.slideToOpen)
            this.setSlide();
    }
    setSlide() {
        this.slideObj.Slide(() => {
            if (this.isopen)
                return;
            this.open();
        }, this.menuSide);
    }
    add(icon, title = '', tail = '', callback = () => { }) {
        if (icon.endsWith('.svg'))
            icon = `<img src="${icon}" />`;
        this.man.add(this.man.create('div').class('template-side-menu-item').add(this.man.create('div').class('template-side-menu-item-icon').plainhtml(icon), this.man.create('div').class('template-side-menu-item-title').html(title), this.man.create('div').class('template-side-menu-item-tail').html(tail)).event('click', (self, event) => {
            event.stopPropagation();
            this.close();
            callback(self);
        }).setdata({ item_index: this.itemQty }));
        this.itemQty++;
        return this;
    }
    callback(open_callback = () => { }, close_callback = () => { }) {
        this.open_callback = open_callback;
        this.close_callback = close_callback;
    }
    open() {
        if (!this.enabled)
            return;
        this.man.classSwitch('close', 'open', 'open');
        this.isopen = true;
        this.open_callback();
        if (!this.setBlackout)
            return this;
        this.blackout.display(true);
    }
    close() {
        if (!this.enabled)
            return;
        this.man.classSwitch('open', 'close', 'close');
        this.isopen = false;
        this.close_callback();
        if (!this.setBlackout)
            return this;
        this.blackout.display(false);
        return this;
    }
    isOpen() {
        return this.isopen;
    }
    enable(val) {
        if (!val)
            this.close();
        this.enabled = val;
    }
    isEnabled() {
        return this.enabled;
    }
}
/*
class NumberInputTemplate {
    private element: ElementManager = new ElementManager();
    private call: Function = () => {};
    private input: string = '';
    private header: Element|ElementManager = new ElementManager();

    constructor(selector:string|false = false) {
        if (selector) this.element = new ElementManager(selector);
        else this.element.class('template-number-input-container', 'col');

    }
    set(header = false, defaultValue = '') {
        this.header = header;
        this.input = defaultValue;
        return this;
    }
    render() {
        this.element.add(
            this.header,
            this.element.create('div').class('template-grid-container').call((self) => {
                for (let i = 0; i < 10; i++) {
                    self.add(
                        self.create('div').class('grid-item').html(i).event( 'click',(self) => {
                            this.input = `${this.input}${i}`;
                            update();
                        }),
                    );
                }
                self.add(
                    self.create('div').class('grid-item').html('.').event( 'click',(self) => {
                        if (this.input.length == 0) this.input = '0';
                        this.input = `${this.input}.`;
                        update();
                    }),
                    self.create('div').class('grid-item').call((self) => {
                        if (LANGUAGE.includes('fr')) self.html('Enlever');
                        else self.html('Remove');

                    }).event( 'click',(self) => {
                        this.input = this.input.slice(0, -1);
                        update();
                    }),
                    self.create('div').class('grid-item').call((self) => {
                        if (LANGUAGE.includes('fr')) self.html('Vider');
                        else self.html('Reset');
                    }).event( 'click',() => {
                        this.input = '';
                        update();
                    }),
                    self.create('input').class('text-box', 'template-number-input').val(this.input).make('number-input'),
                )
            }),
            this.element.create('div').class('template-number-accept-section', 'row').add(
                this.element.create('div').class('template-number-accept', 'btn').html('Accept').event( 'click',(self) => {
                    if (this.input.length == 0) {
                        this.call(0);
                    } else {
                        this.call(parseFloat(this.input));
                    }
                    this.element.remove();
                }),
                this.element.create('div').class('template-number-cancel', 'btn').html('Cancel').event( 'click',(self) => {
                    this.call(false);
                    this.element.remove();
                }),
            ),
        ).in('body');

        let self = this;
        function update() {
            self.element.bind('number-input').val(self.input.toString());
        }
        return this;
    }
    callback(callback) {
        this.call = callback;
        return this;
    }
}
*/
class FontManager {
    fonts = [];
    fontElement = document.createElement('style');
    selectedFont = undefined;
    defaultValue = 'Arial';
    constructor() {
        document.head.appendChild(this.fontElement);
    }
    _fontExists(name) {
        return this.fonts.findIndex(e => e.name === name) === -1 ? false : true;
    }
    default(name, value = 'Arial') {
        if (this._fontExists(name))
            return this;
        const font = {
            alias: name,
            name: value,
            value: value,
            type: 'default',
            url: false
        };
        this.fonts.push(font);
        return this;
    }
    add(name, fontUrl = false, type = false) {
        if (this._fontExists(name))
            return this;
        let proxy = 'TrueType';
        if (!fontUrl) {
            type = '';
            fontUrl = '';
        }
        else {
            proxy = type === false ? fontUrl.split('.').at(-1) : type;
            if (!proxy)
                return this;
        }
        const font = {
            alias: name,
            name: name,
            value: name,
            url: fontUrl,
            type: proxy,
        };
        this.fonts.push(font);
        this._updateFontElement(font);
        return this;
    }
    _updateFontElement(font) {
        if (!font.url)
            return;
        this.fontElement.innerHTML += `
        @font-face {
            font-family: ${font.name};
            src: url(${font.url}) format('${font.type}');
        }`;
    }
    displayOnSelector(select) {
        let proxy = typeof select === 'string' ? document.querySelector(select) : select;
        if (!proxy)
            throw new Error('Selector not found');
        let selector = proxy;
        this.fonts.forEach(font => {
            let option = document.createElement('option');
            if (font.type === 'default') {
                option.style.fontFamily = font.value;
                option.value = font.value;
                option.innerHTML = font.alias;
            }
            else {
                option.value = font.name;
                option.style.fontFamily = font.name;
                option.innerHTML = font.name;
            }
            selector.appendChild(option);
        });
        selector.value = this.fonts[0].name;
        selector.style.fontFamily = this.fonts[0].name;
        selector.addEventListener('input', () => {
            if (selector.value === this.defaultValue)
                return selector.style.fontFamily = this.defaultValue;
            if (!this.selectedFont)
                return;
            this.selectedFont = this.fonts.find(e => e.name === selector.value);
            this.selectedFont = this.selectedFont ?? this.fonts.find(e => e.type === 'default');
            if (!this.selectedFont)
                throw new Error('Font not found');
            if (this.selectedFont.type === 'default')
                selector.style.fontFamily = this.defaultValue;
            else
                selector.style.fontFamily = this.selectedFont.name;
        });
    }
}
class InfoBoxTemplate {
    static box(select, title, content, customElement = false) {
        let proxy;
        if (typeof select === 'string')
            proxy = document.querySelector(select);
        else if (select instanceof Element)
            proxy = Array(select);
        if (!proxy)
            return;
        let selector = proxy;
        let man = this.makeBox(title, content, customElement);
        let mouseover = false;
        let timeout;
        selector.forEach(e => e.addEventListener('mouseenter', () => {
            mouseover = true;
            timeout = setTimeout(() => {
                if (!mouseover)
                    return;
                man.display(true);
                mouseover = false;
            }, 1000);
        }));
        selector.forEach(e => e.addEventListener('mouseleave', () => {
            mouseover = false;
            clearTimeout(timeout);
        }));
        document.addEventListener('click', () => man.display(false));
        return man;
    }
    static makeBox(title, content, customElement = false, display = false) {
        let man = new ElementManager().class('template-info-box');
        man.add(man.create('h3').class('template-info-box-title').plainhtml(title).make('title'), man.create('span').class('separator', 'set2'), man.create('div').class('template-info-box-content').plainhtml(content).make('content'), man.create('span').class('separator', 'set2')).display(display).in('body');
        if (customElement)
            man.add(customElement);
        return man;
    }
}
var IconList;
(function (IconList) {
    IconList["add"] = "add-circle";
    IconList["ajouter"] = "add-circle";
    IconList["list"] = "list";
    IconList["toolbox"] = "toolbox";
    IconList["rotate"] = "rotate";
    IconList["forward"] = "back-reverse";
    IconList["back"] = "back";
    IconList["check"] = "check";
    IconList["deny"] = "deny";
    IconList["copy"] = "copy";
    IconList["cogWheel"] = "cog-wheel";
    IconList["paste"] = "paste";
    IconList["play"] = "play";
    IconList["question"] = "question-mark";
    IconList["text"] = "text-field";
    IconList["trash"] = "trash";
    IconList["delete"] = "trash";
    IconList["supprimer"] = "trash";
    IconList["remove"] = "trash";
    IconList["unify"] = "unify";
    IconList["merge"] = "unify";
    IconList["start"] = "start";
    IconList["execute"] = "start";
    IconList["eye"] = "eye";
    IconList["oeil"] = "eye";
})(IconList || (IconList = {}));
;
class Icon {
    path;
    constructor(path = 'common/WebApp/icons') {
        this.path = path;
    }
    /**
     *
     * @param {string} name
     * @param {boolean} url_Only
     * @param {string} path
     * @returns {string} img or path
     */
    static svg(name, url_Only = true, path = '/common/WebApp/icons') {
        switch (name) {
            case 'setup':
                name = 'cog-wheel';
                break;
            case 'back':
            case 'reverse':
            case 'undo':
                name = 'back';
                break;
            case 'forward':
            case 'forwards':
                name = 'back-reverse';
                break;
        }
        return url_Only ? `${path}/${name}.svg` : `<img class="icon-template" src="${path}/${name}.svg"</img>`;
    }
    make(name, url_Only = true, path = false) {
        if (!path)
            path = this.path;
        return Icon.svg(name, url_Only, path);
    }
}
export { Icon, InfoBoxTemplate, FontManager, SideMenuTemplate, MouseManager, KeyBoardManager, FolderManager, ElementManager, DateManager, ReturnManager, AnimationManager, RotationableElement, DragableElement, ResizableElement, InteractionManager, UserManager, WSManager, Security, ContextualMenu, Utils, WebApp, PageController, IconList };
