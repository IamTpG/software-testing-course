```bash
jmeter -n -t 23127244_Load_20260815.jmx   -l ../results/23127244_Load_20260815.jtl   -e -o ../results/23127244_Load_20260815_report

jmeter -n -t 23127244_Stress_20260815.jmx -l ../results/23127244_Stress_20260815.jtl -e -o ../results/23127244_Stress_20260815_report

jmeter -n -t 23127244_Spike_20260815.jmx  -l ../results/23127244_Spike_20260815.jtl  -e -o ../results/23127244_Spike_20260815_report
```
