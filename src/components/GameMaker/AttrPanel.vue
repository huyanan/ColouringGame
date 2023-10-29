<template>
    <div class="attr-panel" v-show="isShow">
        <div class="attr-panel-header">
            <div class="attr-panel-header-title">
                <span class="attr-panel-header-title-text">属性</span>
            </div>
            <div class="attr-panel-header-close" @click="close">
                <i class="iconfont icon-close"></i>
                <span>关闭</span>
            </div>
        </div>
        <div class="attr-panel-body">
            <div class="part-attr">
                <el-form v-if="node.type === 'comic'">
                    <!-- id -->
                    <el-form-item label="id">
                        <el-input v-model="node.id" placeholder="请输入id"></el-input>
                    </el-form-item>
                    <!-- uuid -->
                    <el-form-item label="uuid">
                        <el-input v-model="node.uuid" placeholder="请输入uuid"></el-input>
                    </el-form-item>
                    <!-- 名字 -->
                    <el-form-item label="name">
                        <el-input v-model="node.name" placeholder="请输入名字"></el-input>
                    </el-form-item>
                    
                    <!-- label -->
                    <el-form-item label="label">
                        <el-input v-model="node.label" placeholder="请输入label"></el-input>
                    </el-form-item>
                    <!-- description -->
                     <el-form-item label="描述">
                        <el-input v-model="node.description" placeholder="请输入描述"></el-input>
                    </el-form-item>
                    
                    <!-- 文件路径 -->
                    <el-form-item label="文件路径">
                        <el-input v-model="node.filePath" placeholder="请输入文件路径"></el-input>
                    </el-form-item>
                    
                    <!-- 文件名 -->
                    <el-form-item label="文件名">
                        <el-input v-model="node.fileName" placeholder="请输入文件名"></el-input>
                    </el-form-item>
                    
                    <!-- 资源网络访问地址 -->
                    <el-form-item label="资源网络访问地址">
                        <el-input v-model="node.assetsBaseUrl" placeholder="请输入网络访问地址"></el-input>
                    </el-form-item>
                    <!-- 资源真实路径 -->
                    <el-form-item label="资源真实路径">
                        <el-input v-model="node.assetsRealPath" placeholder="请输入资源真实路径"></el-input>
                    </el-form-item>
                </el-form>
                <el-form v-else-if="node.type === 'part'">
                    <!-- id -->
                    <el-form-item label="id">
                        <el-input v-model="node.id" placeholder="请输入id"></el-input>
                    </el-form-item>
                    <!-- uuid -->
                    <el-form-item label="uuid">
                        <el-input v-model="node.uuid" placeholder="请输入uuid"></el-input>
                    </el-form-item>
                    <!-- 名字 -->
                    <el-form-item label="name">
                        <el-input v-model="node.name" placeholder="请输入名字"></el-input>
                    </el-form-item>
                    <!-- label -->
                    <el-form-item label="label">
                        <el-input v-model="node.label" placeholder="请输入label"></el-input>
                    </el-form-item>
                    <!-- description -->
                     <el-form-item label="描述">
                        <el-input v-model="node.description" placeholder="请输入描述"></el-input>
                    </el-form-item>
                    <!-- parent -->
                    <el-form-item label="父节点">
                        <el-input v-model="node.parent" placeholder="请输入父节点"></el-input>
                    </el-form-item>
                    <!-- type -->
                    <el-form-item label="类型">
                        <el-input v-model="node.type" placeholder="请输入类型"></el-input>
                    </el-form-item>
                    <!-- 位置  -->
                    <el-form-item label="x">
                        <el-input type="number" v-model="node.style.x" placeholder="请输入x"></el-input>
                    </el-form-item>
                    <el-form-item label="y">
                        <el-input type="number" v-model="node.style.y" placeholder="请输入y"></el-input>
                    </el-form-item>
                    <el-form-item label="width">
                        <el-input type="number" v-model="node.style.w" placeholder="请输入宽度"></el-input>
                    </el-form-item>
                    <el-form-item label="height">
                        <el-input type="number" v-model="node.style.h" placeholder="请输入高度"></el-input>
                    </el-form-item>
                    <!-- 层级  -->
                    <el-form-item label="z-index">
                        <el-input type="number" v-model="node.zIndex" placeholder="请输入zIndex"></el-input>
                    </el-form-item>
                    <!-- 涂色后是否展示边框  -->
                    <el-form-item label="默认展示禁用图片">
                        <el-checkbox v-model="node.isDefaultDisabled"></el-checkbox>
                    </el-form-item>
                    <!-- 涂色后是否展示边框  -->
                    <el-form-item label="涂色后展示边框">
                        <el-checkbox v-model="node.isShowBorderAfterPainted"></el-checkbox>
                    </el-form-item>
                    <!-- 涂色图片  -->
                    <el-form-item label="drawImage">
                        <input type="file" placeholder="涂色图片" accept="image" @change="onSelectDrawImage" />
                        <el-input v-model="node.drawImage" placeholder="涂色图片"></el-input>
                    </el-form-item>
                    <!-- 边框图片  -->
                    <el-form-item label="边框图片">
                        <input type="file" placeholder="涂色图片" accept="image" @change="onSelectBorderImage" />
                        <el-input v-model="node.borderImage" placeholder="边框图片"></el-input>
                    </el-form-item>
                    <!-- 禁用图片  -->
                    <el-form-item label="禁用图片">
                        <input type="file" placeholder="涂色图片" accept="image" @change="onSelectDisabledImage" />
                        <el-input v-model="node.disabledImage" placeholder="禁用图片"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            isShow: false,
            node: {

                // id = options.id || uuidv4();
                // label = options.label || '零件label';
                // name = options.name || '零件名称';
                // description = options.description || '零件描述'
                
                // parent = options.parent || null;
                // canFill = options.canFill || false;
                // style = options.style || {
                //     x: 0,
                //     y: 0,
                //     w: 0,
                //     h: 0
                // };
                // zIndex = options.zIndex || 0
                // isShowBorderAfterPainted = options.isShowBorderAfterPainted || false,
                // drawImage = options.drawImage || ''
                // borderImage = options.borderImage || ''
                // disabledImage = options.disabledImage || ''

                // children = options.children || [];
            },
        }
    },
    mounted () {
        this.initEvents();
    },
    methods: {
        initEvents () {
            this.$eventBus.$on('showAttrPanel', this.show);
        },
        onSelectDrawImage (event) {
            this.node._drawImage = event.target.files[0].name;
        },
        onSelectBorderImage (event) {
            this.node._borderImage = event.target.files[0].name;
        },
        onSelectDisabledImage (event) {
            this.node._disabledImage = event.target.files[0].name;
        },
        show (node) {
            this.isShow = true;
            this.node = node;
        },
        close () {
            this.isShow = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.attr-panel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.attr-panel-header {
    flex: 0 0 auto;
}
.attr-panel-body {
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 20px;
}
</style>