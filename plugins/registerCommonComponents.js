import Vue from 'vue'
import kebabCase from 'lodash/kebabCase'

/**
 * requrie.context(
 *   directory,
 *   useSubdirectories = true,
 *   regExp
 * )
 */

const requireModule = require.context(
  '~/components/common-widgets',
  false,
  /\.vue$/
)

requireModule
  .keys()
  .forEach((fileName) => {
    const componentName = kebabCase(
      fileName.replace(/\.\/(.+)(\.vue$)/g, '$1')
    )
    const componentConfig = requireModule(fileName)

    Vue.component(componentName, componentConfig.default || componentConfig)
  })
