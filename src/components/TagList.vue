<template>
  <ul class="tag-list pb-2 mb-1">
    <li v-for="(tag, index) of tags" :key="tag + index">
      <tag :name="tag" className="tag-default tag-pill tag-outline"> </tag>
    </li>
  </ul>
</template>

<script>
import Tag from "@/components/VTag";

export default {
  name: "TagList",
  props: {
    tags: Array
  },
  components: {
    Tag
  }
};
</script>

<style>
.tag-default {
  color: #fff !important;
  font-size: 0.8rem;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  white-space: nowrap;
  margin-right: 3px;
  margin-bottom: 0.2rem;
  display: inline-block;
}
.tag-default:hover {
  text-decoration: none;
}
.tag-default.tag-outline {
  border: 1px solid #ddd;
  color: #aaa !important;
  background: 0 0 !important;
}
ul.tag-list {
  padding-left: 0 !important;
  display: inline-block;
  list-style: none !important;
}
ul.tag-list li {
  display: inline-block !important;
}
.tag {
  position: relative;
  top: -1px;
}
a.tag:focus,
a.tag:hover {
  color: #fff;
  text-decoration: none;
  cursor: pointer;
}
.tag-pill {
  padding-right: 0.6em;
  padding-left: 0.6em;
  border-radius: 10rem;
}
.tag-default {
  background-color: #818a91;
}
.tag-default[href]:focus,
.tag-default[href]:hover {
  background-color: #687077;
}
.tag-primary {
  background-color: #5cb85c;
}
.tag-primary[href]:focus,
.tag-primary[href]:hover {
  background-color: #449d44;
}
.tag-success {
  background-color: #5cb85c;
}
.tag-success[href]:focus,
.tag-success[href]:hover {
  background-color: #449d44;
}
.tag-info {
  background-color: #5bc0de;
}
.tag-info[href]:focus,
.tag-info[href]:hover {
  background-color: #31b0d5;
}
.tag-warning {
  background-color: #f0ad4e;
}
.tag-warning[href]:focus,
.tag-warning[href]:hover {
  background-color: #ec971f;
}
.tag-danger {
  background-color: #b85c5c;
}
.tag-danger[href]:focus,
.tag-danger[href]:hover {
  background-color: #9d4444;
}
</style>
