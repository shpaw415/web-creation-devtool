import * as wa from './WebApp.class.js';
import { ThemeID, contextmenu } from './index.js';
export let $ = new wa.WebApp(); 


export enum UserFields {
    name = 'name',
    surname = 'surname',
    email = 'email',
    age = 'age',
    phone = 'phone',
    address = 'address',
};

export interface ElementStruct {
    id: string;
    tag: ElementTags;
};
export enum ElementTags {
    input = 'input',
    div = 'div',
    h1 = 'h1',
    button = 'button',
    p = 'p',
    mainContianer = 'main'
}

export interface PageStruct {
    name: string;
    elements: Array<ElementStruct>;
};

export enum actionType {
    click = 'click',
    dblclick = 'dblclick',
    mouseOver = 'mouseover',
    mouseLeave = 'mouseleave',
    mouseMove = 'mousemove',
    contextmenu = 'contextmenu',
    mouseenter = 'mouseenter',
    mouseup = 'mouseup',
    mousedown = 'mousedown',
    mouseout = 'mouseout',

    keydown = 'keydown',
    keyup = 'keyup',
    keypress = 'keypress',
};

export interface Config {
    /** Theme.isTemplate the value returned */
    isTheme: boolean;
    /** set the pages  */
    pages: PageStruct[];
    /** set userFields */
    userFields: Array<UserFields>;
    /** Current page */
    currentPage: PageStruct['name'];
    /** onElementAddConfig */
    onElementAdd: {
        tag: ElementTags,
        id: string;
    }

};

export class Organizer {
    public Theme: Theme|undefined;
    public Action: Action|undefined;

    public Configs: Partial<Config> = {
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
    public setConfig(config: Partial<Config>) {
        this.Configs = config;
        if(this.Configs.pages) this.Configs.pages.push(...config.pages as Config['pages']);
    }

    public setTheme(theme: Theme) {
        this.Theme = theme;
    }
    public setAction(action: Action) {
        this.Action = action;
    }
    public reset() {
        this.Action = undefined;
        this.Theme = undefined;
    }
}

export let organizer: Organizer = new Organizer();
(window as any).wc_data = {
    organizer: organizer
};


export type Subset<K> = {
    [attr in keyof K]?: K[attr] extends object
        ? Subset<K[attr]>
        : K[attr] extends object | null
        ? Subset<K[attr]> | null
        : K[attr] extends object | null | undefined
        ? Subset<K[attr]> | null | undefined
        : K[attr];
};
export interface CompilerOptions {

};

export enum Immutable {
    transform = 'transform',
    margin ='margin',
    padding = 'padding',
    width = 'width',
    height = 'height',
    left = 'left',
    top = 'top',
    position = 'position',
    display = 'display',
    flexDirection = 'flexDirection',
    justifyContent = 'justifyContent',
    alignItems = 'alignItems',
    background = 'background',
    borderColor = 'borderColor',
    borderRadius = 'borderRadius',
    borderStyle = 'borderStyle',
    borderWidth = 'borderWidth',
    fontSize = 'fontSize',
    fontFamily = 'fontFamily',
    color = 'color',
    backgroundFirstColor = 'backgroundFirstColor',
    backgroundSecondColor = 'backgroundSecondColor',
    border = 'border',
    customBackgroundColor = 'customBackgroundColor',
    fitContent = 'fitContent',
    fixedSize = 'fixedSize',
    fixedPosition = 'fixedPosition',
    overflow = 'overflow',
};

export interface ActionSaveStruct {
    callback: string;
    editor_callback: string;
    live_callback: string;
    builderInitCallback: string;
    rawBuilder: string;
    onAccept: string;
    id: string;
    name: string;
    alias: string;
    description: string;
    Actiondata: {[key: string]: string|boolean|number};
    isTheme: boolean;
    theme: string|undefined;
    basicAction: boolean;
    active: boolean;
    isClone: boolean;
    eventType: string;
    element: string|undefined;
};

export enum ElementDisplayMode {
    flex = 'flex',
    none = 'none',
};
export enum ElementFlexDirections {
    column = 'column',
    row = 'row',
};
export enum ElementJustifyContent {
    start = 'flex-start',
    center = 'center',
    end = 'flex-end',
    spaceBetween ='space-between',
    spaceAround ='space-around',
    spaceEvenly ='space-evenly',

};
export enum ElementAlignItems {
    center = 'center',
    start = 'flex-start',
    end = 'flex-end',
};
export enum ElementPositions {
    relative = 'relative',
    absolute = 'absolute',
    sticky = 'sticky',
    float = 'float',
};
export enum typesofBackground {
    single = 'single', 
    linearGradientLtoR ='linearGradientLtoR',
    linearGradientTtoB = 'linearGradientTtoB', 
    radialGradient = 'radialGradient'
};
export enum borderStyles {
    none = 'none',
    dotted = 'dotted',
    dashed = 'dashed',
    solid ='solid',
    double = 'double',
    groove = 'groove',
};
export enum ElementFormats {
    px = 'px',
    em = 'em',
    ex = 'ex',
    ch = 'ch',
    rem ='rem',
    vw = 'vw',
    vh = 'vh',
    cm = 'cm',
    mm ='mm',
    in = 'in',
    pt = 'pt',
    percent = '%',
};
export enum ElementOverFlow {
    hidden = 'hidden',
    scroll ='scroll',
    auto = 'auto',
}
export interface ElementStyleFormatStruct {
    value: string|number;
    format: ElementFormats;
}

export interface ElementDataStruct extends ElementStyleStruct {

    element: boolean;
    main: boolean;
    selected: boolean;
    template: boolean,
    themeName: string;
    tag: ElementTags;
    theme: Theme; // Theme object for callbacks on (page change,...)
    templateInited: boolean;
    wcEvent: Array<Action>;
    contextualData: any; // to parse as context object


    contextual: null|wa.ContextualMenu; // ContextualMenu object
    bypass: boolean;
    grouped: boolean; // If true, the element will be grouped in the toolbox and will not be selectable

    name: string;
    mode: string;
};
export interface ElementStyleStruct {
    immutable: Array<Immutable>;

    fixedPosition: boolean;
    fixedSize: boolean;
    fitContent: boolean;

    display:  ElementDisplayMode;
    flexDirection: ElementFlexDirections;
    justifyContent: ElementJustifyContent|false;
    alignItems: ElementAlignItems|false;

    /// Font section
    fontFamily: string;
    fontSize: ElementStyleFormatStruct;
    color: false|string;

    customBackgroundColor: boolean,
    primaryBackground: boolean,
    typeofBackground:  typesofBackground,
    background: string,
    opacity: string;
    /**
     * must be a hex string like #000000
     */
    backgroundSecondColor: string,
    /**
     * must be a hex string like #000000
     */
    backgroundFirstColor: string,

    /**
     * must be a hex string like #000000
     */
    borderColor: string,
    /**
     * the value must be set like this: "0 0 0 0" (relace 0 with your value)
     */
    borderRadius: ElementStyleFormatStruct,
    borderStyle: borderStyles,
    /**
     * the value must be set like this: "0 0 0 0" (relace 0 with your value)
     */
    borderWidth: ElementStyleFormatStruct,

    width: ElementStyleFormatStruct,
    height: ElementStyleFormatStruct,

    /**
     * the value must be set like this: "0 0 0 0" (relace 0 with your value)
     */
    margin: ElementStyleFormatStruct,
    /**
     * the value must be set like this: "0 0 0 0" (relace 0 with your value)
     */
    padding: ElementStyleFormatStruct,
    position: ElementPositions,
    top: ElementStyleFormatStruct,
    left: ElementStyleFormatStruct,

    overflow: ElementOverFlow,

    /**
     * the value must be set like this: "0 0 0 0" (relace 0 with your value)
     */
    transform: ElementStyleFormatStruct,
    classes: Array<string>,
    styleClass: string|null,
}
export class CommonData {
    public data: {[key: string]: unknown} = {};
    public element: wa.ElementManager|null = null;
    public builderInitCallback: (self: Theme|Action, builder: wa.ElementManager) => void = () => { };
    public onAccept: (self: Theme|Action) => boolean = () => true;
    public builder: wa.ElementManager|null = null;
    public rawBuilder: string = '';

    public compilerOptions: CompilerOptions = {};

    public getPages(): Array<string> {
        return organizer.Configs.pages?.map((page) => page.name) ?? [];
    }
    public switchPage(page:string):void {
        if(!organizer.Configs.pages?.find((p) => p.name === page)) { $.utils.WarningMsg(wa.Utils.translate('page introuvable','Page not found')); return; }
        organizer.Configs.currentPage = page;
        $.utils.WarningMsg(wa.Utils.translate(`page changer vers ${page}`,`page switched to ${page}`));
    }
    /**
     * 
     * @param {Action|Theme} Element the theme instance or the action instance
     */
    public async showBuilder() {
        const txt = this instanceof Theme? 'Theme' : wa.Utils.translate('Evenement', 'Event');
        if (!this.builder) return;
        let builder = this._getBuilder() as wa.ElementManager;
        await builder.done;
        const res = await $.utils.CustomBox(
            builder,
            wa.Utils.translate(
                'Personaliser votre ' + txt, 
                'Customise your ' + txt
            )
        );
        if (res) this._onAccept();
        return res;
    }
    /** this is the Element.id associated with the Theme/Action */
    public getElementId() {
        return this.element?.element.id;
    }

    private _getBuilder() {
        if (!this.builder) return null;
        this.builder.global({...this.builder.global(),...this.data});
        const caller = async (global:any) => {
            if (!this.builder) return;
            await this.builder.done;
            this.builder.global({...global});
            if (this instanceof Theme) this.builderInitCallback((this as Theme), this.builder)
            else if(this instanceof Action) this.builderInitCallback((this as Action), this.builder)
            else this.builderInitCallback((this as any), this.builder)

            this.builder.children().forEach((e) => e.setdata());
        }; caller(this.builder.global());
        return this.builder;
    }
    /**
    * @example (self, builder) => {'code...'}
    */
    public setBuilderOpen(callback: (self: Theme|Action, builder: wa.ElementManager) => void) {
        this.builderInitCallback = callback;
        return this;
    }
    /**
    * the Builder of the Theme/Action
    * @example (self) => new ElementManger().call((elManager) => {}) // must be an instance of ElementManager
    */
    public setBuilder(builder: (self: Theme|Action) => wa.ElementManager) {
        this.rawBuilder = builder.toString();
        if(this instanceof Action) this.builder = builder(this as Action);
        else if (this instanceof Theme) this.builder = builder(this as Theme);

        if (this.builder instanceof wa.ElementManager === false || !this.builder) {
            throw new Error('The builder must be an instance of ElementManger');
        }
        this.builder.global({...this.builder.global() , ...this.data});
        return this;
    }

    private _onAccept(addToHistory = true) {
        if(!this.builder) return;
        this.data = {...this.data, ...this.builder.global() };
        if(this instanceof Action) this.onAccept(this);
        else if (this instanceof Theme) this.onAccept(this);
    }
    /**
    * Called when the builder is accepted
    * @param {Function} callback will be called when the action is accepted
    */
    public setOnAccept(callback: (self: Theme|Action) => boolean) {
        this.onAccept = callback;
        return this;
    }
    /** Get the elements of the current page*/
    public getElements(): Array<{id: string, tag: ElementTags}> {
        return organizer.Configs.pages?.find(p => p.name === organizer.Configs.currentPage)?.elements.map((el) => {
            return {
                id: el.id,
                tag: el.tag
            }
        }) ?? [];
    }
    /** get the registerFields asked by the user */
    public getRegisterFields(): Array<UserFields> {
        return organizer.Configs.userFields ?? [];
    }
}
export class Theme extends CommonData {
    public theme_id: string = ThemeID;

    public _initCallback: (self: Theme) => void = () => { };
    public _destroyCallback: (self: Theme) => void = () => { };
    public assosiatedActions: Array<Action> = [];
    public onPageAddCallback: (self: Theme, pageLsit: Array<string>) => void = () => { };
    public onPageRemoveCallback: (self: Theme, pageList: Array<string>) => void = () => { };
    public onElementAddCallback: (self: Theme, element: wa.ElementManager) => void = () => { };
    public onElementRemoveCallback: (self: Theme, element: Array<wa.ElementManager>) => void = () => { };
    public liveInitCallback: (self: Theme) => void = () => { }; // need to be set for the live version of the theme
    public customData: Subset<ElementStyleStruct> = {};

    public constructor() {
        super();
        this.element = new wa.ElementManager('#htmlSection');
        organizer.setTheme(this);
    }
    /**
 * @example (self) => {callback()} // the Element is accessible in self.element
 * @description this is the initCallback for the editor and the live version if live_initCallback is not set
 */
    public editor_initCallback(callback: (self: Theme) => void) {
        this._initCallback = callback;
        if (!this.liveInitCallback) this.liveInitCallback = callback;
        return this;
    }
    /** @description this is the live version of the initCallback and will falback to editor_initCallback if not set */
    public live_initCallback(callback: (self: Theme) => void) {
        this.liveInitCallback = callback;
        return this;
    }
    /** @description must be set for to destroy the theme left over Variables when the theme is removed */
    public destroyCallback(callback: (self: Theme) => void) {
        this._destroyCallback = callback;
        return this;
    }
    /** @example new Action() // the Theme is accessible in self.theme (self beeing the Theme instance) */
    public addAction(action: Action) {
        action.theme = this;
        action.isTheme = true;
        this.assosiatedActions.push(action);
        return this;
    }
    /** @example (self, contextual) => contextual.add('Icon', 'Text', () => Callback()).add('...') */
    public contextualmenu(callback: (self: Theme, contextualMenu: wa.ContextualMenu) => void) {
        contextmenu.init();
        callback(this, contextmenu);
        return this;
    }
    /** @example (self, pageList) => callback() */
    public onPageAdd(callback: (self: Theme, pageList: Array<string>) => void): Theme {
        this.onPageAddCallback = callback;
        return this;
    }
    /** @example (self, pageList) => callback() */
    public onPageRemove(callback: (self: Theme, pageList: Array<string>) => void):Theme {
        this.onPageRemoveCallback = callback;
        return this;
    }
    /** @example (self, newElement) => callback() */
    public onElementAdd(callback: (self: Theme, element: wa.ElementManager) => void):Theme {
        this.onElementAddCallback = callback;
        return this;
    }
    /** @example (self, ElementList) => callback() */
    public onElementRemove(callback: (self: Theme, elementList: Array<wa.ElementManager>) => void):Theme {
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
    public setdata(datas: Subset<ElementStyleStruct>):Theme {
        let self = this.element as wa.ElementManager;
        const data = datas as ElementDataStruct;
        let elem = self.element as HTMLElement;
        const keys = Object.keys(datas);
        elem.style.transition = 'none';
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i] as keyof ElementDataStruct;
            switch (key) {
                case 'overflow':
                    elem.style.overflow = data.overflow;
                    break;
                case 'width':
                case 'height':
                    if (data.fitContent === true) break;
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
                    if(data.classes) self.class(...data.classes);
                    break;
                case 'margin':
                case 'padding':
                    let marginList = ((data[key] as ElementStyleFormatStruct).value as string).split(' ');
                    if (marginList.length == 1) {
                        elem.style[key] = marginList[0] + data[key]?.format;
                        break;
                    }
                    for (let i = 0; i < 4; i++) {
                        marginList[i] == '' ? marginList[i] = '0' : null;
                        typeof marginList[i] != 'undefined' ? marginList[i] += data[key]?.format : marginList[i] = '0' + data[key]?.format;
                    } elem.style[key] = marginList.join(' ');
                    break;
                case 'transform':
                    // 1,2 translate; 3 rotate; 4,5 scaleX-Y;
                    let transform = (data.transform?.value as string).split(' ');
                    if (transform.at(-1) == '') transform.pop();
                    let scale = [1, 1];
                    let rotate = 0;
                    if (transform.length >= 3) rotate = parseInt(transform.at(2) as string);
                    if (transform.length == 4) scale = [parseInt(transform.at(3) as string), 1];
                    else if (transform.length == 5) scale = [parseInt(transform.at(3) as string), parseInt(transform.at(4) as string)];
                    elem.style.transform = `translate(${transform.at(0)}${data.transform?.format}, ${transform.at(1)}${data.transform?.format}) rotate(${rotate}deg) scale(${scale.at(0)}, ${scale.at(1)})`
                    break;
                case 'borderRadius':
                    let borderRadiusList = (data.borderRadius.value as string).split(' ');
                    if (borderRadiusList.at(-1) == '') borderRadiusList.pop();
                    if (borderRadiusList.length == 1) {
                        elem.style.borderRadius = borderRadiusList[0] + data.borderRadius.format;
                        break;
                    }
                    for (let i = 0; i < 4; i++) {
                        borderRadiusList[i] == '' ? borderRadiusList[i] = '0' : null;
                        typeof borderRadiusList[i] != 'undefined' ? borderRadiusList[i] += '%' : borderRadiusList[i] = '0%';
                    } elem.style.borderRadius = borderRadiusList.join(' ');
                    break;
                case 'borderColor':
                    elem.style.borderColor = data[key] || '';
                    break;
                case 'borderStyle':
                    if(data.borderStyle != 'none') elem.style.borderStyle = data[key] || 'none';
                    break;
                default:
                    if (
                        data[key as keyof ElementDataStruct] == ''
                        ||data[key as keyof ElementDataStruct] == null
                        ||data[key as keyof ElementDataStruct] == false
                    ) break;
                    if (typeof (data as any)[key].format == 'undefined') try { elem.style[key as any] = (data as any)[key]; } catch (e) { break; }
                    else { elem.style[key as any] = (data as any)[key].value + (data as any)[key].format }
                    break;
            }
        };
        return this;
    }
    public _onPageAdd() {
        this.onPageAddCallback(this, organizer.Configs.pages?.map(page => page.name) ?? []);
    }
    public _onPageRemove() {
        this.onPageRemoveCallback(this, organizer.Configs.pages?.map(page => page.name) ?? []);
    }
    public _onElementAdd(element: wa.ElementManager) {
        this.onElementAddCallback(this, element);
    }
    public _onElementRemove() {

    }
    public async _callInitCallback() {
    }
    public _callDestroyCallback() {
        
    }
    public static isTemplate(element:wa.ElementManager): boolean {
        return element.data.template;
    }
}
export class Action extends CommonData {
    public callback: null|Function = null;
    public editor_callback: (self: Action, Theme: Theme|null) => void = () => { };
    public live_callback: (self: Action, Theme: Theme|null) => void = () => {};
    public id: string = wa.Utils.RandomString(10);
    public name: string = '';
    public alias: string = '';
    public description: string = '';
    public isTheme: boolean = false;
    public theme: Theme|null = null;

    constructor() {
        super();
        this.element = new wa.ElementManager('#htmlSection');
        organizer.setAction(this);
    }
    
    public setName(name:string) {
        this.name = name;
        if (!this.alias) this.alias = name;
        return this;
    }
    public setAlias(alias:string) {
        this.alias = alias;
        return this;
    }
    public setDescription(description:string) {
        this.description = description;
        return this;
    }
    /**
     * @example (self, Theme) => callback() // Theme is for Theme.addAction()
     */
    public setCallback(callback: (self: Action, Theme: Theme|null) => void) {
        this.editor_callback = callback;
        if(!this.live_callback) this.live_callback;
        if(!this.callback) this.callback = callback;
        return this;
    }
    public setEditorCallback(callback: (self: Action, Theme: Theme|null) => void) {
        this.editor_callback = callback;
        if(!this.callback) this.callback = callback;
        return this;
    }
    public setLiveCallback(callback: (self: Action, Theme: Theme|null) => void) {
        this.live_callback = callback;
        this.callback = callback;
        return this;
    }
    public _callback() {
        this.editor_callback(this, this.theme);
    }
}
