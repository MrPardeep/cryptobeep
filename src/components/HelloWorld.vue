<template>
  <div class='ext-container'>
    <div class='sticky-header'>
      <span class='add-portfolio-label' @click='addPortfolioToggle'>+ Add Portfolio</span>
    </div>
    <div class='price-header'>
      <marquee>
        <span>
          BTC/USD: {{backgroundRef ? backgroundRef.btcValue.usd : '-'}}
        </span>
        &nbsp; | &nbsp;
        <span>
          BTC/INR: {{backgroundRef ? backgroundRef.btcValue.inr : '-'}}
        </span>
      </marquee>
    </div>
    <img src="static/img/no-data-found.png" v-if='!myPortfolio.length && !portfolioFormToggle' class='no-content-img'>
    <br/>

    <!-- Add Portfolio section -->
    <div class="form-box" v-if='portfolioFormToggle'>
      <br>
      <b-form @submit="addPortfolio">
          <b-container fluid>
            <b-row class="my-1">
                <b-col cols="4"><label for="input-none">Portfolio Name *</label></b-col>
                <b-col cols="8">
                  <b-form-input id="name" name="Portfolio" type="text" v-model="portfolioObj.name" v-validate="'required'" placeholder="Enter Portfolio Name"></b-form-input>
                  <span v-show="errors.has('Portfolio')" class="help is-danger">{{ errors.first('Portfolio') }}</span>
                </b-col>
            </b-row>
          </b-container>
          <br />
          <b-button type="submit" variant="primary">Add</b-button>
      </b-form>
    </div>

    
    <div v-if='myPortfolio.length'>
      <div style='margin:0 0 20px'>
        <label classs='main-heading pull-left'> Portfolio List</label>
        <!-- <button class='btn btn-primary pull-right' @click='addMarketCall'>+ Add Market</button> -->
        <b-btn class='pull-right' v-b-toggle.collapse1 variant="primary">+ Add Market</b-btn>
        <b-collapse id="collapse1" class="mt-2">
          <!-- Add coin section -->
          <div class="form-box">
            <b-form @submit="addCoinCall">
                <b-container fluid>
                  <b-row class="my-1">
                      <!-- <b-col xs="4"><label for="input-none">Market Name *</label></b-col> -->
                      <b-col xs="9">
                        <b-form-select name="Market Name" v-model="coinForm.name" v-validate="'required'" :options="marketNameList" class="mb-3">
                        </b-form-select>
                        <span v-show="errors.has('Market Name')" class="help is-danger">{{ errors.first('Market Name') }}</span>
                      </b-col>
                      <b-col xs="3">
                        <b-button type="submit" variant="primary">Submit</b-button>
                      </b-col>
                  </b-row>
                </b-container>
            </b-form>
          </div>
        </b-collapse>
      </div>
      <b-card no-body>
        <b-tabs card v-model="tabIndex" no-fade=true>
          <b-tab :title="`${portfolio.name}`" v-for='portfolio in myPortfolio' :key="portfolio.name" @click.native='getCoinList(portfolio.name)'>
            <b-table v-if='portfolio.coins.length' striped hover :fields="fields" :items="portfolio.coins">
              <template slot="currentValue" scope="row">
                {{row.item ? row.item.currentValue.btc : '-'}} / {{row.item.currentValue ? row.item.currentValue.usd : '-'}}
              </template>
              <template slot="alerts" scope="row">
                {{row.item.btc ? row.item.btc.high : '-'}} / {{row.item.usd ? row.item.usd.low : '-'}}
              </template>
            </b-table>
          </b-tab>
        </b-tabs>
      </b-card>

    </div>
  </div>
</template>

<script>
import Vue from "vue";
import {
  GetRequest,
  PostRequest
} from '../utils/globalservice'
import * as config from '../config/constants.js'
import { Tabs } from 'bootstrap-vue/es/components';

export default {
  name: 'HelloWorld',
  components: {
    Tabs
  },
  data () {
    return {
      myPortfolio: [],
      tabIndex: 1,
      portfolioObj: {},
      portfolioFormToggle: false,
      loader: false,
      coinForm: {},
      marketNameList : [],
      selectedCoinName: null,
      backgroundRef : null,
      fields: {
        name: {
          label: 'Name',
          sortable: true
        },
        currentValue: {
          label: 'Price(BTC/USD)',
          sortable: false
        },
        showAlert: {
          label: 'Alert',
          sortable: false
        },
        alerts: {
          label: 'Alert Value',
          sortable: false
        }
      },
    }
  },
  methods: {
    addPortfolioToggle() {
      // this.portfolioFormToggle = true;
      const {value: formValues} = this.$swal({
        html:
          '<input id="portfolio-name" class="swal2-input" v-model="portfolioObj.name" v-validate="required" placeholder="Enter Portfolio Name">',
        focusConfirm: false,
        confirmButtonText: 'Submit',
        width: 400
      }).then(result => {
        let val = document.getElementById('portfolio-name').value;
        console.log(this.portfolioObj, val);

        /* As of now data binding is not working, commented code is right one */
        /* if(this.portfolioObj.name) {
          this.myPortfolio.push({name: this.portfolioObj.name, coins: []});
          this.backgroundRef.updatePortfolioInDb();
          this.portfolioObj = {};
          // this.portfolioFormToggle = false;
        } */
        if(val) {
          this.myPortfolio.push({name: val, coins: []});
          this.backgroundRef.updatePortfolioInDb();
        }
      })
    },

    addMarketCall() {
      const {value: formValues} = this.$swal({
        html:
          '<b-form-select name="Market Name" v-model="coinForm.name" v-validate="required" :options="marketNameList" class="mb-3"></b-form-select>',
          input: 'select',
          inputOptions: {
            'SRB': 'Serbia',
            'UKR': 'Ukraine',
            'HRV': 'Croatia'
          },
        focusConfirm: false,
        confirmButtonText: 'Submit',
        width: 400
      }).then(result => {
        // let val = document.getElementById('market-name').value;
        this.addCoinCall();
        if(val) {
          this.coinForm.name = val;
        }
      })
    },
    /* Method To add new portfolio into the list */
    addPortfolio(event) {
      event.preventDefault();
      this.myPortfolio.push({name: this.portfolioObj.name, coins: []});
      this.backgroundRef.updatePortfolioInDb();
      this.portfolioObj = {};
      this.portfolioFormToggle = false;
      console.log('portfolio list', this.myPortfolio);
    },

    getCoinList(coinName) {
      console.log(coinName);
      this.selectedCoinName = coinName;
    },

    containsObject(obj, list) {
      for (let i = 0; i < list.length; i++) {
          if (list[i].name == obj.name) {
              return true;
          }
      }
      /* this.$swal({
        title: 'Wait !',
        text: 'Alredy Added.',
        type: 'info'
      }); */
      return false;
    },

    addCoinCall(event) {
      event.preventDefault();
      console.log(this.coinForm, this.tabIndex);
      let coinData = {
        name: this.coinForm.name,
        showAlert: false,
        volume: 0,
        currentValue: {
          btc: 0,
          usd: 0
        },
        alerts: {
          btc: {
              high: 0,
              low: 0
          },
          usd: {
              high: 0,
              low: 0
          }
        }
      }

      this.myPortfolio[this.tabIndex].coins.push(coinData);
      this.backgroundRef.updatePortfolioInDb();
    }
  },
  created() {
    chrome.runtime.getBackgroundPage(bg => {
      this.backgroundRef = bg;
      this.myPortfolio = bg.portfolio;
      this.bgMarketList = bg.allMarkets;
      this.marketNameList = [];
      this.marketNameList = this.bgMarketList.slice();
      this.marketNameList.unshift('Select Market');
      // console.log(this.myPortfolio, "My portfolio from Background ref on Load");
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
::-webkit-scrollbar {
    height: 8px;
    width: 8px;
    background: #c0c0c0;
}

::-webkit-scrollbar-thumb {
    background: white;
    -webkit-border-radius: 1ex;
    -webkit-box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.75);
}

::-webkit-scrollbar-corner {
    background: white;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.pull-right {
  float: right;
}
.pull-left {
  float: left;
}
/* custom Styling */
.no-content-img {
  margin: 10px
}
.ext-container {
  border: 3px solid #286090;
  padding: 2px;
  min-height: 498px;
  background: url('/dist/static/img/background.jpg');
}
.main-heading {
  font-size: 20px;
  float: left;
}
.form-box {
  margin-top: 10px;
  border-top: 1px solid #e2e2e2;
  padding: 10px 0;
  border-bottom: 1px solid #e2e2e2;
}
.sticky-header {
  height:50px;
  width: 100%;
  min-width: 100%;
  background: #286090;
  color: white;
  line-height: 50px;
  border-bottom: 1px solid grey;
}
.add-portfolio-label {
  margin: 0 10px;
  cursor: pointer;
  float: right;
}
.price-header {
  height: 25px;
  line-height: 15px;
  text-align: left;
  padding: 5px 10px;
  border-bottom: 2px solid #286090;
}
.hello{
  position: relative;
  width: 50%;
  margin: 10px auto;
  padding: 20px 0 40px;
  text-align: center;
  background: #fff;
  border: 1px solid #ccc;
}
</style>
