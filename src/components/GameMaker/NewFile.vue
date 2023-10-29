<template>
    <div class="new-file" v-if="isShow">
        <el-dialog
            title="提示"
            :visible.sync="isShow"
            width="30%"
            center>
            <div class="model-content">
                <el-form>
                    <el-form-item>
                        <el-input v-model="dirPath"></el-input>
                        
                        <!-- <el-button type="primary" @click="selectDir">选择目录</el-button> -->
                        <!-- 唤起资源管理器选择目录 -->
                        <!-- <input type="file" webkitdirectory directory multiple/> -->
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="fileName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        
                        <el-button type="primary" @click="submit">确定</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        
    </div>
</template>

<script>
import axios from 'axios'
    export default {
        name: "NewFile",
        data() {
            return {
                isShow: false,
                dirPath: 'E:\\work\\ColouringGame\\out',
                fileName: ""
            }
        },
        mounted() {
            this.$eventBus.$on("new", () => {
                console.log("new");
                this.isShow = true
            })
        },
        methods: {
            submit() {
                this.$emit('submit')
                // 提交
                this.$axios.post("/api/maker/createComic", {
                    dirPath: this.dirPath,
                    fileName: this.fileName
                })
                .then(res => {
                    console.log(res)
                    this.$message({
                        type:'success',
                        message: '创建成功'
                    })
                })

                // this.$axios.get("/users")
                // .then(res => {
                //     console.log(res)
                // })
            },
            cancel() {
                this.$emit('cancel')
                this.isShow = false
            }
        }
    }
</script>

<style scoped>
.new-file {
    
}

</style>