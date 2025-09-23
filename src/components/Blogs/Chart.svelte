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
    title: string;
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
    title,
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

<figure style=" min-height: 400px; margin-block: 2rem;" class="breakout">
  <div style="position: relative; min-height: 400px;">
    <canvas
      bind:this={ctx}
      aria-label={ariaLabel ||
        `A ${type} chart with labels ${labels.join(", ")}`}
    ></canvas>
  </div>

  <figcaption>
    {title || `A ${type} chart with labels ${labels.join(", ")}`}
  </figcaption>
</figure>
