TODO
====


### General

1. 	Move directory mapping from main routes to utils
2. 	Polish multiple condition request and data formatting


### Timeseries

1. 	Select 3 'representative' timeseries showing 3 behaviors by sampling aspects of behavior distribution; e.g., fast versus slow transitions --> 1) calculate variance; 2) if, say, normally distributed, get the timeseries closest to the median in the left 16%, another closest to the median in the right 16%, and the timeseries closest to the median in the 68%. --> or basically, use MVA to extract timeseries


### Figures

1.  Multiple timeseries -->  dynamically resize based on parent size (wrap in container); sortable; ability to sort based on mean, variance --> sort in-browser using data attributes: data-mean, data-variance, etc.
2. 	Small-multiple timeseries-histogram across all conditions
3. 	Selection cross-condition comparison
4.  Small-multiple histograms across all conditions
5. 	Hist2d timeseries across all conditions (is this actually valuable? really only when aligned.)
6. 	


### UI

1. 	Timeseries histogram to timeseries navigation --> requires client-side code
2. 	Cross-filter like functionality --> hover over timeseries hist histogram and highlights bar in histogram. Click to show the timeseries. --> this only works if the histogram is by molecule and not by time bin!!! Actually, that could be interesting. When hover over a histogram, that histogram is then shown in the marginal distribution over-top the all molecule histogram. Could be a way to see how much a molecule contributes, or more easily, how the distribution shape compares to the aggregate. --> Could compute individual histograms. Take the avg (or median) bin count for each bin. This is the 'typical' histogram. Use standard deviation per bin to indicate how much the histogram bin count varies. Compare this histogram to hovered histogram.
3. 	Navigation to different figures