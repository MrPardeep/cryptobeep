import Vue from "vue";
import {
  GetRequest,
  PostRequest
} from '../../utils/globalservice'
import * as config from '../../config/constants.js'

export default {
  name: 'portfolio-detail',
  components: {}, 
  props: ['id'],
  data () {
    return {
      loader: false,
      coinForm: {},
      marketNameList : []
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    getMarketList() {
      this.loader = true;
      // let url = 'https://bittrex.com/api/v1.1/public/getmarkets';
      let url = 'static/json/markets.json'

      GetRequest(url)
        .then ( res => {
          this.loader = false;
          for(let i=0; i< res.result.length; i++) {
            this.marketNameList.push(res.result[i].MarketName);
          }
          // console.log(this.marketNameList, 'Market List');
        })
        .catch(err=> {
          this.loader = false;
        });
    },

    addCoinCall(event) {
      event.preventDefault();
      console.log(this.coinForm);
      this.$swal({
        type: 'success',
        title: 'Coin added to your portfolio'
      }).then((result) => {
        if (result) {
          this.$router.push('/');
        }
      })
    }
  },
  created(){
    this.getMarketList();
    console.log(this.id, "Portfolio Numebr");
  }
}
