<template>
  <ht-sidenav-collapsible
    :sidenav-object="sidenavObject"
  ></ht-sidenav-collapsible>
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
