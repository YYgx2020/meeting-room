<template>
  <div>
    <div style="margin: 5px 0">
      <el-button type="primary" size="mini" @click="add">新增</el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column label="头像" width="220" align="center">
        <template slot-scope="scope">
          <el-image :src="scope.img" class="img">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i></div
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180" align="center">
      </el-table-column>
      <el-table-column prop="tel" label="手机号" width="180" align="center">
      </el-table-column>
      <el-table-column prop="password" label="密码" width="180" align="center">
      </el-table-column>
    </el-table>

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="添加头像" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          img: "",
          tel: "18467624131",
          name: "王小虎",
          password: "sadsagashastg",
        },
        {
          img: "",
          tel: "18467624131",
          name: "王小虎",
          password: "sadsagashastg",
        },
        {
          img: "",
          tel: "18467624131",
          name: "王小虎",
          password: "sadsagashastg",
        },
        {
          img: "",
          tel: "18467624131",
          name: "王小虎",
          password: "sadsagashastg",
        },
      ],
      dialogFormVisible: false,
      form: {
        name: "",
        tel: "",
        password: "",
        img: "",
      },
      formLabelWidth: "120px",
      imageUrl: '',
    };
  },
  methods: {
    add() {
      this.dialogFormVisible = true;
    },
    handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    
  },
};
</script>

<style scoped>
.img {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
  border: 1px solid #6b7280;
}
.avatar {
  width: 128px;
  height: 128px;
  display: block;
}
</style>
