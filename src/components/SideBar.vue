<template>
  <aside>
    
    <nuxt-link to="/" v-bind:class="{'active':(this.$route.name === 'index')}"><DashboardIcon /> Dashboard</nuxt-link>
    <a href="#"><NotificationIcon /> Notifications</a>
    <a href="#"><TasksIcon /> Tasks (24)</a>
    
  </aside>
</template>

<script>
import DashboardIcon from '~/components/atoms/icon-dashboard.vue'
import NotificationIcon from '~/components/atoms/icon-notification.vue'
import TasksIcon from '~/components/atoms/icon-tasks.vue'

export default {
  components: {
    DashboardIcon,
    NotificationIcon,
    TasksIcon
  }
}
</script>

<style lang="scss">
aside {
  position: fixed;
  left: 0;
  top: 72px;
  //width: 185px;
  height: calc(100vh - 72px);
  background-color: #FFFFFF;
  border: 1px solid #EAEDF3;
  border-top: none;
  padding: 28px 0;

  & > a {
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 14px 34px 14px 24px;
    text-decoration: none;
    color: #9EA5AB;
    font-size: 15px;
    line-height: 18px;
    font-weight: 600;

    & > svg {
      margin-right: 14px;
      width: 20px;
    }

    &.active {
      color: #372D2D;

      & > svg > path {
        stroke: #037EF3;
      }

    }

    &:hover {
      background-color: #F4F6FC;
    }
  }
}
</style>
