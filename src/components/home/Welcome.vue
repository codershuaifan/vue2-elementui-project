<template>
  <div>
    <!-- 上一层 -->
    <el-row :gutter="20">
      <!-- 介绍界面 -->
      <el-col :span="5">
        <div>
          <img src="../../image/home/35黄帆.jpg" alt="" class="imgtwo" />
          <div class="de"></div>
          <!-- 分割线 -->
          <!-- <el-divider></el-divider> -->
          <!-- 介绍框 -->
          <el-descriptions direction="vertical" :column="2" border>
            <el-descriptions-item label="英文名"
              >BugShuaiFan</el-descriptions-item
            >
            <el-descriptions-item label="手机号"
              >***********</el-descriptions-item
            >
            <el-descriptions-item label="居住地">盐城市</el-descriptions-item>
            <el-descriptions-item label="备注">
              <el-tag size="small">学校</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="联系地址"
              >火星八号舰队天河1922114号</el-descriptions-item
            >
          </el-descriptions>
        </div>
      </el-col>
      <!-- 轮播图 -->
      <el-col :span="15">
        <el-carousel height="450px" arrow="always" indicator-position="outside">
          <el-carousel-item v-for="(item, index) in turn" :key="index">
            <img :src="item" alt="" class="imgone" />
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <!-- 玩具 -->
      <el-col :span="4">
        <el-progress
          :text-inside="true"
          :stroke-width="26"
          :percentage="70"
          style="margin-top:40px;"
        ></el-progress>
        <el-progress
          :text-inside="true"
          :stroke-width="24"
          :percentage="100"
          status="success"
        ></el-progress>
        <el-progress
          :text-inside="true"
          :stroke-width="22"
          :percentage="80"
          status="warning"
        ></el-progress>
        <el-progress
          :text-inside="true"
          :stroke-width="20"
          :percentage="50"
          status="exception"
        ></el-progress>
        <el-progress
          style="margin-top:60px;margin-left:20px;"
          type="dashboard"
          :percentage="percentage"
          :color="colors"
        ></el-progress>
        <div>
          <el-button-group style="margin-left:20px;">
            <el-button icon="el-icon-minus" @click="decrease"></el-button>
            <el-button icon="el-icon-plus" @click="increase"></el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <!-- 下一层 -->
    <el-row>
      <!-- echarts图表 -->
      <el-col :span="20">
        <div
          id="main"
          style="width: 100%; height: calc(100vh - 550px); margin-top: 20px"
        ></div>
      </el-col>
      <el-col :span="4">
        <el-card class="cardone">
          项目开发进程图表
          <el-rate v-model="value" show-text> </el-rate>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      // 轮播图数据
      turn: [
        require("../../image/home/turn1.png"),
        require("../../image/home/turn2.png"),
        require("../../image/home/turn3.png"),
        require("../../image/home/turn4.png"),
      ],
      options: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        legend: {
          data: ["completed", "finished"],
        },
        xAxis: [
          {
            type: "category",
            data: [
              "11.27",
              "12.5",
              "12.6",
              "12.7",
              "12.8",
              "12.9",
              "12.14",
              "12.19",
              "12.20",
              "12.21",
              "12.22",
              "12.23",
              "12.26",
              "12.27",
              "12.28",
              "12.29",
            ],
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Page",
            min: 50,
            max: 208,
            interval: 20,
            axisLabel: {
              formatter: "{value} p",
            },
          },
        ],
        series: [
          {
            name: "completed",
            type: "bar",
            data: [
              1, 73, 86, 95, 95, 106, 118, 129, 140, 155, 166, 175, 188, 200,
              208, 208,
            ],
          },
          {
            name: "finished",
            type: "line",
            data: [
              1, 73, 86, 95, 95, 106, 118, 129, 140, 155, 166, 175, 188, 200,
              208, 208,
            ],
          },
        ],
      },
      value: null,
      // 仪表盘数据
      percentage: 70,
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
    };
  },
  mounted() {
    var chartDom = document.getElementById("main");
    var myChart = echarts.init(chartDom);
    myChart.setOption(this.options);
  },
  methods: {
    increase() {
      this.percentage += 10;
      if (this.percentage > 100) {
        this.percentage = 100;
      }
    },
    decrease() {
      this.percentage -= 10;
      if (this.percentage < 0) {
        this.percentage = 0;
      }
    },
  },
};
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 450px;
  margin: 0;
}
.el-carousel__item:nth-child(2n) {
  height: 450px;
}
.el-carousel__item:nth-child(2n + 1) {
  height: 450px;
}
.el-carousel {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.imgone {
  height: 450px;
}
.cardone {
  height: 130px;
  margin-top: 80px;
}
.el-rate {
  margin-top: 30px;
  margin-left: 10px;
}
.imgtwo {
  height: 150px;
  width: 150px;
  border-radius: 100%;
  margin-left: 30px;
  margin-bottom: 10px;
}
.de {
  height: 20px;
  width: 100%;
  border-top: 2px solid black;
}
.el-progress{
  margin-top:15px;
}
</style>