## Notice : Now is under developing... Coming soon.
<br/>

# For the first time
```

Please try the following for test:

  $ npm install appres -g


  $ appres init --pkey GXYqIgrafjTRatwTB96d --akey 39f031e6-94a0-4e14-b600-82779ec899d7

  $ appres icon --file sample.png
  or
  $ appres icon --file sample.png --open

If successful, You can find sample.png file in the your current working directory.

```

## And, Your project can be create at [appres.org](https://appres.org)
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
  0.0.47

```


## $ appres init
```

Direct input is available for each CLI command. However, the .appres.json file is much more convenient to use.

You can easily create an .appres.json file using the init command.

- Usage
  $ appres init [--pkey {PKEY}] [--akey {AKEY}] [--lang {LANG}] [--dir {DIR}] [--target {TARGET}] [--IgnoreVerCheck {version check option : true/false/null}]

- Example
  $ appres init
  $ appres init --pkey GXYqIgrafjTRatwTB96d
  $ appres init --akey 39f031e6-94a0-4e14-b600-82779ec899d7
  $ appres init --pkey GXYqIgrafjTRatwTB96d --akey 39f031e6-94a0-4e14-b600-82779ec899d7
  $ appres init --lang en-US
  $ appres init --dir app/src/main/res
  $ appres init --target android
  $ appres init --IgnoreVerCheck true

- Result
  Initialize .appres.json

- Hint
  You can get your PKEY and AKEY from the https://appres.org site.
  Not use arguments will use default or already setting value.
  If successful, You can find the .appres.json file in your working directory.

  You can use our test project and access keys.
    --pkey GXYqIgrafjTRatwTB96d
    --akey 39f031e6-94a0-4e14-b600-82779ec899d7

  The --dir option is a directory relative to the current working path.

  Target is currently valid for android and ios.
    --target ios
    --target android

  Use null or empty (not word 'empty') with name to remove entry from the .appres.json file.
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


## $ appres lang
```
You can retrieve the details of language in project.

- Usage
  $ appres lang --lang {lang code}

- Example Case 1
  $ appres lang --lang ko-KR

- Result Case 1
  {
    "lang": "한국어",
    "region_code": "KR",
    "lang_code": "ko",
    "region": "Korea"
  }

- Example Case 2
  $ appres lang --lang ja-JP

- Result Case 2
  {
    "lang": "日本語",
    "lang_code": "ja",
    "region": "Japan",
    "region_code": "JP"
  }

- Example Case 3
  $ appres lang --lang de-DE

- Result Case 3
  {
    "region_code": "DE",
    "lang": "Deutsch",
    "lang_code": "de",
    "region": "Germany"
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


========================================
### String by Key with Language Code ###
========================================

- Usage
  $ appres string --key {key of string} --lang {lang code}

- Example Case 1
  $ appres string --key appname --lang ko-KR

- Result Case 1
  "앱 리소스"

- Example Case 2
  $ appres string --key appname --lang ja-JP

- Result Case 2
  "アプリリソース"

- Example Case 3
  $ appres string --key appname --lang de-DE

- Result Case 3
  "App Ressource"



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


===================================================
### String by Default String with Language Code ###
===================================================

- Usage
  $ appres string --str {"default string"} --lang {lang code}

- Example Case 1
  $ appres string --str "This command is will cannot undo." --lang ko-KR

- Result Case 1
  "이 명령은 실행 취소 할 수 없습니다."

- Example Case 2
  $ appres string --str "This command is will cannot undo." --lang ja-JP

- Result Case 2
  "このコマンドは、元に戻すことができません。"

- Example Case 3
  $ appres string --str "This command is will cannot undo." --lang de-DE
  
- Result Case 3
  "Dieser Befehl kann nicht rückgängig gemacht werden."



============================================
### String : Save as local resource file ###
============================================

- Usage
  $ appres string --save [{save as filename}] [--dir {local directory}] [--type {format type}] [--target {target platform}] [--lang {lang code}]

- Options

  > If you skip {local filename}, the file name will be set to "string.{type}"

  > Skip --dir, the file is saved in the current working directory.

  > When you skip the --type, it is saved in json format. However, with --target, the type of target takes precedence.

  > --type can use the following values:

    json (default)
    plist
    xml
    ini
    dict
    
  > --target can use the following values:

    android
    ios

    If used --target ios, You can use the --type key.
  
    # android
      = The default local file name will be set "strings.xml"

      = Sub directory will be set to "values" for the default language
      = If do you have language code, sub directory will be set to "values-{LC}"
      = {LC} is two length language code. (ex) en-US = en, ko-KR = ko, ja-JP = ja

    # ios
      = The default local file name will be set "Localizable.strings"
      = With the --type plist, will be set "InfoPlist.strings"

      = Sub directory will be set to "base.lproj" for the default language
      = If do you have language code, sub directory will be set to "{LC}.lproj"
      = {LC} is two length language code. (ex) en-US = en, ko-KR = ko, ja-JP = ja

    
    ### Please let us know if you have any opinions on other target platforms. ###


  > The --lang is can be use find from your appres project language setting.

    Alternatively, you can check it with the following command.
    $ appres langs

    The --lang default is "default"


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
  $ appres icon --file {icon filename} [--save {save as filename}]

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
  $ appres icon --file sample.png [--size {size}] [--width {width}] [--height {height}] [--scale {scale}] [--padding {padding}]

- Example
  $ appres icon --file sample.png --size 120
  $ appres icon --file sample.png --size 120 --padding 5
  $ appres icon --file sample.png --width 120
  $ appres icon --file sample.png --height 120
  $ appres icon --file sample.png --width 120 --height 120
  $ appres icon --file sample.png --scale 2
  $ appres icon --file sample.png --width 120 --height 120 --scale 1.2

- Hint
  --size      : Set same size to icon width and height
  --padding   : Set to icon padding
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
  $ appres icon --file sample.png --{effect} [--effect value] ... [--effect]

- Effect Examples

  --crop
  $ appres icon --file sample.png --crop

  --rotate
  $ appres icon --file sample.png --rotate 90
    range : -360 ~ 360

  --mirror
  $ appres icon --file sample.png --mirror

  --flip
  $ appres icon --file sample.png --flip

  --grayscale
  $ appres icon --file sample.png --grayscale

  --sepia
  $ appres icon --file sample.png --sepia

  --contrast
  $ appres icon --file sample.png --contrast 0.2
    default value : 0.2 , range : -1.0 ~ 1.0

  --brightness
  $ appres icon --file sample.png --brightness 0.2
    default value : 0.2 , range : -1.0 ~ 1.0

  --blur
  $ appres icon --file sample.png --blur 5
    default value : 5 , range : 1 ~

  --gaussian
  $ appres icon --file sample.png --gaussian 1
    default value : 1 , range : 1 ~

  --opacity
  $ appres icon --file sample.png --opacity 0.5
    default value : 0.5 , range : 0.0 ~ 1.0

  --invert
  $ appres icon --file sample.png --invert


- Hint
  You can use multiple effects in combination.



====================================================
### icon : overlay (use for alpha channel image) ###
====================================================

- Usage
  $ appres icon --file sample.png --overlay {color}

- Example
  $ appres icon --file sample.png --overlay white
  $ appres icon --file sample.png --overlay 0xFF0000
  $ appres icon --file sample.png --overlay 0xFF0000FF
  $ appres icon --file sample.png --overlay "#F00"
  $ appres icon --file sample.png --overlay "#FF0000"
  $ appres icon --file sample.png --overlay "#F00F"
  $ appres icon --file sample.png --overlay "#FF0000FF"


- Hint
  This option is available for images that contain transparent channels.
  Converts non-transparent pixels in an image to the color value.
  No effect for non-transparent image.
  See the description of the color representation for color values.



=======================================================
### icon : background (use for alpha channel image) ###
=======================================================

- Usage
  $ appres icon --file sample.png --background {color}

- Example
  $ appres icon --file sample.png --background white
  $ appres icon --file sample.png --background 0xFF0000
  $ appres icon --file sample.png --background 0xFF0000FF
  $ appres icon --file sample.png --background "#F00"
  $ appres icon --file sample.png --background "#FF0000"
  $ appres icon --file sample.png --background "#F00F"
  $ appres icon --file sample.png --background "#FF0000FF"


- Hint
  This option is available for images that contain transparent channels.
  Converts transparent pixels in an image to the color value.
  No effect for non-transparent image.
  See the description of the color representation for color values.



=============================
### icon : save directory ###
=============================

- Usage
  $ appres icon --file sample.png --dir {save directory path}

- Example
  $ appres icon --file sample.png --dir icons
  $ appres icon --file sample.png --dir app/src/main/res
  $ appres icon --file sample.png --dir /Users/me/dev/app/resource

- Hint
  The directory with the dir option can be either absolute or relative.
  By default, the location of the saved file is the current working directory. The dir option allows you to specify where it is stored.



=================================
### icon : predefined target  ###
=================================

- Usage
  $ appres icon --file sample.png --target {target name} [--type {resource type}]

- Example
  $ appres icon --file sample.png --target android --dir app/src/main/res --type mipmap
  $ appres icon --file sample.png --target ios --dir app/assets/icons
  $ appres icon --file sample.png --target ios --type iconset
  $ appres icon --file sample.png --target macos --type iconset
  $ appres icon --file sample.png --target watchos --type iconset
  $ appres icon --file sample.png --target ios --type appiconset --save AppIcon.png
  $ appres icon --file sample.png --target macos --type appiconset --save AppIcon.png
  $ appres icon --file sample.png --target watchos --type appiconset --save AppIcon.png

- Hint
  If target is android, you can use it with type. type is something like mipmap or drawable.

  Some development platforms require several standard sized image resources.

  android
  ['', 'ldpi', 'mdpi', 'tvdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];

  ios
  ['', '@2x', '@3x'];


- Target
  
  android

  ios
  macos
  watchos

- Type for Assets

  for ios
    appiconset
    iconset
    imageset
    stickersiconset

  for macos
    appiconset
    iconset
    imageset
    sidebariconset
    iconbadgeset

  for watchos
    appiconset
    iconset
    imageset
    complicationset



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
  $ appres image --file {image filename} [--save {save as filename}]

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
  $ appres image --file sample.png [--save {save as filename}] [--size {size}] [--width {width}] [--height {height}] [--scale {scale}] [--padding {padding}]

- Example
  $ appres image --file sample.png --size 120
  $ appres image --file sample.png --size 120 --padding 5
  $ appres image --file sample.png --width 120
  $ appres image --file sample.png --height 120
  $ appres image --file sample.png --width 120 --height 120
  $ appres image --file sample.png --scale 2
  $ appres image --file sample.png --width 120 --height 120 --scale 1.2

- Hint
  --size      : Set same size to image width and height
  --padding   : Set to image padding
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
  $ appres image --file sample.png [--save {save as filename}] --{effect} [--effect value] ... [--effect]

- Effect Examples

  --crop
  $ appres image --file sample.png --crop

  --rotate
  $ appres image --file sample.png --rotate 90
    range : -360 ~ 360

  --mirror
  $ appres image --file sample.png --mirror

  --flip
  $ appres image --file sample.png --flip

  --grayscale
  $ appres image --file sample.png --grayscale

  --sepia
  $ appres image --file sample.png --sepia

  --contrast
  $ appres image --file sample.png --contrast 0.2
    default value : 0.2 , range : -1.0 ~ 1.0

  --brightness
  $ appres image --file sample.png --brightness 0.2
    default value : 0.2 , range : -1.0 ~ 1.0

  --blur
  $ appres image --file sample.png --blur 5
    default value : 5 , range : 1 ~

  --gaussian
  $ appres image --file sample.png --gaussian 1
    default value : 1 , range : 1 ~

  --opacity
  $ appres image --file sample.png --opacity 0.5
    default value : 0.5 , range : 0.0 ~ 1.0

  --invert
  $ appres image --file sample.png --invert


- Hint
  You can use multiple effects in combination.



=====================================================
### image : overlay (use for alpha channel image) ###
=====================================================

- Usage
  $ appres image --file sample.png [--save {save as filename}] --overlay {color}

- Example
  $ appres image --file sample.png --overlay white
  $ appres image --file sample.png --overlay 0xFF0000
  $ appres image --file sample.png --overlay 0xFF0000FF
  $ appres image --file sample.png --overlay "#F00"
  $ appres image --file sample.png --overlay "#FF0000"
  $ appres image --file sample.png --overlay "#F00F"
  $ appres image --file sample.png --overlay "#FF0000FF"


- Hint
  This option is available for images that contain transparent channels.
  Converts non-transparent pixels in an image to the color value.
  No effect for non-transparent image.
  See the description of the color representation for color values.



========================================================
### image : background (use for alpha channel image) ###
========================================================

- Usage
  $ appres image --file sample.png [--save {save as filename}] --background {color}

- Example
  $ appres image --file sample.png --background white
  $ appres image --file sample.png --background 0xFF0000
  $ appres image --file sample.png --background 0xFF0000FF
  $ appres image --file sample.png --background "#F00"
  $ appres image --file sample.png --background "#FF0000"
  $ appres image --file sample.png --background "#F00F"
  $ appres image --file sample.png --background "#FF0000FF"


- Hint
  This option is available for images that contain transparent channels.
  Converts transparent pixels in an image to the color value.
  No effect for non-transparent image.
  See the description of the color representation for color values.



==============================
### image : save directory ###
==============================

- Usage
  $ appres image --file sample.png [--save {save as filename}] --dir {save directory path}

- Example
  $ appres image --file sample.png --dir images
  $ appres image --file sample.png --dir app/src/main/res
  $ appres image --file sample.png --dir /Users/me/dev/app/resource

- Hint
  The directory with the dir option can be either absolute or relative.
  By default, the location of the saved file is the current working directory. The dir option allows you to specify where it is stored.



==================================
### image : predefined target  ###
==================================

- Usage
  $ appres image --file sample.png --target {target name} [--type {resource type}] [--save {save as filename}]

- Example
  $ appres image --file sample.png --target android --dir app/src/main/res --type mipmap
  $ appres image --file sample.png --target ios --dir app/assets/images
  $ appres icon --file sample.png --target ios --type imageset
  $ appres icon --file sample.png --target macos --type imageset
  $ appres icon --file sample.png --target watchos --type imageset
  $ appres image --file sample.png --target ios --type appiconset --save AppIcon.png
  $ appres image --file sample.png --target macos --type appiconset --save AppIcon.png
  $ appres image --file sample.png --target watchos --type appiconset --save AppIcon.png

- Hint
  If target is android, you can use it with type. type is something like mipmap or drawable.

  Some development platforms require several standard sized image resources.

  android
  ['', 'ldpi', 'mdpi', 'tvdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];

  ios
  ['', '@2x', '@3x'];


- Target
  
  android

  ios
  macos
  watchos

- Type for Assets

  for ios
    appiconset
    iconset
    imageset
    stickersiconset

  for macos
    appiconset
    iconset
    imageset
    sidebariconset
    iconbadgeset

  for watchos
    appiconset
    iconset
    imageset
    complicationset




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
```

```

## To be continue...
