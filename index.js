import * as wa from './WebApp.class.js';
import { organizer, $ } from './devtool.js';
export const ThemeID = 'WCTheme';
export let contextmenu = new wa.ContextualMenu('#htmlSection', 'right', false);
async function init() {
    _initMain();
}
init();
function _initMain() {
    let script = document.createElement('script');
    let htmlContent = '';
    let htmlSection = new wa.ElementManager('#htmlSection');
    let htmlBtn = new wa.ElementManager('#htmlInput').event('click', async (self) => {
        let file = await $.utils.GetFileFromUser();
        if (!file || !wa.Utils.checkFileExtension(file.name, ['html']))
            return $.utils.WarningMsg('must be html file');
        htmlContent = await file.text();
        htmlContent = await HTMLReplacer(htmlContent);
        htmlSection.plainhtml(htmlContent);
    });
    let cssContent = '';
    let cssSection = new wa.ElementManager('#cssSection');
    let cssBtn = new wa.ElementManager('#cssInput').event('click', async (self) => {
        let file = await $.utils.GetFileFromUser();
        if (!file || !wa.Utils.checkFileExtension(file.name, ['css']))
            return $.utils.WarningMsg('must be css file');
        cssContent = await file.text();
        cssContent = await HTMLReplacer(cssContent);
        cssSection.plainhtml(cssContent);
    });
    let jsContent = '';
    let jsSection = new wa.ElementManager('#jsSection');
    let jsBtn = new wa.ElementManager('#jsInput').event('click', async (self) => {
        let file = await $.utils.GetFileFromUser();
        if (!file || !wa.Utils.checkFileExtension(file.name, ['js']))
            return $.utils.WarningMsg('must be js file');
        jsContent = await file.text();
        loadJS(jsContent);
    });
    let resetBtn = new wa.ElementManager('#ResetBtn').event('click', (self) => {
        htmlSection.plainhtml(htmlContent);
        cssSection.plainhtml(cssContent);
        loadJS(jsContent);
    });
    let addElementBtn = new wa.ElementManager('#elementAdd').event('click', (self) => {
        if (!organizer.Theme)
            return;
        let elem = new wa.ElementManager().create(organizer.Configs.onElementAdd?.tag ?? 'div').id(organizer.Configs.onElementAdd?.id ?? 'elementAdd');
        organizer.Theme._onElementAdd(elem);
    });
    let removeElementBtn = new wa.ElementManager('#elementRemove').event('click', (self) => {
        if (!organizer.Theme)
            return;
        organizer.Theme._onElementRemove();
    });
    let addPageBtn = new wa.ElementManager('#pageAdd').event('click', (self) => {
        if (!organizer.Theme)
            return;
        organizer.Theme._onPageAdd();
    });
    let removePageBtn = new wa.ElementManager('#pageRemove').event('click', (self) => {
        if (!organizer.Theme)
            return;
        organizer.Theme._onPageRemove();
    });
    let dev_selector = new wa.ElementManager('#dev_selector');
    let actionSelector = new wa.ElementManager('#ActionSelecotr')
        .onupdate(async (self) => {
        self.clear();
        self.add(self.dummy('option', { html: 'Theme', value: 'theme' }));
        if (!organizer.Theme)
            return;
        for await (const action of organizer.Theme.actions) {
            self.add(self.dummy('option', { html: action.name, value: action.name }));
        }
        self.val('theme');
    });
    let triggerEventBtn = new wa.ElementManager('#triggerEvent').event('click', (self) => { triggerEvent(); });
    function triggerEvent() {
        if (!organizer.Theme)
            return;
        console.log(organizer.Theme);
        switch (dev_selector._val()) {
            case 'builder':
                const val = actionSelector._val();
                if (val == 'theme')
                    organizer.Theme?.showBuilder();
                else
                    organizer.Theme?.actions.find(act => act.name == val)?.showBuilder();
                break;
            case 'themeElement':
                organizer.Theme.actions.find(a => a.name === actionSelector._val())?._callback();
                break;
        }
    }
    async function loadJS(text) {
        organizer.reset();
        script.remove();
        script = document.createElement('script');
        script.type = 'module';
        script.innerHTML = `${await JSreplacer(text)}`;
        jsSection.element.appendChild(script);
        setTimeout(() => { actionSelector.update(); }, 1000);
    }
    async function JSreplacer(text) {
        const mods = [
            { from: '../../WebApp.class.js', to: './dist/WebApp.class.js' },
            { from: '../../devtool.js', to: './dist/devtool.js' },
            { from: '../../index.js', to: './dist/index.js' },
        ];
        for await (const mod of mods)
            text = text.replace(mod.from, mod.to);
        text = `${text} \n\n `;
        return text;
    }
    async function HTMLReplacer(text) {
        const mods = [
            { from: '__WC_ID__', to: 'htmlSection_' }
        ];
        for await (let mod of mods)
            text = text.replaceAll(mod.from, mod.to);
        return text;
    }
}
export { $ };
