<template>
    <div>
           <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片师徒 -->
        <el-card>
            <!-- 添加按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAdd">添加分类</el-button>
                </el-col>
                <!-- 表格 -->
                <tree-table show-index index-text="#" border :show-row-hover="false" :expand-type="false" :selection-type="false" :data="ctelist" :columns="columns">
                    <template slot="isok" slot-scope="scope">
                         <i style="color:lightgreen" v-if="scope.row.cat_deleted === false" class="el-icon-success"></i>
                         <i style="color:red" v-else class="el-icon-error"></i>
                    </template>
                     <template slot="order" slot-scope="scope">
                         <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                         <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                         <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                    <template slot="opt" slot-scope="scope">
                         <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                         <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>                         
                    </template>
                </tree-table>
                <!-- 分页 -->
                 <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="querInfo.pagenum"
                    :page-sizes="[3, 5, 10]"
                    :page-size="querInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </el-row>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close="addCateDial"
            >
            <!-- 添加分类表单 -->
            <el-form :model="addCateFrom" :rules="addCateFromRules" ref="addCateFromRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateFrom.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- options用来指定数据源 -->
                    <!-- props用来指定配置对象 -->
                     <el-cascader
                        v-model="selectedKeys"
                        :options="parentCateList"
                        expand-trigger='hover'
                        :props="cascaderProps"
                        @change="parentCateChange"
                        >
                        </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
            </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {
            ctelist:[],
            // 查询条件
            querInfo:{
              type:3,
              pagenum:1,
              pagesize:5
            },
            // 总数据条数
            total:0,
            // 为table指定列定义
            columns:[{
                label:'分类名称',
                prop:'cat_name'
            },{
                label:'分类名称',
                type:'template',
                template:'isok'
                
            },{
                label:'排序',
                type:'template',
                template:'order'
                
            },{
                label:'操作',
                type:'template',
                template:'opt'
            }],
            // 添加对话框显示隐藏
            addCateDialogVisible:false,
            // 添加变淡对象
            addCateFrom:{
                // 分类名称
                cat_name:'',
                // 父级分类id
                cat_pid:0,
                // 分类等级默认一级分类
                cat_level:0
            },
            // 添加表单沿正轨则
            addCateFromRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            // 父级分类列表
            parentCateList:[],
            // 指定联机选择器配置对象
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // 选中父级分类id数组
            selectedKeys:[]
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        // 获取商品分类数据
       async getCateList(){
         const {data:res} = await this.$http.get('categories',{params:this.querInfo})
         if(res.meta.status !==200) return this.$message.error('获取商品分类失败！')
         console.log(res.data)
         this.ctelist = res.data.result
         this.total =res.data.total
       },
    //    监听pagesize
        handleSizeChange(newSize){
            this.querInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听pagenum
        handleCurrentChange(newPagenum){
           this.querInfo.pagenum = newPagenum
            this.getCateList()
        },
        // 点击按钮添加显示对话框
        showAdd(){
            this.getParentCateList()
           this.addCateDialogVisible = true
        },
        async getParentCateList(){
          const{data:res} = await this.$http.get('categories',{params:{type:2}})
          if(res.meta.status !==200) return this.$message.error('获取父级分类数据失败！')
          this.parentCateList=res.data
        },
        // 选择先发生变化触发这个函数
        parentCateChange(){
           console.log(this.selectedKeys)
           if(this.selectedKeys.length>0){
            //    父级分类的id
              this.addCateFrom.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
              this.addCateFrom.cat_level = this.selectedKeys.length
              return
           }else{
                this.addCateFrom.cat_pid = 0
              this.addCateFrom.cat_level = 0
           }
        },
        // 添加新分类
         addCate(){
             console.log(this.addCateFrom)
             this.$refs.addCateFromRef.validate(async valid=>{
                 if(!valid) return
                 const{data:res} = await this.$http.post('categories',this.addCateFrom)
                  if(res.meta.status !==201) return this.$message.error('添加分类失败！')
                  this.$message.success('添加分类成功！')
                   this.getCateList()
                   this.addCateDialogVisible = false
             })
         },
        //  监听对话框关闭事件
         addCateDial(){
            this.$refs.addCateFromRef.resetFields()
            this.selectedKeys = []
            this.addCateFrom.cat_pid = 0
            this.addCateFrom.cat_level = 0
         }

    }
    
}
</script>
<style scopend>
.el-cascader{
    width: 100%;
}
</style>


