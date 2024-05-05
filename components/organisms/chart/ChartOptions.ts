export const ChartStudyOptions = (
  xaxis: string[],
  attendMax: number,
  text?: string,
): ApexCharts.ApexOptions => ({
  chart: {
    type: "line",
    zoom: {
      enabled: false,
    },

    toolbar: {
      show: true,
    },
  },
  stroke: {
    curve: "straight" as "straight" | "smooth" | "stepline",
  },

  title: {
    text: text,
    align: "left" as "left" | "center" | "right",
  },
  grid: {
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.5,
    },
  },
  xaxis: { categories: xaxis },
  yaxis: {
    min: 0,
    max: attendMax,
    forceNiceScale: true,
    labels: {
      formatter: function (val) {
        return Math.round(val).toString();
      },
    },
  },
});
