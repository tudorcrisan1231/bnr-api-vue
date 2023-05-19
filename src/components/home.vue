<template>

  <div class="page">
    <div class="page_title">
      Welcome to my BNR currency app!
    </div>

    <div>
      <ChartData/>
    </div>

    <div class="page_currencies">
      <div class="page_currencies_title" v-if="this.api_data.cube">National Bank of Romania ({{ this.api_data.cube.attributes.date.value }} data): </div>
      <div class="page_currencies_search">
        <input type="text" id="search" placeholder="Search currency">
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
    async function getApiData() {
   
   
      //in caz ca nu exista in localstorage se face request la api si se salveaza in localstorage, altfel se ia din localstorage
      if(localStorage.getItem(current_data) == null){
      
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


    return {
      getApiData,
      api_data,
      current_data,
      full_xml,
      getCurrentData,
    }
  },
  mounted() {
    this.getCurrentData();
    this.getApiData(); 
  },
}
</script>


<style>
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
