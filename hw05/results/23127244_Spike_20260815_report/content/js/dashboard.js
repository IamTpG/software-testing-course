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

    var data = {"OkPercent": 99.58408514021835, "KoPercent": 0.4159148597816447};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.993394293403468, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.993394293403468, 500, 1500, "POST /api/apply-coupon"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32699, 136, 0.4159148597816447, 118.10590537936916, 0, 4237, 98.0, 133.0, 150.0, 261.0, 603.8373467277294, 234.8129310782612, 139.75532341257016], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /api/apply-coupon", 32699, 136, 0.4159148597816447, 118.10590537936916, 0, 4237, 98.0, 133.0, 150.0, 261.0, 603.8373467277294, 234.8129310782612, 139.75532341257016], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 1,694 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,125 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 4,134 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,119 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,049 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,795 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,649 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,824 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,347 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,171 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,287 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,598 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,596 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,966 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,328 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,863 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,084 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,036 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,025 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,468 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,352 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 4,016 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,902 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,113 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,935 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,559 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,734 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,583 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,728 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,834 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,558 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,620 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,787 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,408 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,921 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,413 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,457 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,488 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,989 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,844 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,442 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,210 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,399 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,461 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,789 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,664 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,509 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,545 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,715 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,718 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,428 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,808 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,139 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,661 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,175 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,537 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,561 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,703 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,241 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,572 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,400 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,827 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,320 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 4,108 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,629 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,884 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,564 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,645 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,519 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 4,149 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,988 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,558 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,607 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,379 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,588 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,707 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,274 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,927 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 4,200 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,943 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 4,166 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 4,180 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,678 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,866 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, 1.4705882352941178, 0.006116394996788893], "isController": false}, {"data": ["The operation lasted too long: It took 2,226 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,745 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,510 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,013 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,496 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,754 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,505 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,033 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,958 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,876 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,553 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,074 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,305 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,976 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,609 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,511 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,808 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 4,186 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,550 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,064 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,758 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,572 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,578 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,731 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,245 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,469 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,143 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,492 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,675 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,807 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,503 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,525 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, 1.4705882352941178, 0.006116394996788893], "isController": false}, {"data": ["The operation lasted too long: It took 1,536 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,569 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,434 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,768 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,098 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,155 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,381 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 1,859 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,199 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,524 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,442 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,513 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 4,237 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,535 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 2,904 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 4,079 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 4,046 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}, {"data": ["The operation lasted too long: It took 3,611 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 0.7352941176470589, 0.0030581974983944463], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 32699, 136, "The operation lasted too long: It took 2,866 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, "The operation lasted too long: It took 1,525 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, "The operation lasted too long: It took 1,694 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 3,125 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 4,134 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST /api/apply-coupon", 32699, 136, "The operation lasted too long: It took 2,866 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, "The operation lasted too long: It took 1,525 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, "The operation lasted too long: It took 1,694 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 3,125 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 4,134 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
