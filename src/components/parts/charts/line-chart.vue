<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    chartData: Array
  },
  data: function () {
    return {
      lineChartData: {
        labels: [...Array(this.chartData.length)].map((_, i) => i + 1),
        datasets: [
          {
            label: 'Recent Score History',
            data: this.chartData,
            backgroundColor: '#F28E3C',
            lineTension: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              max: 100,
              stepSize: 10
            }
          }]
        },
        title: {
          display: true,
          text: 'Score History',
          fontSize: 22
        },
        legend: {
          display: false
        }
      }
    }
  },
  mounted () {
    this.renderChart(this.lineChartData, this.options)
  }
}
</script>