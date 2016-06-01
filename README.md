# mdi-spriter
> mdi cli tool to create mdi sprite from a config.json file specifying all the icons a user wants

*Note:* material-design-icons is a dependency so the install is quite large and may take more time that usually expected for a simple cli app

## run
run with the mdis command as follows:

```
>mdis -c config.json -o sprite
```

*-c* points to a config.json (see example below) containing a list of mdi icons you want.

*-o* can be set either in the config.json or from cli and specifies the output directory for the complied mdi sprite

## config example

You can set the destination directory and the temp directory along with the material design icons  you want

```
{
  "dest":"sprite",
  "temp":"temp"
  "mdi": [
    {
      "icon": "menu",
      "size": "24px"
    },
    {
      "icon": "menu",
      "size": "36px"
    },
    {
      "icon": "menu",
      "size": "48px"
    }
  ]
}

```
