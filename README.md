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
  0.0.28

```

## $ appres init
```

Direct input is available for each CLI command. However, the appres.json file is much more convenient to use.

You can easily create an appres.json file using the init command.

- Usage
  $ appres init [--pkey {PKEY}] [--akey {AKEY}]

- Example
  $ appres init
  $ appres init --pkey ry7EdO2TLLVr9JkSqqe2
  $ appres init --akey 8b938bec-42ad-4dcf-848f-713dea09fbb7
  $ appres init --pkey ry7EdO2TLLVr9JkSqqe2 --akey 8b938bec-42ad-4dcf-848f-713dea09fbb7

- Result
  Initialize appres.json

- Hint
  You can get your PKEY and AKEY from the https://appres.org site.
  Not use arguments will use default or already setting value.
  If successful, You can find the appres.json file in your working directory.

  You can use our test project and access keys.
    --pkey ry7EdO2TLLVr9JkSqqe2
    --akey 8b938bec-42ad-4dcf-848f-713dea09fbb7

  And, Sample icon file.
    --file sample.png


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

- Usage
  $ appres icon --file {icon filename}

- Example
  $ appres icon --file sample.png

- Result
  <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 01 00 00 00 01 00 08 06 00 00 00 5c 72 a8 66 00 00 00 01 73 52 47 42 00 ae ce 1c e9 00 00 00 a6 ... >



=================================
### icon : save to local file ###
=================================

- Usage
  $ appres icon --file {icon filename} --save

- Example
  $ appres icon --file sample.png --save

- Result
  Save : sample.png

- Hint
  If successful, You can find sample.png in your working directory.


==============================================
### icon : save to local another file name ###
==============================================

- Usage
  $ appres icon --file {icon filename} --save {save filename}

- Example
  $ appres icon --file sample.png --save another.png

- Result
  Save : another.png

- Hint
  If successful, You can find another.png in your working directory.


=====================
### icon : resize ###
=====================

- Usage
  $ appres icon --file sample.png --save [--size {size}] [--width {width}] [--height {height}] [--scale {scale}]

- Example
  $ appres icon --file sample.png --save --size 120
  $ appres icon --file sample.png --save --width 120
  $ appres icon --file sample.png --save --height 120
  $ appres icon --file sample.png --save --width 120 --height 120
  $ appres icon --file sample.png --save --scale 2
  $ appres icon --file sample.png --save --width 120 --height 120 --scale 1.2

- Hint
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

- Usage
  $ appres icon --file sample.png --save --{effect} [--effect value] ... [--effect]

- Effect Examples

  --crop
  $ appres icon --file sample.png --save --crop

  --rotate
  $ appres icon --file sample.png --save --rotate 90
    range : -360 ~ 360

  --mirror
  $ appres icon --file sample.png --save --mirror

  --flip
  $ appres icon --file sample.png --save --flip

  --grayscale
  $ appres icon --file sample.png --save --grayscale

  --sepia
  $ appres icon --file sample.png --save --sepia

  --contrast
  $ appres icon --file sample.png --save --contrast 0.2
    default value : 0.2 , range : -1.0 ~ 1.0

  --brightness
  $ appres icon --file sample.png --save --brightness 0.2
    default value : 0.2 , range : -1.0 ~ 1.0

  --blur
  $ appres icon --file sample.png --save --blur 5
    default value : 5 , range : 1 ~

  --gaussian
  $ appres icon --file sample.png --save --gaussian 1
    default value : 1 , range : 1 ~

  --opacity
  $ appres icon --file sample.png --save --opacity 0.5
    default value : 0.5 , range : 0.0 ~ 1.0

  --invert
  $ appres icon --file sample.png --save --invert


- Hint
  You can use multiple effects in combination.



====================================================
### icon : overlay (use for alpha channel image) ###
====================================================

- Usage
  $ appres icon --file sample.png --save --overlay {color}

- Example
  $ appres icon --file sample.png --save --overlay white
  $ appres icon --file sample.png --save --overlay 0xFF0000
  $ appres icon --file sample.png --save --overlay 0xFF0000FF
  $ appres icon --file sample.png --save --overlay "#F00"
  $ appres icon --file sample.png --save --overlay "#FF0000"
  $ appres icon --file sample.png --save --overlay "#F00F"
  $ appres icon --file sample.png --save --overlay "#FF0000FF"


- Hint
  This option is available for images that contain transparent channels.
  Converts non-transparent pixels in an image to the color value.
  No effect for non-transparent image.
  See the description of the color representation for color values.



=======================================================
### icon : background (use for alpha channel image) ###
=======================================================

- Usage
  $ appres icon --file sample.png --save --background {color}

- Example
  $ appres icon --file sample.png --save --background white
  $ appres icon --file sample.png --save --background 0xFF0000
  $ appres icon --file sample.png --save --background 0xFF0000FF
  $ appres icon --file sample.png --save --background "#F00"
  $ appres icon --file sample.png --save --background "#FF0000"
  $ appres icon --file sample.png --save --background "#F00F"
  $ appres icon --file sample.png --save --background "#FF0000FF"


- Hint
  This option is available for images that contain transparent channels.
  Converts transparent pixels in an image to the color value.
  No effect for non-transparent image.
  See the description of the color representation for color values.



=============================
### icon : save directory ###
=============================

- Usage
  $ appres icon --file sample.png --save --dir {save directory path}

- Example
  $ appres icon --file sample.png --save --dir icons
  $ appres icon --file sample.png --save --dir app/src/main/res
  $ appres icon --file sample.png --save --dir /Users/me/dev/app/resource

- Hint
  The directory with the dir option can be either absolute or relative.
  By default, the location of the saved file is the current working directory. The dir option allows you to specify where it is stored.



=================================
### icon : predefined target  ###
=================================

- Usage
  $ appres icon --file sample.png --save --target {target name} [--type {resource type}]

- Example
  $ appres icon --file sample.png --save --target android --dir app/src/main/res --type mipmap
  $ appres icon --file sample.png --save --target ios --dir app/assets/icons

- Hint
  If target is android, you can use it with type. type is something like mipmap or drawable.

  Some development platforms require several standard sized image resources.

  android
  ['', 'ldpi', 'mdpi', 'tvdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];

  ios
  ['', '@2x', '@3x'];



====================================
### icon : open after local save ###
====================================

- Usage
  $ appres icon --file sample.png --open [{app name}]

- Example
  $ appres icon --file sample.png --open
  $ appres icon --file sample.png --open 'google chrome'



```

## $ appres image
```
```

# Usage for node_modules
# To be continue...
