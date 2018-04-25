<template lang='pug'>
  div
    pre {{ HTML }}
    tinymce(
      id='d1'
      ref='tm'
      v-model='HTML'
      :toolbar1='editorToolbar'
      :plugins='editorPlugins'
      :other_options='editorOptions')
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    value: String
  },
  data () {
    return {
      editorToolbar:
        'formatselect | sizeselect | fontselect | fontsizeselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat',
      editorPlugins: [
        'advlist autolink lists link image charmap preview hr anchor',
        'searchreplace wordcount fullscreen visualblocks ',
        'insertdatetime media table contextmenu directionality',
        'paste textcolor colorpicker textpattern imagetools  help emoticons hr'
      ],
      editorOptions: {
        images_upload_handler: (blobInfo, success, failure) => {
          this.loadFiles(blobInfo.blob())
            .then(url => {
              success(url)
            })
            .catch(e => {
              failure('Ошибка: ' + e)
            })
        },
        fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
        lineheight_formats:
          '8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 36pt',
        font_formats:
          'Arial=arial,helvetica,sans-serifCourier New=courier new,courierHelvetica=helveticaTimes New Roman=times new roman,times',
        content_css:
          'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
        schema: 'html5',
        valid_elements: '*[*]'
      }
    }
  },

  computed: {
    HTML: {
      get () {
        return this.value
      },
      set: function (val) {
        this.$emit('changeHTML', val)
      }
    }
  },

  methods: {
    ...mapActions(['loadFiles'])
  }
}
</script>