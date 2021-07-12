<template>
  <div>
    <el-row style="padding: 10px">
      <span>流程测试</span>
    </el-row>
    <el-table :data="orderList" style="width: 1000px;" stripe highlight-current-row>
      <el-table-column prop="orderCode" label="订单编号"></el-table-column>
      <el-table-column prop="orderName" width="120" label="订单名称"></el-table-column>
      <el-table-column prop="quantity" label="采购数量"></el-table-column>
      <el-table-column prop="procInstanceId" label="流程实例"></el-table-column>
      <el-table-column prop="state" label="审核状态">
        <template slot-scope="{ row }">
          <el-select v-model="row.state" placeholder="请选择" disabled>
            <el-option
              v-for="item in orderStates"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column width="400" label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" @click="sendAudit(row)">提交</el-button>
          <el-button type="text" @click="showFlow(row)">查看</el-button>
          <el-button type="text" @click="showLog(row)">记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <flow-viewer ref="fvr"></flow-viewer>
    <task-process-log ref="taskLog"></task-process-log>
  </div>
</template>

<script>
import OrderService from "./order-demo-service";
import FlowViewer from "@/views/task-list/src/components/flow-viewer";
import TaskProcessLog from "@/views/task-process-log";

export default {
  name: "TestDemo",

  components: {
    FlowViewer,
    TaskProcessLog
  },

  data() {
    return {
      orderStates: [
        {
          value: "0",
          label: "制单"
        },
        {
          value: "1",
          label: "审批中"
        },
        {
          value: "2",
          label: "审批通过"
        },
        {
          value: "3",
          label: "驳回"
        }
      ],

      orderList: [
        { orderCode: "1", orderName: "订单1", quantity: 100, state: "0" },
        {
          orderCode: "2",
          orderName: "订单2",
          quantity: 100,
          procInstanceId: "",
          state: "1"
        },
        {
          orderCode: "3",
          orderName: "订单3",
          quantity: 100,
          procInstanceId: "",
          state: "2"
        },
        { orderCode: "4", orderName: "订单4", quantity: 100, state: "3" }
      ]
    };
  },

  methods: {
    sendAudit(row) {
      var procKey = prompt("请输入流程定义标识", "");

      OrderService.sendAudit(procKey)
        .then(res => {
          row.procInstanceId = res;
          row.state = "1";
          this.info("提交成功，实例id:" + res);
        })
        .catch(err => this.error(err.message[0]));
    },

    showFlow(row) {
      this.$refs.fvr.open(row.procInstanceId);
    },

    showLog(row) {
      this.$refs.taskLog.open(row.procInstanceId);
    }
  }
};
</script>