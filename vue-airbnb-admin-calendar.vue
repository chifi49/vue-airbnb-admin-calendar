<template>
    <div class="vaac-calendar"  style="position:relative;">
        <div class="vaac-month-year-header" v-show="monthyear_header_visible">
            <div 
            v-if="nav_year_visible" 
            tabindex="1" 
            @keyup.enter="previous_year" 
            @click="previous_year" 
            :class="{'nav-disabled':!can_nav_previous_year,'vaac-previousyear':true}" 
            :style="{'display':'inline-block','box-sizing':'border-box','width':'10%','text-align':'center','cursor':'pointer'}">
                <span slot="previous_year"><span style="transform:rotate(180deg);display:inline-block;">&#9656;&#9656;</span></span>
            </div>

            <div 
            tabindex="2" 
            v-show="nav_month_visible" 
            @keyup.enter="previous_month" 
            @click="previous_month" 
            :class="{'nav-disabled':!can_nav_previous_month,'vaac-previousmonth':true}" 
            :style="{'display':'inline-block','box-sizing':'border-box','width':'10%','text-align':'center','cursor':'pointer'}">
                <span slot="previous_month">&#9664;</span>
            </div>

            <div class="" :style="{'visibility':monthyear_visible?'visible':'hidden','display':'inline-block','box-sizing':'border-box','width':month_year_width,'text-align':'center'}">
                <template v-if="month_dropdown" >
                    <select tabindex="3" v-on:change="monthDropdown_changed" class="vaac-month-dropdown">
                        <option :value="option.index" v-for="option in monthDropdown" v-bind:key="option.key" :selected="option.selected">
                            {{option.name}}
                        </option>
                    </select>
                </template>
                <template v-if="!month_dropdown">{{month_names[month_selected]}}</template>
                 / 
                 <template v-if="year_dropdown">
                     <select tabindex="4" v-on:change="yearDropdown_changed" class="vaac-year-dropdown">
                         <option :value="option.index" v-for="option in yearDropdown" v-bind:key="option.key" :selected="option.selected">
                             {{option.name}}
                            </option>
                        </select>
                </template>
                <template v-if="!year_dropdown">{{year_selected}}</template>
            </div>
            <div tabindex="5" 
            :class="{'nav-disabled':!can_nav_next_month,'vaac-nextmonth':true}" 
            @keyup.enter="next_month" @click="next_month" v-show="nav_month_visible" :style="{'display':'inline-block','box-sizing':'border-box','width':'10%','text-align':'center','cursor':'pointer'}">
                <span slot="next_month">&#9654;</span>
            </div>
            <div tabindex="6" 
            :class="{'nav-disabled':!can_nav_next_year,'vaac-nextyear':true}" 
            @keyup.enter="next_year" @click="next_year" v-show="nav_year_visible" :style="{'display':'inline-block','box-sizing':'border-box','width':'10%','text-align':'center','cursor':'pointer'}">
                <span slot="next_year">&#9656;&#9656;</span>
            </div>
        </div>
        <div class="vaac-dayname-header" >
            <div v-for="(dayname,index) in day_short_names" 
            v-bind:key="'dayname-'+index" 
            :style="{'display':'inline-block','width':'14.28%','text-align':day_name_cell_align,'border-style':'solid','border-width':'1px','border-color':day_name_cell_border_color,'box-sizing':'border-box'}"
            :class="{'vaac-dayname':true}">
                {{dayname}}
            </div>
        </div>
        <div class=" days display-table vaac-daynumber-container" 
        style="display:flex;flex-wrap:wrap;" 
        v-bind:key="'daynumber-container-'+days_view_counter">
        <!-- to daynumber-container-'+days_view_counter we need when we need to re render the calendar because we have loaded data and the only way for callback renderTemplate to be called again is to update the v-bind:key -->

            <template v-if="show_other_month_days">

                <div v-for="(day,index) in previous_days"
                v-bind:key="'previousdaynumber-'+index" :tabindex="tab_index+1"
                
                :style="{'background-color':isSelected(day)?selected_cell_bg:'','color':isSelected(day)?selected_cell_fg:'', 'width':'14.28%','display':'inline-block'}" 
                :class="{'display-table-cell':true,'vaac-daynumber-cell':true,'vaac-daynumber-previous-cell':true}" 
                >
                    <span class="daynumber" :style="{'text-align':daynumber_position,'width':'100%','position':'relative','display':'inline-block'}">
                        <span :style="{backgroundColor:is_today(day,previousMonth,previousYear)?today_name_number_background_color:other_month_day_background_color,color:is_today(day,previousMonth,previousYear)?today_name_number_color:other_month_day_color,padding:day_name_number_padding,'border-radius':day_name_number_radius,'font-size':day_name_number_font_size,'display':'inline-block','width':day_name_number_size,'height':day_name_number_size,'text-align':'center','vertical-align':'middle','line-height':day_name_number_size}">{{day}}</span>
                    </span>
                    
                        <div v-html="renderTemplate(day,month_selected,year_selected)"></div>
                        

                </div>
            </template>

            <div 
            v-for="(day,index) in days" 
            v-bind:key="'dayday'+index" 
            :data-selected="isSelected(day)?1:0" 
            @mouseover="cell_hover($event,day)" 
            @mouseleave="cell_leave($event,day)"
            @click="cell_clicked($event,day)"

            :tabindex="tab_index+1"

            @keyup.enter="cell_clicked($event,day)"

            :style="{'background-color':isSelected(day)?selected_cell_bg:'','color':isSelected(day)?selected_cell_fg:'', 'width':'14.28%','display':'inline-block'}" 
            :class="{'display-table-cell':true,'vaac-daynumber-cell':true,'vaac-daynumber-current-cell':true}" 
            
             :data-day="day">

                <template v-if="day>0?true:false">
                    <span class="daynumber" :style="{'text-align':daynumber_position,'width':'100%','position':'relative','display':'inline-block'}">
                        <span :style="{backgroundColor:is_today(day,month_selected,year_selected)?today_name_number_background_color:day_name_number_background_color,color:is_today(day,month_selected,year_selected)?today_name_number_color:day_name_number_color,padding:day_name_number_padding,'border-radius':day_name_number_radius,'font-size':day_name_number_font_size,'display':'inline-block','width':day_name_number_size,'height':day_name_number_size,'text-align':'center','vertical-align':'middle','line-height':day_name_number_size}">{{day}}</span>
                    </span>
                    
                        <div v-html="renderTemplate(day,month_selected,year_selected)"></div>
                        
                </template>
                <template v-if="day==0?true:false">
                        <span :style="{'text-align':daynumber_position,'width':'100%','position':'relative','display':'inline-block','visibility':'hidden'}">
                            <span>{{day}}</span>
                        </span>
                </template>
            </div>

            <template v-if="show_other_month_days">
                <div v-for="(day,index) in next_days"
                v-bind:key="'nextday'+index"
                
                :tabindex="tab_index+1"

                :style="{'background-color':isSelected(day)?selected_cell_bg:'','color':isSelected(day)?selected_cell_fg:'', 'width':'14.28%','display':'inline-block'}" 
            :class="{'display-table-cell':true,'vaac-daynumber-cell':true,'vaac-daynumber-next-cell':true}" 
                >
                    <span class="daynumber" :style="{'text-align':daynumber_position,'width':'100%','position':'relative','display':'inline-block'}">
                        <span :style="{backgroundColor:is_today(day,nextMonth,nextYear)?today_name_number_background_color:other_month_day_background_color,color:is_today(day,nextMonth,nextYear)?today_name_number_color:other_month_day_color,padding:day_name_number_padding,'border-radius':day_name_number_radius,'font-size':day_name_number_font_size,'display':'inline-block','width':day_name_number_size,'height':day_name_number_size,'text-align':'center','vertical-align':'middle','line-height':day_name_number_size}">{{day}}</span>
                    </span>
                    
                        <div v-html="renderTemplate(day,month_selected,year_selected)"></div>
                        

                </div>
            </template>

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
        min_date:{
            required:false,
            type:Date,
            default:function(){
                var d = new Date();
                d.setFullYear(d.getFullYear()-75,d.getMonth(),1)
                return d;
            }
        },
        max_date:{
            required:false,
            type:Date,
            default:function(){
                var d = new Date();
                d.setFullYear(d.getFullYear()+75,d.getMonth(),1)
                return d;
            }
        },
        show_other_month_days:{
            required:false,
            type:Boolean,
            default:false
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
        nav_year_visible:{
            required:false,
            type:Boolean,
            default:true
        },
        
        nav_month_visible:{
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
        day_name_cell_align:{
            required:false,
            type:String,
            default:function(){
                return 'center';
            }
        },
        day_name_cell_border_color:{
            required:false,
            type:String,
            default:function(){
                return 'transparent';
            }
        },
        other_month_day_background_color:{
            required:false,
            type:String,
            default:'#efefef'
        },
        other_month_day_color:{
            required:false,
            type:String,
            default:'#000'
        },
        today_name_number_background_color:{
            required:false,
            type:String,
            default:'#888'
        },
        today_name_number_color:{
            required:false,
            type:String,
            default:'#fff'
        },
        day_name_number_background_color:{
            required:false,
            type:String,
            default:'#000'
        },
        day_name_number_color:{
            required:false,
            type:String,
            default:'#fff'
        },
        day_name_number_radius:{
            required:false,
            type:String,
            default:'50%'
        },
        day_name_number_padding:{
            required:false,
            type:String,
            default:'5px 5px'
        },
        day_name_number_width:{
            required:false,
            type:String,
            default:'auto'
        },
        day_name_number_height:{
            required:false,
            type:String,
            default:'auto'
        },
        day_name_number_size:{
            required:false,
            type:String,
            default:'18px'
        },
        day_name_number_font_size:{
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
        month_names:{
            required:false,
            type:Array,
            default:function(){
                return ["January","February","March","April","May","June","July","August","September","October","November","December"]
            }
        },
        month_short_names:{
            required:false,
            type:Array,
            default:function(){
                return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
            }
        },
        day_names:{
            required:false,
            type:Array,
            default:function(){
                return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
            }
        },
        day_short_names:{
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
            year_selected: this.year,
            tab_index:6
        };
    },
    watch:{
        dataContainer:function(){
            
        },
        year_selected:function(){
            
            this.cell_day_first_selected = -1;
            this.cell_day_last_selected = -1;
        },
        month_selected:function(){
            
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
        /**
        showOtherMonthDays:function(){
            return this.show_other_month_days;
        },
        **/
        month_year_width:function(){
            var total = 0;
            if(this.nav_year_visible){total+=20;}
            if(this.nav_month_visible){total+=20;}
            
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
                    name: this.month_names[i],
                    index: i,
                    selected: i==this.month_selected?true:false
                })
            }
            return options;
        },
        totalDaysOfMonth:function(){
            return new Date(this.year_selected, this.month_selected+1, 0).getDate()
        },
        totalDaysOfPreviousMonth:function(){
            return new Date(this.year_selected, this.month_selected, 0).getDate();
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
        //the previous month days (if 1st day of current month does not start on sunday)
        previousMonth:function(){
            var now = new Date(this.year_selected,this.month_selected-1,1);
            return now.getMonth();
        },
        //the year of the previous month (because if current month is january than previous month december has another year)
        previousYear:function(){
            var now = new Date(this.year_selected,this.month_selected-1,1);
            return now.getFullYear();
        },
        previous_days:function(){
            var day = new Date(this.year_selected, this.month_selected, 1).getDay();
            var previousLastDay = this.totalDaysOfPreviousMonth;
            
            var diff = day - 0;
            var days_ar = [];
            //for(var ii=0;ii<diff;ii++){
            for(var ii=diff-1;ii>=0;ii--){
                days_ar.push(previousLastDay-ii);
            }
            return days_ar;
        },
        days:function(){
            //fix the array here 
            //get the first day of the month what day it is
            var day = new Date(this.year_selected, this.month_selected, 1).getDay();
            
            var diff = day - 0;
            var days_ar = [];
            if(!this.show_other_month_days){
                for(var ii=0;ii<diff;ii++){
                    days_ar.push(0);
                }
            }
            var month_days = this.totalDaysOfMonth;
            for(var i=0;i<month_days;i++){
                days_ar.push(i+1);
            }
            var last_day = new Date(this.year_selected, this.month_selected, month_days).getDay();
            
            if(!this.show_other_month_days){
                var last_diff = 6 - last_day;
                for(var iii=0;iii<last_diff;iii++){
                    days_ar.push(0);
                }
            }
            return days_ar;
        },
        next_days:function(){
            var month_days = this.totalDaysOfMonth;
            var last_day = new Date(this.year_selected, this.month_selected, month_days).getDay();
            
            var days_ar = [];
            var last_diff = 6 - last_day;
            for(var iii=0;iii<last_diff;iii++){
                days_ar.push(iii+1);
            }
            return days_ar;
        },
        nextMonth:function(){
            var now = new Date(this.year_selected,this.month_selected+1,1);
            return now.getMonth();
        },
        //the year of the month (because if the current month is december, than the january as next month will have another year)
        nextYear:function(){
            var now = new Date(this.year_selected,this.month_selected+1,1);
            return now.getFullYear();
        },
        
        can_nav_previous_month:function(){
            var minDate = this.min_date;
            minDate.setHours(0);minDate.setMinutes(0);minDate.setSeconds(0);
            var current = new Date();
            current.setFullYear(this.year_selected,this.month_selected-1,1);
            console.log(minDate, current);
            return current.getTime()>=minDate.getTime();
        },
        can_nav_previous_year:function(){
            var minDate = this.min_date;
            minDate.setHours(0);minDate.setMinutes(0);minDate.setSeconds(0);
            var current = new Date();
            current.setFullYear(this.year_selected-1,this.month_selected,1);
            return current.getTime()>=minDate.getTime();
        },
        can_nav_next_month:function(){
            var maxDate = this.max_date;
            maxDate.setHours(0);maxDate.setMinutes(0);maxDate.setSeconds(0);
            var current = new Date();
            current.setFullYear(this.year_selected,this.month_selected+1,1);
            return current.getTime()>=maxDate.getTime();
        },
        can_nav_next_year:function(){
            var maxDate = this.max_date;
            maxDate.setHours(0);maxDate.setMinutes(0);maxDate.setSeconds(0);
            var current = new Date();
            current.setFullYear(this.year_selected+1,this.month_selected,1);
            return current.getTime()>=maxDate.getTime();
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
        
        get_previous_month:function(){
            var date= new Date();
            date.setFullYear(this.year_selected, this.month_selected, 1);
            date.setFullYear(date.getFullYear(),date.getMonth()-1,1);
            return {
                month: date.getMonth(),
                year: date.getFullYear()
            }
        },
        
        get_next_month:function(){
            var date= new Date();
            date.setFullYear(this.year_selected, this.month_selected, 1);
            date.setFullYear(date.getFullYear(),date.getMonth()+1,1);
            return {
                month: date.getMonth(),
                year: date.getFullYear()
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
            
            this.$emit('dateChanged',{month:this.month_selected,year:this.year_selected,pmonth:pmonth,pyear:this.year_selected})
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
            
            this.$emit('dateChanged',{year:this.year_selected,month:this.month_selected, pyear: pyear, pmonth: this.month_selected});
        },
        previous_year:function(){
            var can_nav = this.can_nav_previous_year;
            if(!can_nav){
                alert('reached minimum date');
                return;
            }

            var cmonth = this.month_selected;
            var cyear = this.year_selected;
            var date= new Date();
            date.setFullYear(cyear, cmonth, 1);
            date.setFullYear(date.getFullYear()-1,date.getMonth(),1);
            this.month_selected = date.getMonth();
            this.year_selected = date.getFullYear();
            this.$emit('previousYear',{instance:this, month: this.month_selected, year: this.year_selected, pmonth: cmonth, pyear: cyear})
            this.$emit('dateChanged',{month:this.month_selected,year:this.year_selected,pmonth:cmonth,pyear:cyear})
        },
        previous_month:function(){
            var can_nav = this.can_nav_previous_month;
            if(!can_nav){
                alert('reached minimum date');
                return;
            }
            var cmonth = this.month_selected;
            var cyear = this.year_selected;
            var date= new Date();
            date.setFullYear(cyear, cmonth, 1);
            date.setFullYear(date.getFullYear(),date.getMonth()-1,1);
            this.month_selected = date.getMonth();
            this.year_selected = date.getFullYear();
            this.$emit('previousMonth',{instance:this, month: this.month_selected, year: this.year_selected, pmonth: cmonth, pyear: cyear})
            this.$emit('dateChanged',{month:this.month_selected,year:this.year_selected,pmonth:cmonth,pyear:cyear})
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
            this.$emit('dateChanged',{month:this.month_selected,year:this.year_selected,pmonth:cmonth,pyear:cyear})
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
            this.$emit('dateChanged',{month:this.month_selected,year:this.year_selected,pmonth:cmonth,pyear:cyear})
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
        is_today:function(day,month,year){
            var today = this.get_today();
            return day==today.date && month==today.month && year==today.year?true:false;
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
        /**
        this.$el.addEventListener('keyup',()=>{
            console.log(event.keyCode);
            console.log(event.srcElement);
        })
        **/
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