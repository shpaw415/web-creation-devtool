import * as wa from './WebApp.class.js';
import { ThemeID, contextmenu } from './index.js';
export let $ = new wa.WebApp();
export var UserFields;
(function (UserFields) {
    UserFields["name"] = "name";
    UserFields["surname"] = "surname";
    UserFields["email"] = "email";
    UserFields["age"] = "age";
    UserFields["phone"] = "phone";
    UserFields["address"] = "address";
})(UserFields || (UserFields = {}));
;
;
export var ElementTags;
(function (ElementTags) {
    ElementTags["input"] = "input";
    ElementTags["div"] = "div";
    ElementTags["h1"] = "h1";
    ElementTags["button"] = "button";
    ElementTags["p"] = "p";
    ElementTags["mainContianer"] = "main";
})(ElementTags || (ElementTags = {}));
;
export var actionType;
(function (actionType) {
    actionType["click"] = "click";
    actionType["dblclick"] = "dblclick";
    actionType["mouseOver"] = "mouseover";
    actionType["mouseLeave"] = "mouseleave";
    actionType["mouseMove"] = "mousemove";
    actionType["contextmenu"] = "contextmenu";
    actionType["mouseenter"] = "mouseenter";
    actionType["mouseup"] = "mouseup";
    actionType["mousedown"] = "mousedown";
    actionType["mouseout"] = "mouseout";
    actionType["keydown"] = "keydown";
    actionType["keyup"] = "keyup";
    actionType["keypress"] = "keypress";
})(actionType || (actionType = {}));
;
;
export class Organizer {
    Theme;
    Action;
    Configs = {
        pages: [
            {
                name: 'main_container',
                elements: [
                    {
                        id: 'main_container',
                        tag: ElementTags.mainContianer
                    }
                ]
            }
        ]
    };
    /** Config for the devTool for testing only */
    setConfig(config) {
        this.Configs = config;
        if (this.Configs.pages)
            this.Configs.pages.push(...config.pages);
    }
    setTheme(theme) {
        this.Theme = theme;
    }
    setAction(action) {
        this.Action = action;
    }
    reset() {
        this.Action = undefined;
        this.Theme = undefined;
    }
}
export let organizer = new Organizer();
window.wc_data = {
    organizer: organizer
};
;
export var Immutable;
(function (Immutable) {
    Immutable["transform"] = "transform";
    Immutable["margin"] = "margin";
    Immutable["padding"] = "padding";
    Immutable["width"] = "width";
    Immutable["height"] = "height";
    Immutable["left"] = "left";
    Immutable["top"] = "top";
    Immutable["position"] = "position";
    Immutable["display"] = "display";
    Immutable["flexDirection"] = "flexDirection";
    Immutable["justifyContent"] = "justifyContent";
    Immutable["alignItems"] = "alignItems";
    Immutable["background"] = "background";
    Immutable["borderColor"] = "borderColor";
    Immutable["borderRadius"] = "borderRadius";
    Immutable["borderStyle"] = "borderStyle";
    Immutable["borderWidth"] = "borderWidth";
    Immutable["fontSize"] = "fontSize";
    Immutable["fontFamily"] = "fontFamily";
    Immutable["color"] = "color";
    Immutable["backgroundFirstColor"] = "backgroundFirstColor";
    Immutable["backgroundSecondColor"] = "backgroundSecondColor";
    Immutable["border"] = "border";
    Immutable["customBackgroundColor"] = "customBackgroundColor";
    Immutable["fitContent"] = "fitContent";
    Immutable["fixedSize"] = "fixedSize";
    Immutable["fixedPosition"] = "fixedPosition";
    Immutable["overflow"] = "overflow";
})(Immutable || (Immutable = {}));
;
;
export var ElementDisplayMode;
(function (ElementDisplayMode) {
    ElementDisplayMode["flex"] = "flex";
    ElementDisplayMode["none"] = "none";
})(ElementDisplayMode || (ElementDisplayMode = {}));
;
export var ElementFlexDirections;
(function (ElementFlexDirections) {
    ElementFlexDirections["column"] = "column";
    ElementFlexDirections["row"] = "row";
})(ElementFlexDirections || (ElementFlexDirections = {}));
;
export var ElementJustifyContent;
(function (ElementJustifyContent) {
    ElementJustifyContent["start"] = "flex-start";
    ElementJustifyContent["center"] = "center";
    ElementJustifyContent["end"] = "flex-end";
    ElementJustifyContent["spaceBetween"] = "space-between";
    ElementJustifyContent["spaceAround"] = "space-around";
    ElementJustifyContent["spaceEvenly"] = "space-evenly";
})(ElementJustifyContent || (ElementJustifyContent = {}));
;
export var ElementAlignItems;
(function (ElementAlignItems) {
    ElementAlignItems["center"] = "center";
    ElementAlignItems["start"] = "flex-start";
    ElementAlignItems["end"] = "flex-end";
})(ElementAlignItems || (ElementAlignItems = {}));
;
export var ElementPositions;
(function (ElementPositions) {
    ElementPositions["relative"] = "relative";
    ElementPositions["absolute"] = "absolute";
    ElementPositions["sticky"] = "sticky";
    ElementPositions["float"] = "float";
})(ElementPositions || (ElementPositions = {}));
;
export var typesofBackground;
(function (typesofBackground) {
    typesofBackground["single"] = "single";
    typesofBackground["linearGradientLtoR"] = "linearGradientLtoR";
    typesofBackground["linearGradientTtoB"] = "linearGradientTtoB";
    typesofBackground["radialGradient"] = "radialGradient";
})(typesofBackground || (typesofBackground = {}));
;
export var borderStyles;
(function (borderStyles) {
    borderStyles["none"] = "none";
    borderStyles["dotted"] = "dotted";
    borderStyles["dashed"] = "dashed";
    borderStyles["solid"] = "solid";
    borderStyles["double"] = "double";
    borderStyles["groove"] = "groove";
})(borderStyles || (borderStyles = {}));
;
export var ElementFormats;
(function (ElementFormats) {
    ElementFormats["px"] = "px";
    ElementFormats["em"] = "em";
    ElementFormats["ex"] = "ex";
    ElementFormats["ch"] = "ch";
    ElementFormats["rem"] = "rem";
    ElementFormats["vw"] = "vw";
    ElementFormats["vh"] = "vh";
    ElementFormats["cm"] = "cm";
    ElementFormats["mm"] = "mm";
    ElementFormats["in"] = "in";
    ElementFormats["pt"] = "pt";
    ElementFormats["percent"] = "%";
})(ElementFormats || (ElementFormats = {}));
;
export var ElementOverFlow;
(function (ElementOverFlow) {
    ElementOverFlow["hidden"] = "hidden";
    ElementOverFlow["scroll"] = "scroll";
    ElementOverFlow["auto"] = "auto";
})(ElementOverFlow || (ElementOverFlow = {}));
;
export class CommonData {
    data = {};
    element = null;
    builderInitCallback = () => { };
    onAccept = () => true;
    builder = null;
    rawBuilder = '';
    compilerOptions = {};
    getPages() {
        return organizer.Configs.pages?.map((page) => page.name) ?? [];
    }
    switchPage(page) {
        if (!organizer.Configs.pages?.find((p) => p.name === page)) {
            $.utils.WarningMsg(wa.Utils.translate('page introuvable', 'Page not found'));
            return;
        }
        organizer.Configs.currentPage = page;
        $.utils.WarningMsg(wa.Utils.translate(`page changer vers ${page}`, `page switched to ${page}`));
    }
    /**
     *
     * @param {Action|Theme} Element the theme instance or the action instance
     */
    async showBuilder() {
        const txt = this instanceof Theme ? 'Theme' : wa.Utils.translate('Evenement', 'Event');
        if (!this.builder)
            return;
        let builder = this._getBuilder();
        await builder.done;
        const res = await $.utils.CustomBox(builder, wa.Utils.translate('Personaliser votre ' + txt, 'Customise your ' + txt));
        if (res)
            this._onAccept();
        return res;
    }
    /** this is the Element.id associated with the Theme/Action */
    getElementId() {
        return this.element?.element.id;
    }
    _getBuilder() {
        if (!this.builder)
            return null;
        this.builder.global({ ...this.builder.global(), ...this.data });
        const caller = async (global) => {
            if (!this.builder)
                return;
            await this.builder.done;
            this.builder.global({ ...global });
            if (this instanceof Theme)
                this.builderInitCallback(this, this.builder);
            else if (this instanceof Action)
                this.builderInitCallback(this, this.builder);
            else
                this.builderInitCallback(this, this.builder);
            this.builder.children().forEach((e) => e.setdata());
        };
        caller(this.builder.global());
        return this.builder;
    }
    /**
    * @example (self, builder) => {'code...'}
    */
    setBuilderOpen(callback) {
        this.builderInitCallback = callback;
        return this;
    }
    /**
    * the Builder of the Theme/Action
    * @example (self) => new ElementManger().call((elManager) => {}) // must be an instance of ElementManager
    */
    setBuilder(builder) {
        this.rawBuilder = builder.toString();
        if (this instanceof Action)
            this.builder = builder(this);
        else if (this instanceof Theme)
            this.builder = builder(this);
        if (this.builder instanceof wa.ElementManager === false || !this.builder) {
            throw new Error('The builder must be an instance of ElementManger');
        }
        this.builder.global({ ...this.builder.global(), ...this.data });
        return this;
    }
    _onAccept(addToHistory = true) {
        if (!this.builder)
            return;
        this.data = { ...this.data, ...this.builder.global() };
        if (this instanceof Action)
            this.onAccept(this);
        else if (this instanceof Theme)
            this.onAccept(this);
    }
    /**
    * Called when the builder is accepted
    * @param {Function} callback will be called when the action is accepted
    */
    setOnAccept(callback) {
        this.onAccept = callback;
        return this;
    }
    /** Get the elements of the current page*/
    getElements() {
        return organizer.Configs.pages?.find(p => p.name === organizer.Configs.currentPage)?.elements.map((el) => {
            return {
                id: el.id,
                tag: el.tag
            };
        }) ?? [];
    }
    /** get the registerFields asked by the user */
    getRegisterFields() {
        return organizer.Configs.userFields ?? [];
    }
}
export class Theme extends CommonData {
    theme_id = ThemeID;
    _initCallback = () => { };
    _destroyCallback = () => { };
    assosiatedActions = [];
    onPageAddCallback = () => { };
    onPageRemoveCallback = () => { };
    onElementAddCallback = () => { };
    onElementRemoveCallback = () => { };
    liveInitCallback = () => { }; // need to be set for the live version of the theme
    customData = {};
    actions = [];
    constructor() {
        super();
        this.element = new wa.ElementManager('#htmlSection');
        organizer.setTheme(this);
    }
    /**
 * @example (self) => {callback()} // the Element is accessible in self.element
 * @description this is the initCallback for the editor and the live version if live_initCallback is not set
 */
    editor_initCallback(callback) {
        this._initCallback = callback;
        if (!this.liveInitCallback)
            this.liveInitCallback = callback;
        return this;
    }
    /** @description this is the live version of the initCallback and will falback to editor_initCallback if not set */
    live_initCallback(callback) {
        this.liveInitCallback = callback;
        return this;
    }
    /** @description must be set for to destroy the theme left over Variables when the theme is removed */
    destroyCallback(callback) {
        this._destroyCallback = callback;
        return this;
    }
    /** @example new Action() // the Theme is accessible in self.theme (self beeing the Theme instance) */
    addAction(action) {
        action.theme = this;
        action.isTheme = true;
        this.actions.push(action);
        return this;
    }
    /** @example (self, contextual) => contextual.add('Icon', 'Text', () => Callback()).add('...') */
    contextualmenu(callback) {
        contextmenu.init();
        callback(this, contextmenu);
        return this;
    }
    /** @example (self, pageList) => callback() */
    onPageAdd(callback) {
        this.onPageAddCallback = callback;
        return this;
    }
    /** @example (self, pageList) => callback() */
    onPageRemove(callback) {
        this.onPageRemoveCallback = callback;
        return this;
    }
    /** @example (self, newElement) => callback() */
    onElementAdd(callback) {
        this.onElementAddCallback = callback;
        return this;
    }
    /** @example (self, ElementList) => callback() */
    onElementRemove(callback) {
        this.onElementRemoveCallback = callback;
        return this;
    }
    /**
     * @example setdata({
     *  classes: ['customClass1', 'customClass2', ...],
     *  fixedSize: true,
     *  fixedPosition: false,
     *  immutable: ['fixedSize', 'fixedPosition' , ...], // attribute with this key cannot be modified
     * })
     */
    setdata(datas) {
        let self = this.element;
        const data = datas;
        let elem = self.element;
        const keys = Object.keys(datas);
        elem.style.transition = 'none';
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            switch (key) {
                case 'overflow':
                    elem.style.overflow = data.overflow;
                    break;
                case 'width':
                case 'height':
                    if (data.fitContent === true)
                        break;
                    elem.style[key] = `${data[key].value || '0'}${data[key].format || 'px'}`;
                    break;
                case 'fitContent':
                    elem.style.width = 'fit-content';
                    elem.style.height = 'fit-content';
                    self.data.width = {
                        format: 'px',
                        value: parseInt(self.css('width').toString())
                    };
                    self.data.height = {
                        format: 'px',
                        value: parseInt(self.css('height').toString())
                    };
                    break;
                case 'classes':
                    elem.className = '';
                    if (data.classes)
                        self.class(...data.classes);
                    break;
                case 'margin':
                case 'padding':
                    let marginList = data[key].value.split(' ');
                    if (marginList.length == 1) {
                        elem.style[key] = marginList[0] + data[key]?.format;
                        break;
                    }
                    for (let i = 0; i < 4; i++) {
                        marginList[i] == '' ? marginList[i] = '0' : null;
                        typeof marginList[i] != 'undefined' ? marginList[i] += data[key]?.format : marginList[i] = '0' + data[key]?.format;
                    }
                    elem.style[key] = marginList.join(' ');
                    break;
                case 'transform':
                    // 1,2 translate; 3 rotate; 4,5 scaleX-Y;
                    let transform = (data.transform?.value).split(' ');
                    if (transform.at(-1) == '')
                        transform.pop();
                    let scale = [1, 1];
                    let rotate = 0;
                    if (transform.length >= 3)
                        rotate = parseInt(transform.at(2));
                    if (transform.length == 4)
                        scale = [parseInt(transform.at(3)), 1];
                    else if (transform.length == 5)
                        scale = [parseInt(transform.at(3)), parseInt(transform.at(4))];
                    elem.style.transform = `translate(${transform.at(0)}${data.transform?.format}, ${transform.at(1)}${data.transform?.format}) rotate(${rotate}deg) scale(${scale.at(0)}, ${scale.at(1)})`;
                    break;
                case 'borderRadius':
                    let borderRadiusList = data.borderRadius.value.split(' ');
                    if (borderRadiusList.at(-1) == '')
                        borderRadiusList.pop();
                    if (borderRadiusList.length == 1) {
                        elem.style.borderRadius = borderRadiusList[0] + data.borderRadius.format;
                        break;
                    }
                    for (let i = 0; i < 4; i++) {
                        borderRadiusList[i] == '' ? borderRadiusList[i] = '0' : null;
                        typeof borderRadiusList[i] != 'undefined' ? borderRadiusList[i] += '%' : borderRadiusList[i] = '0%';
                    }
                    elem.style.borderRadius = borderRadiusList.join(' ');
                    break;
                case 'borderColor':
                    elem.style.borderColor = data[key] || '';
                    break;
                case 'borderStyle':
                    if (data.borderStyle != 'none')
                        elem.style.borderStyle = data[key] || 'none';
                    break;
                default:
                    if (data[key] == ''
                        || data[key] == null
                        || data[key] == false)
                        break;
                    if (typeof data[key].format == 'undefined')
                        try {
                            elem.style[key] = data[key];
                        }
                        catch (e) {
                            break;
                        }
                    else {
                        elem.style[key] = data[key].value + data[key].format;
                    }
                    break;
            }
        }
        ;
        return this;
    }
    _onPageAdd() {
        this.onPageAddCallback(this, organizer.Configs.pages?.map(page => page.name) ?? []);
    }
    _onPageRemove() {
        this.onPageRemoveCallback(this, organizer.Configs.pages?.map(page => page.name) ?? []);
    }
    _onElementAdd(element) {
        this.onElementAddCallback(this, element);
    }
    _onElementRemove() {
    }
    async _callInitCallback() {
    }
    _callDestroyCallback() {
    }
    static isTemplate(element) {
        return element.data.template;
    }
}
export class Action extends CommonData {
    callback = null;
    editor_callback = () => { };
    live_callback = () => { };
    id = wa.Utils.RandomString(10);
    name = '';
    alias = '';
    description = '';
    isTheme = false;
    theme = null;
    constructor() {
        super();
        this.element = new wa.ElementManager('#htmlSection');
        organizer.setAction(this);
    }
    setName(name) {
        this.name = name;
        if (!this.alias)
            this.alias = name;
        return this;
    }
    setAlias(alias) {
        this.alias = alias;
        return this;
    }
    setDescription(description) {
        this.description = description;
        return this;
    }
    /**
     * @example (self, Theme) => callback() // Theme is for Theme.addAction()
     */
    setCallback(callback) {
        this.editor_callback = callback;
        if (!this.live_callback)
            this.live_callback;
        if (!this.callback)
            this.callback = callback;
        return this;
    }
    setEditorCallback(callback) {
        this.editor_callback = callback;
        if (!this.callback)
            this.callback = callback;
        return this;
    }
    setLiveCallback(callback) {
        this.live_callback = callback;
        this.callback = callback;
        return this;
    }
    _callback() {
        this.editor_callback(this, this.theme);
    }
}
