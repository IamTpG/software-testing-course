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
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.67991572464649, "KoPercent": 0.3200842753535108};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8530245938171063, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8530245938171063, 500, 1500, "POST /api/forgot-password"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 24681, 79, 0.3200842753535108, 240.33187472144647, 3, 7682, 175.0, 634.0, 668.0, 757.0, 189.73125057655054, 64.84954853690692, 39.92876718120599], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /api/forgot-password", 24681, 79, 0.3200842753535108, 240.33187472144647, 3, 7682, 175.0, 634.0, 668.0, 757.0, 189.73125057655054, 64.84954853690692, 39.92876718120599], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 4,512 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 2,114 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 6,608 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 7,494 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 5,799 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 7,196 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 6,843 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 4,207 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 2,278 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 5,425 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 6,345 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 5,001 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 2,710 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 6,557 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,903 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 7,682 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 4,655 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 4,328 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 4,190 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 2,684 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 2,704 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 2,526 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 7,199 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 2,009 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 5,285 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 5,486 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 6,484 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,389 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,110 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,370 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 4,835 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 4,052 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 4,410 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 2,246 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 2,372 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 6,081 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 2,213 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 5,553 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 7,568 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 5,123 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,990 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 2,489 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,618 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 4,798 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 2,471 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 4,165 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,993 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 5,896 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 5,066 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 4,665 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 5,760 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 6,188 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,789 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 2,933 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 6,007 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,372 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 6,792 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 2,476 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 5,634 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 5,668 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 6,870 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,258 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,739 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 7,351 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,013 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,046 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 4,874 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,866 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,900 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 6,957 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,517 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 2.5316455696202533, 0.008103399376038248], "isController": false}, {"data": ["The operation lasted too long: It took 2,778 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 3,497 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 5,188 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 7,103 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 2,096 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 5,392 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}, {"data": ["The operation lasted too long: It took 6,701 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 1.2658227848101267, 0.004051699688019124], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 24681, 79, "The operation lasted too long: It took 3,517 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, "The operation lasted too long: It took 4,512 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,114 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 6,608 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 7,494 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST /api/forgot-password", 24681, 79, "The operation lasted too long: It took 3,517 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, "The operation lasted too long: It took 4,512 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,114 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 6,608 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 7,494 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
