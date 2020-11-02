<template>
    <div id="app">
        {{msg}}
        <vue-test-child>
            <span slot="header">
                {{name}}
            </span>
        </vue-test-child>
        
        <vuecalendar 
        :renderTemplate="renderDateData" 
        :month="calendar.month" 
        :year="calendar.year"
        >
        
        </vuecalendar>

    </div>
</template>
<script>
import vuecalendar from './vue-airbnb-admin-calendar';
import vuetestchild from './vue-test-child';
export default{
    components:{
        'vue-test-child':vuetestchild,
        vuecalendar
    },
    data:function(){
        return {
            msg:'vue airbnb admin calendar',
            calendar:{
                month: 10,
                year: 2020
            }
        };
    },
    methods:{
        renderDateData:function(day){
            console.log(day);
            return '['+day+']';
        }
    }
}
</script>
<style scoped>
body{
    margin:0;
    padding:0;
}
</style>