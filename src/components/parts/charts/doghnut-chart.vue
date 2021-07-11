<script>
import { Doughnut, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Doughnut,
  mixins: [reactiveProp],
  props: {
    chartData: Number
  },
  data () {
    return {
      doughnutChartData: {
        labels: ["", "Learning Level"],
        datasets: [
          {
            // data: [(100 - this.chartData), this.chartData],
            data: [0, 100],
            backgroundColor: ['#fff', '#f87979']
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // title: {
        //   display: true,
        //   text: 'Learning Level',
        //   fontSize: 18
        // },
        legend: {
          display: false
        }
      }
    }
  },
  mounted () {
    this.renderChart(this.doughnutChartData, this.options)
  }
}
</script>