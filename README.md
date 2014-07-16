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
