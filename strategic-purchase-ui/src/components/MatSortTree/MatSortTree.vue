<template>
    <div class="mat-sort-tree-api">
        <el-tree class="select-tree" :props="defaultProps" :load="loadNode" lazy node-key="id" :highlight-current="true" :expand-on-click-node="false" @current-change="onNodeClick" :data="sortOrgList" :default-expanded-keys="expendedKeys" :filter-node-method="filterNode" :render-content="renderContent" ref="tree">
        </el-tree>
    </div>
</template>

<script>
import { showToolTip } from "@/utils/tree-node-util.js";
import matCommonHelpService from "@/api/mat-common-help-service";
import clipboard from "@/utils/clipboard";
import debounce from "throttle-debounce/debounce";
export default {
    name: "MatSortTree",
    props: {
        currentOrgId: String,
    },
    data() {
        return {
            defaultProps: {
                label: "showName",
                children: "children",
                isLeaf: "isDetail",
            },
            sortOrgList: [],
            //处理树形结构tooltip数据
            tooltipContent: "",
            treeWidth: 0,
            expendedKeys: [],
            filterPathArray: [],
        };
    },
    methods: {
        // 树节点鼠标划入时候状态：
        handleTreeMouseEnter(event, node) {
            this.tooltipContent = showToolTip(
                event,
                ".item",
                this.treeWidth,
                this.$refs.tooltip,
                this.activateTooltip
            );
        },
        filterNode(value, data) {
            return true;
        },
        /**
         * 过滤查询数据
         */
        getMatSortPathByFilterText(fliterText) {
            if (!fliterText) {
                this.filterPathArray = [];
                this.loadFirstNode();
                this.$refs.tree.filter("");
            } else {
                matCommonHelpService
                    .getMatSortPathByFilterText(this.currentOrgId, fliterText)
                    .then((response) => {
                        this.filterPathArray = response;
                        this.$refs.tree.filter("");
                        this.loadFirstNode();
                    })
                    .catch((err) => {
                        this.warn(err.message[0]);
                    });
            }
        },
        handleTreeMouseLeave(event) {
            const tooltip = this.$refs.tooltip;
            if (tooltip) {
                tooltip.setExpectedState(false);
                tooltip.handleClosePopper();
            }
        },
        handleContext(event, text) {
            window.event.returnValue = false;
            clipboard(text, event);
        },
        /**
         * 点击物料分类树，加载物料编码数据
         */
        onNodeClick(data) {
            this.$emit("onTreeNodeClick", data);
        },
        // 加载子节点 懒加载
        loadNode(node, resolve) {
            if (node.level === 0) {
                if (!this.currentOrgId) {
                    return;
                }
                matCommonHelpService
                    .getRootNode()
                    .then((data) => {
                        data[0].showName = data[0].code + "  " + data[0].name;
                        //默认展开第一条数据
                        this.expendedKeys.push(data[0].id);
                        //默认调用点击事件
                        this.onNodeClick(data[0]);
                        return resolve(data);
                    })
                    .catch((err) => {
                        this.error(err.message[0]);
                    });
            } else {
                matCommonHelpService
                    .getChlidMatSortNode(this.currentOrgId, node.data.id)
                    .then((data) => {
                        data.forEach(
                            (item) =>
                                (item.showName = item.code + "  " + item.name)
                        );
                        return resolve(data);
                    })
                    .catch((err) => {
                        this.error(err.message[0]);
                    });
            }
        },
        /**
         * 主动触发 加载根节点
         */
        loadFirstNode() {
            matCommonHelpService
                .getRootNode()
                .then((data) => {
                    data[0].showName = data[0].code + "  " + data[0].name;
                    //默认展开第一条数据
                    this.expendedKeys.push(data[0].id);
                    this.sortOrgList = data;
                    //触发默认点击第一行数据
                    this.onNodeClick(data[0]);
                })
                .catch((err) => {
                    this.error(err.message[0]);
                });
        },
        clearNode() {
            this.sortOrgList = [];
            this.filterPathArray = [];
        },
        renderContent(h, { node, data, store }) {
            // 通过名称 模糊匹配获取 path
            let flag = false;
            if (this.filterPathArray.length > 0) {
                this.filterPathArray.forEach((matchNode) => {
                    if (matchNode.path.startsWith(data.path)) {
                        flag = true;
                    }
                });
            }
            return (
                <span
                    class="custom-tree-node"
                    onContextmenu={(e) => this.handleContext(e, node.label)}
                    onMouseenter={(e) =>
                        this.handleTreeMouseEnter(e, node, data, store)
                    }
                    onMouseleave={(e) => this.handleTreeMouseLeave(e)}
                >
                    <span class={flag ? "custom-tree-node-reb item" : " item"}>
                        <span class=""></span>
                        <span> {node.label}</span>
                    </span>
                    <el-tooltip
                        open-delay={100}
                        effect="dark"
                        ref="tooltip"
                        style="display:none"
                        content={this.tooltipContent}
                        placement="top-start"
                    ></el-tooltip>
                </span>
            );
        },
    },
    created() {
        this.activateTooltip = debounce(50, (tooltip) =>
            tooltip.handleShowPopper()
        );
    },
    mounted() {
        this.treeWidth = document.querySelector(".select-tree").offsetWidth;
    },
};
</script>

<style lang="scss">
.mat-sort-tree-api {
    .el-icon-success {
        color: #67c23a;
    }
    .custom-tree-node-reb {
        color: #ff4949;
    }
}
</style>
