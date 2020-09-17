<template>
  <div>
    <ckeditor
      v-model="editorData"
      :config="editorConfig"
      :disabled="true"
      @ready="onReady"
      @blur="onBlur"
    ></ckeditor>
    <div style="color:red" v-if="valid && required">↑不能為空</div>
  </div>
</template>

<script>
import uri from "@/api/uri";
import axios from "@/util/axios";
export default {
  components: {},
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    contents: {
      type: String,
      default: ""
    },
    valid: {
      type: Boolean,
      default: false
    }
  },
  data: vm => ({
    editorData: "",
    down: false,
    editorConfig: {
      filebrowserBrowseUrl: `/audit/ckeditorFile`,
      filebrowserUploadUrl:
        `${axios.defaults.baseURL}` + uri.api_upload_resources,
      fileTools_requestHeaders: {
        Authorization:
          "Bearer " + JSON.parse(window.sessionStorage.getItem("token"))
      },
      allowedContent: true
    },
    required: false
  }),
  methods: {
    onBlur() {
      if (this.valid && this.editorData === "") {
        this.required = true;
      } else {
        this.required = false;
      }
    },
    onReady(editor) {
      // this.target=editor
      // editor.ui
      //   .getEditableElement()
      //   .parentElement.insertBefore(
      //     editor.ui.view.toolbar.element,
      //     editor.ui.getEditableElement()
      //   );
      if (
        this.contents != null &&
        this.contents != undefined &&
        this.contents != ""
      ) {
        this.editorData = JSON.parse(JSON.stringify(this.contents));
      }
      this.down = true;
    }
  },
  watch: {
    editorData() {
      this.$emit(
        "getData",
        // this.editorData.replace(/\s/g, "").replace("↵", "")
        this.editorData.replace("↵", "")
      );
    },
    contents() {
      if (this.down) {
        if (
          this.contents != null &&
          this.contents != undefined &&
          this.contents != ""
        ) {
          this.editorData = JSON.parse(JSON.stringify(this.contents));
        } else {
          this.editorData = "";
        }
      }
    }
  },
  created() {},
  mounted() {}
};
</script>

<style scoped>
.ck-editor__editable {
  min-height: 200px;
  border: 1px solid #ccc !important;
  background-color: #ffffff;
}

.ck-toolbar {
  width: 1000px;
}
</style>
