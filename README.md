RPO Dynamics
============

[RPo dynamics](http://www.ncbi.nlm.nih.gov/pubmed/23274143) data and analysis.


### Getting Started

To get started with RPo Dynamics, ensure that you have [Node.js](http://nodejs.org/) installed. If you have [Homebrew](http://brew.sh/) installed on Mac OSX, installing Node is [straightforward](http://shapeshed.com/setting-up-nodejs-and-npm-on-mac-osx/). In the terminal,

```
brew install node
```

A recently released tool called [Cakebrew](http://www.cakebrew.com/) provides a GUI for installing packages, similar to the [Github client](https://mac.github.com/) for repositories. For other platforms, consult the documentation provided by [Joyent](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#ubuntu-mint). 

If you have a [Github](https://help.github.com/articles/set-up-git) account, clone the RPo Dynamics repository to a local directory of your choosing. 

```
git clone https://github.com/kgryte/rpo-dynamics.git
```

If you are not a [Github member](https://github.com/pricing), a less desirable but still possible way to create a local copy is to download the zip file. 

Once cloned, navigate to the directory and install Node modules specified in the `package.json` file. 

```
$ npm install
```

Next, launch the node application. Depending on your Node installation, the application is executable:

```
bin/server.js
```

If you receive a permissions error, update permissions as follows:

```
chmod +x bin/server.js
```

Otherwise, you can explicitly run the application as a Node process:

```
$ node bin/server.js
```

The application should be listening on PORT 1337. If you have other applications using this port, you can change the port in `app/utils/server.js`.



### Routes

Application routes and their response:

```
http://127.0.0.1:1337/conditions
```

provides a mapping between encoded directory names and their decoded description. For example, encoded key `10001000` corresponds to condition `mutant rpo wt rt antibody none 20ms 0`.

```
http://127.0.0.1:1337/conditions/:id
```

returns a description of the condition set represented by `:id`. For example, id `10001000` returns `mutant rpo wt rt antibody none 20ms 0`.

```
http://127.0.0.1:1337/encoding
```

provides the model underlying encoding-decoding. Included in the model is a description of each model element.

```
http://127.0.0.1:1337/figures/summary/:id
```

returns a summary figure for condition set `id`; e.g., `10011000`. Note that the selected timeseries which are displayed are randomly chosen on figure generation. Hence, each figure request (browser refresh) will display a different timeseries collection. The ability to fix which timeseries are displayed may be addressed in the future. For now, consider such randomness a feature, as each request is a random data sample. In which case, we can better state that a particular behavior's "representativeness" is reflected in how frequently the behavior appears in the figure. Obviously, the elephant in the room is how representative the sampled collection is of its parent's collection. We do not address the elephant here.

```
http://127.0.0.1:1337/figures/timeseries/:id
```

returns all timeseries for condition set `id`; e.g., `10011000`. The timeseries order matches the file order in the data directories.

```
http://127.0.0.1:1337/figures/distributions/
```

returns a figure containing a [kernel density estimate](http://en.wikipedia.org/wiki/Kernel_density_estimation) (KDE) for each condition set. 

```
http://127.0.0.1:1337/figures/distributions/10011000/compare/00011000
```

returns a figure comparing the distribution for one condition set, .e.g., `10110001`, with the distribution of another condition set, e.g., `00011000`. The figure includes a KDE and timeseries histogram for each condition set.



### Images

To generate static images, ensure that you have [Phantomjs](http://phantomjs.org/) installed. If you use [Homebrew](http://brew.sh/),

```
brew install phantomjs
```

Once installed, ensure that you have the Node server running and open a new terminal instance. From the top-level application directory,

```
phantomjs scripts/rasterize.js http://127.0.0.1:1337/figures/summary/10011000 public/img/1001100.summary.png 1200px*900px
```

which will render a webpage and return create a PNG. The image size is defined by the third argument. In this case, the webpage selection is 1200px by 900px. The PNG is output to the directory `public/img`.

You can specify a zoom factor. For example, 

```
phantomjs scripts/rasterize.js http://127.0.0.1:1337/figures/summary/10011000 public/img/1001100.summary.png 2400px*1800px 2
```

will generate an image which is twice the size of the previous image.


============
## Copyright


Copyright &copy; 2014. Athan Reines.


==========
## License


![Creative Commons License](http://i.creativecommons.org/l/by/4.0/88x31.png)

The software in this repository is released under an [MIT license](http://opensource.org/licenses/MIT). 

All data and any figures derived from the data are released under a [Creative Commons Attribution 4.0 License](http://creativecommons.org/licenses/by/4.0/).

Should you use this body of work in any publication, please cite the following:

```
(publication)
```

(...include BibTeX...)


