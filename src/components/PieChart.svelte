<script lang="ts">
  import { Pie } from 'svelte-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
  } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

  let { data, options = {} } = $props();

  let chartData = $derived({
    labels: data?.labels || [],
    datasets: data?.datasets || [
      {
        data: [],
        backgroundColor: [],
        borderWidth: 0,
        spacing: 0,
      },
    ],
  });

  let mergedOptions = $derived({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    rotation: data?.options?.rotation || 0,
    ...options,
  });
</script>

<Pie data={chartData} options={mergedOptions} />
