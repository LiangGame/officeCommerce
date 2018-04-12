<template>
    <!--按钮：编辑、删除、添加  -->
    <div class="table-three-buttons-container">
        <span><el-button type="success" size="mini" @click="$emit('look')">查看</el-button></span>
        <span><el-button type="warning" size="mini" @click="$emit('edit')" v-show="Level==0 || Level==1 ">编辑</el-button></span>
        <span><el-button type="danger" size="mini"  @click="$emit('delete')" v-show="Level==0">删除</el-button></span>
    </div>
</template>

<script>
    export default {
        name:'tablethreebuttons',
        data(){
            return{
                // Level: this.Cookie.get('Level') // 操作权限
                Level: 0 // 操作权限
            }
        },
        created(){
        },
        methods:{

        }
    }
</script>

<style lang="less" type="text/less">
    .table-three-buttons-container{
        .el-button--mini{
            padding: 4px 6px;
            border-radius:2px;
        }
    }
</style>
