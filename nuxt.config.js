const pkg = require('./package')
const properties = require('./properties')
const bodyParser = require('body-parser')
const session = require('express-session')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const context_path = process.env.DEPLOY_ENV !== 'local' ? properties.context_path : "/";

module.exports = {
  server: {
    port: process.env.DEPLOY_ENV === 'local' ? 3003 : 8080, // default: 3000
    host: '0.0.0.0', // default: localhost
  },
  env: {
    PACKAGE_VERSION: pkg.version,
    DEPLOY_ENV: process.env.DEPLOY_ENV,
    LOCAL_API: 'http://localhost:8080/adm-api',
    LOCAL_PREVIEW_API: 'http://211.23.162.191:8080',
    TEST_API: 'http://192.168.0.100:30088/adm-api',
    TEST_PREVIEW_API: 'http://211.23.162.191:8080',
    DEV_API: '/adm-api',
    DEV_PREVIEW_API: 'http://211.23.162.191:8080',
    SIT_API: properties.sit_api,
    SIT_PREVIEW_API: properties.sit_preview_api,
    IMAGE_TYPE:["jpg","image/jpeg","png","image/png"],
    PDF_TYPE:["pdf","application/pdf"]
  },

  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: '奧米科技 Armitech',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description', name: 'description', content: 'Vue Material Admin Template is a \n' +
          '    Google Material Design inspired admin dashboard template built with Vue and Vuetify.'
      }
    ],
    script: [
      { src: `${context_path === '/' ? '' : context_path}/ckeditor/ckeditor.js` }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/assets/logo.png' },
    ],
  },

  router: {
    middleware: 'authenticated',
    base: context_path
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3adced' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/main.css',
    '~/assets/style/googleapisIcon.css',
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    '~/plugins/registerCommonComponents.js',
    { src: '~/plugins/ckeditor.js' },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [],

  /*
  ** Build configuration
  */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    }
  },
  /*
  ** Generate configuration
  */
  generate: {
    dir:  process.env.DEPLOY_TARGET==='dist'?'../dist':'../back-end/yuantalife/src/main/webapp',
    fallback: true
  }
}
