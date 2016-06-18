# mdi-spriter
> cli tool to create a sprite from [Google's material design icons](https://design.google.com/icons/)

*Note:* mdi-spriter depends on material-design-icons (which has lots of stuff) and svg-sprite (which has phantom-js as a dependency) so the install is quite large and may take more time that usually expected for a simple cli app

## Why?

You may have an app that only requires a few of the icons from [Google's Material icons ](https://design.google.com/icons/). But why download them manually and do all that palava? mdis was created to relieve you from the manual steps. You can now just setup a config.json file instead, and then include mdis in your build system so you can get the icons and color you want.

The downside, as noted above, is that mdis depends on some large libraries.

## run

run mdis from the command line as follows:

```
>mdis -c config.json -o sprite
```

*-c* points to a config.json (see example below) containing a list of mdi icons you want.

*-o* can be set either in the config.json or from cli and specifies the output directory for the complied mdi sprite

## npm run

You might also include it in your package.json build workflow  like that below, which builds on the tips given by [Keith Cirkel](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/):

```json
"scripts": {
    "build:dist": "parallelshell 'npm run build:js' 'npm run build:mdis' 'npm run build:styles' 'npm run build:css'",
    "build:mdis": "mdis -c MDISConfig.json",
    "build:styles": "stylus -u nib -u autoprefixer-stylus -w assets/index.styl -o example/index.css",
    "build:js": "browserify -t brfs dev/index.js >  dist/index.browser.js ",
    "build:css": "autoprefixer -b '> 5%' < dev/styles/main.css | cssmin | hashmark -l 8 'dist/main.#.css'"  
}
```

## config example

You can set the destination directory and the temp directory along with the material design icons  you want, and the color for each icon. Having multiple colors for the same icon hasn't yet been implemented.

```json
{
  "dest":"assets",
  "mdi": [
    {
      "icon": "menu",
      "size": "24px",
      "fill": "white"
    },
    {
      "icon": "alarm",
      "size": "24px",
      "fill": "blue"
    },
    {
      "icon": "assessment",
      "size": "24px",
      "fill": "#ADD8E6"
    }
  ]
}
```
