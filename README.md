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
0.0.24

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
$ appres icon --file sample.png

- Result:
<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 01 00 00 00 01 00 08 06 00 00 00 5c 72 a8 66 00 00 00 01 73 52 47 42 00 ae ce 1c e9 00 00 00 a6 ... >



=================================
### icon : save to local file ###
=================================

$ appres icon --file {icon filename} -save

Example :
$ appres icon --file sample.png -save

- Result
Save : sample.png

If successful, You can find sample.png in your working directory.


==============================================
### icon : save to local another file name ###
==============================================

$ appres icon --file {icon filename} --save {save filename}

Example :
$ appres icon --file sample.png --save another.png

- Result
Save : top_menu.png

If successful, You can find another.png in your working directory.


=====================
### icon : resize ###
=====================

$ appres icon --file sample.png --save --size 120
$ appres icon --file sample.png --save --width 120
$ appres icon --file sample.png --save --height 120
$ appres icon --file sample.png --save --width 120 --height 120
$ appres icon --file sample.png --save --scale 2
$ appres icon --file sample.png --save --width 120 --height 120 --scale 1.2

Options :
  --size      : Set same size to icon width and height
  --width     : Set to icon width
  --height    : Set to icon height
  --scale     : Set to icon scale

If do not use size options, The icon size will be original dimension.
If use only width, The icon height will be same ratio as width.
If use only height, The icon width will be same ratio as height.
If use width and height, The icon size will your fix.
If use width and height, The icon size will be your fixed values.
If use scale, The icon size is a multiple of the scale.


============================
### icon : image effects ###
============================

- Crop
$ appres icon --file sample.png --save --crop

- Flip
$ appres icon --file sample.png --save --flip

- Mirror
$ appres icon --file sample.png --save --mirror

- Grayscale
$ appres icon --file sample.png --save --grayscale

- Sepia
$ appres icon --file sample.png --save --sepia

- Contrast
$ appres icon --file sample.png --save --contrast [value]
  default value : 0.2 , range : -1.0 ~ 1.0

- Brightness
$ appres icon --file sample.png --save --brightness [value]
  default value : 0.2 , range : -1.0 ~ 1.0

- Invert
$ appres icon --file sample.png --save --invert

- Blur
$ appres icon --file sample.png --save --blur [value]
  default value : 5 , range : 1 ~

- Gaussian
$ appres icon --file sample.png --save --gaussian [value]
  default value : 1 , range : 1 ~

- Opacity
$ appres icon --file sample.png --save --opacity [value]
  default value : 0.5 , range : 0.0 ~ 1.0

- Rotate
$ appres icon --file sample.png --save --rotate value
  range : -360 ~ 360


Hint: You can use multiple effects in combination.



=============================
### icon : save directory ###
=============================



```

## $ appres image
```
```

# Usage for node_modules
# To be continue...
