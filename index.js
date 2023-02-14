//Api de rick y morty
//https://rickandmortyapi.com/
const { createApp } = Vue

createApp({
  data() {
    return {
      successfullLogin:false,
      username:'',
      password:'',
      data:[],
      countries:[], 
      gender:'',
      amount:'',
      filter:'',
      genderButton:'',
      amountButton:''
    }
  },
  methods:{
    login(){
      
      const user=this.data.find(user=>user.login.username===this.username && user.login.password===this.password)
      if(!user){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El usuario o contraseña ingresados son incorrectos',
        })
        return
      }
      //TODO: Quitar de la data el usuario encontrado, luego actualizar el Storage.
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Ingreso Exitoso',
        showConfirmButton: false,
        timer: 1500
      })
      this.successfullLogin=true
      //Esto es para mantener el login en caso de recargar la página.
      localStorage.setItem("successfullLogin",this.successfullLogin)
      //Esto es para que mi usuario logeado no se vea en la tabla.
      let dataFilter=this.data.filter(el=>el.login.password!==user.login.password && el.login.username!==user.login.username)
      this.data=dataFilter
      localStorage.setItem("users",JSON.stringify(this.data))
    },
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
    },
    getGender(gender){
      return (gender==='male')?'Masculino':'Femenino'
    },
    filterByGender(gender){
      
      this.data=JSON.parse(localStorage.getItem("users"))
      let dataFilter=this.data.filter(user=>user.gender===gender)
      this.data=dataFilter
    },
    validateNumber(number){
      if(number>=0){
        return true
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Recuerde Ingresar números positivos para filtrar',
        })
        return false
      }
    },
    filterByAmount(amount){
      const successfullValidation=this.validateNumber(amount)
      if(!successfullValidation) return
      this.data=JSON.parse(localStorage.getItem("users"))
      let dataFilter=this.data.slice(0,amount)
      this.data=dataFilter
      
      

      
    },
    filterBoth(){
      //Primero valido y veo si el dato está bien.
      const successfullValidation=this.validateNumber(this.amountButton)
      if(!successfullValidation) return
      this.data=JSON.parse(localStorage.getItem("users"))
      let dataFilter=this.data.filter(user=>user.gender===this.genderButton).slice(0,this.amountButton)
      this.data=dataFilter
    }
  
  },
  //Este está pendiente ante cualquier cambio en nustras variables.
  watch:{
    gender(newGender,oldGender){
      if(newGender==='1'){
        this.filterByGender("male")
      }else{
        this.filterByGender("female")
      }
    },
    amount(newAmount,oldAmount){
      this.filterByAmount(newAmount)
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
    //Para que el usuario no deba estarse logeando.
    if(localStorage.getItem("successfullLogin")!==null){
      this.successfullLogin=true
    }
    //Saco por consola algunos usuarios para poderme logear
    console.log("NombreUsuario - Password - Nombre ")
    console.log(this.data[0].login.username,this.data[0].login.password,this.data[0].name.first)
    console.log(this.data[1].login.username,this.data[1].login.password,this.data[1].name.first)
    console.log(this.data[2].login.username,this.data[2].login.password,this.data[2].name.first)
    
  }


}).mount('#app')