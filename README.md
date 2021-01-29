## Notice : Now is under developing... Coming soon.
<br/>


# For the first time
```

Please try the following for test:

  $ npm install appres -g


  $ appres init --pkey GXYqIgrafjTRatwTB96d --akey 39f031e6-94a0-4e14-b600-82779ec899d7

  $ appres icon --file sample.png --save
  or
  $ appres icon --file sample.png --open

If successful, You can find sample.png file in the your current working directory.

```

## And, Your project key can be create for free at [appres.org](https://appres.org)
<br><br><br>


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
  0.0.43

```


## $ appres init
```

Direct input is available for each CLI command. However, the appres.json file is much more convenient to use.

You can easily create an appres.json file using the init command.

- Usage
  $ appres init [--pkey {PKEY}] [--akey {AKEY}] [--lang {LANG}] [--dir {DIR}] [--target {TARGET}]

- Example
  $ appres init
  $ appres init --pkey GXYqIgrafjTRatwTB96d
  $ appres init --akey 39f031e6-94a0-4e14-b600-82779ec899d7
  $ appres init --pkey GXYqIgrafjTRatwTB96d --akey 39f031e6-94a0-4e14-b600-82779ec899d7
  $ appres init --lang en-US
  $ appres init --dir app/src/main/res
  $ appres init --target android

- Result
  Initialize appres.json

- Hint
  You can get your PKEY and AKEY from the https://appres.org site.
  Not use arguments will use default or already setting value.
  If successful, You can find the appres.json file in your working directory.

  You can use our test project and access keys.
    --pkey GXYqIgrafjTRatwTB96d
    --akey 39f031e6-94a0-4e14-b600-82779ec899d7

  The --dir option is a directory relative to the current working path.

  Target is currently valid for android and ios.
    --target ios
    --target android

  Use null or empty (not word 'empty') with name to remove entry from theappres.json file.
    --target null
    --target
    --dir null
    --dir

```

## $ appres langs
```
You can retrieve the project language settings.

- Usage
  $ appres langs

- Result
  {
    "de-DE": "Deutsch (Germany)",
    "en-US": "Englist (United States)",
    "fr-FR": "Français (France)",
    "ja-JP": "日本語 (Japan)",
    "zh-CN": "简体中文 - Simplified (China)",
    "zh-TW": "繁體中文 - Traditional (Taiwan)",
    "ko-KR": "한국어 (Korea)"
  }

```


## $ appres string
```
=====================
### String by Key ###
=====================

- Usage
  $ appres string --key {key of string}

- Example
  $ appres string --key appname

- Result
  {
    "default": "App Resource",
    "zh-CN": "应用资源",
    "en-US": "App Resource",
    "zh-TW": "应用资源",
    "de-DE": "App Ressource",
    "fr-FR": "App Ressource",
    "ja-JP": "アプリリソース",
    "ko-KR": "앱 리소스"
  }


================================
### String by Default String ###
================================

- Usage
  $ appres string --str {"default string"}

- Example
  $ appres string --str "This command is will cannot undo."

- Result
  {
    "default": "This command is will cannot undo.",
    "fr-FR": "Cette commande ne peut pas être annulée.",
    "de-DE": "Dieser Befehl kann nicht rückgängig gemacht werden.",
    "ja-JP": "このコマンドは、元に戻すことができません。",
    "en-US": "This command is will cannot undo.",
    "zh-TW": "此命令将无法撤消。",
    "ko-KR": "이 명령은 실행 취소 할 수 없습니다.",
    "zh-CN": "此命令将无法撤消。"
  }

```

## $ appres dict
```
=========================
### Dictionary by Key ###
=========================

- Usage
  $ appres dict --key {key of dict}

- Example
  $ appres dict --key appres

- Result
  {
    "zh-CN": "应用程序资源平台",
    "en-US": "The App Resource Platform",
    "de-DE": "Die App Resource Platform",
    "ja-JP": "アプリリソースプラットフォーム",
    "zh-TW": "应用程序资源平台",
    "fr-FR": "La plateforme de ressources d'application",
    "default": "The App Resource Platform",
    "ko-KR": "앱 리소스 플랫폼"
  }

====================================
### Dictionary by Default String ###
====================================

- Usage
  $ appres dict --str {"default string"}

- Example
  $ appres dict --str "The App Resource Platform"

- Result
  {
    "default": "The App Resource Platform",
    "ja-JP": "アプリリソースプラットフォーム",
    "zh-CN": "应用程序资源平台",
    "en-US": "The App Resource Platform",
    "fr-FR": "La plateforme de ressources d'application",
    "zh-TW": "应用程序资源平台",
    "de-DE": "Die App Resource Platform",
    "ko-KR": "앱 리소스 플랫폼"
  }


```

## $ appres icon
```
You can get an icon from a project on appres.org.


=================================
### icon : save to local file ###
=================================

- Usage
  $ appres icon --file {icon filename}

- Example
  $ appres icon --file sample.png

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
You can get an image from a project on appres.org.


==================================
### image : save to local file ###
==================================

- Usage
  $ appres image --file {image filename}

- Example
  $ appres image --file sample.png

- Result
  Save : sample.png

- Hint
  If successful, You can find sample.png in your working directory.


===============================================
### image : save to local another file name ###
===============================================

- Usage
  $ appres image --file {image filename} --save {save filename}

- Example
  $ appres image --file sample.png --save another.png

- Result
  Save : another.png

- Hint
  If successful, You can find another.png in your working directory.


======================
### image : resize ###
======================

- Usage
  $ appres image --file sample.png --save [--size {size}] [--width {width}] [--height {height}] [--scale {scale}]

- Example
  $ appres image --file sample.png --save --size 120
  $ appres image --file sample.png --save --width 120
  $ appres image --file sample.png --save --height 120
  $ appres image --file sample.png --save --width 120 --height 120
  $ appres image --file sample.png --save --scale 2
  $ appres image --file sample.png --save --width 120 --height 120 --scale 1.2

- Hint
  --size      : Set same size to image width and height
  --width     : Set to image width
  --height    : Set to image height
  --scale     : Set to image scale

  If do not use size options, The image size will be original dimension.
  If use only width, The image height will be same ratio as width.
  If use only height, The image width will be same ratio as height.
  If use width and height, The image size will your fix.
  If use width and height, The image size will be your fixed values.
  If use scale, The image size is a multiple of the scale.



=============================
### image : image effects ###
=============================

- Usage
  $ appres image --file sample.png --save --{effect} [--effect value] ... [--effect]

- Effect Examples

  --crop
  $ appres image --file sample.png --save --crop

  --rotate
  $ appres image --file sample.png --save --rotate 90
    range : -360 ~ 360

  --mirror
  $ appres image --file sample.png --save --mirror

  --flip
  $ appres image --file sample.png --save --flip

  --grayscale
  $ appres image --file sample.png --save --grayscale

  --sepia
  $ appres image --file sample.png --save --sepia

  --contrast
  $ appres image --file sample.png --save --contrast 0.2
    default value : 0.2 , range : -1.0 ~ 1.0

  --brightness
  $ appres image --file sample.png --save --brightness 0.2
    default value : 0.2 , range : -1.0 ~ 1.0

  --blur
  $ appres image --file sample.png --save --blur 5
    default value : 5 , range : 1 ~

  --gaussian
  $ appres image --file sample.png --save --gaussian 1
    default value : 1 , range : 1 ~

  --opacity
  $ appres image --file sample.png --save --opacity 0.5
    default value : 0.5 , range : 0.0 ~ 1.0

  --invert
  $ appres image --file sample.png --save --invert


- Hint
  You can use multiple effects in combination.



=====================================================
### image : overlay (use for alpha channel image) ###
=====================================================

- Usage
  $ appres image --file sample.png --save --overlay {color}

- Example
  $ appres image --file sample.png --save --overlay white
  $ appres image --file sample.png --save --overlay 0xFF0000
  $ appres image --file sample.png --save --overlay 0xFF0000FF
  $ appres image --file sample.png --save --overlay "#F00"
  $ appres image --file sample.png --save --overlay "#FF0000"
  $ appres image --file sample.png --save --overlay "#F00F"
  $ appres image --file sample.png --save --overlay "#FF0000FF"


- Hint
  This option is available for images that contain transparent channels.
  Converts non-transparent pixels in an image to the color value.
  No effect for non-transparent image.
  See the description of the color representation for color values.



========================================================
### image : background (use for alpha channel image) ###
========================================================

- Usage
  $ appres image --file sample.png --save --background {color}

- Example
  $ appres image --file sample.png --save --background white
  $ appres image --file sample.png --save --background 0xFF0000
  $ appres image --file sample.png --save --background 0xFF0000FF
  $ appres image --file sample.png --save --background "#F00"
  $ appres image --file sample.png --save --background "#FF0000"
  $ appres image --file sample.png --save --background "#F00F"
  $ appres image --file sample.png --save --background "#FF0000FF"


- Hint
  This option is available for images that contain transparent channels.
  Converts transparent pixels in an image to the color value.
  No effect for non-transparent image.
  See the description of the color representation for color values.



==============================
### image : save directory ###
==============================

- Usage
  $ appres image --file sample.png --save --dir {save directory path}

- Example
  $ appres image --file sample.png --save --dir images
  $ appres image --file sample.png --save --dir app/src/main/res
  $ appres image --file sample.png --save --dir /Users/me/dev/app/resource

- Hint
  The directory with the dir option can be either absolute or relative.
  By default, the location of the saved file is the current working directory. The dir option allows you to specify where it is stored.



==================================
### image : predefined target  ###
==================================

- Usage
  $ appres image --file sample.png --save --target {target name} [--type {resource type}]

- Example
  $ appres image --file sample.png --save --target android --dir app/src/main/res --type mipmap
  $ appres image --file sample.png --save --target ios --dir app/assets/images

- Hint
  If target is android, you can use it with type. type is something like mipmap or drawable.

  Some development platforms require several standard sized image resources.

  android
  ['', 'ldpi', 'mdpi', 'tvdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];

  ios
  ['', '@2x', '@3x'];



=====================================
### image : open after local save ###
=====================================

- Usage
  $ appres image --file sample.png --open [{app name}]

- Example
  $ appres image --file sample.png --open
  $ appres image --file sample.png --open 'google chrome'


```

# Usage for node_modules
# To be continue...
