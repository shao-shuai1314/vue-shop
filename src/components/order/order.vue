<template>
    <div>
        <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 订单列表数据 -->
            <el-table :data='orderlist' border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status"></el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="showBox" type="primary" size="mini" icon="el-icon-edit"></el-button>
                        <el-button type="success" size="mini" icon="el-icon-location"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="block">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>
        </el-card>
        <!-- 修改地址对话框 -->
        <el-dialog
            title="修改地址"
            :visible.sync="addressVisible"
            width="50%"
            @close="aaa"
            >
            <el-form ref="addresFormorRef" :model="addressForm" :rules="addressFormRules" label-width="100px">
                <el-form-item label="省市区/县" prop="addresss1">
                    <el-input v-model="addressForm.addresss1"></el-input>
                </el-form-item>
                <el-form-item label="详细地址" prop="addresss2">
                    <el-input v-model="addressForm.addresss2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addressVisible = false">取 消</el-button>
                <el-button type="primary" @click="addressVisible = false">确 定</el-button>
            </span>
            </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            total:0,
            orderlist:[],
            addressVisible:false,
            addressForm:{
                addresss1:'',
                addresss2:''
            },
            addressFormRules:{
                addresss1:[
                    { required: true, message: '请选择省市区县', trigger: 'blur' },
                ],
                addresss2:[
                    { required: true, message: '请填写详细地址', trigger: 'blur' },
                ]
            }
        }
    },
    created(){
        this.getDrderList()
    },
    methods:{
      async getDrderList(){
          const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
          if(res.meta.status !==200) return $message.error('获取订单列表失败')
        //   console.log(res)
          this.total = res.data.total
          this.orderlist = res.data.goods
       },
       handleSizeChange(newSize){
           this.queryInfo.pagesize = newSize
           this.getDrderList()
       },
       handleCurrentChange(newPage){
          this.queryInfo.pagenum = newPage
           this.getDrderList()
       },
    //    展示修改地址
        showBox(){
           this.addressVisible = true  
        },
        aaa(){
            this.$refs.addresFormorRef.resetFields()
            // console.log( this.$refs.ddresForm-orRef.resetFields())
           
        }
   
    }
    
}
</script>
<style scoped>

</style>


