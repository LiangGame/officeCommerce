<template>
    <!-- 开始时间、结束时间 -->
    <div class="datePickGroup-container">
        <span>开始时间：</span>
        <el-date-picker
            v-model="beginDate"
            align="left"
            type="date"
            size="mini"
            :picker-options="beginPickerOptions"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
        </el-date-picker>
        <span style="margin-left:10px;">结束时间：</span>
        <el-date-picker
            v-model="endDate"
            align="left"
            type="date"
            size="mini"
            :picker-options="endPickerOptions"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
        </el-date-picker>
        <el-button type="primary" icon="el-icon-search" size="mini" class="search-btn" @click="$emit('searchFn', [beginDate, endDate])"></el-button>
    </div>
</template>

<script>
    export default {
        name:'datePickGroup',
        props:['dangerDate'],
        data(){
            let that = this;
            return{
                beginDate: this.dangerDate == undefined || this.dangerDate.length == 0?new Date().getFullYear() + '-01-01':this.dangerDate,
                endDate: this.dangerDate== undefined || this.dangerDate.length == 0?new Date().getFullYear() + '-' + ((new Date().getMonth() + 1)<10?'0'+(new Date().getMonth() + 1):(new Date().getMonth() + 1)) + '-' + (new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate()):this.dangerDate,
                beginPickerOptions: {
                    // 时间选择器选择限制
                    disabledDate(time) {
                        return time.getTime() > Date.now()  ||
                            time.getTime() > new Date(that.endDate).getTime() - 8.64e7;
                    }
                },
                endPickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now()  ||
                            time.getTime() < new Date(that.beginDate).getTime()  ;
                    }
                },

            }
        },
        created(){
            this.$emit('searchFn',[this.beginDate, this.endDate]);
        }
    }
</script>

<style lang="less" type="text/less">
.datePickGroup-container{
    display: inline-block;
    .search-btn{
        padding:6px;
        border-radius:2px;
        margin-left:5px;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width: 140px;
    }
}
</style>
