<script lang="ts">
  import { onMount } from "svelte";

  import type { ChartData, ChartOptions, ChartType } from "chart.js";
  import Chart from "chart.js/auto";

  type Props<T extends ChartType = ChartType> = {
    type: T;
    labels: ChartData<T>["labels"];
    datasets: ChartData<T>["datasets"];
    options?: ChartOptions<T>;
    ariaLabel?: string;
  };

  const defaultLabels = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];

  const defaultDatasets = [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1,
    },
  ];

  const defaultOptions = {
    normalized: true,
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 3,
    plugins: {
      legend: {
        labels: {
          font: {
            family: "Mica Valo",
            size: 20,
          },
          color: "#e5e5e5",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#e5e5e5" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#e5e5e5" },
        grid: { color: "rgba(255,255,255,0.1)" },
        max: 10,
      },
    },
  };

  const {
    type = "bar",
    labels = defaultLabels,
    datasets = defaultDatasets,
    options = defaultOptions,
    ariaLabel,
  }: Props = $props();

  const config = {
    type,
    data: {
      labels: JSON.parse(JSON.stringify(labels)),
      datasets: JSON.parse(JSON.stringify(datasets)),
    },
    options,
  };

  let ctx: HTMLCanvasElement;
  onMount(() => {
    new Chart(ctx, config);
  });
</script>

<div
  style="position: relative;display: block;width: 85%;min-height: 400px;margin: 2rem auto;"
>
  <canvas
    bind:this={ctx}
    aria-label={ariaLabel || `A ${type} chart with labels ${labels.join(", ")}`}
  ></canvas>
</div>
