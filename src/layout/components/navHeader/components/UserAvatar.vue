<!--
 * @Author: genfa.zeng
 * @Date: 2021-04-01 15:44:08
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2021-04-01 17:47:35
 * @Description: 用户信息组件
-->
<template>
  <div class="user-avatar">
    <el-dropdown trigger="click">
      <span class="dropdown-link">
        <div class="dropdown-link__img">
          <img src="../../../../assets/imgs/user/user.png" alt="头像" />
        </div>
      </span>
      <template #dropdown>
        <el-dropdown-menu class="dropdown-menu">
          <div class="user-info">
            <div class="user-info__avatar" title="点击修改头像">
              <img src="../../../../assets/imgs/user/user.png" alt="头像" />
            </div>
            <div class="user-info__username">十指流光</div>
            <img class="user-info__corner" src="../../../../assets/imgs/user/corner.png" />
          </div>
          <ul class="dropdown-box">
            <li class="dropdown-box__password">
              <i class="iconfont iconmima1"></i>
              <span>个人中心</span>
            </li>
            <li class="dropdown-box__account">
              <i class="iconfont icontuichu"></i>
              <span>退出账户</span>
            </li>
          </ul>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'UserAvatar',
})
</script>

<style lang="scss" scoped>
.user-avatar {
  height: 40px;
}
.dropdown-link {
  cursor: pointer;
  &__img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
  }
}
.dropdown-menu {
  width: 326px;
  background-color: none;
  background: transparent;
  margin-bottom: 0;
  padding-bottom: 0;
  border: none;
}
.user-info {
  @include flex(row, null, center);
  background-image: url('@/assets/imgs/user/user-bg.png');
  background-size: 100% 100%;
  transform: translateY(-10px);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 35px 20px 25px 30px;
  z-index: 100;
  position: relative;
  &__corner {
    position: absolute;
    left: 282px;
    top: -9px;
    width: 27px;
    height: 10px;
  }
  &__avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    &:hover {
      .mask {
        opacity: 1;
      }
    }
  }
  &__username {
    margin-left: 20px;
    color: #fff;
    margin-bottom: 10px;
    font-size: 16px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
  }
}
.dropdown-box {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 35px;
  height: 122px;
  color: #596c8e;
  font-size: 14px;
  background: white;
  margin-top: -10px;
  &__password {
    i {
      font-size: 18px;
    }
  }
  &__account {
    i {
      font-size: 20px;

      margin-left: -2px;
    }
  }
  li {
    vertical-align: middle;
    cursor: pointer;
    @include flex(row, flex-start, center);
    i {
      margin-right: 10px;
    }
    &:nth-child(1) {
      margin-top: 20px;
    }
    &:nth-child(2) {
      margin-bottom: 20px;
    }
    &:hover {
      color: $theme !important;
      i {
        color: $theme !important;
      }
    }
  }
}
</style>
