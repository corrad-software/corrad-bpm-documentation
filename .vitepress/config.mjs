import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CORRAD Business Process Maker",
  description: "Comprehensive documentation for CORRAD BPM platform - Process Builder, Form Builder, and Execution Engine",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Overview', link: '/overview/project-overview' },
      { text: 'Process Builder', link: '/process-builder/user-guide' },
      { text: 'Form Builder', link: '/form-builder/user-guide' },
      { text: 'Process Execution', link: '/process-execution/user-guide' }
    ],

    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Project Overview', link: '/overview/project-overview' },
          { text: 'Architecture', link: '/overview/architecture' },
          { text: 'Development Guide', link: '/overview/development-guide' }
        ]
      },
      {
        text: 'Process Builder',
        items: [
          { text: 'User Guide', link: '/process-builder/user-guide' },
          { text: 'Technical Guide', link: '/process-builder/technical-guide' },
          { text: 'Roadmap', link: '/process-builder/roadmap' }
        ]
      },
      {
        text: 'Form Builder',
        items: [
          { text: 'User Guide', link: '/form-builder/user-guide' },
          { text: 'Technical Guide', link: '/form-builder/technical-guide' },
          { text: 'JavaScript API Reference', link: '/form-builder/javascript-api' },
          { text: 'Grid System Guide', link: '/form-builder/grid-system' },
          { text: 'Form History System', link: '/form-builder/form-history-system' },
          { text: 'Changelog', link: '/form-builder/changelog' },
          { text: 'Roadmap', link: '/form-builder/roadmap' }
        ]
      },
      {
        text: 'Process Execution',
        items: [
          { text: 'User Guide', link: '/process-execution/user-guide' },
          { text: 'Technical Guide', link: '/process-execution/technical-guide' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'CORRAD Business Process Maker Documentation',
      copyright: 'Copyright © 2024 CORRAD Team'
    }
  }
})
