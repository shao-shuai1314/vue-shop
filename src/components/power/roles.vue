<template>
    <div>
         <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片师徒 -->
        <el-card>
            <!-- 添加按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区 -->
            <el-table :data='rolelist' border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',i1 === 0?'bdtop':'','vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二三级 -->
                            <el-col :span="19">
                               <el-row :class="[i2 === 0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                   <el-col :span="6">
                                       <el-tag closable @close="removeRightById(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                                       <i class="el-icon-caret-right"></i>
                                   </el-col>
                                   <!-- 渲染三级 -->
                                   <el-col :span="18">
                                       <el-tag closable @close="removeRightById(scope.row,item3.id)" type="warning" v-for="(item3, i3) in item2.children" :key="item3.id">
                                           {{item3.authName}}
                                       </el-tag>
                                   </el-col>
                                </el-row> 
                            </el-col>
                        </el-row>
                        
                    </template>
                </el-table-column>
                <!-- 索引 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column align="center"  label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-s-tools" @click="showSetRightDIalog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>    
           </el-table>
        </el-card>
        <!-- 分配权限 -->
        <el-dialog
                title="提示"
                :visible.sync="setRightDialogWisible"
                width="50%"
                @close="setRightDialogClosed"
                >
                <!-- 数行空间 -->
                <el-tree ref="treeRef" :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys"></el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRightDialogWisible = false">取 消</el-button>
                    <el-button type="primary" @click="allotRights">确 定</el-button>
                </span>
         </el-dialog>

    </div>
</template>
<script>
export default {
    data(){
        return {
            //    所有角色列表数据
            rolelist:[],
            // 控制配置权限对话框
            setRightDialogWisible:false,
            // 所有权限的数据
            rightsList:[],
            // 树新空间
            treeProps:{
               label:'authName',
               children:'children'
            },
            // 默认选中效果Id值
            defkeys:[],
            // 当前即将分配权限的id
            roleId:''
        }  
    },
    created(){
        this.getRolesList()
    },
    methods:{
        async getRolesList(){
           const {data:res}= await this.$http.get('roles')
           if(res.meta.status !== 200){
               return this.$message.error('获取角色列表失败！')
           }
           this.rolelist = res.data
        },
        // 删除
        async removeRightById(role,rightId){
        // 弹框提示是否删除
         const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if(confirmResult !== 'confirm'){
                    return this.$message.info('取消了删除')
                }
                const {data:res} =await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if(res.meta.status !==200){
                    return this.$message.error('删除权限失败！')
                }
                // this.getRolesList()
                role.children = res.data
        },
        // 分配权限 
        async showSetRightDIalog(role){
            this.roleId = role.id
            // 获取所有权限数据
            const {data:res} = await this.$http.get('rights/tree')
             if(res.meta.status !== 200) return this.$message.error('获取权限数据失败')
            this.rightsList = res.data
            // console.log(this.rightsList)
        // 通过递归获取三级权限保存数组中

            this.getLeafKes(role,this.defkeys)
            this.setRightDialogWisible =true
        },
        // 清空
         setRightDialogClosed(){
             this.defkeys =[]
         },
        // 通过递归获取三级权限保存数组中
        getLeafKes(node,arr){
            // 如果当前node节点不包含children属性，则是三级接点
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item=>{
               this.getLeafKes(item,arr)
            })
        },
        // 点击角色分配权限
        async allotRights(){
            const keys=[
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()

            ]
            // console.log(keys)
            const idStr =keys.join(',')
            const{data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
            if(res.meta.status !== 200){
                return this.$message.error('分配权限失败')
            }
            this.$message.success('分配权限成功')
            this.getRolesList()
            this.setRightDialogWisible = false
        }
        
    }
}
</script>
<style scopend>
 .el-tag{
     margin: 7px
 }
 .bdtop{
     border-top: 1px solid #eee
 }
  .bdbottom{
     border-top: 1px solid #eee
 }
 .vcenter{
     display: flex;
     align-items: center
 }
</style>



