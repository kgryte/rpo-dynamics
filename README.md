RPo Dynamics
============

[RPo dynamics](http://www.ncbi.nlm.nih.gov/pubmed/23274143) data and analysis.


### Getting Started

To get started with RPo Dynamics, ensure that you have [Node.js](http://nodejs.org/) installed. If you have [Homebrew](http://brew.sh/) installed on Mac OSX, installing Node is [straightforward](http://shapeshed.com/setting-up-nodejs-and-npm-on-mac-osx/). In the terminal,

``` bash
$ brew install node
```

A recently released tool called [Cakebrew](http://www.cakebrew.com/) provides a GUI for installing packages, similar to the [Github client](https://mac.github.com/) for repositories. For other platforms, consult the documentation provided by [Joyent](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#ubuntu-mint). 

If you have a [Github](https://help.github.com/articles/set-up-git) account, clone the RPo Dynamics repository to a local directory of your choosing. 

``` bash
$ git clone https://github.com/kgryte/rpo-dynamics.git
```

If you are not a [Github member](https://github.com/pricing), a less desirable but still possible way to create a local copy is to download the zip file. 

Once cloned, navigate to the directory and install the Node modules specified in the `package.json` file. 

``` bash
$ npm install
```

Next, run the build script, which calculates metrics and statistics from the raw intensity data.

``` bash
$ npm run build
```

Note that the build process may take a minute or two.

Once the build has completed, launch the node application.

``` bash
$ npm start
```

The application should be listening on PORT 1337. If you have other applications using this port, you can change the port in `app/utils/server.js`.

To ensure that local repository is up-to-date, pull the remote repository, merging any changes.

``` bash
$ git pull origin master
```



### Routes

Application routes and their response:

```
http://127.0.0.1:1337
```

is the base application URL. The resource includes a table describing each condition. When a table row is clicked, the browser navigates to the corresponding condition's summary figure (see below).

```
http://127.0.0.1:1337/conditions
```

provides a mapping (as JSON) between encoded directory names and their decoded description. For example, encoded key `10001000` corresponds to condition `mutant rpo wt rt antibody none 20ms 0`.

```
http://127.0.0.1:1337/conditions/:id
```

returns a description of the condition set represented by `:id`. For example, id `10001000` returns `mutant rpo wt rt antibody none 20ms 0`.

```
http://127.0.0.1:1337/encoding
```

provides the model underlying encoding-decoding as a JSON object. Included in the model is a description of each model element.

```
http://127.0.0.1:1337/summary/:id
```

returns a summary figure for condition set `id`; e.g., `10011000`. Note that the selected timeseries which are displayed are randomly chosen on figure generation. Hence, each figure request (browser refresh) will display a different timeseries collection. The ability to fix which timeseries are displayed may be addressed in the future. For now, consider such randomness a feature, as each request is a random data sample. In which case, we can better state that a particular behavior's "representativeness" is reflected in how frequently the behavior appears in the figure. Obviously, the elephant in the room is how representative the sampled collection is of its parent's collection. We do not address the elephant here.

```
http://127.0.0.1:1337/summary/histogram/:id
```

returns a summary histogram for condition set `id`; e.g., `10011000`. This figure is included for completeness, as histograms are commonly used to view distributions. Histograms are not included elsewhere, however, as KDEs are preferrable. KDEs are dependant on a single parameter, the kernel bandwidth, rather than bin width and edge location as is the case for histograms.

```
http://127.0.0.1:1337/timeseries/:id
```

returns all timeseries for condition set `id`; e.g., `10011000`. The timeseries order matches the file order in the data directories.

```
http://127.0.0.1:1337/distributions/
```

returns a figure containing a [kernel density estimate](http://en.wikipedia.org/wiki/Kernel_density_estimation) (KDE) for each condition set. 

```
http://127.0.0.1:1337/distributions/:id
```

returns all distributions for condition set `id`; e.g., `10011000`. The average distribution across all datasets is superimposed on the individual distributions. The distribution order matches the file order in the data directories.

```
http://127.0.0.1:1337/distributions/:id/compare/:id
```

returns a figure comparing the distribution for one condition set, .e.g., `10110001`, with the distribution of another condition set, e.g., `00011000`. The figure includes a KDE and timeseries histogram for each condition set.

```
http://127.0.0.1:1337/distributions/:id/overlay/:id
```

returns a figure overlaying the distribution for one condition set, .e.g, `00011000`, on top of another condition set's distribution, e.g., `10011000`. The distributions are calculated as KDEs. 

```
http://127.0.0.1:1337/timeseries-histograms
```

returns a figure containing a timeseries histogram for each condition set. Each histogram is arranged in descending order according to the condition's mean value.

```
http://127.0.0.1:1337/matrix
```

returns a figure cross-comparing all condition distributions. The distributions are calculated as KDEs.

```
http://127.0.0.1:1337/submatrix/:filter
```

returns a figure cross-comparing all distributions for conditions matching the `:filter`, .e.g, `10******`. Numeric characters specify the permitted values. Wildcard characters `*` specify that any condition value is acceptable. In the example, `10` specifies to find all conditions which used the delta jaw mutant and which allowed RPo formation. Because the character specifying the DNA construct is a wildcard, all delta jaw mutant conditions match this criteria; similarly for the remaining conditions. If, for example, the filter was `10*****1`, then only those conditions which used the delta jaw mutant, allowed RPo formation, and were repeat 1 would be used to create the matrix figure.

```
http://127.0.0.1:1337/stack/:id
```

returns a figure comparing a condition set `id`, e.g., `10011000`, distribution to all other condition distributions. All distributions are calculated as KDEs.

```
http://127.0.0.1:1337/figure/2
```

returns manuscript Figure 2. The figure includes raw intensity timeseries, a corresponding FRET efficiency timeseries, and two KDEs for control conditions `00001000` and `00001100`.

```
http://127.0.0.1:1337/figure/3
```

returns manuscript Figure 3. The figure includes FRET efficiency timeseries for conditions `00001000`, `00101000`, and (...quFRET...).

```
http://127.0.0.1:1337/figure/4
```

returns manuscript Figure 4. The figure includes KDEs for conditions `00001000`, `00011000`, `00101000`, `00111000`. The first two conditions correspond to wild-type RNAP and DNA at 21C and 37C, respectively. The latter two conditions correspond to wild-type RNAP and pre-melted DNA at 21C and 37C, respectively.


### Virtual Host

If you would prefer to not use `http://127.0.0.1:1337/` as your local URL, the application is configured to support [virtual hosts](http://en.wikipedia.org/wiki/Virtual_hosting). In the terminal (on Mac OS X and Linux),

``` bash
$ sudo nano /etc/hosts
```

Add an entry at the bottom of the list.

```
127.0.0.1 	r.po
```

Hit `Ctrl+x` and `y`. Assuming you have started the node process (`npm start`), you can now access all figures using the following base URL:

```
http://r.po:8000/
```

For example,

```
http://r.po:8000/distributions
```

Note, however, that, if you wish to access the figures from another computer other than the one on which the server is running, neither `127.0.0.1` nor `r.po` will work from the other computer. You will need to determine your IP address. In the terminal,

``` bash
$ ifconfig
```

and search for the IP; e.g., `198.68.0.192`. In the example, another computer would access the figures at

```
http://198.68.0.192:1337/
```

One caveat to external access is your external IP address may be masked by a VPN or Firewall. In which case, for computer access outside your local area network, you will need to host the application on a public server.


### Images

To generate static images, ensure that you have [Phantomjs](http://phantomjs.org/) installed. If you use [Homebrew](http://brew.sh/),

``` bash
$ brew install phantomjs
```

Once installed, ensure that you have the Node server running and open a new terminal instance. From the top-level application directory,

``` bash
$ phantomjs scripts/rasterize.js http://127.0.0.1:1337/summary/10011000 public/img/1001100.summary.png 1200px*900px
```

which will render a webpage and return create a PNG. The image size is defined by the third argument. In this case, the webpage selection is 1200px by 900px. The PNG is output to the directory `public/img`.

You can specify a zoom factor. For example, 

``` bash
$ phantomjs scripts/rasterize.js http://127.0.0.1:1337/summary/10011000 public/img/1001100.summary.png 2400px*1800px 2
```

will generate an image which is twice the size of the previous image.


---

## Application

Application tasks, such as checking code quality and compiling resources, use the task runner [Gulp](http://gulpjs.com/).

### Code Quality

To check code quality and style using [JSHint](http://www.jshint.com/), enter

``` bash
$ gulp jshint
```


### Tests

...coming soon...


---

## License


![Creative Commons License](http://i.creativecommons.org/l/by/4.0/88x31.png)

The software in this repository is released under an [MIT license](http://opensource.org/licenses/MIT). 

All data and any figures derived from the data are released under a [Creative Commons Attribution 4.0 License](http://creativecommons.org/licenses/by/4.0/).

Should you use this body of work in any publication, please cite the following:

```
(publication)
```

(...include BibTeX...)


---

## Copyright


Copyright &copy; 2014. Athan Reines.


