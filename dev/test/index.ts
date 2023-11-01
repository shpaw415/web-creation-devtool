// Do not edit import part ////////////////////////
import { 
    ContextualMenu, 
    DragableElement, ElementManager, 
    ElementManagerSaveStruct, 
    FolderManager, FontManager, 
    Icon, IconList, InfoBoxTemplate, 
    PageController, ResizableElement, 
    RotationableElement, Utils, SideMenuTemplate
} from '../../WebApp.class.js';

import * as dev from '../../devtool.js';
import { $, contextmenu } from '../../index.js';

// end of imports //////////////////////////////////////////////

dev.organizer.setConfig({
    pages: [{
        name: 'page_2',
        elements: [{
            id: 'element_1',
            tag: dev.ElementTags.div
        }]
    }]
}); // set config see devtool.js


// add your Theme here ///////////////////////////

new dev.Theme()
    .setBuilder((theme) => new ElementManager().call(self => {
        self.add(
            self.create('div').html(theme.getElementId() ?? ''),
            self.create('input').set('placeholder', theme.getElementId() ?? '')
        )
    }))
    .addAction(
    new dev.Action()
        .setName('TestAction')
        .setBuilder((action) => new ElementManager().call(self => {
            self.add(
                self.create('div').html('ActionBuilder')
            )
        })
    )
)
.setdata({
    background: 'black',
    opacity: '0.5',
    borderRadius: {
        format: dev.ElementFormats.percent,
        value: '0 10 0 10'
    },
    immutable: [dev.Immutable.color]
})
.contextualmenu((self, contextmenu) => {
    contextmenu.add('X', 'test2', () => console.log('allo'))
})

/////////////////////////////////////////////////