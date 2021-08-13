<template>
  <div class="crcc-table-main">
    <el-row>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="采购编号" width="120">
          <template slot-scope="{ row }">
            <a class="is-revert" href="#">{{ row.number }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="采购名称" />
        <el-table-column
          prop="company"
          label="采购单位"
          width="80"
          show-overflow-tooltip
        />
        <el-table-column prop="type" label="标的类型" width="80" />
        <el-table-column prop="bidding" label="招标方式" width="120" />
        <el-table-column prop="examine" label="审核方式" width="120" />
        <el-table-column prop="state" label="招标状态" width="120" />
        <el-table-column prop="supplier" label="投标供应商" width="120" />
        <el-table-column prop="company" label="经办人" width="120">
          <template slot-scope="{ row }">
            <el-popover
              placement="top"
              width="200"
              popper-class="table-tip-popover"
              trigger="hover"
            >
              <ul>
                <li v-for="item in row.people" :key="item.name">
                  <el-row>
                    <el-col :span="10">{{ item.name }}</el-col>
                    <el-col :span="14">{{ item.phone }}</el-col>
                  </el-row>
                </li>
              </ul>
              <div slot="reference">{{ row.people[0].name }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="招标状态" width="120" />
        <el-table-column prop="publicDate" label="发布时间" width="120" />
      </el-table>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          number: 'FDF-3443-34',
          name: '第二季度招标采购',
          company: '广发银行莱州卡',
          type: '服务',
          bidding: '公开招标',
          examine: '资格后审',
          state: '中标通知',
          supplier: '10',
          people: [
            {
              name: '王皓',
              phone: '18888888888'
            },
            {
              name: '张晓丽',
              phone: '18888888888'
            },
            {
              name: '高曲艺',
              phone: '18888888888'
            }
          ],
          date: '2016-05-03',
          publicDate: '2016-05-03'
        },

        {
          number: 'FDF-3443-34',
          name: '第二季度招标采购',
          company: '广发银行莱州卡',
          type: '服务',
          bidding: '公开招标',
          examine: '资格后审',
          state: '中标通知',
          supplier: '10',
          people: [
            {
              name: '王皓',
              phone: '18888888888'
            },
            {
              name: '张晓丽',
              phone: '18888888888'
            },
            {
              name: '高曲艺',
              phone: '18888888888'
            }
          ],
          date: '2016-05-03',
          publicDate: '2016-05-03'
        },
        {
          number: 'FDF-3443-34',
          name: '第二季度招标采购',
          company: '广发银行莱州卡',
          type: '服务',
          bidding: '公开招标',
          examine: '资格后审',
          state: '中标通知',
          supplier: '10',
          people: [
            {
              name: '王皓',
              phone: '18888888888'
            },
            {
              name: '张晓丽',
              phone: '18888888888'
            },
            {
              name: '高曲艺',
              phone: '18888888888'
            }
          ],
          date: '2016-05-03',
          publicDate: '2016-05-03'
        },
        {
          number: 'FDF-3443-34',
          name: '第二季度招标采购',
          company: '广发银行莱州卡',
          type: '服务',
          bidding: '公开招标',
          examine: '资格后审',
          state: '中标通知',
          supplier: '10',
          people: [
            {
              name: '王皓',
              phone: '18888888888'
            },
            {
              name: '张晓丽',
              phone: '18888888888'
            },
            {
              name: '高曲艺',
              phone: '18888888888'
            }
          ],
          date: '2016-05-03',
          publicDate: '2016-05-03'
        },
        {
          number: 'FDF-3443-34',
          name: '第二季度招标采购',
          company: '广发银行莱州卡',
          type: '服务',
          bidding: '公开招标',
          examine: '资格后审',
          state: '中标通知',
          supplier: '10',
          people: [
            {
              name: '王皓',
              phone: '18888888888'
            },
            {
              name: '张晓丽',
              phone: '18888888888'
            },
            {
              name: '高曲艺',
              phone: '18888888888'
            }
          ],
          date: '2016-05-03',
          publicDate: '2016-05-03'
        },
        {
          number: 'FDF-3443-34',
          name: '第二季度招标采购',
          company: '广发银行莱州卡',
          type: '服务',
          bidding: '公开招标',
          examine: '资格后审',
          state: '中标通知',
          supplier: '10',
          people: [
            {
              name: '王皓',
              phone: '18888888888'
            },
            {
              name: '张晓丽',
              phone: '18888888888'
            },
            {
              name: '高曲艺',
              phone: '18888888888'
            }
          ],
          date: '2016-05-03',
          publicDate: '2016-05-03'
        },
        {
          number: 'FDF-3443-34',
          name: '第二季度招标采购',
          company: '广发银行莱州卡',
          type: '服务',
          bidding: '公开招标',
          examine: '资格后审',
          state: '中标通知',
          supplier: '10',
          people: [
            {
              name: '王皓',
              phone: '18888888888'
            },
            {
              name: '张晓丽',
              phone: '18888888888'
            },
            {
              name: '高曲艺',
              phone: '18888888888'
            }
          ],
          date: '2016-05-03',
          publicDate: '2016-05-03'
        },
        {
          number: 'FDF-3443-34',
          name: '第二季度招标采购',
          company: '广发银行莱州卡',
          type: '服务',
          bidding: '公开招标',
          examine: '资格后审',
          state: '中标通知',
          supplier: '10',
          people: [
            {
              name: '王皓',
              phone: '18888888888'
            },
            {
              name: '张晓丽',
              phone: '18888888888'
            },
            {
              name: '高曲艺',
              phone: '18888888888'
            }
          ],
          date: '2016-05-03',
          publicDate: '2016-05-03'
        }
      ],
      multipleSelection: []
    }
  },

  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>
.crcc-table-main {
  padding: 10px;
}
ul {
  padding: 0;
  list-style: none;
  li {
  }
}
</style>
