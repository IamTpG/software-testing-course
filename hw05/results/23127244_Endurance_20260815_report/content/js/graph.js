/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 0.0, "minX": 0.0, "maxY": 821.0, "series": [{"data": [[0.0, 0.0], [0.1, 2.0], [0.2, 2.0], [0.3, 2.0], [0.4, 2.0], [0.5, 2.0], [0.6, 2.0], [0.7, 3.0], [0.8, 3.0], [0.9, 3.0], [1.0, 3.0], [1.1, 3.0], [1.2, 3.0], [1.3, 3.0], [1.4, 3.0], [1.5, 3.0], [1.6, 3.0], [1.7, 3.0], [1.8, 3.0], [1.9, 3.0], [2.0, 3.0], [2.1, 3.0], [2.2, 3.0], [2.3, 3.0], [2.4, 3.0], [2.5, 3.0], [2.6, 3.0], [2.7, 3.0], [2.8, 3.0], [2.9, 3.0], [3.0, 3.0], [3.1, 3.0], [3.2, 3.0], [3.3, 3.0], [3.4, 3.0], [3.5, 3.0], [3.6, 3.0], [3.7, 3.0], [3.8, 3.0], [3.9, 3.0], [4.0, 3.0], [4.1, 3.0], [4.2, 3.0], [4.3, 3.0], [4.4, 3.0], [4.5, 3.0], [4.6, 3.0], [4.7, 3.0], [4.8, 3.0], [4.9, 3.0], [5.0, 3.0], [5.1, 3.0], [5.2, 3.0], [5.3, 3.0], [5.4, 3.0], [5.5, 3.0], [5.6, 3.0], [5.7, 3.0], [5.8, 3.0], [5.9, 3.0], [6.0, 3.0], [6.1, 3.0], [6.2, 3.0], [6.3, 3.0], [6.4, 3.0], [6.5, 3.0], [6.6, 3.0], [6.7, 3.0], [6.8, 3.0], [6.9, 3.0], [7.0, 3.0], [7.1, 3.0], [7.2, 3.0], [7.3, 3.0], [7.4, 3.0], [7.5, 3.0], [7.6, 3.0], [7.7, 3.0], [7.8, 3.0], [7.9, 3.0], [8.0, 3.0], [8.1, 3.0], [8.2, 3.0], [8.3, 3.0], [8.4, 3.0], [8.5, 3.0], [8.6, 3.0], [8.7, 3.0], [8.8, 3.0], [8.9, 3.0], [9.0, 3.0], [9.1, 3.0], [9.2, 3.0], [9.3, 3.0], [9.4, 3.0], [9.5, 3.0], [9.6, 3.0], [9.7, 3.0], [9.8, 3.0], [9.9, 3.0], [10.0, 3.0], [10.1, 3.0], [10.2, 3.0], [10.3, 3.0], [10.4, 3.0], [10.5, 3.0], [10.6, 3.0], [10.7, 3.0], [10.8, 3.0], [10.9, 3.0], [11.0, 3.0], [11.1, 3.0], [11.2, 3.0], [11.3, 3.0], [11.4, 3.0], [11.5, 3.0], [11.6, 3.0], [11.7, 3.0], [11.8, 3.0], [11.9, 3.0], [12.0, 3.0], [12.1, 3.0], [12.2, 3.0], [12.3, 3.0], [12.4, 3.0], [12.5, 3.0], [12.6, 3.0], [12.7, 3.0], [12.8, 3.0], [12.9, 3.0], [13.0, 3.0], [13.1, 3.0], [13.2, 3.0], [13.3, 3.0], [13.4, 3.0], [13.5, 3.0], [13.6, 3.0], [13.7, 3.0], [13.8, 3.0], [13.9, 3.0], [14.0, 3.0], [14.1, 3.0], [14.2, 3.0], [14.3, 3.0], [14.4, 3.0], [14.5, 3.0], [14.6, 3.0], [14.7, 3.0], [14.8, 3.0], [14.9, 3.0], [15.0, 3.0], [15.1, 3.0], [15.2, 3.0], [15.3, 3.0], [15.4, 3.0], [15.5, 3.0], [15.6, 3.0], [15.7, 3.0], [15.8, 3.0], [15.9, 3.0], [16.0, 3.0], [16.1, 3.0], [16.2, 3.0], [16.3, 3.0], [16.4, 3.0], [16.5, 3.0], [16.6, 3.0], [16.7, 3.0], [16.8, 4.0], [16.9, 4.0], [17.0, 4.0], [17.1, 4.0], [17.2, 4.0], [17.3, 4.0], [17.4, 4.0], [17.5, 4.0], [17.6, 4.0], [17.7, 4.0], [17.8, 4.0], [17.9, 4.0], [18.0, 4.0], [18.1, 4.0], [18.2, 4.0], [18.3, 4.0], [18.4, 4.0], [18.5, 4.0], [18.6, 4.0], [18.7, 4.0], [18.8, 4.0], [18.9, 4.0], [19.0, 4.0], [19.1, 4.0], [19.2, 4.0], [19.3, 4.0], [19.4, 4.0], [19.5, 4.0], [19.6, 4.0], [19.7, 4.0], [19.8, 4.0], [19.9, 4.0], [20.0, 4.0], [20.1, 4.0], [20.2, 4.0], [20.3, 4.0], [20.4, 4.0], [20.5, 4.0], [20.6, 4.0], [20.7, 4.0], [20.8, 4.0], [20.9, 4.0], [21.0, 4.0], [21.1, 4.0], [21.2, 4.0], [21.3, 4.0], [21.4, 4.0], [21.5, 4.0], [21.6, 4.0], [21.7, 4.0], [21.8, 4.0], [21.9, 4.0], [22.0, 4.0], [22.1, 4.0], [22.2, 4.0], [22.3, 4.0], [22.4, 4.0], [22.5, 4.0], [22.6, 4.0], [22.7, 4.0], [22.8, 4.0], [22.9, 4.0], [23.0, 4.0], [23.1, 4.0], [23.2, 4.0], [23.3, 4.0], [23.4, 4.0], [23.5, 4.0], [23.6, 4.0], [23.7, 4.0], [23.8, 4.0], [23.9, 4.0], [24.0, 4.0], [24.1, 4.0], [24.2, 4.0], [24.3, 4.0], [24.4, 4.0], [24.5, 4.0], [24.6, 4.0], [24.7, 4.0], [24.8, 4.0], [24.9, 4.0], [25.0, 4.0], [25.1, 4.0], [25.2, 4.0], [25.3, 4.0], [25.4, 4.0], [25.5, 4.0], [25.6, 4.0], [25.7, 4.0], [25.8, 4.0], [25.9, 4.0], [26.0, 4.0], [26.1, 4.0], [26.2, 4.0], [26.3, 4.0], [26.4, 4.0], [26.5, 4.0], [26.6, 4.0], [26.7, 4.0], [26.8, 4.0], [26.9, 4.0], [27.0, 4.0], [27.1, 4.0], [27.2, 4.0], [27.3, 4.0], [27.4, 4.0], [27.5, 4.0], [27.6, 4.0], [27.7, 4.0], [27.8, 4.0], [27.9, 4.0], [28.0, 4.0], [28.1, 4.0], [28.2, 4.0], [28.3, 5.0], [28.4, 5.0], [28.5, 5.0], [28.6, 5.0], [28.7, 5.0], [28.8, 5.0], [28.9, 5.0], [29.0, 5.0], [29.1, 5.0], [29.2, 5.0], [29.3, 5.0], [29.4, 5.0], [29.5, 5.0], [29.6, 5.0], [29.7, 5.0], [29.8, 5.0], [29.9, 5.0], [30.0, 5.0], [30.1, 5.0], [30.2, 5.0], [30.3, 5.0], [30.4, 5.0], [30.5, 5.0], [30.6, 5.0], [30.7, 5.0], [30.8, 5.0], [30.9, 5.0], [31.0, 5.0], [31.1, 5.0], [31.2, 5.0], [31.3, 5.0], [31.4, 5.0], [31.5, 5.0], [31.6, 5.0], [31.7, 5.0], [31.8, 5.0], [31.9, 5.0], [32.0, 5.0], [32.1, 5.0], [32.2, 5.0], [32.3, 5.0], [32.4, 5.0], [32.5, 5.0], [32.6, 5.0], [32.7, 5.0], [32.8, 5.0], [32.9, 5.0], [33.0, 5.0], [33.1, 5.0], [33.2, 5.0], [33.3, 5.0], [33.4, 5.0], [33.5, 5.0], [33.6, 5.0], [33.7, 5.0], [33.8, 5.0], [33.9, 5.0], [34.0, 5.0], [34.1, 5.0], [34.2, 5.0], [34.3, 5.0], [34.4, 5.0], [34.5, 5.0], [34.6, 5.0], [34.7, 5.0], [34.8, 5.0], [34.9, 5.0], [35.0, 5.0], [35.1, 5.0], [35.2, 5.0], [35.3, 5.0], [35.4, 5.0], [35.5, 5.0], [35.6, 5.0], [35.7, 5.0], [35.8, 5.0], [35.9, 5.0], [36.0, 5.0], [36.1, 5.0], [36.2, 5.0], [36.3, 5.0], [36.4, 6.0], [36.5, 6.0], [36.6, 6.0], [36.7, 6.0], [36.8, 6.0], [36.9, 6.0], [37.0, 6.0], [37.1, 6.0], [37.2, 6.0], [37.3, 6.0], [37.4, 6.0], [37.5, 6.0], [37.6, 6.0], [37.7, 6.0], [37.8, 6.0], [37.9, 6.0], [38.0, 6.0], [38.1, 6.0], [38.2, 6.0], [38.3, 6.0], [38.4, 6.0], [38.5, 6.0], [38.6, 6.0], [38.7, 6.0], [38.8, 6.0], [38.9, 6.0], [39.0, 6.0], [39.1, 6.0], [39.2, 6.0], [39.3, 6.0], [39.4, 6.0], [39.5, 6.0], [39.6, 6.0], [39.7, 6.0], [39.8, 6.0], [39.9, 6.0], [40.0, 6.0], [40.1, 6.0], [40.2, 6.0], [40.3, 6.0], [40.4, 6.0], [40.5, 6.0], [40.6, 6.0], [40.7, 6.0], [40.8, 6.0], [40.9, 6.0], [41.0, 6.0], [41.1, 6.0], [41.2, 6.0], [41.3, 6.0], [41.4, 6.0], [41.5, 6.0], [41.6, 6.0], [41.7, 6.0], [41.8, 6.0], [41.9, 6.0], [42.0, 6.0], [42.1, 6.0], [42.2, 6.0], [42.3, 6.0], [42.4, 6.0], [42.5, 6.0], [42.6, 6.0], [42.7, 6.0], [42.8, 6.0], [42.9, 6.0], [43.0, 6.0], [43.1, 6.0], [43.2, 6.0], [43.3, 6.0], [43.4, 6.0], [43.5, 6.0], [43.6, 6.0], [43.7, 6.0], [43.8, 6.0], [43.9, 6.0], [44.0, 7.0], [44.1, 7.0], [44.2, 7.0], [44.3, 7.0], [44.4, 7.0], [44.5, 7.0], [44.6, 7.0], [44.7, 7.0], [44.8, 7.0], [44.9, 7.0], [45.0, 7.0], [45.1, 7.0], [45.2, 7.0], [45.3, 7.0], [45.4, 7.0], [45.5, 7.0], [45.6, 7.0], [45.7, 7.0], [45.8, 7.0], [45.9, 7.0], [46.0, 7.0], [46.1, 7.0], [46.2, 7.0], [46.3, 7.0], [46.4, 7.0], [46.5, 7.0], [46.6, 7.0], [46.7, 7.0], [46.8, 7.0], [46.9, 7.0], [47.0, 7.0], [47.1, 7.0], [47.2, 7.0], [47.3, 7.0], [47.4, 7.0], [47.5, 7.0], [47.6, 7.0], [47.7, 7.0], [47.8, 7.0], [47.9, 7.0], [48.0, 7.0], [48.1, 7.0], [48.2, 7.0], [48.3, 7.0], [48.4, 7.0], [48.5, 7.0], [48.6, 7.0], [48.7, 7.0], [48.8, 7.0], [48.9, 7.0], [49.0, 7.0], [49.1, 7.0], [49.2, 7.0], [49.3, 7.0], [49.4, 7.0], [49.5, 7.0], [49.6, 7.0], [49.7, 7.0], [49.8, 7.0], [49.9, 8.0], [50.0, 8.0], [50.1, 8.0], [50.2, 8.0], [50.3, 8.0], [50.4, 8.0], [50.5, 8.0], [50.6, 8.0], [50.7, 8.0], [50.8, 8.0], [50.9, 8.0], [51.0, 8.0], [51.1, 8.0], [51.2, 8.0], [51.3, 8.0], [51.4, 8.0], [51.5, 8.0], [51.6, 8.0], [51.7, 8.0], [51.8, 8.0], [51.9, 8.0], [52.0, 8.0], [52.1, 8.0], [52.2, 8.0], [52.3, 8.0], [52.4, 8.0], [52.5, 8.0], [52.6, 8.0], [52.7, 8.0], [52.8, 8.0], [52.9, 8.0], [53.0, 8.0], [53.1, 8.0], [53.2, 8.0], [53.3, 8.0], [53.4, 8.0], [53.5, 8.0], [53.6, 8.0], [53.7, 8.0], [53.8, 8.0], [53.9, 8.0], [54.0, 8.0], [54.1, 8.0], [54.2, 8.0], [54.3, 8.0], [54.4, 8.0], [54.5, 8.0], [54.6, 8.0], [54.7, 8.0], [54.8, 8.0], [54.9, 8.0], [55.0, 8.0], [55.1, 8.0], [55.2, 8.0], [55.3, 8.0], [55.4, 8.0], [55.5, 8.0], [55.6, 9.0], [55.7, 9.0], [55.8, 9.0], [55.9, 9.0], [56.0, 9.0], [56.1, 9.0], [56.2, 9.0], [56.3, 9.0], [56.4, 9.0], [56.5, 9.0], [56.6, 9.0], [56.7, 9.0], [56.8, 9.0], [56.9, 9.0], [57.0, 9.0], [57.1, 9.0], [57.2, 9.0], [57.3, 9.0], [57.4, 9.0], [57.5, 9.0], [57.6, 9.0], [57.7, 9.0], [57.8, 9.0], [57.9, 9.0], [58.0, 9.0], [58.1, 9.0], [58.2, 9.0], [58.3, 9.0], [58.4, 9.0], [58.5, 9.0], [58.6, 9.0], [58.7, 9.0], [58.8, 9.0], [58.9, 9.0], [59.0, 9.0], [59.1, 9.0], [59.2, 9.0], [59.3, 9.0], [59.4, 9.0], [59.5, 9.0], [59.6, 9.0], [59.7, 9.0], [59.8, 9.0], [59.9, 9.0], [60.0, 9.0], [60.1, 9.0], [60.2, 9.0], [60.3, 10.0], [60.4, 10.0], [60.5, 10.0], [60.6, 10.0], [60.7, 10.0], [60.8, 10.0], [60.9, 10.0], [61.0, 10.0], [61.1, 10.0], [61.2, 10.0], [61.3, 10.0], [61.4, 10.0], [61.5, 10.0], [61.6, 10.0], [61.7, 10.0], [61.8, 10.0], [61.9, 10.0], [62.0, 10.0], [62.1, 10.0], [62.2, 10.0], [62.3, 10.0], [62.4, 10.0], [62.5, 10.0], [62.6, 10.0], [62.7, 10.0], [62.8, 10.0], [62.9, 10.0], [63.0, 10.0], [63.1, 10.0], [63.2, 10.0], [63.3, 10.0], [63.4, 10.0], [63.5, 10.0], [63.6, 10.0], [63.7, 10.0], [63.8, 10.0], [63.9, 10.0], [64.0, 10.0], [64.1, 10.0], [64.2, 10.0], [64.3, 10.0], [64.4, 10.0], [64.5, 11.0], [64.6, 11.0], [64.7, 11.0], [64.8, 11.0], [64.9, 11.0], [65.0, 11.0], [65.1, 11.0], [65.2, 11.0], [65.3, 11.0], [65.4, 11.0], [65.5, 11.0], [65.6, 11.0], [65.7, 11.0], [65.8, 11.0], [65.9, 11.0], [66.0, 11.0], [66.1, 11.0], [66.2, 11.0], [66.3, 11.0], [66.4, 11.0], [66.5, 11.0], [66.6, 11.0], [66.7, 11.0], [66.8, 11.0], [66.9, 11.0], [67.0, 11.0], [67.1, 11.0], [67.2, 11.0], [67.3, 11.0], [67.4, 11.0], [67.5, 11.0], [67.6, 11.0], [67.7, 11.0], [67.8, 11.0], [67.9, 12.0], [68.0, 12.0], [68.1, 12.0], [68.2, 12.0], [68.3, 12.0], [68.4, 12.0], [68.5, 12.0], [68.6, 12.0], [68.7, 12.0], [68.8, 12.0], [68.9, 12.0], [69.0, 12.0], [69.1, 12.0], [69.2, 12.0], [69.3, 12.0], [69.4, 12.0], [69.5, 12.0], [69.6, 12.0], [69.7, 12.0], [69.8, 12.0], [69.9, 12.0], [70.0, 12.0], [70.1, 12.0], [70.2, 12.0], [70.3, 12.0], [70.4, 12.0], [70.5, 12.0], [70.6, 12.0], [70.7, 12.0], [70.8, 13.0], [70.9, 13.0], [71.0, 13.0], [71.1, 13.0], [71.2, 13.0], [71.3, 13.0], [71.4, 13.0], [71.5, 13.0], [71.6, 13.0], [71.7, 13.0], [71.8, 13.0], [71.9, 13.0], [72.0, 13.0], [72.1, 13.0], [72.2, 13.0], [72.3, 13.0], [72.4, 13.0], [72.5, 13.0], [72.6, 13.0], [72.7, 13.0], [72.8, 13.0], [72.9, 13.0], [73.0, 13.0], [73.1, 13.0], [73.2, 13.0], [73.3, 13.0], [73.4, 14.0], [73.5, 14.0], [73.6, 14.0], [73.7, 14.0], [73.8, 14.0], [73.9, 14.0], [74.0, 14.0], [74.1, 14.0], [74.2, 14.0], [74.3, 14.0], [74.4, 14.0], [74.5, 14.0], [74.6, 14.0], [74.7, 14.0], [74.8, 14.0], [74.9, 14.0], [75.0, 14.0], [75.1, 14.0], [75.2, 14.0], [75.3, 14.0], [75.4, 15.0], [75.5, 15.0], [75.6, 15.0], [75.7, 15.0], [75.8, 15.0], [75.9, 15.0], [76.0, 15.0], [76.1, 15.0], [76.2, 15.0], [76.3, 15.0], [76.4, 15.0], [76.5, 15.0], [76.6, 15.0], [76.7, 15.0], [76.8, 15.0], [76.9, 15.0], [77.0, 15.0], [77.1, 15.0], [77.2, 16.0], [77.3, 16.0], [77.4, 16.0], [77.5, 16.0], [77.6, 16.0], [77.7, 16.0], [77.8, 16.0], [77.9, 16.0], [78.0, 16.0], [78.1, 16.0], [78.2, 16.0], [78.3, 16.0], [78.4, 16.0], [78.5, 16.0], [78.6, 16.0], [78.7, 17.0], [78.8, 17.0], [78.9, 17.0], [79.0, 17.0], [79.1, 17.0], [79.2, 17.0], [79.3, 17.0], [79.4, 17.0], [79.5, 17.0], [79.6, 17.0], [79.7, 17.0], [79.8, 17.0], [79.9, 17.0], [80.0, 17.0], [80.1, 18.0], [80.2, 18.0], [80.3, 18.0], [80.4, 18.0], [80.5, 18.0], [80.6, 18.0], [80.7, 18.0], [80.8, 18.0], [80.9, 18.0], [81.0, 18.0], [81.1, 18.0], [81.2, 19.0], [81.3, 19.0], [81.4, 19.0], [81.5, 19.0], [81.6, 19.0], [81.7, 19.0], [81.8, 19.0], [81.9, 19.0], [82.0, 19.0], [82.1, 19.0], [82.2, 20.0], [82.3, 20.0], [82.4, 20.0], [82.5, 20.0], [82.6, 20.0], [82.7, 20.0], [82.8, 20.0], [82.9, 20.0], [83.0, 20.0], [83.1, 21.0], [83.2, 21.0], [83.3, 21.0], [83.4, 21.0], [83.5, 21.0], [83.6, 21.0], [83.7, 21.0], [83.8, 22.0], [83.9, 22.0], [84.0, 22.0], [84.1, 22.0], [84.2, 22.0], [84.3, 22.0], [84.4, 22.0], [84.5, 23.0], [84.6, 23.0], [84.7, 23.0], [84.8, 23.0], [84.9, 23.0], [85.0, 24.0], [85.1, 24.0], [85.2, 24.0], [85.3, 24.0], [85.4, 24.0], [85.5, 25.0], [85.6, 25.0], [85.7, 25.0], [85.8, 25.0], [85.9, 26.0], [86.0, 26.0], [86.1, 26.0], [86.2, 26.0], [86.3, 27.0], [86.4, 27.0], [86.5, 27.0], [86.6, 28.0], [86.7, 28.0], [86.8, 28.0], [86.9, 29.0], [87.0, 29.0], [87.1, 29.0], [87.2, 30.0], [87.3, 30.0], [87.4, 31.0], [87.5, 31.0], [87.6, 32.0], [87.7, 32.0], [87.8, 33.0], [87.9, 33.0], [88.0, 34.0], [88.1, 34.0], [88.2, 35.0], [88.3, 36.0], [88.4, 36.0], [88.5, 37.0], [88.6, 38.0], [88.7, 39.0], [88.8, 39.0], [88.9, 40.0], [89.0, 41.0], [89.1, 42.0], [89.2, 43.0], [89.3, 44.0], [89.4, 45.0], [89.5, 46.0], [89.6, 47.0], [89.7, 48.0], [89.8, 49.0], [89.9, 50.0], [90.0, 51.0], [90.1, 52.0], [90.2, 53.0], [90.3, 54.0], [90.4, 55.0], [90.5, 56.0], [90.6, 57.0], [90.7, 58.0], [90.8, 59.0], [90.9, 60.0], [91.0, 61.0], [91.1, 63.0], [91.2, 63.0], [91.3, 64.0], [91.4, 66.0], [91.5, 67.0], [91.6, 68.0], [91.7, 69.0], [91.8, 70.0], [91.9, 71.0], [92.0, 72.0], [92.1, 73.0], [92.2, 74.0], [92.3, 75.0], [92.4, 76.0], [92.5, 78.0], [92.6, 79.0], [92.7, 80.0], [92.8, 81.0], [92.9, 82.0], [93.0, 83.0], [93.1, 85.0], [93.2, 86.0], [93.3, 87.0], [93.4, 88.0], [93.5, 89.0], [93.6, 90.0], [93.7, 91.0], [93.8, 92.0], [93.9, 94.0], [94.0, 95.0], [94.1, 96.0], [94.2, 97.0], [94.3, 98.0], [94.4, 99.0], [94.5, 101.0], [94.6, 102.0], [94.7, 103.0], [94.8, 104.0], [94.9, 106.0], [95.0, 107.0], [95.1, 108.0], [95.2, 109.0], [95.3, 110.0], [95.4, 112.0], [95.5, 113.0], [95.6, 114.0], [95.7, 115.0], [95.8, 117.0], [95.9, 118.0], [96.0, 120.0], [96.1, 121.0], [96.2, 123.0], [96.3, 124.0], [96.4, 126.0], [96.5, 128.0], [96.6, 129.0], [96.7, 131.0], [96.8, 133.0], [96.9, 134.0], [97.0, 136.0], [97.1, 138.0], [97.2, 139.0], [97.3, 141.0], [97.4, 143.0], [97.5, 145.0], [97.6, 147.0], [97.7, 149.0], [97.8, 151.0], [97.9, 153.0], [98.0, 155.0], [98.1, 158.0], [98.2, 161.0], [98.3, 163.0], [98.4, 165.0], [98.5, 168.0], [98.6, 171.0], [98.7, 174.0], [98.8, 178.0], [98.9, 181.0], [99.0, 186.0], [99.1, 190.0], [99.2, 196.0], [99.3, 203.0], [99.4, 211.0], [99.5, 220.0], [99.6, 232.0], [99.7, 250.0], [99.8, 385.0], [99.9, 545.0], [100.0, 821.0]], "isOverall": false, "label": "POST /api/forgot-password", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 6.0, "minX": 0.0, "maxY": 198017.0, "series": [{"data": [[0.0, 198017.0], [300.0, 43.0], [600.0, 131.0], [700.0, 24.0], [100.0, 10168.0], [200.0, 1109.0], [400.0, 151.0], [800.0, 6.0], [500.0, 99.0]], "isOverall": false, "label": "POST /api/forgot-password", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 800.0, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 258.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 209490.0, "series": [{"data": [[0.0, 209490.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 258.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 1.0, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 137.8669433875242, "minX": 1.7868063E12, "maxY": 150.0, "series": [{"data": [[1.78680678E12, 150.0], [1.78680672E12, 150.0], [1.78680642E12, 150.0], [1.78680684E12, 150.0], [1.78680654E12, 150.0], [1.78680648E12, 150.0], [1.7868066E12, 150.0], [1.7868063E12, 137.8669433875242], [1.7868069E12, 150.0], [1.78680636E12, 150.0], [1.78680702E12, 148.8314785373606], [1.78680696E12, 150.0], [1.78680666E12, 150.0]], "isOverall": false, "label": "Endurance - 150 VU sustained 12min", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78680702E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 4.0, "minX": 1.0, "maxY": 20.73669440774563, "series": [{"data": [[2.0, 4.0], [3.0, 10.0], [4.0, 6.0], [5.0, 7.0], [6.0, 4.0], [7.0, 5.0], [8.0, 18.6], [9.0, 4.0], [10.0, 9.75], [11.0, 6.0], [12.0, 8.0], [13.0, 6.75], [14.0, 8.0], [15.0, 8.666666666666666], [16.0, 7.0], [17.0, 10.75], [18.0, 11.666666666666668], [19.0, 5.8], [20.0, 13.0], [21.0, 8.666666666666666], [22.0, 7.0], [23.0, 9.333333333333334], [24.0, 7.0], [25.0, 10.285714285714285], [26.0, 13.0], [27.0, 10.333333333333334], [28.0, 7.666666666666667], [29.0, 7.777777777777778], [30.0, 5.0], [31.0, 7.428571428571429], [32.0, 9.833333333333332], [33.0, 6.285714285714286], [34.0, 6.571428571428572], [35.0, 6.428571428571429], [36.0, 4.428571428571429], [37.0, 6.166666666666666], [38.0, 6.916666666666667], [39.0, 6.333333333333333], [40.0, 5.625], [41.0, 6.8], [42.0, 7.25], [43.0, 8.454545454545455], [44.0, 6.9], [45.0, 10.0], [46.0, 7.615384615384615], [47.0, 7.0], [48.0, 9.09090909090909], [49.0, 6.5], [50.0, 9.090909090909092], [51.0, 5.6], [52.0, 5.636363636363636], [53.0, 7.428571428571428], [54.0, 7.0], [55.0, 6.666666666666666], [56.0, 7.8125], [57.0, 8.5], [58.0, 7.428571428571429], [59.0, 6.428571428571429], [60.0, 5.888888888888889], [61.0, 8.5], [62.0, 6.857142857142858], [63.0, 8.5], [64.0, 7.555555555555555], [65.0, 7.647058823529413], [66.0, 5.5], [67.0, 7.0], [68.0, 15.583333333333334], [69.0, 8.666666666666666], [70.0, 8.615384615384615], [71.0, 8.923076923076923], [72.0, 9.307692307692307], [73.0, 5.85], [74.0, 8.692307692307692], [75.0, 8.25], [76.0, 7.949999999999999], [77.0, 11.153846153846153], [78.0, 5.846153846153848], [79.0, 8.199999999999998], [80.0, 7.666666666666667], [81.0, 5.833333333333332], [82.0, 4.388888888888889], [83.0, 7.684210526315789], [84.0, 6.6499999999999995], [85.0, 6.157894736842105], [86.0, 6.0], [87.0, 6.5], [88.0, 9.565217391304351], [89.0, 5.083333333333333], [90.0, 6.909090909090908], [91.0, 7.363636363636363], [92.0, 6.555555555555556], [93.0, 9.19047619047619], [94.0, 19.05882352941176], [95.0, 8.208333333333334], [96.0, 6.6875], [97.0, 6.833333333333333], [98.0, 11.4], [99.0, 6.5], [100.0, 4.904761904761904], [101.0, 6.3], [102.0, 6.12], [103.0, 8.760000000000002], [104.0, 6.095238095238093], [105.0, 7.173913043478258], [106.0, 13.464285714285717], [107.0, 5.681818181818182], [108.0, 5.263157894736842], [109.0, 5.681818181818181], [110.0, 5.91304347826087], [111.0, 7.521739130434781], [112.0, 6.115384615384615], [113.0, 6.85], [114.0, 9.615384615384615], [115.0, 5.882352941176471], [116.0, 10.812499999999998], [117.0, 6.892857142857143], [118.0, 6.277777777777779], [119.0, 7.703703703703702], [120.0, 6.666666666666665], [121.0, 6.521739130434782], [122.0, 4.999999999999999], [123.0, 5.56], [124.0, 5.580645161290323], [125.0, 6.800000000000002], [126.0, 4.920000000000002], [127.0, 19.066666666666666], [128.0, 8.399999999999999], [129.0, 11.88888888888889], [130.0, 5.666666666666667], [131.0, 5.59090909090909], [132.0, 5.750000000000001], [133.0, 9.029411764705886], [134.0, 7.666666666666667], [135.0, 8.75], [136.0, 5.3478260869565215], [137.0, 9.35483870967742], [138.0, 14.049999999999999], [139.0, 4.954545454545453], [140.0, 17.594594594594593], [141.0, 7.281249999999998], [142.0, 5.521739130434782], [143.0, 5.208333333333333], [144.0, 10.24242424242424], [145.0, 5.92857142857143], [146.0, 6.0], [147.0, 8.552631578947372], [148.0, 9.333333333333334], [149.0, 5.679245283018866], [150.0, 20.73669440774563], [1.0, 5.0]], "isOverall": false, "label": "POST /api/forgot-password", "isController": false}, {"data": [[149.43873123939304, 20.593040219692313]], "isOverall": false, "label": "POST /api/forgot-password-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 150.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 31150.533333333333, "minX": 1.7868063E12, "maxY": 103127.5, "series": [{"data": [[1.78680678E12, 100730.0], [1.78680672E12, 100741.66666666667], [1.78680642E12, 101395.0], [1.78680684E12, 101336.66666666667], [1.78680654E12, 100765.0], [1.78680648E12, 99330.0], [1.7868066E12, 100560.83333333333], [1.7868063E12, 50592.5], [1.7868069E12, 100549.16666666667], [1.78680636E12, 103127.5], [1.78680702E12, 62375.833333333336], [1.78680696E12, 100794.16666666667], [1.78680666E12, 101231.66666666667]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.78680678E12, 62020.916666666664], [1.78680672E12, 62028.066666666666], [1.78680642E12, 62430.25], [1.78680684E12, 62394.45], [1.78680654E12, 62042.51666666667], [1.78680648E12, 61158.933333333334], [1.7868066E12, 61916.71666666667], [1.7868063E12, 31150.533333333333], [1.7868069E12, 61909.583333333336], [1.78680636E12, 63497.13333333333], [1.78680702E12, 38405.666666666664], [1.78680696E12, 62060.38333333333], [1.78680666E12, 62329.73333333333]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78680702E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 8.522031789128341, "minX": 1.7868063E12, "maxY": 28.91723557467506, "series": [{"data": [[1.78680678E12, 20.165682186703798], [1.78680672E12, 19.513549507816958], [1.78680642E12, 19.601771947992066], [1.78680684E12, 19.277112594980483], [1.78680654E12, 22.81428736829919], [1.78680648E12, 27.54193093727992], [1.7868066E12, 23.742270433319774], [1.7868063E12, 10.508935777700927], [1.7868069E12, 20.78807217033116], [1.78680636E12, 8.522031789128341], [1.78680702E12, 28.91723557467506], [1.78680696E12, 22.808785230626732], [1.78680666E12, 22.05278322000682]], "isOverall": false, "label": "POST /api/forgot-password", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78680702E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 8.518581367724417, "minX": 1.7868063E12, "maxY": 28.914710558309235, "series": [{"data": [[1.78680678E12, 20.163018299745094], [1.78680672E12, 19.509959467284254], [1.78680642E12, 19.599125532159665], [1.78680684E12, 19.273946580704596], [1.78680654E12, 22.811740187565132], [1.78680648E12, 27.53917077754281], [1.7868066E12, 23.739544057079772], [1.7868063E12, 10.500518851608414], [1.7868069E12, 20.785229448279942], [1.78680636E12, 8.518581367724417], [1.78680702E12, 28.914710558309235], [1.78680696E12, 22.806065165808285], [1.78680666E12, 22.048691944220398]], "isOverall": false, "label": "POST /api/forgot-password", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78680702E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 0.001496305994575893, "minX": 1.7868063E12, "maxY": 0.016718551827510624, "series": [{"data": [[1.78680678E12, 0.002258512856150096], [1.78680672E12, 0.0019687319050376425], [1.78680642E12, 0.0025888850535036195], [1.78680684E12, 0.0023601197329035112], [1.78680654E12, 0.0021998379066805623], [1.78680648E12, 0.002701432933991092], [1.7868066E12, 0.0026103602297116945], [1.7868063E12, 0.016718551827510624], [1.7868069E12, 0.0017984568080292352], [1.78680636E12, 0.003167599977374305], [1.78680702E12, 0.001496305994575893], [1.78680696E12, 0.001620464147230743], [1.78680666E12, 0.0021896968998501858]], "isOverall": false, "label": "POST /api/forgot-password", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78680702E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 0.0, "minX": 1.7868063E12, "maxY": 821.0, "series": [{"data": [[1.78680678E12, 287.0], [1.78680672E12, 272.0], [1.78680642E12, 227.0], [1.78680684E12, 284.0], [1.78680654E12, 280.0], [1.78680648E12, 742.0], [1.7868066E12, 821.0], [1.7868063E12, 68.0], [1.7868069E12, 289.0], [1.78680636E12, 54.0], [1.78680702E12, 787.0], [1.78680696E12, 285.0], [1.78680666E12, 306.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.78680678E12, 2.0], [1.78680672E12, 1.0], [1.78680642E12, 1.0], [1.78680684E12, 2.0], [1.78680654E12, 0.0], [1.78680648E12, 0.0], [1.7868066E12, 0.0], [1.7868063E12, 1.0], [1.7868069E12, 2.0], [1.78680636E12, 2.0], [1.78680702E12, 1.0], [1.78680696E12, 2.0], [1.78680666E12, 1.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.78680678E12, 51.0], [1.78680672E12, 59.0], [1.78680642E12, 60.0], [1.78680684E12, 45.0], [1.78680654E12, 78.0], [1.78680648E12, 84.0], [1.7868066E12, 57.0], [1.7868063E12, 22.0], [1.7868069E12, 66.0], [1.78680636E12, 17.0], [1.78680702E12, 85.0], [1.78680696E12, 74.0], [1.78680666E12, 53.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.78680678E12, 199.0], [1.78680672E12, 162.0], [1.78680642E12, 160.0], [1.78680684E12, 178.0], [1.78680654E12, 179.25], [1.78680648E12, 266.41999999999825], [1.7868066E12, 213.1999999999971], [1.7868063E12, 43.0], [1.7868069E12, 180.0], [1.78680636E12, 31.0], [1.78680702E12, 498.41999999999643], [1.78680696E12, 196.0], [1.78680666E12, 214.45000000000073]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.78680678E12, 8.0], [1.78680672E12, 8.0], [1.78680642E12, 7.0], [1.78680684E12, 8.0], [1.78680654E12, 7.0], [1.78680648E12, 8.0], [1.7868066E12, 8.0], [1.7868063E12, 8.0], [1.7868069E12, 7.0], [1.78680636E12, 7.0], [1.78680702E12, 7.0], [1.78680696E12, 7.0], [1.78680666E12, 8.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.78680678E12, 102.0], [1.78680672E12, 101.0], [1.78680642E12, 100.84999999999854], [1.78680684E12, 97.0], [1.78680654E12, 126.0], [1.78680648E12, 134.0], [1.7868066E12, 108.0], [1.7868063E12, 29.0], [1.7868069E12, 117.0], [1.78680636E12, 21.0], [1.78680702E12, 135.0], [1.78680696E12, 122.0], [1.78680666E12, 129.25]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78680702E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 5.0, "minX": 11.0, "maxY": 466.0, "series": [{"data": [[11.0, 8.0], [28.0, 7.0], [50.0, 7.0], [64.0, 6.0], [92.0, 6.0], [113.0, 6.0], [122.0, 137.0], [129.0, 6.0], [136.0, 8.0], [145.0, 8.0], [165.0, 6.0], [201.0, 6.0], [213.0, 6.0], [230.0, 5.0], [227.0, 6.0], [235.0, 6.0], [245.0, 6.0], [244.0, 6.0], [242.0, 7.0], [240.0, 12.0], [241.0, 8.0], [253.0, 8.0], [252.0, 11.0], [250.0, 58.0], [255.0, 12.0], [248.0, 11.0], [249.0, 22.0], [251.0, 466.0], [268.0, 10.0], [271.0, 9.0], [266.0, 8.0], [265.0, 11.0], [264.0, 10.0], [258.0, 7.5], [259.0, 10.0], [257.0, 9.0], [256.0, 5.0], [270.0, 9.0], [263.0, 8.0], [260.0, 8.0], [261.0, 10.0], [269.0, 8.0], [267.0, 8.0], [286.0, 7.0], [281.0, 8.0], [284.0, 7.0], [282.0, 8.0], [287.0, 8.0], [283.0, 8.0], [280.0, 8.0], [285.0, 8.0], [273.0, 10.0], [274.0, 8.0], [275.0, 10.0], [272.0, 9.0], [279.0, 8.0], [276.0, 9.5], [277.0, 9.0], [278.0, 8.0], [291.0, 7.0], [292.0, 7.0], [293.0, 7.0], [294.0, 7.0], [295.0, 7.0], [297.0, 7.0], [296.0, 7.0], [302.0, 8.0], [303.0, 7.0], [298.0, 8.0], [299.0, 7.0], [288.0, 7.0], [300.0, 7.0], [301.0, 7.0], [290.0, 7.0], [289.0, 7.0], [305.0, 7.0], [306.0, 7.0], [307.0, 9.0], [304.0, 8.0], [312.0, 8.0], [313.0, 8.0], [317.0, 9.0], [316.0, 9.0], [308.0, 8.0], [309.0, 9.0], [310.0, 9.0], [311.0, 8.0], [314.0, 8.0], [315.0, 9.0], [320.0, 8.0], [332.0, 9.0], [334.0, 9.0], [322.0, 11.0], [321.0, 7.0], [328.0, 20.0], [323.0, 9.0], [326.0, 9.0], [345.0, 10.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 345.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 5.0, "minX": 11.0, "maxY": 466.0, "series": [{"data": [[11.0, 8.0], [28.0, 7.0], [50.0, 7.0], [64.0, 6.0], [92.0, 6.0], [113.0, 6.0], [122.0, 137.0], [129.0, 6.0], [136.0, 8.0], [145.0, 8.0], [165.0, 6.0], [201.0, 6.0], [213.0, 6.0], [230.0, 5.0], [227.0, 6.0], [235.0, 6.0], [245.0, 6.0], [244.0, 6.0], [242.0, 7.0], [240.0, 12.0], [241.0, 8.0], [253.0, 8.0], [252.0, 11.0], [250.0, 58.0], [255.0, 12.0], [248.0, 11.0], [249.0, 22.0], [251.0, 466.0], [268.0, 10.0], [271.0, 9.0], [266.0, 8.0], [265.0, 11.0], [264.0, 10.0], [258.0, 7.5], [259.0, 10.0], [257.0, 9.0], [256.0, 5.0], [270.0, 9.0], [263.0, 8.0], [260.0, 8.0], [261.0, 10.0], [269.0, 8.0], [267.0, 8.0], [286.0, 7.0], [281.0, 8.0], [284.0, 7.0], [282.0, 8.0], [287.0, 8.0], [283.0, 8.0], [280.0, 8.0], [285.0, 8.0], [273.0, 10.0], [274.0, 8.0], [275.0, 10.0], [272.0, 9.0], [279.0, 8.0], [276.0, 9.0], [277.0, 9.0], [278.0, 8.0], [291.0, 7.0], [292.0, 7.0], [293.0, 7.0], [294.0, 7.0], [295.0, 7.0], [297.0, 7.0], [296.0, 7.0], [302.0, 8.0], [303.0, 7.0], [298.0, 8.0], [299.0, 7.0], [288.0, 7.0], [300.0, 7.0], [301.0, 7.0], [290.0, 7.0], [289.0, 7.0], [305.0, 7.0], [306.0, 7.0], [307.0, 9.0], [304.0, 8.0], [312.0, 8.0], [313.0, 8.0], [317.0, 9.0], [316.0, 9.0], [308.0, 8.0], [309.0, 9.0], [310.0, 9.0], [311.0, 8.0], [314.0, 8.0], [315.0, 9.0], [320.0, 8.0], [332.0, 9.0], [334.0, 9.0], [322.0, 11.0], [321.0, 7.0], [328.0, 20.0], [323.0, 9.0], [326.0, 9.0], [345.0, 10.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 345.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 144.58333333333334, "minX": 1.7868063E12, "maxY": 294.6166666666667, "series": [{"data": [[1.78680678E12, 287.8], [1.78680672E12, 287.81666666666666], [1.78680642E12, 289.98333333333335], [1.78680684E12, 289.51666666666665], [1.78680654E12, 287.9166666666667], [1.78680648E12, 283.53333333333336], [1.7868066E12, 288.1166666666667], [1.7868063E12, 144.58333333333334], [1.7868069E12, 287.3], [1.78680636E12, 294.6166666666667], [1.78680702E12, 178.15], [1.78680696E12, 288.03333333333336], [1.78680666E12, 288.43333333333334]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78680702E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 144.55, "minX": 1.7868063E12, "maxY": 294.65, "series": [{"data": [[1.78680678E12, 287.8], [1.78680672E12, 287.8333333333333], [1.78680642E12, 289.7], [1.78680684E12, 289.53333333333336], [1.78680654E12, 287.9], [1.78680648E12, 283.8], [1.7868066E12, 287.31666666666666], [1.7868063E12, 144.55], [1.7868069E12, 287.28333333333336], [1.78680636E12, 294.65], [1.78680702E12, 178.21666666666667], [1.78680696E12, 287.98333333333335], [1.78680666E12, 289.23333333333335]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78680702E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 144.55, "minX": 1.7868063E12, "maxY": 294.65, "series": [{"data": [[1.78680678E12, 287.8], [1.78680672E12, 287.8333333333333], [1.78680642E12, 289.7], [1.78680684E12, 289.53333333333336], [1.78680654E12, 287.9], [1.78680648E12, 283.8], [1.7868066E12, 287.31666666666666], [1.7868063E12, 144.55], [1.7868069E12, 287.28333333333336], [1.78680636E12, 294.65], [1.78680702E12, 178.21666666666667], [1.78680696E12, 287.98333333333335], [1.78680666E12, 289.23333333333335]], "isOverall": false, "label": "POST /api/forgot-password-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78680702E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 144.55, "minX": 1.7868063E12, "maxY": 294.65, "series": [{"data": [[1.78680678E12, 287.8], [1.78680672E12, 287.8333333333333], [1.78680642E12, 289.7], [1.78680684E12, 289.53333333333336], [1.78680654E12, 287.9], [1.78680648E12, 283.8], [1.7868066E12, 287.31666666666666], [1.7868063E12, 144.55], [1.7868069E12, 287.28333333333336], [1.78680636E12, 294.65], [1.78680702E12, 178.21666666666667], [1.78680696E12, 287.98333333333335], [1.78680666E12, 289.23333333333335]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78680702E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

