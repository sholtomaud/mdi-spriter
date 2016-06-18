# mdi-spriter
> mdi cli tool to create mdi sprite from a config.json file specifying all the icons a user wants

*Note:* mdi-spriter depends on material-design-icons (which has lots of stuff) and svg-sprite (which has phantom-js as a dependency) so the install is quite large and may take more time that usually expected for a simple cli app

## run
run with the mdis command as follows:

```
>mdis -c config.json -o sprite
```

*-c* points to a config.json (see example below) containing a list of mdi icons you want.

*-o* can be set either in the config.json or from cli and specifies the output directory for the complied mdi sprite

## npm run

You might also include it in your package.json build workflow  like that below, which builds on the tips given by [Keith Cirkel](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/):

```json
"scripts": {
    "build:dist": "parallelshell 'npm run build:js' 'npm run build:styles' 'npm run build:mdis'",
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
