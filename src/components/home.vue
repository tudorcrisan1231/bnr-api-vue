<template>

  <div class="page">
    <div class="page_title">
      Welcome to my BNR currency app!
    </div>

    <div class="page_info">
      <div class="page_text">
        <b>IMPORTANT</b>: if it's your first time here, you will see the currencies from today, otherwise you will see the currencies from the days you visited the website. So if you want to see a demo of the chart NOW (with some more data), you can press the button below to insert some FAKE data in the localstorage. After that, you can refresh the page and you will see the chart with the fake data. If you want to see the chart with the real data again, you can clear the localstorage and refresh the page.
      </div>
      <div class="page_save" @click="addFakeData()">Add fake data</div>
    </div>


    <div>
      <ChartData/>
    </div>

    <div class="page_currencies">
      <div class="page_currencies_title" v-if="this.api_data.cube">National Bank of Romania ({{ this.api_data.cube.attributes.date.value }} data): </div>
      <div class="page_currencies_search">
        <input type="text" id="search" placeholder="Search currency" v-model="search" @keydown="searchData()">
      </div>
      <div v-for="(item, index) in api_data.rates" :key="index" class="page_currencies_item">
        {{ item.innerHTML }} {{ item.attributes.currency.value }}
      </div>
    </div>
  </div>
  
</template>

<script>
import { reactive } from "vue";
import axios from "axios";
import ChartData from "./chart.vue";

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    ChartData,
  },
  
  setup() {
    const api_data = reactive({
      body: '',
      cube: '',
      rates: '',
    });
    let full_xml = '';
    let current_data = '';
    let search = '';
    async function getApiData() {
   

      //in caz ca nu exista in localstorage se face request la api si se salveaza in localstorage, altfel se ia din localstorage
      if(localStorage.getItem(current_data) == null || localStorage.getItem(current_data) == 'null'){
      
        axios.get('http://localhost:3000/api/nbrfxrates')
        .then(response => {
          console.log(response.data);
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response.data, 'text/xml');

          api_data.body = xmlDoc.getElementsByTagName('Body')[0];
          api_data.cube = xmlDoc.getElementsByTagName('Cube')[0];
          api_data.rates = xmlDoc.getElementsByTagName('Cube')[0].getElementsByTagName('Rate');

        

          if(current_data == api_data.cube.attributes.date.value ){
            localStorage.setItem(current_data, response.data);

            if(localStorage.getItem('dates') === null){
              localStorage.setItem('dates', JSON.stringify([current_data]));
            } else {
              let dates = JSON.parse(localStorage.getItem('dates'));
              dates.push(current_data);
              localStorage.setItem('dates', JSON.stringify(dates));
            }
            

            this.full_xml = response.data;

            console.log('salvat in local storage', api_data.body, api_data.cube, api_data.rates);
            location.reload();
          } else {
            localStorage.setItem(current_data, null);
            location.reload();
          }
          console.log('api called');
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(localStorage.getItem(current_data), 'text/xml');
        
        //se verifica daca datele din localstorage sunt complete din ziua curenta (fac asta pt ca api ul se actualizeaza undeva pe la jumatatea zilei)
        if(xmlDoc.getElementsByTagName('Body')[0] && xmlDoc.getElementsByTagName('Cube')[0] && xmlDoc.getElementsByTagName('Cube')[0].getElementsByTagName('Rate')){
          api_data.body = xmlDoc.getElementsByTagName('Body')[0];
          api_data.cube = xmlDoc.getElementsByTagName('Cube')[0];
          api_data.rates = xmlDoc.getElementsByTagName('Cube')[0].getElementsByTagName('Rate');

          this.full_xml = localStorage.getItem(current_data);
        } else {
          //in caz ca datele din localstorage nu sunt complete se iau datele din ultima zi salvata complet (adica de ex daca azi nu s-a salvat nimic in localstorage se iau datele de ieri)
          let dates = JSON.parse(localStorage.getItem('dates'));
          let last_date = dates[dates.length - 1];
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(localStorage.getItem(last_date), 'text/xml');
          api_data.body = xmlDoc.getElementsByTagName('Body')[0];
          api_data.cube = xmlDoc.getElementsByTagName('Cube')[0];
          api_data.rates = xmlDoc.getElementsByTagName('Cube')[0].getElementsByTagName('Rate');
        }
        console.log("SAVED",api_data.body, api_data.cube, api_data.rates);
      }

    }

    function getCurrentData(){
      var currentDate = new Date();

      var year = currentDate.getFullYear();
      var month = String(currentDate.getMonth() + 1).padStart(2, '0');
      var day = String(currentDate.getDate()).padStart(2, '0');

      var formattedDate = year + '-' + month + '-' + day;

      current_data = formattedDate;
    }

    function searchData(){
      console.log(this.search);
      const page_currencies_item = document.querySelectorAll('.page_currencies_item');
      page_currencies_item.forEach(item => {
        if(item.innerHTML.toLowerCase().includes(this.search.toLowerCase())){
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }

    function addFakeData(){
      //clear all localstorage
      localStorage.clear();

      localStorage.setItem('2023-05-17', `<?xml version="1.0" encoding="utf-8"?>
      <DataSet xmlns="http://www.bnr.ro/xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.bnr.ro/xsd nbrfxrates.xsd">
        <Header>
          <Publisher>National Bank of Romania</Publisher>
          <PublishingDate>2023-05-17</PublishingDate>
          <MessageType>DR</MessageType>
        </Header>
        <Body>
          <Subject>Reference rates</Subject>
          <OrigCurrency>RON</OrigCurrency>
          <Cube date="2023-05-17">
            <Rate currency="AED">1.2478</Rate>
            <Rate currency="AUD">3.0455</Rate>
            <Rate currency="BGN">2.5365</Rate>
            <Rate currency="BRL">0.9273</Rate>
            <Rate currency="CAD">3.3932</Rate>
            <Rate currency="CHF">5.0942</Rate>
            <Rate currency="CNY">0.6548</Rate>
            <Rate currency="CZK">0.2097</Rate>
            <Rate currency="DKK">0.6661</Rate>
            <Rate currency="EGP">0.1482</Rate>
            <Rate currency="EUR">4.9610</Rate>
            <Rate currency="GBP">5.6971</Rate>
            <Rate currency="HUF" multiplier="100">1.3425</Rate>
            <Rate currency="INR">0.0556</Rate>
            <Rate currency="JPY" multiplier="100">3.3457</Rate>
            <Rate currency="KRW" multiplier="100">0.3425</Rate>
            <Rate currency="MDL">0.2561</Rate>
            <Rate currency="MXN">0.2612</Rate>
            <Rate currency="NOK">0.4243</Rate>
            <Rate currency="NZD">2.8621</Rate>
            <Rate currency="PLN">1.1037</Rate>
            <Rate currency="RSD">0.0423</Rate>
            <Rate currency="RUB">0.0567</Rate>
            <Rate currency="SEK">0.4382</Rate>
            <Rate currency="THB">0.1337</Rate>
            <Rate currency="TRY">0.2319</Rate>
            <Rate currency="UAH">0.1241</Rate>
            <Rate currency="USD">4.5816</Rate>
            <Rate currency="XAU">292.4094</Rate>
            <Rate currency="XDR">6.1338</Rate>
            <Rate currency="ZAR">0.2386</Rate>
          </Cube>
        </Body>
      </DataSet>`);

      localStorage.setItem('2023-05-18', `<?xml version="1.0" encoding="utf-8"?>
      <DataSet xmlns="http://www.bnr.ro/xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.bnr.ro/xsd nbrfxrates.xsd">
        <Header>
          <Publisher>National Bank of Romania</Publisher>
          <PublishingDate>2023-05-18</PublishingDate>
          <MessageType>DR</MessageType>
        </Header>
        <Body>
          <Subject>Reference rates</Subject>
          <OrigCurrency>RON</OrigCurrency>
          <Cube date="2023-05-18">
            <Rate currency="AED">1.2521</Rate>
            <Rate currency="AUD">3.0515</Rate>
            <Rate currency="BGN">2.5427</Rate>
            <Rate currency="BRL">0.9308</Rate>
            <Rate currency="CAD">3.4124</Rate>
            <Rate currency="CHF">5.1061</Rate>
            <Rate currency="CNY">0.6539</Rate>
            <Rate currency="CZK">0.2098</Rate>
            <Rate currency="DKK">0.6677</Rate>
            <Rate currency="EGP">0.1488</Rate>
            <Rate currency="EUR">4.9731</Rate>
            <Rate currency="GBP">5.7169</Rate>
            <Rate currency="HUF" multiplier="100">1.3335</Rate>
            <Rate currency="INR">0.0557</Rate>
            <Rate currency="JPY" multiplier="100">3.3370</Rate>
            <Rate currency="KRW" multiplier="100">0.3442</Rate>
            <Rate currency="MDL">0.2589</Rate>
            <Rate currency="MXN">0.2598</Rate>
            <Rate currency="NOK">0.4238</Rate>
            <Rate currency="NZD">2.8697</Rate>
            <Rate currency="PLN">1.0958</Rate>
            <Rate currency="RSD">0.0424</Rate>
            <Rate currency="RUB">0.0575</Rate>
            <Rate currency="SEK">0.4382</Rate>
            <Rate currency="THB">0.1338</Rate>
            <Rate currency="TRY">0.2326</Rate>
            <Rate currency="UAH">0.1245</Rate>
            <Rate currency="USD">4.5975</Rate>
            <Rate currency="XAU">292.2952</Rate>
            <Rate currency="XDR">6.1469</Rate>
            <Rate currency="ZAR">0.2371</Rate>
          </Cube>
        </Body>
      </DataSet>`);

      localStorage.setItem('2023-05-19', `<?xml version="1.0" encoding="utf-8"?>
      <DataSet xmlns="http://www.bnr.ro/xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.bnr.ro/xsd nbrfxrates.xsd">
        <Header>
          <Publisher>National Bank of Romania</Publisher>
          <PublishingDate>2023-05-18</PublishingDate>
          <MessageType>DR</MessageType>
        </Header>
        <Body>
          <Subject>Reference rates</Subject>
          <OrigCurrency>RON</OrigCurrency>
          <Cube date="2023-05-18">
            <Rate currency="AED">11.12521</Rate>
            <Rate currency="AUD">3.034515</Rate>
            <Rate currency="BGN">2.55427</Rate>
            <Rate currency="BRL">0.93208</Rate>
            <Rate currency="CAD">3.34124</Rate>
            <Rate currency="CHF">5.1061</Rate>
            <Rate currency="CNY">1.61539</Rate>
            <Rate currency="CZK">2.2098</Rate>
            <Rate currency="DKK">5.6677</Rate>
            <Rate currency="EGP">2.14688</Rate>
            <Rate currency="EUR">4.9731</Rate>
            <Rate currency="GBP">5.75169</Rate>
            <Rate currency="HUF" multiplier="100">1.3335</Rate>
            <Rate currency="INR">1.0557</Rate>
            <Rate currency="JPY" multiplier="100">3.3370</Rate>
            <Rate currency="KRW" multiplier="100">0.3442</Rate>
            <Rate currency="MDL">0.2589</Rate>
            <Rate currency="MXN">4.22598</Rate>
            <Rate currency="NOK">0.4238</Rate>
            <Rate currency="NZD">2.86397</Rate>
            <Rate currency="PLN">1.0958</Rate>
            <Rate currency="RSD">2.01424</Rate>
            <Rate currency="RUB">1.0575</Rate>
            <Rate currency="SEK">0.43482</Rate>
            <Rate currency="THB">1.1338</Rate>
            <Rate currency="TRY">0.2326</Rate>
            <Rate currency="UAH">2.1245</Rate>
            <Rate currency="USD">4.5975</Rate>
            <Rate currency="XAU">292.2952</Rate>
            <Rate currency="XDR">6.14659</Rate>
            <Rate currency="ZAR">0.2371</Rate>
          </Cube>
        </Body>
      </DataSet>`);

      localStorage.setItem('2023-05-20', `<?xml version="1.0" encoding="utf-8"?>
      <DataSet xmlns="http://www.bnr.ro/xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.bnr.ro/xsd nbrfxrates.xsd">
        <Header>
          <Publisher>National Bank of Romania</Publisher>
          <PublishingDate>2023-05-18</PublishingDate>
          <MessageType>DR</MessageType>
        </Header>
        <Body>
          <Subject>Reference rates</Subject>
          <OrigCurrency>RON</OrigCurrency>
          <Cube date="2023-05-18">
            <Rate currency="AED">1.12521</Rate>
            <Rate currency="AUD">3.0134515</Rate>
            <Rate currency="BGN">2.535427</Rate>
            <Rate currency="BRL">0.9123208</Rate>
            <Rate currency="CAD">3.3443124</Rate>
            <Rate currency="CHF">5.1061</Rate>
            <Rate currency="CNY">1.61539</Rate>
            <Rate currency="CZK">2.213098</Rate>
            <Rate currency="DKK">5.6677</Rate>
            <Rate currency="EGP">4.14688</Rate>
            <Rate currency="EUR">1.97131</Rate>
            <Rate currency="GBP">5.753169</Rate>
            <Rate currency="HUF" multiplier="100">1.3335</Rate>
            <Rate currency="INR">1.0557</Rate>
            <Rate currency="JPY" multiplier="100">3.3370</Rate>
            <Rate currency="KRW" multiplier="100">0.3442</Rate>
            <Rate currency="MDL">1.25389</Rate>
            <Rate currency="MXN">4.22598</Rate>
            <Rate currency="NOK">2.454238</Rate>
            <Rate currency="NZD">2.86397</Rate>
            <Rate currency="PLN">1.0958</Rate>
            <Rate currency="RSD">2.014424</Rate>
            <Rate currency="RUB">3.0575</Rate>
            <Rate currency="SEK">5.43482</Rate>
            <Rate currency="THB">1.13238</Rate>
            <Rate currency="TRY">4.2326</Rate>
            <Rate currency="UAH">2.1245</Rate>
            <Rate currency="USD">1.5975</Rate>
            <Rate currency="XAU">192.2952</Rate>
            <Rate currency="XDR">1.14659</Rate>
            <Rate currency="ZAR">2.2371</Rate>
          </Cube>
        </Body>
      </DataSet>`);

      localStorage.setItem('dates', JSON.stringify(['2023-05-17', '2023-05-18', '2023-05-19', '2023-05-20']));

      location.reload();
    }


    return {
      getApiData,
      api_data,
      current_data,
      full_xml,
      getCurrentData,
      searchData,
      search,
      addFakeData,
    }
  },
  mounted() {
    this.getCurrentData();
    this.getApiData(); 
  },
}
</script>


<style>
.page_info{
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}
.page_text{
  font-size: 1.5rem;
}
.page_select_btns{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.page{
  max-width: 120rem;
  margin: 2rem auto;
  padding: 0 1rem;
}
.page_title{
  font-size: 4rem;
  text-align: center;
  margin: 2rem 0;
  color: #41B883;
  font-weight: bold;
  border-bottom: 1px solid rgba(0,0,0,.2);
  padding-bottom: 2rem;
}
.page_currencies{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

}
.page_currencies_item{
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0,0,0,.2);
  border-radius: 5px;
  font-size: 1.5rem;
}
.page_currencies_title{
  grid-column: 1/-1;
  font-size: 2rem;
}
.page_select{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 3rem 0;
  gap: 1rem;
  border-top: 1px solid rgba(0,0,0,.2);
  border-bottom: 1px solid rgba(0,0,0,.2);
  padding: 2rem 0;
}
.page_select_title{
  font-size: 2rem;
}
.page_preference{
  width: 30rem;
  height: 10rem;
}
.page_preference option{
  font-size: 1.5rem;
  font-family: inherit;
}
.page_save{
  width: max-content;
  padding: 1rem 2rem;
  border-radius: 5px;
  background-color: #41B883;
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all .2s ease-in-out;
}
.page_save:hover{
  background-color: #32a672;
}
.page_currencies_search{
  width: 100%;
  grid-column: 1/-1;
}
.page_currencies_search input{
  width: 100%;
  padding: 1rem;
  font-size: 1.5rem;
  font-family: inherit;
  border-radius: 5px;
  border: 1px solid rgba(0,0,0,.2);
  margin-bottom: 2rem;
}

.page_none{
  text-align: center;
  font-size: 2rem;
  margin: 2rem 0;
  font-weight: bold;
}
</style>
