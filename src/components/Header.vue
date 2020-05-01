<template>
  <header>
    <div class="left-side">

      <nuxt-link class="logo" to="/"><Logo /></nuxt-link>
      <a href="#" class="menu-icon"><MenuIcon /></a>

    </div>
    <div class="center-side">

      <div class="dropdown selectbox">
        <a href="#">Jump to...</a>
      </div>

    </div>
    <div class="right-side">

      <a href="#">
        <ProfilePic class="profile-pic" firstName="Bilal" lastName="TAS" email="bilaltas@me.com" />
        <ChevronDownIcon />
      </a>

    </div>
  </header>
</template>

<script>
import Logo from '~/components/Logo.vue'
import ProfilePic from '~/components/atoms/profile-pic.vue'

import MenuIcon from '~/components/atoms/icon-menu.vue'
import ChevronDownIcon from '~/components/atoms/icon-chevron-down.vue'

export default {
  components: {
    Logo,
    MenuIcon,
    ProfilePic,
    ChevronDownIcon
  }
}
</script>

<style lang="scss">
header {
  background-color: #232830;
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  color: #9EA5AB;
  border: 1px solid #EAEDF3;

  a {
    color: #9EA5AB;
    text-decoration: none;

    &:hover {
      color: #037EF3;

      svg > rect {
        fill: #037EF3;
      }

    }

  }

  & > * {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    & > * {
      margin-right: 24px;
    }

  }

  &.dark {

    a {
      color: #9EA5AB;
      text-decoration: none;

      &:hover {
        color: white;

        svg > rect {
          fill: white;
        }

      }

    }

  }

  .logo, .menu-icon {
    display: block;

    & > svg {
      display: block;
    }

  }

  .profile-pic {
    margin-right: 10px;
  }

}
</style>
