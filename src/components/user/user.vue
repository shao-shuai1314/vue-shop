<template>
    <div>
       <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <!-- 搜索与添加 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="usersList"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="usersList"></el-button>
                    </el-input>
                    </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            
        </el-card>
        <!-- 用户列表 -->
        <el-table :data="userlist" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.mg_state"
                        @change="userStateChange(scope.row)"
                    >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-tooltip :enterable="false" effect="dark" content="修改" placement="top-start">
                         <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
                    </el-tooltip>
                     <el-tooltip :enterable="false" effect="dark" content="删除" placement="top-start">
                         <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
                    </el-tooltip>
                     <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="top-start">
                          <el-button type="warning" size="mini" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
          <!-- 添加用户对话框 -->
          <el-dialog
                title="添加用户"
                :visible.sync="dialogVisible"
                width="50%"
                @close="addDialogClosed"
                >
                <!-- 内容主题区 -->
                <span>
                    <el-form :model="ruleForms" :rules="rulesas" ref="ruleFormref" label-width="70px">
                        <el-form-item label="用户名" prop="usersName">
                            <el-input v-model="ruleForms.usersName"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="userspassword">
                            <el-input type="password" v-model="ruleForms.userspassword"></el-input>
                        </el-form-item>
                         <el-form-item label="邮箱" prop="usersemail">
                            <el-input v-model="ruleForms.usersemail"></el-input>
                        </el-form-item>
                         <el-form-item label="手机" prop="usersmod">
                            <el-input v-model="ruleForms.usersmod"></el-input>
                        </el-form-item>
                    </el-form>
                </span>
                <!-- 底部区 -->
                <span slot="footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改用户对话框 -->
            <el-dialog
                title="修改用户信息"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editFormClosed"
                >
                <span>
                    <el-form :model="editForm" :rules="editFormRules" ref="editFormref" label-width="70px">
                        <el-form-item label="用户名">
                            <el-input v-model="editForm.username" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="editForm.email"></el-input>
                        </el-form-item>
                         <el-form-item label="手机" prop="mobile">
                            <el-input v-model="editForm.mobile"></el-input>
                        </el-form-item>
                    </el-form>
                </span>
                <span slot="footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editFormUser">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 分配角色对话框 -->
            <el-dialog
                title="分配角色"
                :visible.sync="setRoleDialogVisible"
                width="50%"
                 @close="setRoleClosed"
                >
                <span>
                    <p>当前的用户：{{userInfo.username}}</p>
                    <p>当前的角色：{{userInfo.role_name}}</p>
                    <p>分配新角色：
                       <el-select v-model="selectedRoleId" placeholder="请选择">
                                <el-option
                                v-for="item in rolesList"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                                </el-option>
                      </el-select>
                    </p>
                </span>
                <span slot="footer">
                    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
                </span>
            </el-dialog>




    </div>
</template>
<script>
export default {
  created(){
     this.usersList()
  },
  data(){
    // 手机号校验规则
     var checkMobile = (rule, value, callback) => {
         const regMobile = /^1[3456789]\d{9}$/;
         if(regMobile.test(value)){
             return callback()
         }
         callback(new Error('请输入合法手机号'))
     }
      return{
        //   获取用户列表参数对象
          queryInfo:{
              query:'',
            //   页数
              pagenum:1,
            //   当前每页显示多少数据
              pagesize:2
          },
          userlist:[],
          total:0,
        //   控制添加用户显示与隐藏
          dialogVisible:false,
        //   控制修改用户显示与隐藏
          editDialogVisible:false,
        //   添加用户表单数据
          ruleForms:{
              usersName:'',
              userspassword:'',
              usersemail:'',
              usersmod:''
          },
        //   添加表单验证规则
          rulesas:{
               usersName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 5, message: '用户名长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                userspassword:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 5, message: '密码长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                usersemail:[
                   { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                   { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] } 
                ],
                usersmod:[
                     { required: true, message: '手机号不能为空'},
                     {validator:checkMobile, trigger: 'blur'}
                ]
          },
        //   修改用户表单数据
          editForm:{},
          editFormRules:{
                email:[
                   { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                   { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] } 
                ],
                mobile:[
                     { required: true, message: '手机号不能为空'},
                     {validator:checkMobile, trigger: 'blur'}
                ]
          },
        //   控制分配角色显示与隐藏
        setRoleDialogVisible:false,
        // 分配角色表单数据

        userInfo:{},
        // 所有角色列表
        rolesList:[],
        selectedRoleId:''


      }
  },
  methods:{
    async usersList(){
        const {data:res} = await this.$http.get('users',{params:this.queryInfo})
        if(res.meta.status !== 200){
           return this.$message.error("获取用户列表失败")
        }
        // console.log(res)
        this.userlist = res.data.users
        this.total =  res.data.total
    },
    // 每页显示多少条
    handleSizeChange(newSiza){
       this.queryInfo.pagesize=newSiza
        this.usersList()
    },
    // 分页
    handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.usersList()
    },
    // 监听按钮动态
    async userStateChange(userinfo){
      const {data:res} =await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if(res.meta.status !== 200){
          userinfo.mg_state =!userinfo.mg_state
         return this.$message.error('更新用户状态失败！') 
      } 
      this.$message.success('更新用户状态成功')
    },
    // 监听添加用户对话框关闭事件
    addDialogClosed(){
        this.$refs.ruleFormref.resetFields()
    },
    // 添加新用户
    addUser(){
      const {usersName:username,userspassword:password,usersemail:email,usersmod:mobile}=this.ruleForms
      const addFrom={username,password,email,mobile}
         this.$refs.ruleFormref.validate(async valid =>{
            //  console.log(addFrom)
             if(!valid) return
            //  添加用户网络请求
            const {data:res} = await this.$http.post('users',addFrom)
            // console.log(res)
            if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
             this.$message.success('添加用户成功')
            //  隐藏对话框
            this.dialogVisible = false;
            // 重新获取用户数据
            this.usersList()
        
        })
    },
    // 点击编辑修改用户对话框
    async showEditDialog(id){
      const {data:res} = await this.$http.get('users/'+id)
      console.log(res)
       if(res.meta.status !== 200) return this.$message.error('查询信息失败')
       this.editForm = res.data
       console.log(this.editForm)
       this.editDialogVisible=true
    },
    // 监听修改对话框关闭状态
    editFormClosed(){
         this.$refs.editFormref.resetFields()
    },
    // 点击修改确定按钮
    editFormUser(){
       this.$refs.editFormref.validate(async valid=>{
           console.log(valid)
           if(!valid) return
        //    发起修改用户信息的数据请求
          const {data:res} =  await this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
          if(res.meta.status !== 200){
              this.$message.error('更新信息失败')
          }
        //   关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
         this.usersList()
        // 提示修改成功
         this.$message.success('更新信息成功')
      })
    },
    // 根据id删除用户信息
    async removeUserById(id){
      const confirmRes =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 如果用去确定返回confirm,如果取消返回cancel
        if(confirmRes !=='confirm'){
            return this.$message.info('已取消删除')
        }
        const {data:res}=await this.$http.delete('users/'+id)
        if(res.meta.status !==200){
            return this.$message.error(res.meta.msg)
        }
        this.$message.success('删除用户成功！')
        this.usersList()
    },
    // 展示分配角色对话框
   async setRole(userInfo){
        this.userInfo=userInfo
        // 在显示对话框钱获取列表
        const {data:res} = await this.$http.get('roles')
        if(res.meta.status !== 200)return this.$message.error('展示分配角色对话框失败')
        this.rolesList = res.data
      this.setRoleDialogVisible=true
    },
    // 点击确定分配按钮
    async saveRoleInfo(){
        if(!this.selectedRoleId){
            return this.$message.error('请选择要分配的角色')
        }
        const {data:res} =await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
        // console.log(res)
        if(res.meta.status !== 200)return this.$message.error('更新角色失败')
         this.$message.success('更新角色成功')
         this.usersList()
         this.setRoleDialogVisible = false
    },
    // 监听对话框关闭状态
    setRoleClosed(){
         this.selectedRoleId = ''
    }
  }
}
</script>
<style scoped>


</style>

