<template>
  <ht-sidenav :sidenav-object="sidenavObject"></ht-sidenav>
</template>
<script>
export default {
  name: "TheSidenav",
  data() {
    return {
      sidenavObject: {
        title: "VUS",
        links: [{ id: 1, url: "/", label: "Home" }],
      },
    };
  },
};
</script>
