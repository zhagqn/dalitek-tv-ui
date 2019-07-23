<template>
  <div class="__bg-video">
    <video v-show="playState" ref="player" :width="width" :height="height" loop></video>
  </div>
</template>
<script>
export default {
  name: "TvcBgVideo",
  props: {
    type: {
      // global or page
      default: "page"
    },
    include: {
      type: Array
    },
    exclude: {
      type: Array
    },
    url: {
      default: "",
      required: true
    },
    width: {
      default: 1920,
      type: Number
    },
    height: {
      default: 1080,
      type: Number
    }
  },
  data() {
    return {
      blobUrl: "",
      playState: false,
      currentTime: 0
    };
  },
  async mounted() {
    await this.getBlobUrl();
    this.setPlayState();
  },
  computed: {
    router() {
      return this.$route.name;
    }
  },
  watch: {
    router() {
      this.setPlayState();
    }
  },
  methods: {
    setPlayState() {
      if (this.type === "page") {
        this.play();
      } else {
        let router = this.router;
        let { include, exclude } = this;
        if (include) {
          if (include.includes(router)) {
            this.play();
          } else {
            this.stop();
          }
        }
        if (exclude) {
          if (include.includes(router)) {
            this.stop();
          } else {
            this.play();
          }
        }
      }
    },
    getBlobUrl() {
      return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open("GET", this.url, true);
        req.withCredentials = false;
        req.responseType = "blob";
        let that = this;
        req.onload = function() {
          if (this.status === 200) {
            let videoBlob = this.response;
            let blobSrc = URL.createObjectURL(videoBlob);
            that.blobUrl = blobSrc;
            console.log(that.blobUrl);
            resolve();
          } else {
            reject();
          }
        };
        req.onerror = function() {
          reject();
        };
        req.send();
      });
    },
    async play() {
      if (!this.playState) {
        this.$nextTick(() => {
          this.$refs.player.src = this.blobUrl;
          this.$refs.player.play();
          this.$refs.player.currentTime = this.currentTime;
          this.$refs.player.onplay = () => {
            this.playState = true;
          };
        });
      }
    },
    stop() {
      if (this.$refs.player) {
        this.currentTime = this.$refs.player.currentTime;
      }
      this.playState = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.__bg-video {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1000;
  video {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>