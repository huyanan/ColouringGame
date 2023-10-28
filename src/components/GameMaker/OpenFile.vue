<template>
    <div class="new-file" v-if="isShow">
        <el-dialog
            title="打开"
            :visible.sync="isShow"
            width="30%"
            center>
            <div class="model-content">
                <el-form>
                    <!-- <el-form-item>
                        <input type="file" @change="onFileSelect" >
                    </el-form-item> -->
                    <el-form-item>
                        <!-- 下拉选择文件列表 -->
                        <el-select v-model="selectFile" placeholder="请选择文件">
                            <el-option
                                v-for="item in fileList"
                                :key="item.name"
                                :label="item.name"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="fileName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        
                        <el-button type="primary" @click="sure">确定</el-button>
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
        name: "OpenFile",
        data() {
            return {
                isShow: false,
                GameMakerConfig: this.$GameMakerConfig,
                fileList: [],
                selectFile: null,
                dirPath: this.$GameMakerConfig.outputPath || 'E:\\work\\ColouringGame\\out',
                fileName: "",
            }
        },
        watch: {
            selectFile () {
                console.log('选择文件', this.selectFile)
            }
        },
        mounted() {
            this.$eventBus.$on("open", () => {
                console.log("open");
                this.getFileList();
                this.isShow = true
            })
        },
        methods: {
            onFileSelect (val) {
                // 获取文件路径
                this.fileName = val.target.files[0].name;
                this.dirPath = val.target.files[0].path;
                console.log(this.dirPath);
                this.isShow = false;
                this.$eventBus.$emit("openFile", this.dirPath);
                
            },
            getFileList() {
                this.$axios.get("/api/maker/getFileList")
                .then(res => {
                    this.fileList = res.data.fileList;
                    console.log(res);
                })
            },
            sure() {
                this.$emit('sure')
                
                // 抛出打开文件
                this.$eventBus.$emit("openedFile", {
                    ...this.selectFile,
                    filePath: this.selectFile.path,
                });
                this.isShow = false;
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