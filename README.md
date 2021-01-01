# Now is under developing. Coming soon... Thank you.
<br/>

# Install

## Install for CLI
```
$ npm install appres -g

```
## Install for node_modules
```
$ npm install appres -save
```
<br/>

# Usage for CLI

## $ appres version
```
$ appres version

You can show version of appres package.

Example :
$ appres version
0.0.23

```

## $ appres init
```

Direct input is available for each CLI command. However, the appres.json file is much more convenient to use.

You can easily create an appres.json file using the init command.

$ appres init [--pkey {PKEY}] [--akey {AKEY}] [--host {HOST}]

PKEY and AKEY is required. You can get your PKEY and AKEY from the https://appres.org site.

HOST is not for required. If you own the appres server, use the server address. Otherwise, Do not enter to use the default value.

- Result :
    Initialize appres.json

Example 1 :
$ appres init

Example 2 :
$ appres init --pkey ry7EdO2TLLVr9JkSqqe2

Example 3 :
$ appres init --akey 8b938bec-42ad-4dcf-848f-713dea09fbb7

Example 4 :
$ appres init --pkey ry7EdO2TLLVr9JkSqqe2 --akey 8b938bec-42ad-4dcf-848f-713dea09fbb7


Hint : Not use arguments will use default or already setting value.

If successful, You can find the appres.json file in your working directory.

```

## $ appres string
```
```

## $ appres dict
```
```

## $ appres icon
```
You can get an icon from a project on appres.org.

================
### Get Icon ###
================

$ appres icon --file {icon filename}

Example :
$ appres icon --file top_menu_dark.png

- Result:
<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 01 00 00 00 01 00 08 06 00 00 00 5c 72 a8 66 00 00 00 01 73 52 47 42 00 ae ce 1c e9 00 00 00 a6 ... >



===============================
### Icon save to local file ###
===============================

$ appres icon --file {icon filename} -save

Example :
$ appres icon --file top_menu_dark.png -save

- Result
Save : top_menu_dark.png

If successful, You can find top_menu_dark.png in your working directory.


============================================
### Icon save to local another file name ###
============================================

$ appres icon --file {icon filename} --save {save filename}

Example :
$ appres icon --file top_menu_dark.png --save dark_top_menu.png

- Result
Save : dark_top_menu.png

If successful, You can find dark_top_menu.png in your working directory.






```

## $ appres image
```
```

# Usage for node_modules
# To be continue...
