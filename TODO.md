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
5. 	
6. 	
7. 	
8. 	User cluster to reduce request response time (?)...or move computation to workers
9. 	Makefile
	- Make calculating all metrics/statistics part of the build process?
10. Remove jQuery dependence and move to ui-component sortable --> more difficult than expected; only want sort on drop; not during drag.
11. 
12. 
13. 
14. Update code documentation



### Data

1. 	Upload quFRET data
2. 	Upload repeat data
3. 	Upload sigma mutant data
4. 	Speed up histogram, KDE calculation. Consider just calculating and storing these files in another directory. Have raw and analyzed data.
5. 	Calculate over all directories and files
6. 	Confirm that wt protein data is correct
7. 	Should AexDem values be included? (oh dear! would allow for corrections)


### Streams

1. 	Online histogram
	- Individual dataset
		- Init counts vector
		- Find bin for each datum
		- Update counts vector
		- On end, write file
	- All datasets
		- Use combined stream to create a single concat file
		- Stream concat file and calculate histogram as done for individual dataset
2. 	Online KDE
	- In the meantime, buffer an entire file and calculate in one go; save to file
3. 	Online MVA
4. 	Online timeseries-histogram
	- All datasets
		- Assemble individual histograms into single file
5. 	


### Timeseries

1. 	Select 3 'representative' timeseries showing 3 behaviors by sampling aspects of behavior distribution; e.g., fast versus slow transitions --> 1) calculate variance; 2) if, say, normally distributed, get the timeseries closest to the median in the left 16%, another closest to the median in the right 16%, and the timeseries closest to the median in the 68%. --> or basically, use MVA to extract timeseries


### Figures

1.  Multiple timeseries -->  dynamically resize based on parent size (wrap in container); ability to sort based on mean, variance --> sort in-browser using data attributes: data-mean, data-variance, etc. --> see isotope.js
2. 	Small-multiple timeseries-histogram across all conditions
3. 	Repeats comparision (multipanel, or avg hist with variance overlay)
4.  Scatterplot matrix-style figure but with KDE overlays
5. 	Hist2d timeseries across all conditions (is this actually valuable? really only when aligned.)
6. 	


### UI

1. 	Timeseries histogram to timeseries navigation --> requires client-side code
2. 	Cross-filter like functionality --> hover over timeseries hist histogram and highlights bar in histogram. Click to show the timeseries. --> this only works if the histogram is by molecule and not by time bin!!! Actually, that could be interesting. When hover over a histogram, that histogram is then shown in the marginal distribution over-top the all molecule histogram. Could be a way to see how much a molecule contributes, or more easily, how the distribution shape compares to the aggregate. --> Could compute individual histograms. Take the avg (or median) bin count for each bin. This is the 'typical' histogram. Use standard deviation per bin to indicate how much the histogram bin count varies. Compare this histogram to hovered histogram.
3. 	Navigation to different figures