LinkedTV Demo
===================

## Prerequisites

In order to run the demo you need the Springfield toolkit.

## Server component

### Access Lou
Once you have it running somewhere locally access the Lou dashboard using this url 
http://\<springfield_ip\>:8080/lou/domain/linkedtv/html5application/dashboard.

###  Create a new application

* Make dir in \<springfield_dir\>/lou/apps/<app_name>
* Call this url http://\<springfield_ip\>:8080/bart/domain/internal/service/lou/apps/<app_name>/properties?method=put
* Call this url http://\<springfield_ip\>:8080/bart/domain/internal/service/lou/apps/<app_name>/properties/autodeploy?method=put&datatype=value&development/production

### Test

To check your tests simply run:

    $ ant test

If you are developing and cleaning is not needed every time you run a test, you can save some time if you run:

    $ ant dev

### Deploy locally

To deploy a new version of the application you need to create a new war and upload the file in Lou, that can be done just running:

    $ ant

The script assumes the Springfield toolkit is located in the parent directory _../sprinfield_.
 
### Deploy remotely
 
If you have a remote server running the toolkit you can deploy it using:

    $ ant provision-ssh

## Client component

### Install dependencies

Most probably you will have node.js and the package manager installed so just execute:

    $ npm install

### Developing and Running

To be able to develop the frontend (the actual AngularJS app) you need few things.
I'm assuming you have the springfield toolkit running with the application deployed.

Add a new entry to the file `/etc/hosts` that looks like:

    127.0.0.1 linkedtv.dev
    
#### Setup Nginx
    
The `client/nginx.conf.example` can be copied and then changed accordingly to match your local environment:

    $ cp nginx.conf.example nginx.conf
    $ sed -i "s/%ABSOLUTE_PATH_TO_CLIENT_DIR%/`pwd`/g" nginx.conf
    $ sed -i "s/%SPRINGFIELD_IP%/`curl ifconfig.me/ip`/g" nginx.conf
    
Include this new nginx.conf into your global config.

#### Setup Apache

The `client/apache.conf.example` can be copied and then changed accordingly to match your local environment:

    $ cp apache.conf.example apache.conf
    $ sed -i "s/%ABSOLUTE_PATH_TO_CLIENT_DIR%/`pwd`/g" apache.conf
    $ sed -i "s/%SPRINGFIELD_IP%/`curl ifconfig.me/ip`/g" apache.conf
    
Include this new apache.conf into your global config.

## Done

Now you can access the website [here](http://linkedtv.dev).
