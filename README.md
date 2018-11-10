## CO Dimension Calculator

*A web app to quickly and easily convert to and between brick coordination dimensions.*

This repository contains the source code for the web app. The app itself can be found at:

[https://dim.studiole.uk/](https://dim.studiole.uk/)

If you're looking for the accompanying Dynamo Script for Revit you'll find it in the [Dynamo Scripts repository](https://github.com/StudioLE/DynamoScripts).

### Using the App

*Calculate the number of bricks* - by changing the dimension

*Calculate the dimension* - by changing the number of bricks

*Change to the nearest valid dimensions* - by clicking the next or previous arrows.

*Change between `CO-`, `CO+`, and `CO`* - by clicking on the selector.

*Add another calculator to the page* - by pressing the `+` button.

*Preload the calculator with values* - by adding parameters to the URL, for example: [https://dim.studiole.uk/#!/1125/720](https://dim.studiole.uk/#!/1125/720)

*Specify the CO mode for preloaded values* - by prefixing the parameter with `-`, `+`, or `=` for `CO-`, `CO+`, and `CO` respectively.

### Planned Features

A roadmap of planned features is available on the projects [Wiki](https://github.com/StudioLE/CODimensionCalculator/wiki) but if there's something else you think the app would benefit from then feel free to [create an issue](https://github.com/StudioLE/CODimensionCalculator/issues/new).


## Contributing

I'm always on the look out for collaborators so feel free to get in touch, suggest new features, or just fork the repository.

### CLI Commands

Compile all assets to the `build` directory with gulp
```
gulp build
```

Launch an http-server of the `src` directory at `http://localhost:1337`
```
npm start
```

Build and launch an http-server of the `build` directory at `http://localhost:1337`
```
npm build
```

Run end-to-end tests on `http://localhost:1337` with TestCafe
```
npm test
```
