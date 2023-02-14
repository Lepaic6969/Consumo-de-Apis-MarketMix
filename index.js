const { createApp } = Vue

createApp({
  data() {
    return {
      data:[],
      countries:[], 
    }
  },
  methods:{
    async getUsers(){
        const data= await fetch('https://randomuser.me/api/?results=20')
        const {results}=await data.json()
        this.data=results
        localStorage.setItem("users",JSON.stringify(this.data))
    },
    async getCountries(){
      this.countries=await fetch('https://restcountries.com/v3.1/all').then(data=>data.json())
      localStorage.setItem("countries",JSON.stringify(this.countries))
    },
    findFlag(name){
      return this.countries.find(country=>country.name.common===name)?.flags.png
    }
  
  },
 
  created(){
  
    if(JSON.parse(localStorage.getItem("users"))){
      this.data=JSON.parse(localStorage.getItem("users"))
    }else{
      this.getUsers()
    }

    if(JSON.parse(localStorage.getItem("countries"))){
      this.countries=JSON.parse(localStorage.getItem("countries"))
    }else{
      this.getCountries()
    }
   
  }


}).mount('#app')