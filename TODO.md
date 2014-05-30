TODO
====


### General

1. 	MVA
2. 	Use Casper.js to capture just the figure element
3. 	Clean-up KDE code (i.e., deal with rug plot)
4. 	Update app boilerplate
	- Move server.js to bin directory / make executable
	- Update utils/server.js
	- read over to see if all up-to-date
	- Remove dynamic route name
	- package.json
5. 	Add quantile calculation to figure.io/vector.io
6. 	Metrics: specify value precision (ensure 0.229999 --> 0.2300, not 0.2299)
7. 	Valid JSON task --> data files
8. 	User cluster to reduce request response time (?)...or move computation to workers
9. 	Makefile
	- Make calculating all metrics/statistics part of the build process?
10. Remove jQuery dependence and move to ui-component sortable --> more difficult than expected; only want sort on drop; not during drag.
11. Add prefix argument to getData module to target a particular file(s). Similar to ids. Allow ['*'], or [1,2,3,8,9]. Accordingly, three prefixes in filter.
12. 
13. 
14. Update code documentation; e.g., document manifests (top-of-file)



### Data

1. 	Upload quFRET data
2. 	Upload repeat data
3. 	Upload sigma mutant data
4. 	DFT KDE
5. 	
6. 	Confirm that wt protein data is correct
7. 	Should AexDem values be included? (oh dear! would allow for corrections)
8. 	Analyze jaw data


### Streams

1. 	Specify value precision
2. 	Online KDE
3. 	Online MVA (summary)
4. 	
5. 	
6.  Test: windowed mean and streaming mean
7. 	Online windowed mean (overlap parameter)
8.  Online windowed variance (overlap parameter)
9. 	Online histogram update
	- Init stream with counts array
	- Init stream with ordered index array
		- If no init, then create null vector; if null, do not decrement counts bins, but only accumulate; once index array is full, start decrementing
		- Need to specify how many indices to keep on hand at any one time; if < specify, then only increment. Once reach limit, start dec/inc
	- With each new index,
		- shift index array and push new index
		- decrement/increment counts array bins
10. 


### Timeseries

1. 	Select 3 'representative' timeseries showing 3 behaviors by sampling aspects of behavior distribution; e.g., fast versus slow transitions --> 1) calculate variance; 2) if, say, normally distributed, get the timeseries closest to the median in the left 16%, another closest to the median in the right 16%, and the timeseries closest to the median in the 68%. --> or basically, use MVA to extract timeseries


### Figures

1.  Multiple timeseries -->  dynamically resize based on parent size (wrap in container); ability to sort based on mean, variance --> sort in-browser using data attributes: data-mean, data-variance, etc. --> see isotope.js
2. 	Small-multiple timeseries-histogram across all conditions
3. 	Repeats comparision (multipanel, or avg hist with variance overlay)
4.  Scatterplot matrix-style figure but with KDE overlays
5. 	Hist2d timeseries across all conditions (is this actually valuable? really only when aligned.)
6. 	Schematic (break into individual components)
7. 	Box-and-whisker plots via descriptive stats files. --> can create a timeseries-histogram like figure, either horizontally or vertically oriented; preference at this point is E on Y-Axis and molecules on X-Axis, in contrast to timeseries-histogram.


### UI

1. 	Timeseries histogram to timeseries navigation --> requires client-side code
2. 	Cross-filter like functionality --> hover over timeseries hist histogram and highlights bar in histogram. Click to show the timeseries. --> this only works if the histogram is by molecule and not by time bin!!! Actually, that could be interesting. When hover over a histogram, that histogram is then shown in the marginal distribution over-top the all molecule histogram. Could be a way to see how much a molecule contributes, or more easily, how the distribution shape compares to the aggregate. --> Could compute individual histograms. Take the avg (or median) bin count for each bin. This is the 'typical' histogram. Use standard deviation per bin to indicate how much the histogram bin count varies. Compare this histogram to hovered histogram.
3. 	Navigation to different figures