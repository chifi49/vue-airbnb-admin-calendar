<template>
    <div class="" style="position:relative;">
        <div class=" month-year" v-show="monthyear_header_visible">
            <div class="" @click="previous_year" :style="{'visibility':navprevious_year_visible?'visible':'hidden','display':'inline-block','box-sizing':'border-box','width':'10%','text-align':'center','cursor':'pointer'}">
                <span slot="previous_year"><span style="transform:rotate(180deg);display:inline-block;">&#9656;&#9656;</span></span>
            </div>
            <div class="" @click="previous_month" :style="{'visibility':navprevious_month_visible?'visible':'hidden','display':'inline-block','box-sizing':'border-box','width':'10%','text-align':'center','cursor':'pointer'}">
                <span slot="previous_month">&#9664;</span>
            </div>
            <div class="" :style="{'visibility':monthyear_visible?'visible':'hidden','display':'inline-block','box-sizing':'border-box','width':month_year_width,'text-align':'center'}">
                <template v-if="month_dropdown" >
                    <select v-on:change="monthDropdown_changed">
                        <option :value="option.index" v-for="option in monthDropdown" v-bind:key="option.key" :selected="option.selected">
                            {{option.name}}
                        </option>
                    </select>
                </template>
                <template v-if="!month_dropdown">{{monthNames[month_selected]}}</template>
                 / 
                 <template v-if="year_dropdown">
                     <select v-on:change="yearDropdown_changed">
                         <option :value="option.index" v-for="option in yearDropdown" v-bind:key="option.key" :selected="option.selected">
                             {{option.name}}
                            </option>
                        </select>
                </template>
                <template v-if="!year_dropdown">{{year_selected}}</template>
            </div>
            <div class="" @click="next_month" :style="{'visibility':navnext_month_visible?'visible':'hidden','display':'inline-block','box-sizing':'border-box','width':'10%','text-align':'center','cursor':'pointer'}">
                <span slot="next_month">&#9654;</span>
            </div>
            <div class="" @click="next_year" :style="{'visibility':navnext_year_visible?'visible':'hidden','display':'inline-block','box-sizing':'border-box','width':'10%','text-align':'center','cursor':'pointer'}">
                <span slot="next_year">&#9656;&#9656;</span>
            </div>
        </div>
        <div class="daynames" >
            <div v-for="(dayname,index) in dayShortNames" v-bind:key="'dayname-'+index" :style="{'display':'inline-block','width':'14.28%','text-align':dayNameCellAlign,'border-style':'solid','border-width':'1px','border-color':dayNameCellBorderColor,'box-sizing':'border-box'}">
                {{dayname}}
            </div>
        </div>
        <div class=" days display-table" style="display:flex;flex-wrap:wrap;" v-bind:key="'days-view-'+days_view_counter">
            <div :data-selected="isSelected(day)?1:0" @mouseover="cell_hover($event,day)" @mouseleave="cell_leave($event,day)" :style="{'background-color':isSelected(day)?selected_cell_bg:'','color':isSelected(day)?selected_cell_fg:'', 'width':'14.28%','display':'inline-block'}" :class="{'display-table-cell':true}" v-bind:key="'dayday'+index" v-for="(day,index) in days" @click="cell_clicked($event,day)" :data-day="day">
                <template v-if="day>0?true:false">
                    <span class="daynumber" :style="{'text-align':daynumber_position,'width':'100%','position':'relative','display':'inline-block'}">
                        <span :style="{backgroundColor:is_today(day)?todayNameNumberBackgroundColor:dayNameNumberBackgroundColor,color:is_today(day)?todayNameNumberColor:dayNameNumberColor,padding:dayNameNumberPadding,'border-radius':dayNameNumberRadius,'font-size':dayNameNumberFontSize,'display':'inline-block','width':dayNameNumberSize,'height':dayNameNumberSize,'text-align':'center','vertical-align':'middle','line-height':dayNameNumberSize}">{{day}}</span>
                    </span>
                    
                        <div v-html="renderTemplate(day)"></div>
                        
                </template>
                <template v-if="day==0?true:false">
                        <span :style="{'text-align':daynumber_position,'width':'100%','position':'relative','display':'inline-block','visibility':'hidden'}">
                            <span>{{day}}</span>
                        </span>
                </template>
            </div>
        </div>
        <div  v-show="loading" style="position:absolute;top:0px;left:0px;width:100%;bottom:0px;vertical-align:middle;text-align:center;background-color:rgb(255,255,255,0.5);">
            <div style="position:relative;top:45%;margin:0 auto;font-size:32px;">
                <div slot="loader" ref="spinner" style="display:inline-block;">&#8635;</div>
            </div>
        </div>
    </div>
</template>
<script>

export default{
    name:'vue-airbnb-admin-calendar',
    props:{
        renderTemplate:{
            required:false,
            type:Function,
            default:function(){
                return '';
            }
        },
        loading:{
            required:false,
            type:Boolean,
            default:true
        },
        loader_bg:{
            required:false,
            type:String,
            default:'#f1f1f1'
        },
        navprevious_year_visible:{
            required:false,
            type:Boolean,
            default:true
        },
        navprevious_month_visible:{
            required:false,
            type:Boolean,
            default:true
        },
        navnext_month_visible:{
            required:false,
            type:Boolean,
            default:true
        },
        navnext_year_visible:{
            required:false,
            type:Boolean,
            default:true
        },
        monthyear_visible:{
            required:false,
            type:Boolean,
            default:true
        },
        month_dropdown:{
            required:false,
            type:Boolean,
            default:true
        },
        year_dropdown:{
            required:false,
            type:Boolean,
            default:true
        },
        monthyear_header_visible:{
            required:false,
            type:Boolean,
            default: true
        },
        daynumber_position:{
            required:false,
            type:String,
            default:'right'
        },
        selection:{
            required:false,
            type:String,
            default:'range'
        },
        selected_cell_bg:{
            required:false,
            type:String,
            default: '#1e90ff'
        },
        selected_cell_fg:{
            required:false,
            type:String,
            default:'#ffffff'
        },
        hover_cell_bg:{
            required:false,
            type:String,
            default:'#f1f1f1'
        },
        hover_cell_fg:{
            required:false,
            type:String,
            default:''
        },
        dayNameCellAlign:{
            required:false,
            type:String,
            default:function(){
                return 'center';
            }
        },
        dayNameCellBorderColor:{
            required:false,
            type:String,
            default:function(){
                return 'transparent';
            }
        },
        todayNameNumberBackgroundColor:{
            required:false,
            type:String,
            default:'#000'
        },
        todayNameNumberColor:{
            required:false,
            type:String,
            default:'#fff'
        },
        dayNameNumberBackgroundColor:{
            required:false,
            type:String,
            default:'#000'
        },
        dayNameNumberColor:{
            required:false,
            type:String,
            default:'#fff'
        },
        dayNameNumberRadius:{
            required:false,
            type:String,
            default:'50%'
        },
        dayNameNumberPadding:{
            required:false,
            type:String,
            default:'5px 5px'
        },
        dayNameNumberWidth:{
            required:false,
            type:String,
            default:'auto'
        },
        dayNameNumberHeight:{
            required:false,
            type:String,
            default:'auto'
        },
        dayNameNumberSize:{
            required:false,
            type:String,
            default:'18px'
        },
        dayNameNumberFontSize:{
            required:false,
            type:String,
            default:'12px'
        },
        dayCellBorderColor:{
            required:false,
            type:String,
            default:function(){
                return '#afafaf'
            }
        },
        dataContainer:{
            required:false,
            type:Array,
            default:function(){
                return [];
            }
        },
        monthNames:{
            required:false,
            type:Array,
            default:function(){
                return ["January","February","March","April","May","June","July","August","September","October","November","December"]
            }
        },
        monthShortNames:{
            required:false,
            type:Array,
            default:function(){
                return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
            }
        },
        dayNames:{
            required:false,
            type:Array,
            default:function(){
                return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
            }
        },
        dayShortNames:{
            required:false,
            type:Array,
            default:function(){
               return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
            }
        },
        month:{
            required:true,
            type:Number,
            default:function(){
                var d = new Date();
                return d.getMonth();
            }
        },
        year:{
            required:true,
            type:Number,
            default:function(){
                var d = new Date();
                return d.getFullYear();
            }
        }
    },
    data:function(){
        return {
            days_view_counter:0,
            cell_day_first_selected: -1,
            cell_day_last_selected: -1,
            loading_interval:0,
            month_selected: this.month,
            year_selected: this.year
        };
    },
    watch:{
        dataContainer:function(){
            
        },
        year:function(){
            
            this.cell_day_first_selected = -1;
            this.cell_day_last_selected = -1;
        },
        month:function(){
            
            this.cell_day_first_selected = -1;
            this.cell_day_last_selected = -1;
        },
        loading:function(newval,oldval){
            if(newval){
                //start spinning
                this.start_loader();
                //this.$emit('start_loader',{})
            }else{
                this.stop_loader();
                //this.$emit('',{})
            }
            console.log(newval,oldval);
        }
    },
    computed:{
        month_year_width:function(){
            var total = 0;
            if(this.navprevious_year_visible){total+=10;}
            if(this.navprevious_month_visible){total+=10;}
            if(this.navnext_year_visible){total+=10;}
            if(this.navnext_month_visible){total+=10;}
            return 100-total+'%';
        },
        yearDropdown: function(){
            var options = [];
            var currentYear = (new Date()).getFullYear();
            var start = currentYear - 100;
            var end = currentYear+50;
            for(var i=start;i<=end;i++){
                options.push({
                    key:'yeardropdown-name-'+i,
                    name: i,
                    index: i,
                    selected: i==this.year_selected?true:false
                })
            }
            return options;
        },
        monthDropdown:function(){
            var options = [];
            for(var i=0;i<=11;i++){
                options.push({
                    key: 'monthdropdown-name-'+i,
                    name: this.monthNames[i],
                    index: i,
                    selected: i==this.month_selected?true:false
                })
            }
            return options;
        },
        totalDaysOfMonth:function(){
            return new Date(this.year_selected, this.month_selected+1, 0).getDate()
        },
        days_selected:function(){
            var selected_ar = [];
            var month_days = this.totalDaysOfMonth;
            for(var i=0;i<month_days;i++){
                var counter = i+1;
                var selected = 0;
                if(this.cell_day_last_selected>-1){
                    if(counter>=this.cell_day_first_selected && counter<=this.cell_day_last_selected){
                        selected_ar.push(selected);
                    }
                }else{
                    if(counter==this.cell_day_first_selected){
                        selected = 1;
                    }
                }
                selected_ar.push(selected);
            }
            
            return selected_ar;
        },
        days:function(){
            //fix the array here 
            //get the first day of the month what day it is
            var day = new Date(this.year_selected, this.month_selected, 1).getDay();
            
            var diff = day - 0;
            var days_ar = [];
            for(var ii=0;ii<diff;ii++){
                days_ar.push(0);
            }
            var month_days = this.totalDaysOfMonth;
            for(var i=0;i<month_days;i++){
                days_ar.push(i+1);
            }
            var last_day = new Date(this.year_selected, this.month_selected, month_days).getDay();
            
            var last_diff = 6 - last_day;
            for(var iii=0;iii<last_diff;iii++){
                days_ar.push(0);
            }
            return days_ar;
        }                    
    },
    
    methods:{
        update_view:function(){
            this.days_view_counter++;
        },
        start_loader:function(){
            var radius = 0;
            if(this.$refs['spinner']!=null){
                this.loading_interval = setInterval(()=>{
                    this.$refs['spinner'].style.transform = 'rotate('+radius+'deg)';
                    radius+=10;
                    if(radius>360){
                        radius= 0;
                    }
                },24)
                this.$emit('loaderStarted')
            }

        },
        stop_loader:function(){
            if(this.$refs['spinner']!=null){
                clearInterval(this.loading_interval);
                this.$refs['spinner'].style.transform = 'rotate(0deg)'
                this.$emit('loaderEnded');
            }
        },
        get_month:function(){
            return this.month_selected;
        },
        set_month:function(month){
            if(month>=0 && month<=11){
                this.month_selected = month;
                this.$emit('monthChanged',{instance:this,month:this.month_selected});
                this.$emit('dateChanged',{instance:this,month:this.month_selected,year:this.year_selected});
            }
        },
        monthDropdown_changed:function(){
            var pmonth = this.month_selected;
            this.month_selected = event.currentTarget.value;
            this.$emit('monthChanged',{instance:this,month:this.month_selected,pmonth:pmonth})
            
            this.$emit('dateChanged',{instance:this,month:this.month_selected,year:this.year_selected})
        },
        get_year:function(){
            return this.year_selected;
        },
        set_year:function(year){
            this.year_selected = year;
            this.$emit('yearChanged',{instance:this,year:this.year_selected});
            this.$emit('dateChanged',{instance:this,month:this.month_selected,year:this.year_selected})
        },
        yearDropdown_changed:function(){
            var pyear = this.year_selected;
            this.year_selected = event.currentTarget.value;
            this.$emit('yearChanged',{instance:this,year:this.year_selected,pyear:pyear})
            
            this.$emit('dateChanged',{instance:this,year:this.year_selected,month:this.month_selected});
        },
        previous_year:function(){
            var cmonth = this.month_selected;
            var cyear = this.year_selected;
            var date= new Date();
            date.setFullYear(cyear, cmonth, 1);
            date.setFullYear(date.getFullYear()-1,date.getMonth(),1);
            this.month_selected = date.getMonth();
            this.year_selected = date.getFullYear();
            this.$emit('previousYear',{instance:this, month: this.month_selected, year: this.year_selected, pmonth: cmonth, pyear: cyear})
            this.$emit('dateChanged',{instance:this,month:this.month_selected,year:this.year_selected})
        },
        previous_month:function(){
            var cmonth = this.month_selected;
            var cyear = this.year_selected;
            var date= new Date();
            date.setFullYear(cyear, cmonth, 1);
            date.setFullYear(date.getFullYear(),date.getMonth()-1,1);
            this.month_selected = date.getMonth();
            this.year_selected = date.getFullYear();
            this.$emit('previousMonth',{instance:this, month: this.month_selected, year: this.year_selected, pmonth: cmonth, pyear: cyear})
            this.$emit('dateChanged',{instance:this,month:this.month_selected,year:this.year_selected})
        },
        next_month:function(){
            var cmonth = this.month_selected;
            var cyear = this.year_selected;
            var date= new Date();
            date.setFullYear(cyear, cmonth, 1);
            date.setFullYear(date.getFullYear(),date.getMonth()+1,1);
            this.month_selected = date.getMonth();
            this.year_selected = date.getFullYear();
            this.$emit('nextMonth',{instance:this, month: this.month_selected, year: this.year_selected, pmonth: cmonth, pyear: cyear})
            this.$emit('dateChanged',{instance:this,month:this.month_selected,year:this.year_selected})
        },
        next_year:function(){
            var cmonth = this.month_selected;
            var cyear = this.year_selected;
            var date= new Date();
            date.setFullYear(cyear, cmonth, 1);
            date.setFullYear(date.getFullYear()+1,date.getMonth(),1);
            this.month_selected = date.getMonth();
            this.year_selected = date.getFullYear();
            this.$emit('nextYear',{instance:this, month: this.month_selected, year: this.year_selected, pmonth: cmonth, pyear: cyear})
            this.$emit('dateChanged',{instance:this,month:this.month_selected,year:this.year_selected})
        },
        cell_hover:function(event,day){
            if(day==0){
                return;
            }
            var t = event.currentTarget;
            if(parseInt(t.getAttribute('data-selected'))==0){
                t.style.backgroundColor = this.hover_cell_bg;
                t.style.color = this.hover_cell_fg;
            }
        },
        cell_leave:function(event,day){
            if(day==0){
                return;
            }
            var t = event.currentTarget;
            if(parseInt(t.getAttribute('data-selected'))==0){
                t.style.backgroundColor = '';//this.hover_cell_bg;
                t.style.color = '';//this.hover_cell_fg;
            }
        },
        day_exists:function(day){
            if(typeof this.dataContainer[day]!=='undefined'){
                return true;
            }
            return false;
        },
        is_today:function(day){
            var today = this.get_today();
            return day==today.date && this.month_selected==today.month && this.year_selected==today.year?true:false;
        },
        get_today:function(){
            var d = new Date();
            return {
                date: d.getDate(),
                month: d.getMonth(),
                year: d.getFullYear()
            };
        },
        isSelected:function(day){
            if(day>0){
                if(this.cell_day_last_selected>-1){
                    if(day>=this.cell_day_first_selected && day<=this.cell_day_last_selected){
                        return true;
                    }
                }else{
                    if(day==this.cell_day_first_selected){
                        return true;
                    }
                }
            }
            return false;
        },
        cell_clicked:function(event,dayindex){
            if(dayindex==0){
                return;
            }
            if(this.selection=='none'){
                return;
            }
            var t = event.currentTarget;
            var day = parseInt(t.getAttribute('data-day'));
            if(day>0){
                

                if((event.ctrlKey || event.metaKey) && day==this.cell_day_first_selected ){
                    this.cell_day_first_selected = -1;
                    this.cell_day_last_selected = -1;
                    return;
                }
                //if we have already selected the last date, then reset and start from the beginning
                if(this.cell_day_last_selected > -1){
                    //reset
                    this.cell_day_first_selected = -1;
                    this.cell_day_last_selected = -1;
                 
                }

                //if we have already selected one time then we move to the last date
                if(this.cell_day_first_selected > -1 && this.selection=='range'){
                    //but if the day is less than first day selected do not make range, select again first day selected
                    if(day<this.cell_day_first_selected){
                        
                        this.cell_day_first_selected = day;
                    }else{
                        
                        this.cell_day_last_selected = day;
                    }
                }else{
                    
                    this.cell_day_first_selected = day;
                }
                console.log(this.cell_day_first_selected, this.cell_day_last_selected)
                this.$emit('dayClicked',{
                    instance:this,
                    month: this.month,//zero based
                    year: this.year_selected,
                    day: day
                })
                if(this.cell_day_first_selected>-1 && this.cell_day_last_selected>-1 && this.selection=='range'){
                    this.$emit('rangeSelected',{
                        instance:this,
                        month: this.month_selected,
                        year: this.year_selected,
                        from: this.cell_day_first_selected,
                        to: this.cell_day_last_selected
                    })
                }
            }
        },
        clearSelection:function(){
            var first_selected = this.cell_day_first_selected;
            var last_selected = this.cell_day_last_selected;
            this.cell_day_first_selected = -1;
            this.cell_day_last_selected = -1;
            this.$emit('selectionReset',{from: first_selected, to: last_selected, month: this.month_selected, year: this.year_selected});
        },
        getDaysOfPreviousMonth:function(){
            return new Date(this.year_selected, this.month_selected-1,0).getDate();
        }
    },
    mounted:function(){
        this.$emit('mounted')
    },
    created:function(){
        this.$emit('created')
    }
}
</script>
<style scoped>
.display-table{
        border: 1px solid #afafaf;
    border-width: 1px 0px 0px 1px;
}
.display-table-cell{
    border: 1px solid #afafaf;
    border-width: 0px 1px 1px 0px;
    padding: 10px;
    cursor: pointer;
    box-sizing: border-box;
}
</style>