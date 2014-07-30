TKK Demo
===================

## Prerequisites

In order to run the demo you need the Springfield toolkit.

## Start

### Access Lou
Once you have it running somewhere locally access the Lou dashboard using this url 
http://\<springfield_ip\>:8080/lou/domain/linkedtv/html5application/dashboard and you can login with `admin:FTHmc8e4`.

###  Create a new application

* Make dir in \<springfield_dir\>/lou/apps/<app_name>
* Go to this url http://\<springfield_ip\>:8080/bart/domain/internal/service/lou/apps/<app_name>/properties?method=put
* Go to this url http://\<springfield_ip\>:8080/bart/domain/internal/service/lou/apps/<app_name>/properties/autodeploy?method=put&datatype=value&development/production

## Deploy

To deploy a new version of the application you need to create a new war and upload the file in Lou, that can be done just running:

    $ ant

The script assumes the Springfield toolkit is located in the parent directory _../sprinfield_. 

## Test

To check your tests simply run:

    $ ant test

If you are developing and cleaning is not needed every time you run a test, you can save some time if you run:

    $ ant dev

## Developing

To be able to develop the frontend (the actual AngularJS app) you need few things.
I'm assuming you have the springfield toolkit running with the application deployed.

Add a new entry to the file `/etc/hosts` that looks like:

    127.0.0.1 tkk.dev
    
I prefer using nginx to serve the static files so I've included an `nginx.conf.example` in the project that can be used 
to setup an nginx site. If you like apache you can contribute to the project and create another example :)

    $ cp nginx.conf.example nginx.conf
    $ sed -i "s/%ABSOLUTE_PATH_TO_CLIENT_DIR%/`pwd`/g" nginx.conf
    
Include the new nginx.conf to your nginx global config.
     
### Install client dependencies

Most probably you will have node.js and the package manager installed so just execute:

    $ npm install


Now you can access the website [here](http://tkk.dev).
