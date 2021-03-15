# Books Manager

Greetings and salutations! Welcome to Books Manager UI! This application is designed to work alongside a state of the art
Java based server for handling UI requests and forwarding them to Adobe Content Server.

## Features

* responsive application using rx-js and Angular 8
* secure application using a JWT token-base auth and user roles
* friendly user interface
* login page
* logout feature, with display of the logged user
* integration with tabulator.io grid system
* import data/ download ebooks features supported
* image preview for edit book and import process
* create/ edit uploaded books
* download epub/ encrypted epub

## Build and start on dev

Can be compiled and started using:

```
npm install
npm start
```

or as an Angular CLI server.

## Create and deploy app bundle

```
 ng build --prod --base-href /books --deploy-url /books/
```

After this, create a war file with the contents of the `/dist` folder and drop it like it's hot in a Tomcat `/webapps` 
folder. It will automatically be exploded by Tomcat and will be accessible under something like:

```
http://localhost:8080/books/
```

See https://shekhargulati.com/2017/07/06/angular-4-use-of-base-href-and-deploy-url-build-options/ for more details.
(Backend probably runs in the same Tomcat at):

```
http://localhost:8080/bm/
```

See `environment.apiUrl` property for this.

In order to be able to execute the `ng` commands, the `angular/cli` must be installed:

```
npm install -g @angular/cli
``` 

# Technology stack

* Angular 8
* NPM as dependency manager
* Twitter Bootstrap 3.3.7
* tabulator-tables 4.9.1
* Font Awesome 5.15.2 