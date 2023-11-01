# Welcome to Web-creation devtool!




# Installation :minidisc:

1. clone this repo :cloud:
2. run ```./init.sh``` :hammer: 
3. Enjoy! :tada:

> this will ask you to **create a first project**  ( Optional )

# What you need to know :question:
This is a template that is strict to follow rules!
you should first learn to **use typescript**. 

> [!IMPORTANT]
> Our team will **verify every Themes or Styles** sended to us before deploying it to Web-creation app. If there is any errors or rule not followed the Theme/Style will be rejected with a reason

> [!NOTE]
> If you want to **create a project** `php ./dev/create.php` and access the project created in **./dev/{ProjectName}/**
> You can send/check the status of your themes and Styles in the **Devlopper-zone** on the app

# Documentation :clipboard:
- **Here you will find documentation for creating a theme**

## Common (TypeScript)

- **Builder**
:speech_balloon: Description: This is a window where the user can manage the **Theme / Action**
Builder Exemple:
<iframe src="https://drive.google.com/file/d/13JP7H6fETATA59q3gZNu09S-enW8cyCm/preview" width="640" height="480" allow="autoplay"></iframe>
code Exemple: 
```typescript
new dev.Action() 
/* OR */
new dev.Theme()
	.setBuilder((theme) => new ElementManager().call((self) => {
		/* Here you will create the builder */
	}));
```

- **data**
:page_with_curl: Description: the data is accessed and set via 2 ways both have the same outcome but global method is prefered
	1. ElementManager has a method called **global()** 
	```typescript
	new ElementManager().call(self => {
			/* append data and over-right if key is already set (return self) */
			self.global({key: value}) 

			/* will return the data set in Theme or Action data */
			self.global() // will return 
		})
	```
	2. **Theme & Action** have a variable **data** Accessed has showned
	```typescript
	new dev.Theme()
		.setBuilder(theme => new ElementManager().call(self => {
			theme.data /* Contain the data of the theme and can be edited */
		}))
		.addAction(new Action()
			.setBuilder((action) => ElementManager().call((self) => {
				action.data /* Contain the data related to the action and can be edited */
			})
		);
	```
	> **Action can Access Theme data in the callbacks functions**

	 > [!WARNING]
	 > Action data cannot have Class Object due to the fact that data is turned into JSON string and will crash!


## Theme (TypeScript)
> [!NOTE]
> this is the mendatory code to start with



---
