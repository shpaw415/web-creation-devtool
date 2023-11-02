# Welcome to Web-creation devtool!
- [Test Your Theme](https://wc.mate-team.com/devtool/index.html) <- link to the testing tool :toolbox:



# Installation :minidisc:

1. clone this repo :cloud:
2. run ```./init.sh``` :hammer: 
3. Enjoy! :tada:

> this will ask you to **create a first project**  ( Optional )

# What you need to know :question:
This is a template that is strict to follow rules!
you should first learn to **use typescript** and if you want to create themes with backend communication **PHP** is the language used. 

> [!IMPORTANT]
> Our team will <ins>verify</ins> **every Themes or Styles** sended to us before deploying it to Web-creation app. If there is any errors or rule not followed the Theme/Style will be rejected with a reason

> [!NOTE]
> If you want to **create a project** `php ./dev/create.php` and access the project created in **./dev/{ProjectName}/**
> 
> You can **send** or **Check the status** of your <ins>themes and Styles</ins> in the **Devlopper-zone** on the app [Web-creation](wc.mate-team.com).

# Documentation :clipboard:
### Main table of contents
| name     |    Description    |
|----------|:-----------------:|
| [Builder](#builder) | window to manage the Theme/Action by the user |
| [data](#data) | data to custom the Theme/Action managed by the user with the [builder](#builder). |
| [Theme](#theme) | the bloc of code used in Web-creation app and into the compiled site [[TypeScript](#theme-typescript), [Html](#theme-html), [css](#theme-css), [php](#theme-php)]|
| [WebApp](#webapp) | Template use to create [builder](#builder). and manage Events of your Theme and Action |



## Common methods (TypeScript)

### Builder

- :speech_balloon: Description: 
	- This is a window where the user can manage the **Theme / Action**

Builder Exemple:
![Builder](https://github.com/shpaw415/web-creation-devtool/blob/main/images/builder.png?raw=true)

code Exemple: 
```typescript
new dev.Action() 
/* OR */
new dev.Theme()
	.setBuilder((theme) => new ElementManager().call((self) => {
		/* Here you will create the builder */
	}));
```
---
### Data
- :speech_balloon: Description:
	- the data is maintained to the compiled site
---
- **Theme & Action** have a variable **data** Accessed has showned
	```typescript
	new dev.Theme()
		.setBuilder((theme) => new ElementManager().call(self => {
			theme.data /* Contain the data of the theme and can be edited */
			theme.assosiatedActions /* Array<Action> you can access data of actions related*/
		}))
		.addAction(new Action()
			.setBuilder((action) => ElementManager().call((self) => {
				action.data /* Contain the data related to the action and can be edited */
				action.theme.data /* Contain the Theme data */
			})
		);
	```
	---

	 > [!WARNING]
	 > <ins>**Action.data**</ins> **cannot** Contain Class Object due to the fact that data is turned into JSON string and will crash!
	 > <ins>**Theme.data**</ins> **can** Contain Class object but will be destroyed each time the user change page or redo/undo event occure, so **Theme.init_callback()** must be set accordingly
---


### Theme


## Theme (TypeScript) :paintbrush:
##### theme typescript
 - :speech_balloon: Description:
	 - Is a block of code that can <ins>optionaly</ins> contain backend communication in **php** or purely frontend block. 
---
#### Related features

- [Builder](#builder) :hammer:
- [Data](#data)
- [WebApp.ElementManager](#elementmanager)
- ---
Initialise the builder with an ElementManager
```javascript
	setBuilder((theme) => new ElementManager())
```

---
## Theme (PHP) :robot:
##### theme php

- :speech_balloon: Description:
	- The backEnd is accessed via a class named WcBackendManager that is related with your **Theme** 
---
#### Related features
 
---
## WebApp

- :speech_balloon: Description:
	- this is the template used to build Theme in **TypeScript**

> [!NOTE]
> this is a big part of the theme building so be sure to understand that is going on with **ElementManager** beeing the central element you must understand 
---
### ElementManager

### ElementManager table of contents
| | name | Description | |
| - | :-: | - | :-: | - | - |
|| [Event](#elementmanager-event) | Event management like (click, mouseover, mouseleave, ...)  ||
|| [Structure](#elementmanager-structure) | the way you can add elements and access them ||
|| [Good practice](#elementmanager-good-practice) | Good practice when using ElementManager ||
||  [Settings](#elementmanager-settings) | set Class, style, id, placeholder, ... ||
|| [data](#elementmanager-data) | data storage global and local ||

---
### ElementManager Event
> this is how you can add event on an element represented by an ElementManager
```typescript
new ElementManager().event('click', (self:ElementManager, event:Event) => void)
```
---
### ElementManager structure
> [!NOTE]
> this is a **very important part** to understand  

To represent how the structure works:
- ElementManager can **call a function** <ins>triggered</ins> when the **ElementManager is created**
	```typescript
		new ElementManager().call((self:ElementManager) => {
			/* call when ElementManager is created */
			// Code...
		});
	```
- The main ElementManager is containing chilrens of ElementManager
	```typescript
		new ElementManager().call((self: ElementManager) => {
			/* this way you can add ElementManager in the main and children can as well*/
			self.add(
				self.create('button'), // this is another instance of ElementManager
				self.create('div').add(
					self.create('button') // the child will get a child as well
				),
				/* add... */
			);
		});
	```
- ElementManager object can be accessed everywhere in the structure
	```typescript
	new ElementManager().call((self) => {
		self.add(
			self.create('div').call((selfChild) => {
				/* 
					this will return the instance of ElementManager of 
					the main ElementManager
				*/ selfChild.bind('main-elementManager') 
			}).make('child-of-main-elementManager')
			// name the element as you wish to with make()
		);
		self.bind('child-of-main-elementManager') // this way you are now
	}).make('main-elementManager');
	```
---
### ElementManager Settings
> [!NOTE]
> You can set any of the element propreities with set()
> but other methods are recommended 

- **set** method:
```typescript
	new ElementManager()
	// set(key, value) replace the current value of the element
	.set('placeholder', 'value of the placeholder')
```
- **class** <ins>add, remove and switch</ins> & **id** <ins>set and get</ins>:
```typescript
	/* 
		__WC_ID__ is mendatory and will be replaced with the themeName 
		when used or compiled it resolve 
		the probleme of class name conflict or id
	*/
	new ElementManager()
		// add className if not exists
		.class('__WC_ID__className', '__WC_ID__otherClassName')
		// remove a className if exists
		.classRemove('__WC_ID__classNameToRemove')
		// switch between 2 classes 3th argument is optional 
		// but if it must be set to one of the 2 classes
		.classSwitch('__WC_ID__className1', '__WC_ID__className2', '__WC_ID__mustBeClass')
		// set the id of the element
		.id('__WC_ID__idSuffix')
		// get the id of the element
		._id()
	
```

- **style** <ins>set</ins> :
```typescript
	new ElementManager()
		// set style to the element over-write if exists add if dont
		.style({width: '50px', height: '20px'})
```
---
### Elementmanager Data
> you can store data directly on the ElementManager instance

> [!IMPORTANT]
> you **cannot** put class object or reference into the data structure
> this will result in a crash you can store it under Theme data but will need
> to be reset every time, so must be properly create in [Theme.InitCallback](#theme-init)

- **data** can be <ins>access and set</ins> & **can search data on other ElementManager of the structure**:
```typescript
	
	new ElementManager()
		// Over-write if exists
		.setdata({key: 'value'})
		// Access with the variable data
		.data;


	new ElementManager()
		.setdata({select: false})
		.call(self => {
			self.add(
				self.create('div')
					.setdata({select: true})
					// will return the parent due to the fact that: data = {select: false}
					.findData('select', false)
					.setdata({select: true}),
				self.create('div').setdata({select: true})
			);
		
			// return the first ElementManager with this {key: value}
			self.findData('select', true);
		
			// return Array<ElementManager> with given {key: value}
			self.findAllData('select', true);
	});
	
```
